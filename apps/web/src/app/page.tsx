"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { templates, PublicRenderer, PreviewRenderer } from "@productix/editor";
import type { Template } from "@productix/types";
import {
  ArrowRight,
  Sparkles,
  MousePointer2,
  Layers,
  Wand2,
  Globe2,
  Smartphone,
  QrCode,
  Zap,
  PlayCircle,
  ChevronRight,
  Check,
  Star,
} from "lucide-react";

/* ────────────────────────────────────────────────────────────
 * Root landing page — light editorial, motion-rich
 * Light surfaces · near-black ink · pastel auroras · dark
 * editor mockups for cinematic contrast.
 * ──────────────────────────────────────────────────────────── */

export default function LandingPage() {
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#fafaf7] text-[#0a0a0a] antialiased selection:bg-black selection:text-white">
      <Header />
      <Hero />
      <LogoMarquee />
      <ManifestoSection />
      <BentoFeatures />
      <LiveCanvasShowcase />
      <TemplatesShowcase onPreview={setPreviewTemplate} />
      <StatsRibbon />
      <WorkflowSection />
      <TestimonialMarquee />
      <FinalCTA />
      <Footer />

      {previewTemplate && (
        <TemplateModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
        />
      )}
    </div>
  );
}

/* ──────────────────────────────────────── Header */

function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-black/[0.06] bg-[#fafaf7]/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <Image
            src="/logo-light.png"
            alt="Productix"
            width={140}
            height={32}
            priority
            className="h-7 w-auto select-none transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <span className="ml-1 hidden rounded-full border border-black/10 bg-black/[0.03] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-black/55 sm:inline-flex">
            Studio
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {[
            { label: "Product", href: "#features" },
            { label: "Templates", href: "#templates" },
            { label: "Showcase", href: "#showcase" },
            { label: "Workflow", href: "#workflow" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-full px-4 py-2 text-[13.5px] font-medium text-black/55 transition-colors hover:bg-black/[0.04] hover:text-black"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden rounded-full px-4 py-2 text-[13.5px] font-medium text-black/65 transition-colors hover:text-black sm:inline-flex"
          >
            Log in
          </Link>
          <Link
            href="/dashboard"
            className="group relative inline-flex h-9 items-center gap-1.5 overflow-hidden rounded-full bg-black px-4 text-[13px] font-semibold text-white transition-all hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.4)]"
          >
            <span className="relative z-10">Open Studio</span>
            <ArrowRight className="relative z-10 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ──────────────────────────────────────── Hero */

function Hero() {
  return (
    <section className="lp-noise-light relative isolate overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
      {/* Pastel aurora gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-[680px] w-[680px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(244,114,182,0.28),transparent_60%)] blur-3xl [animation:lp-aurora-shift_18s_ease-in-out_infinite]" />
        <div className="absolute right-[-10%] top-[20%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.22),transparent_60%)] blur-3xl [animation:lp-aurora-shift-2_22s_ease-in-out_infinite]" />
        <div className="absolute left-[-10%] bottom-[-10%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.22),transparent_60%)] blur-3xl [animation:lp-aurora-shift_24s_ease-in-out_infinite_reverse]" />
      </div>

      {/* Subtle grid */}
      <div className="lp-grid-bg-light pointer-events-none absolute inset-0 -z-10 opacity-70 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        {/* Left — copy */}
        <div className="lp-reveal">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white/70 px-3 py-1.5 text-[11.5px] font-medium uppercase tracking-[0.14em] text-black/65 shadow-[0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur-md">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-emerald-500 [animation:lp-ping-slow_2s_ease-out_infinite]" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            New · Multi-brand showcase engine
          </div>

          <h1 className="text-[clamp(2.6rem,6vw,5.25rem)] font-medium leading-[0.96] tracking-[-0.035em] text-balance text-[#0a0a0a]">
            Design product pages
            <br className="hidden sm:block" />{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-600 bg-clip-text italic text-transparent">
                that move markets.
              </span>
              <svg
                className="absolute left-0 right-0 -bottom-3 h-2.5 w-full"
                viewBox="0 0 400 12"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 8 Q 100 2, 200 7 T 398 6"
                  stroke="url(#hero-underline)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray="500"
                  strokeDashoffset="500"
                  style={{
                    animation:
                      "lp-stroke-draw 1.4s cubic-bezier(0.65,0,0.35,1) 0.5s forwards",
                  }}
                />
                <defs>
                  <linearGradient id="hero-underline" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="#c026d3" />
                    <stop offset="100%" stopColor="#0891b2" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-[17px] leading-[1.55] text-black/55 text-pretty">
            A freeform visual studio for agencies, brands, and product
            marketers. Compose layered, cinematic showcases — overlap, animate,
            translate, ship — without writing a single line of code.
          </p>

          <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link
              href="/editor"
              className="group relative inline-flex h-12 items-center gap-2 overflow-hidden rounded-full bg-black px-6 text-[14px] font-semibold text-white shadow-[0_12px_40px_-12px_rgba(0,0,0,0.5)] transition-all hover:shadow-[0_16px_50px_-12px_rgba(0,0,0,0.65)]"
            >
              <span className="relative z-10">Start designing</span>
              <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </Link>
            <Link
              href="#showcase"
              className="group inline-flex h-12 items-center gap-2.5 rounded-full border border-black/10 bg-white/60 px-5 text-[14px] font-medium text-black/80 backdrop-blur-md transition-all hover:border-black/25 hover:bg-white"
            >
              <PlayCircle className="h-4 w-4 text-black/55 transition-colors group-hover:text-black" />
              Watch the canvas live
            </Link>
          </div>

          {/* Microproof */}
          <div className="mt-10 flex items-center gap-5">
            <div className="flex -space-x-2.5">
              {[
                "from-fuchsia-500 to-rose-500",
                "from-cyan-400 to-blue-500",
                "from-amber-400 to-orange-500",
                "from-emerald-400 to-teal-500",
              ].map((g, i) => (
                <div
                  key={i}
                  className={`h-8 w-8 rounded-full border-2 border-[#fafaf7] bg-gradient-to-br ${g}`}
                />
              ))}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-0.5 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
                <span className="ml-1.5 text-[12px] font-semibold text-black/75">
                  4.9
                </span>
              </div>
              <p className="mt-0.5 text-[12px] text-black/45">
                Trusted by 2,400+ creative teams worldwide
              </p>
            </div>
          </div>
        </div>

        {/* Right — faux live editor */}
        <div
          className="lp-reveal relative"
          style={{ animationDelay: "0.15s" }}
        >
          <FauxEditorPreview />
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────── Faux Editor Preview
 * Dark internally — reads as a real product screenshot, with
 * crisp contrast against the light page background.
 * ─────────────────────────────────────────────────────────── */

function FauxEditorPreview() {
  return (
    <div className="relative">
      {/* Soft glow halo */}
      <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-gradient-to-br from-fuchsia-400/25 via-violet-400/15 to-cyan-400/25 blur-3xl [animation:lp-glow-pulse_4s_ease-in-out_infinite]" />

      {/* Floating labels */}
      <div className="absolute -top-3 -left-3 z-30 hidden md:block">
        <div className="flex items-center gap-2 rounded-full border border-black/[0.06] bg-white px-3 py-1.5 text-[11px] font-medium text-black/75 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.25)] [animation:lp-float-y_5s_ease-in-out_infinite]">
          <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-500" />
          Lena · designing
        </div>
      </div>
      <div className="absolute -right-2 top-24 z-30 hidden md:block">
        <div
          className="flex items-center gap-2 rounded-full border border-black/[0.06] bg-white px-3 py-1.5 text-[11px] font-medium text-black/75 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.25)] [animation:lp-float-y-sm_4.2s_ease-in-out_infinite]"
          style={{ animationDelay: "0.6s" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
          Auto-translated · 4 langs
        </div>
      </div>

      {/* Window chrome (dark editor screenshot) */}
      <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-[#0c0c10] shadow-[0_40px_90px_-25px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.04)_inset]">
        {/* Title bar */}
        <div className="flex h-9 items-center gap-3 border-b border-white/[0.06] bg-[#0a0a0d] px-3.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="mx-auto flex items-center gap-1.5 rounded-md bg-white/[0.05] px-2.5 py-1 text-[10.5px] font-medium text-white/55">
            <Globe2 className="h-3 w-3" />
            productix.studio / editor — Summer Campaign 2026
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider text-emerald-300">
              Synced
            </span>
          </div>
        </div>

        {/* Editor body */}
        <div className="relative grid h-[420px] grid-cols-[44px_1fr_140px] sm:h-[460px] sm:grid-cols-[52px_1fr_180px]">
          {/* Toolbar rail */}
          <div className="flex flex-col items-center gap-1.5 border-r border-white/[0.05] bg-[#0a0a0d] py-3">
            {[
              MousePointer2,
              Layers,
              Sparkles,
              Wand2,
              QrCode,
              Smartphone,
              Globe2,
            ].map((Icon, i) => (
              <button
                key={i}
                className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
                  i === 0
                    ? "bg-white/10 text-white"
                    : "text-white/40 hover:bg-white/[0.06] hover:text-white/80"
                }`}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>

          {/* Canvas */}
          <div className="relative overflow-hidden bg-[radial-gradient(circle_at_50%_30%,#15151a_0%,#0c0c10_70%)]">
            <div className="lp-dot-bg pointer-events-none absolute inset-0 opacity-40" />

            {/* Artboard */}
            <div className="absolute inset-x-6 inset-y-8 overflow-hidden rounded-xl bg-gradient-to-br from-[#1a0f2e] via-[#221045] to-[#3b1158] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.05)]">
              <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-fuchsia-500/30 blur-3xl" />
              <div className="absolute -bottom-16 -left-12 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />

              {/* Mock product */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 [animation:lp-float-y_6s_ease-in-out_infinite]">
                <div className="relative h-44 w-20 rounded-[14px] bg-gradient-to-b from-amber-300 via-orange-500 to-red-600 shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_2px_0_rgba(255,255,255,0.4)]">
                  <div className="absolute left-1/2 top-3 h-3 w-7 -translate-x-1/2 rounded-sm bg-black/60" />
                  <div className="absolute inset-x-2 top-14 h-12 rounded-md bg-black/30 px-1.5 py-1.5">
                    <div className="h-1.5 w-7 rounded-full bg-white/80" />
                    <div className="mt-1 h-1 w-10 rounded-full bg-white/50" />
                    <div className="mt-1 h-1 w-6 rounded-full bg-white/50" />
                  </div>
                </div>
                <div className="mx-auto -mt-1 h-2 w-16 rounded-[50%] bg-black/40 blur-md" />
              </div>

              {/* Headline */}
              <div className="absolute left-5 top-5">
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-fuchsia-200/80">
                  Summer · 2026
                </div>
                <div className="mt-1.5 text-[18px] font-bold leading-tight text-white">
                  Bold. Bottled.
                  <br />
                  Unfiltered.
                </div>
              </div>

              {/* CTA chip */}
              <div className="absolute right-5 bottom-5 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold text-black shadow-lg">
                Shop now
                <ArrowRight className="h-3 w-3" />
              </div>

              {/* Selection box */}
              <div className="absolute left-1/2 top-1/2 h-48 w-24 -translate-x-1/2 -translate-y-1/2 rounded-md border-2 border-cyan-300 [animation:lp-handle-pop_3s_ease-in-out_infinite]">
                {[
                  "-top-1 -left-1",
                  "-top-1 -right-1",
                  "-bottom-1 -left-1",
                  "-bottom-1 -right-1",
                ].map((pos) => (
                  <span
                    key={pos}
                    className={`absolute ${pos} h-2 w-2 rounded-[2px] border border-cyan-300 bg-[#0c0c10]`}
                  />
                ))}
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-cyan-400 px-1.5 py-0.5 text-[9px] font-bold text-black">
                  80 × 176
                </span>
              </div>
            </div>

            {/* Animated cursor */}
            <div className="pointer-events-none absolute left-12 top-12 z-20 [animation:lp-cursor-path_8s_ease-in-out_infinite]">
              <MousePointer2
                className="h-5 w-5 fill-cyan-300 text-cyan-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                style={{ transform: "rotate(-8deg)" }}
              />
              <div className="mt-1 ml-3 inline-block rounded-[6px] bg-cyan-400 px-1.5 py-0.5 text-[9px] font-bold text-black">
                Lena
              </div>
            </div>
          </div>

          {/* Right inspector */}
          <div className="hidden flex-col gap-3 border-l border-white/[0.05] bg-[#0a0a0d] p-3 sm:flex">
            <div className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-white/40">
              Properties
            </div>
            <div className="rounded-md border border-white/[0.06] bg-white/[0.02] p-2">
              <div className="text-[10px] font-medium text-white/55">
                Position
              </div>
              <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                <div className="rounded bg-white/[0.04] px-1.5 py-1 text-[10px] font-mono text-white/80">
                  X 142
                </div>
                <div className="rounded bg-white/[0.04] px-1.5 py-1 text-[10px] font-mono text-white/80">
                  Y 88
                </div>
              </div>
            </div>
            <div className="rounded-md border border-white/[0.06] bg-white/[0.02] p-2">
              <div className="text-[10px] font-medium text-white/55">Fill</div>
              <div className="mt-1.5 flex items-center gap-2">
                <div className="h-5 w-5 rounded-sm bg-gradient-to-b from-amber-300 to-red-600" />
                <span className="font-mono text-[10px] text-white/80">
                  Gradient
                </span>
              </div>
            </div>
            <div className="rounded-md border border-white/[0.06] bg-white/[0.02] p-2">
              <div className="text-[10px] font-medium text-white/55">
                Effects
              </div>
              <div className="mt-1.5 space-y-1">
                <Pill label="Drop shadow" active />
                <Pill label="Float anim" active />
                <Pill label="Parallax" />
              </div>
            </div>
            <div className="mt-auto rounded-md bg-gradient-to-br from-fuchsia-500/20 to-cyan-400/20 p-2 text-[10px] text-white/80">
              <div className="flex items-center gap-1.5 font-semibold text-white">
                <Wand2 className="h-3 w-3" />
                AI suggest
              </div>
              <div className="mt-0.5 text-[9.5px] text-white/55">
                Press ⌘K to refine
              </div>
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div className="flex h-7 items-center justify-between border-t border-white/[0.05] bg-[#0a0a0d] px-3 text-[10px] text-white/45">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              All changes saved
            </span>
            <span className="hidden sm:inline">3 collaborators · online</span>
          </div>
          <div className="font-mono">v1.42 · zoom 100%</div>
        </div>
      </div>

      {/* Floating side cards (light, with depth) */}
      <div className="pointer-events-none absolute -left-10 bottom-16 hidden w-44 rotate-[-6deg] rounded-xl border border-black/[0.06] bg-white p-3 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] [animation:lp-float-y-lg_7s_ease-in-out_infinite] lg:block">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-fuchsia-500 to-violet-600 text-[10px] font-black text-white">
            QR
          </div>
          <div className="flex-1 text-[10.5px] font-semibold text-black">
            Scan rate
          </div>
        </div>
        <div className="mt-2 text-[22px] font-bold leading-none text-black">
          +127%
        </div>
        <div className="mt-1 text-[10px] text-black/45">vs. last campaign</div>
      </div>

      <div className="pointer-events-none absolute -right-6 top-12 hidden w-52 rotate-[5deg] rounded-xl border border-black/[0.06] bg-white p-3 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] [animation:lp-float-y_8s_ease-in-out_infinite] lg:block">
        <div className="text-[9.5px] font-bold uppercase tracking-widest text-cyan-600">
          Auto-translate
        </div>
        <div className="mt-2 space-y-1">
          {[
            { lang: "EN", text: "Bold. Bottled." },
            { lang: "ES", text: "Audaz. Embotellado." },
            { lang: "JP", text: "大胆。瓶詰め。" },
            { lang: "AR", text: "جريء. معبأ." },
          ].map((l, i) => (
            <div
              key={l.lang}
              className="flex items-center gap-2 text-[10.5px] text-black/75 lp-reveal-fast"
              style={{ animationDelay: `${0.4 + i * 0.15}s` }}
            >
              <span className="w-6 rounded bg-black/[0.05] px-1 py-0.5 text-center font-mono text-[9px] text-black/55">
                {l.lang}
              </span>
              {l.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Pill({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between rounded px-1.5 py-1 text-[10px] ${
        active
          ? "bg-cyan-400/10 text-cyan-200"
          : "bg-white/[0.03] text-white/55"
      }`}
    >
      {label}
      {active && <Check className="h-2.5 w-2.5" />}
    </div>
  );
}

/* ──────────────────────────────────────── Logo Marquee */

function LogoMarquee() {
  const logos = [
    "MERIDIAN",
    "NORTHWIND",
    "AXIOM/CO",
    "VELLUM",
    "POLARIS",
    "KINFOLK",
    "RAKE & VINE",
    "ATLAS LABS",
    "OBSCURA",
    "FIELDWORK",
  ];

  return (
    <section className="relative border-y border-black/[0.06] bg-white py-10">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-6 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-black/40">
          Trusted by independent agencies and global brands
        </p>
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <div className="lp-marquee-track flex items-center gap-14">
            {[...logos, ...logos].map((logo, i) => (
              <span
                key={i}
                className="whitespace-nowrap text-[20px] font-bold tracking-[0.15em] text-black/35 transition-colors hover:text-black/80 sm:text-[24px]"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────── Manifesto */

function ManifestoSection() {
  return (
    <section className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-black/60">
          <Sparkles className="h-3 w-3" /> Why Productix
        </span>
        <h2 className="mt-6 text-[clamp(2rem,4.5vw,3.6rem)] font-medium leading-[1.05] tracking-[-0.025em] text-balance">
          Templates die. <span className="text-black/35">Layouts age.</span>{" "}
          <span className="bg-gradient-to-r from-rose-600 via-fuchsia-600 to-cyan-600 bg-clip-text text-transparent">
            Great brand stories are designed.
          </span>
        </h2>
        <p className="mx-auto mt-8 max-w-2xl text-[16.5px] leading-[1.6] text-black/55 text-pretty">
          Most page builders force your art-directed brief into a rigid grid.
          Productix gives your team the same layered, freeform canvas they use
          in Figma — wired straight to multi-tenant brands, multi-language
          content, QR campaigns, and real-time analytics.
        </p>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────── Bento Features */

function BentoFeatures() {
  return (
    <section id="features" className="relative px-6 pb-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/40">
              The platform
            </span>
            <h3 className="mt-3 text-[clamp(1.8rem,3.5vw,2.6rem)] font-medium leading-tight tracking-[-0.02em]">
              Everything an agency needs.{" "}
              <span className="text-black/35">Nothing it doesn’t.</span>
            </h3>
          </div>
          <Link
            href="/dashboard"
            className="hidden items-center gap-1.5 text-[13.5px] font-medium text-black/65 transition-colors hover:text-black md:inline-flex"
          >
            Explore the dashboard <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-6 md:gap-4">
          {/* Big — Freeform canvas */}
          <BentoCard className="md:col-span-4 md:row-span-2">
            <div className="flex h-full flex-col justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-cyan-700">
                  <Layers className="h-3.5 w-3.5" /> Freeform canvas
                </div>
                <h4 className="mt-3 text-[26px] font-medium leading-[1.1] tracking-[-0.01em] sm:text-[30px]">
                  Layer, overlap, animate.
                  <br />
                  <span className="text-black/40">
                    Designed like Figma, deployed like a CMS.
                  </span>
                </h4>
              </div>
              {/* Visual */}
              <div className="relative h-44 overflow-hidden rounded-xl bg-gradient-to-br from-[#1a0f2e] to-[#0a0a16] sm:h-52">
                <div className="absolute left-6 top-6 h-24 w-32 rotate-[-6deg] rounded-lg bg-gradient-to-br from-fuchsia-400 to-rose-500 shadow-xl [animation:lp-float-y_5s_ease-in-out_infinite]" />
                <div
                  className="absolute right-10 top-10 h-28 w-28 rounded-full bg-gradient-to-br from-cyan-300 to-blue-500 shadow-xl [animation:lp-float-y_6s_ease-in-out_infinite]"
                  style={{ animationDelay: "0.4s" }}
                />
                <div
                  className="absolute bottom-6 left-1/3 h-20 w-44 rotate-[3deg] rounded-lg bg-gradient-to-br from-amber-300 to-orange-500 shadow-xl [animation:lp-float-y_7s_ease-in-out_infinite]"
                  style={{ animationDelay: "0.8s" }}
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.06),transparent_60%)]" />
              </div>
            </div>
          </BentoCard>

          {/* Multi-tenant */}
          <BentoCard className="md:col-span-2">
            <div className="flex h-full flex-col justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-fuchsia-700">
                  <Globe2 className="h-3.5 w-3.5" /> Multi-brand
                </div>
                <h4 className="mt-3 text-[20px] font-medium leading-tight tracking-[-0.01em]">
                  One studio, every brand under your roof.
                </h4>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { c: "bg-red-500/15", t: "text-red-600", l: "RB" },
                  { c: "bg-emerald-500/15", t: "text-emerald-600", l: "SP" },
                  { c: "bg-blue-500/15", t: "text-blue-600", l: "CC" },
                  { c: "bg-amber-500/15", t: "text-amber-700", l: "BR" },
                  { c: "bg-fuchsia-500/15", t: "text-fuchsia-600", l: "KT" },
                  { c: "bg-cyan-500/15", t: "text-cyan-700", l: "AX" },
                ].map((b, i) => (
                  <div
                    key={i}
                    className={`flex h-10 items-center justify-center rounded-md ${b.c} text-[10px] font-bold uppercase ${b.t}`}
                  >
                    {b.l}
                  </div>
                ))}
              </div>
            </div>
          </BentoCard>

          {/* Translations */}
          <BentoCard className="md:col-span-2">
            <div className="flex h-full flex-col justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-emerald-700">
                  <Sparkles className="h-3.5 w-3.5" /> Built-in i18n
                </div>
                <h4 className="mt-3 text-[20px] font-medium leading-tight tracking-[-0.01em]">
                  Ship in 40 languages. No exports.
                </h4>
              </div>
              <div className="space-y-1.5 font-mono text-[11px]">
                {[
                  { l: "EN", t: "Refresh your moment." },
                  { l: "FR", t: "Rafraîchissez votre moment." },
                  { l: "JP", t: "瞬間をリフレッシュ。" },
                ].map((x) => (
                  <div key={x.l} className="flex items-center gap-2">
                    <span className="w-7 rounded bg-black/[0.05] px-1 py-0.5 text-center text-[9.5px] font-bold text-black/55">
                      {x.l}
                    </span>
                    <span className="text-black/80">{x.t}</span>
                  </div>
                ))}
              </div>
            </div>
          </BentoCard>

          {/* QR */}
          <BentoCard className="md:col-span-3">
            <div className="flex h-full items-center gap-5">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-amber-700">
                  <QrCode className="h-3.5 w-3.5" /> Scan & track
                </div>
                <h4 className="mt-3 text-[22px] font-medium leading-tight tracking-[-0.01em]">
                  Every page is a campaign.
                </h4>
                <p className="mt-2 text-[13.5px] leading-relaxed text-black/55">
                  Auto-generated QR codes, real-time scan analytics, and
                  feedback loops piped straight into your dashboard.
                </p>
              </div>
              <div className="relative h-28 w-28 shrink-0 rounded-lg bg-[#0a0a0d] p-2 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.3)]">
                <div className="grid h-full w-full grid-cols-7 grid-rows-7 gap-px">
                  {Array.from({ length: 49 }).map((_, i) => {
                    const seed = (i * 73 + 13) % 100;
                    const corners = [0, 6, 42];
                    const isCorner = corners.includes(i);
                    return (
                      <div
                        key={i}
                        className={
                          isCorner
                            ? "bg-white"
                            : seed > 50
                              ? "bg-white"
                              : "bg-transparent"
                        }
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Performance */}
          <BentoCard className="md:col-span-3">
            <div className="flex h-full flex-col gap-3">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-rose-700">
                <Zap className="h-3.5 w-3.5" /> Edge-rendered
              </div>
              <h4 className="text-[22px] font-medium leading-tight tracking-[-0.01em]">
                Pages that score 100. Always.
              </h4>
              <div className="mt-auto flex items-end gap-3">
                <div className="relative">
                  <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
                    <circle
                      cx="18"
                      cy="18"
                      r="15.5"
                      fill="none"
                      stroke="rgba(0,0,0,0.08)"
                      strokeWidth="2.5"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.5"
                      fill="none"
                      stroke="url(#perf-grad)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray="97"
                      strokeDashoffset="2"
                      style={{
                        animation:
                          "lp-stroke-draw 2.2s cubic-bezier(0.65,0,0.35,1) 0.3s both",
                        strokeDashoffset: 97,
                      }}
                    />
                    <defs>
                      <linearGradient
                        id="perf-grad"
                        x1="0"
                        x2="1"
                        y1="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[20px] font-bold leading-none">
                      100
                    </span>
                    <span className="text-[9px] uppercase tracking-widest text-black/45">
                      LCP
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 text-[12.5px] text-black/55">
                  <div className="flex items-center gap-1.5">
                    <Check className="h-3 w-3 text-emerald-600" /> 0.4s First
                    Paint
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="h-3 w-3 text-emerald-600" /> 0 CLS,
                    forever
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="h-3 w-3 text-emerald-600" /> Edge cached
                    globally
                  </div>
                </div>
              </div>
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
}

function BentoCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-black/[0.07] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all duration-500 hover:border-black/15 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--mx,50%)_var(--my,0%),rgba(168,85,247,0.06),transparent_50%)]" />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

/* ──────────────────────────────────────── Live Canvas Showcase */

function LiveCanvasShowcase() {
  return (
    <section
      id="showcase"
      className="relative overflow-hidden border-y border-black/[0.06] bg-white px-6 py-24 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[1100px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(167,139,250,0.18),transparent_60%)] blur-3xl" />
        <div className="absolute right-0 top-0 h-[400px] w-[600px] rounded-full bg-[radial-gradient(ellipse,rgba(56,189,248,0.12),transparent_60%)] blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/40">
            See it in motion
          </span>
          <h3 className="mt-3 text-[clamp(1.9rem,4vw,2.8rem)] font-medium leading-[1.08] tracking-[-0.02em]">
            A canvas that <em className="not-italic text-black/40">feels</em>{" "}
            like a design tool.
          </h3>
          <p className="mt-4 text-[15.5px] leading-relaxed text-black/55">
            Drag, snap, group, scale, animate. Marquee-select dozens of
            elements. Keep design discipline without giving up creative
            freedom.
          </p>
        </div>

        <div className="relative mx-auto max-w-5xl">
          <div className="absolute -inset-10 -z-10 rounded-[3rem] bg-gradient-to-br from-fuchsia-400/20 via-violet-400/15 to-cyan-400/20 blur-3xl" />
          <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-[#0c0c10] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.35)]">
            <div className="flex h-9 items-center gap-3 border-b border-white/[0.06] bg-[#0a0a0d] px-3.5">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </div>
              <div className="mx-auto text-[10.5px] font-medium text-white/40">
                Live editor — multi-select, snap, smart guides
              </div>
            </div>

            <div className="relative h-[420px] overflow-hidden bg-[#0a0a0d] md:h-[520px]">
              <div className="lp-dot-bg absolute inset-0 opacity-30" />

              <div
                className="absolute left-[14%] top-[20%] h-[60%] w-[72%] rounded border-2 border-cyan-400/70 bg-cyan-400/[0.04]"
                style={{
                  animation: "lp-handle-pop 4s ease-in-out infinite",
                }}
              />

              <div className="absolute left-1/2 top-0 h-full w-px bg-fuchsia-400/50" />
              <div className="absolute left-0 top-1/2 h-px w-full bg-fuchsia-400/50" />

              <FloatingElement
                style={{ left: "20%", top: "26%" }}
                className="h-24 w-32 rounded-lg bg-gradient-to-br from-fuchsia-400 to-rose-500"
                label="Hero"
                delay="0s"
              />
              <FloatingElement
                style={{ left: "45%", top: "30%" }}
                className="h-28 w-28 rounded-full bg-gradient-to-br from-cyan-300 to-blue-500"
                label="Logo"
                delay="0.3s"
              />
              <FloatingElement
                style={{ left: "65%", top: "26%" }}
                className="flex h-24 w-40 items-center justify-center rounded-lg bg-white text-[12px] font-bold text-black"
                label="CTA"
                delay="0.6s"
              >
                <span>Shop Summer</span>
              </FloatingElement>
              <FloatingElement
                style={{ left: "22%", top: "60%" }}
                className="h-20 w-56 rounded-lg bg-gradient-to-br from-amber-300 to-orange-500"
                label="Promo strip"
                delay="0.9s"
              />
              <FloatingElement
                style={{ left: "58%", top: "63%" }}
                className="h-20 w-44 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-700"
                label="Stat tile"
                delay="1.2s"
              />

              <div className="pointer-events-none absolute left-[20%] top-[55%] z-20 [animation:lp-cursor-path_10s_ease-in-out_infinite]">
                <MousePointer2
                  className="h-5 w-5 fill-emerald-300 text-emerald-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                  style={{ transform: "rotate(-8deg)" }}
                />
                <span className="mt-1 ml-3 inline-block rounded bg-emerald-400 px-1.5 py-0.5 text-[9px] font-bold text-black">
                  Marco
                </span>
              </div>

              <div className="absolute right-5 top-5 flex items-center gap-2 rounded-full bg-[#0c0c10]/90 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                5 layers selected
                <kbd className="ml-1 rounded bg-white/10 px-1.5 py-0.5 font-mono text-[9.5px] text-white/70">
                  ⌘G
                </kbd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FloatingElement({
  style,
  className,
  label,
  delay = "0s",
  children,
}: {
  style: React.CSSProperties;
  className?: string;
  label: string;
  delay?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className="absolute"
      style={{
        ...style,
        animation: `lp-float-y 5s ease-in-out infinite`,
        animationDelay: delay,
      }}
    >
      <div className={`relative shadow-xl ${className}`}>
        <div className="absolute -inset-1 rounded-[inherit] border border-cyan-400/60" />
        {[
          "-top-1 -left-1",
          "-top-1 -right-1",
          "-bottom-1 -left-1",
          "-bottom-1 -right-1",
        ].map((p) => (
          <span
            key={p}
            className={`absolute ${p} h-2 w-2 rounded-[2px] border border-cyan-300 bg-[#0a0a0d]`}
          />
        ))}
        {children}
        <span className="absolute -top-6 left-0 whitespace-nowrap rounded bg-cyan-400 px-1.5 py-0.5 text-[9.5px] font-bold text-black">
          {label}
        </span>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────── Templates Showcase */

function TemplatesShowcase({
  onPreview,
}: {
  onPreview: (t: Template) => void;
}) {
  const categoryAccents: Record<string, string> = {
    marketing: "from-fuchsia-500 to-rose-500",
    event: "from-amber-400 to-orange-600",
    brand: "from-cyan-400 to-blue-500",
    social: "from-emerald-400 to-teal-500",
    custom: "from-violet-400 to-purple-700",
  };

  return (
    <section id="templates" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/40">
              Production-ready
            </span>
            <h3 className="mt-3 text-[clamp(1.9rem,4vw,2.8rem)] font-medium leading-tight tracking-[-0.02em]">
              Templates designed by{" "}
              <span className="text-black/40">actual art directors.</span>
            </h3>
          </div>
          <Link
            href="/editor"
            className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-4 py-2 text-[13px] font-medium text-black/80 transition-all hover:border-black/25"
          >
            Start from scratch <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {templates.map((template, i) => {
            const accent =
              categoryAccents[template.meta.category as string] ||
              "from-fuchsia-500 to-cyan-400";
            return (
              <button
                key={template.meta.id}
                onClick={() => onPreview(template)}
                className="group relative overflow-hidden rounded-2xl border border-black/[0.07] bg-white p-1.5 text-left shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all duration-500 hover:-translate-y-1 hover:border-black/15 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.18)] lp-reveal-fast"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="relative h-52 w-full overflow-hidden rounded-xl bg-[#f5f5f0] sm:h-56">
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent} opacity-0 transition-opacity duration-500 group-hover:opacity-10`}
                  />
                  <div className="absolute inset-0 flex justify-center">
                    <div className="absolute top-0 w-[428px] origin-top scale-[0.42] transform pointer-events-none transition-transform duration-700 group-hover:scale-[0.46]">
                      <PublicRenderer
                        document={template.data}
                        contentLocale="en"
                      />
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="flex items-center gap-2 p-4 text-[12px] font-semibold text-white">
                      <PlayCircle className="h-4 w-4" />
                      Preview interactively
                    </div>
                  </div>
                </div>

                <div className="px-3 pt-4 pb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${accent}`}
                    />
                    <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-black/45">
                      {template.meta.category}
                    </span>
                  </div>
                  <h4 className="mt-2 text-[15.5px] font-semibold leading-snug tracking-[-0.01em] text-black">
                    {template.meta.name}
                  </h4>
                  <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-black/50">
                    {template.meta.description}
                  </p>
                </div>
              </button>
            );
          })}

          {/* Blank canvas */}
          <Link
            href="/editor"
            className="group flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/15 bg-white/40 p-8 text-center transition-all duration-500 hover:border-black/40 hover:bg-white"
          >
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-black/15 bg-white transition-transform duration-500 group-hover:rotate-90">
              <span className="text-2xl text-black/65">+</span>
              <span className="absolute inset-0 rounded-full border border-fuchsia-500/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
            <h4 className="mt-5 text-[16px] font-semibold text-black">
              Blank canvas
            </h4>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-black/50">
              Open a fresh artboard.
              <br />
              Bring your own vision.
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────── Stats */

function StatsRibbon() {
  const stats = [
    { value: "2.4M", label: "Pages rendered" },
    { value: "98%", label: "Avg. Lighthouse" },
    { value: "<40ms", label: "p95 edge latency" },
    { value: "40+", label: "Languages supported" },
  ];
  return (
    <section className="relative border-y border-black/[0.06] bg-[#f5f5f0] px-6 py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 sm:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="lp-reveal-fast border-l border-black/[0.08] pl-6 first:border-l-0 first:pl-0 sm:border-l sm:pl-8"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="text-[clamp(2.4rem,4.5vw,3.6rem)] font-medium leading-none tracking-[-0.04em] text-black">
              {s.value}
            </div>
            <div className="mt-3 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-black/45">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────── Workflow */

function WorkflowSection() {
  const steps = [
    {
      n: "01",
      title: "Compose",
      desc: "Drop in elements. Layer them. Animate them. Snap, group, scale — exactly like a design tool.",
      icon: Layers,
    },
    {
      n: "02",
      title: "Localize",
      desc: "Add languages in one click. AI fills the first draft; your copywriters refine the rest.",
      icon: Globe2,
    },
    {
      n: "03",
      title: "Ship & measure",
      desc: "Publish to your subdomain. QR-print the page. Every scan, every interaction, instantly visible.",
      icon: Zap,
    },
  ];

  return (
    <section id="workflow" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/40">
            Workflow
          </span>
          <h3 className="mt-3 text-[clamp(1.9rem,4vw,2.8rem)] font-medium leading-tight tracking-[-0.02em]">
            From brief to live in{" "}
            <span className="bg-gradient-to-r from-orange-500 to-fuchsia-600 bg-clip-text text-transparent">
              one afternoon.
            </span>
          </h3>
        </div>

        <div className="relative grid grid-cols-1 gap-6 md:grid-cols-3">
          <div
            className="pointer-events-none absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-black/15 to-transparent md:block"
            aria-hidden
          />
          {steps.map((s, i) => (
            <div
              key={s.n}
              className="lp-reveal relative rounded-2xl border border-black/[0.07] bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)]"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-semibold tracking-widest text-black/35">
                  {s.n}
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 bg-[#fafaf7]">
                  <s.icon className="h-4 w-4 text-black/80" />
                </div>
              </div>
              <h4 className="mt-6 text-[22px] font-medium tracking-[-0.01em]">
                {s.title}
              </h4>
              <p className="mt-3 text-[14.5px] leading-relaxed text-black/55">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────── Testimonial marquee */

function TestimonialMarquee() {
  const quotes = [
    {
      q: "Productix turned our brand team into a small studio. We replaced three tools.",
      a: "Mira K.",
      r: "Creative Director, Northwind",
    },
    {
      q: "Felt like Figma had a baby with a CMS. Our turnaround dropped from 2 weeks to 2 days.",
      a: "Daniel A.",
      r: "Head of Brand, Vellum",
    },
    {
      q: "The QR campaigns alone paid for the whole platform. Scan analytics are addictive.",
      a: "Yuki S.",
      r: "Growth Lead, Polaris Co.",
    },
    {
      q: "It’s the first builder that doesn’t look like a builder. Our work finally looks like ours.",
      a: "Esme T.",
      r: "Art Director, Fieldwork",
    },
    {
      q: "Auto-translate is genuinely magical. We launched in 12 markets in a single sprint.",
      a: "Karim B.",
      r: "VP Marketing, Axiom/Co",
    },
    {
      q: "Selecting and grouping 50 elements without lag. That’s the moment we knew.",
      a: "Renu P.",
      r: "Senior Designer, Obscura",
    },
  ];

  return (
    <section className="relative overflow-hidden border-y border-black/[0.06] bg-white py-24">
      <div className="mx-auto mb-12 max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/40">
            Studio voices
          </span>
          <h3 className="mt-3 text-[clamp(1.9rem,4vw,2.8rem)] font-medium leading-tight tracking-[-0.02em]">
            What teams say after their first week.
          </h3>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="lp-marquee-track flex gap-4 px-2">
            {[...quotes, ...quotes].map((q, i) => (
              <TestimonialCard key={`a-${i}`} {...q} />
            ))}
          </div>
        </div>
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="lp-marquee-track-slow lp-marquee-reverse flex gap-4 px-2">
            {[...quotes.slice().reverse(), ...quotes.slice().reverse()].map(
              (q, i) => (
                <TestimonialCard key={`b-${i}`} {...q} />
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  q,
  a,
  r,
}: {
  q: string;
  a: string;
  r: string;
}) {
  return (
    <div className="flex w-[360px] shrink-0 flex-col justify-between rounded-2xl border border-black/[0.07] bg-[#fafaf7] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] sm:w-[420px]">
      <p className="text-[15px] leading-[1.55] text-black/85">“{q}”</p>
      <div className="mt-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-500 text-[12px] font-bold text-white">
          {a.charAt(0)}
        </div>
        <div>
          <div className="text-[13px] font-semibold text-black">{a}</div>
          <div className="text-[11.5px] text-black/50">{r}</div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────── Final CTA */

function FinalCTA() {
  return (
    <section className="relative overflow-hidden px-6 py-32 md:py-40">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[800px] w-[1200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(244,114,182,0.28),transparent_55%)] blur-3xl [animation:lp-aurora-shift_20s_ease-in-out_infinite]" />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(56,189,248,0.24),transparent_55%)] blur-3xl [animation:lp-aurora-shift-2_24s_ease-in-out_infinite]" />
      </div>
      <div className="lp-grid-bg-light pointer-events-none absolute inset-0 -z-10 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

      <div className="mx-auto max-w-4xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white/80 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-black/65 backdrop-blur-md">
          <Sparkles className="h-3 w-3" /> Ready when you are
        </span>
        <h2 className="mt-8 text-[clamp(2.4rem,6vw,5rem)] font-medium leading-[0.98] tracking-[-0.035em] text-balance">
          Stop chasing templates.
          <br />
          <span className="bg-gradient-to-r from-rose-600 via-fuchsia-600 to-cyan-600 bg-clip-text italic text-transparent">
            Start designing again.
          </span>
        </h2>
        <p className="mx-auto mt-7 max-w-xl text-[16.5px] leading-[1.55] text-black/55">
          Free to start. No credit card. No watermarks. Bring your team and one
          big idea — we’ll handle the rest.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/dashboard"
            className="group relative inline-flex h-12 items-center gap-2 overflow-hidden rounded-full bg-black px-7 text-[14px] font-semibold text-white shadow-[0_18px_50px_-12px_rgba(0,0,0,0.5)] transition-all hover:shadow-[0_22px_60px_-12px_rgba(0,0,0,0.6)]"
          >
            <span className="relative z-10">Open Productix free</span>
            <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </Link>
          <Link
            href="/editor"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-black/15 bg-white px-6 text-[14px] font-medium text-black/85 transition-all hover:border-black/30"
          >
            Try the editor
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <p className="mt-6 text-[12px] text-black/45">
          ⌘K · 14-day trial of Studio Pro · Cancel anytime
        </p>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────── Footer */

function Footer() {
  return (
    <footer className="border-t border-black/[0.06] bg-white py-14">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2">
            <Image
              src="/logo-light.png"
              alt="Productix"
              width={160}
              height={36}
              className="h-8 w-auto select-none"
            />
            <p className="mt-5 max-w-xs text-[13.5px] leading-relaxed text-black/50">
              A cinematic page builder for agencies that refuse to ship boring
              work.
            </p>
          </div>
          {([
            {
              title: "Product",
              links: [
                ["Editor", "/editor"],
                ["Dashboard", "/dashboard"],
                ["Templates", "#templates"],
                ["Showcase", "#showcase"],
              ] as const,
            },
            {
              title: "Company",
              links: [
                ["Log in", "/login"],
                ["Get started", "/dashboard"],
                ["Workflow", "#workflow"],
                ["Status", "#"],
              ] as const,
            },
          ]).map((col) => (
            <div key={col.title}>
              <div className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-black/45">
                {col.title}
              </div>
              <ul className="mt-4 space-y-2.5">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-[13.5px] text-black/65 transition-colors hover:text-black"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-black/[0.06] pt-8 sm:flex-row sm:items-center">
          <p className="text-[12px] text-black/45">
            © {new Date().getFullYear()} Productix. Crafted in the canvas.
          </p>
          <p className="text-[12px] text-black/45">
            Built with Next.js, Turborepo, and a custom canvas engine.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ──────────────────────────────────────── Template modal */

function TemplateModal({
  template,
  onClose,
}: {
  template: Template;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4 backdrop-blur-md md:p-8"
      style={{ animation: "lp-fade-in 0.2s ease-out forwards" }}
      onClick={onClose}
    >
      <div
        className="flex h-full max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl"
        style={{ animation: "lp-scale-pop 0.25s cubic-bezier(0.16,1,0.3,1) forwards" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-black/[0.06] bg-white px-6 py-4">
          <div>
            <h3 className="text-[17px] font-semibold text-black">
              {template.meta.name}
            </h3>
            <p className="mt-1 text-[12.5px] text-black/55">
              {template.meta.description}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close preview"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/[0.04] text-black/60 transition-all hover:bg-black/[0.08] hover:text-black"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="relative min-h-0 flex-1 overflow-hidden bg-[#f5f5f0]">
          <PreviewRenderer
            document={template.data}
            showControls={true}
            contentLocale="en"
            className="h-full w-full"
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-black/[0.06] bg-white px-6 py-4">
          <button
            onClick={onClose}
            className="inline-flex h-10 items-center rounded-full border border-black/10 bg-white px-5 text-[13px] font-medium text-black/80 transition-colors hover:bg-black/[0.04]"
          >
            Close
          </button>
          <Link
            href={`/editor?template=${template.meta.id}`}
            className="group inline-flex h-10 items-center gap-1.5 rounded-full bg-black px-5 text-[13px] font-semibold text-white shadow-[0_12px_30px_-10px_rgba(0,0,0,0.45)] transition-all hover:shadow-[0_16px_40px_-10px_rgba(0,0,0,0.6)]"
          >
            Use this template
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
