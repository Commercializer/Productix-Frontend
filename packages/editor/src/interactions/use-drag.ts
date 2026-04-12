/* ─────────────────────────────────────────────
 * useDrag — Pointer-based drag interaction hook
 *
 * Uses window-level event listeners after pointer
 * capture so drags work reliably even when the
 * pointer leaves the element bounds.
 *
 * Coordinates are divided by zoom to keep
 * canvas-space positioning accurate at any scale.
 *
 * Responsive: when activeBreakpoint !== "desktop",
 * writes to responsiveOverrides instead of the
 * base transform.
 * ──────────────────────────────────────────── */

"use client";

import { useCallback, useRef } from "react";
import { useCanvasStore } from "../engine/canvas-store";
import { computeSnap } from "./snap-engine";
import { getEffectiveTransform } from "../utils/responsive";
import { BREAKPOINT_WIDTHS } from "@productix/types";
import type { Transform } from "@productix/types";

interface DragState {
  startX: number;
  startY: number;
  startTransformX: number;
  startTransformY: number;
  elementId: string;
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

      // Resolve the effective transform for the active breakpoint
      const ab = state.document.artboards.find((a) =>
        a.elements.includes(elementId)
      );
      const effectiveT = getEffectiveTransform(
        el,
        state.activeBreakpoint,
        ab?.width ?? 1440,
        ab?.height ?? 900,
      );

      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startTransformX: effectiveT.x,
        startTransformY: effectiveT.y,
        elementId,
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
      const zoom = state.zoom;
      const dx = (clientX - drag.startX) / zoom;
      const dy = (clientY - drag.startY) / zoom;

      const newX = drag.startTransformX + dx;
      const newY = drag.startTransformY + dy;

      const el = state.document.elements[drag.elementId];
      if (!el) return;

      // Resolve effective transform for snapping
      const ab = state.document.artboards.find((a) =>
        a.elements.includes(drag.elementId)
      );
      const abW = ab?.width ?? 1440;
      const abH = ab?.height ?? 900;
      const effectiveT = getEffectiveTransform(el, state.activeBreakpoint, abW, abH);

      const movingTransform: Transform = {
        ...effectiveT,
        x: newX,
        y: newY,
      };

      // Get other elements transforms for snapping (using effective transforms)
      const otherTransforms = Object.values(state.document.elements)
        .filter((e) => e.id !== drag.elementId && e.visible)
        .map((e) => getEffectiveTransform(e, state.activeBreakpoint, abW, abH));

      // Use breakpoint-appropriate artboard dimensions for snap
      const previewW = state.activeBreakpoint === "desktop"
        ? abW
        : BREAKPOINT_WIDTHS[state.activeBreakpoint];
      const previewH = state.activeBreakpoint === "desktop"
        ? abH
        : Math.round(abH * (previewW / abW));

      const snap = computeSnap(movingTransform, otherTransforms, previewW, previewH);

      // Write to the correct target based on active breakpoint
      if (state.activeBreakpoint === "desktop") {
        state.updateElementTransform(drag.elementId, { x: snap.x, y: snap.y });
      } else {
        state.updateElementResponsiveOverride(drag.elementId, state.activeBreakpoint, {
          x: snap.x,
          y: snap.y,
        });
      }
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
