/* ─────────────────────────────────────────────
 * Localize Props — Merge base English props with
 * locale-specific overrides for multilingual content
 * ──────────────────────────────────────────── */

import type { ContentLocale, ElementNode } from "@productix/types";

/**
 * Get the effective props for an element at a given content locale.
 * If locale is "en" or no override exists, returns base props.
 * Otherwise merges base props with locale-specific i18nProps.
 */
export function getLocalizedProps(
  el: ElementNode,
  locale: ContentLocale = "en"
): Record<string, unknown> {
  if (locale === "en" || !el.i18nProps?.[locale]) {
    return el.props;
  }
  // Merge: base EN props ← locale overrides
  return { ...el.props, ...el.i18nProps[locale] };
}

/**
 * Keys that are considered "translatable" text content.
 * Only these props should be shown in the per-locale editing UI.
 */
export const TRANSLATABLE_KEYS = new Set([
  "text",
  "title",
  "subtitle",
  "ctaText",
  "label",
  "value",
  "trend",
  "description",
  "placeholder",
]);

/**
 * Check if a locale has any content authored for a given element.
 */
export function hasLocaleContent(
  el: ElementNode,
  locale: ContentLocale
): boolean {
  if (locale === "en") return true;
  return !!(el.i18nProps?.[locale] && Object.keys(el.i18nProps[locale]!).length > 0);
}
