/* ─────────────────────────────────────────────
 * Preview Renderer — Responsive preview with viewport controls
 *
 * Features:
 * - Device viewport presets (Desktop, Laptop, Tablet, Mobile)
 * - Zoom/fit controls
 * - True responsive rendering using flex layout for flow elements
 * - Clean, no-editor-UI render of all artboards
 * - Supports both absolute and flow layout modes
 * ──────────────────────────────────────────── */

"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import type { CanvasDocument, Breakpoint } from "@productix/types";
import { BREAKPOINT_WIDTHS, DEFAULT_FLEX_CONTAINER } from "@productix/types";
import { getElementDefinition } from "../elements/registry";
import { getArtboardPreviewWidth, isElementInFlow } from "../utils/responsive";
import { getEffectiveFlexContainer, getEffectiveLayout, computeFlexContainerCSS, computeElementLayoutCSS } from "../engine/layout-engine";

// Import elements to trigger registration
import "../elements";

/* ─── Viewport Presets ─────────────────────── */

const VIEWPORT_PRESETS: { label: string; icon: string; bp: Breakpoint; width: number; height: number }[] = [
  { label: "Responsive", icon: "🔄", bp: "desktop", width: 0, height: 0 }, // 0 = full available
  { label: "Desktop", icon: "🖥", bp: "desktop", width: 1440, height: 900 },
  { label: "Laptop", icon: "💻", bp: "laptop", width: 1280, height: 800 },
  { label: "Tablet", icon: "📱", bp: "tablet", width: 768, height: 1024 },
  { label: "Mobile", icon: "📲", bp: "mobile", width: 375, height: 812 },
  { label: "Mobile L", icon: "📲", bp: "mobile", width: 428, height: 926 },
];

/** Map a viewport width to the nearest breakpoint */
function widthToBreakpoint(width: number): Breakpoint {
  if (width <= 0) return "desktop";
  if (width <= BREAKPOINT_WIDTHS.mobile + 50) return "mobile";
  if (width <= BREAKPOINT_WIDTHS.tablet + 50) return "tablet";
  if (width <= BREAKPOINT_WIDTHS.laptop + 50) return "laptop";
  return "desktop";
}

export interface PreviewRendererProps {
  document: CanvasDocument;
  className?: string;
  /** If true, render with built-in viewport controls toolbar */
  showControls?: boolean;
}

/* ─── Preview Content (renders artboards) ──── */

function PreviewContent({
  doc,
  zoom,
  breakpoint,
  frameWidth,
}: {
  doc: CanvasDocument;
  zoom: number;
  breakpoint: Breakpoint;
  frameWidth?: number;
}) {
  return (
    <div
      style={{
        transform: `scale(${zoom})`,
        transformOrigin: "top center",
        display: "inline-flex",
        flexDirection: "column",
        width: frameWidth ? frameWidth / zoom : undefined,
      }}
    >
      {doc.artboards.map((ab) => {
        const previewWidth = getArtboardPreviewWidth(ab.width, breakpoint);
        const scaleRatio = previewWidth / ab.width;
        const visualHeight = Math.round(ab.height * scaleRatio);

        // Separate flow vs absolute elements
        const abElements = ab.elements
          .map((id) => doc.elements[id])
          .filter((el): el is NonNullable<typeof el> => !!el)
          .filter((el) => el.visible);

        const flowElements = abElements.filter((el) => isElementInFlow(el));
        const absoluteElements = abElements.filter((el) => !isElementInFlow(el));

        // Resolve flex container for this breakpoint
        const flexProps = getEffectiveFlexContainer(ab, breakpoint);
        const flexCSS = computeFlexContainerCSS(flexProps);
        const hasFlow = flowElements.length > 0;

        return (
          <div
            key={ab.id}
            style={{
              width: previewWidth,
              height: visualHeight,
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            {/* Inner: full desktop size, CSS-scaled down */}
            <div
              style={{
                width: ab.width,
                height: ab.height,
                transform: `scale(${scaleRatio})`,
                transformOrigin: "top left",
                position: "relative",
                backgroundColor: ab.backgroundColor,
                backgroundImage: ab.backgroundImage ? `url(${ab.backgroundImage})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Flow layout container */}
              {hasFlow && (
                <div style={{ ...flexCSS, position: "relative", width: "100%", minHeight: "100%", zIndex: 1 }}>
                  {flowElements
                    .sort((a, b) => a.zIndex - b.zIndex)
                    .map((el) => {
                      const def = getElementDefinition(el.type);
                      if (!def) return null;

                      const Component = def.component;
                      const effectiveLayout = getEffectiveLayout(el, breakpoint);
                      if (effectiveLayout.hidden) return null;
                      const layoutCSS = computeElementLayoutCSS(effectiveLayout);

                      return (
                        <div
                          key={el.id}
                          style={{
                            ...layoutCSS,
                            zIndex: el.zIndex,
                            opacity: el.opacity,
                          }}
                        >
                          <Component
                            props={el.props}
                            isEditing={false}
                            width={effectiveLayout.widthValue}
                            height={effectiveLayout.heightValue}
                            onPropsChange={() => {}}
                          />
                        </div>
                      );
                    })}
                </div>
              )}

              {/* Absolute elements — always at desktop coordinates */}
              {absoluteElements
                .sort((a, b) => a.zIndex - b.zIndex)
                .map((el) => {
                  const def = getElementDefinition(el.type);
                  if (!def) return null;

                  const Component = def.component;
                  const { x, y, width, height, rotation } = el.transform;

                  return (
                    <div
                      key={el.id}
                      style={{
                        position: "absolute",
                        left: x,
                        top: y,
                        width,
                        height,
                        transform: rotation ? `rotate(${rotation}deg)` : undefined,
                        zIndex: el.zIndex,
                        opacity: el.opacity,
                      }}
                    >
                      <Component
                        props={el.props}
                        isEditing={false}
                        width={width}
                        height={height}
                        onPropsChange={() => {}}
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Main Preview Renderer ─────────────────── */

export function PreviewRenderer({
  document: doc,
  className,
  showControls = false,
}: PreviewRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportIdx, setViewportIdx] = useState(0);
  const [previewZoom, setPreviewZoom] = useState(1);

  const activePreset = VIEWPORT_PRESETS[viewportIdx] ?? VIEWPORT_PRESETS[0]!;
  const activeBreakpoint: Breakpoint = activePreset.width === 0
    ? "desktop"
    : activePreset.bp;

  // Auto-fit: compute zoom so the widest artboard fits in the viewport frame
  const computeAutoFit = useCallback(() => {
    if (!containerRef.current) return 1;
    const rect = containerRef.current.getBoundingClientRect();

    // Determine the frame we're fitting into
    let frameW: number;
    let frameH: number;
    if (activePreset.width === 0) {
      frameW = rect.width - 32; // some padding
      frameH = rect.height - 32;
    } else {
      frameW = Math.min(activePreset.width, rect.width - 32);
      frameH = Math.min(activePreset.height, rect.height - 32);
    }

    if (frameW <= 0 || frameH <= 0) return 1;

    const maxArtboardW = Math.max(1, ...doc.artboards.map((a) =>
      getArtboardPreviewWidth(a.width, activeBreakpoint)
    ));
    const totalH = doc.artboards.reduce((sum, a) => {
      const previewW = getArtboardPreviewWidth(a.width, activeBreakpoint);
      const ratio = previewW / a.width;
      return sum + Math.round(a.height * ratio);
    }, 0);

    const fitW = frameW / maxArtboardW;
    const fitH = frameH / totalH;

    return Math.min(fitW, fitH, 1);
  }, [doc.artboards, activePreset, activeBreakpoint]);

  // Recompute zoom when viewport or window changes
  useEffect(() => {
    const zoom = computeAutoFit();
    setPreviewZoom(zoom);
  }, [computeAutoFit, viewportIdx]);

  // Also recompute on window resize
  useEffect(() => {
    const onResize = () => setPreviewZoom(computeAutoFit());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [computeAutoFit]);

  if (!showControls) {
    // Simple mode — no controls, just render centered
    return (
      <div className={className} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <PreviewContent doc={doc} zoom={1} breakpoint="desktop" />
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${className || ""}`}>
      {/* Viewport toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 flex-shrink-0">
        {/* Presets */}
        <div className="flex items-center gap-1">
          {VIEWPORT_PRESETS.map((p, i) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setViewportIdx(i)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors ${
                viewportIdx === i
                  ? "bg-blue-50 text-blue-600 border border-blue-200"
                  : "text-gray-500 hover:bg-gray-50 border border-transparent"
              }`}
            >
              <span>{p.icon}</span>
              <span className="hidden sm:inline">{p.label}</span>
            </button>
          ))}
        </div>

        {/* Size indicator + zoom */}
        <div className="flex items-center gap-3 text-xs text-gray-400">
          {activePreset.width > 0 && (
            <span className="font-mono">
              {activePreset.width}×{activePreset.height}
            </span>
          )}
          <span className="font-medium">{Math.round(previewZoom * 100)}%</span>
        </div>
      </div>

      {/* Preview frame */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto bg-gray-100"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: activePreset.width > 0 ? "flex-start" : "center",
          padding: 16,
        }}
      >
        {/* Device frame */}
        <div
          style={{
            width: activePreset.width > 0 ? activePreset.width * previewZoom : "100%",
            maxWidth: "100%",
            overflow: "hidden",
            borderRadius: activePreset.width > 0 ? 8 : 0,
            boxShadow: activePreset.width > 0
              ? "0 4px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)"
              : "none",
            backgroundColor: "#ffffff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <PreviewContent
            doc={doc}
            zoom={previewZoom}
            breakpoint={activeBreakpoint}
            frameWidth={activePreset.width > 0 ? activePreset.width * previewZoom : undefined}
          />
        </div>
      </div>
    </div>
  );
}
