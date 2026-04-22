/* ─────────────────────────────────────────────
 * Artboard — Clean canvas (no phone frame)
 *
 * Shows the artboard as a clean mobile-sized card
 * with subtle shadow and rounded corners.
 * Inner rendering logic unchanged.
 * ──────────────────────────────────────────── */

"use client";

import React, { useCallback, useMemo } from "react";
import { useCanvasStore } from "./canvas-store";
import { ElementWrapper } from "./element-wrapper";
import { CanvasEffects } from "./canvas-effects";
import { getArtboardPreviewWidth, isElementInFlow } from "../utils/responsive";
import { getEffectiveFlexContainer, getEffectiveLayout, computeFlexContainerCSS } from "./layout-engine";
import type { Artboard as ArtboardType } from "@productix/types";

interface ArtboardProps { artboard: ArtboardType; }

export function Artboard({ artboard }: ArtboardProps) {
  const elements = useCanvasStore((s) => s.document.elements);
  const snapGuides = useCanvasStore((s) => s.snapGuides);
  const deselectAll = useCanvasStore((s) => s.deselectAll);
  const setEditingElement = useCanvasStore((s) => s.setEditingElement);
  const activeBreakpoint = useCanvasStore((s) => s.activeBreakpoint);

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

  return (
    <div style={{ flexShrink:0 }}>
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
    </div>
  );
}
