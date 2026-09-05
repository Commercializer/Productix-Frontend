import { Building2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Reveal } from "./reveal";

const SECTORS = [
  {
    name: "FMCG & packaged foods",
    desc: "Interactive packaging, ingredient transparency, campaigns, and loyalty activations.",
    seed: "productix-fmcg-foods",
  },
  {
    name: "Beverage brands",
    desc: "Event activations, limited campaigns, customer engagement, and regional storytelling.",
    seed: "productix-beverage-brand",
  },
  {
    name: "Cosmetics & personal care",
    desc: "Usage guides, tutorials, influencer campaigns, and personalized product experiences.",
    seed: "productix-cosmetics-shelf",
  },
  {
    name: "Nutrition & wellness",
    desc: "Authenticity verification, educational content, certifications, and retention programs.",
    seed: "productix-nutrition-wellness",
  },
  {
    name: "Retail & distribution",
    desc: "Regionalized product communication and channel-specific engagement experiences.",
    seed: "productix-retail-distribution",
  },
];

export function Industries() {
  return (
    <section id="industries" className="bg-white px-6 py-24 md:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-accent-dim">
            Industries
          </span>
          <h2 className="mt-3 text-[clamp(1.9rem,4vw,2.9rem)] font-medium leading-[1.1] tracking-[-0.02em] text-ink">
            Built for modern consumer brand ecosystems.
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SECTORS.map((s, i) => (
            <Reveal key={s.name} delay={i * 70}>
              <div className="group h-full overflow-hidden rounded-2xl border border-ink/10">
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={`https://picsum.photos/seed/${s.seed}/640/420`}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-[17px] font-medium text-ink">
                    {s.name}
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-ink/55">
                    {s.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}

          <Reveal delay={SECTORS.length * 70}>
            <Link
              href="#sales"
              className="flex h-full min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-ink/20 p-8 text-center transition-colors hover:border-ink/40"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-white">
                <Building2 className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-[16px] font-medium text-ink">
                Your category
              </h3>
              <p className="mt-1.5 max-w-52 text-[13px] leading-relaxed text-ink/50">
                Architecting a new enterprise rollout? Talk to our team.
              </p>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
