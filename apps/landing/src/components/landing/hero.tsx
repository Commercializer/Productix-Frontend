import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { HeroBeamScene } from "./hero-beam-scene";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream pt-32 pb-20 md:pb-28">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-[0.15] [mask-image:radial-gradient(ellipse_at_top,black,transparent_65%)]" />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-accent-dim">
          Connected Product Infrastructure
        </span>

        <h1 className="mt-4 text-[clamp(2.3rem,5vw,3.6rem)] font-medium leading-[1.08] tracking-[-0.02em] text-ink">
          Give Every Product a{" "}
          <span className="text-gradient-brand">Digital Identity.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-lg text-[16px] leading-[1.6] text-ink/60">
          Connect every product to trusted identity, compliance data,
          engaging digital experiences, and actionable intelligence, all
          through one connected product platform.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
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

      <div className="relative mx-auto mt-16 max-w-6xl px-6 md:mt-20">
        <HeroBeamScene />
      </div>
    </section>
  );
}
