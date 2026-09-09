import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { getSolution } from "@/content/solutions";

import { Reveal } from "./reveal";

const FEATURED_SLUGS = ["gs1-digital-link", "digital-product-passport", "ppwr-epr"] as const;

export function WhatsNext() {
  const featured = FEATURED_SLUGS.map((slug) => getSolution(slug)!);

  return (
    <section id="solutions" className="bg-white px-6 py-24 md:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-accent-dim">
            Solutions
          </span>
          <h2 className="mt-3 text-[clamp(1.9rem,4vw,2.9rem)] font-medium leading-[1.1] tracking-[-0.02em] text-ink">
            Ready for What&rsquo;s Next.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-[1.7] text-ink/60">
            Product regulations and product data standards are evolving
            rapidly. Productix gives enterprises a connected foundation to
            prepare for emerging requirements while building the digital
            infrastructure their products will need for the future.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {featured.map((solution, i) => (
            <Reveal key={solution.slug} delay={i * 90}>
              <Link
                href={`/solutions/${solution.slug}`}
                className="group flex h-full flex-col rounded-3xl border border-ink/10 bg-cream p-7 transition-shadow hover:shadow-[0_20px_44px_-24px_rgba(10,17,32,0.25)]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-accent shadow-sm">
                  <solution.icon className="h-5 w-5" />
                </span>
                <span className="mt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/40">
                  {solution.name}
                </span>
                <h3 className="mt-1.5 text-[17px] font-medium text-ink">
                  {solution.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink/55">
                  {solution.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {solution.keyTerms.slice(0, 3).map((term) => (
                    <span
                      key={term}
                      className="rounded-full bg-white px-3 py-1 text-[11px] font-medium text-ink/55"
                    >
                      {term}
                    </span>
                  ))}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-16 flex flex-col items-start gap-6 rounded-3xl bg-navy px-8 py-10 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-[22px] font-medium leading-snug text-white">
                Compliance is the foundation.
                <br />
                Connection is the opportunity.
              </h3>
              <p className="mt-2 max-w-md text-[14px] leading-relaxed text-white/55">
                Productix helps you build the compliance layer today while
                creating connected digital experiences and intelligence that
                can grow with your products.
              </p>
            </div>
            <Link
              href="/platform/compliance"
              className="group inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-accent px-6 text-[14px] font-semibold text-navy transition-colors hover:bg-teal"
            >
              Explore Compliance
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
