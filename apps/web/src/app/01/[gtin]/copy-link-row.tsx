"use client";

// URL + "Copy link" row shown under the passport's product gallery (see
// dpp-view.tsx) - lets a visitor grab this passport's own link without
// digging it out of the address bar. Client-rendered so it can read
// window.location.origin (respects a company's custom domain).
import { useEffect, useState } from "react";
import { Link2, Copy, Check } from "lucide-react";

export function CopyLinkRow({ gtin }: { gtin: string }) {
  const [url, setUrl] = useState(`/01/${gtin}`);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(`${window.location.origin}/01/${gtin}`);
  }, [gtin]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard permission denied/unavailable - nothing to fall back to.
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 10,
        padding: "8px 8px 8px 12px",
        marginBottom: 16,
      }}
    >
      <Link2 size={14} color="#94a3b8" style={{ flexShrink: 0 }} />
      <span
        className="notranslate"
        translate="no"
        style={{ fontSize: 12, color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, minWidth: 0 }}
      >
        {url}
      </span>
      <button
        type="button"
        onClick={onCopy}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          fontSize: 12,
          fontWeight: 600,
          color: "#0f172a",
          background: "#f1f5f9",
          border: "none",
          borderRadius: 999,
          padding: "6px 10px",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
