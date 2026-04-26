/* ─────────────────────────────────────────────
 * Floating Toolbar — Light theme
 *
 * Shows contextual actions above the selected
 * element(s). Supports single and multi-selection.
 * Includes Group / Ungroup actions.
 * ──────────────────────────────────────────── */

"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Copy, ArrowUp, ArrowDown, Trash2, Group, Ungroup } from "lucide-react";
import { useCanvasStore } from "../engine/canvas-store";
import { useTranslation } from "../i18n";

interface FloatingToolbarProps {
  canvasRef: React.RefObject<HTMLDivElement | null>;
  zoom: number;
}

export function FloatingToolbar({ canvasRef, zoom }: FloatingToolbarProps) {
  const selectedIds = useCanvasStore((s) => s.selectedIds);
  const elements = useCanvasStore((s) => s.document.elements);
  const groups = useCanvasStore((s) => s.document.groups);
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null);

  const updatePosition = useCallback(() => {
    if (selectedIds.length === 0 || !canvasRef.current) { setPosition(null); return; }

    // For multi-selection, compute bounding box of all selected elements
    const canvasRect = canvasRef.current.getBoundingClientRect();
    let minLeft = Infinity, minTop = Infinity, maxRight = -Infinity;

    for (const selId of selectedIds) {
      const elNode = canvasRef.current.querySelector(`[data-element-id="${selId}"]`);
      if (!elNode) continue;
      const elRect = elNode.getBoundingClientRect();
      minLeft = Math.min(minLeft, elRect.left);
      minTop = Math.min(minTop, elRect.top);
      maxRight = Math.max(maxRight, elRect.right);
    }

    if (minLeft === Infinity) { setPosition(null); return; }

    setPosition({
      left: (minLeft + maxRight) / 2 - canvasRect.left + canvasRef.current.scrollLeft,
      top: minTop - canvasRect.top + canvasRef.current.scrollTop - 52,
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

  if (selectedIds.length === 0 || !position) return null;

  // Determine if this is a group context
  const selectedElements = selectedIds.map((id) => elements[id]).filter(Boolean);
  if (selectedElements.length === 0) return null;

  // Check if all selected elements share the same group
  const commonGroupId = selectedElements[0]?.groupId;
  const allSameGroup = commonGroupId && selectedElements.every((el) => el?.groupId === commonGroupId);

  if (selectedIds.length === 1) {
    const selId = selectedIds[0]!;
    const el = elements[selId];
    if (!el) return null;
    return <FloatingToolbarSingle position={position} el={el} allSameGroup={!!allSameGroup} commonGroupId={commonGroupId ?? null} />;
  }

  return <FloatingToolbarMulti position={position} selectedIds={selectedIds} allSameGroup={!!allSameGroup} commonGroupId={allSameGroup ? commonGroupId! : null} />;
}

function FloatingToolbarSingle({ position, el, allSameGroup, commonGroupId }: { position: { left: number; top: number }; el: { id: string; locked: boolean; groupId?: string }; allSameGroup: boolean; commonGroupId: string | null; }) {
  const duplicateElement = useCanvasStore((s) => s.duplicateElement);
  const removeElement = useCanvasStore((s) => s.removeElement);
  const bringForward = useCanvasStore((s) => s.bringForward);
  const sendBackward = useCanvasStore((s) => s.sendBackward);
  const ungroupElements = useCanvasStore((s) => s.ungroupElements);
  const { t } = useTranslation();

  return (
    <div style={{ position:"absolute",left:position.left,top:Math.max(8,position.top),transform:"translateX(-50%)",zIndex:99998,pointerEvents:"auto" }}>
      <div style={{ display:"flex",alignItems:"center",gap:2,borderRadius:16,background:"rgba(255,255,255,0.95)",backdropFilter:"blur(12px)",padding:"4px 6px",boxShadow:"0 4px 24px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)" }}>
        <ToolbarBtn title={t("float.duplicate")} onClick={() => duplicateElement(el.id)}><Copy size={14} /></ToolbarBtn>
        <ToolbarBtn title="Move Up" onClick={() => bringForward(el.id)}><ArrowUp size={14} /></ToolbarBtn>
        <ToolbarBtn title="Move Down" onClick={() => sendBackward(el.id)}><ArrowDown size={14} /></ToolbarBtn>
        {allSameGroup && commonGroupId && (
          <>
            <div style={{ width:1,height:20,background:"#e5e7eb",margin:"0 2px" }} />
            <ToolbarBtn title="Ungroup" onClick={() => ungroupElements(commonGroupId)} accent>
              <Ungroup size={14} />
            </ToolbarBtn>
          </>
        )}
        <div style={{ width:1,height:20,background:"#e5e7eb",margin:"0 2px" }} />
        <ToolbarBtn title={t("float.delete")} onClick={() => removeElement(el.id)} danger><Trash2 size={14} /></ToolbarBtn>
      </div>
    </div>
  );
}

function FloatingToolbarMulti({ position, selectedIds, allSameGroup, commonGroupId }: { position: { left: number; top: number }; selectedIds: string[]; allSameGroup: boolean; commonGroupId: string | null; }) {
  const groupElements = useCanvasStore((s) => s.groupElements);
  const ungroupElements = useCanvasStore((s) => s.ungroupElements);
  const removeElement = useCanvasStore((s) => s.removeElement);
  const duplicateElement = useCanvasStore((s) => s.duplicateElement);
  const { t } = useTranslation();

  return (
    <div style={{ position:"absolute",left:position.left,top:Math.max(8,position.top),transform:"translateX(-50%)",zIndex:99998,pointerEvents:"auto" }}>
      <div style={{ display:"flex",alignItems:"center",gap:2,borderRadius:16,background:"rgba(255,255,255,0.95)",backdropFilter:"blur(12px)",padding:"4px 6px",boxShadow:"0 4px 24px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)" }}>
        <div style={{ fontSize:10,fontWeight:600,color:"#9ca3af",padding:"0 6px",whiteSpace:"nowrap" }}>
          {selectedIds.length} selected
        </div>
        <div style={{ width:1,height:20,background:"#e5e7eb",margin:"0 2px" }} />
        {allSameGroup && commonGroupId ? (
          <ToolbarBtn title="Ungroup blocks" onClick={() => ungroupElements(commonGroupId)} accent>
            <Ungroup size={14} />
            <span style={{ fontSize:10,fontWeight:600,marginLeft:3 }}>Ungroup</span>
          </ToolbarBtn>
        ) : (
          <ToolbarBtn title="Group selected blocks" onClick={() => groupElements(selectedIds)} accent>
            <Group size={14} />
            <span style={{ fontSize:10,fontWeight:600,marginLeft:3 }}>Group</span>
          </ToolbarBtn>
        )}
        <div style={{ width:1,height:20,background:"#e5e7eb",margin:"0 2px" }} />
        <ToolbarBtn title={t("float.delete")} onClick={() => selectedIds.forEach((id) => removeElement(id))} danger><Trash2 size={14} /></ToolbarBtn>
      </div>
    </div>
  );
}

function ToolbarBtn({ children, title, onClick, danger, accent }: { children: React.ReactNode; title: string; onClick: () => void; danger?: boolean; accent?: boolean; }) {
  return (
    <button type="button" title={title} onClick={(e) => { e.stopPropagation(); onClick(); }}
      style={{ display:"flex",alignItems:"center",justifyContent:"center",padding:"4px 8px",height:32,borderRadius:10,border:"none",background:"transparent",cursor:"pointer",fontSize:14,transition:"background 0.15s",color:danger?"#ef4444":accent?"#8b5cf6":"#4b5563" }}
      onMouseEnter={(e) => { e.currentTarget.style.background=danger?"#fef2f2":accent?"#f5f3ff":"#f3f4f6"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background="transparent"; }}>
      {children}
    </button>
  );
}
