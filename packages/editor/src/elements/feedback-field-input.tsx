/* ─────────────────────────────────────────────
 * Feedback Field Input - renders a single form field
 * (label + control) for any FeedbackFieldType.
 *
 * Shared by:
 *  - FeedbackFormCore   (vertical stack + free layout)
 *  - FeedbackFreeCanvas (editor drag/position layer)
 *
 * Owns no value state itself; the host passes the value
 * and an onChange. When `interactive` is false the whole
 * field is made pointer-inert (used in the editor so block
 * drags aren't swallowed by inner inputs).
 * ──────────────────────────────────────────── */

"use client";

import React, { useRef, useState } from "react";
import { ImagePlus, Loader2, Star } from "lucide-react";
import { EMOJI_SCALE, type CustomField } from "./feedback-sheet";

export interface FieldInputProps {
  field: CustomField;
  value: string | string[] | number | undefined;
  onChange: (v: string | string[] | number) => void;
  accentColor: string;
  /** Options for a `branch` picker. */
  branchOptions?: Array<{ id: string; name: string }>;
  /** When false, the field is rendered but pointer-inert (editor preview). */
  interactive?: boolean;
}

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

export function FieldInput({ field: f, value, onChange: setValue, accentColor, branchOptions = [], interactive = true }: FieldInputProps) {
  const strVal = typeof value === "string" ? value : "";
  const numVal = typeof value === "number" ? value : null;
  const arrVal = Array.isArray(value) ? value : [];

  // Built-ins carry their own label copy ("Email (optional)" etc.); custom fields
  // get an "(optional)" suffix appended when they aren't required.
  const labelNode = (
    <label style={labelStyle}>
      {f.label}
      {!f.builtin && !f.required && <span style={{ color: "#9ca3af", fontWeight: 400, marginLeft: 4 }}>(optional)</span>}
    </label>
  );

  let control: React.ReactNode;

  if (f.type === "textarea") {
    control = (
      <textarea
        required={f.required}
        value={strVal}
        onChange={(e) => setValue(e.target.value)}
        placeholder={f.placeholder}
        rows={3}
        style={{ ...inputStyle, resize: "vertical", minHeight: 80 }}
      />
    );
  } else if (f.type === "image") {
    control = <ImageUploadField value={strVal} onChange={setValue} accentColor={accentColor} placeholder={f.placeholder} />;
  } else if (f.type === "date") {
    control = <input type="date" required={f.required} value={strVal} onChange={(e) => setValue(e.target.value)} style={inputStyle} />;
  } else if (f.type === "select") {
    control = (
      <select required={f.required} value={strVal} onChange={(e) => setValue(e.target.value)} style={inputStyle}>
        <option value="">{f.placeholder || "Select an option…"}</option>
        {(f.options ?? []).map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  } else if (f.type === "branch") {
    control = (
      <select required={f.required} value={strVal} onChange={(e) => setValue(e.target.value)} style={inputStyle}>
        <option value="">{f.placeholder || "Select your branch…"}</option>
        {branchOptions.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>
    );
  } else if (f.type === "multiselect") {
    const toggle = (opt: string) => setValue(arrVal.includes(opt) ? arrVal.filter((o) => o !== opt) : [...arrVal, opt]);
    control = (
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 2 }}>
        {(f.options ?? []).map((opt, i) => {
          const checked = arrVal.includes(opt);
          return (
            <label
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 10,
                border: `1px solid ${checked ? accentColor : "#e5e7eb"}`,
                background: checked ? `${accentColor}0F` : "#fff",
                cursor: "pointer",
                fontSize: 14,
                color: "#0f172a",
              }}
            >
              <input type="checkbox" checked={checked} onChange={() => toggle(opt)} style={{ accentColor }} />
              {opt}
            </label>
          );
        })}
      </div>
    );
  } else if (f.type === "star") {
    const count = Math.max(2, Math.min(10, f.max ?? 5));
    control = (
      <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
        {Array.from({ length: count }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setValue(n)}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 2, lineHeight: 0 }}
          >
            <Star
              size={30}
              style={{
                fill: numVal != null && n <= numVal ? "#f59e0b" : "transparent",
                color: numVal != null && n <= numVal ? "#f59e0b" : "#cbd5e1",
                transition: "fill 0.1s ease, color 0.1s ease",
              }}
            />
          </button>
        ))}
      </div>
    );
  } else if (f.type === "emoji") {
    control = (
      <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
        {EMOJI_SCALE.map((face, i) => {
          const score = i + 1;
          const active = numVal === score;
          return (
            <button
              key={score}
              type="button"
              onClick={() => setValue(score)}
              aria-label={`Rating ${score} of 5`}
              style={{
                fontSize: 26,
                lineHeight: 1,
                padding: "8px 10px",
                borderRadius: 12,
                border: `1px solid ${active ? accentColor : "#e5e7eb"}`,
                background: active ? `${accentColor}14` : "#fff",
                cursor: "pointer",
                filter: active ? "none" : "grayscale(0.5)",
                opacity: active || numVal == null ? 1 : 0.55,
                transition: "all 0.1s ease",
              }}
            >
              {face}
            </button>
          );
        })}
      </div>
    );
  } else if (f.type === "nps") {
    control = (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 2 }}>
        {Array.from({ length: 11 }, (_, n) => n).map((n) => {
          const active = numVal === n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => setValue(n)}
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                border: `1px solid ${active ? accentColor : "#e5e7eb"}`,
                background: active ? accentColor : "#fff",
                color: active ? "#fff" : "#475569",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.1s ease",
              }}
            >
              {n}
            </button>
          );
        })}
      </div>
    );
  } else if (f.type === "slider") {
    const min = f.min ?? 0;
    const max = f.max ?? 10;
    const step = f.step ?? 1;
    const current = numVal ?? min;
    // Slider shows its current value beside the label.
    return (
      <div style={interactive ? undefined : { pointerEvents: "none" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          {labelNode}
          <span style={{ fontSize: 14, fontWeight: 700, color: accentColor }}>{current}</span>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={current}
          onChange={(e) => setValue(Number(e.target.value))}
          style={{ width: "100%", accentColor }}
        />
      </div>
    );
  } else {
    // text / tel / email / number
    control = <input type={f.type} required={f.required} value={strVal} onChange={(e) => setValue(e.target.value)} placeholder={f.placeholder} style={inputStyle} />;
  }

  return (
    <div style={interactive ? undefined : { pointerEvents: "none" }}>
      {labelNode}
      {control}
    </div>
  );
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
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 10, borderRadius: 12, border: "1px solid #e5e7eb", background: "#fff" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={value} alt="Uploaded" style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8, background: "#f1f5f9", flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0, fontSize: 12.5, color: "#475569" }}>
          <div style={{ fontWeight: 600, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Image uploaded</div>
          <a href={value} target="_blank" rel="noreferrer" style={{ color: accentColor, textDecoration: "none", fontSize: 11.5 }}>
            View
          </a>
        </div>
        <button
          type="button"
          onClick={() => {
            onChange("");
            if (inputRef.current) inputRef.current.value = "";
          }}
          style={{ flexShrink: 0, width: 32, height: 32, borderRadius: 8, border: "1px solid #fecaca", background: "#fef2f2", color: "#b91c1c", cursor: "pointer", fontSize: 14, lineHeight: 1 }}
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
            const file = e.target.files?.[0];
            if (file) void handleSelect(file);
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
          const file = e.target.files?.[0];
          if (file) void handleSelect(file);
        }}
      />
      {error && <div style={{ marginTop: 6, fontSize: 12, color: "#b91c1c" }}>{error}</div>}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
