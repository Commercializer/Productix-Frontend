/* ─────────────────────────────────────────────
 * Artboard — Clean canvas (no phone frame)
 *
 * Shows the artboard as a clean mobile-sized card
 * with subtle shadow and rounded corners.
 * Inner rendering logic unchanged.
 * ──────────────────────────────────────────── */

"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { useCanvasStore } from "./canvas-store";
import { ElementWrapper } from "./element-wrapper";
import { CanvasEffects } from "./canvas-effects";
import { getArtboardPreviewWidth, isElementInFlow } from "../utils/responsive";
import { getEffectiveFlexContainer, getEffectiveLayout, computeFlexContainerCSS } from "./layout-engine";
import type { Artboard as ArtboardType } from "@productix/types";

const MIN_ARTBOARD_HEIGHT = 200;

interface ArtboardProps { artboard: ArtboardType; }

export function Artboard({ artboard }: ArtboardProps) {
  const elements = useCanvasStore((s) => s.document.elements);
  const snapGuides = useCanvasStore((s) => s.snapGuides);
  const deselectAll = useCanvasStore((s) => s.deselectAll);
  const setEditingElement = useCanvasStore((s) => s.setEditingElement);
  const activeBreakpoint = useCanvasStore((s) => s.activeBreakpoint);
  const zoom = useCanvasStore((s) => s.zoom);
  const updateArtboard = useCanvasStore((s) => s.updateArtboard);
  const pushHistory = useCanvasStore((s) => s.pushHistory);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).dataset.artboardBg === "true") { deselectAll(); setEditingElement(null); }
  }, [deselectAll, setEditingElement]);

  const previewWidth = getArtboardPreviewWidth(artboard.width, activeBreakpoint);
  const scaleRatio = previewWidth / artboard.width;
  const visualHeight = Math.round(artboard.height * scaleRatio);

  const artboardElements = artboard.elements.map((id) => elements[id]).filter((el): el is NonNullable<typeof el> => !!el).sort((a, b) => a.zIndex - b.zIndex);
  const flowElements = artboardElements.filter((el) => isElementInFlow(el));
  const absoluteElements = artboardElements.filter((el) => !isElementInFlow(el));

  const flexContainerProps = useMemo(() => getEffectiveFlexContainer(artboard, activeBreakpoint), [artboard, activeBreakpoint]);
  const flexCSS = useMemo(() => computeFlexContainerCSS(flexContainerProps), [flexContainerProps]);
  const hasFlowElements = flowElements.length > 0;

  const innerArtboard = (
    <div style={{ position:"relative",width:artboard.width,height:artboard.height,backgroundColor:artboard.backgroundColor,backgroundImage:artboard.backgroundImage?`url(${artboard.backgroundImage})`:undefined,backgroundSize:"cover",backgroundPosition:"center",overflow:"visible" }} onClick={handleCanvasClick}>
      <div data-artboard-bg="true" style={{ position:"absolute",inset:0,zIndex:0 }} />
      {hasFlowElements && (
        <div data-artboard-bg="true" style={{ ...flexCSS,position:"relative",width:"100%",minHeight:"100%",zIndex:1 }}>
          {flowElements.map((el) => <ElementWrapper key={el.id} element={el} effectiveTransform={el.transform} effectiveLayout={getEffectiveLayout(el, activeBreakpoint)} />)}
        </div>
      )}
      {absoluteElements.map((el) => <ElementWrapper key={el.id} element={el} effectiveTransform={el.transform} />)}
      {artboard.effect && artboard.effect !== "none" && (
        <CanvasEffects effect={artboard.effect} width={artboard.width} height={artboard.height} />
      )}
      {snapGuides.map((guide, i) => guide.orientation === "horizontal"
        ? <div key={`guide-h-${i}`} style={{ position:"absolute",top:guide.position,left:0,width:"100%",height:0,borderTop:"1px dashed #0ea5e9",pointerEvents:"none",zIndex:99999 }} />
        : <div key={`guide-v-${i}`} style={{ position:"absolute",left:guide.position,top:0,width:0,height:"100%",borderLeft:"1px dashed #0ea5e9",pointerEvents:"none",zIndex:99999 }} />
      )}
    </div>
  );

  const resizeRef = useRef<{ startY: number; startHeight: number; combinedScale: number } | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [hoverHandle, setHoverHandle] = useState(false);

  const onHandlePointerDown = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    pushHistory();
    resizeRef.current = {
      startY: e.clientY,
      startHeight: artboard.height,
      combinedScale: zoom * scaleRatio,
    };
    setIsResizing(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [pushHistory, artboard.height, zoom, scaleRatio]);

  const onHandlePointerMove = useCallback((e: React.PointerEvent) => {
    const state = resizeRef.current;
    if (!state) return;
    const screenDelta = e.clientY - state.startY;
    const modelDelta = screenDelta / state.combinedScale;
    const next = Math.max(MIN_ARTBOARD_HEIGHT, Math.round(state.startHeight + modelDelta));
    if (next !== artboard.height) updateArtboard(artboard.id, { height: next });
  }, [artboard.height, artboard.id, updateArtboard]);

  const onHandlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!resizeRef.current) return;
    resizeRef.current = null;
    setIsResizing(false);
    try { (e.target as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
  }, []);

  const handleActive = isResizing || hoverHandle;

  return (
    <div style={{ flexShrink:0, position:"relative" }}>
      <div style={{
        width: previewWidth,
        height: visualHeight,
        overflow: "hidden",
        borderRadius: 12,
        boxShadow: "0 4px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
        background: "#fff",
      }}>
        <div style={{ width:artboard.width, height:artboard.height, transform:`scale(${scaleRatio})`, transformOrigin:"top left" }}>
          {innerArtboard}
        </div>
      </div>

      {/* Bottom resize handle — drag to expand artboard height */}
      <div
        onPointerDown={onHandlePointerDown}
        onPointerMove={onHandlePointerMove}
        onPointerUp={onHandlePointerUp}
        onPointerCancel={onHandlePointerUp}
        onMouseEnter={() => setHoverHandle(true)}
        onMouseLeave={() => setHoverHandle(false)}
        title="Drag to resize height"
        style={{
          position: "absolute",
          left: "50%",
          bottom: -14,
          transform: "translateX(-50%)",
          width: 64,
          height: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "ns-resize",
          touchAction: "none",
          zIndex: 10,
        }}
      >
        <div style={{
          width: handleActive ? 56 : 40,
          height: 5,
          borderRadius: 999,
          background: handleActive
            ? "linear-gradient(135deg,#0ea5e9,#0284c7)"
            : "rgba(15,23,42,0.18)",
          boxShadow: handleActive ? "0 4px 14px rgba(2,132,199,0.35)" : "0 1px 2px rgba(15,23,42,0.08)",
          transition: "width 0.15s ease, background 0.15s ease, box-shadow 0.15s ease",
        }} />
        {isResizing && (
          <div style={{
            position: "absolute",
            top: 22,
            left: "50%",
            transform: "translateX(-50%)",
            background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
            color: "#fff",
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: "0.02em",
            padding: "3px 10px",
            borderRadius: 999,
            whiteSpace: "nowrap",
            boxShadow: "0 6px 18px rgba(2,132,199,0.32), inset 0 1px 0 rgba(255,255,255,0.25)",
            pointerEvents: "none",
          }}>
            H {artboard.height}px
          </div>
        )}
      </div>
    </div>
  );
}
