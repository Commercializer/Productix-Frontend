"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";

import {
  addMedia as storeAddMedia,
  getAllMedia,
  deleteMedia as storeDeleteMedia,
  createMediaObjectUrl,
  createMediaUrl,
  type MediaItem,
  type MediaItemMeta,
} from "./media-store";

/* ─── Types ─────────────────────────────────── */

interface MediaContextValue {
  /** All uploaded media items (metadata only, no blobs in state) */
  items: MediaItemMeta[];
  /** Upload a file and return its public R2 URL */
  upload: (file: File) => Promise<string>;
  /** Remove a media item by ID (deletes from R2 + local cache) */
  remove: (id: string) => Promise<void>;
  /** Get a renderable URL for a media ID */
  getUrl: (id: string) => Promise<string>;
  /** Whether an upload is currently in progress */
  isUploading: boolean;
  /** Last upload error message, if any */
  error: string | null;
  /** Clear the error */
  clearError: () => void;
  /** Refresh the items list from store */
  refresh: () => Promise<void>;
}

const MediaContext = createContext<MediaContextValue | null>(null);

/* ─── Provider ──────────────────────────────── */

export function MediaProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<MediaItemMeta[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cache object URLs for legacy blob thumbnails
  const urlCacheRef = useRef<Map<string, string>>(new Map());

  // Load items on mount
  const refresh = useCallback(async () => {
    try {
      const allItems = await getAllMedia();
      setItems(
        allItems.map((item) => ({
          id: item.id,
          name: item.name,
          size: item.size,
          type: item.type,
          mediaType: item.mediaType || "image",
          width: item.width,
          height: item.height,
          duration: item.duration || 0,
          createdAt: item.createdAt,
          url: item.url || "",
          r2Key: item.r2Key || "",
        }))
      );

      // Cache thumbnail URLs for legacy items that have blobs
      for (const item of allItems) {
        if (!urlCacheRef.current.has(item.id)) {
          if (item.thumbnailBlob) {
            urlCacheRef.current.set(
              `thumb_${item.id}`,
              createMediaObjectUrl(item.thumbnailBlob)
            );
          }
        }
      }
    } catch {
      // IndexedDB may not be available (e.g., SSR)
    }
  }, []);

  useEffect(() => {
    refresh();
    // Cleanup object URLs on unmount
    return () => {
      urlCacheRef.current.forEach((url) => {
        try { URL.revokeObjectURL(url); } catch { /* noop */ }
      });
    };
  }, [refresh]);

  const upload = useCallback(
    async (file: File): Promise<string> => {
      setIsUploading(true);
      setError(null);
      try {
        const mediaItem: MediaItem = await storeAddMedia(file);

        // The R2 URL is the permanent, canonical URL
        const publicUrl = mediaItem.url;

        // Cache thumbnail for library UI
        if (mediaItem.thumbnailBlob) {
          urlCacheRef.current.set(
            `thumb_${mediaItem.id}`,
            createMediaObjectUrl(mediaItem.thumbnailBlob)
          );
        }

        // Update items list
        setItems((prev) => [
          {
            id: mediaItem.id,
            name: mediaItem.name,
            size: mediaItem.size,
            type: mediaItem.type,
            mediaType: mediaItem.mediaType,
            width: mediaItem.width,
            height: mediaItem.height,
            duration: mediaItem.duration,
            createdAt: mediaItem.createdAt,
            url: mediaItem.url,
            r2Key: mediaItem.r2Key,
          },
          ...prev,
        ]);

        return publicUrl;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Upload failed";
        setError(msg);
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    []
  );

  const remove = useCallback(async (id: string) => {
    await storeDeleteMedia(id);

    // Revoke any cached local thumbnail URLs
    const thumbUrl = urlCacheRef.current.get(`thumb_${id}`);
    if (thumbUrl) { URL.revokeObjectURL(thumbUrl); urlCacheRef.current.delete(`thumb_${id}`); }

    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const getUrl = useCallback(async (id: string): Promise<string> => {
    // Check if it's already a full URL (R2)
    const cached = urlCacheRef.current.get(id);
    if (cached) return cached;

    // Load from IndexedDB cache
    const { getMedia } = await import("./media-store");
    const item = await getMedia(id);
    if (!item) throw new Error(`Media not found: ${id}`);

    // Return the R2 URL directly
    if (item.url) return item.url;

    // Legacy fallback: create blob URL
    const url = createMediaUrl(item);
    urlCacheRef.current.set(id, url);
    return url;
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <MediaContext.Provider
      value={{ items, upload, remove, getUrl, isUploading, error, clearError, refresh }}
    >
      {children}
    </MediaContext.Provider>
  );
}

/* ─── Hook ──────────────────────────────────── */

export function useMediaLibrary(): MediaContextValue {
  const ctx = useContext(MediaContext);
  if (!ctx) {
    throw new Error(
      "useMediaLibrary must be used inside a <MediaProvider>"
    );
  }
  return ctx;
}
