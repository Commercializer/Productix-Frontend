/* ─────────────────────────────────────────────
 * Image Element - Upload, crop, pan & zoom inside block
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
 *   - SVG files get an optional color override: the SVG is fetched,
 *     parsed, and all non-none fills/strokes are replaced with the
 *     chosen color before rendering.
 * ──────────────────────────────────────────── */

"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Crop, ImageIcon } from "lucide-react";
import { registerElement, type ElementRenderProps, type PropertyPanelProps } from "./registry";
import { ImageUploadWidget } from "../media/image-upload-widget";
import { ImageCropDialog } from "../media/image-crop-dialog";
import { HexColorPopover } from "./hex-color-popover";

const DEFAULT_OFFSET = 0;
const DEFAULT_ZOOM = 1;

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function isSvgSrc(src: string): boolean {
  if (!src) return false;
  const lower = src.toLowerCase();
  return lower.endsWith(".svg") || lower.includes(".svg?") || lower.startsWith("data:image/svg+xml");
}

/** Build the server-side proxy URL that returns a recolored SVG. */
function recoloredSvgUrl(src: string, color: string): string {
  return `/api/media/svg-recolor?url=${encodeURIComponent(src)}&color=${encodeURIComponent(color)}`;
}

/* ─── Canvas Component ──────────────────────── */

function ImageElementComponent({ props, isEditing, width, height, onPropsChange }: ElementRenderProps) {
  const src = (props.src as string) || "";
  const alt = (props.alt as string) || "";
  const borderRadius = (props.borderRadius as number) || 0;
  const cropOffsetX = (props.cropOffsetX as number) ?? DEFAULT_OFFSET; // fraction of block width
  const cropOffsetY = (props.cropOffsetY as number) ?? DEFAULT_OFFSET;
  const zoom = (props.zoom as number) || DEFAULT_ZOOM;
  const svgColor = (props.svgColor as string) || "";
  const objectFit = ((props.objectFit as string) || "cover") as
    | "cover"
    | "contain"
    | "fill"
    | "none"
    | "scale-down";
  const objectPosition = (props.objectPosition as string) || "center";
  const cropRect = props.cropRect as
    | { x: number; y: number; w: number; h: number }
    | undefined;
  // Free-style crop takes precedence. Otherwise: cover uses the legacy
  // cover-fit + pan/zoom model; other fits use plain CSS object-fit.
  const useCustomCover = !cropRect && objectFit === "cover";
  const useFreeCrop = !!cropRect;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [nat, setNat] = useState<{ w: number; h: number } | null>(null);
  const [measured, setMeasured] = useState<{ w: number; h: number } | null>(null);
  const panRef = useRef<{ startX: number; startY: number; startOffsetX: number; startOffsetY: number } | null>(null);
  /* Measure the block's actual rendered (pre-transform) size so the cover-fit
   * math stays correct under any wrapping layout - flow with % widths, the
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

  /* Resolve natural image dimensions independently of the JSX <img>'s onLoad -
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
      setIsUploading(true);
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
        await new Promise<void>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            onPropsChange({
              src: reader.result as string,
              cropOffsetX: DEFAULT_OFFSET,
              cropOffsetY: DEFAULT_OFFSET,
              zoom: DEFAULT_ZOOM,
            });
            resolve();
          };
          reader.onerror = () => resolve();
          reader.readAsDataURL(file);
        });
      } finally {
        setIsUploading(false);
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

  /* Loading overlay shown while a new file uploads to R2. Reused across the
     image render branches (cover / free-crop / non-cover). */
  const uploadingOverlay = isUploading ? (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 5,
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(2px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: 24,
          height: 24,
          border: "2px solid #dbeafe",
          borderTopColor: "#3b82f6",
          borderRadius: "50%",
          animation: "productix-img-spin 0.8s linear infinite",
        }}
      />
      <span style={{ fontSize: 12, fontWeight: 600, color: "#3b82f6" }}>Uploading…</span>
      <style>{`@keyframes productix-img-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  ) : null;

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
        {isUploading ? (
          <>
            <div
              style={{
                width: 24,
                height: 24,
                border: "2px solid #dbeafe",
                borderTopColor: "#3b82f6",
                borderRadius: "50%",
                animation: "productix-img-spin 0.8s linear infinite",
              }}
            />
            <span style={{ fontSize: 12, color: "#3b82f6", fontWeight: 600 }}>
              Uploading…
            </span>
            <style>{`@keyframes productix-img-spin { to { transform: rotate(360deg); } }`}</style>
          </>
        ) : (
          <>
            <ImageIcon size={28} style={{ opacity: 0.5, color: "#9ca3af" }} />
            <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>
              {isEditing ? "Click or drag to upload" : "No image"}
            </span>
          </>
        )}
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

  /* ── Image state: free-style crop ── */
  if (useFreeCrop && cropRect) {
    // Map the cropped source region into the block using `objectFit`.
    // Geometry summary:
    //   - cw, ch  : crop region size in source pixels.
    //   - cropDispW, cropDispH : size at which the crop region is drawn inside the block.
    //   - imgDispW, imgDispH   : displayed size of the (full) source image.
    //   - imgLeft, imgTop      : top-left of the source image relative to the block.
    const cw = Math.max(1, cropRect.w * (nat?.w || safeW));
    const ch = Math.max(1, cropRect.h * (nat?.h || safeH));
    const cropAspect = cw / ch;
    const blockAspect = safeW / safeH;

    let cropDispW = safeW;
    let cropDispH = safeH;
    if (objectFit === "cover") {
      if (cropAspect >= blockAspect) {
        cropDispH = safeH;
        cropDispW = safeH * cropAspect;
      } else {
        cropDispW = safeW;
        cropDispH = safeW / cropAspect;
      }
    } else if (objectFit === "contain") {
      if (cropAspect >= blockAspect) {
        cropDispW = safeW;
        cropDispH = safeW / cropAspect;
      } else {
        cropDispH = safeH;
        cropDispW = safeH * cropAspect;
      }
    } else if (objectFit === "fill") {
      cropDispW = safeW;
      cropDispH = safeH;
    } else if (objectFit === "none") {
      cropDispW = cw;
      cropDispH = ch;
    } else /* scale-down */ {
      if (cw > safeW || ch > safeH) {
        if (cropAspect >= blockAspect) {
          cropDispW = safeW;
          cropDispH = safeW / cropAspect;
        } else {
          cropDispH = safeH;
          cropDispW = safeH * cropAspect;
        }
      } else {
        cropDispW = cw;
        cropDispH = ch;
      }
    }

    const sx = cropDispW / cw;
    const sy = cropDispH / ch;
    const imgDispW = (nat?.w || safeW) * sx;
    const imgDispH = (nat?.h || safeH) * sy;
    const cropLeft = (safeW - cropDispW) / 2;
    const cropTop = (safeH - cropDispH) / 2;
    const imgLeft = cropLeft - cropRect.x * imgDispW;
    const imgTop = cropTop - cropRect.y * imgDispH;

    return (
      <div
        ref={blockRef}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{
          width: "100%",
          height: "100%",
          borderRadius,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <img
          src={isSvgSrc(src) && svgColor ? recoloredSvgUrl(src, svgColor) : src}
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
            width: imgDispW,
            height: imgDispH,
            left: imgLeft,
            top: imgTop,
            display: "block",
            pointerEvents: "none",
            userSelect: "none",
            maxWidth: "none",
          }}
        />
        {uploadingOverlay}
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

  /* ── Image state: non-cover fits (contain / fill / none / scale-down) ── */
  if (!useCustomCover) {
    return (
      <div
        ref={blockRef}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{
          width: "100%",
          height: "100%",
          borderRadius,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <img
          src={isSvgSrc(src) && svgColor ? recoloredSvgUrl(src, svgColor) : src}
          alt={alt}
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit,
            objectPosition,
            display: "block",
            userSelect: "none",
          }}
        />
        {uploadingOverlay}
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
        src={isSvgSrc(src) && svgColor ? recoloredSvgUrl(src, svgColor) : src}
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

      {uploadingOverlay}
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
  const zoom = (props.zoom as number) || DEFAULT_ZOOM;
  const svgColor = (props.svgColor as string) || "";
  const objectFit = (props.objectFit as string) || "cover";
  const objectPosition = (props.objectPosition as string) || "center";
  const cropRect = props.cropRect as
    | { x: number; y: number; w: number; h: number }
    | undefined;
  const isSvg = isSvgSrc(src);

  const [cropOpen, setCropOpen] = useState(false);

  const handleCropConfirm = (result: { cropRect: { x: number; y: number; w: number; h: number } }) => {
    onChange({
      cropRect: result.cropRect,
      // Clear legacy crop/pan/zoom - the new cropRect supersedes them.
      cropOffsetX: DEFAULT_OFFSET,
      cropOffsetY: DEFAULT_OFFSET,
      zoom: DEFAULT_ZOOM,
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
              cropRect: undefined,
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
        <label className="block">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Image Fit</span>
          <select
            className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
            value={objectFit}
            onChange={(e) => onChange({ objectFit: e.target.value })}
          >
            <option value="cover">Cover (crop to fill)</option>
            <option value="contain">Contain (fit inside)</option>
            <option value="fill">Fill (stretch)</option>
            <option value="none">None (original size)</option>
            <option value="scale-down">Scale down</option>
          </select>
        </label>
      )}

      {src && objectFit !== "cover" && (
        <label className="block">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Image Position</span>
          <select
            className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
            value={objectPosition}
            onChange={(e) => onChange({ objectPosition: e.target.value })}
          >
            <option value="center">Center</option>
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
            <option value="top left">Top Left</option>
            <option value="top right">Top Right</option>
            <option value="bottom left">Bottom Left</option>
            <option value="bottom right">Bottom Right</option>
          </select>
        </label>
      )}

      {src && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setCropOpen(true)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
          >
            <Crop size={12} />
            {cropRect ? "Edit Crop" : "Crop Image"}
          </button>
          {cropRect && (
            <button
              type="button"
              onClick={() => onChange({ cropRect: undefined })}
              className="rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
              title="Remove crop"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {isSvg && (
        <label className="block">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">SVG Color</span>
          <div className="mt-1 flex gap-2 items-center">
            <HexColorPopover
              value={svgColor}
              onChange={(hex) => onChange({ svgColor: hex })}
            />
            <input
              type="text"
              className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-mono uppercase shadow-sm focus:border-blue-500 focus:outline-none"
              value={svgColor || "#000000"}
              onChange={(e) => onChange({ svgColor: e.target.value })}
            />
            {svgColor && (
              <button
                type="button"
                onClick={() => onChange({ svgColor: "" })}
                title="Remove color override"
                className="text-xs text-gray-400 hover:text-gray-600 px-1"
              >
                ✕
              </button>
            )}
          </div>
        </label>
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

      {src && objectFit === "cover" && !cropRect && (
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
          initialCropRect={cropRect}
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
    objectFit: "contain",
    objectPosition: "center",
    cropOffsetX: DEFAULT_OFFSET,
    cropOffsetY: DEFAULT_OFFSET,
    zoom: DEFAULT_ZOOM,
    borderRadius: 8,
    svgColor: "",
  },
  defaultTransform: { width: 343, height: 260 },
  component: ImageElementComponent,
  propertyPanel: ImagePropertyPanel,
});
