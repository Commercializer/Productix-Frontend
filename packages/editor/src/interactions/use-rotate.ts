/* ─────────────────────────────────────────────
 * useRotate - Pointer-based rotation interaction hook
 *
 * Same architecture as useResize/useDrag: stores the
 * latest pointer position in a ref and commits inside
 * a rAF callback.
 *
 * Rotation is derived from the angle between the
 * element's center and the pointer. We read the
 * element's on-screen center via getBoundingClientRect()
 * (which is zoom/scale agnostic and stays fixed while
 * rotating, since elements rotate around their center),
 * so no manual zoom math is needed here.
 *
 * Hold Shift to snap to 15° increments.
 * ──────────────────────────────────────────── */

"use client";

import { useCallback, useRef } from "react";
import { useCanvasStore } from "../engine/canvas-store";

const SNAP_INCREMENT = 15;

interface RotateState {
  /** Element center in screen coordinates */
  centerX: number;
  centerY: number;
  /** Pointer angle (radians) at rotation start */
  startPointerAngle: number;
  /** Element rotation (degrees) at rotation start */
  startRotation: number;
  elementId: string;
  shiftKey: boolean;
}

/** Normalize a degree value to the [-180, 180] range used by the transform. */
function normalize(deg: number): number {
  return ((((deg + 180) % 360) + 360) % 360) - 180;
}

export function useRotate() {
  const rotateRef = useRef<RotateState | null>(null);
  const rafRef = useRef<number>(0);
  const pointerRef = useRef({ x: 0, y: 0, shiftKey: false });

  const onRotateStart = useCallback(
    (e: React.PointerEvent, elementId: string) => {
      e.stopPropagation();
      const state = useCanvasStore.getState();
      const el = state.document.elements[elementId];
      if (!el || el.locked) return;

      state.pushHistory();

      // Element center in screen space - rotation pivots here and it
      // stays fixed for the duration of the gesture.
      const node = document.querySelector(
        `[data-element-id="${elementId}"]`
      ) as HTMLElement | null;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      rotateRef.current = {
        centerX,
        centerY,
        startPointerAngle: Math.atan2(e.clientY - centerY, e.clientX - centerX),
        startRotation: el.transform.rotation,
        elementId,
        shiftKey: e.shiftKey,
      };

      pointerRef.current = { x: e.clientX, y: e.clientY, shiftKey: e.shiftKey };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    []
  );

  const onRotateMove = useCallback((e: React.PointerEvent) => {
    if (!rotateRef.current) return;

    pointerRef.current = { x: e.clientX, y: e.clientY, shiftKey: e.shiftKey };

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rs = rotateRef.current;
      if (!rs) return;

      const { x: clientX, y: clientY, shiftKey } = pointerRef.current;

      const currentAngle = Math.atan2(clientY - rs.centerY, clientX - rs.centerX);
      const deltaDeg = ((currentAngle - rs.startPointerAngle) * 180) / Math.PI;

      let next = normalize(rs.startRotation + deltaDeg);
      if (shiftKey) next = Math.round(next / SNAP_INCREMENT) * SNAP_INCREMENT;

      useCanvasStore
        .getState()
        .updateElementTransform(rs.elementId, { rotation: Math.round(next) });
    });
  }, []);

  const onRotateEnd = useCallback(() => {
    rotateRef.current = null;
    cancelAnimationFrame(rafRef.current);
  }, []);

  return { onRotateStart, onRotateMove, onRotateEnd };
}
