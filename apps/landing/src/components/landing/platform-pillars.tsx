import { PLATFORM_PILLARS } from "@/content/platform";

import { BentoCard, BentoGrid } from "./magicui/bento-grid";
import { Reveal } from "./reveal";
import { SectionGlow } from "./section-glow";

// Connect leads (wide), Compliance runs tall alongside it, Experience and
// Intelligence fill the remaining row underneath - a real bento mix instead
// of four equal tiles.
const SPANS = ["lg:col-span-2", "lg:col-span-1 lg:row-span-2", "lg:col-span-1", "lg:col-span-1"];

export function PlatformPillars() {
  return (
    <section id="platform" className="relative overflow-hidden bg-cream px-6 py-24 md:py-28">
      <SectionGlow flip />
      <div className="relative mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-accent-dim">
            Platform
          </span>
          <h2 className="mt-3 text-[clamp(1.9rem,4vw,2.9rem)] font-medium leading-[1.1] tracking-[-0.02em] text-ink">
            One Platform. Every Product Layer.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-[1.7] text-ink/60">
            Productix connects product identity, compliance, digital
            experiences and intelligence in one connected infrastructure,
            giving enterprises a single foundation to manage what their
            products are, what they contain, how they comply and how they
            connect with people.
          </p>
        </Reveal>

        <div className="mt-14">
          <BentoGrid>
            {PLATFORM_PILLARS.map((pillar, i) => (
              <Reveal key={pillar.slug} delay={i * 90} className={SPANS[i]}>
                <BentoCard
                  name={pillar.name}
                  title={pillar.title}
                  description={pillar.description}
                  keyTerms={pillar.keyTerms}
                  href={`/platform/${pillar.slug}`}
                  Icon={pillar.icon}
                  featured={i === 0}
                  className="h-full"
                />
              </Reveal>
            ))}
          </BentoGrid>
        </div>
      </div>
    </section>
  );
}
