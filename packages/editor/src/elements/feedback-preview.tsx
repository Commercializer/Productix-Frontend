/* ─────────────────────────────────────────────
 * Feedback Popup Builder - the editable popup shown
 * beside the canvas while a Feedback button is
 * selected. The author drags / arranges the form's
 * field blocks here (free 12-col layout); it mirrors
 * how the bottom-sheet popup looks on the live page.
 * ──────────────────────────────────────────── */

"use client";

import React from "react";
import { LayoutTemplate } from "lucide-react";
import { useCanvasStore } from "../engine/canvas-store";
import { FeedbackFreeCanvas } from "./feedback-free-canvas";
import { getDefaultFeedbackLabels, type FeedbackSheetLabels } from "./feedback-sheet";

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
  const updateElementProps = useCanvasStore((s) => s.updateElementProps);

  // Show the builder when exactly one Feedback (button → popup) element is selected.
  if (selectedIds.length !== 1) return null;
  const elementId = selectedIds[0];
  if (!elementId) return null;
  const el = elements[elementId];
  if (!el || el.type !== "feedback") return null;

  const props = el.props;
  const labels = resolveLabels(props);
  const accent = (props.bgColor as string) || "#0ea5e9";
  const submitBg = (props.submitBgColor as string) || accent;
  const submitText = (props.submitTextColor as string) || "#ffffff";
  const submitRadius = typeof props.submitBorderRadius === "number" ? (props.submitBorderRadius as number) : 14;
  const submitFontSize = typeof props.submitFontSize === "number" ? (props.submitFontSize as number) : 15;
  const submitFontWeight = (props.submitFontWeight as string) || "600";
  const submitPreviewFontSize = Math.max(11, Math.round((submitFontSize / 15) * 13));
  const submitPreviewRadius = Math.max(4, Math.round((submitRadius / 14) * 12));

  return (
    <div
      style={{
        width: 320,
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
          <LayoutTemplate size={13} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#1e1e2e", letterSpacing: "-0.005em" }}>Popup builder</div>
          <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 1 }}>Drag fields to arrange · resize for columns</div>
        </div>
      </div>

      {/* Phone-frame mock with the editable form */}
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
              maxHeight: 520,
            }}
          >
            <div style={{ display: "flex", justifyContent: "center", padding: "8px 0 4px" }}>
              <div style={{ width: 32, height: 3, borderRadius: 999, background: "#e2e8f0" }} />
            </div>
            <div style={{ padding: "2px 14px 6px" }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.01em" }}>{labels.title}</h3>
              {labels.subtitle && <p style={{ margin: "3px 0 0", fontSize: 11.5, color: "#64748b", lineHeight: 1.4 }}>{labels.subtitle}</p>}
            </div>

            <div style={{ padding: "10px 14px 14px", overflowY: "auto" }}>
              <FeedbackFreeCanvas
                elementId={elementId}
                props={props}
                labels={labels}
                accentColor={accent}
                onChange={(changes) => updateElementProps(elementId, changes)}
              />

              {/* Submit button preview */}
              <div
                style={{
                  marginTop: 14,
                  padding: "10px 14px",
                  borderRadius: submitPreviewRadius,
                  background: submitBg,
                  color: submitText,
                  fontSize: submitPreviewFontSize,
                  fontWeight: submitFontWeight,
                  textAlign: "center",
                  letterSpacing: "0.01em",
                }}
              >
                {labels.submitLabel}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
