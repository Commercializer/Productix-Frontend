/* ─────────────────────────────────────────────
 * Feedback Bottom Sheet - Native-app style modal
 *
 * Slides up from the bottom of the screen with a
 * dimmed backdrop. Used by the Feedback element on
 * published product pages so visitors can leave
 * feedback or an inquiry against a product.
 *
 * The form itself lives in FeedbackFormCore (shared
 * with the standalone Feedback Form element); this
 * file only provides the bottom-sheet chrome.
 * ──────────────────────────────────────────── */

"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { FeedbackFormCore, type FeedbackFormStatus } from "./feedback-form-core";

export interface FeedbackSheetLabels {
  title: string;
  subtitle?: string;
  nameLabel: string;
  namePlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  detailsLabel: string;
  detailsPlaceholder: string;
  submitLabel: string;
  cancelLabel: string;
  successTitle: string;
  successMessage: string;
  errorMessage: string;
}

export interface FeedbackSheetFields {
  name: boolean;
  phone: boolean;
  email: boolean;
  details: boolean;
}

export type FeedbackFieldType =
  | "text"
  | "textarea"
  | "tel"
  | "email"
  | "number"
  | "image"
  | "star"
  | "emoji"
  | "select"
  | "multiselect"
  | "nps"
  | "date"
  | "slider"
  | "branch";

/** The four built-in contact fields, which map to dedicated submit-payload keys. */
export type BuiltinFieldKind = "name" | "phone" | "email" | "details";

/** Reserved field ids for the built-in fields, so geometry can reference them. */
export const BUILTIN_FIELD_IDS: Record<BuiltinFieldKind, string> = {
  name: "__name",
  phone: "__phone",
  email: "__email",
  details: "__details",
};

export interface CustomField {
  id: string;
  label: string;
  placeholder?: string;
  type: FeedbackFieldType;
  required: boolean;
  /** Choices for select / multiselect fields. */
  options?: string[];
  /** Max value for star (default 5) and slider. */
  max?: number;
  /** Min value for slider (default 0). */
  min?: number;
  /** Step for slider (default 1). */
  step?: number;
  /**
   * Set when this is one of the built-in contact fields (name/phone/email/details).
   * Built-ins map to the top-level submit keys rather than the structured answers[].
   * Never sent in the submit payload.
   */
  builtin?: BuiltinFieldKind;
}

/**
 * Free-canvas geometry for one field. `x` and `width` are fractions (0–1) of the
 * form's content width; `order` drives vertical stacking. Stored separately from
 * field content (in the non-translatable `fieldLayout` prop) so position never
 * forks per content-locale.
 */
export interface FieldGeometry {
  id: string;
  x: number;
  width: number;
  order: number;
}

/** A field resolved for rendering: its definition plus effective geometry. */
export interface ResolvedField {
  field: CustomField;
  x: number;
  width: number;
  order: number;
}

/** Layout mode for the shared form body. */
export type FeedbackFormLayout = "stack" | "free";

/**
 * Merge field presence (legacy `showXField` toggles + `customFields[]`) with the
 * optional positioned geometry (`fieldLayout`) into one ordered list. Built-ins
 * come first in a fixed order, then custom fields in array order; any field with a
 * stored geometry entry uses its x/width/order instead. Pure + back-compatible:
 * documents with no `fieldLayout` resolve to a full-width vertical stack.
 */
export function resolveFields(props: Record<string, unknown>, labels: FeedbackSheetLabels): ResolvedField[] {
  const builtinDefs: CustomField[] = [];
  if (props.showNameField !== false)
    builtinDefs.push({ id: BUILTIN_FIELD_IDS.name, builtin: "name", type: "text", label: labels.nameLabel, placeholder: labels.namePlaceholder, required: true });
  if (props.showPhoneField !== false)
    builtinDefs.push({ id: BUILTIN_FIELD_IDS.phone, builtin: "phone", type: "tel", label: labels.phoneLabel, placeholder: labels.phonePlaceholder, required: true });
  if (props.showEmailField !== false)
    builtinDefs.push({ id: BUILTIN_FIELD_IDS.email, builtin: "email", type: "email", label: labels.emailLabel, placeholder: labels.emailPlaceholder, required: false });
  if (props.showDetailsField !== false)
    builtinDefs.push({ id: BUILTIN_FIELD_IDS.details, builtin: "details", type: "textarea", label: labels.detailsLabel, placeholder: labels.detailsPlaceholder, required: true });

  const customs: CustomField[] = Array.isArray(props.customFields) ? (props.customFields as CustomField[]) : [];
  const natural = [...builtinDefs, ...customs];

  const geometryArr: FieldGeometry[] = Array.isArray(props.fieldLayout) ? (props.fieldLayout as FieldGeometry[]) : [];
  const geometryById = new Map(geometryArr.map((g) => [g.id, g]));

  const resolved: ResolvedField[] = natural.map((field, idx) => {
    const geom = geometryById.get(field.id);
    return {
      field,
      x: typeof geom?.x === "number" ? geom.x : 0,
      width: typeof geom?.width === "number" ? geom.width : 1,
      order: typeof geom?.order === "number" ? geom.order : idx,
    };
  });

  resolved.sort((a, b) => a.order - b.order);
  return resolved;
}

/** Number of columns the free layout snaps to. */
export const FIELD_GRID_COLS = 12;

/**
 * Map a field's x (left offset) and width fractions onto a CSS grid-column value
 * over a 12-column grid. Using a grid (rather than flow + margins) means side-by-
 * side fields never overlap or overflow, heights stay automatic, and it renders
 * identically on the server. Shared by the production form and the editor canvas.
 */
export function fieldGridColumn(x: number, width: number): string {
  const startCol = Math.max(1, Math.min(FIELD_GRID_COLS, Math.round(Math.max(0, Math.min(1, x)) * FIELD_GRID_COLS) + 1));
  const maxSpan = FIELD_GRID_COLS + 1 - startCol;
  const span = Math.max(1, Math.min(maxSpan, Math.round(Math.max(0.08, Math.min(1, width)) * FIELD_GRID_COLS)));
  return `${startCol} / span ${span}`;
}

/** Field types whose answer is a numeric rating averaged into ratingScore. */
export const RATING_FIELD_TYPES: FeedbackFieldType[] = ["star", "emoji", "nps"];

/** 5-face happiness scale, index 0..4 maps to score 1..5. */
export const EMOJI_SCALE = ["😠", "🙁", "😐", "🙂", "😄"] as const;

/** A single submitted answer in the structured payload sent to /api/feedback. */
export interface FeedbackAnswerPayload {
  fieldId: string;
  label: string;
  type: FeedbackFieldType;
  value: string | string[] | number;
  /** Max scale value, sent for star ratings so the server can normalize ratingScore. */
  max?: number;
}

export interface FeedbackSubmitStyle {
  bgColor?: string;
  textColor?: string;
  borderRadius?: number;
  fontSize?: number;
  fontWeight?: string;
}

export interface FeedbackSheetProps {
  open: boolean;
  onClose: () => void;
  productId?: string;
  labels: FeedbackSheetLabels;
  accentColor?: string;
  /** Resolved, ordered fields to render (built-ins + customs). */
  fields: ResolvedField[];
  /** Form body layout: "stack" (single column) or "free" (12-col grid). Defaults to "stack". */
  layout?: FeedbackFormLayout;
  /** Optional style overrides for the submit button. Falls back to accentColor / sensible defaults. */
  submitStyle?: FeedbackSubmitStyle;
  /**
   * Optional element to portal the sheet into. When set, the sheet renders
   * with `position: absolute` inside this element instead of `position: fixed`
   * on the body - useful for previews inside a phone mockup. The host element
   * should be `position: relative`.
   */
  portalRoot?: HTMLElement | null;
}

const DEFAULT_LABELS: FeedbackSheetLabels = {
  title: "Share your feedback",
  subtitle: "We'd love to hear about your experience.",
  nameLabel: "Your name",
  namePlaceholder: "John Doe",
  phoneLabel: "Phone number",
  phonePlaceholder: "+1 555 123 4567",
  emailLabel: "Email (optional)",
  emailPlaceholder: "you@example.com",
  detailsLabel: "Details",
  detailsPlaceholder: "Tell us what you think…",
  submitLabel: "Send feedback",
  cancelLabel: "Cancel",
  successTitle: "Thank you!",
  successMessage: "Your feedback has been received. We'll get back to you soon.",
  errorMessage: "Something went wrong. Please try again.",
};

export function getDefaultFeedbackLabels(): FeedbackSheetLabels {
  return { ...DEFAULT_LABELS };
}

export function FeedbackSheet({ open, onClose, productId, labels, accentColor = "#0ea5e9", fields, layout = "stack", submitStyle, portalRoot }: FeedbackSheetProps) {
  const contained = !!portalRoot;
  const [status, setStatus] = useState<FeedbackFormStatus>("idle");
  const [resetNonce, setResetNonce] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Reset the form when the sheet closes (after the close animation completes),
  // by bumping the nonce the core watches.
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => setResetNonce((n) => n + 1), 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Lock body scroll while open - only when the sheet is fullscreen.
  // When contained inside a portal root (phone mockup preview), we don't
  // want to freeze the outer dashboard page.
  useEffect(() => {
    if (!open || contained) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open, contained]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (typeof window === "undefined") return null;

  const content = (
    <div
      aria-hidden={!open}
      style={{
        position: contained ? "absolute" : "fixed",
        inset: 0,
        zIndex: contained ? 100 : 2147483600,
        pointerEvents: open ? "auto" : "none",
        fontFamily: "var(--font-sans), system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(15, 23, 42, 0.45)",
          opacity: open ? 1 : 0,
          transition: "opacity 0.25s ease",
          backdropFilter: open ? "blur(4px)" : "blur(0px)",
        }}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          background: "#fff",
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          boxShadow: "0 -10px 40px rgba(15, 23, 42, 0.18)",
          transform: open ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.28s cubic-bezier(0.32, 0.72, 0.32, 1)",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          paddingBottom: "env(safe-area-inset-bottom, 0)",
        }}
      >
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 6px" }}>
          <div style={{ width: 40, height: 4, borderRadius: 999, background: "#e2e8f0" }} />
        </div>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "4px 22px 8px" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.01em" }}>
              {status === "success" ? labels.successTitle : labels.title}
            </h2>
            {status !== "success" && labels.subtitle && (
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b", lineHeight: 1.4 }}>{labels.subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              flexShrink: 0,
              marginLeft: 12,
              width: 36,
              height: 36,
              borderRadius: 10,
              border: "none",
              background: "#f1f5f9",
              color: "#475569",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ overflowY: "auto", padding: "8px 22px 22px" }}>
          <FeedbackFormCore
            productId={productId}
            labels={labels}
            accentColor={accentColor}
            fields={fields}
            layout={layout}
            submitStyle={submitStyle}
            resetNonce={resetNonce}
            onStatusChange={setStatus}
            onDone={onClose}
          />
        </div>
      </div>
    </div>
  );

  return createPortal(content, portalRoot ?? document.body);
}
