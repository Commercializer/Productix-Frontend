/* ─────────────────────────────────────────────
 * Artboard Settings — Dimension & background controls
 * with image upload support via ImageUploadWidget
 * ──────────────────────────────────────────── */

"use client";

import React from "react";
import { useCanvasStore } from "../engine/canvas-store";
import { ImageUploadWidget } from "../media/image-upload-widget";
import { useTranslation } from "../i18n";

const PRESETS = [
  { label: "Desktop HD", width: 1440, height: 900 },
  { label: "Desktop", width: 1280, height: 800 },
  { label: "Tablet", width: 768, height: 1024 },
  { label: "Mobile", width: 375, height: 812 },
  { label: "Social Square", width: 1080, height: 1080 },
  { label: "Social Story", width: 1080, height: 1920 },
  { label: "Banner Wide", width: 1200, height: 628 },
];

export function ArtboardSettings() {
  const document = useCanvasStore((s) => s.document);
  const activeArtboardId = useCanvasStore((s) => s.activeArtboardId);
  const updateArtboard = useCanvasStore((s) => s.updateArtboard);
  const addArtboard = useCanvasStore((s) => s.addArtboard);
  const removeArtboard = useCanvasStore((s) => s.removeArtboard);

  const ab = document.artboards.find((a) => a.id === activeArtboardId)
    || document.artboards[0];

  if (!ab) return null;

  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <div className="px-4 py-2 border-b border-gray-100">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("artboard.title")}</h2>
      </div>

      <div className="px-4 space-y-3">
        {/* Name */}
        <label className="block">
          <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">{t("artboard.name")}</span>
          <input
            type="text"
            className="mt-0.5 w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs focus:border-blue-500 focus:outline-none"
            value={ab.name}
            onChange={(e) => updateArtboard(ab.id, { name: e.target.value })}
          />
        </label>

        {/* Dimensions */}
        <div className="grid grid-cols-2 gap-2">
          <label className="block">
            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">{t("artboard.width")}</span>
            <input
              type="number"
              className="mt-0.5 w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs focus:border-blue-500 focus:outline-none"
              value={ab.width}
              onChange={(e) => updateArtboard(ab.id, { width: Math.max(200, Number(e.target.value)) })}
            />
          </label>
          <label className="block">
            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">{t("artboard.height")}</span>
            <input
              type="number"
              className="mt-0.5 w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs focus:border-blue-500 focus:outline-none"
              value={ab.height}
              onChange={(e) => updateArtboard(ab.id, { height: Math.max(200, Number(e.target.value)) })}
            />
          </label>
        </div>

        {/* Presets */}
        <div>
          <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">{t("artboard.presets")}</span>
          <div className="mt-1 flex flex-wrap gap-1">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => updateArtboard(ab.id, { width: p.width, height: p.height })}
                className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors ${
                  ab.width === p.width && ab.height === p.height
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Background Color */}
        <label className="block">
          <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">{t("artboard.bgColor")}</span>
          <div className="mt-1 flex gap-2 items-center">
            <input
              type="color"
              className="h-7 w-7 cursor-pointer rounded border border-gray-200"
              value={ab.backgroundColor}
              onChange={(e) => updateArtboard(ab.id, { backgroundColor: e.target.value })}
            />
            <input
              type="text"
              className="flex-1 rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs focus:border-blue-500 focus:outline-none"
              value={ab.backgroundColor}
              onChange={(e) => updateArtboard(ab.id, { backgroundColor: e.target.value })}
            />
          </div>
        </label>

        {/* ── Background Image Upload ── */}
        <ImageUploadWidget
          value={ab.backgroundImage || ""}
          onChange={(url) => updateArtboard(ab.id, { backgroundImage: url || undefined })}
          label="Background Image"
          compact
        />

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={() => addArtboard()}
            className="flex-1 rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors"
          >
            {t("artboard.add")}
          </button>
          {document.artboards.length > 1 && (
            <button
              type="button"
              onClick={() => removeArtboard(ab.id)}
              className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors"
            >
              {t("artboard.remove")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
