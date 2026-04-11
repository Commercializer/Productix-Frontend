/* ─────────────────────────────────────────────
 * Public Renderer — Minimal output for public pages
 *
 * Same as PreviewRenderer but with semantic HTML
 * and optimized for public-facing pages.
 *
 * Responsive: auto-detects viewport breakpoint
 * and uses getEffectiveTransform for layout.
 * Uses CSS transform: scale() to fit the artboard
 * to the actual viewport width.
 * ──────────────────────────────────────────── */

"use client";

import React, { useEffect, useState } from "react";
import type { CanvasDocument, Breakpoint } from "@productix/types";
import { BREAKPOINT_WIDTHS } from "@productix/types";
import { getElementDefinition } from "../elements/registry";
import { getEffectiveTransform, getArtboardPreviewWidth, getArtboardPreviewHeight } from "../utils/responsive";

// Import elements to trigger registration
import "../elements";

export interface PublicRendererProps {
  document: CanvasDocument;
  className?: string;
}

/** Detect the breakpoint from a pixel width */
function detectBreakpoint(width: number): Breakpoint {
  if (width <= BREAKPOINT_WIDTHS.mobile + 50) return "mobile";
  if (width <= BREAKPOINT_WIDTHS.tablet + 50) return "tablet";
  if (width <= BREAKPOINT_WIDTHS.laptop + 50) return "laptop";
  return "desktop";
}

export function PublicRenderer({ document: doc, className }: PublicRendererProps) {
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1440
  );

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const breakpoint = detectBreakpoint(viewportWidth);

  return (
    <main
      className={className}
      data-page-title={doc.pageTitle}
    >
      {doc.artboards.map((ab) => {
        const previewWidth = getArtboardPreviewWidth(ab.width, breakpoint);
        const previewHeight = getArtboardPreviewHeight(ab.width, ab.height, breakpoint);

        // Scale the artboard to fit the actual viewport width
        const scale = Math.min(1, viewportWidth / previewWidth);

        return (
          <section
            key={ab.id}
            aria-label={ab.name}
            style={{
              position: "relative",
              width: previewWidth,
              height: previewHeight,
              backgroundColor: ab.backgroundColor,
              backgroundImage: ab.backgroundImage ? `url(${ab.backgroundImage})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
              margin: "0 auto",
              overflow: "hidden",
              transform: scale < 1 ? `scale(${scale})` : undefined,
              transformOrigin: "top center",
            }}
          >
            {ab.elements
              .map((id) => doc.elements[id])
              .filter((el): el is NonNullable<typeof el> => !!el)
              .filter((el) => el.visible)
              .sort((a, b) => a.zIndex - b.zIndex)
              .map((el) => {
                const def = getElementDefinition(el.type);
                if (!def) return null;

                const Component = def.component;
                const effectiveT = getEffectiveTransform(el, breakpoint, ab.width);
                const { x, y, width, height, rotation } = effectiveT;

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
          </section>
        );
      })}
    </main>
  );
}
