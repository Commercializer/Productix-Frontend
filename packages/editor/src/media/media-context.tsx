"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

import {
  addMedia as storeAddMedia,
  listMedia,
  deleteMedia as storeDeleteMedia,
  setActiveMediaProfile,
  type MediaItem,
  type MediaItemMeta,
  type MediaScope,
} from "./media-store";

/* ─── Types ─────────────────────────────────── */

interface MediaContextValue {
  /** Media items for the current user, scoped per the active scope */
  items: MediaItemMeta[];
  /** Upload a file and return its public R2 URL */
  upload: (file: File) => Promise<string>;
  /** Remove a media item by ID (deletes from R2 + server registry) */
  remove: (id: string) => Promise<void>;
  /** Get a renderable URL for a media ID */
  getUrl: (id: string) => Promise<string>;
  /** Whether an upload is currently in progress */
  isUploading: boolean;
  /** Last upload error message, if any */
  error: string | null;
  /** Clear the error */
  clearError: () => void;
  /** Refresh the items list from the server */
  refresh: () => Promise<void>;
  /** Current library scope ("product" = active product only, "user" = all my uploads) */
  scope: MediaScope;
  /** Switch the library scope (re-fetches) */
  setScope: (scope: MediaScope) => void;
  /** Whether a product context exists (controls whether the scope toggle is useful) */
  hasProductScope: boolean;
}

const MediaContext = createContext<MediaContextValue | null>(null);

function toMeta(item: MediaItem): MediaItemMeta {
  return {
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
  };
}

/* ─── Provider ──────────────────────────────── */

export function MediaProvider({
  children,
  profileId,
}: {
  children: React.ReactNode;
  /** The product (ProductProfile id) being edited - scopes uploads + library */
  profileId?: string;
}) {
  const [items, setItems] = useState<MediaItemMeta[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasProductScope = Boolean(profileId);
  // Default to the active product when we have one, otherwise all the user's media.
  const [scope, setScope] = useState<MediaScope>(hasProductScope ? "product" : "user");

  // Register the active product so uploads (including direct addMedia() calls
  // from element components) are tagged with it.
  useEffect(() => {
    setActiveMediaProfile(profileId ?? null);
    return () => setActiveMediaProfile(null);
  }, [profileId]);

  const refresh = useCallback(async () => {
    try {
      const allItems = await listMedia({ scope });
      setItems(allItems.map(toMeta));
    } catch {
      // Network/auth error - leave the list empty rather than showing stale data
      setItems([]);
    }
  }, [scope]);

  // Reload whenever the scope (or product) changes
  useEffect(() => {
    refresh();
  }, [refresh]);

  const upload = useCallback(
    async (file: File): Promise<string> => {
      setIsUploading(true);
      setError(null);
      try {
        const mediaItem: MediaItem = await storeAddMedia(file);
        // Prepend to the list for instant feedback
        setItems((prev) => [toMeta(mediaItem), ...prev]);
        return mediaItem.url;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Upload failed";
        setError(msg);
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    []
  );

  const remove = useCallback(
    async (id: string) => {
      const target = items.find((item) => item.id === id);
      await storeDeleteMedia(target?.r2Key ?? "");
      setItems((prev) => prev.filter((item) => item.id !== id));
    },
    [items]
  );

  const getUrl = useCallback(
    async (id: string): Promise<string> => {
      const target = items.find((item) => item.id === id);
      if (target?.url) return target.url;
      throw new Error(`Media not found: ${id}`);
    },
    [items]
  );

  const clearError = useCallback(() => setError(null), []);

  return (
    <MediaContext.Provider
      value={{
        items,
        upload,
        remove,
        getUrl,
        isUploading,
        error,
        clearError,
        refresh,
        scope,
        setScope,
        hasProductScope,
      }}
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
