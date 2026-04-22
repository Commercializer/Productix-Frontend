/* ─────────────────────────────────────────────
 * Element Registry — Register & lookup element types
 * ──────────────────────────────────────────── */

import type { Transform } from "@productix/types";
import React from "react";

/* ─── Types ─────────────────────────────────── */

export interface ElementDefinition {
  /** Unique type key (e.g. "text", "image", "card") */
  type: string;
  /** Display label */
  label: string;
  /** Icon component or emoji */
  icon: React.ReactNode;
  /** Category for sidebar grouping */
  category: "content" | "media" | "interactive" | "layout" | "social" | "promotional" | "gaming";
  /** Default element-specific props */
  defaultProps: Record<string, unknown>;
  /** Default transform overrides */
  defaultTransform: Partial<Transform>;
  /** Render component: receives { props, isEditing, onPropsChange } */
  component: React.ComponentType<ElementRenderProps>;
  /** Property panel component for the right sidebar */
  propertyPanel: React.ComponentType<PropertyPanelProps>;
}

export interface ElementRenderProps {
  props: Record<string, unknown>;
  isEditing: boolean;
  width: number;
  height: number;
  onPropsChange: (changes: Record<string, unknown>) => void;
  /**
   * Scale factor (0–1) for responsive sizing.
   * Represents the ratio of the current breakpoint width to the desktop design width.
   * Components should multiply font sizes, padding, gaps, etc. by this value.
   * Desktop = 1.0, Mobile ≈ 0.30 (428/1440).
   * Clamped so text never gets smaller than ~60% of original.
   */
  scaleFactor?: number;
}

export interface PropertyPanelProps {
  props: Record<string, unknown>;
  onChange: (changes: Record<string, unknown>) => void;
}

/* ─── Registry ──────────────────────────────── */

const registry = new Map<string, ElementDefinition>();

/** Register an element type */
export function registerElement(def: ElementDefinition): void {
  registry.set(def.type, def);
}

/** Look up an element definition by type */
export function getElementDefinition(type: string): ElementDefinition | undefined {
  return registry.get(type);
}

/** Get all registered element definitions */
export function getAllElements(): ElementDefinition[] {
  return Array.from(registry.values());
}

/** Get elements by category */
export function getElementsByCategory(category: ElementDefinition["category"]): ElementDefinition[] {
  return Array.from(registry.values()).filter((d) => d.category === category);
}
