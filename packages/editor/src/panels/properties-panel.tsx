/* ─────────────────────────────────────────────
 * Properties Panel — Right sidebar for editing
 * selected element properties
 *
 * Responsive: shows breakpoint indicator, uses
 * effective transforms, writes to responsive
 * overrides for non-desktop breakpoints, and
 * provides "Reset to Auto" control.
 *
 * Layout: supports both absolute and flow layout
 * modes with appropriate controls for each.
 * ──────────────────────────────────────────── */

"use client";

import React, { useCallback } from "react";
import { useCanvasStore } from "../engine/canvas-store";
import { getElementDefinition } from "../elements/registry";
import { getEffectiveTransform, isElementInFlow } from "../utils/responsive";
import { getEffectiveLayout } from "../engine/layout-engine";
import { useTranslation } from "../i18n";
import type { Breakpoint, SizeUnit } from "@productix/types";
import { BREAKPOINTS } from "@productix/types";

/* ─── Breakpoint display helpers ────────────── */

const BP_LABELS: Record<Breakpoint, string> = {
  desktop: "Desktop",
  laptop: "Laptop",
  tablet: "Tablet",
  mobile: "Mobile",
};

const BP_ICONS: Record<Breakpoint, string> = {
  desktop: "🖥",
  laptop: "💻",
  tablet: "📱",
  mobile: "📲",
};

export function PropertiesPanel() {
  const selectedIds = useCanvasStore((s) => s.selectedIds);
  const elements = useCanvasStore((s) => s.document.elements);
  const artboards = useCanvasStore((s) => s.document.artboards);
  const updateElementProps = useCanvasStore((s) => s.updateElementProps);
  const updateElementTransform = useCanvasStore((s) => s.updateElementTransform);
  const updateElement = useCanvasStore((s) => s.updateElement);
  const removeElement = useCanvasStore((s) => s.removeElement);
  const duplicateElement = useCanvasStore((s) => s.duplicateElement);
  const bringToFront = useCanvasStore((s) => s.bringToFront);
  const sendToBack = useCanvasStore((s) => s.sendToBack);
  const bringForward = useCanvasStore((s) => s.bringForward);
  const sendBackward = useCanvasStore((s) => s.sendBackward);
  const toggleLock = useCanvasStore((s) => s.toggleLock);
  const activeBreakpoint = useCanvasStore((s) => s.activeBreakpoint);
  const updateElementResponsiveOverride = useCanvasStore((s) => s.updateElementResponsiveOverride);
  const clearElementResponsiveOverride = useCanvasStore((s) => s.clearElementResponsiveOverride);
  const updateElementLayout = useCanvasStore((s) => s.updateElementLayout);
  const toggleElementLayoutMode = useCanvasStore((s) => s.toggleElementLayoutMode);
  const { t } = useTranslation();

  const isNonDesktop = activeBreakpoint !== "desktop";

  // Helper: update transform appropriately for the active breakpoint
  const handleTransformChange = useCallback(
    (id: string, changes: Record<string, number>) => {
      if (isNonDesktop) {
        updateElementResponsiveOverride(id, activeBreakpoint, changes);
      } else {
        updateElementTransform(id, changes);
      }
    },
    [isNonDesktop, activeBreakpoint, updateElementResponsiveOverride, updateElementTransform]
  );

  if (selectedIds.length === 0) {
    return (
      <div className="flex flex-col h-full bg-white border-l border-gray-200">
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("properties.title")}</h2>
        </div>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-sm text-gray-400">{t("properties.noSelection")}</p>
            <p className="text-[11px] text-gray-300 mt-1">{t("properties.noSelectionHint")}</p>
          </div>
        </div>
      </div>
    );
  }

  const selId = selectedIds[0];
  if (selectedIds.length > 1 || !selId) {
    return (
      <div className="flex flex-col h-full bg-white border-l border-gray-200">
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("properties.title")}</h2>
        </div>
        <div className="flex-1 flex items-center justify-center px-4">
          <p className="text-sm text-gray-400">{selectedIds.length} {t("properties.multipleSelected")}</p>
        </div>
      </div>
    );
  }

  const el = elements[selId];
  if (!el) return null;

  const def = getElementDefinition(el.type);
  if (!def) return null;

  const PropertyPanelComponent = def.propertyPanel;

  // Compute effective transform for the active breakpoint
  const ab = artboards.find((a) => a.elements.includes(el.id));
  const effectiveT = getEffectiveTransform(el, activeBreakpoint, ab?.width ?? 1440, ab?.height ?? 900);

  // Check if this element is in flow mode
  const isFlow = isElementInFlow(el);
  const effectiveLayout = isFlow ? getEffectiveLayout(el, activeBreakpoint) : null;

  // Check which breakpoints have custom overrides
  const hasOverride = isNonDesktop && !!el.responsiveOverrides?.[activeBreakpoint];
  const hasLayoutOverride = isNonDesktop && isFlow && !!el.responsiveLayout?.[activeBreakpoint];
  const overrideBreakpoints = BREAKPOINTS.filter(
    (bp) => bp !== "desktop" && (el.responsiveOverrides?.[bp] || el.responsiveLayout?.[bp])
  );

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">{def.icon}</span>
          <h2 className="text-xs font-semibold text-gray-700">{def.label}</h2>
        </div>
      </div>

      {/* ── Responsive Breakpoint Indicator ── */}
      {isNonDesktop && (
        <div className="px-4 py-2 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">{BP_ICONS[activeBreakpoint]}</span>
              <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wide">
                {BP_LABELS[activeBreakpoint]} {t("properties.mode")}
              </span>
            </div>
            {(hasOverride || hasLayoutOverride) && (
              <button
                type="button"
                onClick={() => clearElementResponsiveOverride(el.id, activeBreakpoint)}
                className="text-[9px] font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 px-2 py-0.5 rounded-full transition-colors"
              >
                {t("properties.resetToAuto")}
              </button>
            )}
          </div>
          {(hasOverride || hasLayoutOverride) && (
            <p className="text-[9px] text-purple-500 mt-0.5">
              ✦ {t("properties.overrideActive")}
            </p>
          )}
          {!hasOverride && !hasLayoutOverride && (
            <p className="text-[9px] text-blue-400 mt-0.5">
              {t("properties.autoScaled")}
            </p>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-5">

        {/* ── Layout Mode Toggle ── */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Layout Mode</h3>
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => { if (isFlow) toggleElementLayoutMode(el.id); }}
              className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                !isFlow
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              📌 Absolute
            </button>
            <button
              type="button"
              onClick={() => { if (!isFlow) toggleElementLayoutMode(el.id); }}
              className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                isFlow
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              📐 Flow
            </button>
          </div>
          <p className="text-[9px] text-gray-400 mt-1">
            {isFlow
              ? "Element participates in responsive flex layout"
              : "Element uses pixel-precise positioning"}
          </p>
        </div>

        <div className="border-t border-gray-100" />

        {/* ── Flow Layout Controls ── */}
        {isFlow && effectiveLayout && (
          <>
            <div>
              <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Flow Size</h3>
              <div className="grid grid-cols-2 gap-2">
                <label className="block">
                  <span className="text-[10px] text-gray-400 font-medium">Width</span>
                  <div className="flex gap-1 mt-0.5">
                    <input
                      type="number"
                      className="flex-1 w-full rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1.5 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white"
                      value={effectiveLayout.widthValue}
                      onChange={(e) => updateElementLayout(el.id, { widthValue: Number(e.target.value) })}
                      min={0}
                    />
                    <select
                      className="w-14 rounded-md border border-gray-200 bg-white text-xs px-1 focus:outline-none"
                      value={effectiveLayout.widthUnit}
                      onChange={(e) => updateElementLayout(el.id, { widthUnit: e.target.value as SizeUnit })}
                    >
                      <option value="%">%</option>
                      <option value="px">px</option>
                      <option value="auto">auto</option>
                    </select>
                  </div>
                </label>
                <label className="block">
                  <span className="text-[10px] text-gray-400 font-medium">Height</span>
                  <div className="flex gap-1 mt-0.5">
                    <input
                      type="number"
                      className="flex-1 w-full rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1.5 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white"
                      value={effectiveLayout.heightValue}
                      onChange={(e) => updateElementLayout(el.id, { heightValue: Number(e.target.value) })}
                      min={0}
                      disabled={effectiveLayout.heightUnit === "auto"}
                    />
                    <select
                      className="w-14 rounded-md border border-gray-200 bg-white text-xs px-1 focus:outline-none"
                      value={effectiveLayout.heightUnit}
                      onChange={(e) => updateElementLayout(el.id, { heightUnit: e.target.value as SizeUnit })}
                    >
                      <option value="auto">auto</option>
                      <option value="px">px</option>
                      <option value="%">%</option>
                    </select>
                  </div>
                </label>
              </div>

              {/* Margin */}
              <div className="mt-3">
                <span className="text-[10px] text-gray-400 font-medium">Margin (T R B L)</span>
                <div className="grid grid-cols-4 gap-1 mt-0.5">
                  {[0, 1, 2, 3].map((i) => (
                    <input
                      key={`margin-${i}`}
                      type="number"
                      className="w-full rounded-md border border-gray-200 bg-gray-50 px-1.5 py-1 text-xs text-center focus:outline-none focus:border-emerald-500 focus:bg-white"
                      value={effectiveLayout.margin[i]}
                      onChange={(e) => {
                        const newMargin = [...effectiveLayout.margin] as [number, number, number, number];
                        newMargin[i] = Number(e.target.value);
                        updateElementLayout(el.id, { margin: newMargin });
                      }}
                      min={0}
                    />
                  ))}
                </div>
              </div>

              {/* Padding */}
              <div className="mt-2">
                <span className="text-[10px] text-gray-400 font-medium">Padding (T R B L)</span>
                <div className="grid grid-cols-4 gap-1 mt-0.5">
                  {[0, 1, 2, 3].map((i) => (
                    <input
                      key={`padding-${i}`}
                      type="number"
                      className="w-full rounded-md border border-gray-200 bg-gray-50 px-1.5 py-1 text-xs text-center focus:outline-none focus:border-emerald-500 focus:bg-white"
                      value={effectiveLayout.padding[i]}
                      onChange={(e) => {
                        const newPadding = [...effectiveLayout.padding] as [number, number, number, number];
                        newPadding[i] = Number(e.target.value);
                        updateElementLayout(el.id, { padding: newPadding });
                      }}
                      min={0}
                    />
                  ))}
                </div>
              </div>

              {/* Flex item props */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <label className="block">
                  <span className="text-[10px] text-gray-400 font-medium">Flex Grow</span>
                  <input
                    type="number"
                    className="mt-0.5 w-full rounded-md border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white"
                    value={effectiveLayout.flexGrow ?? 0}
                    onChange={(e) => updateElementLayout(el.id, { flexGrow: Number(e.target.value) })}
                    min={0}
                    max={10}
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] text-gray-400 font-medium">Flex Shrink</span>
                  <input
                    type="number"
                    className="mt-0.5 w-full rounded-md border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white"
                    value={effectiveLayout.flexShrink ?? 1}
                    onChange={(e) => updateElementLayout(el.id, { flexShrink: Number(e.target.value) })}
                    min={0}
                    max={10}
                  />
                </label>
              </div>

              {/* Align self */}
              <label className="block mt-2">
                <span className="text-[10px] text-gray-400 font-medium">Align Self</span>
                <select
                  className="mt-0.5 w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs focus:outline-none"
                  value={effectiveLayout.alignSelf ?? "auto"}
                  onChange={(e) => updateElementLayout(el.id, { alignSelf: e.target.value as LayoutProps["alignSelf"] })}
                >
                  <option value="auto">Auto</option>
                  <option value="flex-start">Start</option>
                  <option value="center">Center</option>
                  <option value="flex-end">End</option>
                  <option value="stretch">Stretch</option>
                </select>
              </label>

              {/* Visibility toggle */}
              <label className="flex items-center gap-2 mt-3">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  checked={!!effectiveLayout.hidden}
                  onChange={(e) => updateElementLayout(el.id, { hidden: e.target.checked })}
                />
                <span className="text-[10px] text-gray-500 font-medium">Hidden at this breakpoint</span>
              </label>
            </div>

            <div className="border-t border-gray-100" />
          </>
        )}

        {/* ── Absolute Position/Size Controls ── */}
        {!isFlow && (
          <>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{t("properties.positionSize")}</h3>
                {/* Responsive override dots */}
                {overrideBreakpoints.length > 0 && (
                  <div className="flex items-center gap-1" title={`Custom overrides: ${overrideBreakpoints.join(", ")}`}>
                    {overrideBreakpoints.map((bp) => (
                      <div
                        key={bp}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor: activeBreakpoint === bp ? "#8b5cf6" : "#c4b5fd",
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="block">
                  <span className="text-[10px] text-gray-400 font-medium">X</span>
                  <input
                    type="number"
                    className={`mt-0.5 w-full rounded-md border px-2 py-1.5 text-xs focus:outline-none ${
                      hasOverride
                        ? "border-purple-200 bg-purple-50 focus:border-purple-500 focus:bg-white"
                        : "border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white"
                    }`}
                    value={Math.round(effectiveT.x)}
                    onChange={(e) => handleTransformChange(el.id, { x: Number(e.target.value) })}
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] text-gray-400 font-medium">Y</span>
                  <input
                    type="number"
                    className={`mt-0.5 w-full rounded-md border px-2 py-1.5 text-xs focus:outline-none ${
                      hasOverride
                        ? "border-purple-200 bg-purple-50 focus:border-purple-500 focus:bg-white"
                        : "border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white"
                    }`}
                    value={Math.round(effectiveT.y)}
                    onChange={(e) => handleTransformChange(el.id, { y: Number(e.target.value) })}
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] text-gray-400 font-medium">W</span>
                  <input
                    type="number"
                    className={`mt-0.5 w-full rounded-md border px-2 py-1.5 text-xs focus:outline-none ${
                      hasOverride
                        ? "border-purple-200 bg-purple-50 focus:border-purple-500 focus:bg-white"
                        : "border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white"
                    }`}
                    value={Math.round(effectiveT.width)}
                    onChange={(e) => handleTransformChange(el.id, { width: Math.max(20, Number(e.target.value)) })}
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] text-gray-400 font-medium">H</span>
                  <input
                    type="number"
                    className={`mt-0.5 w-full rounded-md border px-2 py-1.5 text-xs focus:outline-none ${
                      hasOverride
                        ? "border-purple-200 bg-purple-50 focus:border-purple-500 focus:bg-white"
                        : "border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white"
                    }`}
                    value={Math.round(effectiveT.height)}
                    onChange={(e) => handleTransformChange(el.id, { height: Math.max(20, Number(e.target.value)) })}
                  />
                </label>
              </div>
              <label className="block mt-2">
                <span className="text-[10px] text-gray-400 font-medium">{t("properties.rotation")}</span>
                <input
                  type="number"
                  className="mt-0.5 w-full rounded-md border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs focus:border-blue-500 focus:outline-none focus:bg-white"
                  value={Math.round(effectiveT.rotation)}
                  onChange={(e) => handleTransformChange(el.id, { rotation: Number(e.target.value) })}
                />
              </label>
            </div>

            <div className="border-t border-gray-100" />
          </>
        )}

        {/* Opacity (both modes) */}
        <label className="block">
          <span className="text-[10px] text-gray-400 font-medium">{t("properties.opacity")}</span>
          <div className="flex items-center gap-2 mt-0.5">
            <input
              type="range"
              className="flex-1"
              value={el.opacity * 100}
              onChange={(e) => updateElement(el.id, { opacity: Number(e.target.value) / 100 })}
              min={0}
              max={100}
            />
            <span className="text-[10px] text-gray-400 w-8 text-right">{Math.round(el.opacity * 100)}%</span>
          </div>
        </label>

        {/* Separator */}
        <div className="border-t border-gray-100" />

        {/* Element-specific properties */}
        <div>
          <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">{t("properties.elementSettings")}</h3>
          <PropertyPanelComponent
            props={el.props}
            onChange={(changes) => updateElementProps(el.id, changes)}
          />
        </div>

        {/* Separator */}
        <div className="border-t border-gray-100" />

        {/* Layer & Actions */}
        <div>
          <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">{t("properties.layerOrder")}</h3>
          <div className="grid grid-cols-4 gap-1">
            <button type="button" onClick={() => bringToFront(el.id)} className="rounded-md bg-gray-50 px-2 py-1.5 text-[10px] font-medium text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors" title={t("float.bringToFront")}>
              ⬆️ {t("properties.top")}
            </button>
            <button type="button" onClick={() => bringForward(el.id)} className="rounded-md bg-gray-50 px-2 py-1.5 text-[10px] font-medium text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors" title={t("properties.up")}>
              ↑ {t("properties.up")}
            </button>
            <button type="button" onClick={() => sendBackward(el.id)} className="rounded-md bg-gray-50 px-2 py-1.5 text-[10px] font-medium text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors" title={t("properties.down")}>
              ↓ {t("properties.down")}
            </button>
            <button type="button" onClick={() => sendToBack(el.id)} className="rounded-md bg-gray-50 px-2 py-1.5 text-[10px] font-medium text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors" title={t("float.sendToBack")}>
              ⬇️ {t("properties.bottom")}
            </button>
          </div>
        </div>

        <div className="border-t border-gray-100" />

        {/* Quick Actions */}
        <div className="space-y-1.5">
          <button type="button" onClick={() => duplicateElement(el.id)} className="w-full rounded-md bg-gray-50 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors text-left">
            📋 {t("properties.duplicate")}
          </button>
          <button type="button" onClick={() => toggleLock(el.id)} className="w-full rounded-md bg-gray-50 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors text-left">
            {el.locked ? `🔓 ${t("properties.unlock")}` : `🔒 ${t("properties.lock")}`}
          </button>
          <button type="button" onClick={() => removeElement(el.id)} className="w-full rounded-md bg-red-50 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-100 active:bg-red-200 transition-colors text-left">
            🗑️ {t("properties.delete")}
          </button>
        </div>
      </div>
    </div>
  );
}

// Type helper for alignSelf — used in the select onChange
type LayoutProps = import("@productix/types").LayoutProps;
