"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Home,
  Package,
  BarChart2,
  Mail,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

const navItems = [
  { href: "/dashboard", label: "Home", icon: <Home size={22} strokeWidth={1.25} /> },
  { href: "/dashboard/products", label: "Products", icon: <Package size={22} strokeWidth={1.25} /> },
  { href: "/dashboard/analytics", label: "Analytics", icon: <BarChart2 size={22} strokeWidth={1.25} /> },
  { href: "/dashboard/messages", label: "Messages", icon: <Mail size={22} strokeWidth={1.25} /> },
  { href: "/dashboard/settings", label: "Settings", icon: <Settings size={22} strokeWidth={1.25} /> },
];

const STORAGE_KEY = "productix.dashboard.sidebar.expanded";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored !== null) setExpanded(stored === "true");
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, String(expanded));
    } catch {}
  }, [expanded, hydrated]);

  return (
    <aside
      className="sidebar"
      data-expanded={expanded ? "true" : "false"}
      style={{ width: expanded ? 240 : undefined }}
    >
      {/* Top Logo */}
      <div
        className={`hidden md:flex w-full mb-8 items-center ${
          expanded ? "justify-start pl-6 pr-3" : "justify-center px-3"
        }`}
      >
        {expanded ? (
          <Link href="/dashboard" className="flex items-center justify-start min-w-0">
            <Image
              src="/logo-light.png"
              alt="Productix"
              width={2060}
              height={372}
              className="block dark:hidden h-7 w-auto"
              priority
            />
            <Image
              src="/logo-dark.png"
              alt="Productix"
              width={2060}
              height={372}
              className="hidden dark:block h-7 w-auto"
              priority
            />
          </Link>
        ) : (
          <Link href="/dashboard" className="flex items-center justify-center">
            <Image
              src="/productix-logo.png"
              alt="Productix"
              width={20}
              height={19}
              priority
            />
          </Link>
        )}
      </div>

      {/* Collapse toggle — sits on the right divider line */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
        title={expanded ? "Collapse sidebar" : "Expand sidebar"}
        className="hidden md:flex absolute top-7 -right-3 z-10 w-6 h-6 rounded-full items-center justify-center bg-(--ds-bg) border border-(--ds-border) text-(--ds-text-secondary) hover:text-(--ds-text-primary) hover:border-(--ds-text-secondary) shadow-sm transition-colors"
      >
        {expanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      {/* Navigation */}
      <nav
        className={`flex flex-row md:flex-col gap-2 md:gap-2 flex-1 w-full overflow-x-auto no-scrollbar md:overflow-visible ${
          expanded ? "md:px-3 md:items-stretch" : "md:items-center"
        }`}
      >
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 rounded-[12px] flex items-center transition-colors ${
                expanded
                  ? "md:w-full md:h-[44px] md:px-3 md:gap-3 md:justify-start w-[40px] h-[40px] justify-center"
                  : "w-[40px] h-[40px] md:w-[44px] md:h-[44px] justify-center"
              } ${
                isActive
                  ? "bg-white text-[#0284c7] shadow-xs"
                  : "text-(--ds-text-secondary) hover:bg-black/5 hover:text-(--ds-text-primary) dark:hover:bg-white/5"
              }`}
              title={item.label}
            >
              <span className="shrink-0 flex items-center justify-center w-[24px] h-[24px]">
                {item.icon}
              </span>
              {expanded && (
                <span className="hidden md:inline text-sm font-medium truncate">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div
        className={`flex flex-row md:flex-col gap-2 md:gap-3 md:mt-auto pt-0 md:pt-4 ml-auto md:ml-0 md:pb-4 pl-2 md:pl-0 border-l md:border-l-0 md:border-t border-(--ds-border) ${
          expanded ? "md:px-3 md:items-stretch" : "items-center"
        }`}
      >
        <button
          onClick={signOut}
          className={`shrink-0 rounded-[12px] flex items-center transition-colors text-(--ds-text-secondary) hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 ${
            expanded
              ? "md:w-full md:h-[44px] md:px-3 md:gap-3 md:justify-start w-[40px] h-[40px] justify-center"
              : "w-[40px] h-[40px] md:w-[44px] md:h-[44px] justify-center"
          }`}
          title="Sign out"
          id="dashboard-logout-btn"
        >
          <span className="shrink-0 flex items-center justify-center w-[24px] h-[24px]">
            <LogOut size={22} strokeWidth={1.25} />
          </span>
          {expanded && (
            <span className="hidden md:inline text-sm font-medium">Sign out</span>
          )}
        </button>
        {!expanded && (
          <Image
            src="/productix-logo.png"
            alt="Productix"
            width={20}
            height={19}
            className="hidden md:block"
            priority
          />
        )}
      </div>
    </aside>
  );
}
