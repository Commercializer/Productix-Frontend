/* ─────────────────────────────────────────────
 * Feedback Element — A button that opens a
 * native-app-style bottom sheet for visitors to
 * submit feedback against the current product.
 * ──────────────────────────────────────────── */

"use client";

import React, { useState } from "react";
import { MessageSquareHeart } from "lucide-react";
import { registerElement, type ElementRenderProps, type PropertyPanelProps } from "./registry";
import { HexColorPopover } from "./hex-color-popover";
import { FeedbackSheet, getDefaultFeedbackLabels, type CustomField, type FeedbackSheetFields, type FeedbackSheetLabels, type FeedbackSubmitStyle } from "./feedback-sheet";
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

function FeedbackElementComponent({ props, isEditing, scaleFactor = 1 }: ElementRenderProps) {
  const text = (props.text as string) || "Send Feedback";
  const bgColor = (props.bgColor as string) || "#0ea5e9";
  const textColor = (props.textColor as string) || "#ffffff";
  const borderRadius = (props.borderRadius as number) ?? 12;
  const fontSize = (props.fontSize as number) ?? 15;
  const fontWeight = (props.fontWeight as string) || "600";
  const variant = (props.variant as string) || "filled";

  const [open, setOpen] = useState(false);
  const { productId, portalRoot } = usePublicPage();

  const fields: FeedbackSheetFields = {
    name: props.showNameField !== false,
    phone: props.showPhoneField !== false,
    email: props.showEmailField !== false,
    details: props.showDetailsField !== false,
  };
  const customFields: CustomField[] = Array.isArray(props.customFields) ? (props.customFields as CustomField[]) : [];

  const submitStyle: FeedbackSubmitStyle = {
    bgColor: (props.submitBgColor as string) || undefined,
    textColor: (props.submitTextColor as string) || undefined,
    borderRadius: typeof props.submitBorderRadius === "number" ? (props.submitBorderRadius as number) : undefined,
    fontSize: typeof props.submitFontSize === "number" ? (props.submitFontSize as number) : undefined,
    fontWeight: (props.submitFontWeight as string) || undefined,
  };

  const scaledFontSize = Math.round(fontSize * scaleFactor);
  const scaledPadH = Math.round(18 * scaleFactor);
  const scaledRadius = Math.round(borderRadius * scaleFactor);

  const style: React.CSSProperties = {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: scaledRadius,
    fontSize: scaledFontSize,
    fontWeight,
    cursor: isInsideEditor() ? "inherit" : isEditing ? "default" : "pointer",
    transition: "all 0.15s ease",
    letterSpacing: "0.01em",
    padding: `0 ${scaledPadH}px`,
    textDecoration: "none",
    border: "none",
    boxSizing: "border-box",
    ...(variant === "filled"
      ? { background: bgColor, color: textColor }
      : variant === "outline"
        ? { background: "transparent", color: bgColor, border: `2px solid ${bgColor}` }
        : { background: "transparent", color: bgColor }),
  };

  const interactive = !isEditing && !isInsideEditor();

  const labels = getLabels(props);

  return (
    <>
      <button
        type="button"
        style={style}
        draggable={false}
        onClick={interactive ? () => setOpen(true) : undefined}
      >
        <span>{text}</span>
      </button>

      {interactive && (
        <FeedbackSheet
          open={open}
          onClose={() => setOpen(false)}
          productId={productId}
          labels={labels}
          accentColor={bgColor}
          fields={fields}
          customFields={customFields}
          submitStyle={submitStyle}
          portalRoot={portalRoot ?? null}
        />
      )}
    </>
  );
}

/* ─── Property Panel ────────────────────────── */

function FieldToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "10px 12px",
        borderRadius: 10,
        border: "1px solid #e5e7eb",
        background: "#fff",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1f2937" }}>{label}</div>
        {description && (
          <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{description}</div>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        style={{
          flexShrink: 0,
          width: 36,
          height: 20,
          borderRadius: 10,
          border: "none",
          cursor: "pointer",
          position: "relative",
          background: checked ? "#0ea5e9" : "#d1d5db",
          transition: "background 0.18s ease",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 2,
            left: checked ? 18 : 2,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#fff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            transition: "left 0.18s ease",
          }}
        />
      </button>
    </div>
  );
}

function FeedbackPropertyPanel({ props, onChange }: PropertyPanelProps) {
  const [section, setSection] = useState<"style" | "fields" | "form" | "submit">("style");

  const labelCls = "text-xs font-medium text-gray-500 uppercase tracking-wide";
  const inputCls = "mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none";

  const showName = props.showNameField !== false;
  const showPhone = props.showPhoneField !== false;
  const showEmail = props.showEmailField !== false;
  const showDetails = props.showDetailsField !== false;

  const customFields = Array.isArray(props.customFields) ? (props.customFields as CustomField[]) : [];

  const updateCustomField = (id: string, patch: Partial<CustomField>) => {
    onChange({ customFields: customFields.map((f) => (f.id === id ? { ...f, ...patch } : f)) });
  };
  const removeCustomField = (id: string) => {
    onChange({ customFields: customFields.filter((f) => f.id !== id) });
  };
  const addCustomField = () => {
    const id = `cf_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    const next: CustomField = { id, label: "New field", placeholder: "", type: "text", required: false };
    onChange({ customFields: [...customFields, next] });
  };

  const tabLabel = (s: "style" | "fields" | "form" | "submit") =>
    s === "style" ? "Button" : s === "fields" ? "Fields" : s === "form" ? "Copy" : "Submit";

  return (
    <div className="space-y-3">
      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, padding: 3, background: "#f3f4f6", borderRadius: 8 }}>
        {(["style", "fields", "form", "submit"] as const).map((s) => (
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

      {section === "style" && (
        <>
          <label className="block">
            <span className={labelCls}>Button label</span>
            <input
              type="text"
              className={inputCls}
              value={(props.text as string) || ""}
              onChange={(e) => onChange({ text: e.target.value })}
            />
          </label>
          <label className="block">
            <span className={labelCls}>Variant</span>
            <select
              className={inputCls}
              value={(props.variant as string) || "filled"}
              onChange={(e) => onChange({ variant: e.target.value })}
            >
              <option value="filled">Filled</option>
              <option value="outline">Outline</option>
              <option value="link">Link</option>
            </select>
          </label>
          <label className="block">
            <span className={labelCls}>Background / Accent</span>
            <div className="mt-1 flex gap-2 items-center">
              <HexColorPopover
                value={(props.bgColor as string) || ""}
                onChange={(hex) => onChange({ bgColor: hex })}
                fallback="#0ea5e9"
              />
              <input
                type="text"
                className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
                value={(props.bgColor as string) || "#0ea5e9"}
                onChange={(e) => onChange({ bgColor: e.target.value })}
              />
            </div>
          </label>
          <label className="block">
            <span className={labelCls}>Text color</span>
            <div className="mt-1 flex gap-2 items-center">
              <HexColorPopover
                value={(props.textColor as string) || ""}
                onChange={(hex) => onChange({ textColor: hex })}
                fallback="#ffffff"
              />
              <input
                type="text"
                className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
                value={(props.textColor as string) || "#ffffff"}
                onChange={(e) => onChange({ textColor: e.target.value })}
              />
            </div>
          </label>
          <label className="block">
            <span className={labelCls}>Border radius</span>
            <input
              type="number"
              className={inputCls}
              value={(props.borderRadius as number) ?? 12}
              onChange={(e) => onChange({ borderRadius: Number(e.target.value) })}
              min={0}
              max={999}
            />
          </label>
          <label className="block">
            <span className={labelCls}>Font size</span>
            <input
              type="number"
              className={inputCls}
              value={(props.fontSize as number) ?? 15}
              onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
              min={8}
              max={48}
            />
          </label>
        </>
      )}

      {section === "fields" && (
        <>
          <div>
            <span className={labelCls}>Built-in fields</span>
            <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 6 }}>
              <FieldToggle label="Name" description="Customer's name" checked={showName} onChange={(v) => onChange({ showNameField: v })} />
              <FieldToggle label="Phone" description="Phone number (required when shown)" checked={showPhone} onChange={(v) => onChange({ showPhoneField: v })} />
              <FieldToggle label="Email" description="Email address (optional when shown)" checked={showEmail} onChange={(v) => onChange({ showEmailField: v })} />
              <FieldToggle label="Details" description="The main message textarea" checked={showDetails} onChange={(v) => onChange({ showDetailsField: v })} />
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <span className={labelCls}>Custom fields</span>
              <button
                type="button"
                onClick={addCustomField}
                style={{
                  padding: "5px 10px",
                  fontSize: 11,
                  fontWeight: 600,
                  borderRadius: 6,
                  border: "1px solid #0ea5e9",
                  background: "#0ea5e9",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                + Add field
              </button>
            </div>

            {customFields.length === 0 && (
              <div style={{ padding: "12px 14px", borderRadius: 10, border: "1px dashed #e5e7eb", background: "#fafafa", fontSize: 11.5, color: "#9ca3af", textAlign: "center" }}>
                No extra fields yet. Add one to collect things like address, order number, or rating.
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {customFields.map((f) => (
                <div key={f.id} style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff", display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      type="text"
                      value={f.label}
                      onChange={(e) => updateCustomField(f.id, { label: e.target.value })}
                      placeholder="Field label"
                      style={{ flex: 1, padding: "7px 10px", border: "1px solid #e5e7eb", borderRadius: 7, fontSize: 12.5, outline: "none" }}
                    />
                    <button
                      type="button"
                      onClick={() => removeCustomField(f.id)}
                      aria-label="Remove field"
                      style={{ width: 32, height: 32, borderRadius: 7, border: "1px solid #fecaca", background: "#fef2f2", color: "#b91c1c", cursor: "pointer", fontSize: 14, lineHeight: 1 }}
                    >
                      ×
                    </button>
                  </div>
                  <input
                    type="text"
                    value={f.placeholder ?? ""}
                    onChange={(e) => updateCustomField(f.id, { placeholder: e.target.value })}
                    placeholder="Placeholder (optional)"
                    style={{ padding: "7px 10px", border: "1px solid #e5e7eb", borderRadius: 7, fontSize: 12.5, outline: "none" }}
                  />
                  <div style={{ display: "flex", gap: 8 }}>
                    <select
                      value={f.type}
                      onChange={(e) => updateCustomField(f.id, { type: e.target.value as CustomField["type"] })}
                      style={{ flex: 1, padding: "7px 10px", border: "1px solid #e5e7eb", borderRadius: 7, fontSize: 12.5, background: "#fff", outline: "none" }}
                    >
                      <option value="text">Text</option>
                      <option value="textarea">Long text</option>
                      <option value="tel">Phone</option>
                      <option value="email">Email</option>
                      <option value="number">Number</option>
                      <option value="image">Image upload</option>
                    </select>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#374151", cursor: "pointer", paddingLeft: 4 }}>
                      <input
                        type="checkbox"
                        checked={f.required}
                        onChange={(e) => updateCustomField(f.id, { required: e.target.checked })}
                      />
                      Required
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {section === "form" && (
        <>
          <label className="block">
            <span className={labelCls}>Sheet title</span>
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
            <span className={labelCls}>Success message</span>
            <textarea className={inputCls} rows={3} value={(props.successMessage as string) || ""} onChange={(e) => onChange({ successMessage: e.target.value })} placeholder="Your feedback has been received." />
          </label>
        </>
      )}

      {section === "submit" && (
        <>
          <div style={{ padding: "10px 12px", borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0", fontSize: 11.5, color: "#64748b", lineHeight: 1.4 }}>
            Style the <strong>Send feedback</strong> button inside the popup. Leave colors blank to inherit from the trigger button.
          </div>
          <label className="block">
            <span className={labelCls}>Background color</span>
            <div className="mt-1 flex gap-2 items-center">
              <HexColorPopover
                value={(props.submitBgColor as string) || ""}
                onChange={(hex) => onChange({ submitBgColor: hex })}
                fallback={(props.bgColor as string) || "#0ea5e9"}
              />
              <input
                type="text"
                className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
                value={(props.submitBgColor as string) || ""}
                onChange={(e) => onChange({ submitBgColor: e.target.value })}
                placeholder={(props.bgColor as string) || "#0ea5e9"}
              />
            </div>
          </label>
          <label className="block">
            <span className={labelCls}>Text color</span>
            <div className="mt-1 flex gap-2 items-center">
              <HexColorPopover
                value={(props.submitTextColor as string) || ""}
                onChange={(hex) => onChange({ submitTextColor: hex })}
                fallback="#ffffff"
              />
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
            <select
              className={inputCls}
              value={(props.submitFontWeight as string) || "600"}
              onChange={(e) => onChange({ submitFontWeight: e.target.value })}
            >
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
  type: "feedback",
  label: "Feedback",
  icon: <MessageSquareHeart size={16} />,
  category: "interactive",
  defaultProps: {
    text: "Send Feedback",
    variant: "filled",
    bgColor: "#0ea5e9",
    textColor: "#ffffff",
    borderRadius: 12,
    fontSize: 15,
    fontWeight: "600",
    formTitle: "Share your feedback",
    formSubtitle: "We'd love to hear about your experience.",
    submitLabel: "Send feedback",
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
  defaultTransform: { width: 220, height: 52 },
  component: FeedbackElementComponent,
  propertyPanel: FeedbackPropertyPanel,
});
