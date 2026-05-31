/* ─────────────────────────────────────────────
 * Edit Renderer - Product Experience Builder
 *
 * Mobile-first editor with centered iPhone preview,
 * floating Story Blocks drawer, and contextual
 * Block Settings panel. Light, modern, clean UI.
 * ──────────────────────────────────────────── */

"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Undo2,
  Redo2,
  ZoomOut,
  Palette,
  ZoomIn,
  Smartphone,
  Eye,
  Save,
  Loader2,
  Blocks,
  Layers,
  Settings,
  Hand,
  MousePointer2,
  HelpCircle,
  ChevronDown,
  Sparkles,
  Download,
  Upload,
  Globe,
} from "lucide-react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useCanvasStore } from "../engine/canvas-store";
import { Artboard } from "../engine/artboard";
import { FloatingToolbar } from "../panels/floating-toolbar";
import { ElementPanel } from "../panels/element-panel";
import { LayerPanel } from "../panels/layer-panel";
import { PropertiesPanel } from "../panels/properties-panel";
import { FeedbackFormPreview } from "../elements/feedback-preview";
import { ThemePanel } from "../panels/theme-panel";
import { ArtboardSettings } from "../panels/artboard-settings";
import { ContentLocaleTabs } from "../panels/content-locale-tabs";
import { ImportLayoutDialog } from "../panels/import-layout-dialog";
import { ZOOM_STEP, MIN_ZOOM, MAX_ZOOM, NUDGE_DISTANCE, NUDGE_DISTANCE_LARGE } from "../interactions/constants";
import { useCanvasPan } from "../interactions/use-canvas-pan";
import { useMarqueeSelection } from "../interactions/use-marquee-selection";
import { MediaProvider } from "../media/media-context";
import { getArtboardPreviewWidth, getArtboardPreviewHeight } from "../utils/responsive";
import { useTranslation } from "../i18n";
import type { CanvasDocument } from "@productix/types";
import type { Breakpoint } from "@productix/types";

import "../elements";

interface EditRendererProps {
  initialDocument?: CanvasDocument;
  onSave?: (document: CanvasDocument) => Promise<void> | void;
  onPublish?: (document: CanvasDocument) => Promise<void> | void;
  previewSlug?: string;
  /** Export the current document as an encrypted .productix file. Receives the
   *  document and should trigger a download. If omitted the button is hidden. */
  onExportFile?: (document: CanvasDocument) => Promise<void> | void;
  /** Import an encrypted .productix file. Receives the file's text content,
   *  returns the decrypted CanvasDocument (or throws). If omitted button hidden. */
  onImportFile?: (fileContent: string) => Promise<CanvasDocument>;
  /** Open the SEO & sharing settings (page title, description, OG image,
   *  favicon). The host app owns the modal. If omitted the button is hidden. */
  onEditSeo?: () => void;
}

const CANVAS_H_PADDING = 120;
const CANVAS_V_PADDING = 80;
const ARTBOARD_GAP = 60;

function computeFitZoom(
  artboards: { width: number; height: number }[],
  viewportWidth: number,
  viewportHeight: number,
  activeBreakpoint: Breakpoint,
): number {
  if (artboards.length === 0 || viewportWidth <= 0 || viewportHeight <= 0) return 1;
  const previewWidths = artboards.map((a) => getArtboardPreviewWidth(a.width, activeBreakpoint));
  const previewHeights = artboards.map((a, i) => getArtboardPreviewHeight(artboards[i]!.width, a.height, activeBreakpoint));
  const maxW = Math.max(...previewWidths) + 24;
  const totalW = maxW + CANVAS_H_PADDING * 2;
  const totalH = previewHeights.reduce((s, h) => s + h, 0) + 84 + (artboards.length - 1) * ARTBOARD_GAP + CANVAS_V_PADDING * 2;
  return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Math.min(viewportWidth / totalW, viewportHeight / totalH, 1)));
}

export function EditRenderer({ initialDocument, onSave, onPublish, previewSlug, onExportFile, onImportFile, onEditSeo }: EditRendererProps) {
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

  const [leftDrawer, setLeftDrawer] = useState<"blocks" | "order" | "experience" | "themes" | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [lastSavedJSON, setLastSavedJSON] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const hasAutoFit = useRef(false);
  const hasAutoStartedTour = useRef(false);
  const { t } = useTranslation();

  const [activeTool, setActiveTool] = useState<"pointer" | "hand">("pointer");
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);

  const {
    isSpaceHeld, isPanning, panCursor,
    onPanPointerDown, onPanPointerMove, onPanPointerUp,
  } = useCanvasPan(canvasRef, activeTool);

  const {
    marquee,
    onMarqueePointerDown, onMarqueePointerMove, onMarqueePointerUp,
  } = useMarqueeSelection(canvasRef, activeTool);

  useEffect(() => { setActiveBreakpoint("mobile"); }, [setActiveBreakpoint]);

  // Mark window as being in editor context so element components
  // (e.g. audio) can add pointer-event overlays to prevent native
  // controls from stealing selection / drag events.
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__productixEditor = true;
    return () => { delete (window as unknown as Record<string, unknown>).__productixEditor; };
  }, []);

  useEffect(() => {
    if (initialDocument) {
      loadDocument(initialDocument);
      setLastSavedJSON(JSON.stringify(initialDocument));
      hasAutoFit.current = false;
    }
  }, [initialDocument, loadDocument]);

  const centerCanvas = useCallback(() => {
    requestAnimationFrame(() => {
      const c = canvasRef.current;
      if (!c) return;
      c.scrollLeft = (c.scrollWidth - c.clientWidth) / 2;
      c.scrollTop = Math.max(0, (c.scrollHeight - c.clientHeight) / 2 - 40);
    });
  }, []);

  useEffect(() => {
    if (hasAutoFit.current || document.artboards.length === 0 || !canvasRef.current) return;
    setZoom(0.75);
    hasAutoFit.current = true;
    setTimeout(centerCanvas, 50);
  }, [document.artboards, setZoom, centerCanvas]);

  const startTour = useCallback(() => {
    const driverObj = driver({
      showProgress: true,
      animate: true,
      steps: [
        { popover: { title: t("tour.welcome.title"), description: t("tour.welcome.desc"), side: "left", align: "start" } },
        { element: '#tour-top-bar', popover: { title: t("tour.topbar.title"), description: t("tour.topbar.desc"), side: "bottom", align: "start" } },
        { element: '#tour-left-rail', popover: { title: t("tour.leftrail.title"), description: t("tour.leftrail.desc"), side: "right", align: "start" } },
        
        { element: '#tour-btn-themes', popover: { title: t("tour.themes.title"), description: t("tour.btn.themes.desc"), side: "right", align: "start" },
          onHighlightStarted: () => setLeftDrawer(null)
        },
        { element: '#tour-drawer-container', popover: { title: t("tour.themes.title"), description: t("tour.themes.desc"), side: "right", align: "start" },
          onHighlightStarted: () => setLeftDrawer("themes")
        },

        { element: '#tour-btn-blocks', popover: { title: t("tour.blocks.title"), description: t("tour.btn.blocks.desc"), side: "right", align: "start" },
          onHighlightStarted: () => setLeftDrawer(null)
        },
        { element: '#tour-drawer-container', popover: { title: t("tour.blocks.title"), description: t("tour.blocks.desc"), side: "right", align: "start" },
          onHighlightStarted: () => setLeftDrawer("blocks")
        },

        { element: '#tour-btn-order', popover: { title: t("tour.order.title"), description: t("tour.btn.order.desc"), side: "right", align: "start" },
          onHighlightStarted: () => setLeftDrawer(null)
        },
        { element: '#tour-drawer-container', popover: { title: t("tour.order.title"), description: t("tour.order.desc"), side: "right", align: "start" },
          onHighlightStarted: () => setLeftDrawer("order")
        },

        { element: '#tour-btn-canvas', popover: { title: t("tour.canvas_settings.title"), description: t("tour.btn.canvas.desc"), side: "right", align: "start" },
          onHighlightStarted: () => setLeftDrawer(null)
        },
        { element: '#tour-drawer-container', popover: { title: t("tour.canvas_settings.title"), description: t("tour.canvas_settings.desc"), side: "right", align: "start" },
          onHighlightStarted: () => setLeftDrawer("experience")
        },

        { element: '#tour-canvas', popover: { title: t("tour.canvas.title"), description: t("tour.canvas.desc"), side: "top", align: "start" },
          onHighlightStarted: () => setLeftDrawer(null)
        },
        { element: '#tour-publish', popover: { title: t("tour.publish.title"), description: t("tour.publish.desc"), side: "bottom", align: "end" } },
      ],
      onDestroyStarted: () => {
        setLeftDrawer(null);
        localStorage.setItem("editor_tour_seen", "true");
        driverObj.destroy();
      },
    });
    driverObj.drive();
  }, [t]);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("editor_tour_seen");
    if (!hasSeenTour && !hasAutoStartedTour.current) {
      hasAutoStartedTour.current = true;
      setTimeout(startTour, 500);
    }
  }, [startTour]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.contentEditable === "true") return;
      const isMeta = e.metaKey || e.ctrlKey;
      if (e.code === "Space") return;
      if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); selectedIds.forEach((id) => removeElement(id)); }
      else if (isMeta && e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
      else if (isMeta && (e.key === "y" || (e.key === "z" && e.shiftKey))) { e.preventDefault(); redo(); }
      else if (isMeta && e.key === "d") { e.preventDefault(); selectedIds.forEach((id) => duplicateElement(id)); }
      else if (isMeta && e.key === "a") { e.preventDefault(); useCanvasStore.getState().selectAll(); }
      else if (isMeta && e.key === "g" && !e.shiftKey) {
        // Group selected blocks
        e.preventDefault();
        if (selectedIds.length >= 2) {
          useCanvasStore.getState().groupElements(selectedIds);
        }
      }
      else if (isMeta && e.key === "g" && e.shiftKey) {
        // Ungroup selected blocks
        e.preventDefault();
        const state = useCanvasStore.getState();
        const groupIds = new Set<string>();
        for (const id of selectedIds) {
          const el = state.document.elements[id];
          if (el?.groupId) groupIds.add(el.groupId);
        }
        groupIds.forEach((gid) => state.ungroupElements(gid));
      }
      else if (e.key === "Escape") { deselectAll(); setLeftDrawer(null); }
      else if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {
        e.preventDefault();
        const dist = e.shiftKey ? NUDGE_DISTANCE_LARGE : NUDGE_DISTANCE;
        // Collect all unique IDs to nudge (including group members)
        const state = useCanvasStore.getState();
        const idsToNudge = new Set<string>();
        selectedIds.forEach((id) => {
          const memberIds = state.getGroupMemberIds(id);
          memberIds.forEach((mid) => idsToNudge.add(mid));
        });
        idsToNudge.forEach((id) => {
          const el = elements[id] || state.document.elements[id]; if (!el || el.locked) return;
          const delta = { ArrowUp:{y:el.transform.y-dist}, ArrowDown:{y:el.transform.y+dist}, ArrowLeft:{x:el.transform.x-dist}, ArrowRight:{x:el.transform.x+dist} }[e.key]!;
          updateElementTransform(id, delta);
        });
      } else if (isMeta && e.key === "0") { e.preventDefault(); handleFitToView(); }
      else if (!isMeta && e.key.toLowerCase() === "v") { setActiveTool("pointer"); }
      else if (!isMeta && e.key.toLowerCase() === "h") { setActiveTool("hand"); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIds, removeElement, duplicateElement, undo, redo, deselectAll, elements, updateElementTransform, setZoom]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) { e.preventDefault(); setZoom(zoom + (e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP)); }
  }, [zoom, setZoom]);

  const handleFitToView = useCallback(() => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setZoom(computeFitZoom(document.artboards, rect.width, rect.height, activeBreakpoint));
    setTimeout(centerCanvas, 50);
  }, [document.artboards, setZoom, activeBreakpoint, centerCanvas]);

  const handleCanvasPointerDown = useCallback((e: React.PointerEvent) => { onPanPointerDown(e); onMarqueePointerDown(e); }, [onPanPointerDown, onMarqueePointerDown]);
  const handleCanvasPointerMove = useCallback((e: React.PointerEvent) => { onPanPointerMove(e); onMarqueePointerMove(e); }, [onPanPointerMove, onMarqueePointerMove]);
  const handleCanvasPointerUp = useCallback((e: React.PointerEvent) => { onPanPointerUp(e); onMarqueePointerUp(e); }, [onPanPointerUp, onMarqueePointerUp]);
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (isPanning) return;
    const target = e.target as HTMLElement;
    if (target === canvasRef.current || target.dataset.canvasBg === "true") deselectAll();
  }, [isPanning, deselectAll]);

  const documentJSON = JSON.stringify(document);
  const isDirty = documentJSON !== lastSavedJSON;

  // Track latest dirty state for the popstate handler, which is registered
  // once on mount and otherwise wouldn't see updates.
  const isDirtyRef = useRef(isDirty);
  useEffect(() => { isDirtyRef.current = isDirty; }, [isDirty]);

  // Warn before refresh / tab close / hard navigation. Modern browsers ignore
  // the custom message and show their own dialog when returnValue is set.
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
      return "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  // Guard browser back/forward (Next.js client-side nav doesn't fire
  // beforeunload). We push a sentinel history entry on mount; the first back
  // press pops that sentinel and fires popstate while keeping the user on
  // this page. If there are unsaved changes we confirm; otherwise we re-issue
  // a real back to honor the navigation.
  useEffect(() => {
    const SENTINEL = { __productixGuard: true };
    history.pushState(SENTINEL, "", window.location.href);

    const onPopState = () => {
      if (isDirtyRef.current) {
        const ok = window.confirm(
          "You have unsaved changes. Leave without saving?",
        );
        if (ok) {
          // Allow nav: pop past the (now-consumed) sentinel.
          history.back();
        } else {
          // Re-push sentinel so the next back press is also guarded.
          history.pushState(SENTINEL, "", window.location.href);
        }
      } else {
        // No unsaved work — honor the back press the user actually wanted.
        history.back();
      }
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const handleSave = useCallback(async () => {
    const doc = useCanvasStore.getState().document;
    setIsSaving(true);
    try {
      await onSave?.(doc);
      await onPublish?.(doc);
      setLastSavedJSON(JSON.stringify(doc));
    } finally { setIsSaving(false); }
  }, [onSave, onPublish]);

  const handleExportFile = useCallback(async () => {
    if (!onExportFile || isExporting) return;
    const doc = useCanvasStore.getState().document;
    setIsExporting(true);
    try {
      await onExportFile(doc);
    } finally {
      setIsExporting(false);
    }
  }, [onExportFile, isExporting]);

  const handleImportFile = useCallback(
    async (file: File) => {
      if (!onImportFile || isImporting) return;
      setIsImporting(true);
      try {
        const text = await file.text();
        const doc = await onImportFile(text);
        loadDocument(doc);
        setLastSavedJSON("");
      } catch (err) {
        // Re-throw so wrapper page can show a notification — keeps the
        // editor package free of toast styling assumptions.
        throw err;
      } finally {
        setIsImporting(false);
      }
    },
    [onImportFile, isImporting, loadDocument],
  );

  const previewWidths = document.artboards.map((a) => getArtboardPreviewWidth(a.width, activeBreakpoint));
  const previewHeights = document.artboards.map((a) => getArtboardPreviewHeight(a.width, a.height, activeBreakpoint));
  const maxArtboardW = Math.max(0, ...previewWidths) + 24;
  const contentW = maxArtboardW + CANVAS_H_PADDING * 2;
  const totalContentH = previewHeights.reduce((s, h) => s + h, 0) + 84 + (document.artboards.length - 1) * ARTBOARD_GAP + CANVAS_V_PADDING * 2;
  const showRightPanel = selectedIds.length > 0;

  return (
    <MediaProvider>
    <div style={{ display:"flex", flexDirection:"column", height:"100vh", background:"linear-gradient(180deg,#f8fafc 0%,#eef3f9 100%)", overflow:"hidden", userSelect:"none", fontFamily:"var(--font-sans)" }}>

      {/* ── Top Bar ── */}
      <header id="tour-top-bar" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", height:62, padding:"0 18px", background:"#ffffff", borderBottom:"1px solid rgba(15,23,42,0.06)", boxShadow:"0 1px 0 rgba(15,23,42,0.02)", flexShrink:0, zIndex:50 }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <a href="/dashboard" title="Back to dashboard" style={{ display:"flex",alignItems:"center",justifyContent:"center",width:36,height:36,borderRadius:12,background:"linear-gradient(135deg,#f0f9ff,#e0f2fe)",border:"1px solid rgba(2,132,199,0.12)",boxShadow:"0 1px 2px rgba(2,132,199,0.08)",transition:"transform 0.15s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform="scale(1.05)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform="scale(1)"; }}>
            <img src="/productix-logo.png" alt="Productix" width={20} height={19} style={{ display:"block" }} />
          </a>
          <input type="text" style={{ fontSize:14,fontWeight:600,color:"#0f172a",background:"transparent",border:"1px solid transparent",outline:"none",width:200,height:36,padding:"0 12px",borderRadius:10,transition:"all 0.15s ease",letterSpacing:"-0.01em" }}
            onFocus={(e) => { e.currentTarget.style.borderColor="#bae6fd"; e.currentTarget.style.background="#f0f9ff"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor="transparent"; e.currentTarget.style.background="transparent"; }}
            value={document.pageTitle} onChange={(e) => setPageTitle(e.target.value)} />
          <div style={{ width:1,height:22,background:"rgba(15,23,42,0.08)" }} />
          <div style={{ display:"flex",gap:2 }}>
            <TopBtn onClick={undo} disabled={past.length===0} title="Undo"><Undo2 size={16} /></TopBtn>
            <TopBtn onClick={redo} disabled={future.length===0} title="Redo"><Redo2 size={16} /></TopBtn>
            
            <div style={{ width:1,height:22,background:"rgba(15,23,42,0.08)",margin:"0 10px",alignSelf:"center" }} />
            
            <TopBtn 
              onClick={() => setActiveTool("pointer")} 
              title="Select Tool (V)"
              active={activeTool === "pointer"}
            ><MousePointer2 size={16} /></TopBtn>
            <TopBtn 
              onClick={() => setActiveTool("hand")} 
              title="Hand Tool (H)"
              active={activeTool === "hand"}
            ><Hand size={16} /></TopBtn>
            
            <div style={{ width:1,height:22,background:"rgba(15,23,42,0.08)",margin:"0 10px",alignSelf:"center" }} />
            <TopBtn onClick={startTour} title="Show Tour"><HelpCircle size={16} /></TopBtn>
          </div>
        </div>

        {/* Content Language Tabs */}
        <ContentLocaleTabs />

        <div style={{ display:"flex",alignItems:"center",gap:4 }}>
          <TopBtn onClick={() => setZoom(zoom-ZOOM_STEP*2)} title="Zoom out"><ZoomOut size={16} /></TopBtn>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <select
              value={Math.round(zoom * 100)}
              onChange={(e) => {
                if (e.target.value === "fit") handleFitToView();
                else setZoom(parseInt(e.target.value, 10) / 100);
              }}
              style={{
                appearance: "none",
                background: "transparent",
                border: "none",
                fontSize: 11.5,
                fontWeight: 700,
                color: "#475569",
                minWidth: 46,
                textAlign: "center",
                outline: "none",
                cursor: "pointer",
                padding: "0 14px 0 4px",
                letterSpacing: "0.02em",
              }}
              title="Zoom size"
            >
              <option value="fit">Fit</option>
              <option value="25">25%</option>
              <option value="50">50%</option>
              <option value="75">75%</option>
              <option value="100">100%</option>
              <option value="125">125%</option>
              <option value="150">150%</option>
              <option value="200">200%</option>
              {![25, 50, 75, 100, 125, 150, 200].includes(Math.round(zoom * 100)) && (
                <option value={Math.round(zoom * 100)} hidden>
                  {Math.round(zoom * 100)}%
                </option>
              )}
            </select>
            <ChevronDown size={10} style={{ color: "#94a3b8", position: "absolute", right: 4, pointerEvents: "none" }} />
          </div>
          <TopBtn onClick={() => setZoom(zoom+ZOOM_STEP*2)} title="Zoom in"><ZoomIn size={16} /></TopBtn>
        </div>

        <div id="tour-publish" style={{ display:"flex",alignItems:"center",gap:8 }}>
          {onImportFile && (
            <>
              <input
                ref={importInputRef}
                type="file"
                accept=".productix,application/json"
                style={{ display: "none" }}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  // Reset so picking the same file twice still fires onChange.
                  e.target.value = "";
                  if (!file) return;
                  try {
                    await handleImportFile(file);
                  } catch (err: any) {
                    alert(`Import failed: ${err?.message ?? "unknown error"}`);
                  }
                }}
              />
              <PillBtn
                onClick={() => importInputRef.current?.click()}
                disabled={isImporting}
                title="Import .productix file"
                icon={isImporting ? <Loader2 size={14} style={{ animation: "spin 0.6s linear infinite" }} /> : <Upload size={14} />}
                label={isImporting ? "Importing…" : "Import"}
              />
            </>
          )}
          {onExportFile && (
            <PillBtn
              onClick={handleExportFile}
              disabled={isExporting}
              title="Export as encrypted .productix file"
              icon={isExporting ? <Loader2 size={14} style={{ animation: "spin 0.6s linear infinite" }} /> : <Download size={14} />}
              label={isExporting ? "Exporting…" : "Export"}
            />
          )}
          {onEditSeo && (
            <PillBtn
              onClick={onEditSeo}
              title="SEO & sharing — page title, description, social image, favicon"
              icon={<Globe size={14} />}
              label="SEO"
            />
          )}
          <a href={previewSlug?`/preview/${previewSlug}`:"#"} target={previewSlug?"_blank":undefined}
            onClick={(e) => { if (!previewSlug) { e.preventDefault(); alert("Please save first."); } }}
            onMouseEnter={(e) => { e.currentTarget.style.background="#f1f5f9"; e.currentTarget.style.color="#0f172a"; e.currentTarget.style.borderColor="rgba(15,23,42,0.12)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background="#ffffff"; e.currentTarget.style.color="#475569"; e.currentTarget.style.borderColor="rgba(15,23,42,0.08)"; }}
            style={{ display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,height:36,padding:"0 16px",borderRadius:10,fontSize:12.5,fontWeight:600,letterSpacing:"0.01em",color:"#475569",background:"#ffffff",border:"1px solid rgba(15,23,42,0.08)",textDecoration:"none",cursor:"pointer",transition:"all 0.15s",boxShadow:"0 1px 2px rgba(15,23,42,0.04)" }}>
            <Eye size={14} /> {t("toolbar.preview")}
          </a>
          <button type="button" onClick={handleSave} disabled={isSaving}
            style={{ display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,height:36,padding:"0 18px",borderRadius:10,background:isDirty?"linear-gradient(135deg,#0ea5e9,#0284c7)":"linear-gradient(135deg,#0284c7,#0369a1)",color:"#fff",fontSize:12.5,fontWeight:700,letterSpacing:"0.01em",border:"none",cursor:isSaving?"wait":"pointer",opacity:isSaving?0.75:1,transition:"transform 0.15s ease, box-shadow 0.2s ease",boxShadow:"0 6px 16px rgba(2,132,199,0.28), inset 0 1px 0 rgba(255,255,255,0.25)" }}
            onMouseEnter={(e) => { if (!isSaving) e.currentTarget.style.transform="translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform="translateY(0)"; }}>
            {isSaving ? <Loader2 size={14} style={{ animation:"spin 0.6s linear infinite" }} /> : <Save size={14} />}
            {isSaving ? "Saving…" : isDirty ? t("toolbar.saveDraft") : "Saved"}
          </button>
        </div>
      </header>

      {/* ── Main Area ── */}
      <div style={{ display:"flex", flex:1, minHeight:0, padding:"12px", gap:"12px" }}>

        {/* ── Left Tools Container ── */}
        <div id="tour-drawer-container" style={{ display: "flex", height: "100%", zIndex: 40, flexShrink: 0, gap: 10 }}>
          {/* ── Left Tool Rail ── */}
          <div id="tour-left-rail" style={{ width:64,flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",padding:"10px 8px",gap:4,background:"linear-gradient(180deg,#eaf1fa 0%,#dfeaf6 100%)",borderRadius:18,border:"1px solid rgba(2,132,199,0.10)",boxShadow:"0 4px 16px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.5)" }}>
            <RailBtn id="tour-btn-themes" icon={<Palette size={18} />} label="Themes" active={leftDrawer==="themes"} onClick={() => setLeftDrawer(leftDrawer==="themes"?null:"themes")} />
            <RailBtn id="tour-btn-blocks" icon={<Blocks size={18} />} label="Blocks" active={leftDrawer==="blocks"} onClick={() => setLeftDrawer(leftDrawer==="blocks"?null:"blocks")} />
            <RailBtn id="tour-btn-order" icon={<Layers size={18} />} label="Order" active={leftDrawer==="order"} onClick={() => setLeftDrawer(leftDrawer==="order"?null:"order")} />
            <RailBtn id="tour-btn-canvas" icon={<Settings size={18} />} label="Canvas" active={leftDrawer==="experience"} onClick={() => setLeftDrawer(leftDrawer==="experience"?null:"experience")} />
            <div style={{ width: 32, height: 1, background: "rgba(2,132,199,0.18)", margin: "8px 0" }} />
            <RailBtn id="tour-btn-import" icon={<Sparkles size={18} />} label="AI Import" active={importOpen} onClick={() => setImportOpen(true)} />
          </div>

          {/* ── Left Drawer ── */}
          {leftDrawer && (
            <div id="tour-left-drawer" style={{ width:280,flexShrink:0,background:"#ffffff",borderRadius:18,border:"1px solid rgba(15,23,42,0.06)",boxShadow:"0 8px 28px rgba(15,23,42,0.08), 0 1px 2px rgba(15,23,42,0.04)",overflowY:"auto",animation:"slideInLeft 0.2s ease" }}>
              {leftDrawer==="themes" && <ThemePanel />}
              {leftDrawer==="blocks" && <ElementPanel />}
              {leftDrawer==="order" && <LayerPanel />}
              {leftDrawer==="experience" && <ArtboardSettings />}
            </div>
          )}
        </div>

        {/* ── Canvas ── */}
        <div id="tour-canvas" ref={canvasRef} style={{ flex:1,overflow:"auto",position:"relative",cursor:panCursor||"default",background:"linear-gradient(180deg,#f1f5f9 0%,#e6edf5 100%)",borderRadius:18,border:"1px solid rgba(15,23,42,0.06)",boxShadow:"inset 0 1px 0 rgba(255,255,255,0.6), 0 4px 16px rgba(15,23,42,0.05)" }}
          onWheel={handleWheel} onPointerDown={handleCanvasPointerDown} onPointerMove={handleCanvasPointerMove} onPointerUp={handleCanvasPointerUp} onPointerCancel={handleCanvasPointerUp} onClick={handleCanvasClick}>

          {marquee && (
            <div
              style={{
                position: "absolute",
                left: marquee.left,
                top: marquee.top,
                width: marquee.width,
                height: marquee.height,
                background: "rgba(139, 92, 246, 0.15)",
                border: "1px solid rgba(139, 92, 246, 0.5)",
                pointerEvents: "none",
                zIndex: 99999, // Ensure it draws above elements
              }}
            />
          )}

          {isSpaceHeld && (
            <div style={{ position:"sticky",top:10,left:"50%",transform:"translateX(-50%)",zIndex:99999,pointerEvents:"none",display:"flex",justifyContent:"center" }}>
              <div style={{ background:"linear-gradient(135deg,#0ea5e9,#0284c7)",color:"#fff",fontSize:10.5,fontWeight:700,letterSpacing:"0.04em",padding:"5px 14px",borderRadius:999,display:"flex",alignItems:"center",gap:6,boxShadow:"0 6px 18px rgba(2,132,199,0.32), inset 0 1px 0 rgba(255,255,255,0.25)" }}><Hand size={12} /> PAN MODE</div>
            </div>
          )}

          <div data-canvas-bg="true" style={{ position:"absolute",top:0,left:0,width:contentW*zoom,height:totalContentH*zoom,minWidth:"100%",minHeight:"100%",background:"radial-gradient(ellipse at 50% 25%, #e0f2fe 0%, #eef3f9 45%, #e6edf5 100%)",zIndex:0 }} />

          <div style={{ width:contentW*zoom,minWidth:contentW*zoom,minHeight:totalContentH*zoom,position:"relative",margin:"0 auto" }}>
            <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:ARTBOARD_GAP,padding:`${CANVAS_V_PADDING}px ${CANVAS_H_PADDING}px`,transform:`scale(${zoom})`,transformOrigin:"top left",width:contentW }}>
              {document.artboards.map((ab) => (
                <div key={ab.id} style={{ position:"relative" }}><Artboard artboard={ab} /></div>
              ))}
            </div>
          </div>

          <FloatingToolbar canvasRef={canvasRef} zoom={zoom} />
        </div>

        {/* ── Feedback Form Preview - appears only when a Feedback block is selected ── */}
        <FeedbackFormPreview />

        {/* ── Right Panel (Block Settings) ── */}
        {showRightPanel && (
          <div className="properties-panel" style={{ width:300,flexShrink:0,overflowY:"auto",background:"#ffffff",borderRadius:18,border:"1px solid rgba(15,23,42,0.06)",boxShadow:"0 8px 28px rgba(15,23,42,0.08), 0 1px 2px rgba(15,23,42,0.04)",animation:"slideInRight 0.2s ease" }}>
            <PropertiesPanel />
          </div>
        )}
      </div>

      {/* ── Status Bar ── */}
      <footer style={{ display:"flex",alignItems:"center",justifyContent:"space-between",height:30,padding:"0 18px",background:"#ffffff",borderTop:"1px solid rgba(15,23,42,0.06)",flexShrink:0 }}>
        <div style={{ display:"flex",alignItems:"center",gap:10,fontSize:10.5,color:"#94a3b8",fontWeight:500 }}>
          <span style={{ display:"inline-flex",alignItems:"center",gap:5 }}><span style={{ width:6,height:6,borderRadius:999,background:"#22c55e",boxShadow:"0 0 0 2px rgba(34,197,94,0.18)" }} /> {Object.keys(document.elements).length} {t("status.blocks")}</span>
          {selectedIds.length>0 && <span style={{ color:"#0284c7",fontWeight:700,padding:"2px 8px",borderRadius:999,background:"rgba(2,132,199,0.08)" }}>{selectedIds.length} {t("status.selected")}</span>}
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:10,fontSize:10.5,color:"#94a3b8",fontWeight:500 }}>
          <span style={{ color:"#0284c7",fontWeight:700,display:"flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:999,background:"rgba(2,132,199,0.08)" }}><Smartphone size={11} /> {t("status.mobilePreview")}</span>
          <span style={{ letterSpacing:"0.02em" }}>{Math.round(zoom*100)}%</span>
        </div>
      </footer>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideInLeft { from { transform: translateX(-20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideInRight { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>

      <ImportLayoutDialog open={importOpen} onClose={() => setImportOpen(false)} />
    </div>
    </MediaProvider>
  );
}

function TopBtn({ children, onClick, disabled, title, active }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; title?: string; active?: boolean; }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} title={title}
      style={{ width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:10,border:"1px solid transparent",background:active?"linear-gradient(135deg,#f0f9ff,#e0f2fe)":"transparent",color:disabled?"#cbd5e1":active?"#0284c7":"#64748b",cursor:disabled?"not-allowed":"pointer",fontSize:14,transition:"all 0.15s ease",boxShadow:active?"inset 0 -1px 0 rgba(2,132,199,0.06), 0 1px 2px rgba(2,132,199,0.08)":"none" }}
      onMouseEnter={(e) => { if (!disabled && !active) { e.currentTarget.style.background="#f1f5f9"; e.currentTarget.style.color="#0f172a"; } }}
      onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#64748b"; } }}>
      {children}
    </button>
  );
}

function PillBtn({ onClick, disabled, title, icon, label }: { onClick: () => void; disabled?: boolean; title?: string; icon: React.ReactNode; label: string; }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} title={title}
      onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.background="#f1f5f9"; e.currentTarget.style.color="#0f172a"; e.currentTarget.style.borderColor="rgba(15,23,42,0.12)"; } }}
      onMouseLeave={(e) => { e.currentTarget.style.background="#ffffff"; e.currentTarget.style.color="#475569"; e.currentTarget.style.borderColor="rgba(15,23,42,0.08)"; }}
      style={{ display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,height:36,padding:"0 14px",borderRadius:10,fontSize:12.5,fontWeight:600,letterSpacing:"0.01em",color:"#475569",background:"#ffffff",border:"1px solid rgba(15,23,42,0.08)",cursor:disabled?"wait":"pointer",opacity:disabled?0.7:1,transition:"all 0.15s",boxShadow:"0 1px 2px rgba(15,23,42,0.04)" }}>
      {icon} {label}
    </button>
  );
}

function RailBtn({ id, icon, label, active, onClick }: { id?: string; icon: React.ReactNode; label: string; active: boolean; onClick: () => void; }) {
  return (
    <button id={id} type="button" onClick={onClick} title={label}
      style={{ width:48,height:48,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,borderRadius:14,border:"1px solid transparent",background:active?"#ffffff":"transparent",cursor:"pointer",transition:"all 0.18s ease",color:active?"#0284c7":"#64748b",boxShadow:active?"0 4px 14px rgba(2,132,199,0.18), 0 1px 2px rgba(15,23,42,0.04), inset 0 1px 0 rgba(255,255,255,0.9)":"none" }}
      onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background="rgba(255,255,255,0.55)"; e.currentTarget.style.color="#0f172a"; } }}
      onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#64748b"; } }}>
      {icon}
      <span style={{ fontSize:8,fontWeight:700,color:active?"#0284c7":"#64748b",textTransform:"uppercase",letterSpacing:"0.06em" }}>{label}</span>
    </button>
  );
}
