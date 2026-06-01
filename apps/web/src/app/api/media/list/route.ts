/* ─────────────────────────────────────────────
 * GET /api/media/list - List the current user's media
 *
 * Returns only media uploaded by the authenticated user
 * (per-user isolation). Optional query params:
 *   - profileId: when provided with scope=product, only
 *     returns assets uploaded for that product page.
 *   - scope: "product" (default when profileId given) or
 *     "user" (all of the user's uploads, any product).
 *   - type:  "image" | "audio" | "document" filter.
 * ──────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@productix/db";
import type { MediaAssetType, Prisma } from "@prisma/client";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const TYPE_MAP: Record<string, MediaAssetType> = {
  image: "IMAGE",
  audio: "AUDIO",
  document: "DOCUMENT",
};

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const profileIdRaw = searchParams.get("profileId");
  const profileId =
    profileIdRaw && UUID_RE.test(profileIdRaw) ? profileIdRaw : null;
  // Default to product scope when we have a product context, otherwise show
  // all of the user's uploads.
  const scope = searchParams.get("scope") ?? (profileId ? "product" : "user");
  const typeParam = searchParams.get("type");

  const where: Prisma.MediaAssetWhereInput = {
    userId: session.user.id,
  };
  if (scope === "product" && profileId) {
    where.productProfileId = profileId;
  }
  if (typeParam && TYPE_MAP[typeParam]) {
    where.mediaType = TYPE_MAP[typeParam];
  }

  try {
    const assets = await prisma.mediaAsset.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 500,
      select: {
        id: true,
        url: true,
        r2Key: true,
        name: true,
        size: true,
        mimeType: true,
        mediaType: true,
        width: true,
        height: true,
        duration: true,
        createdAt: true,
        productProfileId: true,
      },
    });

    const items = assets.map((a) => ({
      id: a.id,
      url: a.url,
      r2Key: a.r2Key,
      name: a.name,
      size: a.size,
      type: a.mimeType,
      mediaType: a.mediaType.toLowerCase() as "image" | "audio" | "document",
      width: a.width,
      height: a.height,
      duration: a.duration,
      createdAt: a.createdAt.toISOString(),
      productProfileId: a.productProfileId,
    }));

    return NextResponse.json({ items });
  } catch (error: any) {
    console.error("[media/list] Failed to list media:", error);
    return NextResponse.json(
      { error: error.message || "Failed to list media" },
      { status: 500 }
    );
  }
}
