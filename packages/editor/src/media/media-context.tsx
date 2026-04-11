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
  type MediaItem,
  type MediaItemMeta,
} from "./media-store";

/* ─── Types ─────────────────────────────────── */

interface MediaContextValue {
  /** All uploaded media items (metadata only, no blobs in state) */
  items: MediaItemMeta[];
  /** Upload a file and return its object URL */
  upload: (file: File) => Promise<string>;
  /** Remove a media item by ID */
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

  // Cache object URLs to avoid re-creating them
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
          width: item.width,
          height: item.height,
          createdAt: item.createdAt,
        }))
      );

      // Cache thumbnail URLs
      for (const item of allItems) {
        if (!urlCacheRef.current.has(item.id) && item.thumbnailBlob) {
          urlCacheRef.current.set(
            `thumb_${item.id}`,
            createMediaObjectUrl(item.thumbnailBlob)
          );
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

        // Create and cache object URL for the full image
        const objectUrl = createMediaObjectUrl(mediaItem.blob);
        urlCacheRef.current.set(mediaItem.id, objectUrl);

        // Cache thumbnail URL
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
            width: mediaItem.width,
            height: mediaItem.height,
            createdAt: mediaItem.createdAt,
          },
          ...prev,
        ]);

        return objectUrl;
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

    // Revoke cached URLs
    const fullUrl = urlCacheRef.current.get(id);
    const thumbUrl = urlCacheRef.current.get(`thumb_${id}`);
    if (fullUrl) { URL.revokeObjectURL(fullUrl); urlCacheRef.current.delete(id); }
    if (thumbUrl) { URL.revokeObjectURL(thumbUrl); urlCacheRef.current.delete(`thumb_${id}`); }

    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const getUrl = useCallback(async (id: string): Promise<string> => {
    // Check cache first
    const cached = urlCacheRef.current.get(id);
    if (cached) return cached;

    // Load from store
    const { getMedia } = await import("./media-store");
    const item = await getMedia(id);
    if (!item) throw new Error(`Media not found: ${id}`);

    const url = createMediaObjectUrl(item.blob);
    urlCacheRef.current.set(id, url);
    return url;
  }, []);

  const clearError = useCallback(() => setError(null), []);

  /** Get thumbnail URL from cache (synchronous convenience) */
  const getThumbnailUrl = useCallback((id: string): string | undefined => {
    return urlCacheRef.current.get(`thumb_${id}`);
  }, []);

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
