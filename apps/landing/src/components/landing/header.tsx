"use client";

import { ArrowRight, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Platform", href: "#platform" },
  { label: "Industries", href: "#industries" },
  { label: "Security", href: "#security" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="fixed inset-x-0 top-4 z-50 px-4 sm:px-6">
      <header className="mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full border border-ink/5 bg-white pl-5 pr-1.5 shadow-[0_12px_32px_-12px_rgba(10,17,32,0.18)]">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Image
            src="/logo-light.png"
            alt="Productix"
            width={128}
            height={28}
            priority
            className="h-6 w-auto select-none"
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-[13.5px] font-medium text-ink/65 transition-colors hover:bg-ink/5 hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <Link
          href="#demo"
          className="group hidden h-11 items-center gap-3 rounded-full bg-ink pl-5 pr-1.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-navy-deep lg:inline-flex"
        >
          Book a demo
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-transform group-hover:translate-x-0.5">
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-full text-ink/70 lg:hidden"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {menuOpen && (
        <div className="mx-auto mt-2 max-w-6xl rounded-3xl border border-ink/5 bg-white px-6 py-5 shadow-[0_12px_32px_-12px_rgba(10,17,32,0.18)] lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-3 py-2.5 text-[15px] font-medium text-ink/75"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <Link
            href="#demo"
            onClick={() => setMenuOpen(false)}
            className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-full bg-ink text-[14px] font-semibold text-white"
          >
            Book a demo
          </Link>
        </div>
      )}
    </div>
  );
}
