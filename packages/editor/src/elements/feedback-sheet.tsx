/* ─────────────────────────────────────────────
 * Feedback Bottom Sheet — Native-app style modal
 *
 * Slides up from the bottom of the screen with a
 * dimmed backdrop. Used by the Feedback element on
 * published product pages so visitors can leave
 * feedback or an inquiry against a product.
 * ──────────────────────────────────────────── */

"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, ImagePlus, Loader2 } from "lucide-react";

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

export interface CustomField {
  id: string;
  label: string;
  placeholder?: string;
  type: "text" | "textarea" | "tel" | "email" | "number" | "image";
  required: boolean;
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
  /** Which fields to show. Defaults to all enabled. */
  fields?: Partial<FeedbackSheetFields>;
  /** Author-defined custom fields rendered after the built-ins. */
  customFields?: CustomField[];
  /** Optional style overrides for the submit button. Falls back to accentColor / sensible defaults. */
  submitStyle?: FeedbackSubmitStyle;
  /**
   * Optional element to portal the sheet into. When set, the sheet renders
   * with `position: absolute` inside this element instead of `position: fixed`
   * on the body — useful for previews inside a phone mockup. The host element
   * should be `position: relative`.
   */
  portalRoot?: HTMLElement | null;
}

const DEFAULT_FIELDS: FeedbackSheetFields = { name: true, phone: true, email: true, details: true };

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

export function FeedbackSheet({ open, onClose, productId, labels, accentColor = "#0ea5e9", fields, customFields, submitStyle, portalRoot }: FeedbackSheetProps) {
  const contained = !!portalRoot;
  const submitBg = submitStyle?.bgColor ?? accentColor;
  const submitText = submitStyle?.textColor ?? "#ffffff";
  const submitRadius = submitStyle?.borderRadius ?? 14;
  const submitFontSize = submitStyle?.fontSize ?? 15;
  const submitFontWeight = submitStyle?.fontWeight ?? "600";
  const visible: FeedbackSheetFields = { ...DEFAULT_FIELDS, ...fields };
  const extras = customFields ?? [];
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [details, setDetails] = useState("");
  const [extraValues, setExtraValues] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorText, setErrorText] = useState<string | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Reset form when sheet closes (after the close animation completes).
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setName("");
        setPhone("");
        setEmail("");
        setDetails("");
        setExtraValues({});
        setStatus("idle");
        setErrorText(null);
        setSubmitting(false);
      }, 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Lock body scroll while open — only when the sheet is fullscreen.
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

  // Each visible field (except email) is required to submit. Email stays
  // optional even when shown — common pattern for contact forms.
  const requiredFilled =
    (!visible.name || name.trim().length > 0) &&
    (!visible.phone || phone.trim().length > 0) &&
    (!visible.details || details.trim().length > 0) &&
    extras.every((f) => !f.required || (extraValues[f.id] ?? "").trim().length > 0);
  // Guard against a form where the author disabled every input.
  const hasAnyVisible = visible.name || visible.phone || visible.email || visible.details || extras.length > 0;
  const canSubmit = hasAnyVisible && requiredFilled && !submitting;

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
      // Build the extra payload using each field's label as the key so the
      // dashboard can read it without needing to know about field ids.
      const extraPayload: Record<string, string> = {};
      for (const f of extras) {
        const v = (extraValues[f.id] ?? "").trim();
        if (v.length > 0) extraPayload[f.label] = v;
      }
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: productId ?? null,
          name: visible.name ? name.trim() : "",
          phone: visible.phone ? phone.trim() : "",
          email: visible.email ? email.trim() : "",
          details: visible.details ? details.trim() : "",
          extra: extraPayload,
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

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    fontSize: 15,
    fontFamily: "inherit",
    background: "#fff",
    color: "#0f172a",
    outline: "none",
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: "#475569",
    marginBottom: 6,
    letterSpacing: "0.01em",
  };

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
          {status === "success" ? (
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
              <button
                type="button"
                onClick={onClose}
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
                {labels.cancelLabel}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {visible.name && (
                <div>
                  <label style={labelStyle}>{labels.nameLabel}</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={labels.namePlaceholder}
                    style={inputStyle}
                  />
                </div>
              )}
              {visible.phone && (
                <div>
                  <label style={labelStyle}>{labels.phoneLabel}</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={labels.phonePlaceholder}
                    style={inputStyle}
                  />
                </div>
              )}
              {visible.email && (
                <div>
                  <label style={labelStyle}>{labels.emailLabel}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={labels.emailPlaceholder}
                    style={inputStyle}
                  />
                </div>
              )}
              {visible.details && (
                <div>
                  <label style={labelStyle}>{labels.detailsLabel}</label>
                  <textarea
                    required
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder={labels.detailsPlaceholder}
                    rows={4}
                    style={{ ...inputStyle, resize: "vertical", minHeight: 96 }}
                  />
                </div>
              )}

              {extras.map((f) => {
                const value = extraValues[f.id] ?? "";
                const onValueChange = (v: string) => setExtraValues((prev) => ({ ...prev, [f.id]: v }));
                const labelNode = (
                  <label style={labelStyle}>
                    {f.label}
                    {!f.required && <span style={{ color: "#9ca3af", fontWeight: 400, marginLeft: 4 }}>(optional)</span>}
                  </label>
                );
                if (f.type === "textarea") {
                  return (
                    <div key={f.id}>
                      {labelNode}
                      <textarea
                        required={f.required}
                        value={value}
                        onChange={(e) => onValueChange(e.target.value)}
                        placeholder={f.placeholder}
                        rows={3}
                        style={{ ...inputStyle, resize: "vertical", minHeight: 80 }}
                      />
                    </div>
                  );
                }
                if (f.type === "image") {
                  return (
                    <div key={f.id}>
                      {labelNode}
                      <ImageUploadField
                        value={value}
                        onChange={onValueChange}
                        accentColor={accentColor}
                        placeholder={f.placeholder}
                      />
                    </div>
                  );
                }
                return (
                  <div key={f.id}>
                    {labelNode}
                    <input
                      type={f.type}
                      required={f.required}
                      value={value}
                      onChange={(e) => onValueChange(e.target.value)}
                      placeholder={f.placeholder}
                      style={inputStyle}
                    />
                  </div>
                );
              })}

              {errorText && (
                <div style={{ padding: "10px 12px", borderRadius: 10, background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", fontSize: 13 }}>
                  {errorText}
                </div>
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
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(content, portalRoot ?? document.body);
}

/* ─── Image upload field ────────────────────── */

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  accentColor: string;
  placeholder?: string;
}

function ImageUploadField({ value, onChange, accentColor, placeholder }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = async (file: File) => {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be 5MB or smaller.");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/feedback/upload", { method: "POST", body: fd });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error || "Upload failed");
      if (typeof body?.url !== "string") throw new Error("Upload failed");
      onChange(body.url);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (value) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: 10,
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          background: "#fff",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={value}
          alt="Uploaded"
          style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8, background: "#f1f5f9", flexShrink: 0 }}
        />
        <div style={{ flex: 1, minWidth: 0, fontSize: 12.5, color: "#475569" }}>
          <div style={{ fontWeight: 600, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            Image uploaded
          </div>
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            style={{ color: accentColor, textDecoration: "none", fontSize: 11.5 }}
          >
            View
          </a>
        </div>
        <button
          type="button"
          onClick={() => {
            onChange("");
            if (inputRef.current) inputRef.current.value = "";
          }}
          style={{
            flexShrink: 0,
            width: 32,
            height: 32,
            borderRadius: 8,
            border: "1px solid #fecaca",
            background: "#fef2f2",
            color: "#b91c1c",
            cursor: "pointer",
            fontSize: 14,
            lineHeight: 1,
          }}
          aria-label="Remove image"
        >
          ×
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleSelect(f);
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        style={{
          width: "100%",
          padding: "18px 14px",
          borderRadius: 12,
          border: `1.5px dashed ${uploading ? "#cbd5e1" : "#e5e7eb"}`,
          background: uploading ? "#f8fafc" : "#fafafa",
          color: "#475569",
          cursor: uploading ? "wait" : "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          fontFamily: "inherit",
          fontSize: 13,
          transition: "border-color 0.15s ease, background 0.15s ease",
        }}
      >
        {uploading ? (
          <>
            <Loader2 size={22} style={{ animation: "spin 1s linear infinite", color: accentColor }} />
            <span style={{ color: "#64748b" }}>Uploading…</span>
          </>
        ) : (
          <>
            <ImagePlus size={22} style={{ color: accentColor }} />
            <span style={{ fontWeight: 600, color: "#0f172a" }}>{placeholder || "Choose an image"}</span>
            <span style={{ fontSize: 11, color: "#94a3b8" }}>JPG, PNG, GIF, WebP or SVG · up to 5MB</span>
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleSelect(f);
        }}
      />
      {error && (
        <div style={{ marginTop: 6, fontSize: 12, color: "#b91c1c" }}>{error}</div>
      )}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
