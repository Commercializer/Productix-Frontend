/* ─────────────────────────────────────────────
 * Search Element - On-page search bar
 *
 * Drag-and-drop block that renders a circular search
 * icon. On the live page, tapping the icon expands a
 * search bar to the right with a smooth animation,
 * walks text nodes under `document.body`, wraps matches
 * in <mark>, and supports next/prev navigation - same
 * behavior as the global PageSearchOverlay, but anchored
 * to the block's position on the canvas.
 *
 * In the editor canvas the bar is purely visual so
 * authors can position and style it. Double-clicking
 * the block (entering edit mode) previews the expanded
 * state so colors/placeholder can be inspected.
 * ──────────────────────────────────────────── */

"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { registerElement, type ElementRenderProps, type PropertyPanelProps } from "./registry";
import { HexColorPopover } from "./hex-color-popover";

/** True when running inside the editor canvas (set by EditRenderer). */
function isInsideEditor(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return !!(window as unknown as Record<string, unknown>).__productixEditor;
  } catch {
    return false;
  }
}

const HIGHLIGHT_CLASS = "px-search-block-hit";
const HIGHLIGHT_ACTIVE_CLASS = "px-search-block-hit-active";

/* ─── Component ─────────────────────────────── */

function SearchElementComponent({ props, isEditing, scaleFactor = 1 }: ElementRenderProps) {
  const placeholder = (props.placeholder as string) || "Search this page…";
  const bgColor = (props.bgColor as string) || "#ffffff";
  const textColor = (props.textColor as string) || "#111827";
  const iconColor = (props.iconColor as string) || "#374151";
  const placeholderColor = (props.placeholderColor as string) || "#9ca3af";
  const borderRadius = (props.borderRadius as number) ?? 999;
  const fontSize = (props.fontSize as number) || 14;
  const expandedWidth = (props.expandedWidth as number) || 280;
  const highlightColor = (props.highlightColor as string) || "#fde68a";
  const activeHighlightColor = (props.activeHighlightColor as string) || "#f59e0b";
  const activeHighlightTextColor = (props.activeHighlightTextColor as string) || "#ffffff";
  const accentColor = (props.accentColor as string) || "#0ea5e9";
  const showCounter = props.showCounter !== false;
  const shadow = props.shadow !== false;
  // "icon" = collapsed circular icon that expands on tap (default).
  // "bar"  = always-expanded search field filling the block width.
  const mode = (props.mode as string) === "bar" ? "bar" : "icon";
  const isBar = mode === "bar";

  const editor = isInsideEditor();
  const inputRef = useRef<HTMLInputElement>(null);

  // Live: collapsed until user taps. Editor: collapsed by default, but
  // showing the expanded state when the author has double-clicked into
  // edit mode lets them style colors/placeholder without leaving the canvas.
  // Bar mode is always open (it never collapses).
  const [openLive, setOpenLive] = useState(false);
  const open = isBar ? true : editor ? isEditing : openLive;

  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState<HTMLElement[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  // Scaled visual sizing.
  const scaledFontSize = Math.max(11, Math.round(fontSize * scaleFactor));
  const scaledIconSize = Math.max(12, Math.round(15 * scaleFactor));
  const scaledNavIconSize = Math.max(9, Math.round(12 * scaleFactor));
  const scaledCounterSize = Math.max(9, Math.round(11 * scaleFactor));
  const scaledPadL = Math.round(12 * scaleFactor);
  const scaledPadR = Math.round(6 * scaleFactor);
  const scaledGap = Math.round(4 * scaleFactor);
  const scaledExpandedWidth = Math.round(expandedWidth * scaleFactor);

  /* ── Highlighting (live page only) ──────────── */

  const clearHighlights = useCallback(() => {
    if (typeof document === "undefined") return;
    const marks = document.querySelectorAll(`mark.${HIGHLIGHT_CLASS}`);
    marks.forEach((m) => {
      const parent = m.parentNode;
      if (!parent) return;
      while (m.firstChild) parent.insertBefore(m.firstChild, m);
      parent.removeChild(m);
    });
    if (marks.length > 0) document.body.normalize();
  }, []);

  const applyHighlights = useCallback(
    (q: string) => {
      clearHighlights();
      if (!q.trim()) {
        setMatches([]);
        setActiveIdx(0);
        return;
      }
      if (typeof document === "undefined") return;
      const root = document.body;
      const needle = q.toLowerCase();
      const collected: HTMLElement[] = [];

      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          if (parent.closest(`.${HIGHLIGHT_CLASS}`)) return NodeFilter.FILTER_REJECT;
          if (parent.closest("[data-px-search-block-ui]")) return NodeFilter.FILTER_REJECT;
          const tag = parent.tagName;
          if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") return NodeFilter.FILTER_REJECT;
          if (!node.nodeValue.toLowerCase().includes(needle)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      });

      const targets: Text[] = [];
      let n = walker.nextNode();
      while (n) {
        targets.push(n as Text);
        n = walker.nextNode();
      }

      targets.forEach((textNode) => {
        const text = textNode.nodeValue ?? "";
        const lower = text.toLowerCase();
        let cursor = 0;
        const frag = document.createDocumentFragment();
        while (cursor < text.length) {
          const idx = lower.indexOf(needle, cursor);
          if (idx === -1) {
            frag.appendChild(document.createTextNode(text.slice(cursor)));
            break;
          }
          if (idx > cursor) frag.appendChild(document.createTextNode(text.slice(cursor, idx)));
          const mark = document.createElement("mark");
          mark.className = HIGHLIGHT_CLASS;
          mark.textContent = text.slice(idx, idx + needle.length);
          frag.appendChild(mark);
          collected.push(mark);
          cursor = idx + needle.length;
        }
        textNode.parentNode?.replaceChild(frag, textNode);
      });

      setMatches(collected);
      setActiveIdx(0);
    },
    [clearHighlights]
  );

  // Debounced re-search when the query changes (live only).
  useEffect(() => {
    if (editor) return;
    if (!open) return;
    const t = setTimeout(() => applyHighlights(query), 80);
    return () => clearTimeout(t);
  }, [query, open, applyHighlights, editor]);

  // Active highlight styling + scroll into view (live only).
  useEffect(() => {
    if (editor) return;
    matches.forEach((m, i) => {
      if (i === activeIdx) m.classList.add(HIGHLIGHT_ACTIVE_CLASS);
      else m.classList.remove(HIGHLIGHT_ACTIVE_CLASS);
    });
    const active = matches[activeIdx];
    if (active) {
      active.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    }
  }, [matches, activeIdx, editor]);

  // Clear everything when the bar closes. In bar mode there is no
  // collapse, so skip the auto-focus-on-open (it would steal focus and
  // scroll the page on load).
  useEffect(() => {
    if (editor || isBar) return;
    if (open) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 200);
      return () => window.clearTimeout(id);
    }
    setQuery("");
    clearHighlights();
    setMatches([]);
    setActiveIdx(0);
  }, [open, clearHighlights, editor, isBar]);

  const goNext = useCallback(() => {
    if (matches.length === 0) return;
    setActiveIdx((i) => (i + 1) % matches.length);
  }, [matches.length]);

  const goPrev = useCallback(() => {
    if (matches.length === 0) return;
    setActiveIdx((i) => (i - 1 + matches.length) % matches.length);
  }, [matches.length]);

  const counterText = useMemo(() => {
    if (!query.trim()) return "";
    if (matches.length === 0) return "0/0";
    return `${activeIdx + 1}/${matches.length}`;
  }, [matches.length, activeIdx, query]);

  /* ── Render ──────────────────────────────── */

  const boxShadow = shadow
    ? "0 2px 10px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.04)"
    : "0 0 0 1px rgba(0,0,0,0.06)";

  // The block transform = collapsed icon's bounding box. When expanded,
  // the bar grows to the right and overflows the block bounds via
  // absolute positioning. overflow:visible on the wrapper lets that work.
  return (
    <div
      data-px-search-block-ui
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "visible",
      }}
    >
      {/* Icon trigger (icon mode only; morphs to X when open) */}
      {!isBar && (
      <button
        type="button"
        aria-label={open ? "Close search" : "Search this page"}
        onPointerDown={(e) => {
          if (editor) return;
          e.preventDefault();
          e.stopPropagation();
          setOpenLive((v) => !v);
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          borderRadius,
          border: "none",
          background: bgColor,
          color: iconColor,
          cursor: editor ? "inherit" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow,
          transition: "transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.2s ease",
          transform: open ? "rotate(90deg) scale(0.9)" : "rotate(0deg) scale(1)",
          opacity: open ? 0 : 1,
          pointerEvents: open ? "none" : "auto",
          padding: 0,
          zIndex: 1,
        }}
      >
        <SearchIcon size={scaledIconSize} strokeWidth={2.2} />
      </button>
      )}

      {/* Expanding search bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          background: bgColor,
          borderRadius,
          boxShadow: open ? boxShadow : "none",
          width: isBar ? "100%" : open ? scaledExpandedWidth : "100%",
          opacity: open ? 1 : 0,
          padding: open ? `0 ${scaledPadR}px 0 ${scaledPadL}px` : 0,
          display: "flex",
          alignItems: "center",
          gap: scaledGap,
          overflow: "hidden",
          transition:
            "width 0.32s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.22s ease, padding 0.32s ease, box-shadow 0.22s ease",
          pointerEvents: open ? "auto" : "none",
          zIndex: 2,
        }}
      >
        <SearchIcon
          size={scaledIconSize}
          color={iconColor}
          strokeWidth={2.2}
          style={{ flexShrink: 0 }}
        />

        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder={placeholder}
          readOnly={editor}
          onChange={(e) => {
            if (editor) return;
            setQuery(e.target.value);
          }}
          onKeyDown={(e) => {
            if (editor) return;
            if (e.key === "Enter") {
              e.preventDefault();
              if (e.shiftKey) goPrev();
              else goNext();
            } else if (e.key === "Escape") {
              setOpenLive(false);
            }
          }}
          onPointerDown={(e) => {
            // In icon edit-preview mode, keep the field stable by swallowing
            // the pointer. In bar mode the field always fills the block, so
            // let the wrapper handle selection/drag (the input is read-only).
            if (editor && !isBar) e.stopPropagation();
          }}
          style={{
            flex: 1,
            minWidth: 0,
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: scaledFontSize,
            color: textColor,
            padding: 0,
            ["--px-search-placeholder-color" as never]: placeholderColor,
          }}
          className="px-search-block-input"
        />

        {showCounter && query.trim() && (
          <span
            style={{
              fontSize: scaledCounterSize,
              color: matches.length === 0 ? "#ef4444" : iconColor,
              whiteSpace: "nowrap",
              userSelect: "none",
              flexShrink: 0,
            }}
          >
            {counterText}
          </span>
        )}

        <button
          type="button"
          aria-label="Previous match"
          onPointerDown={(e) => {
            if (editor) return;
            e.preventDefault();
            e.stopPropagation();
            goPrev();
          }}
          disabled={matches.length === 0}
          style={navBtnStyle(matches.length === 0, iconColor, scaleFactor)}
        >
          <svg width={scaledNavIconSize} height={scaledNavIconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Next match"
          onPointerDown={(e) => {
            if (editor) return;
            e.preventDefault();
            e.stopPropagation();
            goNext();
          }}
          disabled={matches.length === 0}
          style={navBtnStyle(matches.length === 0, iconColor, scaleFactor)}
        >
          <svg width={scaledNavIconSize} height={scaledNavIconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {!isBar && (
          <button
            type="button"
            aria-label="Close search"
            onPointerDown={(e) => {
              if (editor) return;
              e.preventDefault();
              e.stopPropagation();
              setOpenLive(false);
            }}
            style={navBtnStyle(false, iconColor, scaleFactor)}
          >
            <svg width={scaledNavIconSize} height={scaledNavIconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Highlight styles + placeholder color (scoped via class). */}
      <style>{`
        .px-search-block-input::placeholder { color: var(--px-search-placeholder-color); opacity: 1; }
        mark.${HIGHLIGHT_CLASS} {
          background: ${highlightColor};
          color: inherit;
          padding: 0 1px;
          border-radius: 2px;
          box-shadow: 0 0 0 1px ${accentColor}33;
        }
        mark.${HIGHLIGHT_CLASS}.${HIGHLIGHT_ACTIVE_CLASS} {
          background: ${activeHighlightColor};
          color: ${activeHighlightTextColor};
          box-shadow: 0 0 0 2px ${accentColor}66;
        }
      `}</style>
    </div>
  );
}

function navBtnStyle(disabled: boolean, color: string, scale: number): React.CSSProperties {
  const size = Math.max(16, Math.round(22 * scale));
  return {
    width: size,
    height: size,
    border: "none",
    background: "transparent",
    color: disabled ? "#d1d5db" : color,
    cursor: disabled ? "default" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    flexShrink: 0,
    padding: 0,
  };
}

/* ─── Property Panel ────────────────────────── */

function SearchPropertyPanel({ props, onChange }: PropertyPanelProps) {
  const labelStyle = "text-xs font-medium text-gray-500 uppercase tracking-wide";
  const inputStyle = "mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

  const mode = (props.mode as string) === "bar" ? "bar" : "icon";

  return (
    <div className="space-y-3">
      <label className="block">
        <span className={labelStyle}>Mode</span>
        <div className="mt-1 grid grid-cols-2 gap-1 rounded-lg bg-gray-100 p-1">
          {([
            { id: "icon", label: "Icon" },
            { id: "bar", label: "Search bar" },
          ] as const).map((m) => {
            const active = mode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onChange({ mode: m.id })}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  active ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      </label>

      <p className="rounded-md bg-blue-50 px-3 py-2 text-xs leading-relaxed text-blue-700">
        {mode === "bar"
          ? "Always-expanded search field. Type on the live page to highlight matches; resize the block to set its width."
          : "Collapsed icon that expands on tap. Double-click the block here to preview the open state."}
      </p>

      <label className="block">
        <span className={labelStyle}>Placeholder</span>
        <input
          type="text"
          className={inputStyle}
          value={(props.placeholder as string) ?? ""}
          onChange={(e) => onChange({ placeholder: e.target.value })}
        />
      </label>

      {mode === "icon" && (
        <label className="block">
          <span className={labelStyle}>Expanded Width (px)</span>
          <input
            type="number"
            className={inputStyle}
            value={(props.expandedWidth as number) || 280}
            onChange={(e) => onChange({ expandedWidth: Number(e.target.value) })}
            min={120}
            max={600}
          />
        </label>
      )}

      <label className="block">
        <span className={labelStyle}>Background</span>
        <div className="mt-1 flex gap-2 items-center">
          <HexColorPopover
            value={(props.bgColor as string) || ""}
            onChange={(hex) => onChange({ bgColor: hex })}
            fallback="#ffffff"
          />
          <input
            type="text"
            className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
            value={(props.bgColor as string) || "#ffffff"}
            onChange={(e) => onChange({ bgColor: e.target.value })}
          />
        </div>
      </label>

      <label className="block">
        <span className={labelStyle}>Text Color</span>
        <div className="mt-1 flex gap-2 items-center">
          <HexColorPopover
            value={(props.textColor as string) || ""}
            onChange={(hex) => onChange({ textColor: hex })}
            fallback="#111827"
          />
          <input
            type="text"
            className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
            value={(props.textColor as string) || "#111827"}
            onChange={(e) => onChange({ textColor: e.target.value })}
          />
        </div>
      </label>

      <label className="block">
        <span className={labelStyle}>Icon Color</span>
        <div className="mt-1 flex gap-2 items-center">
          <HexColorPopover
            value={(props.iconColor as string) || ""}
            onChange={(hex) => onChange({ iconColor: hex })}
            fallback="#374151"
          />
          <input
            type="text"
            className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
            value={(props.iconColor as string) || "#374151"}
            onChange={(e) => onChange({ iconColor: e.target.value })}
          />
        </div>
      </label>

      <label className="block">
        <span className={labelStyle}>Placeholder Color</span>
        <div className="mt-1 flex gap-2 items-center">
          <HexColorPopover
            value={(props.placeholderColor as string) || ""}
            onChange={(hex) => onChange({ placeholderColor: hex })}
            fallback="#9ca3af"
          />
          <input
            type="text"
            className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
            value={(props.placeholderColor as string) || "#9ca3af"}
            onChange={(e) => onChange({ placeholderColor: e.target.value })}
          />
        </div>
      </label>

      <label className="block">
        <span className={labelStyle}>Highlight Color</span>
        <div className="mt-1 flex gap-2 items-center">
          <HexColorPopover
            value={(props.highlightColor as string) || ""}
            onChange={(hex) => onChange({ highlightColor: hex })}
            fallback="#fde68a"
          />
          <input
            type="text"
            className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
            value={(props.highlightColor as string) || "#fde68a"}
            onChange={(e) => onChange({ highlightColor: e.target.value })}
          />
        </div>
      </label>

      <label className="block">
        <span className={labelStyle}>Active Highlight</span>
        <div className="mt-1 flex gap-2 items-center">
          <HexColorPopover
            value={(props.activeHighlightColor as string) || ""}
            onChange={(hex) => onChange({ activeHighlightColor: hex })}
            fallback="#f59e0b"
          />
          <input
            type="text"
            className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
            value={(props.activeHighlightColor as string) || "#f59e0b"}
            onChange={(e) => onChange({ activeHighlightColor: e.target.value })}
          />
        </div>
      </label>

      <label className="block">
        <span className={labelStyle}>Font Size</span>
        <input
          type="number"
          className={inputStyle}
          value={(props.fontSize as number) || 14}
          onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
          min={10}
          max={32}
        />
      </label>

      <label className="block">
        <span className={labelStyle}>Border Radius</span>
        <input
          type="number"
          className={inputStyle}
          value={(props.borderRadius as number) ?? 999}
          onChange={(e) => onChange({ borderRadius: Number(e.target.value) })}
          min={0}
          max={999}
        />
      </label>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={props.showCounter !== false}
          onChange={(e) => onChange({ showCounter: e.target.checked })}
        />
        Show match counter (1/3)
      </label>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={props.shadow !== false}
          onChange={(e) => onChange({ shadow: e.target.checked })}
        />
        Drop shadow
      </label>
    </div>
  );
}

/* ─── Registration ──────────────────────────── */

registerElement({
  type: "search",
  label: "Search",
  icon: <SearchIcon size={16} />,
  category: "interactive",
  defaultProps: {
    mode: "icon",
    placeholder: "Search this page…",
    bgColor: "#ffffff",
    textColor: "#111827",
    iconColor: "#374151",
    placeholderColor: "#9ca3af",
    highlightColor: "#fde68a",
    activeHighlightColor: "#f59e0b",
    activeHighlightTextColor: "#ffffff",
    accentColor: "#0ea5e9",
    fontSize: 14,
    borderRadius: 999,
    expandedWidth: 280,
    showCounter: true,
    shadow: true,
  },
  defaultTransform: { width: 40, height: 40 },
  component: SearchElementComponent,
  propertyPanel: SearchPropertyPanel,
});
