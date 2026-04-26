/* ─────────────────────────────────────────────
 * Red Bull — Energy Drink Showcase Config
 *
 * Theme: Dynamic, sporty, high-energy
 * Colors: Dark navy, electric blue, silver
 * ──────────────────────────────────────────── */

import type { BrandConfig } from "../types";

export const redbullConfig: BrandConfig = {
  /* ── Identity ── */
  brandName: "Red Bull",
  productName: "Red Bull Energy Drink",
  tagline: "The original Red Bull Energy Drink. Giving wiiings to people and ideas since 1987.",
  logoIcon: "🐂",
  logoText: "Red Bull",

  /* ── Hero ── */
  heroImage: "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=400&q=90",
  heroBackgroundImage: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&q=80",
  heroBackgroundGradient: "linear-gradient(180deg, #0a1628 0%, #1a3a5c 40%, #2563eb 100%)",

  /* ── Colors ── */
  primaryColor: "#1e40af",
  secondaryColor: "#00d4ff",
  accentColor: "#ffd60a",
  textPrimary: "#1a1a2e",
  textSecondary: "#6b7280",
  bgPrimary: "#ffffff",
  bgSecondary: "#f0f4f8",
  bgCard: "#f8fafc",
  ctaBackground: "#1e3a5f",
  ctaText: "#ffffff",

  /* ── Variants ── */
  variants: [
    { label: "250 ml", active: true },
    { label: "473 ml" },
    { label: "355 ml" },
  ],

  /* ── CTA ── */
  ctaLabel: "Feedback / Inquiry",
  ctaIcon: "💬",

  /* ── Social ── */
  socialLinks: [
    { platform: "website", url: "https://redbull.com" },
    { platform: "facebook", url: "#" },
    { platform: "instagram", url: "#" },
    { platform: "linkedin", url: "#" },
  ],

  /* ── About ── */
  aboutTitle: "About Red Bull Energy Drink",
  aboutText: "Red Bull Energy Drink is appreciated worldwide by top athletes, busy professionals, college students and travelers on long journeys. It vitalizes body and mind. Red Bull gives you wiiings whenever you need them — whether at work, during sports, while studying, playing video games, or during leisure activities. Red Bull is the world's #1 energy drink, available in 172 countries.",

  /* ── Features ── */
  featuresTitle: "Benefits",
  features: [
    { icon: "⚡", title: "Stay alert", description: "Keeps you alert and focused" },
    { icon: "🔋", title: "Reduce fatigue", description: "Fights mental fatigue" },
    { icon: "🚀", title: "Kickstart your day", description: "Boosts energy levels" },
  ],

  /* ── Download ── */
  downloadAsset: {
    icon: "📖",
    title: "Recipe book",
    subtitle: "20 pages",
    size: "1.4 MB",
  },

  /* ── Lifestyle ── */
  lifestyleTitle: "Ready to take off?",
  lifestyleImage: "https://images.unsplash.com/photo-1496737018672-b1a6be2e949c?w=800&q=80",
  lifestyleOverlayGradient: "linear-gradient(to bottom, rgba(10,22,40,0.2), rgba(10,22,40,0.7))",

  /* ── Other Products ── */
  otherProductsTitle: "Other Red Bull Drinks",
  otherProducts: [
    {
      name: "Red Bull Zero",
      subtitle: "Red Bull Zero",
      image: "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=200&q=80",
      bgColor: "#e8f0fe",
    },
    {
      name: "Sugarfree Energy Drink",
      subtitle: "Sugar-free energy drink",
      image: "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=200&q=80",
      bgColor: "#dbeafe",
    },
  ],

  /* ── Footer ── */
  footerMessage: "Giving wiiings to people & ideas since 1987",
  footerSubMessage: "Red Bull GmbH",
  footerBackgroundImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  footerBackgroundGradient: "linear-gradient(135deg, rgba(30,64,175,0.9), rgba(29,78,216,0.85))",

  /* ── Bottom ── */
  websiteUrl: "https://store.redbull.com",
  websiteLabel: "store.redbull.com",
};
