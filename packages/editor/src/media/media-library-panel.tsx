"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useMediaLibrary } from "./media-context";
import {
  getAllMedia,
  createMediaObjectUrl,
  type MediaItem,
} from "./media-store";

/* ─────────────────────────────────────────────
 * MediaLibraryPanel — Browseable uploaded media
 *
 * Opens as a modal overlay. Shows all uploaded
 * images in a grid, allows selection and deletion.
 * ──────────────────────────────────────────── */

interface MediaLibraryPanelProps {
  onSelect: (url: string) => void;
  onClose: () => void;
}

export function MediaLibraryPanel({
  onSelect,
  onClose,
}: MediaLibraryPanelProps) {
  const { items, remove, refresh } = useMediaLibrary();
  const [thumbnails, setThumbnails] = useState<
    Map<string, string>
  >(new Map());
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Load thumbnails
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const allItems = await getAllMedia();
      if (cancelled) return;
      const map = new Map<string, string>();
      for (const item of allItems) {
        if (item.thumbnailBlob) {
          map.set(item.id, createMediaObjectUrl(item.thumbnailBlob));
        } else {
          map.set(item.id, createMediaObjectUrl(item.blob));
        }
      }
      setThumbnails(map);
    })();
    return () => {
      cancelled = true;
    };
  }, [items]);

  // Cleanup thumbnail URLs on unmount
  useEffect(() => {
    return () => {
      thumbnails.forEach((url) => {
        try { URL.revokeObjectURL(url); } catch { /* noop */ }
      });
    };
  }, [thumbnails]);

  const handleSelect = useCallback(
    async (id: string) => {
      const { getMedia } = await import("./media-store");
      const item = await getMedia(id);
      if (item) {
        const url = createMediaObjectUrl(item.blob);
        onSelect(url);
      }
    },
    [onSelect]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      await remove(id);
      setConfirmDelete(null);
    },
    [remove]
  );

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: "90vw",
          maxWidth: 640,
          maxHeight: "80vh",
          backgroundColor: "#ffffff",
          borderRadius: 12,
          boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 600,
                color: "#111827",
              }}
            >
              Media Library
            </h2>
            <p
              style={{
                margin: "2px 0 0",
                fontSize: 12,
                color: "#6b7280",
              }}
            >
              {items.length} image{items.length !== 1 ? "s" : ""} uploaded
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              border: "none",
              backgroundColor: "transparent",
              cursor: "pointer",
              fontSize: 18,
              color: "#6b7280",
              transition: "all 0.15s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 16,
          }}
        >
          {items.length === 0 ? (
            /* Empty State */
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px 20px",
                color: "#9ca3af",
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>📁</div>
              <p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>
                No images uploaded yet
              </p>
              <p style={{ fontSize: 12, margin: "4px 0 0" }}>
                Upload images using the upload field in the editor
              </p>
            </div>
          ) : (
            /* Image Grid */
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                gap: 12,
              }}
            >
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    position: "relative",
                    borderRadius: 8,
                    overflow: "hidden",
                    border: "1px solid #e5e7eb",
                    backgroundColor: "#f9fafb",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = "#3b82f6";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(59,130,246,0.2)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    onClick={() => handleSelect(item.id)}
                    style={{
                      aspectRatio: "1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    {thumbnails.has(item.id) ? (
                      <img
                        src={thumbnails.get(item.id)!}
                        alt={item.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div style={{ fontSize: 24, color: "#d1d5db" }}>🖼</div>
                    )}
                  </div>

                  {/* Info */}
                  <div
                    style={{
                      padding: "6px 8px",
                      borderTop: "1px solid #f3f4f6",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        color: "#374151",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.name}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 2,
                      }}
                    >
                      <span style={{ fontSize: 10, color: "#9ca3af" }}>
                        {formatSize(item.size)}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirmDelete === item.id) {
                            handleDelete(item.id);
                          } else {
                            setConfirmDelete(item.id);
                            setTimeout(
                              () => setConfirmDelete(null),
                              3000
                            );
                          }
                        }}
                        style={{
                          padding: "2px 6px",
                          borderRadius: 4,
                          border: "none",
                          backgroundColor:
                            confirmDelete === item.id
                              ? "#fee2e2"
                              : "transparent",
                          color:
                            confirmDelete === item.id
                              ? "#dc2626"
                              : "#9ca3af",
                          fontSize: 10,
                          cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                      >
                        {confirmDelete === item.id ? "Confirm?" : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
