/* ─────────────────────────────────────────────
 * Theme Templates — Predefined artboard layouts
 *
 * Each theme is a function that returns element
 * descriptors positioned on a 428×926 mobile canvas.
 * ──────────────────────────────────────────── */

export interface TemplateElement {
  type: string;
  props: Record<string, unknown>;
  transform: { x: number; y: number; width: number; height: number; rotation?: number };
}

export interface ThemeTemplate {
  id: string;
  name: string;
  description: string;
  artboard: { backgroundColor: string };
  elements: TemplateElement[];
}

/* ────────────────────────────────────────────
 * 1 ▸ DEFAULT — Classic product showcase
 * ──────────────────────────────────────────── */

const DEFAULT_THEME: ThemeTemplate = {
  id: "default",
  name: "Default",
  description: "Classic product showcase",
  artboard: { backgroundColor: "#ffffff" },
  elements: [
    // Hero image
    {
      type: "image",
      props: { src: "", alt: "Product hero", objectFit: "cover", borderRadius: 0 },
      transform: { x: 0, y: 0, width: 428, height: 365 },
    },
    // Badge
    {
      type: "badge",
      props: { text: "NEW ARRIVAL", icon: "✨", bgColor: "#eef2ff", textColor: "#4f46e5", borderRadius: 999, fontSize: 11, fontWeight: "700" },
      transform: { x: 27, y: 388, width: 137, height: 32 },
    },
    // Heading
    {
      type: "heading",
      props: { text: "Your Product Title", variant: "heading", fontSize: 28, fontWeight: "800", color: "#1a1a2e", textAlign: "left", lineHeight: 1.15, fontFamily: "inherit" },
      transform: { x: 27, y: 431, width: 373, height: 82 },
    },
    // Description
    {
      type: "text",
      props: { text: "Add a compelling description of your product that highlights its key benefits and features.", variant: "paragraph", fontSize: 14, fontWeight: "400", color: "#6b7280", textAlign: "left", lineHeight: 1.6, fontFamily: "inherit" },
      transform: { x: 27, y: 525, width: 373, height: 91 },
    },
    // Divider
    {
      type: "divider",
      props: { color: "#f0f0f0", thickness: 1, lineStyle: "solid", orientation: "horizontal" },
      transform: { x: 27, y: 636, width: 373, height: 14 },
    },
    // Price text
    {
      type: "text",
      props: { text: "$49.99", variant: "heading", fontSize: 32, fontWeight: "800", color: "#1a1a2e", textAlign: "left", lineHeight: 1.2, fontFamily: "inherit" },
      transform: { x: 27, y: 661, width: 205, height: 55 },
    },
    // CTA Button
    {
      type: "button",
      props: { text: "Shop Now →", url: "#", variant: "filled", bgColor: "#4f46e5", textColor: "#ffffff", borderRadius: 14, fontSize: 15, fontWeight: "700" },
      transform: { x: 27, y: 739, width: 373, height: 59 },
    },
    // Social group
    {
      type: "social-group",
      props: { platforms: ["instagram", "twitter", "facebook"], iconSize: 32, gap: 12, iconColor: "#ffffff", iconBg: "#1a1a2e", borderRadius: 999 },
      transform: { x: 122, y: 832, width: 183, height: 46 },
    },
  ],
};

/* ────────────────────────────────────────────
 * 2 ▸ MINIMAL — Clean whitespace-driven layout
 * ──────────────────────────────────────────── */

const MINIMAL_THEME: ThemeTemplate = {
  id: "minimal",
  name: "Minimal",
  description: "Clean & elegant",
  artboard: { backgroundColor: "#fafafa" },
  elements: [
    // Small logo badge
    {
      type: "badge",
      props: { text: "BRAND", icon: "", bgColor: "transparent", textColor: "#9ca3af", borderRadius: 0, fontSize: 10, fontWeight: "700" },
      transform: { x: 27, y: 34, width: 68, height: 23 },
    },
    // Product image (centered, rounded)
    {
      type: "image",
      props: { src: "", alt: "Product", objectFit: "cover", borderRadius: 20 },
      transform: { x: 37, y: 82, width: 355, height: 319 },
    },
    // Heading
    {
      type: "heading",
      props: { text: "Product Name", variant: "heading", fontSize: 24, fontWeight: "700", color: "#1a1a2e", textAlign: "center", lineHeight: 1.2, fontFamily: "inherit" },
      transform: { x: 27, y: 429, width: 373, height: 50 },
    },
    // Body text
    {
      type: "text",
      props: { text: "Minimalist design meets maximum functionality. Discover what sets this product apart.", variant: "paragraph", fontSize: 13, fontWeight: "400", color: "#9ca3af", textAlign: "center", lineHeight: 1.7, fontFamily: "inherit" },
      transform: { x: 46, y: 488, width: 337, height: 80 },
    },
    // Price
    {
      type: "text",
      props: { text: "$79", variant: "heading", fontSize: 28, fontWeight: "700", color: "#1a1a2e", textAlign: "center", lineHeight: 1.2, fontFamily: "inherit" },
      transform: { x: 156, y: 593, width: 114, height: 46 },
    },
    // CTA — outline style
    {
      type: "button",
      props: { text: "Learn More", url: "#", variant: "outline", bgColor: "#1a1a2e", textColor: "#ffffff", borderRadius: 999, fontSize: 13, fontWeight: "600" },
      transform: { x: 91, y: 661, width: 245, height: 52 },
    },
    // Divider
    {
      type: "divider",
      props: { color: "#e5e7eb", thickness: 1, lineStyle: "solid", orientation: "horizontal" },
      transform: { x: 137, y: 741, width: 154, height: 11 },
    },
    // Social
    {
      type: "social-group",
      props: { platforms: ["instagram", "twitter"], iconSize: 28, gap: 16, iconColor: "#9ca3af", iconBg: "transparent", borderRadius: 999 },
      transform: { x: 156, y: 766, width: 114, height: 41 },
    },
  ],
};

/* ────────────────────────────────────────────
 * 3 ▸ COMPACT — Dense, info-rich layout
 * ──────────────────────────────────────────── */

const COMPACT_THEME: ThemeTemplate = {
  id: "compact",
  name: "Compact",
  description: "Dense & info-rich",
  artboard: { backgroundColor: "#ffffff" },
  elements: [
    // Badge
    {
      type: "badge",
      props: { text: "FEATURED", icon: "⭐", bgColor: "#fef3c7", textColor: "#b45309", borderRadius: 6, fontSize: 10, fontWeight: "700" },
      transform: { x: 18, y: 23, width: 114, height: 27 },
    },
    // Heading
    {
      type: "heading",
      props: { text: "Product Title", variant: "heading", fontSize: 22, fontWeight: "700", color: "#1a1a2e", textAlign: "left", lineHeight: 1.2, fontFamily: "inherit" },
      transform: { x: 18, y: 62, width: 391, height: 41 },
    },
    // Subtitle
    {
      type: "text",
      props: { text: "Brief one-liner about your product goes here.", variant: "paragraph", fontSize: 13, fontWeight: "400", color: "#6b7280", textAlign: "left", lineHeight: 1.5, fontFamily: "inherit" },
      transform: { x: 18, y: 109, width: 391, height: 32 },
    },
    // Product image
    {
      type: "image",
      props: { src: "", alt: "Product", objectFit: "cover", borderRadius: 16 },
      transform: { x: 18, y: 160, width: 391, height: 251 },
    },
    // Feature row 1
    {
      type: "text",
      props: { text: "✓  Premium quality materials", variant: "paragraph", fontSize: 13, fontWeight: "500", color: "#374151", textAlign: "left", lineHeight: 1.5, fontFamily: "inherit" },
      transform: { x: 18, y: 433, width: 391, height: 27 },
    },
    // Feature row 2
    {
      type: "text",
      props: { text: "✓  Fast & free shipping", variant: "paragraph", fontSize: 13, fontWeight: "500", color: "#374151", textAlign: "left", lineHeight: 1.5, fontFamily: "inherit" },
      transform: { x: 18, y: 468, width: 391, height: 27 },
    },
    // Feature row 3
    {
      type: "text",
      props: { text: "✓  30-day money-back guarantee", variant: "paragraph", fontSize: 13, fontWeight: "500", color: "#374151", textAlign: "left", lineHeight: 1.5, fontFamily: "inherit" },
      transform: { x: 18, y: 502, width: 391, height: 27 },
    },
    // Divider
    {
      type: "divider",
      props: { color: "#f0f0f0", thickness: 1, lineStyle: "solid", orientation: "horizontal" },
      transform: { x: 18, y: 547, width: 391, height: 11 },
    },
    // Price
    {
      type: "text",
      props: { text: "$29.99", variant: "heading", fontSize: 26, fontWeight: "800", color: "#1a1a2e", textAlign: "left", lineHeight: 1.2, fontFamily: "inherit" },
      transform: { x: 18, y: 570, width: 160, height: 41 },
    },
    // Old price
    {
      type: "text",
      props: { text: "$59.99", variant: "paragraph", fontSize: 14, fontWeight: "500", color: "#d1d5db", textAlign: "left", lineHeight: 1.2, fontFamily: "inherit" },
      transform: { x: 183, y: 579, width: 91, height: 25 },
    },
    // CTA
    {
      type: "button",
      props: { text: "Add to Cart", url: "#", variant: "filled", bgColor: "#f59e0b", textColor: "#ffffff", borderRadius: 12, fontSize: 14, fontWeight: "700" },
      transform: { x: 18, y: 634, width: 391, height: 55 },
    },
    // Secondary CTA
    {
      type: "button",
      props: { text: "View Details", url: "#", variant: "outline", bgColor: "#6b7280", textColor: "#ffffff", borderRadius: 12, fontSize: 13, fontWeight: "600" },
      transform: { x: 18, y: 702, width: 391, height: 48 },
    },
    // Social icons
    {
      type: "social-group",
      props: { platforms: ["instagram", "twitter", "facebook", "whatsapp"], iconSize: 28, gap: 10, iconColor: "#ffffff", iconBg: "#e5e7eb", borderRadius: 8 },
      transform: { x: 122, y: 787, width: 183, height: 41 },
    },
  ],
};

/* ────────────────────────────────────────────
 * 4 ▸ VIVID — Bold, dark, high-contrast
 * ──────────────────────────────────────────── */

const VIVID_THEME: ThemeTemplate = {
  id: "vivid",
  name: "Vivid",
  description: "Bold & vibrant",
  artboard: { backgroundColor: "#0f0f1a" },
  elements: [
    // Accent badge
    {
      type: "badge",
      props: { text: "LIMITED DROP", icon: "🔥", bgColor: "#7c3aed22", textColor: "#a78bfa", borderRadius: 999, fontSize: 10, fontWeight: "700" },
      transform: { x: 27, y: 36, width: 148, height: 32 },
    },
    // Hero image
    {
      type: "image",
      props: { src: "", alt: "Product hero", objectFit: "cover", borderRadius: 24 },
      transform: { x: 23, y: 91, width: 382, height: 342 },
    },
    // Heading
    {
      type: "heading",
      props: { text: "Bold Product Name", variant: "heading", fontSize: 28, fontWeight: "800", color: "#ffffff", textAlign: "left", lineHeight: 1.15, fontFamily: "inherit" },
      transform: { x: 27, y: 461, width: 373, height: 82 },
    },
    // Description
    {
      type: "text",
      props: { text: "Make a statement with this standout product. Designed for those who dare to be different.", variant: "paragraph", fontSize: 14, fontWeight: "400", color: "#94a3b8", textAlign: "left", lineHeight: 1.6, fontFamily: "inherit" },
      transform: { x: 27, y: 552, width: 373, height: 80 },
    },
    // Price
    {
      type: "text",
      props: { text: "$99", variant: "heading", fontSize: 36, fontWeight: "800", color: "#a78bfa", textAlign: "left", lineHeight: 1.2, fontFamily: "inherit" },
      transform: { x: 27, y: 652, width: 137, height: 55 },
    },
    // CTA — gradient-feel
    {
      type: "button",
      props: { text: "Get Yours Now", url: "#", variant: "filled", bgColor: "#7c3aed", textColor: "#ffffff", borderRadius: 14, fontSize: 15, fontWeight: "700" },
      transform: { x: 27, y: 730, width: 373, height: 59 },
    },
    // Secondary CTA
    {
      type: "button",
      props: { text: "Watch Video", url: "#", variant: "outline", bgColor: "#a78bfa", textColor: "#ffffff", borderRadius: 14, fontSize: 13, fontWeight: "600" },
      transform: { x: 27, y: 803, width: 373, height: 50 },
    },
    // Social row
    {
      type: "social-group",
      props: { platforms: ["instagram", "tiktok", "youtube"], iconSize: 30, gap: 14, iconColor: "#a78bfa", iconBg: "#1e1b4b", borderRadius: 10 },
      transform: { x: 128, y: 876, width: 171, height: 41 },
    },
  ],
};

/* ────────────────────────────────────────────
 * 5 ▸ ELEGANT — Sophisticated luxury feel
 * ──────────────────────────────────────────── */

const ELEGANT_THEME: ThemeTemplate = {
  id: "elegant",
  name: "Elegant",
  description: "Luxury & refined",
  artboard: { backgroundColor: "#f8f5f0" },
  elements: [
    // Brand tag
    {
      type: "text",
      props: { text: "BRAND NAME", variant: "paragraph", fontSize: 10, fontWeight: "700", color: "#a08c6f", textAlign: "center", lineHeight: 1.5, fontFamily: "inherit" },
      transform: { x: 137, y: 32, width: 154, height: 21 },
    },
    // Divider under brand
    {
      type: "divider",
      props: { color: "#d4c5a9", thickness: 1, lineStyle: "solid", orientation: "horizontal" },
      transform: { x: 171, y: 59, width: 86, height: 9 },
    },
    // Hero image
    {
      type: "image",
      props: { src: "", alt: "Product", objectFit: "cover", borderRadius: 0 },
      transform: { x: 0, y: 82, width: 428, height: 365 },
    },
    // Heading
    {
      type: "heading",
      props: { text: "Timeless Elegance", variant: "heading", fontSize: 26, fontWeight: "300", color: "#2c2416", textAlign: "center", lineHeight: 1.25, fontFamily: "Georgia, serif" },
      transform: { x: 27, y: 470, width: 373, height: 55 },
    },
    // Subtitle
    {
      type: "text",
      props: { text: "Crafted with care, designed to last. Experience the art of refined simplicity.", variant: "paragraph", fontSize: 13, fontWeight: "400", color: "#8a7a64", textAlign: "center", lineHeight: 1.7, fontFamily: "inherit" },
      transform: { x: 46, y: 538, width: 337, height: 68 },
    },
    // Price
    {
      type: "text",
      props: { text: "$189", variant: "heading", fontSize: 30, fontWeight: "300", color: "#2c2416", textAlign: "center", lineHeight: 1.2, fontFamily: "Georgia, serif" },
      transform: { x: 148, y: 634, width: 131, height: 46 },
    },
    // CTA
    {
      type: "button",
      props: { text: "Discover", url: "#", variant: "filled", bgColor: "#2c2416", textColor: "#f8f5f0", borderRadius: 0, fontSize: 12, fontWeight: "600" },
      transform: { x: 91, y: 705, width: 245, height: 52 },
    },
    // Divider
    {
      type: "divider",
      props: { color: "#d4c5a9", thickness: 1, lineStyle: "solid", orientation: "horizontal" },
      transform: { x: 91, y: 787, width: 245, height: 9 },
    },
    // Social
    {
      type: "social-group",
      props: { platforms: ["instagram", "facebook"], iconSize: 26, gap: 20, iconColor: "#a08c6f", iconBg: "transparent", borderRadius: 999 },
      transform: { x: 168, y: 817, width: 91, height: 36 },
    },
  ],
};

/* ────────────────────────────────────────────
 * 6 ▸ GRADIENT — Modern gradient card
 * ──────────────────────────────────────────── */

const GRADIENT_THEME: ThemeTemplate = {
  id: "gradient",
  name: "Gradient",
  description: "Modern & colorful",
  artboard: { backgroundColor: "#0c0a1d" },
  elements: [
    // Badge
    {
      type: "badge",
      props: { text: "PRE-ORDER", icon: "🚀", bgColor: "#ec489922", textColor: "#f472b6", borderRadius: 999, fontSize: 10, fontWeight: "700" },
      transform: { x: 27, y: 36, width: 137, height: 30 },
    },
    // Heading
    {
      type: "heading",
      props: { text: "Next-Gen\nExperience", variant: "heading", fontSize: 32, fontWeight: "800", color: "#ffffff", textAlign: "left", lineHeight: 1.1, fontFamily: "inherit" },
      transform: { x: 27, y: 82, width: 373, height: 91 },
    },
    // Subtitle
    {
      type: "text",
      props: { text: "Redefining what's possible. Built for the future.", variant: "paragraph", fontSize: 14, fontWeight: "400", color: "#94a3b8", textAlign: "left", lineHeight: 1.6, fontFamily: "inherit" },
      transform: { x: 27, y: 187, width: 320, height: 55 },
    },
    // Product image (rounded)
    {
      type: "image",
      props: { src: "", alt: "Product", objectFit: "cover", borderRadius: 28 },
      transform: { x: 23, y: 265, width: 382, height: 319 },
    },
    // Stat card - Feature 1
    {
      type: "badge",
      props: { text: "4.9 ★ Rating", icon: "", bgColor: "#1e1b4b", textColor: "#c4b5fd", borderRadius: 12, fontSize: 12, fontWeight: "600" },
      transform: { x: 27, y: 607, width: 177, height: 41 },
    },
    // Stat card - Feature 2
    {
      type: "badge",
      props: { text: "50K+ Sold", icon: "", bgColor: "#1e1b4b", textColor: "#c4b5fd", borderRadius: 12, fontSize: 12, fontWeight: "600" },
      transform: { x: 223, y: 607, width: 177, height: 41 },
    },
    // Price
    {
      type: "text",
      props: { text: "$149", variant: "heading", fontSize: 36, fontWeight: "800", color: "#f472b6", textAlign: "left", lineHeight: 1.2, fontFamily: "inherit" },
      transform: { x: 27, y: 675, width: 171, height: 55 },
    },
    // CTA
    {
      type: "button",
      props: { text: "Pre-Order Now", url: "#", variant: "filled", bgColor: "#ec4899", textColor: "#ffffff", borderRadius: 16, fontSize: 15, fontWeight: "700" },
      transform: { x: 27, y: 753, width: 373, height: 59 },
    },
    // Social
    {
      type: "social-group",
      props: { platforms: ["twitter", "instagram", "tiktok"], iconSize: 28, gap: 14, iconColor: "#f472b6", iconBg: "#1e1b4b", borderRadius: 10 },
      transform: { x: 137, y: 844, width: 160, height: 41 },
    },
  ],
};

/* ─── Export All ─────────────────────────────── */

export const THEME_TEMPLATES: ThemeTemplate[] = [
  DEFAULT_THEME,
  MINIMAL_THEME,
  COMPACT_THEME,
  VIVID_THEME,
  ELEGANT_THEME,
  GRADIENT_THEME,
];

export function getThemeById(id: string): ThemeTemplate | undefined {
  return THEME_TEMPLATES.find((t) => t.id === id);
}
