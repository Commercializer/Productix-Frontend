import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Reveal } from "./reveal";
import { SectionGlow } from "./section-glow";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-white to-cream px-6 py-24 md:py-28">
      <SectionGlow strong flip />
      <Reveal className="glass-panel relative mx-auto max-w-2xl rounded-[2.5rem] px-8 py-14 text-center sm:px-16">
        <h2 className="text-[clamp(2rem,4.5vw,3.2rem)] font-medium leading-[1.1] tracking-[-0.02em] text-ink">
          Ready Your Products for What&rsquo;s Next.
        </h2>
        <p className="mx-auto mt-5 max-w-md text-[15.5px] leading-[1.6] text-ink/60">
          Build a connected digital foundation for your products, packaging
          and compliance requirements.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            data-cal-namespace="productix-discovery-call"
            data-cal-link="commercializer/productix-discovery-call"
            data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-brand-accent px-7 text-[14px] font-semibold text-navy transition-colors hover:bg-teal"
          >
            Book an Assessment
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <Link
            href="/company/contact"
            className="inline-flex h-12 items-center rounded-full border border-ink/15 px-6 text-[14px] font-medium text-ink/80 transition-colors hover:border-ink/30 hover:text-ink"
          >
            Contact Us
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
