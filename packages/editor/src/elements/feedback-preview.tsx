/* ─────────────────────────────────────────────
 * Feedback Form Preview — Live, non-interactive
 * preview shown next to the canvas while the
 * author is editing a Feedback element.
 * ──────────────────────────────────────────── */

"use client";

import React from "react";
import { Eye } from "lucide-react";
import { useCanvasStore } from "../engine/canvas-store";
import { getDefaultFeedbackLabels, type CustomField, type FeedbackSheetFields, type FeedbackSheetLabels } from "./feedback-sheet";

const DEFAULT_FIELDS: FeedbackSheetFields = { name: true, phone: true, email: true, details: true };

function resolveLabels(props: Record<string, unknown>): FeedbackSheetLabels {
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

export function FeedbackFormPreview() {
  const selectedIds = useCanvasStore((s) => s.selectedIds);
  const elements = useCanvasStore((s) => s.document.elements);

  // Show the preview when exactly one Feedback element is selected.
  if (selectedIds.length !== 1) return null;
  const firstId = selectedIds[0];
  if (!firstId) return null;
  const el = elements[firstId];
  if (!el || el.type !== "feedback") return null;

  const props = el.props;
  const labels = resolveLabels(props);
  const accent = (props.bgColor as string) || "#0ea5e9";
  const fields: FeedbackSheetFields = {
    name: props.showNameField !== false,
    phone: props.showPhoneField !== false,
    email: props.showEmailField !== false,
    details: props.showDetailsField !== false,
  };
  const customFields: CustomField[] = Array.isArray(props.customFields) ? (props.customFields as CustomField[]) : [];
  const visible: FeedbackSheetFields = { ...DEFAULT_FIELDS, ...fields };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    fontSize: 13,
    fontFamily: "inherit",
    background: "#f9fafb",
    color: "#94a3b8",
    outline: "none",
    boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 11,
    fontWeight: 600,
    color: "#475569",
    marginBottom: 5,
    letterSpacing: "0.01em",
  };

  return (
    <div
      style={{
        width: 280,
        flexShrink: 0,
        background: "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)",
        borderRadius: 18,
        border: "1px solid rgba(15,23,42,0.06)",
        boxShadow: "0 8px 28px rgba(15,23,42,0.08), 0 1px 2px rgba(15,23,42,0.04)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        animation: "slideInRight 0.2s ease",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 14px",
          borderBottom: "1px solid rgba(15,23,42,0.06)",
          background: "#fff",
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: 7,
            background: `${accent}1A`,
            color: accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Eye size={13} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#1e1e2e", letterSpacing: "-0.005em" }}>Form preview</div>
          <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 1 }}>How the sheet will look on the live page</div>
        </div>
      </div>

      {/* Phone-frame mock */}
      <div style={{ padding: "14px 12px", overflowY: "auto" }}>
        <div
          style={{
            position: "relative",
            borderRadius: 18,
            border: "8px solid #0f172a",
            background: "#0f172a",
            boxShadow: "0 12px 32px rgba(15,23,42,0.18)",
          }}
        >
          {/* Sheet body */}
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              maxHeight: 480,
            }}
          >
            <div style={{ display: "flex", justifyContent: "center", padding: "8px 0 4px" }}>
              <div style={{ width: 32, height: 3, borderRadius: 999, background: "#e2e8f0" }} />
            </div>
            <div style={{ padding: "2px 14px 6px" }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.01em" }}>{labels.title}</h3>
              {labels.subtitle && <p style={{ margin: "3px 0 0", fontSize: 11.5, color: "#64748b", lineHeight: 1.4 }}>{labels.subtitle}</p>}
            </div>
            <div style={{ padding: "8px 14px 14px", display: "flex", flexDirection: "column", gap: 10, overflowY: "auto" }}>
              {visible.name && (
                <div>
                  <label style={labelStyle}>{labels.nameLabel}</label>
                  <div style={inputStyle}>{labels.namePlaceholder}</div>
                </div>
              )}
              {visible.phone && (
                <div>
                  <label style={labelStyle}>{labels.phoneLabel}</label>
                  <div style={inputStyle}>{labels.phonePlaceholder}</div>
                </div>
              )}
              {visible.email && (
                <div>
                  <label style={labelStyle}>{labels.emailLabel}</label>
                  <div style={inputStyle}>{labels.emailPlaceholder}</div>
                </div>
              )}
              {visible.details && (
                <div>
                  <label style={labelStyle}>{labels.detailsLabel}</label>
                  <div style={{ ...inputStyle, minHeight: 64 }}>{labels.detailsPlaceholder}</div>
                </div>
              )}
              {customFields.map((f) => (
                <div key={f.id}>
                  <label style={labelStyle}>
                    {f.label || "Untitled field"}
                    {!f.required && <span style={{ color: "#cbd5e1", fontWeight: 400, marginLeft: 4 }}>(optional)</span>}
                  </label>
                  <div style={{ ...inputStyle, minHeight: f.type === "textarea" ? 56 : undefined }}>{f.placeholder || (f.type === "textarea" ? "Long answer" : "Short answer")}</div>
                </div>
              ))}

              {/* Submit button preview */}
              <div
                style={{
                  marginTop: 4,
                  padding: "10px 14px",
                  borderRadius: 12,
                  background: accent,
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                  textAlign: "center",
                  letterSpacing: "0.01em",
                }}
              >
                {labels.submitLabel}
              </div>

              {!visible.name && !visible.phone && !visible.email && !visible.details && customFields.length === 0 && (
                <div style={{ padding: "12px 14px", borderRadius: 10, background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", fontSize: 11.5 }}>
                  No fields are enabled. Toggle at least one field or add a custom field in the Fields tab.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
