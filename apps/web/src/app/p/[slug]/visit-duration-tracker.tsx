"use client";

import { useEffect } from "react";

// ─────────────────────────────────────────────────────────────
// Measures how long the visitor actively spends on the page and beacons it to
// /api/analytics/duration. "Active" = foreground only: a backgrounded tab
// stops accumulating, so a page left open behind other tabs doesn't inflate
// the average. Renders nothing.
//
// We use a single accumulator and recompute it on every visibility flip and on
// pagehide. Each beacon carries the cumulative active ms, which only grows, so
// the server's GREATEST merge keeps the longest session even if some beacons
// are dropped (sendBeacon is best-effort).
// ─────────────────────────────────────────────────────────────

export function VisitDurationTracker({ productProfileId }: { productProfileId: string }) {
  useEffect(() => {
    let activeMs = 0;
    let segmentStart = performance.now();
    let visible = document.visibilityState === "visible";
    let sent = false;

    const flush = () => {
      // Fold the current foreground segment into the accumulator.
      const nowTs = performance.now();
      if (visible) {
        activeMs += nowTs - segmentStart;
      }
      segmentStart = nowTs;
    };

    const beacon = () => {
      flush();
      if (activeMs < 1000) return; // server also guards, but skip the round-trip
      if (typeof navigator.sendBeacon !== "function") return;
      const blob = new Blob(
        [JSON.stringify({ productProfileId, durationMs: Math.round(activeMs) })],
        { type: "application/json" },
      );
      navigator.sendBeacon("/api/analytics/duration", blob);
      sent = true;
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        // Going to background: bank the segment and report it now, because
        // mobile browsers often never fire pagehide/unload.
        beacon();
        visible = false;
      } else {
        // Returning to foreground: start a fresh segment.
        visible = true;
        segmentStart = performance.now();
        sent = false; // allow a longer total to be reported later
      }
    };

    const onPageHide = () => {
      if (!sent) beacon();
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
      // Component unmounting (e.g. client-side nav) is also "leaving the page".
      if (!sent) beacon();
    };
  }, [productProfileId]);

  return null;
}
