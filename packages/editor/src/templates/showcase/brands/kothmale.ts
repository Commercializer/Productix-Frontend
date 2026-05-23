/* ─────────────────────────────────────────────
 * Kothmale Fresh Milk - Sri Lankan Dairy Config
 *
 * Theme: Clean, white, natural, dairy freshness
 * Colors: White, sky blue, green, cream
 * Sri Lankan local brand feel
 * ──────────────────────────────────────────── */

import type { BrandConfig } from "../types";

export const kothmaleConfig: BrandConfig = {
  /* ── Identity ── */
  brandName: "Kothmale",
  productName: "Kothmale Fresh Milk",
  tagline: "Pure, farm-fresh goodness from the lush green hills of Sri Lanka. Rich in calcium and essential vitamins for your daily nutrition.",
  logoIcon: "🥛",
  logoText: "Kothmale",

  /* ── Hero ── */
  heroImage: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=90",
  heroBackgroundImage: "https://images.unsplash.com/photo-1530268729831-4b0b9e170218?w=800&q=80",
  heroBackgroundGradient: "linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 40%, #bae6fd 100%)",

  /* ── Colors ── */
  primaryColor: "#0284c7",
  secondaryColor: "#22c55e",
  accentColor: "#f59e0b",
  textPrimary: "#0c4a6e",
  textSecondary: "#64748b",
  bgPrimary: "#ffffff",
  bgSecondary: "#f0f9ff",
  bgCard: "#f8fafc",
  ctaBackground: "#0284c7",
  ctaText: "#ffffff",

  /* ── Variants ── */
  variants: [
    { label: "200 ml" },
    { label: "500 ml", active: true },
    { label: "1 L" },
  ],

  /* ── CTA ── */
  ctaLabel: "Feedback / Inquiry",
  ctaIcon: "💬",

  /* ── Social ── */
  socialLinks: [
    { platform: "website", url: "#" },
    { platform: "facebook", url: "#" },
    { platform: "instagram", url: "#" },
    { platform: "youtube", url: "#" },
  ],

  /* ── About ── */
  aboutTitle: "About Kothmale Fresh Milk",
  aboutText: "Kothmale is Sri Lanka's beloved dairy brand, delivering pure, farm-fresh milk straight from the lush green pastures of the central highlands. With a commitment to quality that spans decades, every pack of Kothmale Fresh Milk is sourced from trusted local dairy farmers, pasteurized under strict conditions, and packed with the natural goodness of calcium, vitamins, and protein. Kothmale supports local farming communities while bringing the freshest dairy products to Sri Lankan families every day.",

  /* ── Features ── */
  featuresTitle: "Goodness Inside",
  features: [
    { icon: "🐄", title: "Farm fresh daily", description: "From local Sri Lankan farms" },
    { icon: "💪", title: "Calcium & vitamins", description: "Essential daily nutrition" },
    { icon: "🌿", title: "100% natural", description: "No preservatives added" },
  ],

  /* ── Download ── */
  downloadAsset: {
    icon: "🍳",
    title: "Recipes booklet",
    subtitle: "25 recipes",
    size: "2.5 MB",
  },

  /* ── Lifestyle ── */
  lifestyleTitle: "Start every morning with farm-fresh goodness",
  lifestyleImage: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800&q=80",
  lifestyleOverlayGradient: "linear-gradient(to bottom, rgba(12,74,110,0.15), rgba(12,74,110,0.6))",

  /* ── Other Products ── */
  otherProductsTitle: "More Kothmale Products",
  otherProducts: [
    {
      name: "Chocolate Milk",
      subtitle: "Rich cocoa flavor",
      image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&q=80",
      bgColor: "#fef3c7",
    },
    {
      name: "Curd",
      subtitle: "Traditional Sri Lankan",
      image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&q=80",
      bgColor: "#ecfdf5",
    },
    {
      name: "Yoghurt",
      subtitle: "Fruity & creamy",
      image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&q=80",
      bgColor: "#fce7f3",
    },
  ],

  /* ── Footer ── */
  footerMessage: "Pure Goodness from the Hills of Sri Lanka",
  footerSubMessage: "Milco (Pvt) Ltd",
  footerBackgroundImage: "https://images.unsplash.com/photo-1530268729831-4b0b9e170218?w=800&q=80",
  footerBackgroundGradient: "linear-gradient(135deg, rgba(2,132,199,0.9), rgba(34,197,94,0.85))",

  /* ── Bottom ── */
  websiteUrl: "#",
  websiteLabel: "kothmale.lk",
};
