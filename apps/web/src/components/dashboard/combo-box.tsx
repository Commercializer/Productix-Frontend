"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Loader2, Plus } from "lucide-react";

export interface ComboBoxOption {
  id: string;
  label: string;
}

interface ComboBoxProps {
  options: ComboBoxOption[];
  value: string | null;
  onChange: (id: string | null) => void;
  onCreate?: (name: string) => Promise<ComboBoxOption | null>;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  emptyHint?: string;
  icon?: React.ReactNode;
}

export function ComboBox({
  options,
  value,
  onChange,
  onCreate,
  placeholder = "Select…",
  disabled = false,
  loading = false,
  emptyHint = "No matches",
  icon,
}: ComboBoxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  const selected = useMemo(() => options.find((o) => o.id === value) ?? null, [options, value]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  const canCreate =
    !!onCreate &&
    query.trim().length > 0 &&
    !options.some((o) => o.label.toLowerCase() === query.trim().toLowerCase());

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setCreateError(null);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const handleCreate = async () => {
    if (!onCreate) return;
    const name = query.trim();
    if (!name) return;
    setCreating(true);
    setCreateError(null);
    try {
      const item = await onCreate(name);
      if (item) {
        onChange(item.id);
        setOpen(false);
        setQuery("");
      } else {
        setCreateError("Could not create. Try again.");
      }
    } catch (err: any) {
      setCreateError(err?.message ?? "Could not create. Try again.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setOpen((v) => !v)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        className="w-full h-[44px] pl-3.5 pr-10 rounded-xl border border-(--ds-border) bg-(--ds-bg) text-[14px] text-left text-(--ds-text-primary) focus:outline-hidden focus:ring-2 focus:ring-[#0284c7]/20 focus:border-[#0284c7] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {icon && <span className="text-(--ds-text-muted) shrink-0">{icon}</span>}
        <span className={selected ? "" : "text-(--ds-text-muted)"}>
          {loading ? "Loading…" : selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`ml-auto text-(--ds-text-muted) transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full rounded-xl border border-(--ds-border) bg-(--ds-surface) shadow-lg overflow-hidden">
          <div className="p-2 border-b border-(--ds-border)">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canCreate && !creating) {
                  e.preventDefault();
                  handleCreate();
                } else if (e.key === "Escape") {
                  setOpen(false);
                }
              }}
              placeholder="Search or add new…"
              className="w-full h-[36px] px-3 rounded-lg border border-(--ds-border) bg-(--ds-bg) text-[13px] text-(--ds-text-primary) placeholder-(--ds-text-muted) focus:outline-hidden focus:ring-2 focus:ring-[#0284c7]/20 focus:border-[#0284c7]"
            />
          </div>

          <ul id={listboxId} role="listbox" className="max-h-56 overflow-y-auto py-1">
            {value && (
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onChange(null);
                    setOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-[12px] text-(--ds-text-muted) hover:bg-(--ds-bg)"
                >
                  Clear selection
                </button>
              </li>
            )}
            {filtered.length === 0 && !canCreate && (
              <li className="px-3 py-2 text-[13px] text-(--ds-text-muted)">{emptyHint}</li>
            )}
            {filtered.map((opt) => {
              const isSelected = opt.id === value;
              return (
                <li key={opt.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(opt.id);
                      setOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-[13px] flex items-center gap-2 hover:bg-(--ds-bg) ${
                      isSelected ? "text-[#0284c7] font-medium" : "text-(--ds-text-primary)"
                    }`}
                  >
                    <Check size={14} className={isSelected ? "opacity-100" : "opacity-0"} />
                    <span className="truncate">{opt.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {canCreate && (
            <div className="border-t border-(--ds-border) p-2">
              <button
                type="button"
                disabled={creating}
                onClick={handleCreate}
                className="w-full h-[36px] px-3 rounded-lg bg-[#bae6fd] hover:bg-[#7dd3fc] text-[#0284c7] font-medium text-[13px] flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Plus size={14} />
                )}
                Add &ldquo;{query.trim()}&rdquo;
              </button>
              {createError && (
                <p className="mt-1.5 text-[11px] text-red-500">{createError}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
