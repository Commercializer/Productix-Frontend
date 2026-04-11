/* ─────────────────────────────────────────────
 * Responsive Utilities — Breakpoint-aware transforms
 *
 * Provides auto-scaling from the base (desktop)
 * transform and merges per-breakpoint overrides.
 * ──────────────────────────────────────────── */

import type { Transform, Breakpoint, ElementNode } from "@productix/types";
import { BREAKPOINT_WIDTHS } from "@productix/types";

/**
 * Auto-scale a base transform proportionally from
 * baseWidth → targetWidth.  Both x-position and
 * size (width/height) scale by the same ratio so
 * the overall composition stays proportional.
 */
export function autoScaleTransform(
  base: Transform,
  baseWidth: number,
  targetWidth: number,
): Transform {
  if (baseWidth <= 0 || targetWidth <= 0) return base;
  const ratio = targetWidth / baseWidth;
  return {
    x: base.x * ratio,
    y: base.y * ratio,
    width: base.width * ratio,
    height: base.height * ratio,
    rotation: base.rotation,
  };
}

/**
 * Compute the effective transform for an element at
 * the given breakpoint, considering:
 *   1. Explicit responsive overrides (highest priority)
 *   2. Auto-scaling from the base (desktop) transform
 *
 * @param element      The full element node
 * @param breakpoint   Target breakpoint
 * @param baseArtboardWidth  The artboard's design-time (desktop) width
 */
export function getEffectiveTransform(
  element: ElementNode,
  breakpoint: Breakpoint,
  baseArtboardWidth: number,
): Transform {
  const base = element.transform;

  // Desktop always uses the base transform directly
  if (breakpoint === "desktop") return base;

  const targetWidth = BREAKPOINT_WIDTHS[breakpoint];
  const autoScaled = autoScaleTransform(base, baseArtboardWidth, targetWidth);

  // Merge any explicit per-breakpoint overrides
  const overrides = element.responsiveOverrides?.[breakpoint];
  if (overrides) {
    return {
      ...autoScaled,
      ...overrides,
    };
  }

  return autoScaled;
}

/**
 * Return the artboard preview width for a given breakpoint.
 * Desktop returns the actual artboard width; other breakpoints
 * return the canonical breakpoint width.
 */
export function getArtboardPreviewWidth(
  artboardWidth: number,
  breakpoint: Breakpoint,
): number {
  if (breakpoint === "desktop") return artboardWidth;
  return BREAKPOINT_WIDTHS[breakpoint];
}

/**
 * Return the artboard preview height scaled proportionally
 * from the base height.
 */
export function getArtboardPreviewHeight(
  artboardWidth: number,
  artboardHeight: number,
  breakpoint: Breakpoint,
): number {
  if (breakpoint === "desktop") return artboardHeight;
  const ratio = BREAKPOINT_WIDTHS[breakpoint] / artboardWidth;
  return Math.round(artboardHeight * ratio);
}
