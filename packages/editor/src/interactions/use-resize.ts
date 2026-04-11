/* ─────────────────────────────────────────────
 * useResize — Pointer-based resize interaction hook
 *
 * Same fix as useDrag: stores latest pointer position
 * in a ref to avoid stale event objects inside rAF.
 *
 * Coordinates divided by zoom for canvas-space accuracy.
 *
 * Responsive: when activeBreakpoint !== "desktop",
 * writes to responsiveOverrides instead of the
 * base transform.
 * ──────────────────────────────────────────── */

"use client";

import { useCallback, useRef } from "react";
import { useCanvasStore } from "../engine/canvas-store";
import { MIN_ELEMENT_SIZE } from "./constants";
import { getEffectiveTransform } from "../utils/responsive";

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
  startTransform: { x: number; y: number; width: number; height: number };
  handle: ResizeHandle;
  elementId: string;
  aspectRatio: number;
  shiftKey: boolean;
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

      // Resolve the effective transform for the active breakpoint
      const ab = state.document.artboards.find((a) =>
        a.elements.includes(elementId)
      );
      const effectiveT = getEffectiveTransform(
        el,
        state.activeBreakpoint,
        ab?.width ?? 1440,
      );

      resizeRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startTransform: { ...effectiveT },
        handle,
        elementId,
        aspectRatio: effectiveT.width / effectiveT.height,
        shiftKey: e.shiftKey,
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
      const zoom = state.zoom;
      const dx = (clientX - rs.startX) / zoom;
      const dy = (clientY - rs.startY) / zoom;
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

      const newTransform = { x: newX, y: newY, width: newW, height: newH };

      // Write to the correct target based on active breakpoint
      if (state.activeBreakpoint === "desktop") {
        state.updateElementTransform(rs.elementId, newTransform);
      } else {
        state.updateElementResponsiveOverride(rs.elementId, state.activeBreakpoint, newTransform);
      }
    });
  }, []);

  const onResizeEnd = useCallback(() => {
    resizeRef.current = null;
    cancelAnimationFrame(rafRef.current);
  }, []);

  return { onResizeStart, onResizeMove, onResizeEnd };
}
