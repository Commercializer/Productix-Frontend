/* ─────────────────────────────────────────────
 * POST /api/media/upload - Upload media to R2
 *
 * Accepts multipart/form-data with a single "file"
 * field. Returns the public R2 URL + key.
 * ──────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@productix/db";
import {
  uploadToR2,
  isAllowedImage,
  isAllowedAudio,
  isAllowedDocument,
  MAX_IMAGE_SIZE,
  MAX_AUDIO_SIZE,
  MAX_DOCUMENT_SIZE,
} from "@/lib/r2";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest) {
  // ── Auth ──
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Optional product context: the profile (page) the asset is uploaded for.
    // Used to scope the editor's media library to a single product.
    const profileIdRaw = formData.get("profileId");
    const profileId =
      typeof profileIdRaw === "string" && UUID_RE.test(profileIdRaw)
        ? profileIdRaw
        : null;

    const contentType = file.type;
    const isImage = isAllowedImage(contentType);
    const isAudio = isAllowedAudio(contentType);
    const isDocument = isAllowedDocument(contentType);

    if (!isImage && !isAudio && !isDocument) {
      return NextResponse.json(
        {
          error: `Unsupported file type "${contentType}". Allowed: JPG, PNG, GIF, WebP, SVG, ICO, MP3, WAV, OGG, AAC, WebM, PDF.`,
        },
        { status: 400 }
      );
    }

    // Size limits
    const maxSize = isImage
      ? MAX_IMAGE_SIZE
      : isAudio
        ? MAX_AUDIO_SIZE
        : MAX_DOCUMENT_SIZE;
    const kind = isImage ? "images" : isAudio ? "audio" : "documents";
    const label = isImage ? "10MB" : "25MB";

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum for ${kind} is ${label}.`,
        },
        { status: 400 }
      );
    }

    // Resolve the owning company from the product (if a product context was
    // given and the profile actually exists). Used for account-level queries;
    // the asset stays user-scoped regardless.
    let companyId: string | null = null;
    if (profileId) {
      const profile = await prisma.productProfile.findUnique({
        where: { id: profileId },
        select: { product: { select: { companyId: true } } },
      });
      companyId = profile?.product.companyId ?? null;
    }

    // Upload to R2
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const folder = isImage ? "images" : isAudio ? "audio" : "documents";
    const result = await uploadToR2(buffer, file.name, contentType, folder);

    const mediaType = isImage ? "image" : isAudio ? "audio" : "document";

    // Record the asset so the editor's media library can scope to this user
    // (and product). Non-fatal: the R2 upload already succeeded, so a DB hiccup
    // shouldn't fail the upload — the file just won't appear in the library.
    let assetId: string | null = null;
    let createdAt = new Date().toISOString();
    try {
      const asset = await prisma.mediaAsset.create({
        data: {
          userId,
          companyId,
          productProfileId: profileId,
          r2Key: result.key,
          url: result.url,
          name: file.name,
          size: file.size,
          mimeType: contentType,
          mediaType: isImage ? "IMAGE" : isAudio ? "AUDIO" : "DOCUMENT",
        },
        select: { id: true, createdAt: true },
      });
      assetId = asset.id;
      createdAt = asset.createdAt.toISOString();
    } catch (dbError) {
      console.error("[media/upload] Failed to record MediaAsset:", dbError);
    }

    return NextResponse.json({
      id: assetId,
      url: result.url,
      key: result.key,
      name: file.name,
      size: file.size,
      type: contentType,
      mediaType,
      createdAt,
    });
  } catch (error: any) {
    console.error("[media/upload] R2 upload failed:", error);
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}
