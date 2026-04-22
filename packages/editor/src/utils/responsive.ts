/* ─────────────────────────────────────────────
 * Responsive Utilities — Breakpoint-aware transforms
 *
 * KEY DESIGN: Single-ratio scaling.
 *
 * Everything scales by the WIDTH RATIO only.
 * X, Y, width, height all use the same ratio.
 * This means the design is proportionally scaled
 * — exactly like a responsive website that shrinks
 * uniformly. No separate per-breakpoint designs,
 * no manual overrides needed.
 *
 * The artboard height auto-adjusts to maintain
 * the same aspect ratio as the desktop design.
 * ──────────────────────────────────────────── */

import type { Transform, Breakpoint, ElementNode } from "@productix/types";
import { BREAKPOINT_WIDTHS } from "@productix/types";

/**
 * Auto-scale a base transform using a SINGLE width ratio.
 *
 * All properties (x, y, width, height) scale by the same
 * ratio so the design looks like a proportionally shrunk
 * version of the desktop layout — like a responsive website.
 */
export function autoScaleTransform(
  base: Transform,
  baseWidth: number,
  _baseHeight: number,
  targetWidth: number,
  _targetHeight: number,
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
 * Simple width-only scaling (identical to autoScaleTransform now,
 * kept for backward compatibility).
 */
export function autoScaleTransformByWidth(
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
 * the given breakpoint.
 *
 * Uses UNIFORM width-ratio scaling — the entire design
 * shrinks/grows proportionally. No separate per-breakpoint
 * designs. Design once on desktop, it scales to every screen.
 *
 * @param element             The full element node
 * @param breakpoint          Target breakpoint
 * @param baseArtboardWidth   The artboard's design-time (desktop) width
 * @param baseArtboardHeight  The artboard's design-time (desktop) height (unused but kept for API compat)
 */
export function getEffectiveTransform(
  element: ElementNode,
  breakpoint: Breakpoint,
  baseArtboardWidth: number,
  _baseArtboardHeight?: number,
): Transform {
  const base = element.transform;

  // Desktop always uses the base transform directly
  if (breakpoint === "desktop") return base;

  const targetWidth = BREAKPOINT_WIDTHS[breakpoint];

  const ratio = targetWidth / baseArtboardWidth;

  const autoScaled: Transform = {
    x: base.x * ratio,
    y: base.y * ratio,
    width: base.width * ratio,
    height: base.height * ratio,
    rotation: base.rotation,
  };

  // Merge any explicit per-breakpoint overrides (if user manually adjusted)
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
 * Return the artboard preview height for a given breakpoint.
 *
 * Uses PROPORTIONAL height: the desktop design's aspect ratio
 * is maintained at every breakpoint. This ensures elements
 * stay in the same relative positions — no vertical stretching.
 *
 * Desktop 1440×900 → Mobile 428×? → 428/1440 × 900 = 267px
 * The content is a scaled-down version of the desktop design.
 */
export function getArtboardPreviewHeight(
  artboardWidth: number,
  artboardHeight: number,
  breakpoint: Breakpoint,
): number {
  if (breakpoint === "desktop") return artboardHeight;

  const targetWidth = BREAKPOINT_WIDTHS[breakpoint];
  const ratio = targetWidth / artboardWidth;

  // Maintain aspect ratio — the entire design scales uniformly
  return Math.round(artboardHeight * ratio);
}

/**
 * Check if an element should use flow layout at the given breakpoint.
 * Elements without a layout field use absolute positioning (backward compat).
 */
export function isElementInFlow(element: ElementNode): boolean {
  return element.layout?.layoutMode === "flow";
}
