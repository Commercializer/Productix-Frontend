/* ─────────────────────────────────────────────
 * POST /api/media/delete - Delete media from R2
 *
 * Accepts JSON { key: string } and deletes the
 * corresponding object from the R2 bucket.
 * ──────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { deleteFromR2 } from "@/lib/r2";

export async function POST(request: NextRequest) {
  // ── Auth ──
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

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

    await deleteFromR2(key);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[media/delete] R2 delete failed:", error);
    return NextResponse.json(
      { error: error.message || "Delete failed" },
      { status: 500 }
    );
  }
}
