/* ─────────────────────────────────────────────
 * PDF Viewer Element - Embed a PDF document
 *
 * Renders an uploaded (or linked) PDF inside the block
 * using the browser's built-in PDF viewer via an <iframe>.
 * PDF Open Parameters appended to the URL fragment control
 * the initial page, toolbar visibility and zoom/fit.
 *
 * Same editor-overlay pattern as the video element: in the
 * editor canvas a transparent layer covers the iframe so the
 * ElementWrapper still handles selection / dragging; on the
 * published page the overlay is gone and the viewer is fully
 * interactive (scroll, zoom, download).
 * ──────────────────────────────────────────── */

"use client";

import React from "react";
import { FileText, Download } from "lucide-react";
import { registerElement, type ElementRenderProps, type PropertyPanelProps } from "./registry";
import { PdfUploadWidget } from "../media/pdf-upload-widget";

/** Returns true when running inside the editor canvas (set by EditRenderer). */
function isInsideEditor(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return !!(window as unknown as Record<string, unknown>).__productixEditor;
  } catch {
    return false;
  }
}

/**
 * Build the iframe src with PDF Open Parameters. These are honored by the
 * built-in PDF viewers in Chrome, Edge and Firefox.
 *   #page=N        - jump to a page
 *   #toolbar=0     - hide the viewer chrome
 *   #view=FitH     - fit page width / whole page
 */
function buildPdfSrc(
  src: string,
  opts: { page: number; showToolbar: boolean; fit: string }
): string {
  const params: string[] = [];
  params.push(`toolbar=${opts.showToolbar ? 1 : 0}`);
  if (opts.page > 1) params.push(`page=${opts.page}`);
  if (opts.fit && opts.fit !== "none") params.push(`view=${opts.fit}`);
  return `${src}#${params.join("&")}`;
}

/* ─── Component ─────────────────────────────── */

function PdfViewerComponent({ props }: ElementRenderProps) {
  const src = (props.src as string) || "";
  const fileName = (props.fileName as string) || "";
  const page = (props.page as number) || 1;
  const showToolbar = props.showToolbar !== false;
  const fit = (props.fit as string) || "FitH";
  const borderRadius = (props.borderRadius as number) ?? 8;
  const bgColor = (props.bgColor as string) || "#f3f4f6";
  const hideScrollbar = props.hideScrollbar === true;
  const inEditor = isInsideEditor();

  /* ── Empty state ── */
  if (!src) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          background: "rgba(0,0,0,0.04)",
          border: "2px dashed #d1d5db",
          color: "#9ca3af",
        }}
      >
        <FileText size={28} style={{ opacity: 0.5 }} />
        <span style={{ fontSize: 12, fontWeight: 500, textAlign: "center", padding: "0 12px" }}>
          {inEditor ? "Upload a PDF in properties →" : "No document"}
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius,
        overflow: "hidden",
        position: "relative",
        background: bgColor,
      }}
    >
      <iframe
        // The PDF viewer only reads its Open Parameters (toolbar/page/view) on
        // initial load. Those live in the URL hash, and changing only the hash
        // is same-document navigation that does NOT reload the iframe - so a
        // settings change wouldn't reflect. Keying on them forces a remount
        // (fresh load) whenever they change.
        key={`${src}|${page}|${showToolbar}|${fit}`}
        src={buildPdfSrc(src, { page, showToolbar, fit })}
        title={fileName || "PDF document"}
        style={{
          // The PDF viewer's scrollbar is inside the (cross-origin) iframe, so
          // it can't be styled directly. To hide it we widen the iframe past
          // the wrapper's clipped right edge, pushing the vertical scrollbar
          // out of view (the wrapper already has overflow:hidden).
          width: hideScrollbar ? "calc(100% + 17px)" : "100%",
          height: "100%",
          border: 0,
          display: "block",
        }}
      />

      {/* Editor overlay - blocks the iframe from stealing pointer events so the
          block stays selectable / draggable. Shows the filename for context. */}
      {inEditor && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            cursor: "move",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "flex-start",
            padding: 8,
          }}
        >
          {fileName && (
            <span
              style={{
                maxWidth: "90%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                background: "rgba(0,0,0,0.6)",
                color: "#fff",
                fontSize: 11,
                fontWeight: 600,
                padding: "3px 8px",
                borderRadius: 6,
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <FileText size={11} /> {fileName}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Property Panel ────────────────────────── */

function PdfViewerPropertyPanel({ props, onChange }: PropertyPanelProps) {
  const labelStyle = "text-xs font-medium text-gray-500 uppercase tracking-wide";
  const inputStyle =
    "mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none";
  const src = (props.src as string) || "";

  return (
    <div className="space-y-4">
      <PdfUploadWidget
        value={src}
        fileName={(props.fileName as string) || ""}
        onChange={(url, name) => onChange({ src: url, fileName: name })}
      />

      {src && (
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Download size={12} /> Open / download
        </a>
      )}

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={props.showToolbar !== false}
          onChange={(e) => onChange({ showToolbar: e.target.checked })}
        />
        Show viewer toolbar
      </label>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={props.hideScrollbar === true}
          onChange={(e) => onChange({ hideScrollbar: e.target.checked })}
        />
        Hide scrollbar
      </label>

      <label className="block">
        <span className={labelStyle}>Initial Page</span>
        <input
          type="number"
          className={inputStyle}
          value={(props.page as number) || 1}
          onChange={(e) => onChange({ page: Math.max(1, Number(e.target.value) || 1) })}
          min={1}
        />
      </label>

      <label className="block">
        <span className={labelStyle}>Fit</span>
        <select
          className={inputStyle}
          value={(props.fit as string) || "FitH"}
          onChange={(e) => onChange({ fit: e.target.value })}
        >
          <option value="FitH">Fit width</option>
          <option value="Fit">Fit page</option>
          <option value="none">Default</option>
        </select>
      </label>

      <label className="block">
        <span className={labelStyle}>Border Radius</span>
        <input
          type="number"
          className={inputStyle}
          value={(props.borderRadius as number) ?? 8}
          onChange={(e) => onChange({ borderRadius: Number(e.target.value) })}
          min={0}
          max={999}
        />
      </label>
    </div>
  );
}

/* ─── Registration ──────────────────────────── */

registerElement({
  type: "pdf-viewer",
  label: "PDF Viewer",
  icon: <FileText size={16} />,
  category: "media",
  defaultProps: {
    src: "",
    fileName: "",
    page: 1,
    showToolbar: true,
    fit: "FitH",
    hideScrollbar: false,
    borderRadius: 8,
    bgColor: "#f3f4f6",
  },
  defaultTransform: { width: 343, height: 460 }, // portrait, roughly A4-ish ratio
  component: PdfViewerComponent,
  propertyPanel: PdfViewerPropertyPanel,
});
