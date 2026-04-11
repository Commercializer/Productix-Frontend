/* ─────────────────────────────────────────────
 * Artboard — Canvas area with custom dimensions
 *
 * Renders element wrappers inside a sized area.
 * Supports background color/image and snap guides.
 * Responsive: renders at the active breakpoint width
 * with auto-scaled or overridden element transforms.
 * ──────────────────────────────────────────── */

"use client";

import React, { useCallback } from "react";
import { useCanvasStore } from "./canvas-store";
import { ElementWrapper } from "./element-wrapper";
import { getEffectiveTransform, getArtboardPreviewWidth, getArtboardPreviewHeight } from "../utils/responsive";
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

  // Compute preview dimensions for the active breakpoint
  const previewWidth = getArtboardPreviewWidth(artboard.width, activeBreakpoint);
  const previewHeight = getArtboardPreviewHeight(artboard.width, artboard.height, activeBreakpoint);

  // Get elements belonging to this artboard, sorted by zIndex
  const artboardElements = artboard.elements
    .map((id) => elements[id])
    .filter((el): el is NonNullable<typeof el> => !!el)
    .sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div
      style={{
        position: "relative",
        width: previewWidth,
        height: previewHeight,
        backgroundColor: artboard.backgroundColor,
        backgroundImage: artboard.backgroundImage ? `url(${artboard.backgroundImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: "0 4px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)",
        borderRadius: 2,
        overflow: "visible", // Allow cross-section placement
        flexShrink: 0,
        transition: "width 0.3s ease, height 0.3s ease",
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

      {/* Elements */}
      {artboardElements.map((el) => {
        const effectiveTransform = getEffectiveTransform(el, activeBreakpoint, artboard.width);
        return (
          <ElementWrapper
            key={el.id}
            element={el}
            effectiveTransform={effectiveTransform}
          />
        );
      })}

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

      {/* Artboard label */}
      <div
        style={{
          position: "absolute",
          top: -28,
          left: 0,
          fontSize: 12,
          fontWeight: 500,
          color: "#6b7280",
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        {artboard.name} — {previewWidth}×{previewHeight}
        {activeBreakpoint !== "desktop" && (
          <span style={{ marginLeft: 6, fontSize: 10, color: "#3b82f6", fontWeight: 600 }}>
            {activeBreakpoint.charAt(0).toUpperCase() + activeBreakpoint.slice(1)}
          </span>
        )}
      </div>
    </div>
  );
}
