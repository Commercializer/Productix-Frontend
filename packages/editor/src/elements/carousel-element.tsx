/* ─────────────────────────────────────────────
 * Carousel Element - Canva-style image carousel
 *
 * One block, many slides. Each slide is an image with
 * an optional caption. On the live page it autoplays,
 * supports prev/next arrows, dot navigation and pointer
 * swipe; in the editor canvas autoplay is paused so the
 * author can position/style it, but arrows + dots still
 * change the previewed slide (clicks are stopped from
 * bubbling so they don't deselect / drag the block).
 *
 * The same registry component renders in the editor and
 * the public renderer - `isInsideEditor()` (the
 * `window.__productixEditor` flag set by EditRenderer)
 * is what flips between authoring and live behavior,
 * mirroring the search element.
 * ──────────────────────────────────────────── */

"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  GalleryHorizontalEnd,
  ImageIcon,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Crop,
} from "lucide-react";
import { registerElement, type ElementRenderProps, type PropertyPanelProps } from "./registry";
import { ImageUploadWidget } from "../media/image-upload-widget";
import { ImageCropDialog } from "../media/image-crop-dialog";
import { HexColorPopover } from "./hex-color-popover";

/* ─── Types ─────────────────────────────────── */

interface CropRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Slide {
  id: string;
  src: string;
  alt?: string;
  caption?: string;
  /** Free-style crop in fractions of the source image (same model as the Image block). */
  cropRect?: CropRect;
}

/** True when running inside the editor canvas (set by EditRenderer). */
function isInsideEditor(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return !!(window as unknown as Record<string, unknown>).__productixEditor;
  } catch {
    return false;
  }
}

function makeSlideId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `slide_${Math.floor(Math.random() * 1e9).toString(36)}`;
  }
}

function readSlides(props: Record<string, unknown>): Slide[] {
  const raw = props.slides;
  return Array.isArray(raw) ? (raw as Slide[]) : [];
}

/* ─── Slide media ───────────────────────────── */

function SlideMedia({
  slide,
  objectFit,
}: {
  slide: Slide;
  objectFit: "cover" | "contain";
}) {
  if (!slide.src) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          background: "rgba(0,0,0,0.04)",
          color: "#9ca3af",
        }}
      >
        <ImageIcon size={28} style={{ opacity: 0.5 }} />
        <span style={{ fontSize: 12, fontWeight: 500 }}>No image</span>
      </div>
    );
  }

  // Free-style crop: the cropped source region is mapped into the slide with a
  // background-image (CSS-only, no need for the source's intrinsic size) -
  // mirrors how the Image block + HTML export render `cropRect`.
  if (slide.cropRect) {
    const c = slide.cropRect;
    const cw = Math.max(0.0001, c.w);
    const ch = Math.max(0.0001, c.h);
    const sizePct = `${(100 / cw).toFixed(4)}% ${(100 / ch).toFixed(4)}%`;
    const posX = cw >= 0.9999 ? "0%" : `${((c.x / (1 - cw)) * 100).toFixed(4)}%`;
    const posY = ch >= 0.9999 ? "0%" : `${((c.y / (1 - ch)) * 100).toFixed(4)}%`;
    return (
      <div
        role="img"
        aria-label={slide.alt || ""}
        style={{
          width: "100%",
          height: "100%",
          backgroundImage: `url('${slide.src}')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: sizePct,
          backgroundPosition: `${posX} ${posY}`,
        }}
      />
    );
  }

  return (
    <img
      src={slide.src}
      alt={slide.alt || ""}
      draggable={false}
      loading="lazy"
      style={{
        width: "100%",
        height: "100%",
        objectFit,
        objectPosition: "center",
        display: "block",
        userSelect: "none",
        pointerEvents: "none",
      }}
    />
  );
}

/* ─── Canvas / Live Component ───────────────── */

function CarouselComponent({ props, scaleFactor = 1 }: ElementRenderProps) {
  const slides = readSlides(props);
  const autoplay = props.autoplay !== false;
  const interval = (props.interval as number) || 3500;
  const loop = props.loop !== false;
  const showArrows = props.showArrows !== false;
  const showDots = props.showDots !== false;
  const objectFit = ((props.objectFit as string) || "cover") === "contain" ? "contain" : "cover";
  const borderRadius = (props.borderRadius as number) ?? 12;
  const bgColor = (props.bgColor as string) || "#000000";
  const transition = ((props.transition as string) || "slide") === "fade" ? "fade" : "slide";
  const arrowColor = (props.arrowColor as string) || "#ffffff";
  const arrowBg = (props.arrowBg as string) || "rgba(0,0,0,0.35)";
  const dotColor = (props.dotColor as string) || "rgba(255,255,255,0.55)";
  const dotActiveColor = (props.dotActiveColor as string) || "#ffffff";
  const captionColor = (props.captionColor as string) || "#ffffff";

  const editor = isInsideEditor();
  const count = slides.length;

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dragDx, setDragDx] = useState(0);
  const dragRef = useRef<{ startX: number; dx: number; active: boolean } | null>(null);

  // Keep the active index in range when slides are added/removed.
  useEffect(() => {
    if (current > count - 1) setCurrent(Math.max(0, count - 1));
  }, [count, current]);

  const goTo = useCallback(
    (i: number) => {
      if (count === 0) return;
      if (loop) setCurrent(((i % count) + count) % count);
      else setCurrent(Math.max(0, Math.min(count - 1, i)));
    },
    [count, loop]
  );

  // Autoplay - live page only. Always wraps so playback is continuous.
  useEffect(() => {
    if (editor) return;
    if (!autoplay || count <= 1 || paused) return;
    const id = window.setInterval(() => {
      setCurrent((c) => (c + 1) % count);
    }, Math.max(1200, interval));
    return () => window.clearInterval(id);
  }, [editor, autoplay, count, paused, interval]);

  /* ── Pointer swipe (live only) ── */
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (editor || count <= 1 || transition !== "slide") return;
      dragRef.current = { startX: e.clientX, dx: 0, active: true };
      setPaused(true);
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
    },
    [editor, count, transition]
  );

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current?.active) return;
    const dx = e.clientX - dragRef.current.startX;
    dragRef.current.dx = dx;
    setDragDx(dx);
  }, []);

  const endDrag = useCallback(
    (e: React.PointerEvent) => {
      const d = dragRef.current;
      dragRef.current = null;
      setDragDx(0);
      setPaused(false);
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
      if (!d?.active) return;
      const threshold = 40;
      if (d.dx <= -threshold) goTo(current + 1);
      else if (d.dx >= threshold) goTo(current - 1);
    },
    [goTo, current]
  );

  const scaledArrow = Math.max(26, Math.round(36 * scaleFactor));
  const scaledArrowIcon = Math.max(12, Math.round(18 * scaleFactor));
  const scaledDot = Math.max(6, Math.round(8 * scaleFactor));
  const scaledCaption = Math.max(11, Math.round(14 * scaleFactor));

  /* ── Empty state ── */
  if (count === 0) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          background: "rgba(0,0,0,0.04)",
          border: "2px dashed #d1d5db",
          color: "#9ca3af",
        }}
      >
        <GalleryHorizontalEnd size={30} style={{ opacity: 0.5 }} />
        <span style={{ fontSize: 12, fontWeight: 500, textAlign: "center", padding: "0 12px" }}>
          {editor ? "Add slides in the panel →" : "No slides"}
        </span>
      </div>
    );
  }

  const showChrome = count > 1;
  const canPrev = loop || current > 0;
  const canNext = loop || current < count - 1;
  const activeSlide = slides[current];

  return (
    <div
      onMouseEnter={() => !editor && setPaused(true)}
      onMouseLeave={() => !editor && setPaused(false)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius,
        overflow: "hidden",
        background: bgColor,
        touchAction: editor ? undefined : "pan-y",
        cursor: !editor && count > 1 && transition === "slide" ? "grab" : "default",
      }}
    >
      {/* ── Slides ── Every slide is an absolutely-positioned full-bleed
          layer (inset:0), so each one is always exactly the size of the
          block - adding more slides can never shrink them. "slide" mode
          translates each layer by its offset from the current index;
          "fade" mode cross-fades opacity. */}
      {slides.map((slide, i) => {
        const isFade = transition === "fade";
        const offset = (i - current) * 100;
        return (
          <div
            key={slide.id}
            style={{
              position: "absolute",
              inset: 0,
              ...(isFade
                ? {
                    opacity: i === current ? 1 : 0,
                    transition: "opacity 0.5s ease",
                    pointerEvents: i === current ? "auto" : "none",
                  }
                : {
                    transform: `translateX(calc(${offset}% + ${dragDx}px))`,
                    transition: dragRef.current?.active
                      ? "none"
                      : "transform 0.45s cubic-bezier(0.22,1,0.36,1)",
                  }),
            }}
          >
            <SlideMedia slide={slide} objectFit={objectFit} />
          </div>
        );
      })}

      {/* ── Caption ── */}
      {activeSlide?.caption && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            padding: `${Math.round(28 * scaleFactor)}px ${Math.round(16 * scaleFactor)}px ${Math.round(14 * scaleFactor)}px`,
            background: "linear-gradient(transparent, rgba(0,0,0,0.6))",
            color: captionColor,
            fontSize: scaledCaption,
            fontWeight: 600,
            lineHeight: 1.3,
            pointerEvents: "none",
          }}
        >
          {activeSlide.caption}
        </div>
      )}

      {/* ── Arrows ── */}
      {showArrows && showChrome && (
        <>
          <CarouselArrow
            dir="prev"
            size={scaledArrow}
            iconSize={scaledArrowIcon}
            color={arrowColor}
            bg={arrowBg}
            disabled={!canPrev}
            onActivate={() => goTo(current - 1)}
          />
          <CarouselArrow
            dir="next"
            size={scaledArrow}
            iconSize={scaledArrowIcon}
            color={arrowColor}
            bg={arrowBg}
            disabled={!canNext}
            onActivate={() => goTo(current + 1)}
          />
        </>
      )}

      {/* ── Dots ── */}
      {showDots && showChrome && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: Math.round(10 * scaleFactor),
            display: "flex",
            justifyContent: "center",
            gap: Math.round(6 * scaleFactor),
            zIndex: 3,
          }}
        >
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                goTo(i);
              }}
              style={{
                width: i === current ? scaledDot * 2.4 : scaledDot,
                height: scaledDot,
                borderRadius: 999,
                border: "none",
                padding: 0,
                cursor: "pointer",
                background: i === current ? dotActiveColor : dotColor,
                transition: "width 0.25s ease, background 0.25s ease",
                boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Arrow button ──────────────────────────── */

function CarouselArrow({
  dir,
  size,
  iconSize,
  color,
  bg,
  disabled,
  onActivate,
}: {
  dir: "prev" | "next";
  size: number;
  iconSize: number;
  color: string;
  bg: string;
  disabled: boolean;
  onActivate: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={dir === "prev" ? "Previous slide" : "Next slide"}
      disabled={disabled}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onActivate();
      }}
      style={{
        position: "absolute",
        top: "50%",
        [dir === "prev" ? "left" : "right"]: Math.round(size * 0.28),
        transform: "translateY(-50%)",
        width: size,
        height: size,
        borderRadius: 999,
        border: "none",
        background: bg,
        color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.35 : 1,
        backdropFilter: "blur(2px)",
        zIndex: 3,
        padding: 0,
      }}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {dir === "prev" ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
      </svg>
    </button>
  );
}

/* ─── Property Panel ────────────────────────── */

function CarouselPropertyPanel({ props, onChange }: PropertyPanelProps) {
  const slides = readSlides(props);
  const labelStyle = "text-xs font-medium text-gray-500 uppercase tracking-wide";
  const inputStyle =
    "mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none";
  const autoplay = props.autoplay !== false;

  // Which slide is being edited. Editing happens one slide at a time so the
  // panel stays short - the strip above is the "carousel" of slides.
  const [sel, setSel] = useState(0);
  const [cropOpen, setCropOpen] = useState(false);
  const safeSel = slides.length === 0 ? 0 : Math.min(sel, slides.length - 1);
  const active = slides[safeSel];

  const updateSlides = (next: Slide[]) => onChange({ slides: next });

  const addSlide = () => {
    updateSlides([...slides, { id: makeSlideId(), src: "", alt: "", caption: "" }]);
    setSel(slides.length); // select the newly appended slide
  };

  const patchSlide = (id: string, patch: Partial<Slide>) =>
    updateSlides(slides.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const removeSlide = (index: number) => {
    updateSlides(slides.filter((_, i) => i !== index));
    setSel((cur) => Math.max(0, Math.min(cur, slides.length - 2)));
  };

  const moveSlide = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= slides.length) return;
    const next = [...slides];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item!);
    updateSlides(next);
    setSel(target);
  };

  return (
    <div className="space-y-4">
      {/* ── Slides strip (horizontal thumbnails) ── */}
      <div className="space-y-2">
        <span className={labelStyle}>Slides ({slides.length})</span>

        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "thin" }}>
          {slides.map((slide, i) => {
            const isSel = i === safeSel;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => setSel(i)}
                title={`Slide ${i + 1}`}
                className="relative overflow-hidden rounded-lg"
                style={{
                  width: 52,
                  height: 52,
                  flex: "0 0 52px",
                  border: `2px solid ${isSel ? "#3b82f6" : "rgba(0,0,0,0.08)"}`,
                  background: slide.src ? `center / cover no-repeat url('${slide.src}')` : "#f3f4f6",
                  cursor: "pointer",
                }}
              >
                {!slide.src && (
                  <span className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <ImageIcon size={16} />
                  </span>
                )}
                <span
                  className="absolute bottom-0 left-0 rounded-tr-md px-1 text-[9px] font-bold leading-tight text-white"
                  style={{ background: isSel ? "#3b82f6" : "rgba(0,0,0,0.55)" }}
                >
                  {i + 1}
                </span>
              </button>
            );
          })}

          {/* Add tile */}
          <button
            type="button"
            onClick={addSlide}
            title="Add slide"
            className="flex items-center justify-center rounded-lg border-2 border-dashed border-blue-200 bg-blue-50 text-blue-500 hover:bg-blue-100"
            style={{ width: 52, height: 52, flex: "0 0 52px" }}
          >
            <Plus size={18} />
          </button>
        </div>

        {/* ── Selected slide editor ── */}
        {active ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50/60 p-2.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-600">Editing slide {safeSel + 1}</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => moveSlide(safeSel, -1)}
                  disabled={safeSel === 0}
                  title="Move left"
                  className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700 disabled:opacity-30"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => moveSlide(safeSel, 1)}
                  disabled={safeSel === slides.length - 1}
                  title="Move right"
                  className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700 disabled:opacity-30"
                >
                  <ChevronRight size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => removeSlide(safeSel)}
                  title="Remove slide"
                  className="rounded p-1 text-gray-400 hover:bg-red-100 hover:text-red-600"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <ImageUploadWidget
              value={active.src}
              onChange={(url) => patchSlide(active.id, { src: url, cropRect: undefined })}
              label="Image"
              compact
            />

            {active.src && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCropOpen(true)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  <Crop size={12} />
                  {active.cropRect ? "Edit Crop" : "Crop & Position"}
                </button>
                {active.cropRect && (
                  <button
                    type="button"
                    onClick={() => patchSlide(active.id, { cropRect: undefined })}
                    className="rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
                    title="Remove crop"
                  >
                    Clear
                  </button>
                )}
              </div>
            )}

            <input
              type="text"
              className="w-full rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs shadow-sm focus:border-blue-500 focus:outline-none"
              placeholder="Caption (optional)"
              value={active.caption ?? ""}
              onChange={(e) => patchSlide(active.id, { caption: e.target.value })}
            />
          </div>
        ) : (
          <p className="rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-500">
            No slides yet. Click the “+” tile to add your first slide.
          </p>
        )}
      </div>

      {/* Crop dialog for the selected slide */}
      {cropOpen && active?.src && (
        <ImageCropDialog
          src={active.src}
          initialCropRect={active.cropRect}
          onConfirm={(result) => {
            patchSlide(active.id, { cropRect: result.cropRect });
            setCropOpen(false);
          }}
          onCancel={() => setCropOpen(false)}
        />
      )}

      {/* ── Playback ── */}
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={autoplay} onChange={(e) => onChange({ autoplay: e.target.checked })} />
        Autoplay
      </label>

      {autoplay && (
        <label className="block">
          <span className={labelStyle}>Interval (ms)</span>
          <input
            type="number"
            className={inputStyle}
            value={(props.interval as number) || 3500}
            onChange={(e) => onChange({ interval: Number(e.target.value) })}
            min={1200}
            max={15000}
            step={250}
          />
        </label>
      )}

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={props.loop !== false} onChange={(e) => onChange({ loop: e.target.checked })} />
        Loop
      </label>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={props.showArrows !== false}
          onChange={(e) => onChange({ showArrows: e.target.checked })}
        />
        Show arrows
      </label>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={props.showDots !== false}
          onChange={(e) => onChange({ showDots: e.target.checked })}
        />
        Show dots
      </label>

      {/* ── Appearance ── */}
      <label className="block">
        <span className={labelStyle}>Transition</span>
        <select
          className={inputStyle}
          value={(props.transition as string) || "slide"}
          onChange={(e) => onChange({ transition: e.target.value })}
        >
          <option value="slide">Slide</option>
          <option value="fade">Fade</option>
        </select>
      </label>

      <label className="block">
        <span className={labelStyle}>Image Fit</span>
        <select
          className={inputStyle}
          value={(props.objectFit as string) || "cover"}
          onChange={(e) => onChange({ objectFit: e.target.value })}
        >
          <option value="cover">Cover (crop to fill)</option>
          <option value="contain">Contain (fit inside)</option>
        </select>
      </label>

      <label className="block">
        <span className={labelStyle}>Border Radius</span>
        <input
          type="number"
          className={inputStyle}
          value={(props.borderRadius as number) ?? 12}
          onChange={(e) => onChange({ borderRadius: Number(e.target.value) })}
          min={0}
          max={999}
        />
      </label>

      <div>
        <span className={labelStyle}>Background</span>
        <label className="mt-1 flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={(props.bgColor as string) === "transparent"}
            onChange={(e) => onChange({ bgColor: e.target.checked ? "transparent" : "#000000" })}
          />
          Transparent
        </label>
        {(props.bgColor as string) !== "transparent" && (
          <div className="mt-1 flex gap-2 items-center">
            <HexColorPopover value={(props.bgColor as string) || ""} onChange={(hex) => onChange({ bgColor: hex })} fallback="#000000" />
            <input
              type="text"
              className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
              value={(props.bgColor as string) || "#000000"}
              onChange={(e) => onChange({ bgColor: e.target.value })}
            />
          </div>
        )}
      </div>

      <label className="block">
        <span className={labelStyle}>Arrow Color</span>
        <div className="mt-1 flex gap-2 items-center">
          <HexColorPopover value={(props.arrowColor as string) || ""} onChange={(hex) => onChange({ arrowColor: hex })} fallback="#ffffff" />
        </div>
      </label>

      <label className="block">
        <span className={labelStyle}>Active Dot Color</span>
        <div className="mt-1 flex gap-2 items-center">
          <HexColorPopover value={(props.dotActiveColor as string) || ""} onChange={(hex) => onChange({ dotActiveColor: hex })} fallback="#ffffff" />
        </div>
      </label>
    </div>
  );
}

/* ─── Registration ──────────────────────────── */

registerElement({
  type: "carousel",
  label: "Carousel",
  icon: <GalleryHorizontalEnd size={16} />,
  category: "media",
  defaultProps: {
    slides: [
      { id: "slide-1", src: "", alt: "", caption: "" },
      { id: "slide-2", src: "", alt: "", caption: "" },
      { id: "slide-3", src: "", alt: "", caption: "" },
    ],
    autoplay: true,
    interval: 3500,
    loop: true,
    showArrows: true,
    showDots: true,
    transition: "slide",
    objectFit: "cover",
    borderRadius: 12,
    bgColor: "#000000",
    arrowColor: "#ffffff",
    arrowBg: "rgba(0,0,0,0.35)",
    dotColor: "rgba(255,255,255,0.55)",
    dotActiveColor: "#ffffff",
    captionColor: "#ffffff",
  },
  defaultTransform: { width: 343, height: 240 },
  component: CarouselComponent,
  propertyPanel: CarouselPropertyPanel,
});
