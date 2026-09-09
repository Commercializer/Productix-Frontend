import { PLATFORM_PILLARS } from "@/content/platform";

import { ContentCardGrid } from "./content-card-grid";
import { Reveal } from "./reveal";

export function PlatformPillars() {
  return (
    <section id="platform" className="bg-cream px-6 py-24 md:py-28">
      <div className="mx-auto max-w-6xl">
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
          <ContentCardGrid items={PLATFORM_PILLARS} basePath="/platform" columnsClassName="sm:grid-cols-2" />
        </div>
      </div>
    </section>
  );
}
