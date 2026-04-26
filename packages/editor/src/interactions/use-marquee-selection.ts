"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { useCanvasStore } from "../engine/canvas-store";

interface MarqueeRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export function useMarqueeSelection(canvasRef: React.RefObject<HTMLDivElement | null>, activeTool: "pointer" | "hand" = "pointer") {
  const [marquee, setMarquee] = useState<MarqueeRect | null>(null);
  const marqueeStartRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number>(0);
  const pointerRef = useRef({ x: 0, y: 0 });

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    // Only trigger on left-click on the background
    const target = e.target as HTMLElement;
    if (e.button !== 0 || (target.dataset.canvasBg !== "true" && target !== canvasRef.current)) {
      return;
    }

    // Don't trigger if space is held (handled by pan)
    if ((window as unknown as Record<string, unknown>).__editorPanMode) return;
    
    // Don't trigger if the active tool is hand
    if (activeTool === "hand") return;

    e.preventDefault();
    e.stopPropagation();

    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left + canvasRef.current.scrollLeft;
    const y = e.clientY - rect.top + canvasRef.current.scrollTop;

    marqueeStartRef.current = { x, y };
    pointerRef.current = { x, y };
    setMarquee({ left: x, top: y, width: 0, height: 0 });

    target.setPointerCapture(e.pointerId);
  }, [canvasRef, activeTool]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!marqueeStartRef.current || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left + canvasRef.current.scrollLeft;
    const y = e.clientY - rect.top + canvasRef.current.scrollTop;

    pointerRef.current = { x, y };
    cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const start = marqueeStartRef.current;
      if (!start || !canvasRef.current) return;

      const current = pointerRef.current;
      const left = Math.min(start.x, current.x);
      const top = Math.min(start.y, current.y);
      const width = Math.abs(current.x - start.x);
      const height = Math.abs(current.y - start.y);

      setMarquee({ left, top, width, height });

      // Calculate intersections
      const marqueeRect = { left, top, right: left + width, bottom: top + height };
      const elementNodes = canvasRef.current.querySelectorAll("[data-element-id]");
      
      const newlySelectedIds = new Set<string>();

      elementNodes.forEach((node) => {
        const id = node.getAttribute("data-element-id");
        if (!id) return;
        
        const nodeRect = node.getBoundingClientRect();
        const canvasRect = canvasRef.current!.getBoundingClientRect();
        
        // Convert nodeRect to canvas-relative coordinates
        const nodeLeft = nodeRect.left - canvasRect.left + canvasRef.current!.scrollLeft;
        const nodeTop = nodeRect.top - canvasRect.top + canvasRef.current!.scrollTop;
        const nodeRight = nodeLeft + nodeRect.width;
        const nodeBottom = nodeTop + nodeRect.height;
        
        // Check intersection
        const intersects = !(
          nodeRight < marqueeRect.left ||
          nodeLeft > marqueeRect.right ||
          nodeBottom < marqueeRect.top ||
          nodeTop > marqueeRect.bottom
        );

        if (intersects) {
          newlySelectedIds.add(id);
        }
      });

      // Expand selection to include all members of any groups that are partially selected
      const state = useCanvasStore.getState();
      const finalSelectedIds = new Set<string>();
      
      newlySelectedIds.forEach((id) => {
        const memberIds = state.getGroupMemberIds(id);
        memberIds.forEach((mid) => finalSelectedIds.add(mid));
      });

      useCanvasStore.setState({ selectedIds: Array.from(finalSelectedIds) });
    });
  }, [canvasRef]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!marqueeStartRef.current) return;

    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    marqueeStartRef.current = null;
    cancelAnimationFrame(rafRef.current);
    setMarquee(null);
  }, []);

  return {
    marquee,
    onMarqueePointerDown: onPointerDown,
    onMarqueePointerMove: onPointerMove,
    onMarqueePointerUp: onPointerUp,
  };
}
