/* ─────────────────────────────────────────────
 * Editor Types — Responsive Canvas Data Model
 * ──────────────────────────────────────────── */

// ─── Breakpoint System ─────────────────────────

/** Supported responsive breakpoints */
export type Breakpoint = "desktop" | "laptop" | "tablet" | "mobile";

/** Ordered list of breakpoints from widest to narrowest */
export const BREAKPOINTS: Breakpoint[] = ["desktop", "laptop", "tablet", "mobile"];

/** Ordered list of breakpoints from narrowest to widest (mobile-first) */
export const BREAKPOINTS_MOBILE_FIRST: Breakpoint[] = ["mobile", "tablet", "laptop", "desktop"];

/** Canonical viewport widths for each breakpoint */
export const BREAKPOINT_WIDTHS: Record<Breakpoint, number> = {
  desktop: 1440,
  laptop: 1280,
  tablet: 768,
  mobile: 375,
};

/** Canonical viewport heights for each breakpoint (portrait for mobile/tablet) */
export const BREAKPOINT_HEIGHTS: Record<Breakpoint, number> = {
  desktop: 900,
  laptop: 800,
  tablet: 1024,
  mobile: 812,
};

/**
 * Mobile-first min-width media query breakpoints.
 * Used to generate CSS `@media (min-width: ...)` rules.
 * Mobile is the base (no media query needed).
 */
export const BREAKPOINT_MIN_WIDTHS: Record<Breakpoint, number> = {
  mobile: 0,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
};

// ─── Transform ─────────────────────────────────

/** Position + size + rotation for every canvas element */
export interface Transform {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

// ─── Layout System ─────────────────────────────

/** Layout mode for an element */
export type LayoutMode = "absolute" | "flow";

/** Size unit for width/height in flow mode */
export type SizeUnit = "px" | "%" | "auto" | "fr";

/** Flow-mode layout properties for individual elements */
export interface LayoutProps {
  /** Whether element is absolutely positioned or in document flow */
  layoutMode: LayoutMode;
  /** Width value (interpreted according to widthUnit) */
  widthValue: number;
  /** Width unit */
  widthUnit: SizeUnit;
  /** Height value (interpreted according to heightUnit) */
  heightValue: number;
  /** Height unit */
  heightUnit: SizeUnit;
  /** Min-width in px — triggers wrapping when flex item shrinks below this */
  minWidth?: number;
  /** Max-width in px — prevents element from growing beyond this */
  maxWidth?: number;
  /** Margin [top, right, bottom, left] in px */
  margin: [number, number, number, number];
  /** Padding [top, right, bottom, left] in px */
  padding: [number, number, number, number];
  /** Align self within flex parent */
  alignSelf?: "auto" | "flex-start" | "center" | "flex-end" | "stretch";
  /** Flex grow factor */
  flexGrow?: number;
  /** Flex shrink factor */
  flexShrink?: number;
  /** Order within flex container */
  order?: number;
  /** Whether this element is hidden at this breakpoint */
  hidden?: boolean;
}

/** Flex container layout configuration (for Row, Column, and Artboard) */
export interface FlexContainerProps {
  /** Flex direction */
  direction: "row" | "column";
  /** Flex wrap behavior */
  wrap: "nowrap" | "wrap";
  /** Horizontal distribution */
  justifyContent: "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly";
  /** Vertical alignment */
  alignItems: "flex-start" | "center" | "flex-end" | "stretch" | "baseline";
  /** Gap between children in px */
  gap: number;
  /** Container padding [top, right, bottom, left] in px */
  padding: [number, number, number, number];
}

/** Default layout props for new flow-mode elements */
export const DEFAULT_LAYOUT_PROPS: LayoutProps = {
  layoutMode: "flow",
  widthValue: 100,
  widthUnit: "%",
  heightValue: 0,
  heightUnit: "auto",
  margin: [0, 0, 0, 0],
  padding: [0, 0, 0, 0],
  flexGrow: 0,
  flexShrink: 1,
};

/** Default flex container props */
export const DEFAULT_FLEX_CONTAINER: FlexContainerProps = {
  direction: "column",
  wrap: "wrap",
  justifyContent: "flex-start",
  alignItems: "stretch",
  gap: 0,
  padding: [0, 0, 0, 0],
};

// ─── Element Node ──────────────────────────────

/** A single visual element on the canvas */
export interface ElementNode {
  id: string;
  /** Registered element type key (e.g. "text", "image", "card") */
  type: string;
  /** Base transform (desktop / design-time values) — used in absolute mode */
  transform: Transform;
  zIndex: number;
  locked: boolean;
  visible: boolean;
  opacity: number;
  /** Element-type-specific props (text content, image src, colors, etc.) */
  props: Record<string, unknown>;
  /** Child element IDs — used by group/container/row/column elements */
  children?: string[];
  /** Parent group ID (if element belongs to a group) */
  parentId?: string;
  /**
   * Per-breakpoint transform overrides (absolute mode only).
   * Only non-desktop breakpoints need entries here.
   * Missing breakpoints fall back to auto-scaled from the base transform.
   */
  responsiveOverrides?: Partial<Record<Breakpoint, Partial<Transform>>>;
  /**
   * Layout properties for flow mode.
   * When undefined, the element uses absolute mode (backward compat).
   */
  layout?: LayoutProps;
  /**
   * Per-breakpoint layout overrides (flow mode only).
   * Allows width/visibility/stacking changes per breakpoint.
   * Missing breakpoints inherit from the base layout props.
   */
  responsiveLayout?: Partial<Record<Breakpoint, Partial<LayoutProps>>>;
}

// ─── Artboard ──────────────────────────────────

/** An artboard / section with custom dimensions */
export interface Artboard {
  id: string;
  name: string;
  width: number;
  height: number;
  backgroundColor: string;
  backgroundImage?: string;
  /** Ordered element IDs belonging to this artboard */
  elements: string[];
  /** Vertical order among sibling artboards */
  position: number;
  /** Flex container settings for flow-mode layout within this artboard */
  flexContainer?: FlexContainerProps;
  /** Per-breakpoint flex container overrides */
  responsiveFlexContainer?: Partial<Record<Breakpoint, Partial<FlexContainerProps>>>;
}

// ─── Canvas Document ───────────────────────────

/** Top-level canvas document — the full page data */
export interface CanvasDocument {
  /** Schema version for future migrations */
  version: number;
  pageTitle: string;
  /** Ordered artboards (sections) */
  artboards: Artboard[];
  /** Flat element map for O(1) lookup */
  elements: Record<string, ElementNode>;
  /** Global style overrides */
  globalStyles?: Record<string, string>;
}

// ─── Template Types ────────────────────────────

/** Template metadata */
export interface TemplateMeta {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  category: "marketing" | "event" | "brand" | "social" | "custom";
  tags?: string[];
}

/** Full template with canvas document data */
export interface Template {
  meta: TemplateMeta;
  data: CanvasDocument;
}

// ─── Element Registration ──────────────────────

/** Block category for sidebar grouping */
export interface BlockCategory {
  title: string;
  components: string[];
  defaultExpanded?: boolean;
}
