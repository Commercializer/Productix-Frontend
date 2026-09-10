import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Adapted from magicui.design's Bento Grid (https://magicui.design/docs/components/bento-grid)
 * to this project's glass-card language: `.glass-light` fill instead of a flat
 * card + shadow, brand-color corner glow instead of an arbitrary background slot.
 */
export function BentoGrid({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {children}
    </div>
  );
}

export function BentoCard({
  name,
  title,
  description,
  href,
  cta = "Learn more",
  Icon,
  keyTerms,
  featured = false,
  className = "",
}: {
  name: string;
  title: string;
  description: string;
  href: string;
  cta?: string;
  Icon: LucideIcon;
  keyTerms?: string[];
  featured?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`glass-light group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-7 transition-transform hover:-translate-y-1 ${className}`}
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-linear-to-br from-teal/25 to-sky/25 blur-2xl transition-transform duration-500 group-hover:scale-125"
        aria-hidden="true"
      />
      <div className="relative">
        <span
          className={`flex items-center justify-center rounded-2xl bg-brand-accent/10 text-brand-accent ${
            featured ? "h-14 w-14" : "h-11 w-11"
          }`}
        >
          <Icon className={featured ? "h-6 w-6" : "h-5 w-5"} />
        </span>
        <span className="mt-5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/40">
          {name}
        </span>
        <h3 className={`mt-1.5 font-medium text-ink ${featured ? "text-[23px]" : "text-[19px]"}`}>
          {title}
        </h3>
        <p
          className={`mt-2 leading-relaxed text-ink/55 ${
            featured ? "max-w-sm text-[15px]" : "max-w-xs text-[14px]"
          }`}
        >
          {description}
        </p>
        {keyTerms && (
          <div className="mt-5 flex flex-wrap gap-2">
            {keyTerms.map((term) => (
              <span
                key={term}
                className="rounded-full bg-white/70 px-3 py-1 text-[11.5px] font-medium text-ink/60"
              >
                {term}
              </span>
            ))}
          </div>
        )}
      </div>
      <span className="relative mt-5 inline-flex items-center gap-1 text-[13px] font-medium text-brand-accent-dim">
        {cta}
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
