/* ─────────────────────────────────────────────
 * Edit Renderer — Full canvas editor layout
 *
 * Canvas interaction model:
 * ─────────────────────────────────────────────
 *  Action                     | Behavior
 * ─────────────────────────────────────────────
 *  Click element              | Select element
 *  Drag element               | Move element
 *  Drag resize handle         | Resize element
 *  Spacebar + drag            | Pan canvas
 *  Middle mouse + drag        | Pan canvas
 *  Drag on empty background   | Pan canvas
 *  Ctrl/⌘ + scroll           | Zoom
 *  Two-finger trackpad scroll | Native scroll (pan)
 * ─────────────────────────────────────────────
 *
 * Canvas scaling uses CSS `transform: scale(zoom)`
 * inside a wrapper whose `minWidth`/`minHeight` are
 * set to the scaled content size, so the native scroll
 * container always has correct scrollbar sizing.
 *
 * Responsive: includes device-preview toolbar for
 * switching breakpoints, and centers the canvas on
 * load and on breakpoint switch.
 * ──────────────────────────────────────────── */

"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useCanvasStore } from "../engine/canvas-store";
import { Artboard } from "../engine/artboard";
import { FloatingToolbar } from "../panels/floating-toolbar";
import { ElementPanel } from "../panels/element-panel";
import { LayerPanel } from "../panels/layer-panel";
import { PropertiesPanel } from "../panels/properties-panel";
import { ArtboardSettings } from "../panels/artboard-settings";
import { ZOOM_STEP, MIN_ZOOM, MAX_ZOOM, NUDGE_DISTANCE, NUDGE_DISTANCE_LARGE } from "../interactions/constants";
import { useCanvasPan } from "../interactions/use-canvas-pan";
import { MediaProvider } from "../media/media-context";
import { getArtboardPreviewWidth, getArtboardPreviewHeight } from "../utils/responsive";
import { useTranslation } from "../i18n";
import { LanguageSwitcher } from "../panels/language-switcher";
import type { CanvasDocument } from "@productix/types";
import type { Breakpoint } from "@productix/types";

// Import elements to trigger registration
import "../elements";

interface EditRendererProps {
  initialDocument?: CanvasDocument;
  onSave?: (document: CanvasDocument) => void;
}

/* ─── Device Presets for the toolbar ───────── */

const DEVICE_PRESETS: { bp: Breakpoint; labelKey: "device.desktop" | "device.laptop" | "device.tablet" | "device.mobile"; icon: string; width: number }[] = [
  { bp: "desktop", labelKey: "device.desktop", icon: "🖥", width: 1440 },
  { bp: "laptop", labelKey: "device.laptop", icon: "💻", width: 1280 },
  { bp: "tablet", labelKey: "device.tablet", icon: "📱", width: 768 },
  { bp: "mobile", labelKey: "device.mobile", icon: "📲", width: 375 },
];

/* ─── Fit-to-view calculation ───────────────── */

const CANVAS_H_PADDING = 120; // left + right padding inside the content area
const CANVAS_V_PADDING = 80;  // top + bottom padding
const ARTBOARD_GAP = 60;      // vertical gap between artboards

function computeFitZoom(
  artboards: { width: number; height: number }[],
  viewportWidth: number,
  viewportHeight: number,
  activeBreakpoint: Breakpoint,
): number {
  if (artboards.length === 0 || viewportWidth <= 0 || viewportHeight <= 0) return 1;

  // Use breakpoint-preview dimensions
  const previewWidths = artboards.map((a) => getArtboardPreviewWidth(a.width, activeBreakpoint));
  const previewHeights = artboards.map((a, i) => getArtboardPreviewHeight(artboards[i]!.width, a.height, activeBreakpoint));

  const maxArtboardWidth = Math.max(...previewWidths);
  const totalContentWidth = maxArtboardWidth + CANVAS_H_PADDING * 2;
  const totalContentHeight = previewHeights.reduce((sum, h) => sum + h, 0)
    + (artboards.length - 1) * ARTBOARD_GAP
    + CANVAS_V_PADDING * 2;

  // The viewport already excludes sidebar widths (getBoundingClientRect)
  // Add a small margin so the artboard doesn't touch the edges
  const fitW = viewportWidth / totalContentWidth;
  const fitH = viewportHeight / totalContentHeight;

  return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Math.min(fitW, fitH, 1)));
}

export function EditRenderer({ initialDocument, onSave }: EditRendererProps) {
  const loadDocument = useCanvasStore((s) => s.loadDocument);
  const document = useCanvasStore((s) => s.document);
  const zoom = useCanvasStore((s) => s.zoom);
  const setZoom = useCanvasStore((s) => s.setZoom);
  const undo = useCanvasStore((s) => s.undo);
  const redo = useCanvasStore((s) => s.redo);
  const past = useCanvasStore((s) => s.past);
  const future = useCanvasStore((s) => s.future);
  const selectedIds = useCanvasStore((s) => s.selectedIds);
  const removeElement = useCanvasStore((s) => s.removeElement);
  const duplicateElement = useCanvasStore((s) => s.duplicateElement);
  const updateElementTransform = useCanvasStore((s) => s.updateElementTransform);
  const elements = useCanvasStore((s) => s.document.elements);
  const deselectAll = useCanvasStore((s) => s.deselectAll);
  const setPageTitle = useCanvasStore((s) => s.setPageTitle);
  const activeBreakpoint = useCanvasStore((s) => s.activeBreakpoint);
  const setActiveBreakpoint = useCanvasStore((s) => s.setActiveBreakpoint);

  const [leftTab, setLeftTab] = useState<"elements" | "layers" | "artboard">("elements");
  const canvasRef = useRef<HTMLDivElement>(null);
  const hasAutoFit = useRef(false);

  // ── i18n ──
  const { t } = useTranslation();

  // ── Canvas pan hook ──
  const {
    isSpaceHeld,
    isPanning,
    panCursor,
    onPanPointerDown,
    onPanPointerMove,
    onPanPointerUp,
  } = useCanvasPan(canvasRef);

  // Load initial document
  useEffect(() => {
    if (initialDocument) {
      loadDocument(initialDocument);
      hasAutoFit.current = false;
    }
  }, [initialDocument, loadDocument]);

  // Center canvas helper
  const centerCanvas = useCallback(() => {
    requestAnimationFrame(() => {
      const c = canvasRef.current;
      if (!c) return;
      c.scrollLeft = (c.scrollWidth - c.clientWidth) / 2;
      c.scrollTop = Math.max(0, (c.scrollHeight - c.clientHeight) / 2 - 40);
    });
  }, []);

  // Auto-fit on first render / document load
  useEffect(() => {
    if (hasAutoFit.current) return;
    if (document.artboards.length === 0) return;
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const fitZoom = computeFitZoom(document.artboards, rect.width, rect.height, activeBreakpoint);
    setZoom(fitZoom);
    hasAutoFit.current = true;

    // Center after zoom takes effect
    setTimeout(centerCanvas, 50);
  }, [document.artboards, setZoom, activeBreakpoint, centerCanvas]);

  // ── Keyboard shortcuts ──
  // NOTE: Spacebar pan is handled by useCanvasPan, not here
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.contentEditable === "true") return;

      const isMeta = e.metaKey || e.ctrlKey;

      // Space is handled by useCanvasPan — skip it here
      if (e.code === "Space") return;

      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        selectedIds.forEach((id) => removeElement(id));
      } else if (isMeta && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (isMeta && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        redo();
      } else if (isMeta && e.key === "d") {
        e.preventDefault();
        selectedIds.forEach((id) => duplicateElement(id));
      } else if (isMeta && e.key === "a") {
        e.preventDefault();
        useCanvasStore.getState().selectAll();
      } else if (e.key === "Escape") {
        deselectAll();
      } else if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        const dist = e.shiftKey ? NUDGE_DISTANCE_LARGE : NUDGE_DISTANCE;
        selectedIds.forEach((id) => {
          const el = elements[id];
          if (!el || el.locked) return;
          const delta = {
            ArrowUp: { y: el.transform.y - dist },
            ArrowDown: { y: el.transform.y + dist },
            ArrowLeft: { x: el.transform.x - dist },
            ArrowRight: { x: el.transform.x + dist },
          }[e.key]!;
          updateElementTransform(id, delta);
        });
      } else if (isMeta && e.key === "0") {
        e.preventDefault();
        handleFitToView();
      } else if (isMeta && e.key === "1") {
        e.preventDefault();
        setZoom(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIds, removeElement, duplicateElement, undo, redo, deselectAll, elements, updateElementTransform, setZoom]);

  // ── Mouse wheel zoom ──
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
        setZoom(zoom + delta);
      }
      // Without modifier: native scroll handles panning (overflow:auto)
    },
    [zoom, setZoom]
  );

  // ── Fit to view ──
  const handleFitToView = useCallback(() => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const fitZoom = computeFitZoom(document.artboards, rect.width, rect.height, activeBreakpoint);
    setZoom(fitZoom);
    setTimeout(centerCanvas, 50);
  }, [document.artboards, setZoom, activeBreakpoint, centerCanvas]);

  // ── Center canvas only (no zoom change) ──
  const handleCenterCanvas = useCallback(() => {
    centerCanvas();
  }, [centerCanvas]);

  // ── Breakpoint switch ──
  const handleBreakpointSwitch = useCallback((bp: Breakpoint) => {
    setActiveBreakpoint(bp);
    // Refit and center after breakpoint change
    requestAnimationFrame(() => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const fitZoom = computeFitZoom(document.artboards, rect.width, rect.height, bp);
      setZoom(fitZoom);
      setTimeout(centerCanvas, 50);
    });
  }, [setActiveBreakpoint, document.artboards, setZoom, centerCanvas]);

  // ── Save ──
  const handleSave = useCallback(() => {
    const state = useCanvasStore.getState();
    const doc = state.document;
    onSave?.(doc);
  }, [onSave]);

  // ── Canvas pointer handlers ──
  // Combined: pan events + deselect on background click
  const handleCanvasPointerDown = useCallback(
    (e: React.PointerEvent) => {
      // Pan takes priority
      onPanPointerDown(e);
    },
    [onPanPointerDown]
  );

  const handleCanvasPointerMove = useCallback(
    (e: React.PointerEvent) => {
      onPanPointerMove(e);
    },
    [onPanPointerMove]
  );

  const handleCanvasPointerUp = useCallback(
    (e: React.PointerEvent) => {
      onPanPointerUp(e);
    },
    [onPanPointerUp]
  );

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      // Only deselect if this was a plain click on background (not end of pan)
      if (isPanning) return;
      const target = e.target as HTMLElement;
      if (target === canvasRef.current || target.dataset.canvasBg === "true") {
        deselectAll();
      }
    },
    [isPanning, deselectAll]
  );

  // Zoom presets
  const ZOOM_PRESETS = [
    { label: "50%", value: 0.5 },
    { label: "75%", value: 0.75 },
    { label: "100%", value: 1 },
    { label: "150%", value: 1.5 },
    { label: "200%", value: 2 },
  ];

  // Computed content sizing for scroll wrapper — uses breakpoint-aware dimensions
  const previewWidths = document.artboards.map((a) => getArtboardPreviewWidth(a.width, activeBreakpoint));
  const previewHeights = document.artboards.map((a) => getArtboardPreviewHeight(a.width, a.height, activeBreakpoint));
  const maxArtboardW = Math.max(0, ...previewWidths);
  const contentW = maxArtboardW + CANVAS_H_PADDING * 2;
  const totalContentH = previewHeights.reduce((sum, h) => sum + h, 0)
    + (document.artboards.length - 1) * ARTBOARD_GAP
    + CANVAS_V_PADDING * 2;

  // Find the active breakpoint preset for display
  const activeDevicePreset = DEVICE_PRESETS.find((p) => p.bp === activeBreakpoint) ?? DEVICE_PRESETS[0]!;

  return (
    <MediaProvider>
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden select-none">
      {/* ── Top Toolbar ── */}
      <header className="flex items-center justify-between h-12 px-4 bg-white border-b border-gray-200 flex-shrink-0 z-50">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-xs font-bold text-white">
              P
            </div>
            <input
              type="text"
              className="text-sm font-semibold text-gray-800 bg-transparent border-none outline-none focus:ring-0 w-40 hover:bg-gray-50 focus:bg-gray-50 px-1 py-0.5 rounded"
              value={document.pageTitle}
              onChange={(e) => setPageTitle(e.target.value)}
            />
          </div>

          <div className="w-px h-5 bg-gray-200" />

          {/* Undo/Redo */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={undo}
              disabled={past.length === 0}
              className="flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
              title={`${t("toolbar.undo")} (Ctrl+Z)`}
            >
              ↶
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={future.length === 0}
              className="flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
              title={`${t("toolbar.redo")} (Ctrl+Y)`}
            >
              ↷
            </button>
          </div>
        </div>

        {/* ── Center: Device Preview Toolbar ── */}
        <div className="flex items-center gap-0.5 bg-gray-50 rounded-lg px-1 py-0.5 border border-gray-200">
          {DEVICE_PRESETS.map((preset) => (
            <button
              key={preset.bp}
              type="button"
              onClick={() => handleBreakpointSwitch(preset.bp)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-all duration-200 ${
                activeBreakpoint === preset.bp
                  ? "bg-white text-blue-600 shadow-sm border border-blue-200"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 border border-transparent"
              }`}
              title={`${t(preset.labelKey)} (${preset.width}px)`}
            >
              <span className="text-sm">{preset.icon}</span>
              <span className="hidden md:inline">{t(preset.labelKey)}</span>
              {activeBreakpoint === preset.bp && (
                <span className="text-[9px] font-mono text-gray-400 hidden lg:inline">{preset.width}px</span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-gray-50 rounded-md px-1.5 py-0.5">
            <button
              type="button"
              onClick={() => setZoom(zoom - ZOOM_STEP * 2)}
              className="text-gray-500 hover:text-gray-700 text-sm px-1 h-7 flex items-center"
            >
              −
            </button>

            <div className="relative group">
              <button
                type="button"
                className="text-xs font-medium text-gray-600 w-12 text-center h-7 flex items-center justify-center hover:bg-gray-100 rounded"
              >
                {Math.round(zoom * 100)}%
              </button>
              <div className="absolute top-full right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[9999] min-w-[100px]">
                {ZOOM_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setZoom(p.value)}
                    className={`w-full text-left px-3 py-1 text-xs transition-colors ${
                      Math.round(zoom * 100) === Math.round(p.value * 100)
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
                <div className="border-t border-gray-100 my-1" />
                <button
                  type="button"
                  onClick={handleFitToView}
                  className="w-full text-left px-3 py-1 text-xs text-gray-600 hover:bg-gray-50"
                >
                  {t("toolbar.fitToView")}
                </button>
                <button
                  type="button"
                  onClick={handleCenterCanvas}
                  className="w-full text-left px-3 py-1 text-xs text-gray-600 hover:bg-gray-50"
                >
                  {t("toolbar.centerCanvas")}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setZoom(zoom + ZOOM_STEP * 2)}
              className="text-gray-500 hover:text-gray-700 text-sm px-1 h-7 flex items-center"
            >
              +
            </button>
          </div>

          {/* Fit to view */}
          <button
            type="button"
            onClick={handleFitToView}
            className="flex items-center h-8 px-2.5 rounded-md text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors"
            title={`${t("toolbar.fitToView")} (Ctrl+0)`}
          >
            ⊞
          </button>

          {/* Center canvas */}
          <button
            type="button"
            onClick={handleCenterCanvas}
            className="flex items-center h-8 px-2.5 rounded-md text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors"
            title={t("toolbar.centerCanvas")}
          >
            ◎
          </button>

          <div className="w-px h-5 bg-gray-200" />

          {/* Language Switcher */}
          <LanguageSwitcher />

          <div className="w-px h-5 bg-gray-200" />

          <a
            href="/preview"
            target="_blank"
            className="flex items-center h-8 px-3 rounded-md text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            👁 {t("toolbar.preview")}
          </a>

          <button
            type="button"
            onClick={handleSave}
            className="flex items-center h-8 px-4 rounded-md bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm"
          >
            {t("toolbar.save")}
          </button>
        </div>
      </header>

      {/* ── Main Area ── */}
      <div className="flex flex-1 min-h-0">
        {/* ── Left Panel ── */}
        <div className="w-56 flex-shrink-0 flex flex-col bg-white border-r border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-100">
            {(["elements", "layers", "artboard"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setLeftTab(tab)}
                className={`flex-1 py-2 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                  leftTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab === "elements" ? t("tab.add") : tab === "layers" ? t("tab.layers") : t("tab.canvas")}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto">
            {leftTab === "elements" && <ElementPanel />}
            {leftTab === "layers" && <LayerPanel />}
            {leftTab === "artboard" && <ArtboardSettings />}
          </div>
        </div>

        {/* ── Canvas Area ── */}
        <div
          ref={canvasRef}
          className="flex-1 overflow-auto relative"
          style={{
            cursor: panCursor || "default",
          }}
          onWheel={handleWheel}
          onPointerDown={handleCanvasPointerDown}
          onPointerMove={handleCanvasPointerMove}
          onPointerUp={handleCanvasPointerUp}
          onClick={handleCanvasClick}
        >
          {/* Pan mode overlay indicator */}
          {isSpaceHeld && (
            <div
              style={{
                position: "sticky",
                top: 8,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 99999,
                pointerEvents: "none",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div className="bg-gray-900/80 text-white text-[10px] font-medium px-3 py-1 rounded-full backdrop-blur-sm">
                ✋ {t("toolbar.panMode")}
              </div>
            </div>
          )}

          {/* Background dot pattern — covers the full scrollable content area.
              Uses pointer-events: auto so clicks on it trigger background deselect and pan. */}
          <div
            data-canvas-bg="true"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              /* Span at least 100% of the viewport AND the full content size */
              width: contentW * zoom,
              height: totalContentH * zoom,
              minWidth: "100%",
              minHeight: "100%",
              backgroundImage: "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
              backgroundSize: "20px 20px",
              zIndex: 0,
            }}
          />

          {/* Artboard wrapper — sized to the scaled content so scrollbars are correct.
              Uses margin: 0 auto so horizontal centering adapts to the viewport width. */}
          <div
            style={{
              width: contentW * zoom,
              minWidth: contentW * zoom,
              minHeight: totalContentH * zoom,
              position: "relative",
              margin: "0 auto",
            }}
          >
            {/* Scaled artboard content */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: ARTBOARD_GAP,
                padding: `${CANVAS_V_PADDING}px ${CANVAS_H_PADDING}px`,
                transform: `scale(${zoom})`,
                transformOrigin: "top left",
                width: contentW,
              }}
            >
              {document.artboards.map((ab) => (
                <div key={ab.id} style={{ position: "relative" }}>
                  <Artboard artboard={ab} />
                </div>
              ))}
            </div>
          </div>

          {/* Floating toolbar — outside scaled container, 1:1 screen pixels */}
          <FloatingToolbar canvasRef={canvasRef} zoom={zoom} />
        </div>

        {/* ── Right Panel ── */}
        <div className="w-64 flex-shrink-0 overflow-y-auto bg-white border-l border-gray-200">
          <PropertiesPanel />
        </div>
      </div>

      {/* ── Status Bar ── */}
      <footer className="flex items-center justify-between h-7 px-4 bg-white border-t border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-4 text-[10px] text-gray-400">
          <span>{Object.keys(document.elements).length} {t("status.elements")}</span>
          <span>{document.artboards.length} {document.artboards.length !== 1 ? t("status.artboards") : t("status.artboard")}</span>
          {selectedIds.length > 0 && (
            <span className="text-blue-500 font-medium">{selectedIds.length} {t("status.selected")}</span>
          )}
        </div>
        <div className="flex items-center gap-3 text-[10px] text-gray-400">
          <span className="font-medium text-blue-500">
            {activeDevicePreset.icon} {t(activeDevicePreset.labelKey)} ({activeDevicePreset.width}px)
          </span>
          <span>{Math.round(zoom * 100)}% · {t("status.panHint")}</span>
        </div>
      </footer>
    </div>
    </MediaProvider>
  );
}
