"use client";

import { useEffect, useState, useTransition } from "react";
import { ScanBarcode } from "lucide-react";
import { getCompanySettingsAction, updateGtinPolicyAction } from "@/lib/dashboard/actions";

export function GtinPolicyCard() {
  const [requireValidGtin, setRequireValidGtin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getCompanySettingsAction().then((res) => {
      if (res.success && res.company) setRequireValidGtin(res.company.requireValidGtin);
      setLoading(false);
    });
  }, []);

  const handleToggle = () => {
    const next = !requireValidGtin;
    setError(null);
    // Optimistic - rolls back on error, same pattern as setSlugVisible in use-promptions.
    setRequireValidGtin(next);
    startTransition(async () => {
      const res = await updateGtinPolicyAction(next);
      if ("error" in res && res.error) {
        setRequireValidGtin(!next);
        setError(res.error);
      }
    });
  };

  return (
    <div className="bg-(--ds-surface) border border-(--ds-border) rounded-xl p-8">
      <h3 className="text-lg font-semibold text-(--ds-text-primary) mb-1 tracking-tight">
        GS1 GTIN Policy
      </h3>
      <p className="text-[13px] text-(--ds-text-secondary) mb-6">
        Controls whether products in this company can be created, published, or issued QR codes
        without a valid GTIN. GTIN is set once when a product is created and can&apos;t be changed
        afterwards.
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
            <ScanBarcode size={18} className="text-(--ds-text-secondary) shrink-0" />
            <span>
              <span className="block text-[14px] font-medium text-(--ds-text-primary)">
                Require a valid GTIN before publishing
              </span>
              <span className="block text-[12px] text-(--ds-text-secondary) mt-0.5">
                When on, products without at least a check-digit-valid GTIN can&apos;t be created,
                published, or generate QR codes.
              </span>
            </span>
          </span>
          <span
            className={`inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
              requireValidGtin ? "bg-(--ds-accent)" : "bg-[#cbd5e1] dark:bg-[#475569]"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                requireValidGtin ? "translate-x-4" : "translate-x-0.5"
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
