import { ChevronRight } from "lucide-react";
import Link from "next/link";

import {
  ConcentricDiagram,
  CubeDiagram,
  NetworkDiagram,
  VennDiagram,
} from "./diagrams";
import { Reveal } from "./reveal";

const SOLUTIONS = [
  {
    tag: "Connected packaging",
    title: "Productix QR Engagement",
    desc: "Every SKU carries a scannable identity that opens into a mobile-first product experience, no app required.",
    diagram: NetworkDiagram,
  },
  {
    tag: "Experience studio",
    title: "Productix Smart Packaging",
    desc: "Brand and marketing teams compose, localize, and ship product experiences without engineering dependency.",
    diagram: CubeDiagram,
  },
  {
    tag: "Intelligence",
    title: "Consumer Intelligence & Feedback",
    desc: "Scan, engagement, and review data flow into one view, giving brands first-party insight beyond the retailer.",
    diagram: ConcentricDiagram,
    tags: ["Scan analytics", "Feedback hub", "Regional reporting"],
  },
  {
    tag: "Activation",
    title: "Multilingual Campaigns & Loyalty",
    desc: "Promotions, loyalty programs, and localized storytelling, activated and updated directly from the package.",
    diagram: VennDiagram,
  },
];

export function SolutionsList() {
  return (
    <section id="platform" className="bg-white px-6 py-24 md:py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">
              Solutions
            </span>
            <h2 className="mt-3 max-w-lg text-[clamp(1.9rem,4vw,2.7rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink">
              A unified solution suite for product engagement and
              intelligence.
            </h2>
          </div>
          <Link
            href="#demo"
            className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border border-ink/15 px-4 text-[13px] font-medium text-ink/75 transition-colors hover:border-ink/30"
          >
            View all solutions <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </Reveal>

        <div className="relative mt-16">
          <div className="absolute left-9 top-2 bottom-2 hidden w-px border-l border-dashed border-ink/20 sm:block" />

          <div className="flex flex-col gap-14">
            {SOLUTIONS.map((s, i) => (
              <Reveal key={s.title} delay={i * 80}>
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-8">
                  <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-ink/15 bg-white text-accent">
                    <s.diagram className="h-11 w-11" />
                  </div>
                  <div className="pt-1">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/40">
                      {s.tag}
                    </span>
                    <h3 className="mt-1.5 text-[19px] font-medium text-ink">
                      {s.title}
                    </h3>
                    <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-ink/55">
                      {s.desc}
                    </p>
                    {s.tags && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {s.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-full bg-cream px-3 py-1 text-[11.5px] font-medium text-ink/60"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    <Link
                      href="#demo"
                      className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium text-accent transition-colors hover:text-accent-dim"
                    >
                      Learn more <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
