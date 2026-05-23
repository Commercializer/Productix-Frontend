/* ─────────────────────────────────────────────
 * ProductShowcase - Reusable mobile-first product
 * showcase component. Feed it a BrandConfig and
 * it renders a complete, premium product detail page.
 *
 * Designed to match the reference UI:
 *  • Hero with splash background + product image
 *  • Brand identity + tagline
 *  • Size/variant selector pills
 *  • Primary CTA button
 *  • Social icons row
 *  • Expandable About section
 *  • Feature/benefits cards
 *  • Download/asset card
 *  • Lifestyle banner
 *  • Other Products horizontal scroll
 *  • Footer banner with brand message
 * ──────────────────────────────────────────── */

"use client";

import React, { useState } from "react";
import type { BrandConfig } from "./types";

/* ─── Social Icon SVGs ──────────────────────── */

const SocialIcons: Record<string, React.FC<{ className?: string }>> = {
  website: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  facebook: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  instagram: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  ),
  linkedin: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  twitter: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  youtube: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
      <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="white" />
    </svg>
  ),
  tiktok: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  ),
};

/* ─── Chevron Icon ──────────────────────────── */

const ChevronDown: React.FC<{ className?: string; expanded?: boolean }> = ({ className, expanded }) => (
  <svg
    className={`${className} transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

/* ─── Download Icon ─────────────────────────── */

const DownloadIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

/* ─── Message Icon ──────────────────────────── */

const MessageIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

/* ═══════════════════════════════════════════════
 * MAIN COMPONENT
 * ═══════════════════════════════════════════════ */

export interface ProductShowcaseProps {
  config: BrandConfig;
  className?: string;
}

export function ProductShowcase({ config, className = "" }: ProductShowcaseProps) {
  const [selectedVariant, setSelectedVariant] = useState(
    config.variants.findIndex((v) => v.active) >= 0
      ? config.variants.findIndex((v) => v.active)
      : 0
  );
  const [aboutExpanded, setAboutExpanded] = useState(false);

  return (
    <div
      className={`showcase-root ${className}`}
      style={{
        /* CSS custom properties from brand config */
        "--brand-primary": config.primaryColor,
        "--brand-secondary": config.secondaryColor,
        "--brand-accent": config.accentColor,
        "--brand-text-primary": config.textPrimary,
        "--brand-text-secondary": config.textSecondary,
        "--brand-bg-primary": config.bgPrimary,
        "--brand-bg-secondary": config.bgSecondary,
        "--brand-bg-card": config.bgCard,
        "--brand-cta-bg": config.ctaBackground,
        "--brand-cta-text": config.ctaText,
      } as React.CSSProperties}
    >
      {/* ── Scoped Styles ── */}
      <style>{`
        .showcase-root {
          font-family: var(--font-sans);
          max-width: 480px;
          margin: 0 auto;
          background: var(--brand-bg-primary);
          color: var(--brand-text-primary);
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        @media (min-width: 768px) {
          .showcase-root {
            max-width: 480px;
            border-radius: 32px;
            box-shadow: 0 25px 80px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05);
            margin: 32px auto;
            overflow: hidden;
          }
        }

        /* Smooth scroll for horizontal sections */
        .showcase-scroll-x {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding-bottom: 4px;
        }
        .showcase-scroll-x::-webkit-scrollbar { display: none; }
        .showcase-scroll-x > * { scroll-snap-align: start; flex-shrink: 0; }

        /* Animations */
        @keyframes showcase-fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes showcase-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes showcase-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .showcase-animate-in {
          animation: showcase-fadeInUp 0.6s ease-out both;
        }
        .showcase-animate-in-1 { animation-delay: 0.1s; }
        .showcase-animate-in-2 { animation-delay: 0.2s; }
        .showcase-animate-in-3 { animation-delay: 0.3s; }
        .showcase-animate-in-4 { animation-delay: 0.4s; }
        .showcase-animate-in-5 { animation-delay: 0.5s; }
        .showcase-float {
          animation: showcase-float 3s ease-in-out infinite;
        }
      `}</style>

      {/* ═══════════════════════════════════════════
       * 1. HERO SECTION
       * ═══════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          background: config.heroBackgroundGradient,
          minHeight: 340,
        }}
      >
        {/* Background image */}
        {config.heroBackgroundImage && (
          <img
            src={config.heroBackgroundImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: 0.4 }}
          />
        )}

        {/* Language selector (top right) */}
        <div className="relative z-10 flex justify-end pt-3 pr-4">
          <div
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm"
            style={{
              background: "rgba(255,255,255,0.15)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            English
            <ChevronDown className="w-3 h-3" />
          </div>
        </div>

        {/* Product image */}
        <div className="relative z-10 flex justify-center px-8 pt-4 pb-8">
          <img
            src={config.heroImage}
            alt={config.productName}
            className="showcase-float"
            style={{
              maxHeight: 240,
              width: "auto",
              objectFit: "contain",
              filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.3))",
            }}
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
       * 2. BRAND IDENTITY + VARIANTS
       * ═══════════════════════════════════════════ */}
      <section
        className="px-5 pt-5 pb-4 showcase-animate-in"
        style={{ background: config.bgPrimary }}
      >
        {/* Logo + Brand Name */}
        <div className="flex items-center gap-2.5 mb-1">
          <span className="text-2xl">{config.logoIcon}</span>
          {config.logoText && (
            <span
              className="text-sm font-bold tracking-wide"
              style={{ color: config.primaryColor }}
            >
              {config.logoText}
            </span>
          )}
        </div>

        {/* Product Name */}
        <h1
          className="text-xl font-bold mt-2 mb-2 showcase-animate-in showcase-animate-in-1"
          style={{ color: config.textPrimary, lineHeight: 1.3 }}
        >
          {config.productName}
        </h1>

        {/* Variant Selector Pills */}
        <div className="flex gap-2 mt-3 mb-3 showcase-animate-in showcase-animate-in-2">
          {config.variants.map((variant, idx) => (
            <button
              key={variant.label}
              type="button"
              onClick={() => setSelectedVariant(idx)}
              className="px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all duration-200"
              style={{
                background: selectedVariant === idx ? config.primaryColor : config.bgCard,
                color: selectedVariant === idx ? "#fff" : config.textSecondary,
                border: `1.5px solid ${selectedVariant === idx ? config.primaryColor : "rgba(0,0,0,0.08)"}`,
                transform: selectedVariant === idx ? "scale(1.05)" : "scale(1)",
                boxShadow: selectedVariant === idx ? `0 4px 12px ${config.primaryColor}40` : "none",
              }}
            >
              {variant.label}
            </button>
          ))}
        </div>

        {/* Tagline */}
        <p
          className="text-sm leading-relaxed mt-2 showcase-animate-in showcase-animate-in-3"
          style={{ color: config.textSecondary, lineHeight: 1.6 }}
        >
          {config.tagline}
        </p>
      </section>

      {/* ═══════════════════════════════════════════
       * 3. CTA BUTTON
       * ═══════════════════════════════════════════ */}
      <section
        className="px-5 pb-4 showcase-animate-in showcase-animate-in-3"
        style={{ background: config.bgPrimary }}
      >
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-lg active:scale-[0.98]"
          style={{
            background: config.ctaBackground,
            color: config.ctaText,
            boxShadow: `0 4px 16px ${config.ctaBackground}30`,
          }}
        >
          {config.ctaIcon ? (
            <span className="text-base">{config.ctaIcon}</span>
          ) : (
            <MessageIcon className="w-4 h-4" />
          )}
          {config.ctaLabel}
        </button>
      </section>

      {/* ═══════════════════════════════════════════
       * 4. SOCIAL ICONS ROW
       * ═══════════════════════════════════════════ */}
      <section
        className="px-5 pb-5 showcase-animate-in showcase-animate-in-4"
        style={{ background: config.bgPrimary }}
      >
        <div className="flex justify-center gap-4">
          {config.socialLinks.map((link) => {
            const IconComp = SocialIcons[link.platform];
            return (
              <a
                key={link.platform}
                href={link.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
                style={{
                  background: config.bgCard,
                  color: config.primaryColor,
                  border: `1px solid rgba(0,0,0,0.06)`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                {IconComp && <IconComp className="w-4.5 h-4.5" />}
              </a>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
       * 5. ABOUT SECTION (Expandable)
       * ═══════════════════════════════════════════ */}
      <section
        className="mx-5 mb-4 rounded-2xl overflow-hidden transition-all duration-300 showcase-animate-in showcase-animate-in-4"
        style={{
          background: config.bgCard,
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}
      >
        <div className="px-4 pt-4 pb-3">
          <h3
            className="text-sm font-bold mb-2"
            style={{ color: config.textPrimary }}
          >
            {config.aboutTitle}
          </h3>
          <p
            className="text-xs leading-relaxed transition-all duration-300"
            style={{
              color: config.textSecondary,
              lineHeight: 1.7,
              maxHeight: aboutExpanded ? "500px" : "60px",
              overflow: "hidden",
            }}
          >
            {config.aboutText}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAboutExpanded(!aboutExpanded)}
          className="w-full flex items-center justify-center gap-1 py-2.5 text-xs font-semibold transition-colors border-t"
          style={{
            color: config.textSecondary,
            borderColor: "rgba(0,0,0,0.06)",
          }}
        >
          {aboutExpanded ? "Show less" : "Read more"}
          <ChevronDown className="w-3.5 h-3.5" expanded={aboutExpanded} />
        </button>
      </section>

      {/* ═══════════════════════════════════════════
       * 6. FEATURES + DOWNLOAD GRID
       * ═══════════════════════════════════════════ */}
      <section className="px-5 pb-4 showcase-animate-in showcase-animate-in-5">
        <div className="flex gap-3">
          {/* Features/Benefits Column */}
          <div
            className="flex-1 rounded-2xl p-4"
            style={{
              background: config.bgCard,
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            }}
          >
            <h4
              className="text-xs font-bold mb-3"
              style={{ color: config.textPrimary }}
            >
              {config.featuresTitle}
            </h4>
            <div className="flex flex-col gap-2.5">
              {config.features.map((feat) => (
                <div key={feat.title} className="flex items-start gap-2.5">
                  <span className="text-sm flex-shrink-0 mt-0.5">{feat.icon}</span>
                  <span
                    className="text-xs font-medium"
                    style={{ color: config.textPrimary, lineHeight: 1.4 }}
                  >
                    {feat.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Download Asset Card */}
          <div
            className="w-[130px] flex-shrink-0 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 hover:scale-[1.02]"
            style={{
              background: config.bgCard,
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-2"
              style={{ background: `${config.primaryColor}15` }}
            >
              <DownloadIcon className="w-5 h-5" style={{ color: config.primaryColor }} />
            </div>
            <span
              className="text-xs font-bold"
              style={{ color: config.textPrimary }}
            >
              {config.downloadAsset.title}
            </span>
            <span
              className="text-[10px] mt-0.5"
              style={{ color: config.textSecondary }}
            >
              {config.downloadAsset.subtitle}
            </span>
            <span
              className="text-[10px] mt-0.5"
              style={{ color: config.textSecondary }}
            >
              {config.downloadAsset.size}
            </span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
       * 7. LIFESTYLE BANNER
       * ═══════════════════════════════════════════ */}
      <section className="mx-5 mb-4 rounded-2xl overflow-hidden relative" style={{ height: 180 }}>
        <img
          src={config.lifestyleImage}
          alt={config.lifestyleTitle}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background: config.lifestyleOverlayGradient || "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5))",
          }}
        />
        <div className="relative z-10 flex flex-col justify-end h-full p-4">
          <p className="text-white text-sm font-semibold" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.3)" }}>
            {config.lifestyleTitle}
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
       * 8. OTHER PRODUCTS - Horizontal Scroll
       * ═══════════════════════════════════════════ */}
      <section className="px-5 pb-4">
        <h3
          className="text-sm font-bold mb-3"
          style={{ color: config.textPrimary }}
        >
          {config.otherProductsTitle}
        </h3>
        <div className="showcase-scroll-x">
          {config.otherProducts.map((product) => (
            <div
              key={product.name}
              className="w-[140px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:scale-[1.03]"
              style={{
                background: config.bgCard,
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              }}
            >
              <div
                className="h-24 flex items-center justify-center p-2"
                style={{ background: product.bgColor }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-auto object-contain"
                  style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))" }}
                />
              </div>
              <div className="p-3">
                <p
                  className="text-xs font-bold truncate"
                  style={{ color: config.textPrimary }}
                >
                  {product.name}
                </p>
                <p
                  className="text-[10px] mt-0.5 truncate"
                  style={{ color: config.textSecondary }}
                >
                  {product.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* View All */}
        <button
          type="button"
          className="w-full mt-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 hover:opacity-80"
          style={{
            background: config.bgCard,
            color: config.textSecondary,
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          View all
        </button>
      </section>

      {/* ═══════════════════════════════════════════
       * 9. FOOTER BANNER
       * ═══════════════════════════════════════════ */}
      <section
        className="mx-5 mb-4 rounded-2xl overflow-hidden relative"
        style={{ minHeight: 180 }}
      >
        {/* Background */}
        {config.footerBackgroundImage ? (
          <img
            src={config.footerBackgroundImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : null}
        <div
          className="absolute inset-0"
          style={{ background: config.footerBackgroundGradient }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center h-full p-6 text-center" style={{ minHeight: 180 }}>
          <h2
            className="text-lg font-bold leading-tight mb-2"
            style={{ color: "#fff", textShadow: "0 2px 12px rgba(0,0,0,0.2)" }}
          >
            {config.footerMessage}
          </h2>
          {config.footerSubMessage && (
            <p
              className="text-xs font-medium"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              {config.footerSubMessage}
            </p>
          )}
          {/* Small logo repeat */}
          <div className="mt-3 flex items-center gap-1.5">
            <span className="text-base">{config.logoIcon}</span>
            {config.logoText && (
              <span className="text-xs font-bold text-white/80">{config.logoText}</span>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
       * 10. BOTTOM WEBSITE LINK
       * ═══════════════════════════════════════════ */}
      <footer
        className="flex items-center justify-center py-4 text-xs font-medium"
        style={{ color: config.primaryColor }}
      >
        <a
          href={config.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:underline"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          {config.websiteLabel}
        </a>
      </footer>
    </div>
  );
}
