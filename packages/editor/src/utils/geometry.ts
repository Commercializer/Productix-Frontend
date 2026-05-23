/* ─────────────────────────────────────────────
 * Geometry Utilities - Bounding box, intersection, alignment
 * ──────────────────────────────────────────── */

import type { Transform } from "@productix/types";

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Get the axis-aligned bounding box of a transform */
export function getBoundingBox(t: Transform): Rect {
  // For simplicity (no rotation), return as-is
  if (t.rotation === 0) {
    return { x: t.x, y: t.y, width: t.width, height: t.height };
  }

  // With rotation, compute the enclosing AABB
  const cx = t.x + t.width / 2;
  const cy = t.y + t.height / 2;
  const rad = (t.rotation * Math.PI) / 180;
  const cos = Math.abs(Math.cos(rad));
  const sin = Math.abs(Math.sin(rad));
  const w = t.width * cos + t.height * sin;
  const h = t.width * sin + t.height * cos;
  return { x: cx - w / 2, y: cy - h / 2, width: w, height: h };
}

/** Check if two rects intersect */
export function rectsIntersect(a: Rect, b: Rect): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

/** Get center point of a transform */
export function getCenter(t: Transform): { x: number; y: number } {
  return { x: t.x + t.width / 2, y: t.y + t.height / 2 };
}

/** Clamp a value between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Snap a value to the nearest grid point */
export function snapToGrid(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize;
}

/** Get the bounding box that encloses multiple rects */
export function getEnclosingRect(rects: Rect[]): Rect {
  if (rects.length === 0) return { x: 0, y: 0, width: 0, height: 0 };
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const r of rects) {
    minX = Math.min(minX, r.x);
    minY = Math.min(minY, r.y);
    maxX = Math.max(maxX, r.x + r.width);
    maxY = Math.max(maxY, r.y + r.height);
  }
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}
