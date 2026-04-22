/* ─────────────────────────────────────────────
 * Templates Index — All freeform canvas templates
 * ──────────────────────────────────────────── */

import type { Template } from "@productix/types";

import { productPromoTemplate } from "./product-promo";
import { campaignEventTemplate } from "./campaign-event";
import { brandIntroTemplate } from "./brand-intro";
import { socialShareTemplate } from "./social-share";

// ── Beverage Showcase Templates ──
import { redbullShowcaseTemplate } from "./redbull-showcase";
import { spriteShowcaseTemplate } from "./sprite-showcase";
import { cocacolaShowcaseTemplate } from "./cocacola-showcase";
import { beerShowcaseTemplate } from "./beer-showcase";
import { kothmaleShowcaseTemplate } from "./kothmale-showcase";

/** All available starter templates */
export const templates: Template[] = [
  productPromoTemplate,
  campaignEventTemplate,
  brandIntroTemplate,
  socialShareTemplate,
  // Beverage showcases
  redbullShowcaseTemplate,
  spriteShowcaseTemplate,
  cocacolaShowcaseTemplate,
  beerShowcaseTemplate,
  kothmaleShowcaseTemplate,
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
export { redbullShowcaseTemplate, spriteShowcaseTemplate, cocacolaShowcaseTemplate, beerShowcaseTemplate, kothmaleShowcaseTemplate };

// ── Product Showcase Templates (mobile-first brand pages) ──
export {
  ProductShowcase,
  type ProductShowcaseProps,
  type BrandConfig,
  allBrandConfigs,
  redbullConfig,
  spriteConfig,
  cocacolaConfig,
  beerConfig,
  kothmaleConfig,
} from "./showcase";
