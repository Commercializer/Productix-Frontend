/* ─────────────────────────────────────────────
 * Public Renderer - Production-ready responsive output
 *
 * RESPONSIVE APPROACH: CSS transform: scale()
 *
 * The published page uses CSS to scale the entire
 * design based on the viewport width. The design is
 * rendered at its desktop coordinates and uniformly
 * scaled - exactly like the editor preview.
 *
 * This means:
 * - Design once on desktop → works everywhere
 * - All fonts, padding, images scale together
 * - No media query breakpoints needed
 * - Aspect ratio preserved at every viewport width
 * ──────────────────────────────────────────── */

"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import type { CanvasDocument, Breakpoint, ContentLocale } from "@productix/types";
import { BREAKPOINT_WIDTHS } from "@productix/types";
import { getElementDefinition } from "../elements/registry";
import { isElementInFlow } from "../utils/responsive";
import {
  getEffectiveFlexContainer,
  getEffectiveLayout,
  computeFlexContainerCSS,
  computeElementLayoutCSS,
  generateResponsiveStylesheet,
} from "../engine/layout-engine";
import { getLocalizedProps } from "../utils/localize-props";
import { BlockLink } from "../utils/block-link";
import { CanvasEffects } from "../engine/canvas-effects";
import { PublicPageProvider } from "./public-page-context";

// Import elements to trigger registration
import "../elements";

export interface PublicRendererProps {
  document: CanvasDocument;
  className?: string;
  /** Content locale - defaults to "en" */
  contentLocale?: ContentLocale;
  /** The Product this page represents - needed for feedback / inquiry submissions. */
  productId?: string;
}

/** Detect the breakpoint from a pixel width */
function detectBreakpoint(width: number): Breakpoint {
  if (width <= BREAKPOINT_WIDTHS.mobile + 50) return "mobile";
  if (width <= BREAKPOINT_WIDTHS.tablet + 50) return "tablet";
  if (width <= BREAKPOINT_WIDTHS.laptop + 50) return "laptop";
  return "desktop";
}

export function PublicRenderer({ document: doc, className, contentLocale = "en", productId }: PublicRendererProps) {
  const containerRef = useRef<HTMLElement>(null);
  // Default to 1440 to match SSR output and avoid hydration mismatch.
  // After mount, the ResizeObserver below switches to the real container width.
  const [viewportWidth, setViewportWidth] = useState(1440);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      // Use the container's actual rendered width (excludes scrollbars / parent padding).
      // Falls back to window.innerWidth on the off chance clientWidth is 0.
      const w = el.clientWidth || window.innerWidth;
      setViewportWidth(w);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const breakpoint = detectBreakpoint(viewportWidth);

  // Generate responsive stylesheet for media-query-based layout
  const responsiveCSS = useMemo(() => generateResponsiveStylesheet(doc), [doc]);

  return (
    <PublicPageProvider value={{ productId }}>
      {/* Inject responsive stylesheet */}
      <style dangerouslySetInnerHTML={{ __html: responsiveCSS }} />

      <main
        ref={containerRef}
        className={className}
        data-page-title={doc.pageTitle}
        style={{
          width: "100%",
          maxWidth: "100%",
          overflowX: "hidden",
          margin: 0,
          padding: 0,
        }}
      >
        {doc.artboards.map((ab) => {
          // Separate flow vs absolute elements
          const abElements = ab.elements
            .map((id) => doc.elements[id])
            .filter((el): el is NonNullable<typeof el> => !!el)
            .filter((el) => el.visible);

          const flowElements = abElements.filter((el) => isElementInFlow(el));
          const absoluteElements = abElements.filter((el) => !isElementInFlow(el));
          const hasFlow = flowElements.length > 0;

          // Scale ratio for this artboard
          const scaleRatio = Math.min(1, viewportWidth / ab.width);
          const visualHeight = Math.round(ab.height * scaleRatio);

          // Resolve flex container for current breakpoint
          const flexProps = getEffectiveFlexContainer(ab, breakpoint);
          const flexCSS = computeFlexContainerCSS(flexProps);

          return (
            <section
              key={ab.id}
              aria-label={ab.name}
              className={`ab-${ab.id}`}
              style={{
                width: "100%",
                maxWidth: ab.width,
                height: visualHeight,
                margin: "0 auto",
                overflowX: "hidden",
                overflow: "hidden",
              }}
            >
              {/* Inner: full desktop size, CSS-scaled by viewport */}
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
                {/* Flow elements - rendered in flex container */}
                {hasFlow && (
                  <div
                    style={{
                      ...flexCSS,
                      position: "relative",
                      width: "100%",
                      maxWidth: "100%",
                      minHeight: "100%",
                      zIndex: 1,
                    }}
                  >
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
                            className={`el-${el.id}`}
                            style={{
                              ...layoutCSS,
                              zIndex: el.zIndex,
                              opacity: el.opacity,
                              maxWidth: "100%",
                            }}
                          >
                            <BlockLink element={el}>
                              <Component
                                props={getLocalizedProps(el, contentLocale)}
                                isEditing={false}
                                width={effectiveLayout.widthValue}
                                height={effectiveLayout.heightValue}
                                onPropsChange={() => {}}
                              />
                            </BlockLink>
                          </div>
                        );
                      })}
                  </div>
                )}

                {/* Absolute elements - desktop coordinates, CSS-scaled */}
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
                        className={`el-${el.id}`}
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
                        <BlockLink element={el}>
                          <Component
                            props={getLocalizedProps(el, contentLocale)}
                            isEditing={false}
                            width={width}
                            height={height}
                            onPropsChange={() => {}}
                          />
                        </BlockLink>
                      </div>
                    );
                  })}

              {/* Canvas Effects overlay */}
              {ab.effect && ab.effect !== "none" && (
                <CanvasEffects effect={ab.effect} width={ab.width} height={ab.height} />
              )}
              </div>
            </section>
          );
        })}
      </main>
    </PublicPageProvider>
  );
}
