"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, BarChart2, Mail, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

const navItems = [
  { href: "/dashboard", label: "Home", icon: <Home size={22} strokeWidth={1.8} /> },
  { href: "/dashboard/products", label: "Products", icon: <Package size={22} strokeWidth={1.8} /> },
  { href: "/dashboard/analytics", label: "Analytics", icon: <BarChart2 size={22} strokeWidth={1.8} /> },
  { href: "/dashboard/messages", label: "Messages", icon: <Mail size={22} strokeWidth={1.8} /> },
  { href: "/dashboard/settings", label: "Settings", icon: <Settings size={22} strokeWidth={1.8} /> },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <aside className="sidebar">
      {/* Top Logo */}
      <div className="flex items-center justify-center mb-8">
        <div className="w-[36px] h-[36px] bg-[#0284c7] text-white rounded-[10px] flex items-center justify-center font-bold text-lg">
          W
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col items-center gap-4 flex-1 w-full">
        {navItems.map((item) => {
          // Determine activity, default to Home if just /dashboard
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-[44px] h-[44px] rounded-[12px] flex items-center justify-center transition-colors ${
                isActive
                  ? "bg-white text-[#0284c7] shadow-sm"
                  : "text-[var(--ds-text-secondary)] hover:bg-black/5 hover:text-[var(--ds-text-primary)] dark:hover:bg-white/5"
              }`}
              title={item.label}
            >
              {item.icon}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="flex flex-col items-center gap-3 mt-auto pb-4">
        <button
          onClick={signOut}
          className="w-[44px] h-[44px] rounded-[12px] flex items-center justify-center transition-colors text-[var(--ds-text-secondary)] hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
          title="Sign out"
          id="dashboard-logout-btn"
        >
          <LogOut size={22} strokeWidth={1.8} />
        </button>
        <span className="text-[var(--ds-text-primary)] font-bold text-xl tracking-tighter">
          PX
        </span>
      </div>
    </aside>
  );
}
