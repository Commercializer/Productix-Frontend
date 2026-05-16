/* ─────────────────────────────────────────────
 * ImageCropDialog — Pan & zoom an image to fit a block
 *
 * Model:
 *   - Frame is locked to the block's aspect ratio.
 *   - Image is rendered absolutely-positioned, sized to
 *     "cover-fit" the frame at zoom=1 and scaled by zoom.
 *   - Pan is a free 2D offset in pixels — works regardless
 *     of whether the image aspect matches the frame aspect.
 *   - On confirm we return normalized offsets (fractions of
 *     frame size) so the canvas renderer can apply the same
 *     geometry without knowing the original frame dimensions.
 * ──────────────────────────────────────────── */

"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

export interface CropResult {
  cropOffsetX: number; // fraction of frame width (e.g. 0.12 = 12% right)
  cropOffsetY: number;
  zoom: number;        // 1.0 – 4.0
}

interface ImageCropDialogProps {
  src: string;
  /** Block aspect ratio (width / height). Defines the crop frame shape. */
  aspectRatio: number;
  initialOffsetX?: number;
  initialOffsetY?: number;
  initialZoom?: number;
  onConfirm: (result: CropResult) => void;
  onCancel: () => void;
}

const FRAME_TARGET = 460; // px — longest side of the crop frame

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

export function ImageCropDialog({
  src,
  aspectRatio,
  initialOffsetX = 0,
  initialOffsetY = 0,
  initialZoom = 1,
  onConfirm,
  onCancel,
}: ImageCropDialogProps) {
  // Frame sized to the block's aspect ratio, with the longest side ≈ 460px.
  const frameW = aspectRatio >= 1 ? FRAME_TARGET : FRAME_TARGET * aspectRatio;
  const frameH = aspectRatio >= 1 ? FRAME_TARGET / aspectRatio : FRAME_TARGET;

  // Pan state lives in pixels relative to the frame; converted to fractions on confirm.
  const [offsetX, setOffsetX] = useState(() => initialOffsetX * frameW);
  const [offsetY, setOffsetY] = useState(() => initialOffsetY * frameH);
  const [zoom, setZoom] = useState(initialZoom);
  const [isDragging, setIsDragging] = useState(false);
  const [nat, setNat] = useState<{ w: number; h: number } | null>(null);

  const dragRef = useRef<{ startX: number; startY: number; startOffsetX: number; startOffsetY: number } | null>(null);

  // Compute the cover-fit baseline size (image fills the frame in one axis at zoom=1).
  const natAspect = nat && nat.h > 0 ? nat.w / nat.h : aspectRatio;
  const baseW = natAspect >= aspectRatio ? frameH * natAspect : frameW;
  const baseH = natAspect >= aspectRatio ? frameH : frameW / natAspect;
  const finalW = baseW * zoom;
  const finalH = baseH * zoom;

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startOffsetX: offsetX,
        startOffsetY: offsetY,
      };
      setIsDragging(true);
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [offsetX, offsetY]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      // Clamp so the image always covers the frame.
      const maxX = Math.max(0, (finalW - frameW) / 2);
      const maxY = Math.max(0, (finalH - frameH) / 2);
      setOffsetX(clamp(dragRef.current.startOffsetX + dx, -maxX, maxX));
      setOffsetY(clamp(dragRef.current.startOffsetY + dy, -maxY, maxY));
    },
    [finalW, finalH, frameW, frameH]
  );

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    dragRef.current = null;
    setIsDragging(false);
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch { /* noop */ }
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const step = e.deltaY > 0 ? -0.08 : 0.08;
    setZoom((z) => clamp(z + step, 1, 4));
  }, []);

  // When zoom shrinks, re-clamp existing offset.
  useEffect(() => {
    const maxX = Math.max(0, (finalW - frameW) / 2);
    const maxY = Math.max(0, (finalH - frameH) / 2);
    setOffsetX((v) => clamp(v, -maxX, maxX));
    setOffsetY((v) => clamp(v, -maxY, maxY));
  }, [finalW, finalH, frameW, frameH]);

  const confirm = useCallback(() => {
    onConfirm({
      cropOffsetX: Number((offsetX / frameW).toFixed(4)),
      cropOffsetY: Number((offsetY / frameH).toFixed(4)),
      zoom: Number(zoom.toFixed(2)),
    });
  }, [onConfirm, offsetX, offsetY, zoom, frameW, frameH]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onCancel(); }
      else if (e.key === "Enter") { e.preventDefault(); confirm(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel, confirm]);

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div
        className="rounded-2xl bg-white p-6 shadow-2xl"
        style={{ width: Math.max(frameW, 360) + 48 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-base font-bold text-gray-900">Crop & Position</h3>
            <p className="text-xs text-gray-500 mt-0.5">Drag to pan · scroll or slide to zoom</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex justify-center">
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onWheel={handleWheel}
            className="relative overflow-hidden rounded-lg bg-gray-900 select-none"
            style={{
              width: frameW,
              height: frameH,
              cursor: isDragging ? "grabbing" : "grab",
              touchAction: "none",
            }}
          >
            <img
              src={src}
              alt=""
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
                left: (frameW - finalW) / 2 + offsetX,
                top: (frameH - finalH) / 2 + offsetY,
                pointerEvents: "none",
                userSelect: "none",
                display: "block",
                maxWidth: "none",
              }}
            />
            {/* Rule-of-thirds grid */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-x-0 top-1/3 h-px bg-white/40" />
              <div className="absolute inset-x-0 top-2/3 h-px bg-white/40" />
              <div className="absolute inset-y-0 left-1/3 w-px bg-white/40" />
              <div className="absolute inset-y-0 left-2/3 w-px bg-white/40" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/30" />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="flex items-center gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 w-10">Zoom</span>
            <input
              type="range"
              min={1}
              max={4}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(clamp(Number(e.target.value), 1, 4))}
              className="flex-1 accent-blue-600"
            />
            <span className="text-xs font-medium text-gray-600 w-12 text-right tabular-nums">
              {zoom.toFixed(2)}x
            </span>
          </label>
        </div>

        <div className="mt-5 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => { setOffsetX(0); setOffsetY(0); setZoom(1); }}
            className="rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
          >
            Reset
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirm}
              className="rounded-md bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Apply Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
