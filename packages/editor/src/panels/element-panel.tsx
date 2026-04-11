/* ─────────────────────────────────────────────
 * Element Panel — Left sidebar: available elements
 * ──────────────────────────────────────────── */

"use client";

import React, { useCallback } from "react";
import { getAllElements, type ElementDefinition } from "../elements/registry";
import { useCanvasStore } from "../engine/canvas-store";
import { useTranslation } from "../i18n";
import type { TranslationStrings } from "../i18n";

const CATEGORY_KEYS: Record<string, keyof TranslationStrings> = {
  content: "elements.category.content",
  media: "elements.category.media",
  interactive: "elements.category.interactive",
  layout: "elements.category.layout",
  social: "elements.category.social",
  promotional: "elements.category.promotional",
};

const CATEGORY_ORDER = ["content", "media", "interactive", "layout", "promotional", "social"];

export function ElementPanel() {
  const addElement = useCanvasStore((s) => s.addElement);
  const activeArtboardId = useCanvasStore((s) => s.activeArtboardId);
  const document = useCanvasStore((s) => s.document);
  const { t } = useTranslation();

  const handleAdd = useCallback(
    (def: ElementDefinition) => {
      // Place new element in the center of the active artboard
      const ab = document.artboards.find((a) => a.id === activeArtboardId) || document.artboards[0];
      const centerX = ab ? (ab.width - (def.defaultTransform.width || 200)) / 2 : 100;
      const centerY = ab ? (ab.height - (def.defaultTransform.height || 80)) / 2 : 100;

      addElement(
        def.type,
        { ...def.defaultProps },
        {
          ...def.defaultTransform,
          x: centerX,
          y: centerY,
        },
        activeArtboardId ?? undefined
      );
    },
    [addElement, activeArtboardId, document.artboards]
  );

  const allElements = getAllElements();
  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: CATEGORY_KEYS[cat] ? t(CATEGORY_KEYS[cat]!) : cat,
    items: allElements.filter((el) => el.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("elements.title")}</h2>
      </div>

      {/* Element grid */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
        {grouped.map(({ category, label, items }) => (
          <div key={category}>
            <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">
              {label}
            </h3>
            <div className="grid grid-cols-2 gap-1.5">
              {items.map((def) => (
                <button
                  key={def.type}
                  type="button"
                  onClick={() => handleAdd(def)}
                  className="flex flex-col items-center gap-1 rounded-lg border border-gray-100 bg-gray-50/50 px-2 py-3 text-center transition-all hover:bg-blue-50 hover:border-blue-200 hover:shadow-sm active:scale-[0.97] group"
                >
                  <span className="text-xl transition-transform group-hover:scale-110">{def.icon}</span>
                  <span className="text-[10px] font-medium text-gray-600 group-hover:text-blue-700 leading-tight">
                    {def.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
