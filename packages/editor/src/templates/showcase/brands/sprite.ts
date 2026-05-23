/* ─────────────────────────────────────────────
 * Sprite - Fresh Lemon-Lime Showcase Config
 *
 * Theme: Fresh, green, bubbly, refreshing
 * Colors: Vibrant green, yellow-green, white
 * ──────────────────────────────────────────── */

import type { BrandConfig } from "../types";

export const spriteConfig: BrandConfig = {
  /* ── Identity ── */
  brandName: "Sprite",
  productName: "Sprite Lemon-Lime",
  tagline: "Obey your thirst. Crisp, clean, and refreshingly honest. The iconic lemon-lime soda since 1961.",
  logoIcon: "🍋",
  logoText: "Sprite",

  /* ── Hero ── */
  heroImage: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&q=90",
  heroBackgroundImage: "https://images.unsplash.com/photo-1560512823-829485b8bf24?w=800&q=80",
  heroBackgroundGradient: "linear-gradient(180deg, #065f46 0%, #059669 40%, #34d399 100%)",

  /* ── Colors ── */
  primaryColor: "#059669",
  secondaryColor: "#a3e635",
  accentColor: "#fbbf24",
  textPrimary: "#064e3b",
  textSecondary: "#6b7280",
  bgPrimary: "#ffffff",
  bgSecondary: "#ecfdf5",
  bgCard: "#f0fdf4",
  ctaBackground: "#059669",
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
    { platform: "website", url: "https://sprite.com" },
    { platform: "facebook", url: "#" },
    { platform: "instagram", url: "#" },
    { platform: "youtube", url: "#" },
  ],

  /* ── About ── */
  aboutTitle: "About Sprite",
  aboutText: "Sprite is a colorless, caffeine-free, lemon and lime-flavored soft drink created by The Coca-Cola Company. First developed in West Germany in 1959, Sprite was introduced to the United States as a competitor to 7 Up in 1961. Today, Sprite is sold in over 190 countries and is one of the world's best-selling soft drinks. Its crisp, clean taste and refreshingly honest branding have made it a cultural icon.",

  /* ── Features ── */
  featuresTitle: "Why Sprite?",
  features: [
    { icon: "🍃", title: "Refreshingly crisp", description: "Natural lemon-lime flavor" },
    { icon: "💧", title: "Zero caffeine", description: "No caffeine added" },
    { icon: "✨", title: "Thirst-quenching", description: "Perfect for any occasion" },
  ],

  /* ── Download ── */
  downloadAsset: {
    icon: "🍹",
    title: "Mocktail recipes",
    subtitle: "15 recipes",
    size: "2.1 MB",
  },

  /* ── Lifestyle ── */
  lifestyleTitle: "Stay cool, stay refreshed",
  lifestyleImage: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&q=80",
  lifestyleOverlayGradient: "linear-gradient(to bottom, rgba(6,95,70,0.15), rgba(6,95,70,0.65))",

  /* ── Other Products ── */
  otherProductsTitle: "More from Sprite",
  otherProducts: [
    {
      name: "Sprite Zero",
      subtitle: "Zero sugar",
      image: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=200&q=80",
      bgColor: "#d1fae5",
    },
    {
      name: "Sprite Lymonade",
      subtitle: "Lemonade twist",
      image: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=200&q=80",
      bgColor: "#fef3c7",
    },
    {
      name: "Sprite Tropical",
      subtitle: "Tropical mix",
      image: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=200&q=80",
      bgColor: "#e0f2fe",
    },
  ],

  /* ── Footer ── */
  footerMessage: "Obey Your Thirst",
  footerSubMessage: "The Coca-Cola Company",
  footerBackgroundGradient: "linear-gradient(135deg, rgba(5,150,105,0.92), rgba(16,185,129,0.88))",

  /* ── Bottom ── */
  websiteUrl: "https://sprite.com",
  websiteLabel: "sprite.com",
};
