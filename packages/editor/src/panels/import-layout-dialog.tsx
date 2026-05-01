/* ─────────────────────────────────────────────
 * Import Layout Dialog — paste AI-generated JSON
 * (or any layout JSON) and load it onto the canvas.
 * Includes a "Copy AI prompt" button so users can
 * brief their LLM with the live element catalog.
 * ──────────────────────────────────────────── */

"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, Copy, Check, X, AlertCircle, Wand2 } from "lucide-react";
import { useCanvasStore } from "../engine/canvas-store";
import { buildAIPrompt, importLayoutFromJson } from "../utils/import-layout";

interface ImportLayoutDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ImportLayoutDialog({ open, onClose }: ImportLayoutDialogProps) {
  const loadDocument = useCanvasStore((s) => s.loadDocument);
  const [json, setJson] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) {
      setJson("");
      setError(null);
      setWarnings([]);
      setCopied(false);
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(buildAIPrompt());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Couldn't copy to clipboard — select the prompt manually.");
    }
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
          <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg,#8b5cf6,#ec4899)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
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
          {/* Step 1 */}
          <section>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#8b5cf6", letterSpacing: "0.06em", textTransform: "uppercase" }}>Step 1</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>Brief your AI</span>
            </div>
            <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 10px", lineHeight: 1.5 }}>
              Copy the prompt below into ChatGPT / Claude / Gemini. It includes the schema and a live
              catalog of every element type and prop available in this editor. Add your own design
              brief at the end (e.g. <em>“Design a hero for an organic skincare brand…”</em>).
            </p>
            <button type="button" onClick={handleCopyPrompt}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 10, border: "1px solid #e0e7ff", background: copied ? "#ecfdf5" : "#eef2ff", color: copied ? "#059669" : "#4f46e5", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied to clipboard" : "Copy AI prompt"}
            </button>
          </section>

          {/* Step 2 */}
          <section>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#0ea5e9", letterSpacing: "0.06em", textTransform: "uppercase" }}>Step 2</span>
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
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 10, border: "none", background: !json.trim() ? "#cbd5e1" : "linear-gradient(135deg,#8b5cf6,#ec4899)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: !json.trim() ? "not-allowed" : "pointer", boxShadow: !json.trim() ? "none" : "0 4px 14px rgba(139,92,246,0.35)" }}
          >
            <Wand2 size={14} /> Import layout
          </button>
        </div>
      </div>
    </div>
  );
}
