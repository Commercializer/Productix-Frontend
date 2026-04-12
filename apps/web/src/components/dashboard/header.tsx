"use client";

import { useTheme } from "next-themes";
import { Search, Moon, Sun, Bell } from "lucide-react";
import { useEffect, useState } from "react";

export function DashboardHeader() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="flex items-center justify-between mb-8">
      <h1 className="text-xl font-bold text-[var(--ds-text-primary)] m-0">Home</h1>
      <div className="flex items-center gap-6 text-[var(--ds-text-muted)]">
        <button className="hover:text-[var(--ds-text-primary)] transition-colors">
          <Search size={20} strokeWidth={2} />
        </button>
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="hover:text-[var(--ds-text-primary)] transition-colors"
          >
            {theme === "dark" ? <Sun size={20} strokeWidth={2} /> : <Moon size={20} strokeWidth={2} />}
          </button>
        )}
        <button className="hover:text-[var(--ds-text-primary)] transition-colors">
          <Bell size={20} strokeWidth={2} />
        </button>
      </div>
    </header>
  );
}
