/* ─────────────────────────────────────────────
 * useDrag — Pointer-based drag interaction hook
 *
 * Uses window-level event listeners after pointer
 * capture so drags work reliably even when the
 * pointer leaves the element bounds.
 *
 * The artboard renders elements at NATIVE size
 * (e.g. 1440px) then CSS-scales them down for
 * the active breakpoint preview. Therefore:
 *
 *  - We always read from el.transform (native)
 *  - We divide pointer deltas by zoom × scaleRatio
 *    to convert screen px → native artboard px
 *  - We always write to el.transform (native)
 *
 * This ensures dragging works at any zoom level
 * and any breakpoint preview.
 * ──────────────────────────────────────────── */

"use client";

import { useCallback, useRef } from "react";
import { useCanvasStore } from "../engine/canvas-store";
import { computeSnap } from "./snap-engine";
import { getEffectiveTransform, getArtboardPreviewWidth } from "../utils/responsive";
import type { Transform } from "@productix/types";

interface DragState {
  startX: number;
  startY: number;
  /** Native artboard-space coordinates at drag start */
  startTransformX: number;
  startTransformY: number;
  elementId: string;
  /** Combined scale factor: zoom × artboard scaleRatio */
  combinedScale: number;
}

export function useDrag() {
  const dragRef = useRef<DragState | null>(null);
  const rafRef = useRef<number>(0);
  // Store latest pointer position so the rAF callback reads fresh values
  const pointerRef = useRef({ x: 0, y: 0 });

  const onDragStart = useCallback(
    (e: React.PointerEvent, elementId: string) => {
      const state = useCanvasStore.getState();
      const el = state.document.elements[elementId];
      if (!el || el.locked) return;

      // Push history at drag start
      state.pushHistory();

      // Find the artboard to compute the scale ratio
      const ab = state.document.artboards.find((a) =>
        a.elements.includes(elementId)
      );
      const abW = ab?.width ?? 1440;

      // The artboard is rendered at native size and CSS-scaled.
      // Compute the combined scale: canvas zoom × artboard scaleRatio.
      const previewW = getArtboardPreviewWidth(abW, state.activeBreakpoint);
      const scaleRatio = previewW / abW;
      const combinedScale = state.zoom * scaleRatio;

      // Always use the native transform — that's what the artboard renders
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startTransformX: el.transform.x,
        startTransformY: el.transform.y,
        elementId,
        combinedScale,
      };

      pointerRef.current = { x: e.clientX, y: e.clientY };

      const target = e.currentTarget as HTMLElement;
      target.setPointerCapture(e.pointerId);
    },
    []
  );

  const onDragMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return;

    // Store fresh pointer position (not captured in rAF closure)
    pointerRef.current = { x: e.clientX, y: e.clientY };

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const drag = dragRef.current;
      if (!drag) return;

      const { x: clientX, y: clientY } = pointerRef.current;
      const state = useCanvasStore.getState();

      const el = state.document.elements[drag.elementId];
      if (!el) return;

      // Convert screen-pixel deltas → native artboard-space deltas
      const dx = (clientX - drag.startX) / drag.combinedScale;
      const dy = (clientY - drag.startY) / drag.combinedScale;

      const newX = drag.startTransformX + dx;
      const newY = drag.startTransformY + dy;

      // Find artboard dimensions for snapping
      const ab = state.document.artboards.find((a) =>
        a.elements.includes(drag.elementId)
      );
      const abW = ab?.width ?? 1440;
      const abH = ab?.height ?? 900;

      const movingTransform: Transform = {
        ...el.transform,
        x: newX,
        y: newY,
      };

      // Get other elements' native transforms for snapping
      const otherTransforms = Object.values(state.document.elements)
        .filter((e) => e.id !== drag.elementId && e.visible)
        .map((e) => e.transform);

      const snap = computeSnap(movingTransform, otherTransforms, abW, abH);

      // Always write to the base transform — the artboard renders
      // from el.transform regardless of breakpoint.
      state.updateElementTransform(drag.elementId, { x: snap.x, y: snap.y });
      state.setSnapGuides(snap.guides);
    });
  }, []);

  const onDragEnd = useCallback(() => {
    dragRef.current = null;
    cancelAnimationFrame(rafRef.current);
    useCanvasStore.getState().clearSnapGuides();
  }, []);

  return { onDragStart, onDragMove, onDragEnd };
}
