/* ─────────────────────────────────────────────
 * Editor Types — Responsive Canvas Data Model
 * ──────────────────────────────────────────── */

// ─── Content Locale System ─────────────────────

/** Supported content languages */
export type ContentLocale = "en" | "si" | "ta";

/** All content locales in display order */
export const CONTENT_LOCALES: ContentLocale[] = ["en", "si", "ta"];

/** Display metadata for content locales */
export const CONTENT_LOCALE_META: Record<ContentLocale, { label: string; nativeLabel: string; flag: string }> = {
  en: { label: "English", nativeLabel: "English", flag: "🇬🇧" },
  si: { label: "Sinhala", nativeLabel: "සිංහල", flag: "🇱🇰" },
  ta: { label: "Tamil", nativeLabel: "தமிழ்", flag: "🇱🇰" },
};

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
  mobile: 428,
};

/** Canonical viewport heights for each breakpoint (portrait for mobile/tablet) */
export const BREAKPOINT_HEIGHTS: Record<Breakpoint, number> = {
  desktop: 900,
  laptop: 800,
  tablet: 1024,
  mobile: 926,
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
  /** Element-type-specific props (text content, image src, colors, etc.) — always English / default */
  props: Record<string, unknown>;
  /**
   * Per-locale content overrides.
   * Only non-"en" locales need entries here.
   * Missing locales fall back to the base `props` (English).
   * Only text-like properties should be overridden (text, title, subtitle, ctaText, label, value).
   */
  i18nProps?: Partial<Record<ContentLocale, Record<string, unknown>>>;
  /** Child element IDs — used by group/container/row/column elements */
  children?: string[];
  /** Parent group ID (if element belongs to a group) */
  parentId?: string;
  /**
   * Block group ID — when set, this element belongs to a named group.
   * All elements sharing the same groupId move together when any member is dragged.
   */
  groupId?: string;
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

// ─── Canvas Effects ────────────────────────────

/** Supported canvas visual overlay effects */
export type CanvasEffect =
  | "none"
  | "snowfall"
  | "confetti"
  | "halloween"
  | "avurudu"
  | "wesak"
  | "fireworks"
  | "hearts"
  | "sparkle";

/** All canvas effects with display metadata */
export const CANVAS_EFFECTS: { value: CanvasEffect; label: string; emoji: string; description: string }[] = [
  { value: "none",      label: "None",           emoji: "🚫", description: "No effect" },
  { value: "snowfall",  label: "Snowfall",       emoji: "❄️", description: "Gentle falling snow" },
  { value: "confetti",  label: "Win / Confetti",  emoji: "🎊", description: "Celebration confetti burst" },
  { value: "halloween", label: "Halloween",      emoji: "🎃", description: "Spooky bats & pumpkins" },
  { value: "avurudu",   label: "Avurudu",        emoji: "🪷", description: "Sinhala & Tamil New Year" },
  { value: "wesak",     label: "Wesak",          emoji: "🪷", description: "Vesak lanterns & light" },
  { value: "fireworks", label: "Fireworks",      emoji: "🎆", description: "Festive fireworks burst" },
  { value: "hearts",    label: "Hearts",         emoji: "💕", description: "Floating hearts" },
  { value: "sparkle",   label: "Sparkle",        emoji: "✨", description: "Twinkling sparkles" },
];

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
  /** Visual overlay effect for the artboard canvas */
  effect?: CanvasEffect;
}

// ─── Canvas Document ───────────────────────────

/** Metadata for a block group */
export interface BlockGroup {
  id: string;
  name: string;
  /** Element IDs or nested Group IDs belonging to this group */
  memberIds: string[];
  /** Parent group ID if this group is nested inside another group */
  groupId?: string;
  /** Whether the group is locked (prevents ungrouping / individual moves) */
  locked: boolean;
}

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
  /**
   * Which content locales have been authored.
   * Always includes "en". Presence of "si" or "ta" means
   * those translations are available for this page.
   */
  availableLocales?: ContentLocale[];
  /** Block groups — groups of elements that move/act together */
  groups?: Record<string, BlockGroup>;
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
