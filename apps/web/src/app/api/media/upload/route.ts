/* ─────────────────────────────────────────────
 * POST /api/media/upload - Upload media to R2
 *
 * Accepts multipart/form-data with a single "file"
 * field. Returns the public R2 URL + key.
 * ──────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  uploadToR2,
  isAllowedImage,
  isAllowedAudio,
  MAX_IMAGE_SIZE,
  MAX_AUDIO_SIZE,
} from "@/lib/r2";

export async function POST(request: NextRequest) {
  // ── Auth ──
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const contentType = file.type;
    const isImage = isAllowedImage(contentType);
    const isAudio = isAllowedAudio(contentType);

    if (!isImage && !isAudio) {
      return NextResponse.json(
        {
          error: `Unsupported file type "${contentType}". Allowed: JPG, PNG, GIF, WebP, SVG, ICO, MP3, WAV, OGG, AAC, WebM.`,
        },
        { status: 400 }
      );
    }

    // Size limits
    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_AUDIO_SIZE;
    const label = isImage ? "10MB" : "25MB";

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum for ${isImage ? "images" : "audio"} is ${label}.`,
        },
        { status: 400 }
      );
    }

    // Upload to R2
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const folder = isImage ? "images" : "audio";
    const result = await uploadToR2(buffer, file.name, contentType, folder);

    return NextResponse.json({
      url: result.url,
      key: result.key,
      name: file.name,
      size: file.size,
      type: contentType,
      mediaType: isImage ? "image" : "audio",
    });
  } catch (error: any) {
    console.error("[media/upload] R2 upload failed:", error);
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}
