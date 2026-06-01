/* ─────────────────────────────────────────────
 * POST /api/media/delete - Delete media from R2
 *
 * Accepts JSON { key: string } and deletes the
 * corresponding object from the R2 bucket.
 * ──────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@productix/db";
import { deleteFromR2 } from "@/lib/r2";

export async function POST(request: NextRequest) {
  // ── Auth ──
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const body = await request.json();
    const key = body?.key as string;

    if (!key || typeof key !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'key' field" },
        { status: 400 }
      );
    }

    // Safety: only allow deleting from known prefixes
    if (!key.startsWith("images/") && !key.startsWith("audio/") && !key.startsWith("media/")) {
      return NextResponse.json(
        { error: "Invalid key prefix" },
        { status: 400 }
      );
    }

    // Ownership: a user may only delete their own media. If the asset is
    // recorded in the DB, it must belong to this user. Assets with no DB row
    // (legacy uploads from before the registry) fall back to prefix-only safety.
    const asset = await prisma.mediaAsset.findUnique({
      where: { r2Key: key },
      select: { id: true, userId: true },
    });
    if (asset && asset.userId !== userId) {
      return NextResponse.json(
        { error: "You do not have permission to delete this file" },
        { status: 403 }
      );
    }

    await deleteFromR2(key);

    if (asset) {
      await prisma.mediaAsset.delete({ where: { id: asset.id } });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[media/delete] R2 delete failed:", error);
    return NextResponse.json(
      { error: error.message || "Delete failed" },
      { status: 500 }
    );
  }
}
