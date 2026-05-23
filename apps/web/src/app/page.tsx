"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { templates, PublicRenderer, PreviewRenderer } from "@productix/editor";
import type { Template } from "@productix/types";
import {
  ArrowRight,
  Sparkles,
  Layers,
  Wand2,
  Globe2,
  Smartphone,
  QrCode,
  Zap,
  PlayCircle,
  ChevronRight,
  Check,
  ShieldCheck,
  BarChart3,
  MessageSquareHeart,
  Megaphone,
  Building2,
  Boxes,
  Languages,
  Activity,
  LineChart,
  Lock,
  Cpu,
  Radio,
  Workflow,
} from "lucide-react";

/* ────────────────────────────────────────────────────────────
 * Productix - Product Experience Infrastructure
 * Light editorial surfaces · near-black ink · pastel auroras ·
 * futuristic connected-packaging mockups for cinematic contrast.
 * ──────────────────────────────────────────────────────────── */

export default function LandingPage() {
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#fafaf7] text-[#0a0a0a] antialiased selection:bg-black selection:text-white">
      <Header />
      <Hero />
      <EnterpriseTrustStrip />
      <ProblemSection />
      <WhatProductixDoes />
      <CoreCapabilityGrid />
      <LiveStudioShowcase />
      <TemplatesShowcase onPreview={setPreviewTemplate} />
      <WhyEnterprisesChoose />
      <BusinessOutcomes />
      <EnterpriseUseCases />
      <StatsRibbon />
      <VisionSection />
      <SecurityScalability />
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
            Enterprise
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {[
            { label: "Platform", href: "#platform" },
            { label: "Capabilities", href: "#capabilities" },
            { label: "Outcomes", href: "#outcomes" },
            { label: "Industries", href: "#industries" },
            { label: "Security", href: "#security" },
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
            href="#sales"
            className="hidden rounded-full px-4 py-2 text-[13.5px] font-medium text-black/65 transition-colors hover:text-black sm:inline-flex"
          >
            Talk to Sales
          </Link>
          <Link
            href="#demo"
            className="group relative inline-flex h-9 items-center gap-1.5 overflow-hidden rounded-full bg-black px-4 text-[13px] font-semibold text-white transition-all hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.4)]"
          >
            <span className="relative z-10">Book Enterprise Demo</span>
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
        <div className="absolute left-1/2 top-[-10%] h-[680px] w-[680px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(115,178,221,0.26),transparent_60%)] blur-3xl [animation:lp-aurora-shift_18s_ease-in-out_infinite]" />
        <div className="absolute right-[-10%] top-[18%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(115,178,221,0.22),transparent_60%)] blur-3xl [animation:lp-aurora-shift-2_22s_ease-in-out_infinite]" />
        <div className="absolute left-[-10%] bottom-[-10%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(36,75,122,0.22),transparent_60%)] blur-3xl [animation:lp-aurora-shift_24s_ease-in-out_infinite_reverse]" />
      </div>

      <div className="lp-grid-bg-light pointer-events-none absolute inset-0 -z-10 opacity-70 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div className="lp-reveal">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white/70 px-3 py-1.5 text-[11.5px] font-medium uppercase tracking-[0.14em] text-black/65 shadow-[0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur-md">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-sky-500 [animation:lp-ping-slow_2s_ease-out_infinite]" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sky-500" />
            </span>
            Enterprise · Product Experience Infrastructure
          </div>

          <h1 className="text-[clamp(2.5rem,5.6vw,4.9rem)] font-medium leading-[0.98] tracking-[-0.035em] text-balance text-[#0a0a0a]">
            Product Experience
            <br className="hidden sm:block" />{" "}
            Infrastructure for{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-sky-600 bg-clip-text italic text-transparent">
                modern consumer brands.
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
                    <stop offset="0%" stopColor="#73B2DD" />
                    <stop offset="100%" stopColor="#244B7A" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-[17px] leading-[1.55] text-black/55 text-pretty">
            Productix transforms physical products into connected digital
            experiences - through dynamic product engagement, consumer
            intelligence, packaging analytics, and activation infrastructure.
            Built for FMCG and packaged-product brands operating at scale.
          </p>

          <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link
              href="#demo"
              className="group relative inline-flex h-12 items-center gap-2 overflow-hidden rounded-full bg-black px-6 text-[14px] font-semibold text-white shadow-[0_12px_40px_-12px_rgba(0,0,0,0.5)] transition-all hover:shadow-[0_16px_50px_-12px_rgba(0,0,0,0.65)]"
            >
              <span className="relative z-10">Book Enterprise Demo</span>
              <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </Link>
            <Link
              href="#sales"
              className="group inline-flex h-12 items-center gap-2.5 rounded-full border border-black/10 bg-white/60 px-5 text-[14px] font-medium text-black/80 backdrop-blur-md transition-all hover:border-black/25 hover:bg-white"
            >
              <PlayCircle className="h-4 w-4 text-black/55 transition-colors group-hover:text-black" />
              Talk to Sales
            </Link>
          </div>

          <p className="mt-8 max-w-lg text-[12.5px] leading-relaxed text-black/45">
            Trusted for scalable connected packaging experiences, multilingual
            product engagement, and enterprise-grade product interaction
            management.
          </p>
        </div>

        <div
          className="lp-reveal relative"
          style={{ animationDelay: "0.15s" }}
        >
          <ConnectedProductHero />
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────── Connected Product Hero
 * Futuristic packaging + QR scan + data stream visualization.
 * Replaces the previous faux editor preview.
 * ─────────────────────────────────────────────────────────── */

function ConnectedProductHero() {
  return (
    <div className="relative">
      {/* Soft glow halo */}
      <div className="absolute -inset-10 -z-10 rounded-[3rem] bg-gradient-to-br from-sky-400/25 via-blue-400/15 to-sky-400/25 blur-3xl [animation:lp-glow-pulse_4s_ease-in-out_infinite]" />

      {/* Floating annotation chips */}
      <div className="absolute -top-3 -left-2 z-30 hidden md:block">
        <div className="flex items-center gap-2 rounded-full border border-black/[0.06] bg-white px-3 py-1.5 text-[11px] font-medium text-black/75 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.25)] [animation:lp-float-y_5s_ease-in-out_infinite]">
          <Radio className="h-3 w-3 text-sky-500" />
          Scan · LIVE
        </div>
      </div>
      <div className="absolute -right-2 top-28 z-30 hidden md:block">
        <div
          className="flex items-center gap-2 rounded-full border border-black/[0.06] bg-white px-3 py-1.5 text-[11px] font-medium text-black/75 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.25)] [animation:lp-float-y-sm_4.2s_ease-in-out_infinite]"
          style={{ animationDelay: "0.6s" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
          12 markets · 4 langs
        </div>
      </div>

      {/* Main device frame (phone) */}
      <div className="relative overflow-hidden rounded-[2.2rem] border border-black/10 bg-[#0c0c10] p-3 shadow-[0_40px_90px_-25px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.04)_inset]">
        {/* Status bar */}
        <div className="flex items-center justify-between px-4 pt-1 pb-2 text-[10px] font-semibold text-white/55">
          <span>9:41</span>
          <span className="rounded-full bg-sky-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-sky-300">
            Connected
          </span>
        </div>

        {/* Screen */}
        <div className="relative h-[440px] overflow-hidden rounded-[1.6rem] bg-[radial-gradient(circle_at_50%_-10%,#1a0f2e_0%,#0a0a14_70%)] sm:h-[480px]">
          <div className="lp-dot-bg pointer-events-none absolute inset-0 opacity-30" />

          {/* Orbit rings around product */}
          <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2">
            {[180, 240, 300].map((size, i) => (
              <div
                key={i}
                className="absolute rounded-full border border-white/10"
                style={{
                  width: size,
                  height: size,
                  left: -size / 2,
                  top: -size / 2,
                  animation: `lp-pulse-ring ${3 + i * 0.6}s ease-out ${i * 0.8}s infinite`,
                }}
              />
            ))}
          </div>

          {/* Pulse rings (animated outward) */}
          <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2">
            <span className="block h-24 w-24 rounded-full border border-sky-400/40 [animation:lp-pulse-ring_2.4s_ease-out_infinite]" />
          </div>

          {/* 3D packaging mockup */}
          <div
            className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2"
            style={{ animation: "lp-tilt-3d 6s ease-in-out infinite" }}
          >
            <div className="relative h-44 w-24 rounded-[18px] bg-gradient-to-b from-sky-300 via-blue-500 to-blue-700 shadow-[0_30px_60px_-10px_rgba(36,75,122,0.45),inset_0_2px_0_rgba(255,255,255,0.5),inset_-6px_0_18px_rgba(0,0,0,0.25)]">
              {/* Cap */}
              <div className="absolute left-1/2 -top-2 h-3 w-10 -translate-x-1/2 rounded-t-md bg-gradient-to-b from-zinc-300 to-zinc-600 shadow-md" />
              {/* Label */}
              <div className="absolute inset-x-1.5 top-9 rounded-md bg-black/35 px-1.5 py-1.5 backdrop-blur-sm">
                <div className="text-[8px] font-bold uppercase tracking-[0.18em] text-sky-200">
                  Volt · No 7
                </div>
                <div className="mt-1 text-[10px] font-bold leading-tight text-white">
                  Bold.
                  <br />
                  Bottled.
                </div>
              </div>
              {/* QR code on packaging */}
              <div className="absolute inset-x-2 bottom-2 grid h-10 grid-cols-6 grid-rows-6 gap-px overflow-hidden rounded bg-white p-0.5">
                {Array.from({ length: 36 }).map((_, i) => {
                  const seed = (i * 47 + 11) % 100;
                  const corners = [0, 5, 30];
                  const isCorner = corners.includes(i);
                  return (
                    <div
                      key={i}
                      className={
                        isCorner || seed > 48 ? "bg-black" : "bg-transparent"
                      }
                    />
                  );
                })}
              </div>
            </div>
            {/* Shadow */}
            <div className="mx-auto -mt-1 h-3 w-20 rounded-[50%] bg-black/50 blur-md" />
          </div>

          {/* Scan sweep line */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-full overflow-hidden">
            <div
              className="absolute inset-x-12 h-px bg-gradient-to-r from-transparent via-sky-300 to-transparent shadow-[0_0_18px_rgba(115,178,221,0.85)]"
              style={{ animation: "lp-scan-sweep 3.2s ease-in-out infinite" }}
            />
          </div>

          {/* Hairline crosshair */}
          <div className="absolute left-1/2 top-[42%] h-44 w-24 -translate-x-1/2 -translate-y-1/2 rounded-[18px] border border-sky-300/70 shadow-[0_0_18px_rgba(115,178,221,0.35)_inset]">
            {[
              "-top-1 -left-1",
              "-top-1 -right-1",
              "-bottom-1 -left-1",
              "-bottom-1 -right-1",
            ].map((pos) => (
              <span
                key={pos}
                className={`absolute ${pos} h-2 w-2 rounded-[2px] border border-sky-300 bg-[#0a0a14]`}
              />
            ))}
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-sky-400 px-1.5 py-0.5 text-[9px] font-bold text-black">
              SKU · VLT-007-EU
            </span>
          </div>

          {/* Top label */}
          <div className="absolute left-4 top-3">
            <div className="text-[9px] font-semibold uppercase tracking-[0.22em] text-sky-200/80">
              Productix · Live Scan
            </div>
            <div className="mt-1 text-[14px] font-bold leading-tight text-white">
              Volt Energy · No 7
              <br />
              <span className="text-white/55">Madrid · ES-MAD-04</span>
            </div>
          </div>

          {/* Bottom data ticker */}
          <div className="absolute inset-x-3 bottom-3 overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.04] p-2.5 backdrop-blur-sm">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/55">
                Scan Intelligence
              </span>
              <span className="flex items-center gap-1 text-[9px] font-semibold text-sky-300">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400 [animation:lp-data-pulse_1.6s_ease-in-out_infinite]" />
                streaming
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { l: "Scans · 24h", v: "12,847", c: "text-sky-300" },
                { l: "Avg dwell", v: "1m 38s", c: "text-sky-300" },
                { l: "Convert", v: "8.4%", c: "text-sky-300" },
              ].map((m) => (
                <div key={m.l}>
                  <div className={`font-mono text-[14px] font-bold ${m.c}`}>
                    {m.v}
                  </div>
                  <div className="text-[8.5px] text-white/45">{m.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating side cards */}
      <div className="pointer-events-none absolute -left-10 bottom-20 hidden w-48 rotate-[-6deg] rounded-xl border border-black/[0.06] bg-white p-3 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] [animation:lp-float-y-lg_7s_ease-in-out_infinite] lg:block">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-sky-500 to-blue-600 text-white">
            <QrCode className="h-3.5 w-3.5" />
          </div>
          <div className="flex-1 text-[10.5px] font-semibold text-black">
            Scan-through rate
          </div>
        </div>
        <div className="mt-2 text-[22px] font-bold leading-none text-black">
          +127%
        </div>
        <div className="mt-1 text-[10px] text-black/45">vs. last campaign</div>
      </div>

      <div className="pointer-events-none absolute -right-6 top-16 hidden w-52 rotate-[5deg] rounded-xl border border-black/[0.06] bg-white p-3 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] [animation:lp-float-y_8s_ease-in-out_infinite] lg:block">
        <div className="text-[9.5px] font-bold uppercase tracking-widest text-sky-600">
          First-party signal
        </div>
        <div className="mt-2 space-y-1">
          {[
            { lang: "EN", text: "Bold. Bottled. Unfiltered." },
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

/* ──────────────────────────────────────── Enterprise Trust Strip */

function EnterpriseTrustStrip() {
  const industries = [
    "FMCG BRANDS",
    "CONSUMER GOODS MANUFACTURERS",
    "BEVERAGE COMPANIES",
    "COSMETICS & PERSONAL CARE",
    "NUTRITION & WELLNESS",
    "RETAIL & DISTRIBUTION ENTERPRISES",
  ];

  return (
    <section className="relative border-y border-black/[0.06] bg-white py-10">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-6 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-black/40">
          Designed for global consumer brand ecosystems
        </p>
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="lp-marquee-track flex items-center gap-10">
            {[...industries, ...industries, ...industries].map((label, i) => (
              <span
                key={i}
                className="flex items-center gap-3 whitespace-nowrap text-[13px] font-bold tracking-[0.18em] text-black/45 transition-colors hover:text-black/80 sm:text-[15px]"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-sky-500 to-sky-500" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────── Problem Section */

function ProblemSection() {
  const limitations = [
    { icon: Activity, label: "measure consumer interaction" },
    { icon: Sparkles, label: "deliver dynamic experiences" },
    { icon: BarChart3, label: "collect first-party insights" },
    { icon: Languages, label: "localize content at scale" },
    { icon: Megaphone, label: "adapt campaigns in real-time" },
    { icon: MessageSquareHeart, label: "unify post-purchase engagement" },
  ];

  return (
    <section className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-black/60">
            <Activity className="h-3 w-3" /> The problem
          </span>
          <h2 className="mt-6 text-[clamp(2rem,4.5vw,3.6rem)] font-medium leading-[1.05] tracking-[-0.025em] text-balance">
            Packaging is still the most{" "}
            <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-sky-600 bg-clip-text text-transparent">
              underutilized consumer touchpoint.
            </span>
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-[16.5px] leading-[1.6] text-black/55 text-pretty">
            Modern brands spend millions on product packaging, retail
            visibility, and consumer marketing - yet most physical products
            remain disconnected from measurable digital engagement.
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-5xl">
          <p className="mb-6 text-center text-[12px] font-semibold uppercase tracking-[0.18em] text-black/40">
            Traditional packaging cannot
          </p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {limitations.map((l, i) => (
              <div
                key={l.label}
                className="lp-reveal-fast group relative flex items-center gap-3 rounded-xl border border-black/[0.07] bg-white px-4 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all hover:border-black/20 hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.12)]"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#fafaf7] text-black/45 transition-colors group-hover:bg-black group-hover:text-white">
                  <l.icon className="h-4 w-4" />
                </div>
                <span className="text-[13.5px] font-medium text-black/70 group-hover:text-black">
                  {l.label}
                </span>
                <span className="ml-auto select-none text-[11px] font-mono text-blue-500/60">
                  ✕
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-2 text-[12.5px] font-semibold text-white shadow-[0_18px_40px_-12px_rgba(0,0,0,0.5)]">
            <Sparkles className="h-3.5 w-3.5" />
            Productix transforms packaging into an intelligent digital
            interaction layer.
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────── What Productix Does */

function WhatProductixDoes() {
  return (
    <section
      id="platform"
      className="relative overflow-hidden border-y border-black/[0.06] bg-white px-6 py-24 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(115,178,221,0.16),transparent_60%)] blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/40">
            What Productix does
          </span>
          <h3 className="mt-3 text-[clamp(1.9rem,4vw,3rem)] font-medium leading-[1.05] tracking-[-0.025em] text-balance">
            Connected product experiences{" "}
            <span className="text-black/40">
              built for enterprise scale.
            </span>
          </h3>
          <p className="mx-auto mt-7 max-w-2xl text-[16px] leading-[1.6] text-black/55 text-pretty">
            Productix provides the infrastructure to create, manage, and
            optimize mobile-first product experiences connected directly to
            physical products through QR-enabled packaging - centralizing
            storytelling, multilingual delivery, analytics, campaigns, and
            feedback within a single enterprise platform.
          </p>
        </div>

        {/* Flow diagram */}
        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
          {[
            {
              icon: QrCode,
              title: "Physical product",
              desc: "QR-enabled packaging on shelf",
              tone: "from-sky-400 to-blue-500",
            },
            null,
            {
              icon: Cpu,
              title: "Productix engine",
              desc: "Dynamic, localized, intelligent",
              tone: "from-sky-500 to-blue-600",
            },
            null,
            {
              icon: LineChart,
              title: "Brand intelligence",
              desc: "First-party scan + feedback data",
              tone: "from-sky-400 to-blue-600",
            },
          ].map((node, i) => {
            if (node === null) {
              return (
                <div
                  key={i}
                  className="hidden items-center justify-center md:flex"
                >
                  <svg width="44" height="20" viewBox="0 0 44 20" fill="none">
                    <path
                      d="M0 10 H 40 M 32 4 L 40 10 L 32 16"
                      stroke="rgba(0,0,0,0.25)"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                </div>
              );
            }
            const Icon = node.icon;
            return (
              <div
                key={node.title}
                className="lp-reveal-fast relative overflow-hidden rounded-xl border border-black/[0.07] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div
                  className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${node.tone} text-white shadow-md`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div className="text-[14.5px] font-semibold tracking-[-0.01em] text-black">
                  {node.title}
                </div>
                <div className="mt-1 text-[12.5px] leading-relaxed text-black/55">
                  {node.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────── Core Capability Grid (Bento) */

function CoreCapabilityGrid() {
  return (
    <section id="capabilities" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/40">
              Core capability grid
            </span>
            <h3 className="mt-3 text-[clamp(1.9rem,4vw,2.8rem)] font-medium leading-tight tracking-[-0.02em]">
              The infrastructure layer{" "}
              <span className="text-black/35">
                behind every connected product.
              </span>
            </h3>
          </div>
          <Link
            href="#demo"
            className="hidden items-center gap-1.5 text-[13.5px] font-medium text-black/65 transition-colors hover:text-black md:inline-flex"
          >
            Book a walkthrough <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-6 md:gap-4">
          {/* Connected Packaging Infrastructure */}
          <BentoCard className="md:col-span-4 md:row-span-2">
            <div className="flex h-full flex-col justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-sky-700">
                  <QrCode className="h-3.5 w-3.5" /> 01 · Connected Packaging
                </div>
                <h4 className="mt-3 text-[26px] font-medium leading-[1.1] tracking-[-0.01em] sm:text-[30px]">
                  Transform packaging into interactive engagement channels.
                  <br />
                  <span className="text-black/40">
                    Dynamic QR-powered experiences, wired into every SKU.
                  </span>
                </h4>
              </div>
              {/* Visual */}
              <div className="relative h-44 overflow-hidden rounded-xl bg-gradient-to-br from-[#1a0f2e] to-[#08081a] sm:h-52">
                {/* Scan grid */}
                <div className="lp-dot-bg absolute inset-0 opacity-30" />
                {/* 3 mini products with QR codes */}
                {[
                  { x: "10%", tone: "from-sky-400 to-blue-500", delay: "0s" },
                  { x: "42%", tone: "from-sky-300 to-blue-500", delay: "0.4s" },
                  { x: "74%", tone: "from-sky-300 to-blue-500", delay: "0.8s" },
                ].map((p) => (
                  <div
                    key={p.x}
                    className="absolute top-1/2 -translate-y-1/2"
                    style={{
                      left: p.x,
                      animation: `lp-float-y 5s ease-in-out ${p.delay} infinite`,
                    }}
                  >
                    <div
                      className={`relative h-24 w-12 rounded-[10px] bg-gradient-to-b ${p.tone} shadow-[0_10px_24px_rgba(0,0,0,0.4),inset_0_2px_0_rgba(255,255,255,0.4)]`}
                    >
                      <div className="absolute left-1/2 top-1.5 h-1.5 w-4 -translate-x-1/2 rounded-[1px] bg-black/60" />
                      <div className="absolute inset-x-1 bottom-1 grid h-6 grid-cols-4 grid-rows-4 gap-px overflow-hidden rounded-sm bg-white p-0.5">
                        {Array.from({ length: 16 }).map((_, k) => (
                          <div
                            key={k}
                            className={(k * 31 + 7) % 2 === 0 ? "bg-black" : ""}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                {/* Connecting line + pulse */}
                <div className="absolute bottom-6 left-0 right-0 mx-6 h-px bg-gradient-to-r from-transparent via-sky-400/60 to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.06),transparent_60%)]" />
              </div>
            </div>
          </BentoCard>

          {/* Product Experience Studio */}
          <BentoCard className="md:col-span-2">
            <div className="flex h-full flex-col justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-blue-700">
                  <Wand2 className="h-3.5 w-3.5" /> 02 · Studio
                </div>
                <h4 className="mt-3 text-[20px] font-medium leading-tight tracking-[-0.01em]">
                  Premium mobile-first experiences, no code required.
                </h4>
              </div>
              <div className="relative h-24 overflow-hidden rounded-lg border border-black/[0.06] bg-[#0c0c10]">
                <div className="lp-dot-bg absolute inset-0 opacity-30" />
                <div className="absolute left-3 top-3 h-7 w-12 rounded bg-gradient-to-br from-sky-400 to-blue-500 shadow" />
                <div className="absolute left-16 top-4 h-5 w-20 rounded bg-white/85" />
                <div className="absolute left-16 top-11 h-2 w-14 rounded bg-white/50" />
                <div className="absolute left-16 top-15 h-2 w-10 rounded bg-white/30" />
                <div className="absolute -bottom-3 right-3 h-9 w-9 rounded-full bg-gradient-to-br from-sky-300 to-blue-500 shadow-lg" />
              </div>
            </div>
          </BentoCard>

          {/* Consumer Interaction Intelligence */}
          <BentoCard className="md:col-span-2">
            <div className="flex h-full flex-col justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-sky-700">
                  <BarChart3 className="h-3.5 w-3.5" /> 03 · Intelligence
                </div>
                <h4 className="mt-3 text-[20px] font-medium leading-tight tracking-[-0.01em]">
                  Scan, engagement, and regional analytics.
                </h4>
              </div>
              <div className="flex items-end gap-1.5">
                {[42, 68, 51, 79, 62, 88, 74, 95, 70, 84].map((h, i) => (
                  <div
                    key={i}
                    className="w-2 rounded-t bg-gradient-to-t from-sky-500 to-sky-500"
                    style={{
                      height: `${h * 0.6}px`,
                      animation: `lp-data-pulse ${1.8 + (i % 3) * 0.3}s ease-in-out ${i * 0.08}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          </BentoCard>

          {/* Centralized Feedback Hub */}
          <BentoCard className="md:col-span-2">
            <div className="flex h-full flex-col justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-sky-700">
                  <MessageSquareHeart className="h-3.5 w-3.5" /> 04 · Feedback Hub
                </div>
                <h4 className="mt-3 text-[20px] font-medium leading-tight tracking-[-0.01em]">
                  Every review, complaint, and signal in one place.
                </h4>
              </div>
              <div className="space-y-1.5">
                {[
                  { t: "Loved the citrus note 🍊", a: "Madrid · ES" },
                  { t: "Bottle cap a bit stiff.", a: "Berlin · DE" },
                  { t: "5★ - packaging is gorgeous", a: "Tokyo · JP" },
                ].map((c) => (
                  <div
                    key={c.a}
                    className="flex items-center gap-2 rounded-md bg-[#fafaf7] px-2 py-1.5 text-[11px]"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                    <span className="flex-1 text-black/75">{c.t}</span>
                    <span className="text-[9.5px] text-black/40">{c.a}</span>
                  </div>
                ))}
              </div>
            </div>
          </BentoCard>

          {/* Multilingual Product Delivery */}
          <BentoCard className="md:col-span-2">
            <div className="flex h-full flex-col justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-sky-700">
                  <Languages className="h-3.5 w-3.5" /> 05 · Multilingual
                </div>
                <h4 className="mt-3 text-[20px] font-medium leading-tight tracking-[-0.01em]">
                  Localized at the SKU, region, and channel level.
                </h4>
              </div>
              <div className="space-y-1.5 font-mono text-[11px]">
                {[
                  { l: "EN", t: "Refresh your moment." },
                  { l: "FR", t: "Rafraîchissez votre moment." },
                  { l: "DE", t: "Erfrische deinen Moment." },
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

          {/* Campaign & Activation Engine */}
          <BentoCard className="md:col-span-2">
            <div className="flex h-full flex-col justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-blue-700">
                  <Megaphone className="h-3.5 w-3.5" /> 06 · Activation
                </div>
                <h4 className="mt-3 text-[20px] font-medium leading-tight tracking-[-0.01em]">
                  Promotions, loyalty, and limited drops - from the package.
                </h4>
              </div>
              <div className="mt-auto grid grid-cols-3 gap-1.5">
                {[
                  { l: "Promo", c: "bg-sky-500/15 text-sky-700" },
                  { l: "Loyalty", c: "bg-sky-500/15 text-sky-700" },
                  { l: "Event", c: "bg-sky-500/15 text-sky-700" },
                  { l: "Sample", c: "bg-sky-500/15 text-sky-700" },
                  { l: "Drop", c: "bg-blue-500/15 text-blue-700" },
                  { l: "Survey", c: "bg-blue-500/15 text-blue-700" },
                ].map((b) => (
                  <div
                    key={b.l}
                    className={`flex h-9 items-center justify-center rounded-md text-[11px] font-bold ${b.c}`}
                  >
                    {b.l}
                  </div>
                ))}
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--mx,50%)_var(--my,0%),rgba(115,178,221,0.06),transparent_50%)]" />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

/* ──────────────────────────────────────── Live Studio Showcase */

function LiveStudioShowcase() {
  return (
    <section
      id="studio"
      className="relative overflow-hidden border-y border-black/[0.06] bg-white px-6 py-24 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[1100px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(115,178,221,0.18),transparent_60%)] blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/40">
            Product Experience Studio
          </span>
          <h3 className="mt-3 text-[clamp(1.9rem,4vw,2.8rem)] font-medium leading-[1.08] tracking-[-0.02em]">
            A no-code studio that{" "}
            <em className="not-italic text-black/40">feels</em> like a design
            tool.
          </h3>
          <p className="mt-4 text-[15.5px] leading-relaxed text-black/55">
            Brand, marketing, and product teams compose mobile-first
            experiences - overlap, animate, translate, ship - without
            engineering dependency.
          </p>
        </div>

        <div className="relative mx-auto max-w-5xl">
          <div className="absolute -inset-10 -z-10 rounded-[3rem] bg-gradient-to-br from-sky-400/20 via-blue-400/15 to-sky-400/20 blur-3xl" />
          <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-[#0c0c10] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.35)]">
            <div className="flex h-9 items-center gap-3 border-b border-white/[0.06] bg-[#0a0a0d] px-3.5">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#73B2DD]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#4A88C7]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#244B7A]" />
              </div>
              <div className="mx-auto flex items-center gap-1.5 rounded-md bg-white/[0.05] px-2.5 py-1 text-[10.5px] font-medium text-white/55">
                <Globe2 className="h-3 w-3" />
                productix.studio / experiences / volt-no-7
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="rounded-md bg-sky-500/15 px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider text-sky-300">
                  Synced
                </span>
              </div>
            </div>

            <div className="relative h-[420px] overflow-hidden bg-[#0a0a0d] md:h-[520px]">
              <div className="lp-dot-bg absolute inset-0 opacity-30" />

              <div
                className="absolute left-[14%] top-[20%] h-[60%] w-[72%] rounded border-2 border-sky-400/70 bg-sky-400/[0.04]"
                style={{
                  animation: "lp-handle-pop 4s ease-in-out infinite",
                }}
              />

              <div className="absolute left-1/2 top-0 h-full w-px bg-sky-400/50" />
              <div className="absolute left-0 top-1/2 h-px w-full bg-sky-400/50" />

              <FloatingElement
                style={{ left: "20%", top: "26%" }}
                className="h-24 w-32 rounded-lg bg-gradient-to-br from-sky-400 to-blue-500"
                label="Hero"
                delay="0s"
              />
              <FloatingElement
                style={{ left: "45%", top: "30%" }}
                className="h-28 w-28 rounded-full bg-gradient-to-br from-sky-300 to-blue-500"
                label="Brand mark"
                delay="0.3s"
              />
              <FloatingElement
                style={{ left: "65%", top: "26%" }}
                className="flex h-24 w-40 items-center justify-center rounded-lg bg-white text-[12px] font-bold text-black"
                label="CTA · Scan"
                delay="0.6s"
              >
                <span>Reveal story</span>
              </FloatingElement>
              <FloatingElement
                style={{ left: "22%", top: "60%" }}
                className="h-20 w-56 rounded-lg bg-gradient-to-br from-sky-300 to-blue-500"
                label="Promo strip"
                delay="0.9s"
              />
              <FloatingElement
                style={{ left: "58%", top: "63%" }}
                className="h-20 w-44 rounded-lg bg-gradient-to-br from-blue-500 to-sky-700"
                label="Loyalty tile"
                delay="1.2s"
              />

              <div className="absolute right-5 top-5 flex items-center gap-2 rounded-full bg-[#0c0c10]/90 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-sky-400" />
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
        <div className="absolute -inset-1 rounded-[inherit] border border-sky-400/60" />
        {[
          "-top-1 -left-1",
          "-top-1 -right-1",
          "-bottom-1 -left-1",
          "-bottom-1 -right-1",
        ].map((p) => (
          <span
            key={p}
            className={`absolute ${p} h-2 w-2 rounded-[2px] border border-sky-300 bg-[#0a0a0d]`}
          />
        ))}
        {children}
        <span className="absolute -top-6 left-0 whitespace-nowrap rounded bg-sky-400 px-1.5 py-0.5 text-[9.5px] font-bold text-black">
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
    marketing: "from-sky-500 to-blue-500",
    event: "from-sky-400 to-blue-600",
    brand: "from-sky-400 to-blue-500",
    social: "from-sky-400 to-sky-500",
    custom: "from-blue-400 to-blue-700",
  };

  return (
    <section id="templates" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/40">
              Experience templates
            </span>
            <h3 className="mt-3 text-[clamp(1.9rem,4vw,2.8rem)] font-medium leading-tight tracking-[-0.02em]">
              Production-ready blueprints,{" "}
              <span className="text-black/40">designed by brand teams.</span>
            </h3>
          </div>
          <Link
            href="#demo"
            className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-4 py-2 text-[13px] font-medium text-black/80 transition-all hover:border-black/25"
          >
            See live experiences <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {templates.map((template, i) => {
            const accent =
              categoryAccents[template.meta.category as string] ||
              "from-sky-500 to-sky-400";
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
                      Preview experience
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

          <Link
            href="#demo"
            className="group flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/15 bg-white/40 p-8 text-center transition-all duration-500 hover:border-black/40 hover:bg-white"
          >
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-black/15 bg-white transition-transform duration-500 group-hover:rotate-90">
              <span className="text-2xl text-black/65">+</span>
              <span className="absolute inset-0 rounded-full border border-sky-500/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
            <h4 className="mt-5 text-[16px] font-semibold text-black">
              Custom experience
            </h4>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-black/50">
              Brief our enterprise team.
              <br />
              We architect it with you.
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────── Why Enterprises Choose */

function WhyEnterprisesChoose() {
  const features = [
    {
      icon: Boxes,
      title: "Multi-Brand & Multi-Region",
      desc: "Manage multiple brands, SKUs, business units, and regional teams from one centralized environment.",
      tone: "from-sky-500 to-blue-500",
    },
    {
      icon: ShieldCheck,
      title: "Role-Based Team Management",
      desc: "Support marketing, compliance, agencies, distributors, and regional operators with enterprise-grade permissions.",
      tone: "from-sky-500 to-blue-600",
    },
    {
      icon: Wand2,
      title: "Dynamic Product Content",
      desc: "Update product information instantly without changing packaging or reprinting materials.",
      tone: "from-sky-400 to-blue-500",
    },
    {
      icon: BarChart3,
      title: "Packaging Analytics",
      desc: "Measure packaging engagement performance with actionable consumer interaction insights.",
      tone: "from-sky-400 to-sky-600",
    },
    {
      icon: Smartphone,
      title: "Mobile-First Delivery",
      desc: "Deliver optimized experiences across all modern mobile devices and markets.",
      tone: "from-blue-500 to-blue-700",
    },
    {
      icon: Workflow,
      title: "Scalable Product Operations",
      desc: "Manage thousands of products, campaigns, and experiences within one scalable infrastructure.",
      tone: "from-blue-500 to-sky-600",
    },
  ];

  return (
    <section className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/40">
            Why enterprises choose Productix
          </span>
          <h3 className="mt-3 text-[clamp(1.9rem,4vw,2.8rem)] font-medium leading-tight tracking-[-0.02em]">
            Enterprise-ready infrastructure for{" "}
            <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-sky-600 bg-clip-text text-transparent">
              scalable consumer engagement.
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="lp-reveal-fast group relative overflow-hidden rounded-2xl border border-black/[0.07] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all hover:-translate-y-0.5 hover:border-black/15 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)]"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-30"
                style={{ background: `linear-gradient(135deg, transparent, transparent)` }}
              />
              <div
                className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${f.tone} text-white shadow-[0_8px_20px_-6px_rgba(0,0,0,0.25)]`}
              >
                <f.icon className="h-5 w-5" />
              </div>
              <h4 className="text-[17px] font-semibold tracking-[-0.01em] text-black">
                {f.title}
              </h4>
              <p className="mt-2 text-[13.5px] leading-relaxed text-black/55">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────── Business Outcomes */

function BusinessOutcomes() {
  const outcomes = [
    {
      icon: Activity,
      title: "Increase Consumer Engagement",
      desc: "Create direct digital interactions from physical retail products.",
    },
    {
      icon: Lock,
      title: "Build First-Party Consumer Data",
      desc: "Own valuable customer interaction data beyond retailer ecosystems.",
    },
    {
      icon: LineChart,
      title: "Improve Campaign Performance",
      desc: "Track engagement and conversion across packaging-led activations.",
    },
    {
      icon: Sparkles,
      title: "Modernize Product Communication",
      desc: "Deliver dynamic, localized, and real-time product information.",
    },
    {
      icon: Zap,
      title: "Accelerate Go-To-Market",
      desc: "Marketing teams launch experiences without engineering dependency.",
    },
    {
      icon: Layers,
      title: "Unify Product Interaction Data",
      desc: "Centralize engagement, feedback, and analytics into one ecosystem.",
    },
  ];

  return (
    <section
      id="outcomes"
      className="relative overflow-hidden border-y border-black/[0.06] bg-[#0a0a0d] px-6 py-24 text-white md:py-32"
    >
      <div className="lp-grid-bg pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(115,178,221,0.18),transparent_60%)] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
            Business outcomes
          </span>
          <h3 className="mt-3 text-[clamp(1.9rem,4vw,2.8rem)] font-medium leading-tight tracking-[-0.02em] text-white">
            Beyond QR codes -{" "}
            <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-sky-400 bg-clip-text text-transparent">
              built for measurable business impact.
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {outcomes.map((o, i) => (
            <div
              key={o.title}
              className="lp-reveal-fast group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-sm transition-all hover:border-white/15 hover:bg-white/[0.05]"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="absolute right-5 top-5 font-mono text-[10.5px] font-bold tracking-widest text-white/30">
                0{i + 1}
              </div>
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02]">
                <o.icon className="h-5 w-5 text-white/85" />
              </div>
              <h4 className="text-[17px] font-semibold tracking-[-0.01em] text-white">
                {o.title}
              </h4>
              <p className="mt-2 text-[13.5px] leading-relaxed text-white/55">
                {o.desc}
              </p>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────── Enterprise Use Cases */

function EnterpriseUseCases() {
  const cases = [
    {
      sector: "FMCG & Packaged Foods",
      desc: "Interactive packaging, ingredient transparency, campaigns, and loyalty activations.",
      tone: "from-sky-400 to-blue-500",
      tag: "FMCG",
    },
    {
      sector: "Beverage Brands",
      desc: "Event activations, limited campaigns, customer engagement, and regional storytelling.",
      tone: "from-sky-500 to-blue-600",
      tag: "BEV",
    },
    {
      sector: "Cosmetics & Personal Care",
      desc: "Usage guides, tutorials, influencer campaigns, and personalized product experiences.",
      tone: "from-blue-400 to-sky-600",
      tag: "COS",
    },
    {
      sector: "Nutrition & Wellness",
      desc: "Authenticity verification, educational content, certifications, and retention programs.",
      tone: "from-sky-400 to-sky-600",
      tag: "NTR",
    },
    {
      sector: "Retail & Distribution",
      desc: "Regionalized product communication and channel-specific engagement experiences.",
      tone: "from-sky-400 to-blue-600",
      tag: "RTL",
    },
  ];

  return (
    <section id="industries" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/40">
              Enterprise use cases
            </span>
            <h3 className="mt-3 text-[clamp(1.9rem,4vw,2.8rem)] font-medium leading-tight tracking-[-0.02em]">
              Built for modern{" "}
              <span className="text-black/40">consumer brand ecosystems.</span>
            </h3>
          </div>
          <Link
            href="#demo"
            className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-black/65 transition-colors hover:text-black"
          >
            See industry briefings <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cases.map((c, i) => (
            <div
              key={c.sector}
              className="lp-reveal-fast group relative overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all hover:-translate-y-0.5 hover:border-black/15 hover:shadow-[0_24px_60px_-18px_rgba(0,0,0,0.18)]"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div
                className={`relative h-32 overflow-hidden bg-gradient-to-br ${c.tone}`}
              >
                <div className="lp-dot-bg absolute inset-0 opacity-30" />
                <div className="absolute right-4 top-4 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                  {c.tag}
                </div>
                {/* abstract packaging silhouettes */}
                <div className="absolute -bottom-4 left-6 h-20 w-10 rounded-t-[14px] bg-white/25 shadow-xl backdrop-blur-sm" />
                <div className="absolute -bottom-4 left-20 h-24 w-12 rounded-t-[14px] bg-white/15 shadow-xl backdrop-blur-sm" />
                <div className="absolute -bottom-4 left-36 h-18 w-9 rounded-t-[14px] bg-white/30 shadow-xl backdrop-blur-sm" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
              <div className="p-6">
                <h4 className="text-[18px] font-semibold tracking-[-0.01em] text-black">
                  {c.sector}
                </h4>
                <p className="mt-2 text-[13.5px] leading-relaxed text-black/55">
                  {c.desc}
                </p>
              </div>
            </div>
          ))}

          {/* Custom industry CTA */}
          <Link
            href="#sales"
            className="group flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/15 bg-white/40 p-8 text-center transition-all hover:border-black/40 hover:bg-white"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-md transition-transform group-hover:scale-110">
              <Building2 className="h-5 w-5" />
            </div>
            <h4 className="mt-5 text-[16px] font-semibold text-black">
              Your category
            </h4>
            <p className="mt-1.5 max-w-[14rem] text-[12.5px] leading-relaxed text-black/50">
              Architecting a new enterprise rollout?
              <br />
              Talk to our team.
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────── Stats Ribbon */

function StatsRibbon() {
  const stats = [
    { value: "10M+", label: "Scans orchestrated" },
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

/* ──────────────────────────────────────── Vision Section */

function VisionSection() {
  const pillars = [
    "connected packaging",
    "product intelligence",
    "consumer interaction infrastructure",
    "packaging-led commerce",
    "product engagement ecosystems",
  ];

  return (
    <section className="relative overflow-hidden px-6 py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[1100px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(36,75,122,0.16),transparent_60%)] blur-3xl [animation:lp-aurora-shift_22s_ease-in-out_infinite]" />
        <div className="absolute right-0 top-0 h-[400px] w-[600px] rounded-full bg-[radial-gradient(ellipse,rgba(115,178,221,0.12),transparent_60%)] blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 lg:grid-cols-2">
        <div className="lp-reveal">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/40">
            The Productix vision
          </span>
          <h3 className="mt-3 text-[clamp(2rem,4.5vw,3.4rem)] font-medium leading-[1.04] tracking-[-0.025em] text-balance">
            Building the{" "}
            <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-sky-600 bg-clip-text text-transparent">
              digital layer
            </span>{" "}
            of physical products.
          </h3>
          <p className="mt-7 max-w-xl text-[16px] leading-[1.6] text-black/55 text-pretty">
            As physical products become increasingly interactive, intelligent,
            and data-driven, brands require scalable systems to manage
            engagement beyond the shelf. Our vision is to power the future of:
          </p>

          <ul className="mt-7 space-y-2.5">
            {pillars.map((p, i) => (
              <li
                key={p}
                className="lp-reveal-fast flex items-center gap-3 text-[15px] font-medium text-black/80"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-white">
                  <Check className="h-3 w-3" />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* Right - orbiting connected layer visualization */}
        <div className="relative mx-auto h-[420px] w-full max-w-lg lg:h-[480px]">
          <div className="absolute inset-0 -z-10 rounded-[3rem] bg-gradient-to-br from-sky-400/20 via-blue-400/15 to-sky-400/20 blur-3xl" />

          {/* Center node */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-black/10 bg-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)]">
              <Image
                src="/logo-light.png"
                alt="Productix"
                width={70}
                height={20}
                className="h-5 w-auto select-none"
              />
              <span className="absolute -inset-2 rounded-[1.6rem] border border-sky-400/30 [animation:lp-pulse-ring_3s_ease-out_infinite]" />
              <span
                className="absolute -inset-2 rounded-[1.6rem] border border-sky-400/30 [animation:lp-pulse-ring_3s_ease-out_1.5s_infinite]"
              />
            </div>
          </div>

          {/* Orbiting nodes */}
          {[
            { icon: QrCode, label: "Packaging", angle: 0, r: 150 },
            { icon: Smartphone, label: "Mobile", angle: 72, r: 150 },
            { icon: BarChart3, label: "Insights", angle: 144, r: 150 },
            { icon: Megaphone, label: "Campaigns", angle: 216, r: 150 },
            { icon: MessageSquareHeart, label: "Feedback", angle: 288, r: 150 },
          ].map((n, i) => {
            const rad = (n.angle * Math.PI) / 180;
            const x = Math.cos(rad) * n.r;
            const y = Math.sin(rad) * n.r;
            const Icon = n.icon;
            return (
              <div
                key={n.label}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  animation: `lp-float-y ${4 + (i % 3)}s ease-in-out ${i * 0.3}s infinite`,
                }}
              >
                <div className="flex flex-col items-center gap-1.5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-black/10 bg-white text-black/80 shadow-[0_12px_24px_-8px_rgba(0,0,0,0.18)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-black/65 backdrop-blur">
                    {n.label}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Orbit guide */}
          <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-black/10" />
          <div className="absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-black/[0.05]" />
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────── Security & Scalability */

function SecurityScalability() {
  const pillars = [
    { icon: Cpu, label: "Scalable cloud infrastructure" },
    { icon: ShieldCheck, label: "Enterprise permission management" },
    { icon: Lock, label: "Secure data handling" },
    { icon: Globe2, label: "Global content scalability" },
    { icon: Activity, label: "High-volume engagement architecture" },
  ];

  return (
    <section
      id="security"
      className="relative overflow-hidden border-y border-black/[0.06] bg-white px-6 py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-[#fafaf7] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-black/60">
            <ShieldCheck className="h-3 w-3" /> Security & scalability
          </span>
          <h3 className="mt-6 text-[clamp(1.9rem,4vw,2.8rem)] font-medium leading-tight tracking-[-0.02em]">
            Enterprise-grade foundation.
          </h3>
          <p className="mx-auto mt-6 max-w-2xl text-[16px] leading-[1.6] text-black/55 text-pretty">
            Productix is designed for operational scalability, organizational
            control, and enterprise deployment readiness.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {pillars.map((p, i) => (
            <div
              key={p.label}
              className="lp-reveal-fast group relative overflow-hidden rounded-xl border border-black/[0.07] bg-[#fafaf7] p-5 text-center transition-all hover:border-black/20 hover:bg-white hover:shadow-[0_18px_40px_-15px_rgba(0,0,0,0.12)]"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-black text-white shadow-[0_8px_18px_-6px_rgba(0,0,0,0.4)] transition-transform group-hover:scale-110">
                <p.icon className="h-5 w-5" />
              </div>
              <div className="text-[12.5px] font-semibold leading-snug text-black/80">
                {p.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────── Final CTA */

function FinalCTA() {
  return (
    <section
      id="demo"
      className="relative overflow-hidden px-6 py-32 md:py-40"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[800px] w-[1200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(36,75,122,0.28),transparent_55%)] blur-3xl [animation:lp-aurora-shift_20s_ease-in-out_infinite]" />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(115,178,221,0.24),transparent_55%)] blur-3xl [animation:lp-aurora-shift-2_24s_ease-in-out_infinite]" />
      </div>
      <div className="lp-grid-bg-light pointer-events-none absolute inset-0 -z-10 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

      <div className="mx-auto max-w-4xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white/80 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-black/65 backdrop-blur-md">
          <Sparkles className="h-3 w-3" /> Ready when you are
        </span>
        <h2 className="mt-8 text-[clamp(2.2rem,5.5vw,4.6rem)] font-medium leading-[0.98] tracking-[-0.035em] text-balance">
          Transform packaging into a
          <br />
          <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-sky-600 bg-clip-text italic text-transparent">
            measurable engagement channel.
          </span>
        </h2>
        <p className="mx-auto mt-7 max-w-xl text-[16.5px] leading-[1.55] text-black/55">
          Enable connected product experiences, consumer intelligence, and
          packaging-led activations through Productix enterprise infrastructure.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="#demo"
            className="group relative inline-flex h-12 items-center gap-2 overflow-hidden rounded-full bg-black px-7 text-[14px] font-semibold text-white shadow-[0_18px_50px_-12px_rgba(0,0,0,0.5)] transition-all hover:shadow-[0_22px_60px_-12px_rgba(0,0,0,0.6)]"
          >
            <span className="relative z-10">Schedule Enterprise Demo</span>
            <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </Link>
          <Link
            href="#sales"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-black/15 bg-white px-6 text-[14px] font-medium text-black/85 transition-all hover:border-black/30"
          >
            Speak with Productix team
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <p className="mt-6 text-[12px] text-black/45">
          Enterprise rollouts · Multi-brand architecture · Global deployment
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
              Product Experience Infrastructure for Modern Consumer Brands.
            </p>
            <p className="mt-4 max-w-xs text-[12px] italic leading-relaxed text-black/45">
              Productix is part of the{" "}
              <a
                href="https://commercializer.com"
                className="underline decoration-black/20 underline-offset-2 transition-colors hover:text-black hover:decoration-black/60"
              >
                Commercializer
              </a>{" "}
              enterprise technology portfolio.
            </p>
          </div>
          {(
            [
              {
                title: "Platform",
                links: [
                  ["Capabilities", "#capabilities"],
                  ["Outcomes", "#outcomes"],
                  ["Industries", "#industries"],
                  ["Security", "#security"],
                ] as const,
              },
              {
                title: "Company",
                links: [
                  ["Book demo", "#demo"],
                  ["Talk to sales", "#sales"],
                  ["Studio", "#studio"],
                  ["Templates", "#templates"],
                ] as const,
              },
            ]
          ).map((col) => (
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
            © {new Date().getFullYear()} Productix. Connected product
            infrastructure.
          </p>
          <p className="text-[12px] text-black/45">
            Enterprise-grade. Globally scalable. Built for brands at scale.
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
            href="#demo"
            className="group inline-flex h-10 items-center gap-1.5 rounded-full bg-black px-5 text-[13px] font-semibold text-white shadow-[0_12px_30px_-10px_rgba(0,0,0,0.45)] transition-all hover:shadow-[0_16px_40px_-10px_rgba(0,0,0,0.6)]"
          >
            Book enterprise demo
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

