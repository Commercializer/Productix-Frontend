"use client";

// Type-to-filter dropdown for long plain-string option lists (e.g. the DPP
// form's ~60-country list) - a native <select> makes you scroll/type-jump
// through the whole thing. Mirrors icon-select.tsx's open/close pattern but
// adds a search input instead of icons.
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

interface SearchableSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "— Select —",
  searchPlaceholder = "Search…",
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    const id = requestAnimationFrame(() => searchRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  const filtered = query.trim()
    ? options.filter((o) => o.toLowerCase().includes(query.trim().toLowerCase()))
    : options;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full h-[38px] px-3 rounded-lg border border-(--ds-border) bg-(--ds-bg) text-[13px] text-left text-(--ds-text-primary) focus:outline-hidden focus:ring-2 focus:ring-[#0284c7]/20 focus:border-[#0284c7] transition-all flex items-center gap-2"
      >
        <span className={`flex-1 truncate ${value ? "" : "text-(--ds-text-muted)"}`}>{value || placeholder}</span>
        <ChevronDown size={14} className={`text-(--ds-text-muted) transition-transform shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full rounded-lg border border-(--ds-border) bg-(--ds-surface) shadow-lg overflow-hidden">
          <div className="p-1.5 border-b border-(--ds-border) relative">
            <Search size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-(--ds-text-muted) pointer-events-none" />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full h-[28px] pl-6 pr-2 rounded-md border border-(--ds-border) bg-(--ds-bg) text-[12px] text-(--ds-text-primary) focus:outline-hidden"
            />
          </div>
          <ul role="listbox" className="max-h-52 overflow-y-auto py-1">
            {value && (
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onChange("");
                    setOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-[12px] italic text-(--ds-text-muted) hover:bg-(--ds-bg)"
                >
                  Clear selection
                </button>
              </li>
            )}
            {filtered.length === 0 && <li className="px-3 py-2 text-[12px] text-(--ds-text-muted)">No matches</li>}
            {filtered.map((opt) => {
              const isSelected = opt === value;
              return (
                <li key={opt}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(opt);
                      setOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-[13px] flex items-center gap-2 hover:bg-(--ds-bg) ${
                      isSelected ? "text-[#0284c7] font-medium" : "text-(--ds-text-primary)"
                    }`}
                  >
                    <span className="flex-1 truncate">{opt}</span>
                    <Check size={13} className={isSelected ? "opacity-100" : "opacity-0"} />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
