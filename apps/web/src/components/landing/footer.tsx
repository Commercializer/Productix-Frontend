import Image from "next/image";
import Link from "next/link";

import { INDUSTRY_GROUPS } from "@/content/industries";
import { PLATFORM_PILLARS } from "@/content/platform";
import { SOLUTIONS } from "@/content/solutions";

import { EmailSignup } from "./email-signup";
import { SectionGlow } from "./section-glow";

const COLUMNS = [
  {
    title: "Platform",
    links: PLATFORM_PILLARS.map((p) => [p.name.replace("Productix ", ""), `/platform/${p.slug}`] as const),
  },
  {
    title: "Solutions",
    links: SOLUTIONS.map((s) => [s.name, `/solutions/${s.slug}`] as const),
  },
  {
    title: "Industries",
    links: INDUSTRY_GROUPS.map(
      (group) => [group, `/industries#${group.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`] as const,
    ),
  },
  {
    title: "Company",
    links: [
      ["About", "/company/about"],
      ["Partners", "/company/partners"],
      ["Contact", "/company/contact"],
      ["Insights", "/insights"],
    ] as const,
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-linear-to-b from-white to-tint py-14">
      <SectionGlow />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="glass-panel flex flex-col gap-8 rounded-3xl p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[19px] font-medium text-ink">
              Sign up for product updates and insights.
            </h2>
            <p className="mt-1.5 text-[13.5px] text-ink/55">
              Occasional notes on connected products, compliance and digital identity.
            </p>
          </div>
          <EmailSignup />
        </div>

        <div className="grid grid-cols-2 gap-10 pt-12 sm:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2">
            <Image
              src="/logo-svg-light.svg"
              alt="Productix"
              width={201}
              height={36}
              className="h-8 w-auto select-none"
            />
            <p className="mt-5 max-w-xs text-[13.5px] leading-relaxed text-ink/55">
              Connected product infrastructure for identity, compliance,
              experience and intelligence.
            </p>
            <p className="mt-4 max-w-xs text-[12px] italic leading-relaxed text-ink/40">
              Productix is part of the{" "}
              <a
                href="https://www.commercializer.global"
                className="underline decoration-ink/20 underline-offset-2 transition-colors hover:text-ink hover:decoration-ink/50"
              >
                Commercializer
              </a>{" "}
              enterprise technology portfolio.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/40">
                {col.title}
              </div>
              <ul className="mt-4 space-y-2.5">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-[13.5px] text-ink/60 transition-colors hover:text-ink"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-ink/10 pt-8 sm:flex-row sm:items-center">
          <p className="text-[12px] text-ink/45">
            &copy; {new Date().getFullYear()} Productix. Connected product
            infrastructure.
          </p>
          <p className="text-[12px] text-ink/45">
            Built on GS1 standards. DPP &amp; PPWR aligned.
          </p>
        </div>
      </div>
    </footer>
  );
}
