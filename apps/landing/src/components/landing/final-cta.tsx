import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Reveal } from "./reveal";

export function FinalCta() {
  return (
    <section id="demo" className="bg-navy px-6 py-24 md:py-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-[clamp(2rem,4.5vw,3.2rem)] font-medium leading-[1.1] tracking-[-0.02em] text-white">
          Transform packaging into a measurable engagement channel.
        </h2>
        <p className="mx-auto mt-5 max-w-md text-[15.5px] leading-[1.6] text-white/55">
          Enable connected product experiences, consumer intelligence, and
          packaging-led activations with Productix.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="#demo"
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-accent px-7 text-[14px] font-semibold text-white transition-colors hover:bg-accent-dim"
          >
            Book a demo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="#sales"
            className="glass-dark inline-flex h-12 items-center rounded-full px-6 text-[14px] font-medium text-white/85 transition-colors hover:text-white"
          >
            Talk to sales
          </Link>
        </div>
        <p className="mt-6 text-[12px] text-white/40">
          Enterprise rollouts, multi-brand architecture, global deployment.
        </p>
      </Reveal>
    </section>
  );
}
