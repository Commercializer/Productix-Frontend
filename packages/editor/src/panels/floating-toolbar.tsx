/* ─────────────────────────────────────────────
 * Floating Toolbar — Contextual actions bar
 *
 * Renders OUTSIDE the scaled canvas container so
 * it's always at 1:1 screen pixels. Uses the
 * element's artboard-space position × zoom to
 * compute screen-space coordinates relative to
 * the canvas scroll container.
 * ──────────────────────────────────────────── */

"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useCanvasStore } from "../engine/canvas-store";
import { useTranslation } from "../i18n";

interface FloatingToolbarProps {
  canvasRef: React.RefObject<HTMLDivElement | null>;
  zoom: number;
}

export function FloatingToolbar({ canvasRef, zoom }: FloatingToolbarProps) {
  const selectedIds = useCanvasStore((s) => s.selectedIds);
  const elements = useCanvasStore((s) => s.document.elements);
  const duplicateElement = useCanvasStore((s) => s.duplicateElement);
  const removeElement = useCanvasStore((s) => s.removeElement);
  const bringToFront = useCanvasStore((s) => s.bringToFront);
  const sendToBack = useCanvasStore((s) => s.sendToBack);
  const toggleLock = useCanvasStore((s) => s.toggleLock);

  const [position, setPosition] = useState<{ left: number; top: number } | null>(null);

  // Find the element's DOM node and compute position
  const updatePosition = useCallback(() => {
    if (selectedIds.length !== 1 || !canvasRef.current) {
      setPosition(null);
      return;
    }

    const selId = selectedIds[0];
    if (!selId) { setPosition(null); return; }

    const el = elements[selId];
    if (!el) { setPosition(null); return; }

    // Find the element's DOM node inside the canvas
    const elNode = canvasRef.current.querySelector(`[data-element-id="${selId}"]`);
    if (!elNode) { setPosition(null); return; }

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const elRect = elNode.getBoundingClientRect();

    // Position toolbar centered above the element, in canvas-viewport space
    setPosition({
      left: elRect.left + elRect.width / 2 - canvasRect.left + canvasRef.current.scrollLeft,
      top: elRect.top - canvasRect.top + canvasRef.current.scrollTop - 44,
    });
  }, [selectedIds, elements, canvasRef]);

  // Update position on selection change and periodically during interaction
  useEffect(() => {
    updatePosition();
    // Also update on scroll
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onScroll = () => updatePosition();
    canvas.addEventListener("scroll", onScroll, { passive: true });

    // Periodic update during drag/resize (30fps is enough for toolbar)
    const interval = setInterval(updatePosition, 33);

    return () => {
      canvas.removeEventListener("scroll", onScroll);
      clearInterval(interval);
    };
  }, [updatePosition, zoom]);

  if (selectedIds.length !== 1 || !position) return null;

  const selId = selectedIds[0];
  if (!selId) return null;
  const el = elements[selId];
  if (!el) return null;

  return <FloatingToolbarInner position={position} el={el} />;
}

/** Inner component that uses the translation hook */
function FloatingToolbarInner({
  position,
  el,
}: {
  position: { left: number; top: number };
  el: { id: string; locked: boolean };
}) {
  const duplicateElement = useCanvasStore((s) => s.duplicateElement);
  const removeElement = useCanvasStore((s) => s.removeElement);
  const bringToFront = useCanvasStore((s) => s.bringToFront);
  const sendToBack = useCanvasStore((s) => s.sendToBack);
  const toggleLock = useCanvasStore((s) => s.toggleLock);
  const { t } = useTranslation();

  return (
    <div
      style={{
        position: "absolute",
        left: position.left,
        top: Math.max(8, position.top),
        transform: "translateX(-50%)",
        zIndex: 99998,
        pointerEvents: "auto",
      }}
    >
      <div className="flex items-center gap-0.5 rounded-lg bg-gray-900/95 backdrop-blur-sm px-1.5 py-1 shadow-xl border border-gray-700/50">
        <ToolbarBtn title={t("float.duplicate")} onClick={() => duplicateElement(el.id)}>📋</ToolbarBtn>
        <ToolbarBtn title={t("float.bringToFront")} onClick={() => bringToFront(el.id)}>⬆️</ToolbarBtn>
        <ToolbarBtn title={t("float.sendToBack")} onClick={() => sendToBack(el.id)}>⬇️</ToolbarBtn>
        <ToolbarBtn title={el.locked ? t("float.unlock") : t("float.lock")} onClick={() => toggleLock(el.id)}>
          {el.locked ? "🔓" : "🔒"}
        </ToolbarBtn>
        <div className="w-px h-5 bg-gray-700 mx-0.5" />
        <ToolbarBtn title={t("float.delete")} onClick={() => removeElement(el.id)} danger>🗑️</ToolbarBtn>
      </div>
    </div>
  );
}

function ToolbarBtn({
  children,
  title,
  onClick,
  danger,
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`flex items-center justify-center w-7 h-7 rounded-md text-sm transition-colors ${
        danger
          ? "hover:bg-red-600/30 active:bg-red-600/50"
          : "hover:bg-gray-700 active:bg-gray-600"
      }`}
    >
      {children}
    </button>
  );
}
