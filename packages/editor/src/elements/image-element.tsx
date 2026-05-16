/* ─────────────────────────────────────────────
 * Image Element — Upload, crop, pan & zoom inside block
 *
 * Rendering model:
 *   - Block defines a viewport (overflow: hidden).
 *   - The <img> is absolutely positioned, sized to "cover-fit"
 *     the block at zoom=1, then scaled by zoom, then translated
 *     by (cropOffsetX × width, cropOffsetY × height).
 *   - This gives free 2D pan regardless of whether the image
 *     aspect matches the block aspect.
 *
 * Authoring:
 *   - Drop / pick / library upload → opens ImageCropDialog to
 *     set offset + zoom against the block's aspect ratio.
 *   - Double-click the image on the canvas → enters in-place
 *     crop mode; drag to pan, wheel to zoom.
 *   - Property panel has a "Crop & Position" button to re-open
 *     the dialog any time.
 * ──────────────────────────────────────────── */

"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Crop, ImageIcon } from "lucide-react";
import { registerElement, type ElementRenderProps, type PropertyPanelProps } from "./registry";
import { ImageUploadWidget } from "../media/image-upload-widget";
import { ImageCropDialog } from "../media/image-crop-dialog";
import { useCanvasStore } from "../engine/canvas-store";

const DEFAULT_OFFSET = 0;
const DEFAULT_ZOOM = 1;

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

/* ─── Canvas Component ──────────────────────── */

function ImageElementComponent({ props, isEditing, width, height, onPropsChange }: ElementRenderProps) {
  const src = (props.src as string) || "";
  const alt = (props.alt as string) || "";
  const borderRadius = (props.borderRadius as number) || 0;
  const cropOffsetX = (props.cropOffsetX as number) ?? DEFAULT_OFFSET; // fraction of block width
  const cropOffsetY = (props.cropOffsetY as number) ?? DEFAULT_OFFSET;
  const zoom = (props.zoom as number) || DEFAULT_ZOOM;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [nat, setNat] = useState<{ w: number; h: number } | null>(null);
  const [measured, setMeasured] = useState<{ w: number; h: number } | null>(null);
  const panRef = useRef<{ startX: number; startY: number; startOffsetX: number; startOffsetY: number } | null>(null);

  /* Measure the block's actual rendered (pre-transform) size so the cover-fit
   * math stays correct under any wrapping layout — flow with % widths, the
   * public renderer's `transform: scale()` outer wrapper, hydration mismatches,
   * etc. Falls back to the width/height props until the observer fires. */
  useEffect(() => {
    const el = blockRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w > 0 && h > 0) setMeasured({ w, h });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* Resolve natural image dimensions independently of the JSX <img>'s onLoad —
   * which can miss the load when the image is already cached (e.g. served from
   * SSR before hydration). Without this, `nat` stays null and the cover-fit
   * math falls back to stretch-fit, making images appear squashed. */
  useEffect(() => {
    if (!src) {
      setNat(null);
      return;
    }
    let cancelled = false;
    const img = new window.Image();
    img.onload = () => {
      if (!cancelled && img.naturalWidth && img.naturalHeight) {
        setNat({ w: img.naturalWidth, h: img.naturalHeight });
      }
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  /* Compute cover-fit baseline → final image size on the canvas */
  const safeW = measured?.w || width || 1;
  const safeH = measured?.h || height || 1;
  const blockAspect = safeW / safeH;
  const natAspect = nat && nat.h > 0 ? nat.w / nat.h : blockAspect;
  const baseW = natAspect >= blockAspect ? safeH * natAspect : safeW;
  const baseH = natAspect >= blockAspect ? safeH : safeW / natAspect;
  const finalW = baseW * zoom;
  const finalH = baseH * zoom;
  const imgLeft = (safeW - finalW) / 2 + cropOffsetX * safeW;
  const imgTop = (safeH - finalH) / 2 + cropOffsetY * safeH;

  /* ── Upload handler ── */
  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) return;
      try {
        const { addMedia } = await import("../media/media-store");
        const item = await addMedia(file);
        onPropsChange({
          src: item.url,
          cropOffsetX: DEFAULT_OFFSET,
          cropOffsetY: DEFAULT_OFFSET,
          zoom: DEFAULT_ZOOM,
        });
      } catch {
        const reader = new FileReader();
        reader.onload = () => {
          onPropsChange({
            src: reader.result as string,
            cropOffsetX: DEFAULT_OFFSET,
            cropOffsetY: DEFAULT_OFFSET,
            zoom: DEFAULT_ZOOM,
          });
        };
        reader.readAsDataURL(file);
      }
    },
    [onPropsChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  /* ── In-canvas pan/zoom (only when isEditing) ── */
  const handlePanPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!isEditing) return;
      e.preventDefault();
      e.stopPropagation();
      panRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startOffsetX: cropOffsetX,
        startOffsetY: cropOffsetY,
      };
      setIsPanning(true);
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [isEditing, cropOffsetX, cropOffsetY]
  );

  const handlePanPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!panRef.current || !isEditing) return;
      e.stopPropagation();
      const dx = e.clientX - panRef.current.startX;
      const dy = e.clientY - panRef.current.startY;
      // Clamp so the image always covers the block.
      const maxFracX = Math.max(0, (finalW - safeW) / 2 / safeW);
      const maxFracY = Math.max(0, (finalH - safeH) / 2 / safeH);
      const nextX = clamp(panRef.current.startOffsetX + dx / safeW, -maxFracX, maxFracX);
      const nextY = clamp(panRef.current.startOffsetY + dy / safeH, -maxFracY, maxFracY);
      onPropsChange({
        cropOffsetX: Number(nextX.toFixed(4)),
        cropOffsetY: Number(nextY.toFixed(4)),
      });
    },
    [isEditing, safeW, safeH, finalW, finalH, onPropsChange]
  );

  const handlePanPointerUp = useCallback((e: React.PointerEvent) => {
    if (!panRef.current) return;
    panRef.current = null;
    setIsPanning(false);
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch { /* noop */ }
  }, []);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!isEditing) return;
      e.preventDefault();
      e.stopPropagation();
      const step = e.deltaY > 0 ? -0.08 : 0.08;
      onPropsChange({ zoom: clamp(zoom + step, 1, 4) });
    },
    [isEditing, zoom, onPropsChange]
  );

  /* ── Empty state ── */
  if (!src) {
    return (
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => isEditing && fileInputRef.current?.click()}
        style={{
          width: "100%",
          height: "100%",
          borderRadius,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: dragOver ? "rgba(59,130,246,0.1)" : "rgba(0,0,0,0.04)",
          border: `2px dashed ${dragOver ? "#3b82f6" : "#d1d5db"}`,
          cursor: isEditing ? "pointer" : "default",
          transition: "all 0.15s ease",
          gap: 8,
        }}
      >
        <ImageIcon size={28} style={{ opacity: 0.5, color: "#9ca3af" }} />
        <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>
          {isEditing ? "Click or drag to upload" : "No image"}
        </span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>
    );
  }

  /* ── Image state ── */
  return (
    <div
      ref={blockRef}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onPointerDown={handlePanPointerDown}
      onPointerMove={handlePanPointerMove}
      onPointerUp={handlePanPointerUp}
      onPointerCancel={handlePanPointerUp}
      onWheel={handleWheel}
      style={{
        width: "100%",
        height: "100%",
        borderRadius,
        overflow: "hidden",
        position: "relative",
        cursor: isEditing ? (isPanning ? "grabbing" : "grab") : "default",
        touchAction: isEditing ? "none" : undefined,
      }}
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        onLoad={(e) => {
          const i = e.currentTarget;
          if (i.naturalWidth && i.naturalHeight) {
            setNat({ w: i.naturalWidth, h: i.naturalHeight });
          }
        }}
        style={{
          position: "absolute",
          width: finalW,
          height: finalH,
          left: imgLeft,
          top: imgTop,
          display: "block",
          pointerEvents: "none",
          userSelect: "none",
          maxWidth: "none",
        }}
      />

      {/* Crop-mode overlay */}
      {isEditing && (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              boxShadow: "inset 0 0 0 2px rgba(59,130,246,0.9)",
            }}
          >
            <div style={{ position: "absolute", left: 0, right: 0, top: "33.33%", height: 1, background: "rgba(255,255,255,0.5)" }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: "66.66%", height: 1, background: "rgba(255,255,255,0.5)" }} />
            <div style={{ position: "absolute", top: 0, bottom: 0, left: "33.33%", width: 1, background: "rgba(255,255,255,0.5)" }} />
            <div style={{ position: "absolute", top: 0, bottom: 0, left: "66.66%", width: 1, background: "rgba(255,255,255,0.5)" }} />
          </div>
          <div
            style={{
              position: "absolute",
              top: 6,
              left: 6,
              padding: "2px 8px",
              borderRadius: 6,
              background: "rgba(59,130,246,0.95)",
              color: "#fff",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              pointerEvents: "none",
            }}
          >
            Crop · drag to pan · scroll to zoom
          </div>
        </>
      )}

      {dragOver && !isEditing && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(59,130,246,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 600,
            color: "#1d4ed8",
          }}
        >
          Drop to replace
        </div>
      )}
    </div>
  );
}

/* ─── Property Panel ────────────────────────── */

function ImagePropertyPanel({ props, onChange }: PropertyPanelProps) {
  const src = (props.src as string) || "";
  const cropOffsetX = (props.cropOffsetX as number) ?? DEFAULT_OFFSET;
  const cropOffsetY = (props.cropOffsetY as number) ?? DEFAULT_OFFSET;
  const zoom = (props.zoom as number) || DEFAULT_ZOOM;

  const [cropOpen, setCropOpen] = useState(false);

  // Read the currently-selected element's transform so the crop frame
  // matches the block's actual aspect ratio.
  const selectedIds = useCanvasStore((s) => s.selectedIds);
  const elements = useCanvasStore((s) => s.document.elements);
  const selEl = selectedIds[0] ? elements[selectedIds[0]] : null;
  const aspectRatio = selEl && selEl.transform.height > 0
    ? selEl.transform.width / selEl.transform.height
    : 1;

  const handleCropConfirm = (result: { cropOffsetX: number; cropOffsetY: number; zoom: number }) => {
    onChange({
      cropOffsetX: result.cropOffsetX,
      cropOffsetY: result.cropOffsetY,
      zoom: result.zoom,
    });
    setCropOpen(false);
  };

  return (
    <div className="space-y-3">
      <ImageUploadWidget
        value={src}
        onChange={(url) => {
          if (url !== src) {
            onChange({
              src: url,
              cropOffsetX: DEFAULT_OFFSET,
              cropOffsetY: DEFAULT_OFFSET,
              zoom: DEFAULT_ZOOM,
            });
            if (url) setCropOpen(true);
          }
        }}
        label="Image"
      />

      {src && (
        <button
          type="button"
          onClick={() => setCropOpen(true)}
          className="flex w-full items-center justify-center gap-1.5 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
        >
          <Crop size={12} />
          Crop & Position
        </button>
      )}

      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Alt Text</span>
        <input
          type="text"
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          value={(props.alt as string) || ""}
          onChange={(e) => onChange({ alt: e.target.value })}
        />
      </label>

      {src && (
        <label className="block">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Zoom</span>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="range"
              min={1}
              max={4}
              step={0.05}
              value={zoom}
              onChange={(e) => onChange({ zoom: clamp(Number(e.target.value), 1, 4) })}
              className="flex-1 accent-blue-600"
            />
            <span className="text-xs font-medium text-gray-600 w-12 text-right tabular-nums">
              {zoom.toFixed(2)}x
            </span>
          </div>
        </label>
      )}

      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Border Radius</span>
        <input
          type="number"
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          value={(props.borderRadius as number) || 0}
          onChange={(e) => onChange({ borderRadius: Number(e.target.value) })}
          min={0}
          max={999}
        />
      </label>

      {cropOpen && src && (
        <ImageCropDialog
          src={src}
          aspectRatio={aspectRatio}
          initialOffsetX={cropOffsetX}
          initialOffsetY={cropOffsetY}
          initialZoom={zoom}
          onConfirm={handleCropConfirm}
          onCancel={() => setCropOpen(false)}
        />
      )}
    </div>
  );
}

/* ─── Registration ──────────────────────────── */

registerElement({
  type: "image",
  label: "Image",
  icon: <ImageIcon size={16} />,
  category: "media",
  defaultProps: {
    src: "",
    alt: "",
    cropOffsetX: DEFAULT_OFFSET,
    cropOffsetY: DEFAULT_OFFSET,
    zoom: DEFAULT_ZOOM,
    borderRadius: 8,
  },
  defaultTransform: { width: 343, height: 260 },
  component: ImageElementComponent,
  propertyPanel: ImagePropertyPanel,
});
