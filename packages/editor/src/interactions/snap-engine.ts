/* ─────────────────────────────────────────────
 * Snap Engine — Alignment guides during drag/resize
 * ──────────────────────────────────────────── */

import type { Transform } from "@productix/types";
import { SNAP_THRESHOLD } from "./constants";

export interface SnapGuide {
  orientation: "horizontal" | "vertical";
  position: number; // px
}

export interface SnapResult {
  x: number;
  y: number;
  guides: SnapGuide[];
}

/** Extract snap-relevant edges and centers from other elements */
function getSnapPoints(others: Transform[]): { hLines: number[]; vLines: number[] } {
  const hLines: number[] = [];
  const vLines: number[] = [];

  for (const t of others) {
    // Horizontal: top, center, bottom
    hLines.push(t.y, t.y + t.height / 2, t.y + t.height);
    // Vertical: left, center, right
    vLines.push(t.x, t.x + t.width / 2, t.x + t.width);
  }

  return { hLines, vLines };
}

/**
 * Compute snap-adjusted position and guide lines for a dragged element.
 * @param moving — The element being dragged (current position)
 * @param others — All other visible elements' transforms
 * @param artboardWidth — Artboard width for edge snapping
 * @param artboardHeight — Artboard height for edge snapping
 */
export function computeSnap(
  moving: Transform,
  others: Transform[],
  artboardWidth: number,
  artboardHeight: number
): SnapResult {
  const guides: SnapGuide[] = [];
  let snappedX = moving.x;
  let snappedY = moving.y;

  const { hLines, vLines } = getSnapPoints(others);

  // Add artboard edges & center
  hLines.push(0, artboardHeight / 2, artboardHeight);
  vLines.push(0, artboardWidth / 2, artboardWidth);

  // Moving element edges
  const myEdges = {
    top: moving.y,
    centerY: moving.y + moving.height / 2,
    bottom: moving.y + moving.height,
    left: moving.x,
    centerX: moving.x + moving.width / 2,
    right: moving.x + moving.width,
  };

  // Snap vertical position (Y)
  let bestDy = SNAP_THRESHOLD + 1;
  for (const line of hLines) {
    for (const [edge, val] of [
      ["top", myEdges.top],
      ["centerY", myEdges.centerY],
      ["bottom", myEdges.bottom],
    ] as const) {
      const dist = Math.abs(val - line);
      if (dist < bestDy) {
        bestDy = dist;
        const offset = edge === "top" ? 0 : edge === "centerY" ? -moving.height / 2 : -moving.height;
        snappedY = line + offset;
      }
    }
  }
  if (bestDy <= SNAP_THRESHOLD) {
    // Find which line we snapped to and add guide
    for (const line of hLines) {
      for (const edge of [snappedY, snappedY + moving.height / 2, snappedY + moving.height]) {
        if (Math.abs(edge - line) < 1) {
          guides.push({ orientation: "horizontal", position: line });
        }
      }
    }
  } else {
    snappedY = moving.y;
  }

  // Snap horizontal position (X)
  let bestDx = SNAP_THRESHOLD + 1;
  for (const line of vLines) {
    for (const [edge, val] of [
      ["left", myEdges.left],
      ["centerX", myEdges.centerX],
      ["right", myEdges.right],
    ] as const) {
      const dist = Math.abs(val - line);
      if (dist < bestDx) {
        bestDx = dist;
        const offset = edge === "left" ? 0 : edge === "centerX" ? -moving.width / 2 : -moving.width;
        snappedX = line + offset;
      }
    }
  }
  if (bestDx <= SNAP_THRESHOLD) {
    for (const line of vLines) {
      for (const edge of [snappedX, snappedX + moving.width / 2, snappedX + moving.width]) {
        if (Math.abs(edge - line) < 1) {
          guides.push({ orientation: "vertical", position: line });
        }
      }
    }
  } else {
    snappedX = moving.x;
  }

  return { x: snappedX, y: snappedY, guides };
}
