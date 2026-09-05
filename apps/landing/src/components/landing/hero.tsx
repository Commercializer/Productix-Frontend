import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { HeroScene } from "./hero-scene";
import { Reveal } from "./reveal";
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

        <div className="relative">
          <HeroScene />

          <Reveal
            delay={550}
            className="pointer-events-none absolute -bottom-10 -left-8 z-10 hidden w-59 lg:block"
          >
            <div className="glass-light rounded-2xl p-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-accent" />
                <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink/50">
                  Packaging compliance
                </span>
              </div>
              <label className="mt-3 flex items-center gap-2.5">
                <span className="inline-flex h-5 w-9 shrink-0 items-center rounded-full bg-accent">
                  <span className="inline-block h-4 w-4 translate-x-4 rounded-full bg-white shadow-sm" />
                </span>
                <span className="text-[12px] leading-snug text-ink/80">
                  I confirm that the total fluorine content of the packaging does not exceed the legal
                  limit of 50&nbsp;ppm.
                </span>
              </label>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
