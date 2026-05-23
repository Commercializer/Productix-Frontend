/* ─────────────────────────────────────────────
 * Coca-Cola - Classic Red Showcase Config
 *
 * Theme: Bold, nostalgic, iconic, classic
 * Colors: Coca-Cola red, white, dark
 * ──────────────────────────────────────────── */

import type { BrandConfig } from "../types";

export const cocacolaConfig: BrandConfig = {
  /* ── Identity ── */
  brandName: "Coca-Cola",
  productName: "Coca-Cola Original Taste",
  tagline: "Taste the feeling. The world's most iconic beverage - unchanged and unmatched since 1886.",
  logoIcon: "🥤",
  logoText: "Coca-Cola",

  /* ── Hero ── */
  heroImage: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&q=90",
  heroBackgroundImage: "https://images.unsplash.com/photo-1581098365948-6a5a912b7a49?w=800&q=80",
  heroBackgroundGradient: "linear-gradient(180deg, #7f1d1d 0%, #dc2626 40%, #ef4444 100%)",

  /* ── Colors ── */
  primaryColor: "#dc2626",
  secondaryColor: "#f87171",
  accentColor: "#fbbf24",
  textPrimary: "#1a1a1a",
  textSecondary: "#6b7280",
  bgPrimary: "#ffffff",
  bgSecondary: "#fef2f2",
  bgCard: "#fff5f5",
  ctaBackground: "#dc2626",
  ctaText: "#ffffff",

  /* ── Variants ── */
  variants: [
    { label: "250 ml" },
    { label: "330 ml", active: true },
    { label: "500 ml" },
    { label: "1.5 L" },
  ],

  /* ── CTA ── */
  ctaLabel: "Feedback / Inquiry",
  ctaIcon: "💬",

  /* ── Social ── */
  socialLinks: [
    { platform: "website", url: "https://coca-cola.com" },
    { platform: "facebook", url: "#" },
    { platform: "instagram", url: "#" },
    { platform: "twitter", url: "#" },
  ],

  /* ── About ── */
  aboutTitle: "About Coca-Cola",
  aboutText: "Coca-Cola, introduced in 1886, is the world's favorite sparkling beverage. Made with a secret formula that has remained largely unchanged for over a century, Coca-Cola delivers a unique, refreshing taste that has made it a cultural icon. Available in more than 200 countries, Coca-Cola is more than a drink - it's a symbol of happiness, togetherness, and timeless moments shared between friends and family.",

  /* ── Features ── */
  featuresTitle: "What Makes It Special",
  features: [
    { icon: "⭐", title: "Original recipe", description: "The one and only" },
    { icon: "🎉", title: "Moments of happiness", description: "Brings people together" },
    { icon: "🌍", title: "Available worldwide", description: "200+ countries" },
  ],

  /* ── Download ── */
  downloadAsset: {
    icon: "📋",
    title: "Brand story",
    subtitle: "12 pages",
    size: "3.2 MB",
  },

  /* ── Lifestyle ── */
  lifestyleTitle: "Open happiness, share the moment",
  lifestyleImage: "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?w=800&q=80",
  lifestyleOverlayGradient: "linear-gradient(to bottom, rgba(127,29,29,0.2), rgba(127,29,29,0.7))",

  /* ── Other Products ── */
  otherProductsTitle: "More Coca-Cola Products",
  otherProducts: [
    {
      name: "Coca-Cola Zero",
      subtitle: "Zero sugar, same taste",
      image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=200&q=80",
      bgColor: "#1a1a1a",
    },
    {
      name: "Diet Coke",
      subtitle: "Light & refreshing",
      image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=200&q=80",
      bgColor: "#e5e7eb",
    },
    {
      name: "Cherry Coke",
      subtitle: "Cherry-flavored cola",
      image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=200&q=80",
      bgColor: "#fecaca",
    },
  ],

  /* ── Footer ── */
  footerMessage: "Taste The Feeling Since 1886",
  footerSubMessage: "The Coca-Cola Company",
  footerBackgroundImage: "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?w=800&q=80",
  footerBackgroundGradient: "linear-gradient(135deg, rgba(220,38,38,0.92), rgba(185,28,28,0.88))",

  /* ── Bottom ── */
  websiteUrl: "https://coca-cola.com",
  websiteLabel: "coca-cola.com",
};
