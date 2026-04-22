/* ─────────────────────────────────────────────
 * Product Showcase — Brand Configuration Types
 *
 * Defines the shape of data needed to render a
 * complete mobile-first product showcase page.
 * ──────────────────────────────────────────── */

/** A size/variant option (e.g., 250ml, 330ml, 500ml) */
export interface VariantOption {
  label: string;
  active?: boolean;
}

/** A feature/benefit item */
export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

/** A downloadable asset (recipe book, brochure, etc.) */
export interface DownloadAsset {
  icon: string;
  title: string;
  subtitle: string;
  size: string;
}

/** An "other product" card */
export interface OtherProduct {
  name: string;
  subtitle: string;
  image: string;
  bgColor: string;
}

/** Social link item */
export interface SocialLink {
  platform: "website" | "facebook" | "instagram" | "linkedin" | "twitter" | "youtube" | "tiktok";
  url?: string;
}

/** Complete brand configuration for the showcase template */
export interface BrandConfig {
  /* ── Identity ── */
  brandName: string;
  productName: string;
  tagline: string;
  logoIcon: string;          // Emoji, SVG, or URL
  logoText?: string;         // Optional text beside logo

  /* ── Hero ── */
  heroImage: string;         // Product image URL
  heroBackgroundImage?: string; // Splash/background image URL
  heroBackgroundGradient: string; // CSS gradient fallback

  /* ── Colors ── */
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textPrimary: string;
  textSecondary: string;
  bgPrimary: string;
  bgSecondary: string;
  bgCard: string;
  ctaBackground: string;
  ctaText: string;

  /* ── Variants ── */
  variants: VariantOption[];

  /* ── CTA ── */
  ctaLabel: string;
  ctaIcon?: string;

  /* ── Social ── */
  socialLinks: SocialLink[];

  /* ── About ── */
  aboutTitle: string;
  aboutText: string;

  /* ── Features / Benefits ── */
  featuresTitle: string;
  features: FeatureItem[];

  /* ── Download Asset ── */
  downloadAsset: DownloadAsset;

  /* ── Lifestyle Banner ── */
  lifestyleTitle: string;
  lifestyleImage: string;
  lifestyleOverlayGradient?: string;

  /* ── Other Products ── */
  otherProductsTitle: string;
  otherProducts: OtherProduct[];

  /* ── Footer Banner ── */
  footerMessage: string;
  footerSubMessage?: string;
  footerBackgroundImage?: string;
  footerBackgroundGradient: string;

  /* ── Bottom Link ── */
  websiteUrl: string;
  websiteLabel: string;
}
