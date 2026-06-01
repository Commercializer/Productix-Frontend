"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useMediaLibrary } from "./media-context";
import { validateFile } from "./media-store";
import { MediaLibraryPanel } from "./media-library-panel";

/* ─────────────────────────────────────────────
 * MediaUploadField - Puck Custom Field Renderer
 *
 * Renders inside the Puck sidebar for any image
 * URL field. Provides:
 *  - Drag-and-drop zone
 *  - File picker button
 *  - Image preview with replace/remove
 *  - Media library access
 * ──────────────────────────────────────────── */

interface MediaUploadFieldProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export function MediaUploadField({
  value,
  onChange,
  readOnly,
}: MediaUploadFieldProps) {
  const { upload, isUploading, error, clearError } = useMediaLibrary();
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCountRef = useRef(0);

  // Clear errors after 4s
  useEffect(() => {
    if (localError) {
      const t = setTimeout(() => setLocalError(null), 4000);
      return () => clearTimeout(t);
    }
  }, [localError]);

  const handleFile = useCallback(
    async (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setLocalError(validationError.message);
        return;
      }
      setLocalError(null);
      clearError();
      try {
        const url = await upload(file);
        onChange(url);
      } catch (err) {
        setLocalError(
          err instanceof Error ? err.message : "Upload failed"
        );
      }
    },
    [upload, onChange, clearError]
  );

  /* ── Drag & Drop Handlers ── */

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
    if (dragCountRef.current === 0) {
      setIsDragging(false);
    }
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
      if (file) {
        handleFile(file);
      }
    },
    [handleFile, readOnly]
  );

  /* ── File Input Handler ── */

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      // Reset input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [handleFile]
  );

  /* ── Library Selection ── */

  const handleLibrarySelect = useCallback(
    (url: string) => {
      onChange(url);
      setShowLibrary(false);
    },
    [onChange]
  );

  /* ── Render ── */

  const displayError = localError || error;
  const hasImage = !!value;

  return (
    <div style={{ width: "100%" }}>
      {/* Error Banner */}
      {displayError && (
        <div
          style={{
            padding: "8px 12px",
            marginBottom: 8,
            borderRadius: 8,
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#dc2626",
            fontSize: 12,
            lineHeight: 1.4,
          }}
        >
          {displayError}
        </div>
      )}

      {hasImage ? (
        /* ── Preview Mode ── */
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "relative",
              borderRadius: 8,
              overflow: "hidden",
              border: "1px solid #e5e7eb",
              backgroundColor: "#f9fafb",
            }}
          >
            <img
              src={value}
              alt="Uploaded"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: 200,
                objectFit: "cover",
                display: "block",
              }}
            />
            {/* Uploading overlay (e.g. while replacing) */}
            {isUploading && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  backgroundColor: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(2px)",
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    border: "2px solid #e5e7eb",
                    borderTopColor: "#3b82f6",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                <span style={{ fontSize: 12, fontWeight: 600, color: "#3b82f6" }}>
                  Uploading…
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          {!readOnly && (
            <div
              style={{
                display: "flex",
                gap: 6,
                marginTop: 8,
              }}
            >
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  flex: 1,
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: "1px solid #d1d5db",
                  backgroundColor: "#ffffff",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#374151",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
              >
                Replace
              </button>
              <button
                type="button"
                onClick={() => setShowLibrary(true)}
                style={{
                  flex: 1,
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: "1px solid #d1d5db",
                  backgroundColor: "#ffffff",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#374151",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
              >
                Library
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                style={{
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: "1px solid #fecaca",
                  backgroundColor: "#ffffff",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#dc2626",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#fef2f2")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
              >
                ✕
              </button>
            </div>
          )}
        </div>
      ) : (
        /* ── Upload Zone ── */
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${isDragging ? "#3b82f6" : "#d1d5db"}`,
            borderRadius: 8,
            padding: "20px 16px",
            textAlign: "center",
            backgroundColor: isDragging ? "#eff6ff" : "#fafafa",
            transition: "all 0.2s",
            cursor: readOnly ? "default" : "pointer",
          }}
          onClick={() => !readOnly && !isUploading && fileInputRef.current?.click()}
        >
          {isUploading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  border: "2px solid #e5e7eb",
                  borderTopColor: "#3b82f6",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              <span style={{ fontSize: 12, color: "#6b7280" }}>Uploading…</span>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ fontSize: 24, lineHeight: 1 }}>📸</div>
              <div>
                <span style={{ fontSize: 12, fontWeight: 500, color: "#3b82f6" }}>
                  {isDragging ? "Drop image here" : "Click to upload"}
                </span>
                {!isDragging && (
                  <span style={{ fontSize: 12, color: "#9ca3af" }}> or drag & drop</span>
                )}
              </div>
              <span style={{ fontSize: 11, color: "#9ca3af" }}>
                JPG, PNG, GIF, WebP, SVG · MP3, WAV, OGG · Max 10–25MB
              </span>
            </div>
          )}
        </div>
      )}

      {/* Browse from Library button (when empty) */}
      {!hasImage && !readOnly && (
        <button
          type="button"
          onClick={() => setShowLibrary(true)}
          style={{
            width: "100%",
            padding: "6px 12px",
            marginTop: 8,
            borderRadius: 6,
            border: "1px solid #d1d5db",
            backgroundColor: "#ffffff",
            fontSize: 12,
            fontWeight: 500,
            color: "#374151",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
        >
          📁 Browse Library
        </button>
      )}

      {/* URL input fallback for external URLs */}
      {!readOnly && (
        <div style={{ marginTop: 8 }}>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Or paste an image URL…"
            style={{
              width: "100%",
              padding: "6px 10px",
              borderRadius: 6,
              border: "1px solid #e5e7eb",
              fontSize: 12,
              color: "#374151",
              backgroundColor: "#ffffff",
              outline: "none",
              boxSizing: "border-box",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#3b82f6")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
          />
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />

      {/* Media Library Modal */}
      {showLibrary && (
        <MediaLibraryPanel
          onSelect={handleLibrarySelect}
          onClose={() => setShowLibrary(false)}
        />
      )}

      {/* Inline CSS keyframes for spinner */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ─── Puck Custom Field Render Function ─────── */

/**
 * Use this as the `render` property of a Puck `custom` field
 * to turn any image URL text field into a rich upload field.
 *
 * Example:
 *   backgroundImage: {
 *     type: "custom",
 *     label: "Background Image",
 *     render: mediaUploadFieldRender,
 *   }
 */
export const mediaUploadFieldRender = (props: {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}) => {
  return (
    <MediaUploadField
      value={props.value ?? ""}
      onChange={props.onChange}
      readOnly={props.readOnly}
    />
  );
};
