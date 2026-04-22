/* ─────────────────────────────────────────────
 * Theme Panel — Select predefined layouts
 *
 * Users pick a theme to populate the artboard
 * with a complete, editable page layout.
 * ──────────────────────────────────────────── */

"use client";

import React, { useState, useCallback } from "react";
import { Palette, Check, AlertTriangle } from "lucide-react";
import { THEME_TEMPLATES, type ThemeTemplate } from "../templates/theme-templates";
import { useCanvasStore } from "../engine/canvas-store";
import { generateElementId } from "../utils/id";

/* ─── Mini Preview Renderer ─────────────────── */

function ThemePreview({ theme }: { theme: ThemeTemplate }) {
  const bgColor = theme.artboard.backgroundColor;
  const isDark = isDarkColor(bgColor);

  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "428 / 926",
        backgroundColor: bgColor,
        borderRadius: 8,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {theme.elements.map((el, i) => {
        const sx = 100 / 428; // scale factor (percentage)
        const left = `${el.transform.x * sx}%`;
        const top = `${(el.transform.y / 926) * 100}%`;
        const w = `${el.transform.width * sx}%`;
        const h = `${(el.transform.height / 926) * 100}%`;

        let bg = "transparent";
        let borderRadius = 0;

        if (el.type === "image") {
          bg = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
          borderRadius = ((el.props.borderRadius as number) || 0) > 10 ? 4 : 0;
        } else if (el.type === "button") {
          bg = (el.props.bgColor as string) || "#3b82f6";
          if ((el.props.variant as string) === "outline") {
            bg = "transparent";
          }
          borderRadius = 3;
        } else if (el.type === "heading" || el.type === "text") {
          bg = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)";
          borderRadius = 2;
        } else if (el.type === "badge") {
          bg = (el.props.bgColor as string) || "#dbeafe";
          borderRadius = 2;
        } else if (el.type === "divider") {
          bg = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)";
        } else if (el.type === "social-group") {
          bg = "transparent";
        }

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left,
              top,
              width: w,
              height: h,
              backgroundColor: bg,
              borderRadius,
              ...(el.type === "button" && (el.props.variant as string) === "outline"
                ? { border: `1px solid ${(el.props.bgColor as string) || "#3b82f6"}` }
                : {}),
            }}
          >
            {el.type === "social-group" && (
              <div style={{ display: "flex", gap: 2, justifyContent: "center", alignItems: "center", height: "100%" }}>
                {((el.props.platforms as string[]) || []).map((_, j) => (
                  <div
                    key={j}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 2,
                      backgroundColor: (el.props.iconBg as string) || "#1a1a2e",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Color detection helper ─────────────────── */

function isDarkColor(hex: string): boolean {
  const c = hex.replace("#", "");
  if (c.length < 6) return false;
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

/* ─── Component ──────────────────────────────── */

export function ThemePanel() {
  const [activeTheme, setActiveTheme] = useState<string | null>(null);
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState<string | null>(null);

  const document = useCanvasStore((s) => s.document);
  const activeArtboardId = useCanvasStore((s) => s.activeArtboardId);

  const applyTheme = useCallback(
    (theme: ThemeTemplate) => {
      const store = useCanvasStore.getState();
      const ab =
        store.document.artboards.find((a) => a.id === store.activeArtboardId) ||
        store.document.artboards[0];
      if (!ab) return;

      // Push history before bulk changes
      store.pushHistory();

      // Clear all existing elements on this artboard
      const existingIds = [...ab.elements];
      existingIds.forEach((elId) => {
        // We remove manually to avoid multiple pushHistory calls
        useCanvasStore.setState((s) => {
          delete s.document.elements[elId];
          const targetAb = s.document.artboards.find((a) => a.id === ab.id);
          if (targetAb) {
            targetAb.elements = targetAb.elements.filter((id) => id !== elId);
          }
          s.selectedIds = s.selectedIds.filter((id) => id !== elId);
          if (s.editingElementId === elId) s.editingElementId = null;
        });
      });

      // Apply artboard settings
      store.updateArtboard(ab.id, {
        backgroundColor: theme.artboard.backgroundColor,
      });

      // Add all template elements
      theme.elements.forEach((el, _idx) => {
        const id = generateElementId();
        useCanvasStore.setState((s) => {
          const maxZ = Math.max(0, ...Object.values(s.document.elements).map((e) => e.zIndex));
          s.document.elements[id] = {
            id,
            type: el.type,
            transform: {
              x: el.transform.x,
              y: el.transform.y,
              width: el.transform.width,
              height: el.transform.height,
              rotation: el.transform.rotation ?? 0,
            },
            zIndex: maxZ + 1,
            locked: false,
            visible: true,
            opacity: 1,
            props: { ...el.props },
          };
          const targetAb = s.document.artboards.find((a) => a.id === ab.id);
          targetAb?.elements.push(id);
        });
      });

      setActiveTheme(theme.id);
      setShowConfirm(null);

      // Deselect all
      store.deselectAll();
    },
    []
  );

  const handleThemeClick = useCallback(
    (theme: ThemeTemplate) => {
      const hasElements = Object.keys(document.elements).length > 0;
      if (hasElements) {
        setShowConfirm(theme.id);
      } else {
        applyTheme(theme);
      }
    },
    [document.elements, applyTheme]
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "linear-gradient(180deg, #fafbff 0%, #f5f5fa 100%)",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          padding: "18px 20px 14px",
          borderBottom: "1px solid rgba(0,0,0,0.04)",
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              boxShadow: "0 2px 8px rgba(139,92,246,0.3)",
            }}
          >
            <Palette size={14} />
          </div>
          <div>
            <h2
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#1a1a2e",
                margin: 0,
                letterSpacing: "-0.01em",
              }}
            >
              Themes
            </h2>
            <p
              style={{
                fontSize: 10,
                color: "#a0a3b1",
                marginTop: 1,
                margin: 0,
                fontWeight: 500,
              }}
            >
              Pick a starting layout
            </p>
          </div>
        </div>
      </div>

      {/* ── Confirmation Banner ── */}
      {showConfirm && (
        <div
          style={{
            margin: "10px 12px 0",
            padding: "12px 14px",
            borderRadius: 12,
            background: "#fef3c7",
            border: "1px solid #fde68a",
            animation: "slideDown 0.2s ease",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <AlertTriangle size={14} style={{ color: "#b45309" }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: "#92400e" }}>
              Replace current layout?
            </span>
          </div>
          <p style={{ fontSize: 10, color: "#a16207", margin: "0 0 10px", lineHeight: 1.5 }}>
            This will remove all existing blocks and apply the selected theme. You can undo this action.
          </p>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              type="button"
              onClick={() => {
                const theme = THEME_TEMPLATES.find((t) => t.id === showConfirm);
                if (theme) applyTheme(theme);
              }}
              style={{
                flex: 1,
                padding: "7px 12px",
                borderRadius: 8,
                border: "none",
                background: "#b45309",
                color: "#fff",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => setShowConfirm(null)}
              style={{
                flex: 1,
                padding: "7px 12px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                background: "#fff",
                color: "#6b7280",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Theme Grid ── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "12px 12px 24px",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(0,0,0,0.08) transparent",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
          }}
        >
          {THEME_TEMPLATES.map((theme) => {
            const isActive = activeTheme === theme.id;
            const isHovered = hoveredTheme === theme.id;

            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => handleThemeClick(theme)}
                onMouseEnter={() => setHoveredTheme(theme.id)}
                onMouseLeave={() => setHoveredTheme(null)}
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  padding: 8,
                  borderRadius: 14,
                  border: isActive
                    ? "2px solid #8b5cf6"
                    : isHovered
                      ? "2px solid rgba(139,92,246,0.3)"
                      : "2px solid rgba(0,0,0,0.04)",
                  background: isHovered ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.7)",
                  cursor: "pointer",
                  transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
                  textAlign: "left",
                  overflow: "hidden",
                  boxShadow: isActive
                    ? "0 4px 20px rgba(139,92,246,0.15)"
                    : isHovered
                      ? "0 4px 16px rgba(0,0,0,0.06)"
                      : "0 1px 3px rgba(0,0,0,0.02)",
                  transform: isHovered ? "translateY(-2px)" : "translateY(0)",
                }}
              >
                {/* Active check badge */}
                {isActive && (
                  <div
                    style={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      width: 18,
                      height: 18,
                      borderRadius: 999,
                      background: "#8b5cf6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 2,
                      boxShadow: "0 2px 6px rgba(139,92,246,0.4)",
                    }}
                  >
                    <Check size={10} color="#fff" strokeWidth={3} />
                  </div>
                )}

                {/* Preview */}
                <ThemePreview theme={theme} />

                {/* Label */}
                <div style={{ marginTop: 8, padding: "0 2px 2px" }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 650,
                      color: isActive ? "#8b5cf6" : "#1a1a2e",
                      letterSpacing: "-0.01em",
                      display: "block",
                    }}
                  >
                    {theme.name}
                  </span>
                  <span
                    style={{
                      fontSize: 9,
                      color: "#a0a3b1",
                      fontWeight: 500,
                      display: "block",
                      marginTop: 1,
                    }}
                  >
                    {theme.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Inline Styles ── */}
      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-8px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
