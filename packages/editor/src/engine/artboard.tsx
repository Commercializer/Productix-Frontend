/* ─────────────────────────────────────────────
 * Artboard — Canvas area with custom dimensions
 *
 * RESPONSIVE APPROACH: CSS transform: scale()
 *
 * Elements are ALWAYS rendered at their desktop
 * positions/sizes. When the breakpoint is not desktop,
 * the entire artboard is wrapped in a CSS transform
 * that scales the whole design uniformly — like
 * zooming out on a website. This means:
 *
 * - Design once on desktop → auto-scales everywhere
 * - All fonts, padding, images, positions scale together
 * - No per-element recalculation needed
 * - No per-breakpoint custom design needed
 * ──────────────────────────────────────────── */

"use client";

import React, { useCallback, useMemo } from "react";
import { useCanvasStore } from "./canvas-store";
import { ElementWrapper } from "./element-wrapper";
import {
  getArtboardPreviewWidth,
  isElementInFlow,
} from "../utils/responsive";
import {
  getEffectiveFlexContainer,
  getEffectiveLayout,
  computeFlexContainerCSS,
} from "./layout-engine";
import type { Artboard as ArtboardType } from "@productix/types";

interface ArtboardProps {
  artboard: ArtboardType;
}

export function Artboard({ artboard }: ArtboardProps) {
  const elements = useCanvasStore((s) => s.document.elements);
  const snapGuides = useCanvasStore((s) => s.snapGuides);
  const deselectAll = useCanvasStore((s) => s.deselectAll);
  const setEditingElement = useCanvasStore((s) => s.setEditingElement);
  const activeBreakpoint = useCanvasStore((s) => s.activeBreakpoint);

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      // Only deselect if clicking directly on the artboard (not on an element)
      if ((e.target as HTMLElement).dataset.artboardBg === "true") {
        deselectAll();
        setEditingElement(null);
      }
    },
    [deselectAll, setEditingElement]
  );

  // Preview width for the active breakpoint
  const previewWidth = getArtboardPreviewWidth(artboard.width, activeBreakpoint);

  // Scale ratio: entire artboard scales by this single value
  const scaleRatio = previewWidth / artboard.width;

  // Scaled visual dimensions (how big the artboard appears on screen)
  const visualHeight = Math.round(artboard.height * scaleRatio);

  // Get elements belonging to this artboard, sorted by zIndex
  const artboardElements = artboard.elements
    .map((id) => elements[id])
    .filter((el): el is NonNullable<typeof el> => !!el)
    .sort((a, b) => a.zIndex - b.zIndex);

  // Separate flow and absolute elements
  const flowElements = artboardElements.filter((el) => isElementInFlow(el));
  const absoluteElements = artboardElements.filter((el) => !isElementInFlow(el));

  // Resolve flex container props for current breakpoint
  const flexContainerProps = useMemo(
    () => getEffectiveFlexContainer(artboard, activeBreakpoint),
    [artboard, activeBreakpoint]
  );
  const flexCSS = useMemo(
    () => computeFlexContainerCSS(flexContainerProps),
    [flexContainerProps]
  );

  const hasFlowElements = flowElements.length > 0;

  // The inner artboard always renders at FULL desktop size
  const innerArtboard = (
    <div
      style={{
        position: "relative",
        width: artboard.width,
        height: artboard.height,
        backgroundColor: artboard.backgroundColor,
        backgroundImage: artboard.backgroundImage ? `url(${artboard.backgroundImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "visible",
      }}
      onClick={handleCanvasClick}
    >
      {/* Clickable background area */}
      <div
        data-artboard-bg="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
        }}
      />

      {/* ── Flow Layout Container ── */}
      {hasFlowElements && (
        <div
          data-artboard-bg="true"
          style={{
            ...flexCSS,
            position: "relative",
            width: "100%",
            minHeight: "100%",
            zIndex: 1,
          }}
        >
          {flowElements.map((el) => {
            const effectiveLayout = getEffectiveLayout(el, activeBreakpoint);
            return (
              <ElementWrapper
                key={el.id}
                element={el}
                effectiveTransform={el.transform}
                effectiveLayout={effectiveLayout}
              />
            );
          })}
        </div>
      )}

      {/* ── Absolute Elements — always at desktop coordinates ── */}
      {absoluteElements.map((el) => (
        <ElementWrapper
          key={el.id}
          element={el}
          effectiveTransform={el.transform}
        />
      ))}

      {/* Snap guides */}
      {snapGuides.map((guide, i) =>
        guide.orientation === "horizontal" ? (
          <div
            key={`guide-h-${i}`}
            style={{
              position: "absolute",
              top: guide.position,
              left: 0,
              width: "100%",
              height: 0,
              borderTop: "1px dashed #3b82f6",
              pointerEvents: "none",
              zIndex: 99999,
            }}
          />
        ) : (
          <div
            key={`guide-v-${i}`}
            style={{
              position: "absolute",
              left: guide.position,
              top: 0,
              width: 0,
              height: "100%",
              borderLeft: "1px dashed #3b82f6",
              pointerEvents: "none",
              zIndex: 99999,
            }}
          />
        )
      )}
    </div>
  );

  return (
    <div style={{ flexShrink: 0, transition: "width 0.3s ease, height 0.3s ease" }}>
      {/* Artboard label */}
      <div
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: "#6b7280",
          pointerEvents: "none",
          whiteSpace: "nowrap",
          marginBottom: 8,
        }}
      >
        {artboard.name} — {previewWidth}×{visualHeight}
        {activeBreakpoint !== "desktop" && (
          <span style={{ marginLeft: 6, fontSize: 10, color: "#3b82f6", fontWeight: 600 }}>
            {activeBreakpoint.charAt(0).toUpperCase() + activeBreakpoint.slice(1)}
            {" "}({Math.round(scaleRatio * 100)}%)
          </span>
        )}
        {hasFlowElements && (
          <span style={{ marginLeft: 6, fontSize: 10, color: "#10b981", fontWeight: 600 }}>
            Flow
          </span>
        )}
      </div>

      {/* Outer container: sized to the VISUAL (scaled) dimensions */}
      <div
        style={{
          width: previewWidth,
          height: visualHeight,
          overflow: "hidden",
          boxShadow: "0 4px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)",
          borderRadius: 2,
        }}
      >
        {/* Inner: full desktop size, CSS-scaled down */}
        <div
          style={{
            width: artboard.width,
            height: artboard.height,
            transform: `scale(${scaleRatio})`,
            transformOrigin: "top left",
          }}
        >
          {innerArtboard}
        </div>
      </div>
    </div>
  );
}
