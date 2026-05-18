/* ─────────────────────────────────────────────
 * Import Layout Dialog — paste AI-generated JSON
 * (or any layout JSON) and load it onto the canvas.
 * Includes a "Copy AI prompt" button so users can
 * brief their LLM with the live element catalog.
 * ──────────────────────────────────────────── */

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Sparkles, Copy, Check, X, AlertCircle, Wand2, ExternalLink } from "lucide-react";
import { useCanvasStore } from "../engine/canvas-store";
import { buildAIPrompt, importLayoutFromJson, type AIBrief } from "../utils/import-layout";
import { HexColorPopover } from "../elements/hex-color-popover";

interface ImportLayoutDialogProps {
  open: boolean;
  onClose: () => void;
}

const EMPTY_BRIEF: AIBrief = {
  productName: "",
  productCategory: "",
  productDescription: "",
  vibe: "",
  backgroundColor: "",
  accentColor: "",
  audience: "",
  keyFeatures: "",
  ctaText: "",
  extraNotes: "",
};

const CATEGORY_OPTIONS = [
  "Food & Beverage",
  "Skincare & Beauty",
  "Fashion & Apparel",
  "Tech & Electronics",
  "Fitness & Wellness",
  "Home & Living",
  "Toys & Kids",
  "Automotive",
  "Hospitality / Travel",
  "Other",
];

const VIBE_OPTIONS = [
  "Bold & energetic",
  "Minimal & elegant",
  "Playful & fun",
  "Premium & luxurious",
  "Natural & organic",
  "Tech & futuristic",
  "Retro / vintage",
  "Warm & friendly",
];

// Claude is the only provider that reliably accepts a prompt this long via
// URL. ChatGPT and Gemini have hard URL-length caps that our catalog-laden
// prompt blows through (HTTP 431), so for those we offer a "copy + open"
// flow — clipboard carries the prompt, user pastes with ⌘V / Ctrl+V.
const AI_TARGETS = [
  { id: "claude", label: "Claude", url: (q: string) => `https://claude.ai/new?q=${encodeURIComponent(q)}`, mode: "prefill" as const },
  { id: "chatgpt", label: "ChatGPT", url: (_: string) => "https://chatgpt.com/", mode: "copy" as const },
  { id: "gemini", label: "Gemini", url: (_: string) => "https://gemini.google.com/app", mode: "copy" as const },
] as const;

export function ImportLayoutDialog({ open, onClose }: ImportLayoutDialogProps) {
  const loadDocument = useCanvasStore((s) => s.loadDocument);
  const [brief, setBrief] = useState<AIBrief>(EMPTY_BRIEF);
  const [json, setJson] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [customCategoryMode, setCustomCategoryMode] = useState(false);

  useEffect(() => {
    if (!open) {
      setBrief(EMPTY_BRIEF);
      setJson("");
      setError(null);
      setWarnings([]);
      setCopied(false);
      setCustomCategoryMode(false);
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const prompt = useMemo(() => buildAIPrompt(brief), [brief]);

  if (!open) return null;

  const setField = <K extends keyof AIBrief>(key: K, value: AIBrief[K]) => {
    setBrief((prev) => ({ ...prev, [key]: value }));
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Couldn't copy to clipboard — select the prompt manually.");
    }
  };

  const handleOpenIn = (target: typeof AI_TARGETS[number]) => {
    // Order matters: fire clipboard write first while the document still has
    // focus (writeText silently fails if focus has moved). Both calls run
    // synchronously in the same user-gesture turn, so popup blocker is happy.
    navigator.clipboard.writeText(prompt).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      },
      () => {
        // Non-fatal — user can still hit "Copy AI prompt" manually.
      },
    );
    window.open(target.url(prompt), "_blank", "noopener,noreferrer");
  };

  const handleImport = () => {
    setError(null);
    setWarnings([]);
    const result = importLayoutFromJson(json);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    loadDocument(result.document);
    setWarnings(result.warnings);
    if (result.warnings.length === 0) onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(15, 23, 42, 0.55)",
        backdropFilter: "blur(4px)",
        padding: 24,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 720,
          maxHeight: "90vh",
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 24px 60px rgba(15,23,42,0.25)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          fontFamily: "var(--font-sans)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: "#0284c7", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
            <Sparkles size={16} />
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: 0 }}>Import layout from JSON</h2>
            <p style={{ fontSize: 11, color: "#94a3b8", margin: "2px 0 0" }}>
              Generate a layout with your favourite AI, then paste the JSON here.
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close"
            style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "transparent", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Step 1 — Brief */}
          <section>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#0284c7", letterSpacing: "0.06em", textTransform: "uppercase" }}>Step 1</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>Tell us about the product</span>
            </div>
            <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 12px", lineHeight: 1.5 }}>
              All fields are optional — anything you fill in gets baked into the prompt so the AI produces a more on-brand layout.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Field label="Product name">
                <input type="text" value={brief.productName ?? ""} onChange={(e) => setField("productName", e.target.value)} placeholder="e.g. Aurora Cold Brew" style={inputStyle} />
              </Field>
              <Field label="Category">
                <select
                  value={customCategoryMode ? "Other" : (brief.productCategory ?? "")}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === "Other") {
                      setCustomCategoryMode(true);
                      setField("productCategory", "");
                    } else {
                      setCustomCategoryMode(false);
                      setField("productCategory", v);
                    }
                  }}
                  style={inputStyle}
                >
                  <option value="">— pick one —</option>
                  {CATEGORY_OPTIONS.map((c) => (<option key={c} value={c}>{c}</option>))}
                </select>
                {customCategoryMode && (
                  <input
                    type="text"
                    autoFocus
                    value={brief.productCategory ?? ""}
                    onChange={(e) => setField("productCategory", e.target.value)}
                    placeholder="Enter category"
                    style={{ ...inputStyle, marginTop: 6 }}
                  />
                )}
              </Field>
              <Field label="What it is (one line)" full>
                <input type="text" value={brief.productDescription ?? ""} onChange={(e) => setField("productDescription", e.target.value)} placeholder="e.g. Small-batch nitro cold brew in recyclable cans" style={inputStyle} />
              </Field>
              <Field label="Vibe / style">
                <select value={brief.vibe ?? ""} onChange={(e) => setField("vibe", e.target.value)} style={inputStyle}>
                  <option value="">— pick one —</option>
                  {VIBE_OPTIONS.map((v) => (<option key={v} value={v}>{v}</option>))}
                </select>
              </Field>
              <Field label="Target audience">
                <input type="text" value={brief.audience ?? ""} onChange={(e) => setField("audience", e.target.value)} placeholder="e.g. Urban professionals, 25–40" style={inputStyle} />
              </Field>
              <Field label="Background color">
                <ColorField value={brief.backgroundColor ?? ""} onChange={(v) => setField("backgroundColor", v)} placeholder="#0f172a or 'no preference'" />
              </Field>
              <Field label="Accent color">
                <ColorField value={brief.accentColor ?? ""} onChange={(v) => setField("accentColor", v)} placeholder="#22d3ee" />
              </Field>
              <Field label="Key features to highlight" full>
                <textarea value={brief.keyFeatures ?? ""} onChange={(e) => setField("keyFeatures", e.target.value)} placeholder="e.g. 100% arabica, zero sugar, recyclable can" rows={2} style={{ ...inputStyle, resize: "vertical", minHeight: 52 }} />
              </Field>
              <Field label="Call-to-action text">
                <input type="text" value={brief.ctaText ?? ""} onChange={(e) => setField("ctaText", e.target.value)} placeholder="e.g. Shop now" style={inputStyle} />
              </Field>
              <Field label="Anything else?">
                <input type="text" value={brief.extraNotes ?? ""} onChange={(e) => setField("extraNotes", e.target.value)} placeholder="e.g. include a video hero" style={inputStyle} />
              </Field>
            </div>
          </section>

          {/* Step 2 — Send to AI */}
          <section>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#0284c7", letterSpacing: "0.06em", textTransform: "uppercase" }}>Step 2</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>Send the prompt to your AI</span>
            </div>
            <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 10px", lineHeight: 1.5 }}>
              We've built a prompt that includes your brief plus the live element schema for this editor.
              Click an AI below — we'll open it and copy the prompt to your clipboard, ready to paste (⌘V / Ctrl+V).
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <button type="button" onClick={handleCopyPrompt}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 10, border: "1px solid #bae6fd", background: copied ? "#bae6fd" : "#e0f2fe", color: "#0284c7", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copied to clipboard" : "Copy AI prompt"}
              </button>
              {AI_TARGETS.map((t) => (
                <button key={t.id} type="button" onClick={() => handleOpenIn(t)}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", color: "#0f172a", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                  title={
                    t.mode === "prefill"
                      ? `Opens ${t.label} with the prompt prefilled`
                      : `Copies the prompt and opens ${t.label} — paste with ⌘V / Ctrl+V`
                  }
                >
                  {t.mode === "prefill" ? <ExternalLink size={13} /> : <Copy size={13} />}
                  {t.mode === "prefill" ? `Open in ${t.label}` : `Copy + Open ${t.label}`}
                </button>
              ))}
            </div>
          </section>

          {/* Step 3 — Paste JSON */}
          <section>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#0284c7", letterSpacing: "0.06em", textTransform: "uppercase" }}>Step 3</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>Paste the JSON</span>
            </div>
            <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 8px", lineHeight: 1.5 }}>
              Paste the AI's JSON output here. Importing replaces the current page — undo (⌘Z) restores it.
            </p>
            <textarea
              value={json}
              onChange={(e) => setJson(e.target.value)}
              spellCheck={false}
              placeholder={`{
  "pageTitle": "...",
  "artboard": { "width": 428, "height": 926, "background": "#ffffff" },
  "elements": [ ... ]
}`}
              style={{
                width: "100%",
                minHeight: 220,
                resize: "vertical",
                padding: 12,
                borderRadius: 10,
                border: `1px solid ${error ? "#fca5a5" : "#e2e8f0"}`,
                background: "#f8fafc",
                fontFamily: "var(--font-mono, ui-monospace), Menlo, monospace",
                fontSize: 12,
                color: "#0f172a",
                outline: "none",
                lineHeight: 1.5,
              }}
            />
            {error && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginTop: 8, padding: "8px 10px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, color: "#b91c1c", fontSize: 12 }}>
                <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>{error}</span>
              </div>
            )}
            {warnings.length > 0 && (
              <div style={{ marginTop: 8, padding: "8px 10px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, color: "#92400e", fontSize: 12 }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Imported with warnings:</div>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {warnings.map((w, i) => (<li key={i}>{w}</li>))}
                </ul>
              </div>
            )}
          </section>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "12px 20px", borderTop: "1px solid #f1f5f9", background: "#fafafa" }}>
          <button type="button" onClick={onClose}
            style={{ padding: "9px 16px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", color: "#475569", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
          >
            Cancel
          </button>
          <button type="button" onClick={handleImport} disabled={!json.trim()}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 10, border: "none", background: !json.trim() ? "#cbd5e1" : "#0284c7", color: "#fff", fontSize: 12, fontWeight: 700, cursor: !json.trim() ? "not-allowed" : "pointer", boxShadow: !json.trim() ? "none" : "0 4px 14px rgba(2,132,199,0.35)" }}
          >
            <Wand2 size={14} /> Import layout
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px solid #e2e8f0",
  background: "#fff",
  fontSize: 12,
  color: "#0f172a",
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
};

function Field({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4, gridColumn: full ? "1 / -1" : "auto" }}>
      <span style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</span>
      {children}
    </label>
  );
}

function ColorField({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  // Color input needs a valid 6-digit hex; show one only when the text value looks like one.
  const looksLikeHex = /^#[0-9a-fA-F]{6}$/.test(value);
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      <HexColorPopover
        value={looksLikeHex ? value : ""}
        onChange={(hex) => onChange(hex)}
        fallback="#ffffff"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  );
}
