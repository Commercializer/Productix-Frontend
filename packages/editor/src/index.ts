/* ─────────────────────────────────────────────
 * @productix/editor - Public API
 * ──────────────────────────────────────────── */

// ── Engine ──
export { useCanvasStore, type CanvasState } from "./engine/canvas-store";
export { Artboard } from "./engine/artboard";
export { ElementWrapper } from "./engine/element-wrapper";
export { CanvasEffects } from "./engine/canvas-effects";
export {
  isFlowElement,
  getEffectiveLayout,
  getEffectiveFlexContainer,
  computeElementLayoutCSS,
  computeFlexContainerCSS,
  generateResponsiveStylesheet,
  createFlowLayout,
  createFlexContainer,
} from "./engine/layout-engine";

// ── Renderers ──
export { EditRenderer } from "./renderer/edit-renderer";
export { PreviewRenderer, type PreviewRendererProps } from "./renderer/preview-renderer";
export { PublicRenderer, type PublicRendererProps } from "./renderer/public-renderer";
export { usePublicPage, PublicPageProvider, type PublicPageContextValue } from "./renderer/public-page-context";

// ── Elements ──
export {
  registerElement,
  getElementDefinition,
  getAllElements,
  getElementsByCategory,
  type ElementDefinition,
  type ElementRenderProps,
  type PropertyPanelProps,
} from "./elements";

// ── Panels ──
export { ElementPanel } from "./panels/element-panel";
export { LayerPanel } from "./panels/layer-panel";
export { PropertiesPanel } from "./panels/properties-panel";
export { FloatingToolbar } from "./panels/floating-toolbar";
export { ArtboardSettings } from "./panels/artboard-settings";
export { LanguageSwitcher } from "./panels/language-switcher";
export { ContentLocaleTabs } from "./panels/content-locale-tabs";
export { ImportLayoutDialog } from "./panels/import-layout-dialog";
export {
  buildAIPrompt,
  importLayoutFromJson,
  type AIBrief,
  type ImportLayoutInput,
  type ImportResult,
  type ImportFailure,
} from "./utils/import-layout";

// ── i18n ──
export { useTranslation, useI18nStore, LOCALES } from "./i18n";
export type { Locale, TranslationStrings } from "./i18n";

// ── Templates ──
export {
  templates,
  getTemplateById,
  getTemplatesByCategory,
  productPromoTemplate,
  campaignEventTemplate,
  brandIntroTemplate,
  socialShareTemplate,
  redbullShowcaseTemplate,
  spriteShowcaseTemplate,
  cocacolaShowcaseTemplate,
  beerShowcaseTemplate,
  kothmaleShowcaseTemplate,
} from "./templates";

// ── Product Showcase React Component ──
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
} from "./templates/showcase";

// ── Utilities ──
export { createEmptyDocument, createDefaultArtboard, createDefaultElement } from "./utils/defaults";
export { generateElementId, generateArtboardId } from "./utils/id";
export {
  getEffectiveTransform,
  autoScaleTransform,
  autoScaleTransformByWidth,
  getArtboardPreviewWidth,
  getArtboardPreviewHeight,
  isElementInFlow,
} from "./utils/responsive";
export { exportToHtml } from "./utils/export-html";
export { getLocalizedProps, hasLocaleContent, TRANSLATABLE_KEYS } from "./utils/localize-props";
export {
  FONT_OPTIONS,
  groupFontOptionsByCategory,
  getGoogleFontsHref,
  type FontOption,
  type FontCategory,
} from "./utils/fonts";

// ── Media system ──
export { MediaProvider, useMediaLibrary } from "./media/media-context";
export { MediaLibraryPanel } from "./media/media-library-panel";
export { ImageUploadWidget } from "./media/image-upload-widget";
export { createMediaUrl } from "./media/media-store";
export type { MediaItem, MediaItemMeta, MediaType } from "./media/media-store";
