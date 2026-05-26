"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface PageSearchOverlayProps {
  /** The element to search inside. If null, searches the whole document body. */
  targetRef: React.RefObject<HTMLElement | null>;
}

const HIGHLIGHT_CLASS = "px-page-search-hit";
const HIGHLIGHT_ACTIVE_CLASS = "px-page-search-hit-active";

export function PageSearchOverlay({ targetRef }: PageSearchOverlayProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState<HTMLElement[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Remove all highlight wrappers, restore original text.
  const clearHighlights = useCallback(() => {
    const root = targetRef.current ?? document.body;
    const marks = root.querySelectorAll(`mark.${HIGHLIGHT_CLASS}`);
    marks.forEach((m) => {
      const parent = m.parentNode;
      if (!parent) return;
      while (m.firstChild) parent.insertBefore(m.firstChild, m);
      parent.removeChild(m);
    });
    // Merge adjacent text nodes that we just split.
    if (marks.length > 0) root.normalize();
  }, [targetRef]);

  // Walk text nodes and wrap matches with <mark>.
  const applyHighlights = useCallback(
    (q: string) => {
      clearHighlights();
      if (!q.trim()) {
        setMatches([]);
        setActiveIdx(0);
        return;
      }
      const root = targetRef.current ?? document.body;
      const needle = q.toLowerCase();
      const collected: HTMLElement[] = [];

      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          // Skip our own UI and any obviously non-visible nodes.
          if (parent.closest(`.${HIGHLIGHT_CLASS}`)) return NodeFilter.FILTER_REJECT;
          if (parent.closest("[data-px-page-search-ui]")) return NodeFilter.FILTER_REJECT;
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
      setActiveIdx(collected.length > 0 ? 0 : 0);
    },
    [clearHighlights, targetRef]
  );

  // Re-run search whenever query changes (debounced lightly).
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => applyHighlights(query), 80);
    return () => clearTimeout(t);
  }, [query, open, applyHighlights]);

  // Update active highlight styling + scroll into view.
  useEffect(() => {
    matches.forEach((m, i) => {
      if (i === activeIdx) {
        m.classList.add(HIGHLIGHT_ACTIVE_CLASS);
      } else {
        m.classList.remove(HIGHLIGHT_ACTIVE_CLASS);
      }
    });
    const active = matches[activeIdx];
    if (active) {
      active.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    }
  }, [matches, activeIdx]);

  // Focus input on open, clear everything on close.
  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 200);
      return () => window.clearTimeout(id);
    }
    setQuery("");
    clearHighlights();
    setMatches([]);
    setActiveIdx(0);
  }, [open, clearHighlights]);

  // Keyboard shortcuts: Cmd/Ctrl+F opens, Escape closes, Enter = next, Shift+Enter = prev.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Click outside to close (when open and input is empty + no matches).
  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (!query) setOpen(false);
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open, query]);

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

  return (
    <>
      <div
        ref={containerRef}
        data-px-page-search-ui
        style={{
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Trigger icon button (always rendered; visually it morphs into the bar) */}
        <button
          type="button"
          aria-label={open ? "Close search" : "Search this page"}
          onClick={() => setOpen((v) => !v)}
          style={{
            width: 32,
            height: 32,
            borderRadius: 999,
            border: "none",
            background: "#fff",
            color: "#374151",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 10px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.04)",
            transition: "transform 0.2s ease, background 0.2s ease",
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            flexShrink: 0,
          }}
        >
          {open ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          )}
        </button>

        {/* Expanding search bar */}
        <div
          style={{
            marginLeft: open ? 6 : 0,
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: "#fff",
            borderRadius: 999,
            boxShadow: open
              ? "0 2px 10px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.04)"
              : "none",
            overflow: "hidden",
            width: open ? "min(280px, calc(100vw - 80px))" : 0,
            opacity: open ? 1 : 0,
            padding: open ? "0 6px 0 12px" : 0,
            height: 32,
            transition:
              "width 0.28s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.2s ease, margin-left 0.28s ease, padding 0.28s ease",
            pointerEvents: open ? "auto" : "none",
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search this page…"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (e.shiftKey) goPrev();
                else goNext();
              } else if (e.key === "Escape") {
                setOpen(false);
              }
            }}
            style={{
              flex: 1,
              minWidth: 0,
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: 16,
              fontFamily: "var(--font-sans)",
              color: "#111827",
              padding: 0,
            }}
          />

          {query.trim() && (
            <span
              style={{
                fontSize: 11,
                color: matches.length === 0 ? "#ef4444" : "#6b7280",
                fontFamily: "var(--font-sans)",
                whiteSpace: "nowrap",
                userSelect: "none",
              }}
            >
              {counterText}
            </span>
          )}

          <button
            type="button"
            aria-label="Previous match"
            onPointerDown={(e) => {
              e.preventDefault();
              goPrev();
            }}
            disabled={matches.length === 0}
            style={iconBtnStyle(matches.length === 0)}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next match"
            onPointerDown={(e) => {
              e.preventDefault();
              goNext();
            }}
            disabled={matches.length === 0}
            style={iconBtnStyle(matches.length === 0)}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      </div>

      {/* Highlight styles + entry animation */}
      <style>{`
        mark.${HIGHLIGHT_CLASS} {
          background: #fde68a;
          color: inherit;
          padding: 0 1px;
          border-radius: 2px;
          box-shadow: 0 0 0 1px rgba(202, 138, 4, 0.25);
        }
        mark.${HIGHLIGHT_CLASS}.${HIGHLIGHT_ACTIVE_CLASS} {
          background: #f59e0b;
          color: #fff;
          box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.45);
        }
      `}</style>
    </>
  );
}

function iconBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    width: 22,
    height: 22,
    border: "none",
    background: "transparent",
    color: disabled ? "#d1d5db" : "#6b7280",
    cursor: disabled ? "default" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    transition: "background 0.15s ease, color 0.15s ease",
    flexShrink: 0,
  };
}
