/* ─────────────────────────────────────────────
 * useCanvasPan - Canvas pan interaction hook
 *
 * Implements canvas panning via native scroll:
 *  - Spacebar + drag  (hold Space, then drag)
 *  - Middle mouse button drag
 *  - Drag on empty canvas background
 *  - Two-finger trackpad scroll (native, no code)
 *
 * Panning works by adjusting the container's
 * scrollLeft / scrollTop, keeping scrollbars
 * accurate at all zoom levels naturally.
 * ──────────────────────────────────────────── */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface PanState {
  /** Is the user currently panning? */
  startX: number;
  startY: number;
  startScrollLeft: number;
  startScrollTop: number;
}

export function useCanvasPan(containerRef: React.RefObject<HTMLDivElement | null>, activeTool: "pointer" | "hand" = "pointer") {
  const panRef = useRef<PanState | null>(null);
  const [isSpaceHeld, setIsSpaceHeld] = useState(false);
  const [isPanning, setIsPanning] = useState(false);

  /* ── Spacebar tracking ── */

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't activate space-pan when typing in inputs
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.contentEditable === "true"
      ) return;

      if (e.code === "Space" && !e.repeat) {
        e.preventDefault(); // Prevent page scroll
        setIsSpaceHeld(true);
        // Global flag so element wrappers know not to start drags
        (window as unknown as Record<string, unknown>).__editorPanMode = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsSpaceHeld(false);
        (window as unknown as Record<string, unknown>).__editorPanMode = false;
        // End pan if spacebar released during drag
        if (panRef.current) {
          panRef.current = null;
          setIsPanning(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  /* ── Pan start ── */

  const onPanPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const container = containerRef.current;
      if (!container) return;

      // Middle mouse button (button === 1)
      const isMiddleClick = e.button === 1;
      // Space + left click
      const isSpaceDrag = isSpaceHeld && e.button === 0;
      // Left click on empty canvas background
      const isBackgroundDrag =
        e.button === 0 &&
        !isSpaceHeld &&
        activeTool === "hand" &&
        ((e.target as HTMLElement).dataset.canvasBg === "true" ||
          e.target === container);

      if (!isMiddleClick && !isSpaceDrag && !isBackgroundDrag) return;

      e.preventDefault();
      e.stopPropagation();

      panRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startScrollLeft: container.scrollLeft,
        startScrollTop: container.scrollTop,
      };

      setIsPanning(true);

      // Capture pointer so we get events even outside the container
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [containerRef, isSpaceHeld, activeTool]
  );

  /* ── Pan move ── */

  const onPanPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!panRef.current) return;
      const container = containerRef.current;
      if (!container) return;

      const dx = e.clientX - panRef.current.startX;
      const dy = e.clientY - panRef.current.startY;

      container.scrollLeft = panRef.current.startScrollLeft - dx;
      container.scrollTop = panRef.current.startScrollTop - dy;
    },
    [containerRef]
  );

  /* ── Pan end ── */

  const onPanPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!panRef.current) return;

      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Ignore - already released
      }

      panRef.current = null;
      setIsPanning(false);
    },
    []
  );

  /* ── Cursor ── */

  const panCursor = isPanning
    ? "grabbing"
    : isSpaceHeld
      ? "grab"
      : undefined;

  return {
    /** True when spacebar is held (pan mode) */
    isSpaceHeld,
    /** True when actively panning */
    isPanning,
    /** CSS cursor to apply to the canvas container */
    panCursor,
    /** Attach to the canvas container's onPointerDown */
    onPanPointerDown,
    /** Attach to the canvas container's onPointerMove */
    onPanPointerMove,
    /** Attach to the canvas container's onPointerUp */
    onPanPointerUp,
  };
}
