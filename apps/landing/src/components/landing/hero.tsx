import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { HeroBeamScene } from "./hero-beam-scene";
import { SectionGlow } from "./section-glow";

const STANDARDS = [
  "Built on GS1 Standards",
  "GS1 Digital Link Ready",
  "DPP & PPWR Aligned",
  "Designed for the Sunrise 2027 Transition",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream pt-32 pb-20 md:pb-28">
      <SectionGlow strong />
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-[0.4] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_65%)]" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-accent-dim">
            Connected Product Infrastructure
          </span>

          <h1 className="mt-4 text-[clamp(2.3rem,5vw,3.6rem)] font-medium leading-[1.08] tracking-[-0.02em] text-ink">
            Give Every Product a{" "}
            <span className="text-gradient-brand">Digital Identity.</span>
          </h1>

          <p className="mt-6 max-w-lg text-[16px] leading-[1.6] text-ink/60">
            Connect every product to trusted identity, compliance data,
            engaging digital experiences, and actionable intelligence, all
            through one connected product platform.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/book-a-demo"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[14px] font-semibold text-white transition-colors hover:bg-navy-deep"
            >
              Book a demo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#platform"
              className="glass-light inline-flex h-12 items-center rounded-full px-6 text-[14px] font-medium text-ink/80 transition-colors hover:text-ink"
            >
              Explore the platform
            </Link>
          </div>
        </div>

        <HeroBeamScene />
      </div>

      <div className="relative mt-12 flex justify-center px-6 md:mt-16">
        <div className="glass-light inline-flex max-w-full flex-wrap items-center justify-center gap-1.5 rounded-2xl p-1.5 sm:rounded-full">
          {STANDARDS.map((label) => (
            <span
              key={label}
              className="whitespace-nowrap rounded-full bg-accent/10 px-3.5 py-1.5 text-[12px] font-bold text-ink/70"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
