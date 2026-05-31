// ─────────────────────────────────────────────────────────────
// Visit-duration beacon. The public page client `sendBeacon`s here on
// tab-hide / unload with the cumulative foreground time on the page. We
// re-derive the same privacy-preserving (visitor, page, day) identity used by
// the page-view tracker and update that row's `duration_ms`.
//
// No auth: it's a public, fire-and-forget beacon. It can only ever update an
// existing page-view row keyed by an opaque hash, so there's nothing to leak
// and nothing an attacker gains by forging one (worst case: their own session
// length is inflated, bounded by MAX_DURATION_MS).
// ─────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { readViewContext, recordViewDuration } from "@/lib/analytics/track-page-view";

export async function POST(request: Request) {
  try {
    const context = await readViewContext();

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return new NextResponse(null, { status: 204 });
    }

    const { productProfileId, durationMs } =
      (body as { productProfileId?: unknown; durationMs?: unknown }) ?? {};

    if (typeof productProfileId === "string" && typeof durationMs === "number") {
      await recordViewDuration({ productProfileId, durationMs, context });
    }
  } catch (err) {
    console.error("[api/analytics/duration] failed", err);
  }

  // Always 204 - beacons ignore the body, and we never want a visitor's tab to
  // see an error from analytics.
  return new NextResponse(null, { status: 204 });
}
