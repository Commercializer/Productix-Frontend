/* ─────────────────────────────────────────────
 * useResize - Pointer-based resize interaction hook
 *
 * Same architecture as useDrag: stores latest pointer
 * position in a ref to avoid stale event objects
 * inside rAF.
 *
 * The artboard renders at NATIVE size and CSS-scales,
 * so we always read/write el.transform (native coords)
 * and divide pointer deltas by zoom × scaleRatio.
 * ──────────────────────────────────────────── */

"use client";

import { useCallback, useRef } from "react";
import { useCanvasStore } from "../engine/canvas-store";
import { MIN_ELEMENT_SIZE } from "./constants";
import { getArtboardPreviewWidth } from "../utils/responsive";

export type ResizeHandle =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top"
  | "bottom"
  | "left"
  | "right";

interface ResizeState {
  startX: number;
  startY: number;
  /** Native artboard-space transform at resize start */
  startTransform: { x: number; y: number; width: number; height: number };
  handle: ResizeHandle;
  elementId: string;
  aspectRatio: number;
  shiftKey: boolean;
  /** Combined scale factor: zoom × artboard scaleRatio */
  combinedScale: number;
}

export function useResize() {
  const resizeRef = useRef<ResizeState | null>(null);
  const rafRef = useRef<number>(0);
  // Store latest pointer position for rAF freshness
  const pointerRef = useRef({ x: 0, y: 0, shiftKey: false });

  const onResizeStart = useCallback(
    (e: React.PointerEvent, elementId: string, handle: ResizeHandle) => {
      e.stopPropagation();
      const state = useCanvasStore.getState();
      const el = state.document.elements[elementId];
      if (!el || el.locked) return;

      state.pushHistory();

      // Find the artboard to compute the scale ratio
      const ab = state.document.artboards.find((a) =>
        a.elements.includes(elementId)
      );
      const abW = ab?.width ?? 1440;

      const previewW = getArtboardPreviewWidth(abW, state.activeBreakpoint);
      const scaleRatio = previewW / abW;
      const combinedScale = state.zoom * scaleRatio;

      // Always use native transform - that's what the artboard renders
      resizeRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startTransform: { ...el.transform },
        handle,
        elementId,
        aspectRatio: el.transform.width / el.transform.height,
        shiftKey: e.shiftKey,
        combinedScale,
      };

      pointerRef.current = { x: e.clientX, y: e.clientY, shiftKey: e.shiftKey };

      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    []
  );

  const onResizeMove = useCallback((e: React.PointerEvent) => {
    if (!resizeRef.current) return;

    // Store fresh values
    pointerRef.current = { x: e.clientX, y: e.clientY, shiftKey: e.shiftKey };

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rs = resizeRef.current;
      if (!rs) return;

      const { x: clientX, y: clientY, shiftKey } = pointerRef.current;
      rs.shiftKey = shiftKey;

      const state = useCanvasStore.getState();

      // Convert screen-pixel deltas → native artboard-space deltas
      const dx = (clientX - rs.startX) / rs.combinedScale;
      const dy = (clientY - rs.startY) / rs.combinedScale;
      const { x, y, width, height } = rs.startTransform;

      let newX = x;
      let newY = y;
      let newW = width;
      let newH = height;

      // Calculate new dimensions based on handle
      switch (rs.handle) {
        case "bottom-right":
          newW = Math.max(MIN_ELEMENT_SIZE, width + dx);
          newH = Math.max(MIN_ELEMENT_SIZE, height + dy);
          break;
        case "bottom-left":
          newX = x + dx;
          newW = Math.max(MIN_ELEMENT_SIZE, width - dx);
          newH = Math.max(MIN_ELEMENT_SIZE, height + dy);
          if (newW <= MIN_ELEMENT_SIZE) newX = x + width - MIN_ELEMENT_SIZE;
          break;
        case "top-right":
          newY = y + dy;
          newW = Math.max(MIN_ELEMENT_SIZE, width + dx);
          newH = Math.max(MIN_ELEMENT_SIZE, height - dy);
          if (newH <= MIN_ELEMENT_SIZE) newY = y + height - MIN_ELEMENT_SIZE;
          break;
        case "top-left":
          newX = x + dx;
          newY = y + dy;
          newW = Math.max(MIN_ELEMENT_SIZE, width - dx);
          newH = Math.max(MIN_ELEMENT_SIZE, height - dy);
          if (newW <= MIN_ELEMENT_SIZE) newX = x + width - MIN_ELEMENT_SIZE;
          if (newH <= MIN_ELEMENT_SIZE) newY = y + height - MIN_ELEMENT_SIZE;
          break;
        case "right":
          newW = Math.max(MIN_ELEMENT_SIZE, width + dx);
          break;
        case "left":
          newX = x + dx;
          newW = Math.max(MIN_ELEMENT_SIZE, width - dx);
          if (newW <= MIN_ELEMENT_SIZE) newX = x + width - MIN_ELEMENT_SIZE;
          break;
        case "bottom":
          newH = Math.max(MIN_ELEMENT_SIZE, height + dy);
          break;
        case "top":
          newY = y + dy;
          newH = Math.max(MIN_ELEMENT_SIZE, height - dy);
          if (newH <= MIN_ELEMENT_SIZE) newY = y + height - MIN_ELEMENT_SIZE;
          break;
      }

      // Preserve aspect ratio when Shift is held
      if (rs.shiftKey && ["top-left", "top-right", "bottom-left", "bottom-right"].includes(rs.handle)) {
        const desired = newW / newH;
        if (desired > rs.aspectRatio) {
          newW = newH * rs.aspectRatio;
        } else {
          newH = newW / rs.aspectRatio;
        }
      }

      // Always write to the base transform - the artboard renders
      // from el.transform regardless of breakpoint.
      state.updateElementTransform(rs.elementId, {
        x: newX,
        y: newY,
        width: newW,
        height: newH,
      });
    });
  }, []);

  const onResizeEnd = useCallback(() => {
    resizeRef.current = null;
    cancelAnimationFrame(rafRef.current);
  }, []);

  return { onResizeStart, onResizeMove, onResizeEnd };
}
