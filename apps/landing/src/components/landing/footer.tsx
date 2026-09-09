import Image from "next/image";
import Link from "next/link";

import { INDUSTRY_GROUPS } from "@/content/industries";
import { PLATFORM_PILLARS } from "@/content/platform";
import { SOLUTIONS } from "@/content/solutions";

import { EmailSignup } from "./email-signup";

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
    <footer className="bg-navy py-14">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-10 border-b border-white/10 pb-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[19px] font-medium text-white">
              Sign up for product updates and insights.
            </h2>
            <p className="mt-1.5 text-[13.5px] text-white/50">
              Occasional notes on connected products, compliance and digital identity.
            </p>
          </div>
          <EmailSignup variant="dark" />
        </div>

        <div className="grid grid-cols-2 gap-10 pt-10 sm:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2">
            <Image
              src="/logo-dark.png"
              alt="Productix"
              width={160}
              height={36}
              className="h-8 w-auto select-none"
            />
            <p className="mt-5 max-w-xs text-[13.5px] leading-relaxed text-white/50">
              Connected product infrastructure for identity, compliance,
              experience and intelligence.
            </p>
            <p className="mt-4 max-w-xs text-[12px] italic leading-relaxed text-white/35">
              Productix is part of the{" "}
              <a
                href="https://commercializer.com"
                className="underline decoration-white/20 underline-offset-2 transition-colors hover:text-white hover:decoration-white/60"
              >
                Commercializer
              </a>{" "}
              enterprise technology portfolio.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">
                {col.title}
              </div>
              <ul className="mt-4 space-y-2.5">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-[13.5px] text-white/65 transition-colors hover:text-white"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <p className="text-[12px] text-white/45">
            &copy; {new Date().getFullYear()} Productix. Connected product
            infrastructure.
          </p>
          <p className="text-[12px] text-white/45">
            Built on GS1 standards. DPP &amp; PPWR aligned.
          </p>
        </div>
      </div>
    </footer>
  );
}
