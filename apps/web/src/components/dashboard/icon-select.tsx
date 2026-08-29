"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export interface IconSelectOption<T extends string> {
  value: T;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

interface IconSelectProps<T extends string> {
  options: IconSelectOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  placeholder?: string;
  disabled?: boolean;
}

/** Dropdown with a leading icon per option - a plain <select> can't render
 * anything but text inside <option>, so this exists for cases like the DPP
 * sector picker where each choice has its own icon. */
export function IconSelect<T extends string>({
  options,
  value,
  onChange,
  placeholder = "— Select —",
  disabled = false,
}: IconSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const selected = options.find((o) => o.value === value) ?? null;
  const SelectedIcon = selected?.icon;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setOpen((v) => !v)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full h-[44px] pl-3.5 pr-10 rounded-xl border border-(--ds-border) bg-(--ds-bg) text-[14px] text-left text-(--ds-text-primary) focus:outline-hidden focus:ring-2 focus:ring-[#0284c7]/20 focus:border-[#0284c7] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {SelectedIcon && <SelectedIcon size={16} className="text-(--ds-text-muted) shrink-0" />}
        <span className={selected ? "" : "text-(--ds-text-muted)"}>{selected ? selected.label : placeholder}</span>
        <ChevronDown size={16} className={`ml-auto text-(--ds-text-muted) transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full rounded-xl border border-(--ds-border) bg-(--ds-surface) shadow-lg overflow-hidden">
          <ul role="listbox" className="max-h-64 overflow-y-auto py-1">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              const Icon = opt.icon;
              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-[13px] flex items-center gap-2 hover:bg-(--ds-bg) ${
                      isSelected ? "text-[#0284c7] font-medium" : "text-(--ds-text-primary)"
                    }`}
                  >
                    <Icon size={15} className={isSelected ? "text-[#0284c7]" : "text-(--ds-text-muted)"} />
                    <span className="flex-1 truncate">{opt.label}</span>
                    <Check size={14} className={isSelected ? "opacity-100" : "opacity-0"} />
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
