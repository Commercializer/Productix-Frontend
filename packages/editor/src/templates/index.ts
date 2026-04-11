/* ─────────────────────────────────────────────
 * Templates Index — All freeform canvas templates
 * ──────────────────────────────────────────── */

import type { Template } from "@productix/types";

import { productPromoTemplate } from "./product-promo";
import { campaignEventTemplate } from "./campaign-event";
import { brandIntroTemplate } from "./brand-intro";
import { socialShareTemplate } from "./social-share";

/** All available starter templates */
export const templates: Template[] = [
  productPromoTemplate,
  campaignEventTemplate,
  brandIntroTemplate,
  socialShareTemplate,
];

/** Look up a template by its ID */
export function getTemplateById(id: string): Template | undefined {
  return templates.find((t) => t.meta.id === id);
}

/** Get templates filtered by category */
export function getTemplatesByCategory(category: string): Template[] {
  return templates.filter((t) => t.meta.category === category);
}

export { productPromoTemplate, campaignEventTemplate, brandIntroTemplate, socialShareTemplate };
