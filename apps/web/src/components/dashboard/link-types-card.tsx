"use client";

import { useEffect, useState, useTransition } from "react";
import { Plus, Trash2, Package, Link2, Share2, Tag } from "lucide-react";
import {
  getCompanyLinkTypesAction,
  createCompanyLinkTypeAction,
  deleteCompanyLinkTypeAction,
} from "@/lib/dashboard/actions";

interface LinkType {
  id: string;
  label: string;
  prefix: string;
  icon: string | null;
  isActive: boolean;
}

// Built-in surfaces, shown read-only for reference so users see the full set
// of QR link types alongside their custom ones.
const BUILTINS = [
  { label: "On Pack", prefix: "p", Icon: Package },
  { label: "Link", prefix: "l", Icon: Link2 },
  { label: "Social", prefix: "s", Icon: Share2 },
];

export function LinkTypesCard() {
  const [items, setItems] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [label, setLabel] = useState("");
  const [prefix, setPrefix] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const load = () => {
    getCompanyLinkTypesAction().then((res) => {
      if ("items" in res && res.items) setItems(res.items);
      setLoading(false);
    });
  };

  useEffect(load, []);

  // The slashes are shown as fixed decoration, so the user types only the word.
  // Strip anything that isn't a valid prefix char (slashes, spaces, uppercase)
  // so pasting "/r/" still yields "r".
  const sanitizePrefix = (v: string) => v.toLowerCase().replace(/[^a-z0-9-]/g, "");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await createCompanyLinkTypeAction({ label, prefix });
      if ("error" in res && res.error) {
        setError(res.error);
        return;
      }
      setLabel("");
      setPrefix("");
      load();
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteCompanyLinkTypeAction(id);
      if ("error" in res && res.error) {
        setError(res.error);
        return;
      }
      load();
    });
  };

  const inputCls =
    "w-full px-4 py-2.5 rounded-lg border border-(--ds-border) bg-(--ds-surface-2) text-[14px] outline-none focus:border-(--ds-text-secondary)";

  return (
    <div className="bg-(--ds-surface) border border-(--ds-border) rounded-xl p-8">
      <h3 className="text-lg font-semibold text-(--ds-text-primary) mb-1 tracking-tight">QR Link Types</h3>
      <p className="text-[13px] text-(--ds-text-secondary) mb-6">
        Add custom link types for your QR codes. Each one generates codes that resolve to{" "}
        <code className="px-1 py-0.5 rounded bg-(--ds-surface-2) text-[12px]">/&lt;prefix&gt;/&lt;code&gt;</code>{" "}
        — just like the built-in types — and is tracked separately in analytics. The code is the same product code across every link type.
      </p>

      <div className="space-y-2 mb-6">
        {BUILTINS.map((b) => (
          <div
            key={b.prefix}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-(--ds-border) bg-(--ds-surface-2)"
          >
            <b.Icon size={16} className="text-(--ds-text-secondary)" />
            <span className="text-[14px] font-medium text-(--ds-text-primary)">{b.label}</span>
            <span className="text-[12px] font-mono text-(--ds-text-secondary)">/{b.prefix}/&lt;code&gt;</span>
            <span className="ml-auto text-[11px] uppercase tracking-tight text-(--ds-text-secondary)">Built-in</span>
          </div>
        ))}

        {loading ? (
          <div className="skeleton-row h-[44px] rounded-lg" />
        ) : (
          items.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-(--ds-border)"
            >
              <Tag size={16} className="text-(--ds-text-secondary)" />
              <span className="text-[14px] font-medium text-(--ds-text-primary)">{t.label}</span>
              <span className="text-[12px] font-mono text-(--ds-text-secondary)">/{t.prefix}/&lt;code&gt;</span>
              <button
                onClick={() => handleDelete(t.id)}
                disabled={isPending}
                className="ml-auto w-8 h-8 rounded-lg flex items-center justify-center text-(--ds-text-secondary) hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                title={`Delete ${t.label}`}
                aria-label={`Delete ${t.label}`}
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3 sm:items-end">
        <div className="flex-1">
          <label htmlFor="lt-label" className="block text-[13px] font-medium text-(--ds-text-secondary) mb-2">
            Label
          </label>
          <input
            id="lt-label"
            className={inputCls}
            placeholder="e.g. Promo"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            maxLength={60}
            required
            disabled={isPending}
          />
        </div>
        <div className="flex-1">
          <label htmlFor="lt-prefix" className="block text-[13px] font-medium text-(--ds-text-secondary) mb-2">
            URL prefix
          </label>
          <div className="flex items-center rounded-lg border border-(--ds-border) bg-(--ds-surface-2) px-3 focus-within:border-(--ds-text-secondary)">
            <span className="text-[14px] font-mono text-(--ds-text-secondary) select-none">/</span>
            <input
              id="lt-prefix"
              className="flex-1 min-w-0 bg-transparent py-2.5 px-0.5 text-[14px] font-mono outline-none text-(--ds-text-primary)"
              placeholder="r"
              value={prefix}
              onChange={(e) => setPrefix(sanitizePrefix(e.target.value))}
              maxLength={40}
              required
              disabled={isPending}
            />
            <span className="text-[14px] font-mono text-(--ds-text-secondary) select-none whitespace-nowrap">/&lt;code&gt;</span>
          </div>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg bg-(--ds-text-primary) text-(--ds-surface) text-[14px] font-semibold disabled:opacity-60 shrink-0"
        >
          <Plus size={16} />
          {isPending ? "Saving…" : "Add type"}
        </button>
      </form>

      {error && (
        <div className="mt-3 text-[13px] text-red-600 dark:text-red-400" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
