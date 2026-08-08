/* ─────────────────────────────────────────────
 * Story Blocks Panel - Premium glassmorphic design
 * ──────────────────────────────────────────── */

"use client";

import React, { useCallback, useState } from "react";
import {
  Puzzle,
  PenLine,
  ImageIcon,
  Zap,
  LayoutGrid,
  MessageCircle,
  Rocket,
  Type,
  Heading,
  MousePointerClick,
  LayoutDashboard,
  Sparkles,
  BadgeCheck,
  Share2,
  BarChart3,
  Megaphone,
  Minus,
  Box,
  Rows3,
  Columns3,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Github,
  Music2,
  AtSign,
  Globe,
  Mail,
  Phone,
  Gamepad2,
  Ticket,
  Video,
  MessageSquareHeart,
  Search,
  Shapes,
  GalleryHorizontalEnd,
  ChevronLeft,
  FileText,
  ClipboardList,
  ShieldCheck,
} from "lucide-react";
import { getAllElements, type ElementDefinition } from "../elements/registry";
import { SHAPES, getShapeDefaultProps, ShapeRender } from "../elements/shapes-catalog";
import { useCanvasStore } from "../engine/canvas-store";
import { useTranslation } from "../i18n";
import type { TranslationStrings } from "../i18n";

const CATEGORY_KEYS: Record<string, keyof TranslationStrings> = {
  content: "storyBlocks.category.productStory",
  media: "storyBlocks.category.visuals",
  interactive: "storyBlocks.category.engagement",
  layout: "storyBlocks.category.structure",
  social: "storyBlocks.category.socialProof",
  promotional: "storyBlocks.category.conversion",
};

/* ─── Category Visual Config ─────────────────── */

interface CategoryMeta {
  icon: React.ReactNode;
  gradient: string;
  glow: string;
  iconBg: string;
}

/** Display labels for categories that don't have an i18n translation key. */
const CATEGORY_LABEL_FALLBACK: Record<string, string> = {
  feedback: "Feedback",
  shape: "Shapes",
};

const CATEGORY_META: Record<string, CategoryMeta> = {
  feedback: {
    icon: <MessageSquareHeart size={15} />,
    gradient: "linear-gradient(135deg, #ec4899 0%, #f9a8d4 100%)",
    glow: "rgba(236, 72, 153, 0.15)",
    iconBg: "rgba(236, 72, 153, 0.08)",
  },
  content: {
    icon: <PenLine size={15} />,
    gradient: "linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)",
    glow: "rgba(14, 165, 233, 0.15)",
    iconBg: "rgba(14, 165, 233, 0.08)",
  },
  media: {
    icon: <ImageIcon size={15} />,
    gradient: "linear-gradient(135deg, #f472b6 0%, #f9a8d4 100%)",
    glow: "rgba(244, 114, 182, 0.15)",
    iconBg: "rgba(244, 114, 182, 0.08)",
  },
  interactive: {
    icon: <Zap size={15} />,
    gradient: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
    glow: "rgba(245, 158, 11, 0.15)",
    iconBg: "rgba(245, 158, 11, 0.08)",
  },
  layout: {
    icon: <LayoutGrid size={15} />,
    gradient: "linear-gradient(135deg, #06b6d4 0%, #67e8f9 100%)",
    glow: "rgba(6, 182, 212, 0.15)",
    iconBg: "rgba(6, 182, 212, 0.08)",
  },
  social: {
    icon: <MessageCircle size={15} />,
    gradient: "linear-gradient(135deg, #10b981 0%, #6ee7b7 100%)",
    glow: "rgba(16, 185, 129, 0.15)",
    iconBg: "rgba(16, 185, 129, 0.08)",
  },
  promotional: {
    icon: <Rocket size={15} />,
    gradient: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
    glow: "rgba(239, 68, 68, 0.15)",
    iconBg: "rgba(239, 68, 68, 0.08)",
  },
  shape: {
    icon: <Shapes size={15} />,
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #c4b5fd 100%)",
    glow: "rgba(139, 92, 246, 0.15)",
    iconBg: "rgba(139, 92, 246, 0.08)",
  },
};

const CATEGORY_ORDER = ["feedback", "content", "media", "interactive", "shape", "layout", "promotional", "social"];

/* ─── Block visual icons (Lucide) ────────────── */

const BLOCK_CONFIG: Record<string, { label: string; icon: React.ReactNode }> = {
  text:          { label: "Product Text",    icon: <Type size={16} />              },
  heading:       { label: "Product Title",   icon: <Heading size={16} />           },
  image:         { label: "Product Image",   icon: <ImageIcon size={16} />         },
  button:        { label: "CTA Button",      icon: <MousePointerClick size={16} />},
  card:          { label: "Feature Card",    icon: <LayoutDashboard size={16} />   },
  icon:          { label: "Icon",            icon: <Sparkles size={16} />          },
  badge:         { label: "Badge",           icon: <BadgeCheck size={16} />        },
  "social-group":{ label: "Social Links",    icon: <Share2 size={16} />            },
  "social-facebook":  { label: "Facebook",   icon: <Facebook size={16} />          },
  "social-instagram": { label: "Instagram",  icon: <Instagram size={16} />         },
  "social-twitter":   { label: "X / Twitter",icon: <Twitter size={16} />           },
  "social-linkedin":  { label: "LinkedIn",   icon: <Linkedin size={16} />          },
  "social-youtube":   { label: "YouTube",    icon: <Youtube size={16} />           },
  "social-tiktok":    { label: "TikTok",     icon: <Music2 size={16} />            },
  "social-github":    { label: "GitHub",     icon: <Github size={16} />            },
  "social-whatsapp":  { label: "WhatsApp",   icon: <MessageCircle size={16} />     },
  "social-threads":   { label: "Threads",    icon: <AtSign size={16} />            },
  "social-website":   { label: "Website",    icon: <Globe size={16} />             },
  "social-email":     { label: "Email",      icon: <Mail size={16} />              },
  "social-phone":     { label: "Phone",      icon: <Phone size={16} />             },
  "whatsapp-button":  { label: "WhatsApp Chat", icon: <MessageCircle size={16} />   },
  "stat-card":   { label: "Key Stat",        icon: <BarChart3 size={16} />         },
  "promo-card":  { label: "Highlight Card",  icon: <Megaphone size={16} />         },
  divider:       { label: "Divider",         icon: <Minus size={16} />             },
  container:     { label: "Section Block",   icon: <Box size={16} />               },
  row:           { label: "Content Row",     icon: <Rows3 size={16} />             },
  column:        { label: "Column",          icon: <Columns3 size={16} />          },
  video:         { label: "Video",           icon: <Video size={16} />            },
  carousel:      { label: "Carousel",         icon: <GalleryHorizontalEnd size={16} /> },
  "pdf-viewer":  { label: "PDF Viewer",       icon: <FileText size={16} />          },
  audio:         { label: "Audio",           icon: <Music2 size={16} />            },
  feedback:      { label: "Feedback Button", icon: <MessageSquareHeart size={16} /> },
  feedbackForm:  { label: "Feedback Form",   icon: <ClipboardList size={16} />     },
  search:        { label: "Page Search",     icon: <Search size={16} />            },
  shape:         { label: "Shape",            icon: <Shapes size={16} />            },
  "gtin-badge":  { label: "GTIN Verification", icon: <ShieldCheck size={16} />      },
};

/* ─── Component ──────────────────────────────── */

export function ElementPanel() {
  const addElement = useCanvasStore((s) => s.addElement);
  const activeArtboardId = useCanvasStore((s) => s.activeArtboardId);
  const document = useCanvasStore((s) => s.document);
  const { t } = useTranslation();

  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);
  const [clickedBlock, setClickedBlock] = useState<string | null>(null);
  const [showShapePicker, setShowShapePicker] = useState(false);
  const [showSearchPicker, setShowSearchPicker] = useState(false);

  const addElementCentered = useCallback((
    type: string,
    props: Record<string, unknown>,
    defaultTransform: { width?: number; height?: number },
  ) => {
    const ab = document.artboards.find((a) => a.id === activeArtboardId) || document.artboards[0];
    const abWidth = ab?.width ?? 428;
    const margin = 16;
    const maxW = abWidth - margin * 2;
    const clampedW = Math.min(defaultTransform.width || 200, maxW);
    const centerX = ab ? (ab.width - clampedW) / 2 : 100;
    const centerY = ab ? (ab.height - (defaultTransform.height || 80)) / 2 : 100;
    addElement(type, props, { ...defaultTransform, width: clampedW, x: centerX, y: centerY }, activeArtboardId ?? undefined);
  }, [addElement, activeArtboardId, document.artboards]);

  const handleAdd = useCallback((def: ElementDefinition) => {
    // The "Shape" block opens a picker rather than adding directly.
    if (def.type === "shape") {
      setShowShapePicker(true);
      return;
    }
    // The "Page Search" block opens a mode picker (icon vs. search bar).
    if (def.type === "search") {
      setShowSearchPicker(true);
      return;
    }
    addElementCentered(def.type, { ...def.defaultProps }, def.defaultTransform);

    // Click ripple feedback
    setClickedBlock(def.type);
    setTimeout(() => setClickedBlock(null), 400);
  }, [addElementCentered]);

  const addShapeVariant = useCallback((shapeId: string, defaultTransform: { width?: number; height?: number }) => {
    addElementCentered("shape", { ...getShapeDefaultProps(shapeId) }, defaultTransform ?? { width: 160, height: 160 });
    setShowShapePicker(false);
  }, [addElementCentered]);

  const addSearchVariant = useCallback((mode: "icon" | "bar") => {
    const def = getAllElements().find((el) => el.type === "search");
    const baseProps = { ...(def?.defaultProps ?? {}), mode };
    const transform = mode === "bar" ? { width: 320, height: 44 } : { width: 40, height: 40 };
    addElementCentered("search", baseProps, transform);
    setShowSearchPicker(false);
  }, [addElementCentered]);

  const allElements = getAllElements();
  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: CATEGORY_KEYS[cat] ? t(CATEGORY_KEYS[cat]!) : (CATEGORY_LABEL_FALLBACK[cat] ?? cat),
    meta: CATEGORY_META[cat] || CATEGORY_META.content!,
    items: allElements.filter((el) => el.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <div style={{
      position: "relative",
      display: "flex", flexDirection: "column", height: "100%",
      background: "linear-gradient(180deg, #fafbff 0%, #f5f5fa 100%)",
    }}>
      {/* ── Shape picker overlay (Canva-style sub popup) ── */}
      {showShapePicker && (
        <ShapePicker onPick={addShapeVariant} onClose={() => setShowShapePicker(false)} />
      )}

      {/* ── Search mode picker overlay ── */}
      {showSearchPicker && (
        <SearchPicker onPick={addSearchVariant} onClose={() => setShowSearchPicker(false)} />
      )}

      {/* ── Header ── */}
      <div style={{
        padding: "18px 20px 14px",
        borderBottom: "1px solid rgba(0,0,0,0.04)",
        background: "rgba(255,255,255,0.8)",
        backdropFilter: "blur(8px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff",
            boxShadow: "0 2px 8px rgba(14,165,233,0.3)",
          }}><Puzzle size={14} /></div>
          <div>
            <h2 style={{
              fontSize: 13, fontWeight: 700, color: "#1a1a2e",
              margin: 0, letterSpacing: "-0.01em",
            }}>{t("storyBlocks.title")}</h2>
            <p style={{
              fontSize: 10, color: "#a0a3b1", marginTop: 1, margin: 0,
              fontWeight: 500,
            }}>Tap to add blocks</p>
          </div>
        </div>
      </div>

      {/* ── Scrollable Categories ── */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "10px 12px 24px",
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(0,0,0,0.08) transparent",
      }}>
        {grouped.map(({ category, label, meta, items }) => {
          return (
            <div key={category} style={{ marginBottom: 14 }}>
              {/* Category Header (static, non-collapsible) */}
              <div
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "8px 12px 6px",
                }}
              >
                {/* Category icon chip */}
                <div style={{
                  width: 26, height: 26, borderRadius: 8,
                  background: meta.gradient,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff",
                  boxShadow: `0 2px 8px ${meta.glow}`,
                }}>
                  {meta.icon}
                </div>

                <div style={{ flex: 1, textAlign: "left" }}>
                  <span style={{
                    fontSize: 11.5, fontWeight: 650, letterSpacing: "-0.01em",
                    color: "#1a1a2e",
                  }}>{label}</span>
                  <span style={{
                    display: "block", fontSize: 9.5, color: "#b0b3c0",
                    fontWeight: 500, marginTop: 1,
                  }}>{items.length} block{items.length !== 1 ? "s" : ""}</span>
                </div>
              </div>

              {/* Block grid - 2 columns */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 6,
                padding: "4px 4px 0",
              }}>
                {items.map((def) => {
                  const config = BLOCK_CONFIG[def.type];
                  const isHovered = hoveredBlock === def.type;
                  const isClicked = clickedBlock === def.type;

                  return (
                    <button
                      key={def.type}
                      type="button"
                      onClick={() => handleAdd(def)}
                      onMouseEnter={() => setHoveredBlock(def.type)}
                      onMouseLeave={() => setHoveredBlock(null)}
                      style={{
                        position: "relative",
                        display: "flex", flexDirection: "column",
                        alignItems: "center", gap: 7,
                        padding: "14px 8px 11px",
                        borderRadius: 12,
                        border: `1px solid ${isHovered ? "rgba(14,165,233,0.2)" : "rgba(0,0,0,0.04)"}`,
                        background: isHovered
                          ? "rgba(255,255,255,1)"
                          : "rgba(255,255,255,0.6)",
                        cursor: "pointer",
                        transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
                        textAlign: "center",
                        overflow: "hidden",
                        boxShadow: isHovered
                          ? "0 4px 16px rgba(14,165,233,0.1), 0 1px 3px rgba(0,0,0,0.04)"
                          : "0 1px 2px rgba(0,0,0,0.02)",
                        transform: isClicked
                          ? "scale(0.94)"
                          : isHovered ? "translateY(-2px)" : "translateY(0)",
                      }}
                    >
                      {/* Glow on hover */}
                      {isHovered && (
                        <div style={{
                          position: "absolute", top: -20, left: "50%",
                          transform: "translateX(-50%)",
                          width: 60, height: 60,
                          borderRadius: "50%",
                          background: meta.gradient,
                          opacity: 0.06,
                          filter: "blur(16px)",
                          pointerEvents: "none",
                        }} />
                      )}

                      {/* Icon container */}
                      <div style={{
                        width: 34, height: 34,
                        borderRadius: 10,
                        background: isHovered ? meta.gradient : meta.iconBg,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
                        boxShadow: isHovered ? `0 3px 12px ${meta.glow}` : "none",
                        position: "relative",
                        zIndex: 1,
                        color: isHovered ? "#fff" : "#6b7280",
                      }}>
                        {config?.icon || def.icon}
                      </div>

                      {/* Label */}
                      <span style={{
                        fontSize: 10, fontWeight: 600,
                        color: isHovered ? "#1a1a2e" : "#6b7280",
                        lineHeight: 1.2,
                        transition: "color 0.2s",
                        position: "relative",
                        zIndex: 1,
                        letterSpacing: "-0.01em",
                      }}>
                        {config?.label || def.label}
                      </span>

                      {/* Added feedback */}
                      {isClicked && (
                        <div style={{
                          position: "absolute",
                          inset: 0,
                          background: meta.gradient,
                          opacity: 0.08,
                          borderRadius: 12,
                          pointerEvents: "none",
                          animation: "blockPulse 0.4s ease-out forwards",
                        }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Inline Styles ── */}
      <style>{`
        @keyframes blockPulse {
          0% { opacity: 0.15; transform: scale(0.95); }
          100% { opacity: 0; transform: scale(1.05); }
        }
        /* Custom scrollbar for the panel */
        .story-blocks-scroll::-webkit-scrollbar { width: 4px; }
        .story-blocks-scroll::-webkit-scrollbar-track { background: transparent; }
        .story-blocks-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.08); border-radius: 4px; }
      `}
      </style>
    </div>
  );
}

/* ─── Shape Picker (sub popup) ───────────────── */

function ShapePicker({
  onPick,
  onClose,
}: {
  onPick: (shapeId: string, defaultTransform: { width?: number; height?: number }) => void;
  onClose: () => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 20,
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #ffffff 0%, #faf8ff 100%)",
        animation: "shapePickerIn 0.18s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {/* Header with back button */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "16px 18px 12px",
        borderBottom: "1px solid rgba(0,0,0,0.05)",
      }}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Back to blocks"
          style={{
            width: 28, height: 28, borderRadius: 8,
            border: "1px solid rgba(0,0,0,0.06)",
            background: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "#6b7280",
          }}
        >
          <ChevronLeft size={16} />
        </button>
        <div style={{
          width: 26, height: 26, borderRadius: 8,
          background: "linear-gradient(135deg, #8b5cf6 0%, #c4b5fd 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", boxShadow: "0 2px 8px rgba(139,92,246,0.25)",
        }}>
          <Shapes size={15} />
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: "#1a1a2e", letterSpacing: "-0.01em" }}>Shapes</span>
          <span style={{ display: "block", fontSize: 9.5, color: "#b0b3c0", fontWeight: 500, marginTop: 1 }}>
            {SHAPES.length} shapes
          </span>
        </div>
      </div>

      {/* Shape grid */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "12px",
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8,
        alignContent: "start",
      }}>
        {SHAPES.map((shape) => {
          const isHovered = hovered === shape.id;
          return (
            <button
              key={shape.id}
              type="button"
              title={shape.label}
              onClick={() => onPick(shape.id, shape.defaultTransform ?? { width: 160, height: 160 })}
              onMouseEnter={() => setHovered(shape.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                padding: "12px 6px 8px",
                borderRadius: 12,
                border: `1px solid ${isHovered ? "rgba(139,92,246,0.3)" : "rgba(0,0,0,0.05)"}`,
                background: isHovered ? "#fff" : "rgba(255,255,255,0.65)",
                cursor: "pointer",
                transition: "all 0.16s cubic-bezier(0.4,0,0.2,1)",
                boxShadow: isHovered ? "0 4px 14px rgba(139,92,246,0.12)" : "0 1px 2px rgba(0,0,0,0.02)",
                transform: isHovered ? "translateY(-2px)" : "translateY(0)",
              }}
            >
              <div style={{
                width: 40, height: 40,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#8b5cf6",
              }}>
                <div style={{ width: 34, height: 34 }}>
                  <ShapeRender variant={shape.id} fill="#8b5cf6" stroke="#1a1a2e" strokeWidth={shape.kind === "line" ? 3 : 0} radius={shape.id === "rounded-rectangle" ? 8 : 0} />
                </div>
              </div>
              <span style={{ fontSize: 9, fontWeight: 600, color: isHovered ? "#1a1a2e" : "#8b8ea0", lineHeight: 1.1, textAlign: "center" }}>
                {shape.label}
              </span>
            </button>
          );
        })}
      </div>

      <style>{`
        @keyframes shapePickerIn {
          0% { opacity: 0; transform: translateX(8px); }
          100% { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

/* ─── Search Mode Picker (sub popup) ─────────── */

function SearchPicker({
  onPick,
  onClose,
}: {
  onPick: (mode: "icon" | "bar") => void;
  onClose: () => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  const options: Array<{ id: "icon" | "bar"; label: string; desc: string; preview: React.ReactNode }> = [
    {
      id: "icon",
      label: "Search icon",
      desc: "Compact icon that expands on tap",
      preview: (
        <div style={{
          width: 36, height: 36, borderRadius: 999,
          background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.05)",
          display: "flex", alignItems: "center", justifyContent: "center", color: "#374151",
        }}>
          <Search size={16} strokeWidth={2.2} />
        </div>
      ),
    },
    {
      id: "bar",
      label: "Search bar",
      desc: "Always-visible search field",
      preview: (
        <div style={{
          width: "100%", maxWidth: 150, height: 32, borderRadius: 999,
          background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.05)",
          display: "flex", alignItems: "center", gap: 6, padding: "0 12px", color: "#9ca3af",
        }}>
          <Search size={13} strokeWidth={2.2} color="#374151" />
          <span style={{ fontSize: 10, fontWeight: 500 }}>Search this page…</span>
        </div>
      ),
    },
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 20,
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #ffffff 0%, #f0faff 100%)",
        animation: "shapePickerIn 0.18s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {/* Header with back button */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "16px 18px 12px",
        borderBottom: "1px solid rgba(0,0,0,0.05)",
      }}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Back to blocks"
          style={{
            width: 28, height: 28, borderRadius: 8,
            border: "1px solid rgba(0,0,0,0.06)",
            background: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "#6b7280",
          }}
        >
          <ChevronLeft size={16} />
        </button>
        <div style={{
          width: 26, height: 26, borderRadius: 8,
          background: "linear-gradient(135deg, #0ea5e9 0%, #7dd3fc 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", boxShadow: "0 2px 8px rgba(14,165,233,0.25)",
        }}>
          <Search size={15} />
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: "#1a1a2e", letterSpacing: "-0.01em" }}>Page Search</span>
          <span style={{ display: "block", fontSize: 9.5, color: "#b0b3c0", fontWeight: 500, marginTop: 1 }}>
            Choose a style
          </span>
        </div>
      </div>

      {/* Mode options */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: 10 }}>
        {options.map((opt) => {
          const isHovered = hovered === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onPick(opt.id)}
              onMouseEnter={() => setHovered(opt.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: "flex", flexDirection: "column", gap: 10,
                padding: "16px 14px",
                borderRadius: 14,
                border: `1px solid ${isHovered ? "rgba(14,165,233,0.35)" : "rgba(0,0,0,0.05)"}`,
                background: isHovered ? "#fff" : "rgba(255,255,255,0.65)",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.16s cubic-bezier(0.4,0,0.2,1)",
                boxShadow: isHovered ? "0 4px 14px rgba(14,165,233,0.12)" : "0 1px 2px rgba(0,0,0,0.02)",
                transform: isHovered ? "translateY(-2px)" : "translateY(0)",
              }}
            >
              <div style={{
                height: 56, borderRadius: 10,
                background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "0 14px",
              }}>
                {opt.preview}
              </div>
              <div>
                <span style={{ display: "block", fontSize: 12.5, fontWeight: 650, color: "#1a1a2e" }}>{opt.label}</span>
                <span style={{ display: "block", fontSize: 10.5, color: "#8b8ea0", fontWeight: 500, marginTop: 1 }}>{opt.desc}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
