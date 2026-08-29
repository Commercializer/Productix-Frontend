"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, UploadCloud } from "lucide-react";

interface GalleryImage {
  id: string;
  url: string;
  key: string;
  name: string;
}

/** Multi-image upload/list/delete gallery for a product, backed by the
 * existing /api/media/{upload,list,delete} routes (Cloudflare R2 storage).
 * Scoped by Product.id rather than a language ProductProfile, since the DPP
 * isn't tied to any one profile. */
export function ProductGallery({ productId }: { productId: string }) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/media/list?productId=${productId}&scope=product&type=image`);
        const data = await res.json();
        if (!active) return;
        if (res.ok && Array.isArray(data.items)) {
          setImages(data.items.map((i: any) => ({ id: i.id, url: i.url, key: i.r2Key, name: i.name })));
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [productId]);

  async function uploadFiles(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (list.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      for (const file of list) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("productId", productId);
        const res = await fetch("/api/media/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok || !data.url) throw new Error(data.error || `Failed to upload ${file.name}`);
        setImages((prev) => [{ id: data.id, url: data.url, key: data.key, name: data.name }, ...prev]);
      }
    } catch (e: any) {
      setError(e?.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(image: GalleryImage) {
    setDeletingId(image.id);
    setError(null);
    try {
      const res = await fetch("/api/media/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: image.key }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setImages((prev) => prev.filter((i) => i.id !== image.id));
    } catch (e: any) {
      setError(e?.message ?? "Delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) uploadFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((image) => (
          <div key={image.id} className="group relative aspect-square rounded-xl overflow-hidden border border-(--ds-border) bg-(--ds-bg)">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.url} alt={image.name} className="absolute inset-0 h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => handleDelete(image)}
              disabled={deletingId === image.id}
              className="absolute top-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-100"
              title="Remove photo"
            >
              {deletingId === image.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            if (e.dataTransfer.files) uploadFiles(e.dataTransfer.files);
          }}
          className={`aspect-square rounded-xl border border-dashed flex flex-col items-center justify-center gap-1.5 transition-colors ${
            dragging
              ? "border-blue-400 bg-blue-50/40 dark:bg-blue-500/5"
              : "border-(--ds-border) bg-(--ds-bg) hover:bg-(--ds-surface-2)"
          }`}
        >
          {uploading ? (
            <Loader2 size={18} className="animate-spin text-(--ds-text-muted)" />
          ) : (
            <>
              <ImagePlus size={18} className="text-(--ds-text-muted)" />
              <span className="text-[11px] text-(--ds-text-muted)">Add photos</span>
            </>
          )}
        </button>
      </div>

      {!loading && images.length === 0 && !uploading && (
        <p className="flex items-center gap-1.5 text-[12px] text-(--ds-text-muted)">
          <UploadCloud size={13} /> Drag &amp; drop photos onto the tile above, or click it to browse.
        </p>
      )}
      {error && <p className="text-[12px] text-red-500">{error}</p>}
    </div>
  );
}
