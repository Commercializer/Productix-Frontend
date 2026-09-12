"use client";

import { ArrowRight, ChevronDown, LayoutGrid, Menu, X, type LucideIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { INDUSTRIES } from "@/content/industries";
import { PLATFORM_PILLARS } from "@/content/platform";
import { SOLUTIONS } from "@/content/solutions";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "/dashboard";

type MenuItem = { label: string; description?: string; href: string; icon?: LucideIcon };
type NavEntry =
  | { label: string; href: string }
  | { label: string; items: MenuItem[]; footerHref?: string; footerLabel?: string };

const NAV: NavEntry[] = [
  {
    label: "Platform",
    items: PLATFORM_PILLARS.map((p) => ({
      label: p.name,
      description: p.title,
      href: `/platform/${p.slug}`,
      icon: p.icon,
    })),
  },
  {
    label: "Solutions",
    items: SOLUTIONS.map((s) => ({
      label: s.name,
      description: s.title,
      href: `/solutions/${s.slug}`,
      icon: s.icon,
    })),
  },
  {
    label: "Industries",
    items: INDUSTRIES.map((i) => ({ label: i.name, href: `/industries/${i.slug}`, icon: i.icon })),
    footerHref: "/industries",
    footerLabel: "View all industries",
  },
  { label: "Resources", href: "/insights" },
  {
    label: "Company",
    items: [
      { label: "About", href: "/company/about" },
      { label: "Partners", href: "/company/partners" },
      { label: "Contact", href: "/company/contact" },
    ],
  },
];

function isMega(entry: NavEntry): entry is Extract<NavEntry, { items: MenuItem[] }> {
  return "items" in entry;
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDesktopMenu, setOpenDesktopMenu] = useState<string | null>(null);
  const [openMobileMenu, setOpenMobileMenu] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpenDesktopMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const activeEntry = NAV.find((e) => e.label === openDesktopMenu);

  return (
    <div ref={rootRef} className="fixed inset-x-0 top-4 z-50 px-4 sm:px-6">
      <header className="glass-light mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full pl-5 pr-1.5">
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
          {NAV.map((entry) =>
            isMega(entry) ? (
              <button
                key={entry.label}
                type="button"
                onClick={() => setOpenDesktopMenu((v) => (v === entry.label ? null : entry.label))}
                aria-expanded={openDesktopMenu === entry.label}
                className="flex items-center gap-1 rounded-full px-3.5 py-2 text-[13.5px] font-medium text-ink/65 transition-colors hover:bg-ink/5 hover:text-ink"
              >
                {entry.label}
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${openDesktopMenu === entry.label ? "rotate-180" : ""}`}
                />
              </button>
            ) : (
              <Link
                key={entry.label}
                href={entry.href}
                className="rounded-full px-3.5 py-2 text-[13.5px] font-medium text-ink/65 transition-colors hover:bg-ink/5 hover:text-ink"
              >
                {entry.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <a
            href={APP_URL}
            className="inline-flex h-11 items-center rounded-full px-4 text-[13.5px] font-medium text-ink/70 transition-colors hover:text-ink"
          >
            Dashboard
          </a>
          <Link
            href="/book-a-demo"
            className="group inline-flex h-11 items-center gap-3 rounded-full bg-accent pl-5 pr-1.5 text-[13.5px] font-semibold text-navy transition-colors hover:bg-teal"
          >
            Book a demo
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy/15 transition-transform group-hover:translate-x-0.5">
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>

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

      {/* Desktop mega-menu panel */}
      <AnimatePresence>
        {activeEntry && isMega(activeEntry) && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-2 hidden max-w-6xl rounded-3xl border border-ink/5 bg-white p-6 shadow-[0_20px_50px_-20px_rgba(10,17,32,0.25)] lg:block"
          >
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 xl:grid-cols-3">
              {activeEntry.items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpenDesktopMenu(null)}
                  className="group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-ink/5"
                >
                  {item.icon && (
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <item.icon className="h-4 w-4" />
                    </span>
                  )}
                  <span>
                    <span className="block text-[13.5px] font-medium text-ink">{item.label}</span>
                    {item.description && (
                      <span className="mt-0.5 block text-[12px] leading-snug text-ink/50">
                        {item.description}
                      </span>
                    )}
                  </span>
                </Link>
              ))}
            </div>
            {activeEntry.footerHref && (
              <Link
                href={activeEntry.footerHref}
                onClick={() => setOpenDesktopMenu(null)}
                className="mt-3 inline-flex items-center gap-1.5 border-t border-ink/10 pt-4 text-[13px] font-medium text-accent-dim"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                {activeEntry.footerLabel}
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile sheet */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="mx-auto mt-2 max-h-[75vh] max-w-6xl overflow-y-auto rounded-3xl border border-ink/5 bg-white px-6 py-5 shadow-[0_12px_32px_-12px_rgba(10,17,32,0.18)] lg:hidden"
          >
            <nav className="flex flex-col gap-1">
              {NAV.map((entry) =>
                isMega(entry) ? (
                  <div key={entry.label}>
                    <button
                      type="button"
                      onClick={() => setOpenMobileMenu((v) => (v === entry.label ? null : entry.label))}
                      className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-[15px] font-medium text-ink/75"
                    >
                      {entry.label}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${openMobileMenu === entry.label ? "rotate-180" : ""}`}
                      />
                    </button>
                    {openMobileMenu === entry.label && (
                      <div className="ml-3 flex flex-col gap-1 border-l border-ink/10 pl-3">
                        {entry.items.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setMenuOpen(false)}
                            className="rounded-md px-3 py-2 text-[14px] text-ink/65"
                          >
                            {item.label}
                          </Link>
                        ))}
                        {entry.footerHref && (
                          <Link
                            href={entry.footerHref}
                            onClick={() => setMenuOpen(false)}
                            className="rounded-md px-3 py-2 text-[13px] font-medium text-accent-dim"
                          >
                            {entry.footerLabel}
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={entry.label}
                    href={entry.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-md px-3 py-2.5 text-[15px] font-medium text-ink/75"
                  >
                    {entry.label}
                  </Link>
                ),
              )}
            </nav>
            <div className="mt-4 flex flex-col gap-2">
              <a
                href={APP_URL}
                onClick={() => setMenuOpen(false)}
                className="inline-flex h-11 w-full items-center justify-center rounded-full border border-ink/15 text-[14px] font-medium text-ink/75"
              >
                Dashboard
              </a>
              <Link
                href="/book-a-demo"
                onClick={() => setMenuOpen(false)}
                className="inline-flex h-11 w-full items-center justify-center rounded-full bg-ink text-[14px] font-semibold text-white"
              >
                Book a demo
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
