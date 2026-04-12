/* ─────────────────────────────────────────────
 * @productix/editor — Public API
 * ──────────────────────────────────────────── */

// ── Engine ──
export { useCanvasStore, type CanvasState } from "./engine/canvas-store";
export { Artboard } from "./engine/artboard";
export { ElementWrapper } from "./engine/element-wrapper";
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
} from "./templates";

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

// ── Media system ──
export { MediaProvider, useMediaLibrary } from "./media/media-context";
export { MediaLibraryPanel } from "./media/media-library-panel";
export { ImageUploadWidget } from "./media/image-upload-widget";
export type { MediaItem, MediaItemMeta } from "./media/media-store";
