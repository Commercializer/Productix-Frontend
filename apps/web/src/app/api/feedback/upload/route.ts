/* ─────────────────────────────────────────────
 * POST /api/feedback/upload — Public image upload
 *
 * Unauthenticated upload used by image-type custom
 * fields on the public Feedback sheet. Accepts a
 * single multipart "file" of type image/* up to 5MB
 * and returns the public R2 URL. Stored in a dedicated
 * "feedback-uploads" folder so submissions can be
 * audited or expired separately from authored media.
 * ──────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { uploadToR2, isAllowedImage } from "@/lib/r2";

const MAX_FEEDBACK_IMAGE_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const contentType = file.type;
    if (!isAllowedImage(contentType)) {
      return NextResponse.json(
        { error: `Unsupported image type "${contentType}". Allowed: JPG, PNG, GIF, WebP, SVG.` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FEEDBACK_IMAGE_SIZE) {
      return NextResponse.json(
        { error: `Image too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum is 5MB.` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const result = await uploadToR2(buffer, file.name, contentType, "feedback-uploads");

    return NextResponse.json({
      url: result.url,
      key: result.key,
      name: file.name,
      size: file.size,
      type: contentType,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Upload failed";
    console.error("[feedback/upload] R2 upload failed:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
