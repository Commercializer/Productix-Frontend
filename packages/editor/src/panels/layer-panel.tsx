/* ─────────────────────────────────────────────
 * Layer Panel — Layer ordering + visibility
 * ──────────────────────────────────────────── */

"use client";

import React, { useCallback } from "react";
import { useCanvasStore } from "../engine/canvas-store";
import { getElementDefinition } from "../elements/registry";
import { useTranslation } from "../i18n";

export function LayerPanel() {
  const document = useCanvasStore((s) => s.document);
  const selectedIds = useCanvasStore((s) => s.selectedIds);
  const select = useCanvasStore((s) => s.select);
  const toggleLock = useCanvasStore((s) => s.toggleLock);
  const toggleVisibility = useCanvasStore((s) => s.toggleVisibility);
  const bringForward = useCanvasStore((s) => s.bringForward);
  const sendBackward = useCanvasStore((s) => s.sendBackward);
  const removeElement = useCanvasStore((s) => s.removeElement);

  // Flatten all elements sorted by z-index (highest first for layer panel)
  const allElements = Object.values(document.elements).sort((a, b) => b.zIndex - a.zIndex);
  const { t } = useTranslation();

  const handleSelect = useCallback(
    (id: string, e: React.MouseEvent) => {
      select(id, e.shiftKey);
    },
    [select]
  );

  if (allElements.length === 0) {
    return (
      <div className="px-4 py-6 text-center">
        <p className="text-xs text-gray-400">{t("layers.empty")}</p>
        <p className="text-[10px] text-gray-300 mt-1">{t("layers.emptyHint")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("layers.title")}</h2>
        <span className="text-[10px] text-gray-400">{allElements.length}</span>
      </div>
      <div className="flex-1 overflow-y-auto">
        {allElements.map((el) => {
          const def = getElementDefinition(el.type);
          const isSelected = selectedIds.includes(el.id);
          const label = el.type === "text" || el.type === "heading"
            ? ((el.props.text as string) || def?.label || el.type).slice(0, 24)
            : def?.label || el.type;

          return (
            <div
              key={el.id}
              onClick={(e) => handleSelect(el.id, e)}
              className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer border-b border-gray-50 transition-colors ${
                isSelected
                  ? "bg-blue-50 border-l-2 border-l-blue-500"
                  : "hover:bg-gray-50 border-l-2 border-l-transparent"
              }`}
            >
              {/* Icon */}
              <span className="text-sm flex-shrink-0 w-5 text-center">{def?.icon || "▪"}</span>

              {/* Label */}
              <span
                className={`flex-1 text-xs truncate ${
                  !el.visible ? "text-gray-300 line-through" : isSelected ? "text-blue-700 font-medium" : "text-gray-700"
                }`}
              >
                {label}
              </span>

              {/* Controls */}
              <div className="flex items-center gap-0.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); toggleVisibility(el.id); }}
                  className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 text-[10px]"
                  title={el.visible ? t("layers.hide") : t("layers.show")}
                >
                  {el.visible ? "👁" : "👁‍🗨"}
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); toggleLock(el.id); }}
                  className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 text-[10px]"
                  title={el.locked ? t("layers.unlock") : t("layers.lock")}
                >
                  {el.locked ? "🔒" : "🔓"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
