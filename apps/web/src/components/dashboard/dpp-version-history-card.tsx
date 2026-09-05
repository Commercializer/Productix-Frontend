"use client";

import { useEffect, useState, useTransition } from "react";
import { History } from "lucide-react";
import { getCompanySettingsAction, updateDppVersionHistoryVisibilityAction } from "@/lib/dashboard/actions";

/** Company-wide toggle for whether DPP version history is shown on the public passport - mirrors GtinPolicyCard. */
export function DppVersionHistoryCard() {
  const [showDppVersionHistory, setShowDppVersionHistory] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getCompanySettingsAction().then((res) => {
      if (res.success && res.company) setShowDppVersionHistory(res.company.showDppVersionHistory);
      setLoading(false);
    });
  }, []);

  const handleToggle = () => {
    const next = !showDppVersionHistory;
    setError(null);
    setShowDppVersionHistory(next);
    startTransition(async () => {
      const res = await updateDppVersionHistoryVisibilityAction(next);
      if ("error" in res && res.error) {
        setShowDppVersionHistory(!next);
        setError(res.error);
      }
    });
  };

  return (
    <div className="bg-(--ds-surface) border border-(--ds-border) rounded-xl p-8">
      <h3 className="text-lg font-semibold text-(--ds-text-primary) mb-1 tracking-tight">DPP Version History</h3>
      <p className="text-[13px] text-(--ds-text-secondary) mb-6">
        Controls whether the public passport page (/01/&#123;gtin&#125;) shows this company&apos;s Digital Product
        Passport version history - version numbers, dates, and change summaries. Turning this off only hides it from
        visitors; nothing is deleted, and the dashboard&apos;s own history is unaffected.
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
            <History size={18} className="text-(--ds-text-secondary) shrink-0" />
            <span>
              <span className="block text-[14px] font-medium text-(--ds-text-primary)">
                Show version history on the public passport
              </span>
              <span className="block text-[12px] text-(--ds-text-secondary) mt-0.5">
                When off, the public passport page hides the version history section entirely.
              </span>
            </span>
          </span>
          <span
            className={`inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
              showDppVersionHistory ? "bg-(--ds-accent)" : "bg-[#cbd5e1] dark:bg-[#475569]"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                showDppVersionHistory ? "translate-x-4" : "translate-x-0.5"
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
