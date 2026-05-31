/* ─────────────────────────────────────────────
 * PdfUploadWidget - Reusable drag-drop PDF picker
 *
 * Mirrors ImageUploadWidget's affordances (drag-drop
 * zone, file picker, replace/remove, URL paste) but is
 * scoped to PDF documents. Uploads straight to R2 via the
 * /api/media/upload endpoint and returns the public URL -
 * it intentionally does NOT go through the IndexedDB media
 * store / image library, which is image/audio oriented.
 *
 * Usage:
 *   <PdfUploadWidget
 *     value={props.src as string}
 *     fileName={props.fileName as string}
 *     onChange={(url, name) => onChange({ src: url, fileName: name })}
 *   />
 * ──────────────────────────────────────────── */

"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { FileText, Upload, Link2, X } from "lucide-react";

const MAX_PDF_SIZE = 25 * 1024 * 1024; // 25 MB - matches MAX_DOCUMENT_SIZE on the server

interface PdfUploadWidgetProps {
  /** Current PDF URL (http URL) */
  value: string;
  /** Display filename shown in the preview chip */
  fileName?: string;
  /** Called when the PDF changes (url, derived filename) */
  onChange: (url: string, fileName: string) => void;
  /** Label shown above the widget */
  label?: string;
}

function fileNameFromUrl(url: string): string {
  try {
    const path = url.split("?")[0]!.split("#")[0]!;
    const last = path.split("/").pop() || "document.pdf";
    return decodeURIComponent(last);
  } catch {
    return "document.pdf";
  }
}

export function PdfUploadWidget({
  value,
  fileName,
  onChange,
  label = "PDF File",
}: PdfUploadWidgetProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCountRef = useRef(0);

  // Auto-clear error
  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(null), 4000);
      return () => clearTimeout(t);
    }
  }, [error]);

  /* ── File handling ── */

  const processFile = useCallback(
    async (file: File) => {
      if (file.type !== "application/pdf") {
        setError("Only PDF files are supported.");
        return;
      }
      if (file.size > MAX_PDF_SIZE) {
        setError(
          `File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum is 25MB.`
        );
        return;
      }

      setIsUploading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/media/upload", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: "Upload failed" }));
          throw new Error(err.error || `Upload failed (${res.status})`);
        }
        const data = (await res.json()) as { url: string; name?: string };
        onChange(data.url, data.name || file.name);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setIsUploading(false);
      }
    },
    [onChange]
  );

  /* ── Drag & Drop ── */

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCountRef.current++;
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCountRef.current--;
    if (dragCountRef.current === 0) setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCountRef.current = 0;
      const file = e.dataTransfer.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  /* ── File picker ── */

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [processFile]
  );

  const hasPdf = !!value;
  const displayName = fileName || (value ? fileNameFromUrl(value) : "");

  return (
    <div>
      {/* Label */}
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
        {label}
      </span>

      {/* Error */}
      {error && (
        <div className="mb-2 rounded-md bg-red-50 border border-red-200 px-3 py-1.5 text-[11px] text-red-600">
          {error}
        </div>
      )}

      {hasPdf ? (
        /* ── Selected file chip ── */
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-red-100 text-red-600">
            <FileText size={16} />
          </span>
          <span className="flex-1 truncate text-xs font-medium text-gray-700" title={displayName}>
            {displayName}
          </span>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-md border border-gray-200 bg-white px-2 py-1 text-[10px] font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Replace
          </button>
          <button
            type="button"
            onClick={() => onChange("", "")}
            title="Remove PDF"
            className="rounded-md border border-red-200 bg-white p-1 text-red-500 hover:bg-red-50 transition-colors"
          >
            <X size={13} />
          </button>
        </div>
      ) : (
        /* ── Upload Zone ── */
        <div>
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className="rounded-lg transition-all cursor-pointer"
            style={{
              border: `2px dashed ${isDragging ? "#3b82f6" : "#d1d5db"}`,
              backgroundColor: isDragging ? "#eff6ff" : "#fafafa",
              padding: "16px 12px",
            }}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-5 h-5 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
                <span className="text-[11px] text-gray-400">Uploading…</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-center">
                <span className="text-gray-400">
                  {isDragging ? <Upload size={22} /> : <FileText size={22} />}
                </span>
                <div>
                  <span className="text-[11px] font-semibold text-blue-600">
                    {isDragging ? "Drop PDF here" : "Click to upload"}
                  </span>
                  {!isDragging && (
                    <span className="text-[11px] text-gray-400"> or drag & drop</span>
                  )}
                </div>
                <span className="text-[10px] text-gray-400">PDF · Max 25MB</span>
              </div>
            )}
          </div>

          {/* Secondary action: URL paste */}
          <div className="flex gap-1.5 mt-1.5">
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-gray-200 bg-white px-2 py-1 text-[10px] font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Link2 size={11} /> Paste a PDF URL
            </button>
          </div>

          {showUrlInput && (
            <input
              type="text"
              placeholder="https://…/document.pdf"
              className="mt-1.5 w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs focus:border-blue-500 focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const url = (e.target as HTMLInputElement).value.trim();
                  if (url) onChange(url, fileNameFromUrl(url));
                }
              }}
              onBlur={(e) => {
                const url = e.target.value.trim();
                if (url) onChange(url, fileNameFromUrl(url));
              }}
            />
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
