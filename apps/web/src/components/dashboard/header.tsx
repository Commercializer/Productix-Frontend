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
    <header className="flex items-center justify-between mb-10">
      <h1 className="text-[28px] md:text-[32px] font-semibold text-(--ds-text-primary) leading-none tracking-tight m-0">Home</h1>
      <div className="flex items-center gap-5 text-(--ds-text-muted)">
        <button className="hover:text-(--ds-text-primary) transition-colors">
          <Search size={20} strokeWidth={1.8} />
        </button>
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="hover:text-(--ds-text-primary) transition-colors"
          >
            {theme === "dark" ? <Sun size={20} strokeWidth={1.8} /> : <Moon size={20} strokeWidth={1.8} />}
          </button>
        )}
        <button className="hover:text-(--ds-text-primary) transition-colors">
          <Bell size={20} strokeWidth={1.8} />
        </button>
      </div>
    </header>
  );
}
