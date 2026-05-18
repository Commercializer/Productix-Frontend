/* ─────────────────────────────────────────────
 * ImageCropDialog — Free-style rectangular crop
 *
 * Model:
 *   - Show the full source image fit inside a viewport.
 *   - User drags a crop rectangle (corners, edges, or interior)
 *     at any aspect ratio.
 *   - Output is a `cropRect` in fractions of the source image:
 *     { x, y, w, h } ∈ [0..1]. The canvas renderer maps this
 *     region into the block according to objectFit.
 * ──────────────────────────────────────────── */

"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

export interface CropRect {
  x: number; // fraction of source width
  y: number; // fraction of source height
  w: number; // fraction of source width
  h: number; // fraction of source height
}

export interface CropResult {
  cropRect: CropRect;
}

interface ImageCropDialogProps {
  src: string;
  /** Existing crop rect, if editing. Defaults to the full image. */
  initialCropRect?: CropRect;
  onConfirm: (result: CropResult) => void;
  onCancel: () => void;
}

const VIEWPORT_TARGET = 560; // px — longest side of viewport
const MIN_HANDLE_PX = 12;    // px — minimum crop dimension in viewport pixels

type Handle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "move";

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

export function ImageCropDialog({
  src,
  initialCropRect,
  onConfirm,
  onCancel,
}: ImageCropDialogProps) {
  const [nat, setNat] = useState<{ w: number; h: number } | null>(null);
  const [crop, setCrop] = useState<CropRect>(
    () => initialCropRect ?? { x: 0, y: 0, w: 1, h: 1 }
  );
  const dragRef = useRef<{
    mode: Handle;
    startX: number;
    startY: number;
    startCrop: CropRect;
  } | null>(null);

  // Viewport size: fit image inside a VIEWPORT_TARGET-px box, preserving aspect.
  const natAspect = nat && nat.h > 0 ? nat.w / nat.h : 1;
  const viewW = natAspect >= 1 ? VIEWPORT_TARGET : VIEWPORT_TARGET * natAspect;
  const viewH = natAspect >= 1 ? VIEWPORT_TARGET / natAspect : VIEWPORT_TARGET;

  const handlePointerDown = useCallback(
    (mode: Handle) => (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragRef.current = {
        mode,
        startX: e.clientX,
        startY: e.clientY,
        startCrop: { ...crop },
      };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [crop]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragRef.current) return;
      const { mode, startX, startY, startCrop } = dragRef.current;
      const dxFrac = (e.clientX - startX) / viewW;
      const dyFrac = (e.clientY - startY) / viewH;
      const minW = MIN_HANDLE_PX / viewW;
      const minH = MIN_HANDLE_PX / viewH;

      const next: CropRect = { ...startCrop };

      if (mode === "move") {
        next.x = clamp(startCrop.x + dxFrac, 0, 1 - startCrop.w);
        next.y = clamp(startCrop.y + dyFrac, 0, 1 - startCrop.h);
      } else {
        const hasW = mode.includes("w");
        const hasE = mode.includes("e");
        const hasN = mode.includes("n");
        const hasS = mode.includes("s");
        if (hasW) {
          const newX = clamp(startCrop.x + dxFrac, 0, startCrop.x + startCrop.w - minW);
          next.x = newX;
          next.w = startCrop.w - (newX - startCrop.x);
        }
        if (hasE) {
          next.w = clamp(startCrop.w + dxFrac, minW, 1 - startCrop.x);
        }
        if (hasN) {
          const newY = clamp(startCrop.y + dyFrac, 0, startCrop.y + startCrop.h - minH);
          next.y = newY;
          next.h = startCrop.h - (newY - startCrop.y);
        }
        if (hasS) {
          next.h = clamp(startCrop.h + dyFrac, minH, 1 - startCrop.y);
        }
      }

      setCrop(next);
    },
    [viewW, viewH]
  );

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    dragRef.current = null;
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch { /* noop */ }
  }, []);

  const confirm = useCallback(() => {
    onConfirm({
      cropRect: {
        x: Number(crop.x.toFixed(4)),
        y: Number(crop.y.toFixed(4)),
        w: Number(crop.w.toFixed(4)),
        h: Number(crop.h.toFixed(4)),
      },
    });
  }, [onConfirm, crop]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onCancel(); }
      else if (e.key === "Enter") { e.preventDefault(); confirm(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel, confirm]);

  // Crop rect in viewport pixels:
  const cropPxX = crop.x * viewW;
  const cropPxY = crop.y * viewH;
  const cropPxW = crop.w * viewW;
  const cropPxH = crop.h * viewH;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div
        className="rounded-2xl bg-white p-6 shadow-2xl"
        style={{ width: Math.max(viewW, 360) + 48 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-base font-bold text-gray-900">Crop Image</h3>
            <p className="text-xs text-gray-500 mt-0.5">Drag handles to resize · drag inside to move</p>
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
            className="relative overflow-hidden rounded-lg bg-gray-900 select-none"
            style={{ width: viewW, height: viewH, touchAction: "none" }}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {/* Full image at viewport size */}
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
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                userSelect: "none",
                display: "block",
              }}
            />

            {/* Dim overlay outside the crop rectangle (4 strips). */}
            <div style={dimStyle({ top: 0, left: 0, right: 0, height: cropPxY })} />
            <div style={dimStyle({ top: cropPxY + cropPxH, left: 0, right: 0, bottom: 0 })} />
            <div style={dimStyle({ top: cropPxY, left: 0, width: cropPxX, height: cropPxH })} />
            <div style={dimStyle({ top: cropPxY, left: cropPxX + cropPxW, right: 0, height: cropPxH })} />

            {/* Crop frame: border + drag-to-move + handles */}
            <div
              onPointerDown={handlePointerDown("move")}
              style={{
                position: "absolute",
                left: cropPxX,
                top: cropPxY,
                width: cropPxW,
                height: cropPxH,
                cursor: "move",
                boxShadow: "inset 0 0 0 2px rgba(59,130,246,0.95)",
              }}
            >
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-x-0 top-1/3 h-px bg-white/30" />
                <div className="absolute inset-x-0 top-2/3 h-px bg-white/30" />
                <div className="absolute inset-y-0 left-1/3 w-px bg-white/30" />
                <div className="absolute inset-y-0 left-2/3 w-px bg-white/30" />
              </div>
              {(["nw", "n", "ne", "e", "se", "s", "sw", "w"] as Handle[]).map((h) => (
                <div
                  key={h}
                  onPointerDown={handlePointerDown(h)}
                  style={{
                    position: "absolute",
                    width: 12,
                    height: 12,
                    background: "white",
                    border: "1.5px solid rgb(59,130,246)",
                    borderRadius: 2,
                    boxSizing: "border-box",
                    ...handlePosition(h),
                    cursor: handleCursor(h),
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setCrop({ x: 0, y: 0, w: 1, h: 1 })}
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

function dimStyle(box: React.CSSProperties): React.CSSProperties {
  return {
    position: "absolute",
    background: "rgba(0,0,0,0.5)",
    pointerEvents: "none",
    ...box,
  };
}

function handlePosition(h: Handle): React.CSSProperties {
  const off = -6;
  switch (h) {
    case "nw": return { top: off, left: off };
    case "n":  return { top: off, left: "50%", marginLeft: -6 };
    case "ne": return { top: off, right: off };
    case "e":  return { top: "50%", right: off, marginTop: -6 };
    case "se": return { bottom: off, right: off };
    case "s":  return { bottom: off, left: "50%", marginLeft: -6 };
    case "sw": return { bottom: off, left: off };
    case "w":  return { top: "50%", left: off, marginTop: -6 };
    default:   return {};
  }
}

function handleCursor(h: Handle): string {
  switch (h) {
    case "nw":
    case "se": return "nwse-resize";
    case "ne":
    case "sw": return "nesw-resize";
    case "n":
    case "s":  return "ns-resize";
    case "e":
    case "w":  return "ew-resize";
    default:   return "default";
  }
}
