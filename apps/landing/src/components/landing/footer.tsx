import Image from "next/image";
import Link from "next/link";

import { EmailSignup } from "./email-signup";

const COLUMNS = [
  {
    title: "Platform",
    links: [
      ["Platform", "#platform"],
      ["Industries", "#industries"],
      ["Security", "#security"],
    ] as const,
  },
  {
    title: "Company",
    links: [
      ["Book a demo", "#demo"],
      ["Talk to sales", "#sales"],
    ] as const,
  },
];

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-white py-14">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-10 border-b border-ink/10 pb-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[19px] font-medium text-ink">
              Sign up for product updates and insights.
            </h2>
            <p className="mt-1.5 text-[13.5px] text-ink/50">
              Occasional notes on connected packaging and product data.
            </p>
          </div>
          <EmailSignup />
        </div>

        <div className="grid grid-cols-2 gap-10 pt-10 sm:grid-cols-4">
          <div className="col-span-2">
            <Image
              src="/logo-light.png"
              alt="Productix"
              width={160}
              height={36}
              className="h-8 w-auto select-none"
            />
            <p className="mt-5 max-w-xs text-[13.5px] leading-relaxed text-ink/50">
              Product experience infrastructure for modern consumer brands.
            </p>
            <p className="mt-4 max-w-xs text-[12px] italic leading-relaxed text-ink/45">
              Productix is part of the{" "}
              <a
                href="https://commercializer.com"
                className="underline decoration-ink/20 underline-offset-2 transition-colors hover:text-ink hover:decoration-ink/60"
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
                      className="text-[13.5px] text-ink/65 transition-colors hover:text-ink"
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
            Enterprise-grade. Globally scalable. Built for brands at scale.
          </p>
        </div>
      </div>
    </footer>
  );
}
