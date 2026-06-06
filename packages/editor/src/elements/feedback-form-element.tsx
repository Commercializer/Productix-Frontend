/* ─────────────────────────────────────────────
 * Feedback Form Element - a standalone feedback
 * form rendered inline directly on the page (no
 * trigger button / popup). Authors build and style
 * it on the editor canvas like any other element;
 * visitors fill it in and submit on the live page.
 *
 * Shares its form body (FeedbackFormCore) and field
 * builder (feedback-fields-config) with the Feedback
 * (button → bottom-sheet) element.
 * ──────────────────────────────────────────── */

"use client";

import React, { useState } from "react";
import { ClipboardList } from "lucide-react";
import { registerElement, type ElementRenderProps, type PropertyPanelProps } from "./registry";
import { HexColorPopover } from "./hex-color-popover";
import { FeedbackFormCore, type FeedbackFormStatus } from "./feedback-form-core";
import { BuiltInFieldToggles, CustomFieldsEditor } from "./feedback-fields-config";
import { getDefaultFeedbackLabels, resolveFields, type CustomField, type FeedbackSheetLabels, type FeedbackSubmitStyle } from "./feedback-sheet";
import { usePublicPage } from "../renderer/public-page-context";

function isInsideEditor(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return !!(window as unknown as Record<string, unknown>).__productixEditor;
  } catch {
    return false;
  }
}

function getLabels(props: Record<string, unknown>): FeedbackSheetLabels {
  const d = getDefaultFeedbackLabels();
  return {
    title: (props.formTitle as string) || d.title,
    subtitle: (props.formSubtitle as string) || d.subtitle,
    nameLabel: (props.nameLabel as string) || d.nameLabel,
    namePlaceholder: (props.namePlaceholder as string) || d.namePlaceholder,
    phoneLabel: (props.phoneLabel as string) || d.phoneLabel,
    phonePlaceholder: (props.phonePlaceholder as string) || d.phonePlaceholder,
    emailLabel: (props.emailLabel as string) || d.emailLabel,
    emailPlaceholder: (props.emailPlaceholder as string) || d.emailPlaceholder,
    detailsLabel: (props.detailsLabel as string) || d.detailsLabel,
    detailsPlaceholder: (props.detailsPlaceholder as string) || d.detailsPlaceholder,
    submitLabel: (props.submitLabel as string) || d.submitLabel,
    cancelLabel: (props.cancelLabel as string) || d.cancelLabel,
    successTitle: (props.successTitle as string) || d.successTitle,
    successMessage: (props.successMessage as string) || d.successMessage,
    errorMessage: (props.errorMessage as string) || d.errorMessage,
  };
}

function FeedbackFormElementComponent({ props, isEditing }: ElementRenderProps) {
  const accentColor = (props.accentColor as string) || "#0ea5e9";
  const cardBg = (props.cardBg as string) || "#ffffff";
  const cardRadius = (props.cardRadius as number) ?? 18;
  const cardPadding = (props.cardPadding as number) ?? 24;
  const showCard = props.showCard !== false;
  const align = (props.titleAlign as string) || "left";

  const [status, setStatus] = useState<FeedbackFormStatus>("idle");
  const { productId } = usePublicPage();

  const submitStyle: FeedbackSubmitStyle = {
    bgColor: (props.submitBgColor as string) || undefined,
    textColor: (props.submitTextColor as string) || undefined,
    borderRadius: typeof props.submitBorderRadius === "number" ? (props.submitBorderRadius as number) : undefined,
    fontSize: typeof props.submitFontSize === "number" ? (props.submitFontSize as number) : undefined,
    fontWeight: (props.submitFontWeight as string) || undefined,
  };

  const labels = getLabels(props);
  const interactive = !isEditing && !isInsideEditor();
  const resolved = resolveFields(props, labels);

  const cardStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    fontFamily: "var(--font-sans), system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    background: showCard ? cardBg : "transparent",
    borderRadius: showCard ? cardRadius : 0,
    border: showCard ? "1px solid rgba(15,23,42,0.08)" : "none",
    boxShadow: showCard ? "0 8px 28px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)" : "none",
    padding: showCard ? cardPadding : 0,
  };

  return (
    <div style={cardStyle}>
      {/* Header */}
      <div style={{ marginBottom: 16, textAlign: align as React.CSSProperties["textAlign"] }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.01em" }}>
          {status === "success" ? labels.successTitle : labels.title}
        </h2>
        {status !== "success" && labels.subtitle && (
          <p style={{ margin: "5px 0 0", fontSize: 13.5, color: "#64748b", lineHeight: 1.45 }}>{labels.subtitle}</p>
        )}
      </div>

      <FeedbackFormCore
        productId={productId}
        labels={labels}
        accentColor={accentColor}
        fields={resolved}
        layout="stack"
        submitStyle={submitStyle}
        interactive={interactive}
        onStatusChange={setStatus}
      />
    </div>
  );
}

/* ─── Property Panel ────────────────────────── */

function FeedbackFormPropertyPanel({ props, onChange }: PropertyPanelProps) {
  const [section, setSection] = useState<"card" | "fields" | "copy" | "submit">("card");

  const labelCls = "text-xs font-medium text-gray-500 uppercase tracking-wide";
  const inputCls = "mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none";

  const showName = props.showNameField !== false;
  const showPhone = props.showPhoneField !== false;
  const showEmail = props.showEmailField !== false;
  const showDetails = props.showDetailsField !== false;
  const customFields = Array.isArray(props.customFields) ? (props.customFields as CustomField[]) : [];

  const tabLabel = (s: "card" | "fields" | "copy" | "submit") =>
    s === "card" ? "Card" : s === "fields" ? "Fields" : s === "copy" ? "Copy" : "Submit";

  return (
    <div className="space-y-3">
      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, padding: 3, background: "#f3f4f6", borderRadius: 8 }}>
        {(["card", "fields", "copy", "submit"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSection(s)}
            style={{
              flex: 1,
              padding: "6px 10px",
              borderRadius: 6,
              border: "none",
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              cursor: "pointer",
              background: section === s ? "#fff" : "transparent",
              color: section === s ? "#111827" : "#6b7280",
              boxShadow: section === s ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
            }}
          >
            {tabLabel(s)}
          </button>
        ))}
      </div>

      {section === "card" && (
        <>
          <label className="flex items-center justify-between gap-2 py-1">
            <span className={labelCls}>Show card background</span>
            <input
              type="checkbox"
              checked={props.showCard !== false}
              onChange={(e) => onChange({ showCard: e.target.checked })}
            />
          </label>
          <label className="block">
            <span className={labelCls}>Accent color</span>
            <div className="mt-1 flex gap-2 items-center">
              <HexColorPopover value={(props.accentColor as string) || ""} onChange={(hex) => onChange({ accentColor: hex })} fallback="#0ea5e9" />
              <input
                type="text"
                className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
                value={(props.accentColor as string) || "#0ea5e9"}
                onChange={(e) => onChange({ accentColor: e.target.value })}
              />
            </div>
          </label>
          <label className="block">
            <span className={labelCls}>Card background</span>
            <div className="mt-1 flex gap-2 items-center">
              <HexColorPopover value={(props.cardBg as string) || ""} onChange={(hex) => onChange({ cardBg: hex })} fallback="#ffffff" />
              <input
                type="text"
                className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
                value={(props.cardBg as string) || "#ffffff"}
                onChange={(e) => onChange({ cardBg: e.target.value })}
              />
            </div>
          </label>
          <label className="block">
            <span className={labelCls}>Title alignment</span>
            <select className={inputCls} value={(props.titleAlign as string) || "left"} onChange={(e) => onChange({ titleAlign: e.target.value })}>
              <option value="left">Left</option>
              <option value="center">Center</option>
            </select>
          </label>
          <label className="block">
            <span className={labelCls}>Corner radius</span>
            <input type="number" className={inputCls} value={(props.cardRadius as number) ?? 18} onChange={(e) => onChange({ cardRadius: Number(e.target.value) })} min={0} max={64} />
          </label>
          <label className="block">
            <span className={labelCls}>Padding</span>
            <input type="number" className={inputCls} value={(props.cardPadding as number) ?? 24} onChange={(e) => onChange({ cardPadding: Number(e.target.value) })} min={0} max={80} />
          </label>
        </>
      )}

      {section === "fields" && (
        <>
          <div>
            <span className={labelCls}>Built-in fields</span>
            <BuiltInFieldToggles
              fields={{ name: showName, phone: showPhone, email: showEmail, details: showDetails }}
              onChange={(patch) =>
                onChange({
                  ...(patch.name !== undefined ? { showNameField: patch.name } : {}),
                  ...(patch.phone !== undefined ? { showPhoneField: patch.phone } : {}),
                  ...(patch.email !== undefined ? { showEmailField: patch.email } : {}),
                  ...(patch.details !== undefined ? { showDetailsField: patch.details } : {}),
                })
              }
            />
          </div>
          <div style={{ marginTop: 14 }}>
            <CustomFieldsEditor customFields={customFields} onChange={(next) => onChange({ customFields: next })} />
          </div>
        </>
      )}

      {section === "copy" && (
        <>
          <label className="block">
            <span className={labelCls}>Form title</span>
            <input type="text" className={inputCls} value={(props.formTitle as string) || ""} onChange={(e) => onChange({ formTitle: e.target.value })} placeholder="Share your feedback" />
          </label>
          <label className="block">
            <span className={labelCls}>Subtitle</span>
            <input type="text" className={inputCls} value={(props.formSubtitle as string) || ""} onChange={(e) => onChange({ formSubtitle: e.target.value })} placeholder="We'd love to hear about your experience." />
          </label>
          <label className="block">
            <span className={labelCls}>Submit button label</span>
            <input type="text" className={inputCls} value={(props.submitLabel as string) || ""} onChange={(e) => onChange({ submitLabel: e.target.value })} placeholder="Send feedback" />
          </label>
          <label className="block">
            <span className={labelCls}>Success title</span>
            <input type="text" className={inputCls} value={(props.successTitle as string) || ""} onChange={(e) => onChange({ successTitle: e.target.value })} placeholder="Thank you!" />
          </label>
          <label className="block">
            <span className={labelCls}>Success message</span>
            <textarea className={inputCls} rows={3} value={(props.successMessage as string) || ""} onChange={(e) => onChange({ successMessage: e.target.value })} placeholder="Your feedback has been received." />
          </label>
        </>
      )}

      {section === "submit" && (
        <>
          <div style={{ padding: "10px 12px", borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0", fontSize: 11.5, color: "#64748b", lineHeight: 1.4 }}>
            Style the <strong>submit</strong> button. Leave colors blank to inherit from the accent color.
          </div>
          <label className="block">
            <span className={labelCls}>Background color</span>
            <div className="mt-1 flex gap-2 items-center">
              <HexColorPopover value={(props.submitBgColor as string) || ""} onChange={(hex) => onChange({ submitBgColor: hex })} fallback={(props.accentColor as string) || "#0ea5e9"} />
              <input
                type="text"
                className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
                value={(props.submitBgColor as string) || ""}
                onChange={(e) => onChange({ submitBgColor: e.target.value })}
                placeholder={(props.accentColor as string) || "#0ea5e9"}
              />
            </div>
          </label>
          <label className="block">
            <span className={labelCls}>Text color</span>
            <div className="mt-1 flex gap-2 items-center">
              <HexColorPopover value={(props.submitTextColor as string) || ""} onChange={(hex) => onChange({ submitTextColor: hex })} fallback="#ffffff" />
              <input
                type="text"
                className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
                value={(props.submitTextColor as string) || ""}
                onChange={(e) => onChange({ submitTextColor: e.target.value })}
                placeholder="#ffffff"
              />
            </div>
          </label>
          <label className="block">
            <span className={labelCls}>Border radius</span>
            <input
              type="number"
              className={inputCls}
              value={typeof props.submitBorderRadius === "number" ? (props.submitBorderRadius as number) : 14}
              onChange={(e) => onChange({ submitBorderRadius: Number(e.target.value) })}
              min={0}
              max={999}
            />
          </label>
          <label className="block">
            <span className={labelCls}>Font size</span>
            <input
              type="number"
              className={inputCls}
              value={typeof props.submitFontSize === "number" ? (props.submitFontSize as number) : 15}
              onChange={(e) => onChange({ submitFontSize: Number(e.target.value) })}
              min={8}
              max={48}
            />
          </label>
          <label className="block">
            <span className={labelCls}>Font weight</span>
            <select className={inputCls} value={(props.submitFontWeight as string) || "600"} onChange={(e) => onChange({ submitFontWeight: e.target.value })}>
              <option value="400">Regular (400)</option>
              <option value="500">Medium (500)</option>
              <option value="600">Semibold (600)</option>
              <option value="700">Bold (700)</option>
              <option value="800">Extrabold (800)</option>
            </select>
          </label>
        </>
      )}
    </div>
  );
}

/* ─── Registration ──────────────────────────── */

registerElement({
  type: "feedbackForm",
  label: "Feedback Form",
  icon: <ClipboardList size={16} />,
  category: "feedback",
  defaultProps: {
    accentColor: "#0ea5e9",
    cardBg: "#ffffff",
    cardRadius: 18,
    cardPadding: 24,
    showCard: true,
    titleAlign: "left",
    formTitle: "Share your feedback",
    formSubtitle: "We'd love to hear about your experience.",
    submitLabel: "Send feedback",
    successTitle: "Thank you!",
    successMessage: "Your feedback has been received. We'll get back to you soon.",
    showNameField: true,
    showPhoneField: true,
    showEmailField: true,
    showDetailsField: true,
    customFields: [],
    submitBgColor: "",
    submitTextColor: "",
    submitBorderRadius: 14,
    submitFontSize: 15,
    submitFontWeight: "600",
  },
  defaultTransform: { width: 380, height: 560 },
  component: FeedbackFormElementComponent,
  propertyPanel: FeedbackFormPropertyPanel,
});
