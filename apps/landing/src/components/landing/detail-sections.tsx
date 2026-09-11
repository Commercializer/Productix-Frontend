import { ArrowRight, Check, type LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Reveal } from "./reveal";
import { SectionGlow } from "./section-glow";

/** Shared building blocks for the /platform/[connect|compliance|experience|intelligence] pages. */

export function DetailHero({
  eyebrow,
  title,
  description,
  pills,
  primary,
  secondary,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  pills?: string[];
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="relative overflow-hidden bg-cream px-6 pb-16 pt-40 md:pt-48">
      <SectionGlow strong />
      <Reveal className="relative mx-auto max-w-2xl text-center">
        <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-accent-dim">
          {eyebrow}
        </span>
        <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.2rem)] font-medium leading-[1.1] tracking-[-0.02em] text-ink">
          {title}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-[15.5px] leading-[1.7] text-ink/60">
          {description}
        </p>

        {pills && pills.length > 0 && (
          <div className="mt-7 flex flex-wrap justify-center gap-1.5">
            {pills.map((p) => (
              <span
                key={p}
                className="glass-light rounded-full px-3.5 py-1.5 text-[12px] font-semibold text-ink/70"
              >
                {p}
              </span>
            ))}
          </div>
        )}

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={primary.href}
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[14px] font-semibold text-white transition-colors hover:bg-navy-deep"
          >
            {primary.label}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          {secondary && (
            <Link
              href={secondary.href}
              className="group inline-flex h-12 items-center gap-2 rounded-full px-6 text-[14px] font-medium text-ink/70 transition-colors hover:text-ink"
            >
              {secondary.label}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>
      </Reveal>
    </section>
  );
}

export function DetailSection({
  id,
  bg = "white",
  flip = false,
  glow = true,
  maxWidth = "max-w-6xl",
  className = "",
  children,
}: {
  id?: string;
  bg?: "white" | "cream";
  flip?: boolean;
  glow?: boolean;
  maxWidth?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`relative overflow-hidden ${bg === "white" ? "bg-white" : "bg-cream"} px-6 py-24 md:py-28 ${className}`}
    >
      {glow && <SectionGlow flip={flip} />}
      <div className={`relative mx-auto ${maxWidth}`}>{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  maxWidth = "max-w-2xl",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  maxWidth?: string;
}) {
  return (
    <Reveal className={`mx-auto ${maxWidth} text-center`}>
      {eyebrow && (
        <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-accent-dim">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-3 text-[clamp(1.9rem,4vw,2.9rem)] font-medium leading-[1.1] tracking-[-0.02em] text-ink">
        {title}
      </h2>
      {description && (
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-[1.7] text-ink/60">
          {description}
        </p>
      )}
    </Reveal>
  );
}

export type FlowStep = { label: string; icon?: LucideIcon; sublabels?: string[] };

export function FlowSteps({ steps, vertical = false }: { steps: FlowStep[]; vertical?: boolean }) {
  return (
    <Reveal
      className={`mx-auto flex max-w-4xl items-stretch gap-3 ${
        vertical
          ? "flex-col items-center"
          : "flex-col sm:flex-row sm:items-center sm:justify-center"
      }`}
    >
      {steps.map((step, i) => (
        <div
          key={step.label}
          className={`flex flex-col items-center gap-3 ${vertical ? "" : "sm:flex-row"}`}
        >
          <div className="glass-light flex w-full flex-col items-center gap-2 rounded-2xl px-5 py-4 text-center sm:w-auto sm:min-w-36">
            {step.icon && (
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent">
                <step.icon className="h-4 w-4" />
              </span>
            )}
            <span className="text-[12.5px] font-semibold uppercase tracking-[0.06em] text-ink/75">
              {step.label}
            </span>
            {step.sublabels && (
              <ul className="mt-0.5 flex flex-col gap-0.5">
                {step.sublabels.map((s) => (
                  <li key={s} className="text-[11.5px] text-ink/50">
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {i < steps.length - 1 && (
            <ArrowRight
              className={`h-4 w-4 shrink-0 text-ink/30 ${vertical ? "rotate-90" : "rotate-90 sm:rotate-0"}`}
              aria-hidden="true"
            />
          )}
        </div>
      ))}
    </Reveal>
  );
}

export function IconGrid({
  items,
  columns = "sm:grid-cols-2 lg:grid-cols-3",
}: {
  items: { icon: LucideIcon; title: string; description: string }[];
  columns?: string;
}) {
  return (
    <div className={`grid grid-cols-1 gap-5 ${columns}`}>
      {items.map((item, i) => (
        <Reveal key={item.title} delay={i * 70}>
          <div className="glass-light flex h-full flex-col gap-3 rounded-2xl p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <item.icon className="h-5 w-5" />
            </span>
            <h3 className="text-[15.5px] font-medium text-ink">{item.title}</h3>
            <p className="text-[13.5px] leading-relaxed text-ink/55">{item.description}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export function NumberedSteps({
  steps,
}: {
  steps: { index: string; title: string; description: string; tag?: string }[];
}) {
  return (
    <div className="mx-auto flex max-w-lg flex-col">
      {steps.map((step, i) => (
        <Reveal key={step.index} delay={i * 90}>
          <div className="flex gap-5">
            <div className="flex flex-col items-center">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 font-mono text-[13px] font-semibold text-accent-dim">
                {step.index}
              </span>
              {i < steps.length - 1 && <span className="mt-1 w-px flex-1 bg-ink/10" />}
            </div>
            <div className={i < steps.length - 1 ? "pb-9" : ""}>
              <h3 className="text-[17px] font-medium text-ink">{step.title}</h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-ink/55">{step.description}</p>
              {step.tag && (
                <span className="mt-3 inline-flex rounded-full bg-cream px-3 py-1 text-[11.5px] font-semibold text-ink/60">
                  {step.tag}
                </span>
              )}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export function CheckList({
  items,
  columns = "sm:grid-cols-2",
}: {
  items: string[];
  columns?: string;
}) {
  return (
    <div className={`grid grid-cols-1 gap-x-8 gap-y-3 ${columns}`}>
      {items.map((item) => (
        <div key={item} className="flex items-center gap-2.5 text-[14.5px] text-ink/70">
          <Check className="h-4 w-4 shrink-0 text-accent" />
          {item}
        </div>
      ))}
    </div>
  );
}

/** For simple branching diagrams (a root connecting to 2-4 child nodes, each with optional sub-items). */
export function BranchDiagram({
  root,
  branches,
}: {
  root: { label: string; icon?: LucideIcon };
  branches: { label: string; icon?: LucideIcon; items?: string[] }[];
}) {
  return (
    <Reveal className="mx-auto flex max-w-4xl flex-col items-center gap-3">
      <div className="glass-light flex items-center gap-2 rounded-2xl px-5 py-3">
        {root.icon && <root.icon className="h-4 w-4 text-accent" />}
        <span className="text-[12.5px] font-semibold uppercase tracking-[0.06em] text-ink/75">
          {root.label}
        </span>
      </div>
      <div className="h-6 w-px bg-ink/15" aria-hidden="true" />
      <div className="flex flex-wrap justify-center gap-4">
        {branches.map((b) => (
          <div
            key={b.label}
            className="glass-light flex min-w-40 flex-col items-center gap-2 rounded-2xl px-5 py-4 text-center"
          >
            {b.icon && (
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent">
                <b.icon className="h-4 w-4" />
              </span>
            )}
            <span className="text-[12.5px] font-semibold uppercase tracking-[0.06em] text-ink/75">
              {b.label}
            </span>
            {b.items && (
              <ul className="mt-0.5 flex flex-col gap-0.5">
                {b.items.map((i) => (
                  <li key={i} className="text-[11.5px] text-ink/50">
                    {i}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </Reveal>
  );
}

export function EnablesList({
  items,
  columns = "sm:grid-cols-2",
}: {
  items: { label: string; description?: string }[];
  columns?: string;
}) {
  return (
    <div className={`grid grid-cols-1 gap-x-8 gap-y-4 ${columns}`}>
      {items.map((item) => (
        <div key={item.label} className="flex items-start gap-2.5">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          <div>
            <span className="text-[14.5px] font-medium text-ink">{item.label}</span>
            {item.description && (
              <p className="mt-0.5 text-[13px] leading-relaxed text-ink/55">{item.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Statement({ children }: { children: ReactNode }) {
  return (
    <p className="mx-auto max-w-xl text-center text-[17px] font-medium leading-snug text-ink">
      {children}
    </p>
  );
}

export function DetailCta({
  title,
  description,
  primary,
  secondary,
}: {
  title: string;
  description: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-white to-cream px-6 py-24 md:py-28">
      <SectionGlow strong flip />
      <Reveal className="glass-panel relative mx-auto max-w-2xl rounded-[2.5rem] px-8 py-14 text-center sm:px-16">
        <h2 className="text-[clamp(2rem,4.5vw,3.2rem)] font-medium leading-[1.1] tracking-[-0.02em] text-ink">
          {title}
        </h2>
        <p className="mx-auto mt-5 max-w-md text-[15.5px] leading-[1.6] text-ink/60">
          {description}
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={primary.href}
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-accent px-7 text-[14px] font-semibold text-navy transition-colors hover:bg-teal"
          >
            {primary.label}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          {secondary && (
            <Link
              href={secondary.href}
              className="inline-flex h-12 items-center rounded-full border border-ink/15 px-6 text-[14px] font-medium text-ink/80 transition-colors hover:border-ink/30 hover:text-ink"
            >
              {secondary.label}
            </Link>
          )}
        </div>
      </Reveal>
    </section>
  );
}
