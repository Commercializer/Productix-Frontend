/* ─────────────────────────────────────────────
 * Feedback Form Core - the actual form: an ordered
 * list of resolved fields (built-ins + author-defined
 * custom fields), validation, structured submit to
 * /api/feedback, and the success state.
 *
 * Shared by:
 *  - FeedbackSheet       (button → bottom-sheet popup, "stack" layout)
 *  - FeedbackFormElement (standalone inline form, "stack" or "free" layout)
 *
 * The host resolves which fields to show (resolveFields) and supplies the
 * chrome + header; this component owns the form state, renders each field
 * via the shared <FieldInput>, and reports status changes back up.
 *
 * Layout:
 *  - "stack" → single vertical column (popup, and forms with no positioning yet)
 *  - "free"  → flex-wrap rows; each field placed by its x (left offset) and
 *              width fractions, flow-ordered, auto height. Collapses gracefully
 *              and scales with the host element.
 * ──────────────────────────────────────────── */

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FieldInput } from "./feedback-field-input";
import { usePublicPage } from "../renderer/public-page-context";
import {
  fieldGridColumn,
  type FeedbackAnswerPayload,
  type FeedbackFormLayout,
  type FeedbackSheetLabels,
  type FeedbackSubmitStyle,
  type ResolvedField,
} from "./feedback-sheet";

export type FeedbackFormStatus = "idle" | "success" | "error";

export interface FeedbackFormCoreProps {
  productId?: string;
  labels: FeedbackSheetLabels;
  accentColor?: string;
  /** Resolved, ordered fields (built-ins + customs with effective geometry). */
  fields: ResolvedField[];
  /** "stack" (default) renders a single column; "free" honors x/width per field. */
  layout?: FeedbackFormLayout;
  /** Optional style overrides for the submit button. */
  submitStyle?: FeedbackSubmitStyle;
  /**
   * When false the form renders but cannot be submitted (editor canvas
   * preview). The submit button shows but is inert. Defaults to true.
   */
  interactive?: boolean;
  /** Bumping this value resets the form back to a blank, idle state. */
  resetNonce?: number;
  /** Notifies the host when the form's status changes (so it can swap its header). */
  onStatusChange?: (status: FeedbackFormStatus) => void;
  /**
   * Optional "done" action rendered as a button in the success state. The
   * sheet passes its close handler here; the inline form omits it.
   */
  onDone?: () => void;
  /** Label for the success-state done button (defaults to labels.cancelLabel). */
  doneLabel?: string;
}

export function FeedbackFormCore({
  productId,
  labels,
  accentColor = "#0ea5e9",
  fields,
  layout = "stack",
  submitStyle,
  interactive = true,
  resetNonce = 0,
  onStatusChange,
  onDone,
  doneLabel,
}: FeedbackFormCoreProps) {
  // When the page was opened via a branch-specific QR (`?b=<code>`), every
  // submission is attributed to that branch and the branch picker is hidden —
  // the location is already decided, so asking again would be redundant.
  const { forcedBranchCode } = usePublicPage();
  const effectiveFields = useMemo(
    () => (forcedBranchCode ? fields.filter((rf) => rf.field.type !== "branch") : fields),
    [fields, forcedBranchCode],
  );

  const submitBg = submitStyle?.bgColor ?? accentColor;
  const submitText = submitStyle?.textColor ?? "#ffffff";
  const submitRadius = submitStyle?.borderRadius ?? 14;
  const submitFontSize = submitStyle?.fontSize ?? 15;
  const submitFontWeight = submitStyle?.fontWeight ?? "600";

  // One value map keyed by field id (built-in reserved ids + custom ids).
  const [values, setValues] = useState<Record<string, string | string[] | number>>({});
  const [branchOptions, setBranchOptions] = useState<Array<{ id: string; name: string }>>([]);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<FeedbackFormStatus>("idle");
  const [errorText, setErrorText] = useState<string | null>(null);

  // Reset the form to a blank, idle state when the host bumps resetNonce.
  useEffect(() => {
    if (resetNonce === 0) return;
    setValues({});
    setStatus("idle");
    setErrorText(null);
    setSubmitting(false);
  }, [resetNonce]);

  // Keep the host informed so it can swap its header to the success title.
  useEffect(() => {
    onStatusChange?.(status);
  }, [status, onStatusChange]);

  // Lazily load the company's branches when a branch picker is present, so the
  // dropdown stays empty (and cheap) for forms that don't use one.
  const hasBranchField = effectiveFields.some((rf) => rf.field.type === "branch");
  useEffect(() => {
    if (!interactive || !hasBranchField || !productId || branchOptions.length > 0) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/branches?productId=${encodeURIComponent(productId)}`);
        if (!res.ok) return;
        const body = await res.json().catch(() => null);
        if (!cancelled && Array.isArray(body?.items)) setBranchOptions(body.items);
      } catch {
        /* leave the dropdown empty on failure */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [interactive, hasBranchField, productId, branchOptions.length]);

  // A field counts as filled when it has a non-empty string, a non-empty
  // selection array, or any numeric rating value.
  const isFilled = (v: string | string[] | number | undefined): boolean => {
    if (v === undefined || v === null) return false;
    if (typeof v === "string") return v.trim().length > 0;
    if (Array.isArray(v)) return v.length > 0;
    return true; // numeric rating present
  };

  // Every required field must be filled. The built-in email field is resolved
  // with required:false (stays optional even when shown), preserving prior behavior.
  const requiredFilled = effectiveFields.every(({ field }) => !field.required || isFilled(values[field.id]));
  // Guard against a form where the author disabled every input.
  const hasAnyVisible = effectiveFields.length > 0;
  const canSubmit = interactive && hasAnyVisible && requiredFilled && !submitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    if (!productId) {
      setErrorText("This page isn't attached to a product. Open the published product page to submit feedback.");
      setStatus("error");
      return;
    }
    setSubmitting(true);
    setErrorText(null);
    try {
      // Built-ins map to top-level keys; the branch field is sent as branchId;
      // everything else becomes a structured answer. Payload is byte-identical
      // to the previous (toggle-based) implementation.
      let name = "";
      let phone = "";
      let email = "";
      let details = "";
      // Branch picked in the form's branch field (hidden when a QR already
      // forced a branch — see effectiveFields). The forced branch is sent as
      // branchCode below and takes precedence server-side.
      let branchId: string | null = null;
      const answers: FeedbackAnswerPayload[] = [];

      for (const { field } of effectiveFields) {
        const v = values[field.id];
        if (field.builtin === "name") {
          name = typeof v === "string" ? v.trim() : "";
          continue;
        }
        if (field.builtin === "phone") {
          phone = typeof v === "string" ? v.trim() : "";
          continue;
        }
        if (field.builtin === "email") {
          email = typeof v === "string" ? v.trim() : "";
          continue;
        }
        if (field.builtin === "details") {
          details = typeof v === "string" ? v.trim() : "";
          continue;
        }
        if (!isFilled(v)) continue;
        if (field.type === "branch") {
          if (typeof v === "string") branchId = v;
          continue;
        }
        answers.push({
          fieldId: field.id,
          label: field.label,
          type: field.type,
          value: v as string | string[] | number,
          ...(field.type === "star" ? { max: Math.max(2, Math.min(10, field.max ?? 5)) } : {}),
        });
      }

      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: productId ?? null,
          name,
          phone,
          email,
          details,
          branchId,
          branchCode: forcedBranchCode ?? null,
          answers,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || labels.errorMessage);
      }
      setStatus("success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : labels.errorMessage;
      setErrorText(msg);
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "success") {
    return (
      <div style={{ padding: "16px 0 24px", textAlign: "center" }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 999,
            background: `${accentColor}1A`,
            color: accentColor,
            margin: "0 auto 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            fontWeight: 700,
          }}
        >
          ✓
        </div>
        <p style={{ margin: 0, fontSize: 15, color: "#334155", lineHeight: 1.5 }}>{labels.successMessage}</p>
        {onDone && (
          <button
            type="button"
            onClick={onDone}
            style={{
              marginTop: 22,
              width: "100%",
              padding: "14px 18px",
              borderRadius: submitRadius,
              border: "none",
              background: submitBg,
              color: submitText,
              fontSize: submitFontSize,
              fontWeight: submitFontWeight,
              cursor: "pointer",
            }}
          >
            {doneLabel ?? labels.cancelLabel}
          </button>
        )}
      </div>
    );
  }

  const isFree = layout === "free";
  const listStyle: React.CSSProperties = isFree
    ? { display: "grid", gridTemplateColumns: `repeat(12, 1fr)`, gridAutoFlow: "row dense", columnGap: 10, rowGap: 14, width: "100%", alignItems: "start" }
    : { display: "flex", flexDirection: "column", gap: 14 };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={listStyle}>
        {effectiveFields.map((rf) => {
          const setValue = (v: string | string[] | number) => setValues((prev) => ({ ...prev, [rf.field.id]: v }));
          const itemStyle: React.CSSProperties = isFree ? { gridColumn: fieldGridColumn(rf.x, rf.width), minWidth: 0 } : {};
          return (
            <div key={rf.field.id} style={itemStyle}>
              <FieldInput
                field={rf.field}
                value={values[rf.field.id]}
                onChange={setValue}
                accentColor={accentColor}
                branchOptions={branchOptions}
                interactive={interactive}
              />
            </div>
          );
        })}
      </div>

      {errorText && (
        <div style={{ padding: "10px 12px", borderRadius: 10, background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", fontSize: 13 }}>{errorText}</div>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        style={{
          marginTop: 4,
          width: "100%",
          padding: "14px 18px",
          borderRadius: submitRadius,
          border: "none",
          background: canSubmit ? submitBg : "#cbd5e1",
          color: submitText,
          fontSize: submitFontSize,
          fontWeight: submitFontWeight,
          cursor: canSubmit ? "pointer" : "not-allowed",
          transition: "background 0.15s ease, transform 0.1s ease",
        }}
      >
        {submitting ? "Sending…" : labels.submitLabel}
      </button>
    </form>
  );
}
