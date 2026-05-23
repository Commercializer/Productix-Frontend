/* ─────────────────────────────────────────────
 * Layout Engine - Responsive CSS generation
 *
 * Core computation engine that converts the
 * document data model into responsive CSS styles.
 *
 * Key functions:
 * - getEffectiveLayout: resolve layout props with
 *   breakpoint cascade (mobile-first)
 * - getEffectiveFlexContainer: resolve flex container
 *   props with breakpoint cascade
 * - computeElementCSS: generate inline CSS for element
 * - computeFlexContainerCSS: generate flex container CSS
 * - generateResponsiveStylesheet: full media-query CSS
 * ──────────────────────────────────────────── */

import type {
  Breakpoint,
  ElementNode,
  Artboard,
  CanvasDocument,
  LayoutProps,
  FlexContainerProps,
  SizeUnit,
} from "@productix/types";
import {
  BREAKPOINTS_MOBILE_FIRST,
  BREAKPOINT_MIN_WIDTHS,
  DEFAULT_LAYOUT_PROPS,
  DEFAULT_FLEX_CONTAINER,
} from "@productix/types";

/* ─── Layout Resolution ────────────────────── */

/**
 * Check if an element is in flow mode.
 * Elements without layout field default to absolute mode (backward compat).
 */
export function isFlowElement(element: ElementNode): boolean {
  return element.layout?.layoutMode === "flow";
}

/**
 * Resolve effective layout props for a flow-mode element at a given breakpoint.
 * Uses mobile-first cascade: base → mobile → tablet → laptop → desktop.
 */
export function getEffectiveLayout(
  element: ElementNode,
  breakpoint: Breakpoint,
): LayoutProps {
  const base: LayoutProps = element.layout ?? DEFAULT_LAYOUT_PROPS;

  // Find the index of the target breakpoint in the mobile-first order
  const targetIdx = BREAKPOINTS_MOBILE_FIRST.indexOf(breakpoint);
  if (targetIdx <= 0) return base; // mobile = base

  // Cascade: apply overrides from each breakpoint up to the target
  let result = { ...base };
  for (let i = 1; i <= targetIdx; i++) {
    const bp = BREAKPOINTS_MOBILE_FIRST[i];
    if (!bp) continue;
    const override = element.responsiveLayout?.[bp];
    if (override) {
      result = { ...result, ...override };
      // Deep-merge margin and padding arrays if provided
      if (override.margin) result.margin = [...override.margin] as [number, number, number, number];
      if (override.padding) result.padding = [...override.padding] as [number, number, number, number];
    }
  }

  return result;
}

/**
 * Resolve effective flex container props for an artboard at a given breakpoint.
 */
export function getEffectiveFlexContainer(
  artboard: Artboard,
  breakpoint: Breakpoint,
): FlexContainerProps {
  const base: FlexContainerProps = artboard.flexContainer ?? DEFAULT_FLEX_CONTAINER;

  const targetIdx = BREAKPOINTS_MOBILE_FIRST.indexOf(breakpoint);
  if (targetIdx <= 0) return base;

  let result = { ...base };
  for (let i = 1; i <= targetIdx; i++) {
    const bp = BREAKPOINTS_MOBILE_FIRST[i];
    if (!bp) continue;
    const override = artboard.responsiveFlexContainer?.[bp];
    if (override) {
      result = { ...result, ...override };
      if (override.padding) result.padding = [...override.padding] as [number, number, number, number];
    }
  }

  return result;
}

/* ─── CSS Generation ───────────────────────── */

/**
 * Convert a size value + unit to a CSS string.
 */
function sizeToCss(value: number, unit: SizeUnit): string {
  if (unit === "auto") return "auto";
  if (unit === "fr") return `${value}fr`;
  if (unit === "%") return `${value}%`;
  return `${value}px`;
}

/**
 * Convert a [top, right, bottom, left] array to CSS shorthand.
 */
function boxToCSS(values: [number, number, number, number]): string {
  const [t, r, b, l] = values;
  if (t === r && r === b && b === l) return `${t}px`;
  if (t === b && r === l) return `${t}px ${r}px`;
  return `${t}px ${r}px ${b}px ${l}px`;
}

/**
 * Generate inline CSS object for a flow-mode element.
 */
export function computeElementLayoutCSS(
  layout: LayoutProps,
): React.CSSProperties {
  if (layout.layoutMode === "absolute") {
    return {}; // Absolute elements use the transform CSS from element-wrapper
  }

  const css: React.CSSProperties = {
    position: "relative" as const,
    boxSizing: "border-box" as const,
    width: sizeToCss(layout.widthValue, layout.widthUnit),
    margin: boxToCSS(layout.margin),
    padding: boxToCSS(layout.padding),
  };

  // Height
  if (layout.heightUnit === "auto") {
    css.height = "auto";
  } else {
    css.height = sizeToCss(layout.heightValue, layout.heightUnit);
  }

  // Min/max width
  if (layout.minWidth !== undefined && layout.minWidth > 0) {
    css.minWidth = `${layout.minWidth}px`;
  }
  if (layout.maxWidth !== undefined && layout.maxWidth > 0) {
    css.maxWidth = `${layout.maxWidth}px`;
  }

  // Flex item props
  if (layout.flexGrow !== undefined) css.flexGrow = layout.flexGrow;
  if (layout.flexShrink !== undefined) css.flexShrink = layout.flexShrink;
  if (layout.alignSelf) css.alignSelf = layout.alignSelf;
  if (layout.order !== undefined) css.order = layout.order;

  // Visibility
  if (layout.hidden) css.display = "none";

  return css;
}

/**
 * Generate inline CSS object for a flex container (artboard or row/column).
 */
export function computeFlexContainerCSS(
  flex: FlexContainerProps,
): React.CSSProperties {
  return {
    display: "flex",
    flexDirection: flex.direction,
    flexWrap: flex.wrap,
    justifyContent: flex.justifyContent,
    alignItems: flex.alignItems,
    gap: flex.gap > 0 ? `${flex.gap}px` : undefined,
    padding: boxToCSS(flex.padding),
    boxSizing: "border-box" as const,
  };
}

/* ─── Full Responsive Stylesheet ───────────── */

/**
 * Generate a complete responsive CSS stylesheet string for a document.
 * Uses mobile-first approach with min-width media queries.
 *
 * Each element gets a CSS class: `.el-{id}`
 * Each artboard gets a CSS class: `.ab-{id}`
 */
export function generateResponsiveStylesheet(doc: CanvasDocument): string {
  const lines: string[] = [];

  // Global reset and viewport handling
  lines.push(`/* ── Responsive Stylesheet (auto-generated) ── */`);
  lines.push(`*, *::before, *::after { box-sizing: border-box; }`);
  lines.push(`body { margin: 0; padding: 0; overflow-x: hidden; -webkit-text-size-adjust: 100%; }`);
  lines.push(`img { max-width: 100%; height: auto; display: block; }`);
  lines.push(``);

  // Collect styles per breakpoint
  const breakpointCSS: Record<Breakpoint, string[]> = {
    mobile: [],
    tablet: [],
    laptop: [],
    desktop: [],
  };

  // Process artboards
  for (const ab of doc.artboards) {
    // Base (mobile-first) styles for artboard
    const baseFlex = ab.flexContainer ?? DEFAULT_FLEX_CONTAINER;
    breakpointCSS.mobile.push(
      `.ab-${ab.id} {`,
      `  display: flex;`,
      `  flex-direction: ${baseFlex.direction};`,
      `  flex-wrap: ${baseFlex.wrap};`,
      `  justify-content: ${baseFlex.justifyContent};`,
      `  align-items: ${baseFlex.alignItems};`,
      `  gap: ${baseFlex.gap}px;`,
      `  padding: ${boxToCSS(baseFlex.padding)};`,
      `  width: 100%;`,
      `  max-width: 100%;`,
      `  margin: 0 auto;`,
      `  background-color: ${ab.backgroundColor};`,
      ab.backgroundImage ? `  background-image: url(${ab.backgroundImage});` : ``,
      ab.backgroundImage ? `  background-size: cover;` : ``,
      ab.backgroundImage ? `  background-position: center;` : ``,
      `  overflow-x: hidden;`,
      `  position: relative;`,
      `  min-height: auto;`,
      `}`,
    );

    // Per-breakpoint overrides for artboard flex container
    for (const bp of BREAKPOINTS_MOBILE_FIRST) {
      if (bp === "mobile") continue;
      const override = ab.responsiveFlexContainer?.[bp];
      if (override) {
        const props: string[] = [];
        if (override.direction) props.push(`  flex-direction: ${override.direction};`);
        if (override.wrap) props.push(`  flex-wrap: ${override.wrap};`);
        if (override.justifyContent) props.push(`  justify-content: ${override.justifyContent};`);
        if (override.alignItems) props.push(`  align-items: ${override.alignItems};`);
        if (override.gap !== undefined) props.push(`  gap: ${override.gap}px;`);
        if (override.padding) props.push(`  padding: ${boxToCSS(override.padding as [number, number, number, number])};`);
        if (props.length > 0) {
          breakpointCSS[bp].push(`.ab-${ab.id} {`, ...props, `}`);
        }
      }
    }

    // Process elements in this artboard
    for (const elId of ab.elements) {
      const el = doc.elements[elId];
      if (!el) continue;

      if (isFlowElement(el)) {
        // Flow-mode element
        const baseLayout = el.layout ?? DEFAULT_LAYOUT_PROPS;
        breakpointCSS.mobile.push(
          `.el-${el.id} {`,
          `  position: relative;`,
          `  box-sizing: border-box;`,
          `  width: ${sizeToCss(baseLayout.widthValue, baseLayout.widthUnit)};`,
          baseLayout.heightUnit === "auto" ? `  height: auto;` : `  height: ${sizeToCss(baseLayout.heightValue, baseLayout.heightUnit)};`,
          `  margin: ${boxToCSS(baseLayout.margin)};`,
          `  padding: ${boxToCSS(baseLayout.padding)};`,
          baseLayout.flexGrow ? `  flex-grow: ${baseLayout.flexGrow};` : ``,
          baseLayout.flexShrink !== undefined ? `  flex-shrink: ${baseLayout.flexShrink};` : ``,
          baseLayout.alignSelf ? `  align-self: ${baseLayout.alignSelf};` : ``,
          baseLayout.order !== undefined ? `  order: ${baseLayout.order};` : ``,
          baseLayout.minWidth ? `  min-width: ${baseLayout.minWidth}px;` : ``,
          baseLayout.maxWidth ? `  max-width: ${baseLayout.maxWidth}px;` : ``,
          el.opacity < 1 ? `  opacity: ${el.opacity};` : ``,
          baseLayout.hidden ? `  display: none;` : ``,
          `}`,
        );

        // Per-breakpoint layout overrides
        for (const bp of BREAKPOINTS_MOBILE_FIRST) {
          if (bp === "mobile") continue;
          const override = el.responsiveLayout?.[bp];
          if (override) {
            const props: string[] = [];
            if (override.widthValue !== undefined && override.widthUnit) {
              props.push(`  width: ${sizeToCss(override.widthValue, override.widthUnit)};`);
            } else if (override.widthValue !== undefined) {
              props.push(`  width: ${sizeToCss(override.widthValue, baseLayout.widthUnit)};`);
            }
            if (override.heightValue !== undefined && override.heightUnit) {
              props.push(`  height: ${sizeToCss(override.heightValue, override.heightUnit)};`);
            }
            if (override.margin) props.push(`  margin: ${boxToCSS(override.margin as [number, number, number, number])};`);
            if (override.padding) props.push(`  padding: ${boxToCSS(override.padding as [number, number, number, number])};`);
            if (override.flexGrow !== undefined) props.push(`  flex-grow: ${override.flexGrow};`);
            if (override.flexShrink !== undefined) props.push(`  flex-shrink: ${override.flexShrink};`);
            if (override.alignSelf) props.push(`  align-self: ${override.alignSelf};`);
            if (override.order !== undefined) props.push(`  order: ${override.order};`);
            if (override.minWidth !== undefined) props.push(`  min-width: ${override.minWidth}px;`);
            if (override.maxWidth !== undefined) props.push(`  max-width: ${override.maxWidth}px;`);
            if (override.hidden === true) props.push(`  display: none;`);
            if (override.hidden === false) props.push(`  display: block;`);
            if (props.length > 0) {
              breakpointCSS[bp].push(`.el-${el.id} {`, ...props, `}`);
            }
          }
        }
      } else {
        // Absolute-mode element - convert to percentage-based positioning for responsiveness
        const t = el.transform;
        const pctX = (t.x / ab.width) * 100;
        const pctY = (t.y / ab.height) * 100;
        const pctW = (t.width / ab.width) * 100;

        breakpointCSS.mobile.push(
          `.el-${el.id} {`,
          `  position: absolute;`,
          `  left: ${pctX.toFixed(2)}%;`,
          `  top: ${pctY.toFixed(2)}%;`,
          `  width: ${pctW.toFixed(2)}%;`,
          `  height: auto;`,
          el.transform.rotation ? `  transform: rotate(${el.transform.rotation}deg);` : ``,
          `  z-index: ${el.zIndex};`,
          el.opacity < 1 ? `  opacity: ${el.opacity};` : ``,
          `}`,
        );
      }
    }
  }

  // Build final stylesheet with mobile-first media queries
  // Mobile base (no media query)
  if (breakpointCSS.mobile.length > 0) {
    lines.push(`/* ── Base (Mobile First) ── */`);
    lines.push(...breakpointCSS.mobile.filter(Boolean));
    lines.push(``);
  }

  // Tablet and up
  for (const bp of (["tablet", "laptop", "desktop"] as Breakpoint[])) {
    const rules = breakpointCSS[bp];
    if (rules.length > 0) {
      lines.push(`/* ── ${bp.charAt(0).toUpperCase() + bp.slice(1)} (min-width: ${BREAKPOINT_MIN_WIDTHS[bp]}px) ── */`);
      lines.push(`@media (min-width: ${BREAKPOINT_MIN_WIDTHS[bp]}px) {`);
      lines.push(...rules.filter(Boolean).map(l => `  ${l}`));
      lines.push(`}`);
      lines.push(``);
    }
  }

  return lines.join("\n");
}

/* ─── Default Factories ────────────────────── */

/**
 * Create default layout props for a new flow-mode element.
 */
export function createFlowLayout(overrides: Partial<LayoutProps> = {}): LayoutProps {
  return {
    ...DEFAULT_LAYOUT_PROPS,
    ...overrides,
    margin: overrides.margin ?? [0, 0, 0, 0],
    padding: overrides.padding ?? [0, 0, 0, 0],
  };
}

/**
 * Create default flex container props.
 */
export function createFlexContainer(overrides: Partial<FlexContainerProps> = {}): FlexContainerProps {
  return {
    ...DEFAULT_FLEX_CONTAINER,
    ...overrides,
    padding: overrides.padding ?? [0, 0, 0, 0],
  };
}
