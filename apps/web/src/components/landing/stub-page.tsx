import { ArrowRight, type LucideIcon } from "lucide-react";
import Link from "next/link";

export function StubPage({
  eyebrow,
  title,
  description,
  keyTerms,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  description: string;
  keyTerms?: string[];
  icon: LucideIcon;
}) {
  return (
    <section className="bg-cream px-6 pb-24 pt-40 md:pt-48">
      <div className="mx-auto max-w-2xl text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-accent/10 text-brand-accent">
          <Icon className="h-6 w-6" />
        </span>
        <span className="mt-6 block text-[12px] font-semibold uppercase tracking-[0.16em] text-brand-accent-dim">
          {eyebrow}
        </span>
        <h1 className="mt-3 text-[clamp(1.9rem,4vw,2.9rem)] font-medium leading-[1.1] tracking-[-0.02em] text-ink">
          {title}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-[15.5px] leading-[1.7] text-ink/60">
          {description}
        </p>

        {keyTerms && keyTerms.length > 0 && (
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {keyTerms.map((term) => (
              <span key={term} className="rounded-full bg-white px-3 py-1 text-[12px] font-medium text-ink/55">
                {term}
              </span>
            ))}
          </div>
        )}

        <div className="mt-10 rounded-2xl border border-dashed border-ink/15 bg-white/60 px-6 py-5">
          <p className="text-[13.5px] text-ink/50">
            The full page for this section is coming soon. In the meantime,
            talk to us about how Productix supports it today.
          </p>
        </div>

        <Link
          href="/book-a-demo"
          className="group mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[14px] font-semibold text-white transition-colors hover:bg-navy-deep"
        >
          Book a demo
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
