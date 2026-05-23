/* ─────────────────────────────────────────────
 * Premium Beer - Dark Luxury Showcase Config
 *
 * Theme: Premium, mature, sophisticated, dark mode
 * Colors: Dark black, gold, amber, cream
 * ──────────────────────────────────────────── */

import type { BrandConfig } from "../types";

export const beerConfig: BrandConfig = {
  /* ── Identity ── */
  brandName: "Golden Reserve",
  productName: "Golden Reserve Premium Lager",
  tagline: "Crafted with precision. A distinguished premium lager brewed with the finest imported hops and mountain spring water.",
  logoIcon: "🍺",
  logoText: "Golden Reserve",

  /* ── Hero ── */
  heroImage: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&q=90",
  heroBackgroundImage: "https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=800&q=80",
  heroBackgroundGradient: "linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 40%, #2a1f0e 100%)",

  /* ── Colors ── */
  primaryColor: "#d4a843",
  secondaryColor: "#b07d3b",
  accentColor: "#f5e6c4",
  textPrimary: "#f5f0e8",
  textSecondary: "#9ca3af",
  bgPrimary: "#111111",
  bgSecondary: "#1a1a1a",
  bgCard: "#1e1e1e",
  ctaBackground: "#d4a843",
  ctaText: "#0a0a0a",

  /* ── Variants ── */
  variants: [
    { label: "330 ml", active: true },
    { label: "500 ml" },
    { label: "650 ml" },
  ],

  /* ── CTA ── */
  ctaLabel: "Feedback / Inquiry",
  ctaIcon: "💬",

  /* ── Social ── */
  socialLinks: [
    { platform: "website", url: "#" },
    { platform: "facebook", url: "#" },
    { platform: "instagram", url: "#" },
    { platform: "linkedin", url: "#" },
  ],

  /* ── About ── */
  aboutTitle: "About Golden Reserve",
  aboutText: "Golden Reserve is a premium lager crafted for the discerning palate. Brewed using traditional methods with the finest selected barley, imported Saaz hops, and crystal-clear mountain spring water, every sip delivers a balanced, rich flavor profile. Aged slowly in controlled conditions, Golden Reserve achieves a golden clarity and smooth finish that sets it apart from ordinary lagers. Best enjoyed chilled at 4-6°C.",

  /* ── Features ── */
  featuresTitle: "Craftsmanship",
  features: [
    { icon: "🏅", title: "Award-winning brew", description: "International recognition" },
    { icon: "🌾", title: "Premium ingredients", description: "Finest barley & hops" },
    { icon: "🏔️", title: "Mountain spring water", description: "Pure natural source" },
  ],

  /* ── Download ── */
  downloadAsset: {
    icon: "📖",
    title: "Tasting guide",
    subtitle: "8 pages",
    size: "1.8 MB",
  },

  /* ── Lifestyle ── */
  lifestyleTitle: "Elevate the evening",
  lifestyleImage: "https://images.unsplash.com/photo-1575037614876-c38a4c44f5b8?w=800&q=80",
  lifestyleOverlayGradient: "linear-gradient(to bottom, rgba(10,10,10,0.3), rgba(10,10,10,0.8))",

  /* ── Other Products ── */
  otherProductsTitle: "The Collection",
  otherProducts: [
    {
      name: "Dark Reserve",
      subtitle: "Dark stout",
      image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=200&q=80",
      bgColor: "#1a1a1a",
    },
    {
      name: "Wheat Gold",
      subtitle: "Wheat beer",
      image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=200&q=80",
      bgColor: "#2a1f0e",
    },
    {
      name: "IPA Select",
      subtitle: "India Pale Ale",
      image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=200&q=80",
      bgColor: "#1e2a1a",
    },
  ],

  /* ── Footer ── */
  footerMessage: "Crafted for Those Who Appreciate the Finer Things",
  footerSubMessage: "Drink Responsibly. 21+",
  footerBackgroundGradient: "linear-gradient(135deg, rgba(42,31,14,0.95), rgba(10,10,10,0.92))",

  /* ── Bottom ── */
  websiteUrl: "#",
  websiteLabel: "goldenreserve.com",
};
