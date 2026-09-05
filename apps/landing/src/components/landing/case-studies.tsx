import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Reveal } from "./reveal";

const SCENARIOS = [
  {
    title: "Consolidate multi-brand compliance on one platform",
    desc: "Digital Product Passport data, packaging updates, and regional teams, managed from a single environment.",
  },
  {
    title: "Launch limited-run campaigns straight from the package",
    desc: "Marketing teams ship and localize activations without engineering dependency or reprinting materials.",
  },
  {
    title: "Turn a single scan into a lasting customer relationship",
    desc: "Ongoing, personalized engagement built from first-party scan and feedback data.",
  },
];

export function CaseStudies() {
  return (
    <section className="bg-white px-6 py-24 md:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl">
            <Image
              src="https://picsum.photos/seed/productix-retail-shelf-brand/1800/1000"
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/75 via-navy-deep/15 to-navy-deep/60" />

            <div className="relative flex min-h-[600px] flex-col justify-between gap-10 p-8 md:p-12">
              <h2 className="max-w-md text-[clamp(1.9rem,4vw,2.7rem)] font-medium leading-[1.12] tracking-[-0.02em] text-white">
                What you can build with Productix.
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {SCENARIOS.map((s, i) => (
                  <Reveal key={s.title} delay={i * 90}>
                    <div className="glass-light flex h-full flex-col rounded-2xl p-6">
                      <h3 className="text-[15.5px] font-medium leading-snug text-ink">
                        {s.title}
                      </h3>
                      <p className="mt-2.5 text-[13px] leading-relaxed text-ink/60">
                        {s.desc}
                      </p>
                      <Link
                        href="#demo"
                        className="group mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-accent-dim transition-colors hover:text-accent"
                      >
                        Learn more
                        <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
