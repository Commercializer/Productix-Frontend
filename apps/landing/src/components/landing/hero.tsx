import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { HeroScene } from "./hero-scene";
import { WordCycle } from "./word-cycle";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream pt-24 pb-20 md:pb-28">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-[0.15] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_65%)]" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <h1 className="text-[clamp(2.3rem,5vw,3.6rem)] font-medium leading-[1.08] tracking-[-0.02em] text-ink">
            Product experience
            <br />
            powering <WordCycle words={["engagement.", "intelligence.", "compliance.", "trust.", "scale."]} />
          </h1>

          <p className="mt-6 max-w-md text-[16px] leading-[1.6] text-ink/60">
            Turn physical packaging into connected digital experiences,
            consumer intelligence, and activation infrastructure for FMCG
            brands at scale.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="#demo"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[14px] font-semibold text-white transition-colors hover:bg-navy-deep"
            >
              Book a demo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#sales"
              className="glass-light inline-flex h-12 items-center rounded-full px-6 text-[14px] font-medium text-ink/80 transition-colors hover:text-ink"
            >
              Talk to sales
            </Link>
          </div>
        </div>

        <HeroScene />
      </div>
    </section>
  );
}
