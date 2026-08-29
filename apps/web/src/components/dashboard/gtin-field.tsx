"use client";

import { Loader2, ScanBarcode, BadgeCheck, CircleCheck, CircleAlert } from "lucide-react";
import { verifyGtinAction } from "@/lib/dashboard/actions";
import { availableGtinDetailEntries } from "@/lib/gs1";

export type GtinCheckState =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "invalid"; message: string }
  | { status: "valid_format" }
  | { status: "gs1_not_found"; data?: Record<string, unknown> }
  | { status: "gs1_verified"; data?: Record<string, unknown> };

// Statuses acceptable for the company's "require valid GTIN" policy - anything
// past local check-digit validation, whether or not GS1's registry has it.
export const GTIN_POLICY_OK: GtinCheckState["status"][] = ["valid_format", "gs1_not_found", "gs1_verified"];

/** Renders whatever the GS1 API returned for a GTIN - only fields with an
 * actual value, per availableGtinDetailEntries. Renders nothing if empty. */
function GtinDetailPanel({ data }: { data?: Record<string, unknown> }) {
  const entries = availableGtinDetailEntries(data);
  if (entries.length === 0) return null;

  return (
    <div className="rounded-lg border border-(--ds-border) bg-(--ds-bg) divide-y divide-(--ds-border) text-[12px]">
      {entries.map(([label, value]) => (
        <div key={label} className="px-3 py-2 flex items-start justify-between gap-3">
          <span className="text-(--ds-text-muted) shrink-0">{label}</span>
          {label === "Product Image Url" && /^https?:\/\//i.test(value) ? (
            <a href={value} target="_blank" rel="noopener noreferrer" className="shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt=""
                className="h-10 w-10 rounded object-cover border border-(--ds-border)"
              />
            </a>
          ) : (
            <span className="text-(--ds-text-primary) font-medium text-right break-words">{value}</span>
          )}
        </div>
      ))}
    </div>
  );
}

interface GtinFieldProps {
  value: string;
  onChange: (value: string) => void;
  checkState: GtinCheckState;
  onCheckStateChange: (state: GtinCheckState) => void;
  required?: boolean;
  label?: string;
}

/** GTIN input with live format + GS1-registry verification (verifyGtinAction),
 * shared between the new-product form and the DPP identifier step. */
export function GtinField({
  value,
  onChange,
  checkState,
  onCheckStateChange,
  required = false,
  label = "GTIN (Barcode Number)",
}: GtinFieldProps) {
  const handleChange = (next: string) => {
    onChange(next);
    onCheckStateChange({ status: "idle" });
  };

  const handleBlur = async () => {
    const trimmed = value.trim();
    if (!trimmed) {
      onCheckStateChange({ status: "idle" });
      return;
    }
    onCheckStateChange({ status: "checking" });
    const res = await verifyGtinAction(trimmed);

    if (!("status" in res)) {
      // Not authenticated, or some other early-return shape.
      onCheckStateChange({ status: "invalid", message: res.error ?? "Could not check this GTIN" });
      return;
    }
    if (res.status === "INVALID_FORMAT") {
      onCheckStateChange({ status: "invalid", message: res.error ?? "Invalid GTIN" });
    } else if (res.status === "GS1_VERIFIED") {
      onCheckStateChange({ status: "gs1_verified", data: res.data });
    } else if (res.status === "GS1_NOT_FOUND") {
      onCheckStateChange({ status: "gs1_not_found", data: res.data });
    } else {
      onCheckStateChange({ status: "valid_format" });
    }
  };

  return (
    <div>
      <label className="block text-[13px] font-semibold text-(--ds-text-primary) mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <ScanBarcode
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--ds-text-muted)"
        />
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          placeholder="e.g. 00614141123452"
          className="w-full h-[44px] pl-10 pr-4 rounded-xl border border-(--ds-border) bg-(--ds-bg) text-[14px] text-(--ds-text-primary) placeholder-(--ds-text-muted) focus:outline-hidden focus:ring-2 focus:ring-[#0284c7]/20 focus:border-[#0284c7] transition-all"
        />
      </div>
      <p className="mt-1.5 text-[12px] text-(--ds-text-muted)">
        8, 12, 13 or 14-digit GS1 barcode number. Set once at creation — powers the GS1
        Digital Link QR code and the verified-product badge. Optional unless your company
        requires it.
      </p>

      {checkState.status === "checking" && (
        <div className="mt-2 flex items-center gap-1.5 text-[12px] text-(--ds-text-muted)">
          <Loader2 size={13} className="animate-spin" /> Checking…
        </div>
      )}
      {checkState.status === "invalid" && (
        <div className="mt-2 flex items-start gap-1.5 text-[12px] text-red-600 dark:text-red-400">
          <CircleAlert size={13} className="mt-0.5 shrink-0" />
          {checkState.message}
        </div>
      )}
      {checkState.status === "valid_format" && (
        <div className="mt-2 flex items-center gap-1.5 text-[12px] text-(--ds-text-secondary)">
          <CircleCheck size={13} className="text-sky-500" /> Valid GTIN format
        </div>
      )}
      {checkState.status === "gs1_not_found" && (
        <div className="mt-2 space-y-2">
          <div className="flex items-center gap-1.5 text-[12px] text-(--ds-text-secondary)">
            <CircleCheck size={13} className="text-sky-500" />
            Valid GTIN format (no confirmed active match in the GS1 registry)
          </div>
          <GtinDetailPanel data={checkState.data} />
        </div>
      )}
      {checkState.status === "gs1_verified" && (
        <div className="mt-2 space-y-2">
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-emerald-600 dark:text-emerald-400">
            <BadgeCheck size={14} /> GTIN Verified
          </div>
          <GtinDetailPanel data={checkState.data} />
        </div>
      )}
    </div>
  );
}
