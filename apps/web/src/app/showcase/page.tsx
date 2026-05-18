/* ─────────────────────────────────────────────
 * Showcase Preview Page
 *
 * A gallery page that displays all 5 brand
 * showcase templates side by side with a
 * brand selector.
 * ──────────────────────────────────────────── */

"use client";

import React, { useState } from "react";
import {
  ProductShowcase,
  allBrandConfigs,
} from "@productix/editor/templates/showcase";

export default function ShowcasePage() {
  const [activeBrand, setActiveBrand] = useState(0);
  const activeConfig = allBrandConfigs[activeBrand]!;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* ── Brand Selector Toolbar ── */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-gray-950/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                P
              </div>
              <div>
                <h1 className="text-white text-sm font-semibold">Product Showcase Templates</h1>
                <p className="text-gray-500 text-[11px]">Mobile-first brand landing pages</p>
              </div>
            </div>
            <span className="text-[10px] text-gray-600 font-mono">
              {activeConfig.config.brandName} • 375px viewport
            </span>
          </div>

          {/* Brand Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {allBrandConfigs.map((brand, idx) => (
              <button
                key={brand.id}
                type="button"
                onClick={() => setActiveBrand(idx)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                  activeBrand === idx
                    ? "bg-white text-gray-900 shadow-lg shadow-white/10 scale-105"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200"
                }`}
              >
                <span className="text-sm">{brand.config.logoIcon}</span>
                {brand.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── Showcase Render ── */}
      <main className="py-8 px-4">
        <div
          className="mx-auto transition-all duration-500 ease-out"
          style={{ maxWidth: 480 }}
        >
          {/* Phone frame wrapper */}
          <div className="relative">
            {/* Notch (decorative) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-950 rounded-b-2xl z-20" />

            {/* Phone body */}
            <div
              className="rounded-[2.5rem] overflow-hidden shadow-2xl"
              style={{
                boxShadow: `0 0 0 2px rgba(255,255,255,0.08), 0 25px 100px rgba(0,0,0,0.5), 0 0 80px ${activeConfig.config.primaryColor}20`,
              }}
            >
              {/* Status bar */}
              <div className="bg-black flex items-center justify-between px-6 py-2 text-white text-[10px] font-semibold">
                <span>9:41</span>
                <div className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3C7.8 3 4.1 5 2 8l2.2 2.2C5.8 8.2 8.7 7 12 7s6.2 1.2 7.8 3.2L22 8c-2.1-3-5.8-5-10-5zm0 4c-3 0-5.7 1.3-7.5 3.5L6.7 12.7C7.9 11.4 9.8 10.5 12 10.5s4.1.9 5.3 2.2l2.2-2.2C17.7 8.3 15 7 12 7zm0 4c-1.9 0-3.6.8-4.8 2.1l2.2 2.2c.7-.7 1.6-1.1 2.6-1.1s1.9.4 2.6 1.1l2.2-2.2C15.6 11.8 13.9 11 12 11zm0 4c-.8 0-1.5.3-2 .9L12 18l2-2.1c-.5-.6-1.2-.9-2-.9z" />
                  </svg>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="1" y="6" width="3" height="12" rx="0.5" /><rect x="6" y="4" width="3" height="14" rx="0.5" /><rect x="11" y="2" width="3" height="16" rx="0.5" /><rect x="16" y="0" width="3" height="18" rx="0.5" />
                  </svg>
                  <svg className="w-5 h-3" fill="currentColor" viewBox="0 0 28 14">
                    <rect x="0.5" y="0.5" width="23" height="13" rx="2" stroke="currentColor" fill="none" strokeOpacity="0.35" /><rect x="24.5" y="4" width="2.5" height="6" rx="1" fillOpacity="0.4" /><rect x="2" y="2" width="19" height="10" rx="1" />
                  </svg>
                </div>
              </div>

              {/* Showcase content */}
              <ProductShowcase config={activeConfig.config} />

              {/* Home indicator */}
              <div className="bg-black flex justify-center py-2">
                <div className="w-32 h-1 bg-white/30 rounded-full" />
              </div>
            </div>
          </div>

          {/* Brand info card */}
          <div className="mt-8 bg-white/5 rounded-2xl p-5 border border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{activeConfig.config.logoIcon}</span>
              <div>
                <h3 className="text-white text-sm font-bold">{activeConfig.config.brandName}</h3>
                <p className="text-gray-500 text-xs">{activeConfig.config.productName}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 bg-white/5 rounded-md text-[10px] text-gray-400 font-medium">
                Mobile-first
              </span>
              <span className="px-2.5 py-1 bg-white/5 rounded-md text-[10px] text-gray-400 font-medium">
                {activeConfig.config.variants.length} variants
              </span>
              <span className="px-2.5 py-1 bg-white/5 rounded-md text-[10px] text-gray-400 font-medium">
                {activeConfig.config.features.length} features
              </span>
              <span className="px-2.5 py-1 bg-white/5 rounded-md text-[10px] text-gray-400 font-medium">
                {activeConfig.config.otherProducts.length} products
              </span>
              <span
                className="px-2.5 py-1 rounded-md text-[10px] font-medium"
                style={{
                  background: activeConfig.config.primaryColor + "20",
                  color: activeConfig.config.primaryColor,
                }}
              >
                {activeConfig.config.primaryColor}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
