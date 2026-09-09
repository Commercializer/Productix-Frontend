import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { Reveal } from "./reveal";

export type ContentCardItem = {
  slug: string;
  name: string;
  title: string;
  description: string;
  keyTerms: string[];
  icon: LucideIcon;
  index?: string;
};

export function ContentCardGrid({
  items,
  basePath,
  columnsClassName = "sm:grid-cols-2 lg:grid-cols-3",
}: {
  items: ContentCardItem[];
  basePath: string;
  columnsClassName?: string;
}) {
  return (
    <div className={`grid grid-cols-1 gap-5 ${columnsClassName}`}>
      {items.map((item, i) => (
        <Reveal key={item.slug} delay={i * 80}>
          <Link
            href={`${basePath}/${item.slug}`}
            className="group flex h-full flex-col rounded-3xl border border-ink/10 bg-white p-7 transition-shadow hover:shadow-[0_20px_44px_-24px_rgba(10,17,32,0.3)]"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                <item.icon className="h-5 w-5" />
              </span>
              {item.index && (
                <span className="font-mono text-[12px] text-ink/35">{item.index}</span>
              )}
            </div>

            <span className="mt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/40">
              {item.name}
            </span>
            <h3 className="mt-1.5 text-[19px] font-medium text-ink">{item.title}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-ink/55">{item.description}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {item.keyTerms.map((term) => (
                <span
                  key={term}
                  className="rounded-full bg-cream px-3 py-1 text-[11.5px] font-medium text-ink/60"
                >
                  {term}
                </span>
              ))}
            </div>

            <span className="mt-5 inline-flex items-center gap-1 text-[13px] font-medium text-accent-dim">
              Learn more
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
