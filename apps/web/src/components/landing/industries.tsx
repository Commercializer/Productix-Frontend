import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { industriesByGroup } from "@/content/industries";

import { Reveal } from "./reveal";
import { SectionGlow } from "./section-glow";

export function Industries() {
  const groups = industriesByGroup();

  return (
    <section id="industries" className="relative overflow-hidden bg-cream px-6 py-24 md:py-28">
      <SectionGlow />
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.16]" aria-hidden="true">
        <Image src="/images/industries.jpg" alt="" fill sizes="100vw" className="object-cover" />
      </div>
      <div className="pointer-events-none absolute inset-0 z-0 bg-cream/70" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-brand-accent-dim">
            Built for Product-Led Industries
          </span>
          <h2 className="mt-3 text-[clamp(1.9rem,4vw,2.9rem)] font-medium leading-[1.1] tracking-[-0.02em] text-ink">
            One Platform. Many Product Ecosystems.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-[1.7] text-ink/60">
            From consumer goods and packaging to industrial products,
            Productix provides the digital infrastructure to connect
            products, compliance data, packaging and experiences across the
            product lifecycle.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map(({ group, items }, i) => (
            <Reveal key={group} delay={i * 80}>
              <div
                id={group.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
                className="glass-light h-full rounded-2xl p-6"
              >
                <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink/45">
                  {group}
                </h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {items.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/industries/${item.slug}`}
                        className="group flex items-center gap-2.5 text-[14px] text-ink/70 transition-colors hover:text-ink"
                      >
                        <item.icon className="h-4 w-4 shrink-0 text-brand-accent" />
                        <span className="group-hover:underline group-hover:decoration-ink/30 group-hover:underline-offset-2">
                          {item.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={150} className="mt-14 flex flex-col items-center gap-5 text-center">
          <p className="max-w-xl text-[15px] leading-relaxed text-ink/60">
            Built to support evolving product, packaging and digital identity
            requirements across markets.
          </p>
          <Link
            href="/industries"
            className="group inline-flex h-11 items-center gap-2 rounded-full bg-ink px-6 text-[14px] font-semibold text-white transition-colors hover:bg-navy-deep"
          >
            Explore Industries
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
