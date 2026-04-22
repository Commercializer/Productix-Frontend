/* ─────────────────────────────────────────────
 * Showcase Templates Index
 *
 * Exports the reusable ProductShowcase component,
 * the BrandConfig type, and all 5 brand configs.
 * ──────────────────────────────────────────── */

// Core component + types
export { ProductShowcase, type ProductShowcaseProps } from "./ProductShowcase";
export type {
  BrandConfig,
  VariantOption,
  FeatureItem,
  DownloadAsset,
  OtherProduct,
  SocialLink,
} from "./types";

// Brand configurations
export {
  redbullConfig,
  spriteConfig,
  cocacolaConfig,
  beerConfig,
  kothmaleConfig,
} from "./brands";

// Convenience array of all configs
import { redbullConfig } from "./brands/redbull";
import { spriteConfig } from "./brands/sprite";
import { cocacolaConfig } from "./brands/cocacola";
import { beerConfig } from "./brands/beer";
import { kothmaleConfig } from "./brands/kothmale";
import type { BrandConfig } from "./types";

export const allBrandConfigs: { id: string; name: string; config: BrandConfig }[] = [
  { id: "redbull", name: "Red Bull", config: redbullConfig },
  { id: "sprite", name: "Sprite", config: spriteConfig },
  { id: "cocacola", name: "Coca-Cola", config: cocacolaConfig },
  { id: "beer", name: "Golden Reserve Beer", config: beerConfig },
  { id: "kothmale", name: "Kothmale Fresh Milk", config: kothmaleConfig },
];
