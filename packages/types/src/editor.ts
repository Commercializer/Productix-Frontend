/* ─────────────────────────────────────────────
 * Editor Types — Freeform Canvas Data Model
 * ──────────────────────────────────────────── */

// ─── Breakpoint System ─────────────────────────

/** Supported responsive breakpoints */
export type Breakpoint = "desktop" | "laptop" | "tablet" | "mobile";

/** Ordered list of breakpoints from widest to narrowest */
export const BREAKPOINTS: Breakpoint[] = ["desktop", "laptop", "tablet", "mobile"];

/** Canonical viewport widths for each breakpoint */
export const BREAKPOINT_WIDTHS: Record<Breakpoint, number> = {
  desktop: 1440,
  laptop: 1280,
  tablet: 768,
  mobile: 375,
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

// ─── Element Node ──────────────────────────────

/** A single visual element on the canvas */
export interface ElementNode {
  id: string;
  /** Registered element type key (e.g. "text", "image", "card") */
  type: string;
  /** Base transform (desktop / design-time values) */
  transform: Transform;
  zIndex: number;
  locked: boolean;
  visible: boolean;
  opacity: number;
  /** Element-type-specific props (text content, image src, colors, etc.) */
  props: Record<string, unknown>;
  /** Child element IDs — used by group/container elements */
  children?: string[];
  /** Parent group ID (if element belongs to a group) */
  parentId?: string;
  /**
   * Per-breakpoint transform overrides.
   * Only non-desktop breakpoints need entries here.
   * Missing breakpoints fall back to auto-scaled from the base transform.
   */
  responsiveOverrides?: Partial<Record<Breakpoint, Partial<Transform>>>;
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
