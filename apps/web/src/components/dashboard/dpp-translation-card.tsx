"use client";

import { useEffect, useState, useTransition } from "react";
import { Globe } from "lucide-react";
import { getCompanySettingsAction, updateDppTranslationVisibilityAction } from "@/lib/dashboard/actions";

/** Company-wide toggle for the DPP passport's language picker - mirrors DppVersionHistoryCard. */
export function DppTranslationCard() {
  const [showDppTranslation, setShowDppTranslation] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getCompanySettingsAction().then((res) => {
      if (res.success && res.company) setShowDppTranslation(res.company.showDppTranslation);
      setLoading(false);
    });
  }, []);

  const handleToggle = () => {
    const next = !showDppTranslation;
    setError(null);
    setShowDppTranslation(next);
    startTransition(async () => {
      const res = await updateDppTranslationVisibilityAction(next);
      if ("error" in res && res.error) {
        setShowDppTranslation(!next);
        setError(res.error);
      }
    });
  };

  return (
    <div className="bg-(--ds-surface) border border-(--ds-border) rounded-xl p-8">
      <h3 className="text-lg font-semibold text-(--ds-text-primary) mb-1 tracking-tight">DPP Translation</h3>
      <p className="text-[13px] text-(--ds-text-secondary) mb-6">
        Controls whether the public passport page (/01/&#123;gtin&#125;) shows a language picker that machine-translates
        DPP terms - section titles, field labels, and static copy - via Google Translate. Your product data (names,
        descriptions, and every value entered for the passport) is never translated, whether this is on or off.
      </p>

      {loading ? (
        <div className="skeleton-row h-[60px] rounded-lg" />
      ) : (
        <button
          onClick={handleToggle}
          disabled={isPending}
          className="w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-lg border border-(--ds-border) bg-(--ds-surface-2) text-left transition-colors disabled:opacity-60"
        >
          <span className="flex items-center gap-3">
            <Globe size={18} className="text-(--ds-text-secondary) shrink-0" />
            <span>
              <span className="block text-[14px] font-medium text-(--ds-text-primary)">
                Show language picker on the public passport
              </span>
              <span className="block text-[12px] text-(--ds-text-secondary) mt-0.5">
                When off, the public passport page hides the language picker and only shows the original text.
              </span>
            </span>
          </span>
          <span
            className={`inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
              showDppTranslation ? "bg-(--ds-accent)" : "bg-[#cbd5e1] dark:bg-[#475569]"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                showDppTranslation ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </span>
        </button>
      )}

      {error && (
        <div className="mt-3 text-[13px] text-red-600 dark:text-red-400" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
