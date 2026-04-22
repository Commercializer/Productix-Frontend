/* ─────────────────────────────────────────────
 * Floating Toolbar — Light theme
 * ──────────────────────────────────────────── */

"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Copy, ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import { useCanvasStore } from "../engine/canvas-store";
import { useTranslation } from "../i18n";

interface FloatingToolbarProps {
  canvasRef: React.RefObject<HTMLDivElement | null>;
  zoom: number;
}

export function FloatingToolbar({ canvasRef, zoom }: FloatingToolbarProps) {
  const selectedIds = useCanvasStore((s) => s.selectedIds);
  const elements = useCanvasStore((s) => s.document.elements);
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null);

  const updatePosition = useCallback(() => {
    if (selectedIds.length !== 1 || !canvasRef.current) { setPosition(null); return; }
    const selId = selectedIds[0];
    if (!selId) { setPosition(null); return; }
    const el = elements[selId];
    if (!el) { setPosition(null); return; }
    const elNode = canvasRef.current.querySelector(`[data-element-id="${selId}"]`);
    if (!elNode) { setPosition(null); return; }
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const elRect = elNode.getBoundingClientRect();
    setPosition({
      left: elRect.left + elRect.width / 2 - canvasRect.left + canvasRef.current.scrollLeft,
      top: elRect.top - canvasRect.top + canvasRef.current.scrollTop - 52,
    });
  }, [selectedIds, elements, canvasRef]);

  useEffect(() => {
    updatePosition();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onScroll = () => updatePosition();
    canvas.addEventListener("scroll", onScroll, { passive: true });
    const interval = setInterval(updatePosition, 33);
    return () => { canvas.removeEventListener("scroll", onScroll); clearInterval(interval); };
  }, [updatePosition, zoom]);

  if (selectedIds.length !== 1 || !position) return null;
  const selId = selectedIds[0];
  if (!selId) return null;
  const el = elements[selId];
  if (!el) return null;

  return <FloatingToolbarInner position={position} el={el} />;
}

function FloatingToolbarInner({ position, el }: { position: { left: number; top: number }; el: { id: string; locked: boolean }; }) {
  const duplicateElement = useCanvasStore((s) => s.duplicateElement);
  const removeElement = useCanvasStore((s) => s.removeElement);
  const bringForward = useCanvasStore((s) => s.bringForward);
  const sendBackward = useCanvasStore((s) => s.sendBackward);
  const { t } = useTranslation();

  return (
    <div style={{ position:"absolute",left:position.left,top:Math.max(8,position.top),transform:"translateX(-50%)",zIndex:99998,pointerEvents:"auto" }}>
      <div style={{ display:"flex",alignItems:"center",gap:2,borderRadius:16,background:"rgba(255,255,255,0.95)",backdropFilter:"blur(12px)",padding:"4px 6px",boxShadow:"0 4px 24px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)" }}>
        <ToolbarBtn title={t("float.duplicate")} onClick={() => duplicateElement(el.id)}><Copy size={14} /></ToolbarBtn>
        <ToolbarBtn title="Move Up" onClick={() => bringForward(el.id)}><ArrowUp size={14} /></ToolbarBtn>
        <ToolbarBtn title="Move Down" onClick={() => sendBackward(el.id)}><ArrowDown size={14} /></ToolbarBtn>
        <div style={{ width:1,height:20,background:"#e5e7eb",margin:"0 2px" }} />
        <ToolbarBtn title={t("float.delete")} onClick={() => removeElement(el.id)} danger><Trash2 size={14} /></ToolbarBtn>
      </div>
    </div>
  );
}

function ToolbarBtn({ children, title, onClick, danger }: { children: React.ReactNode; title: string; onClick: () => void; danger?: boolean; }) {
  return (
    <button type="button" title={title} onClick={(e) => { e.stopPropagation(); onClick(); }}
      style={{ width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:10,border:"none",background:"transparent",cursor:"pointer",fontSize:14,transition:"background 0.15s",color:danger?"#ef4444":"#4b5563" }}
      onMouseEnter={(e) => { e.currentTarget.style.background=danger?"#fef2f2":"#f3f4f6"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background="transparent"; }}>
      {children}
    </button>
  );
}
