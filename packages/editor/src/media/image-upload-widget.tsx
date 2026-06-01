/* ─────────────────────────────────────────────
 * ImageUploadWidget - Reusable drag-drop image picker
 *
 * A compact, self-contained widget that can be embedded
 * in ANY property panel or settings section. Provides:
 *  - Drag-and-drop zone
 *  - File picker button
 *  - Immediate preview of uploaded/selected images
 *  - Replace / Remove actions
 *  - Media library modal for previously uploaded images
 *  - URL paste fallback
 *
 * Usage:
 *   <ImageUploadWidget
 *     value={props.bgImage as string}
 *     onChange={(url) => onChange({ bgImage: url })}
 *     label="Background Image"
 *   />
 * ──────────────────────────────────────────── */

"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { validateFile } from "./media-store";
import { MediaLibraryPanel } from "./media-library-panel";

interface ImageUploadWidgetProps {
  /** Current image URL (data-url, object-url, or http URL) */
  value: string;
  /** Called when the image changes */
  onChange: (url: string) => void;
  /** Label shown above the widget */
  label?: string;
  /** Compact mode for inline use */
  compact?: boolean;
  /** Read-only mode */
  readOnly?: boolean;
  /** Accepted aspect text */
  hint?: string;
}

export function ImageUploadWidget({
  value,
  onChange,
  label = "Image",
  compact = false,
  readOnly = false,
  hint,
}: ImageUploadWidgetProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);
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
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError.message);
        return;
      }

      setIsUploading(true);
      setError(null);

      try {
        // Upload to R2 via media-store - returns a permanent cloud URL
        let url: string;
        try {
          const { addMedia } = await import("./media-store");
          const item = await addMedia(file);
          url = item.url; // R2 public URL
        } catch {
          // Fallback: read as data URL (offline / dev mode)
          url = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error("Failed to read file"));
            reader.readAsDataURL(file);
          });
        }

        onChange(url);
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
      if (readOnly) return;
      const file = e.dataTransfer.files?.[0];
      if (file) processFile(file);
    },
    [processFile, readOnly]
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

  /* ── Library selection ── */

  const handleLibrarySelect = useCallback(
    (url: string) => {
      onChange(url);
      setShowLibrary(false);
    },
    [onChange]
  );

  const hasImage = !!value;
  const previewHeight = compact ? 80 : 120;

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

      {hasImage ? (
        /* ── Preview Mode ── */
        <div>
          <div
            className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50 group"
            style={{ height: previewHeight }}
          >
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              draggable={false}
            />
            {/* Uploading overlay (e.g. while replacing) */}
            {isUploading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-white/70 backdrop-blur-sm">
                <div className="w-5 h-5 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
                <span className="text-[11px] font-semibold text-blue-600">Uploading…</span>
              </div>
            )}
            {/* Hover overlay for replace */}
            {!readOnly && !isUploading && (
              <div
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity"
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {isDragging ? (
                  <span className="text-white text-xs font-semibold">Drop to replace</span>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-md bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-gray-800 hover:bg-white transition-colors"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowLibrary(true)}
                      className="rounded-md bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-gray-800 hover:bg-white transition-colors"
                    >
                      Library
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Action row */}
          {!readOnly && (
            <div className="flex gap-1.5 mt-1.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-[10px] font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                📷 Replace
              </button>
              <button
                type="button"
                onClick={() => setShowLibrary(true)}
                className="flex-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-[10px] font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                📁 Library
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="rounded-md border border-red-200 bg-white px-2 py-1 text-[10px] font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      ) : (
        /* ── Upload Zone ── */
        <div>
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => !readOnly && !isUploading && fileInputRef.current?.click()}
            className="rounded-lg transition-all cursor-pointer"
            style={{
              border: `2px dashed ${isDragging ? "#3b82f6" : "#d1d5db"}`,
              backgroundColor: isDragging ? "#eff6ff" : "#fafafa",
              padding: compact ? "12px 10px" : "16px 12px",
            }}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-5 h-5 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
                <span className="text-[11px] text-gray-400">Uploading…</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-center">
                <span className="text-xl">{isDragging ? "📥" : "📸"}</span>
                <div>
                  <span className="text-[11px] font-semibold text-blue-600">
                    {isDragging ? "Drop image here" : "Click to upload"}
                  </span>
                  {!isDragging && (
                    <span className="text-[11px] text-gray-400"> or drag & drop</span>
                  )}
                </div>
                <span className="text-[10px] text-gray-400">
                  {hint || "JPG, PNG, GIF, WebP, SVG · Max 10MB"}
                </span>
              </div>
            )}
          </div>

          {/* Secondary actions */}
          {!readOnly && (
            <div className="flex gap-1.5 mt-1.5">
              <button
                type="button"
                onClick={() => setShowLibrary(true)}
                className="flex-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-[10px] font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                📁 Browse Library
              </button>
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="rounded-md border border-gray-200 bg-white px-2 py-1 text-[10px] font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                🔗 URL
              </button>
            </div>
          )}

          {/* URL input */}
          {showUrlInput && (
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Paste image URL…"
              className="mt-1.5 w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs focus:border-blue-500 focus:outline-none"
              onFocus={(e) => (e.currentTarget.style.borderColor = "#3b82f6")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
            />
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Media Library Modal */}
      {showLibrary && (
        <MediaLibraryPanel
          onSelect={handleLibrarySelect}
          onClose={() => setShowLibrary(false)}
        />
      )}
    </div>
  );
}
