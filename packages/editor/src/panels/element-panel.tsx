/* ─────────────────────────────────────────────
 * Story Blocks Panel — Premium glassmorphic design
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
  ChevronDown,
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
} from "lucide-react";
import { getAllElements, type ElementDefinition } from "../elements/registry";
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
  gaming: "elements.category.gaming",
};

/* ─── Category Visual Config ─────────────────── */

interface CategoryMeta {
  icon: React.ReactNode;
  gradient: string;
  glow: string;
  iconBg: string;
}

const CATEGORY_META: Record<string, CategoryMeta> = {
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
  gaming: {
    icon: <Gamepad2 size={15} />,
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
    glow: "rgba(139, 92, 246, 0.15)",
    iconBg: "rgba(139, 92, 246, 0.08)",
  },
};

const CATEGORY_ORDER = ["content", "media", "interactive", "layout", "promotional", "social", "gaming"];

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
  "stat-card":   { label: "Key Stat",        icon: <BarChart3 size={16} />         },
  "promo-card":  { label: "Highlight Card",  icon: <Megaphone size={16} />         },
  divider:       { label: "Divider",         icon: <Minus size={16} />             },
  container:     { label: "Section Block",   icon: <Box size={16} />               },
  row:           { label: "Content Row",     icon: <Rows3 size={16} />             },
  column:        { label: "Column",          icon: <Columns3 size={16} />          },
  raffle:        { label: "Raffle Draw",     icon: <Ticket size={16} />            },
  "slot-machine":{ label: "Slot Machine",    icon: <Gamepad2 size={16} />          },
};

/* ─── Component ──────────────────────────────── */

export function ElementPanel() {
  const addElement = useCanvasStore((s) => s.addElement);
  const activeArtboardId = useCanvasStore((s) => s.activeArtboardId);
  const document = useCanvasStore((s) => s.document);
  const { t } = useTranslation();

  const [expandedCat, setExpandedCat] = useState<string | null>(CATEGORY_ORDER[0]!);
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);
  const [clickedBlock, setClickedBlock] = useState<string | null>(null);

  const handleAdd = useCallback((def: ElementDefinition) => {
    const ab = document.artboards.find((a) => a.id === activeArtboardId) || document.artboards[0];
    const abWidth = ab?.width ?? 428;
    const margin = 16;
    const maxW = abWidth - margin * 2;
    const clampedW = Math.min(def.defaultTransform.width || 200, maxW);
    const centerX = ab ? (ab.width - clampedW) / 2 : 100;
    const centerY = ab ? (ab.height - (def.defaultTransform.height || 80)) / 2 : 100;
    addElement(def.type, { ...def.defaultProps }, { ...def.defaultTransform, width: clampedW, x: centerX, y: centerY }, activeArtboardId ?? undefined);

    // Click ripple feedback
    setClickedBlock(def.type);
    setTimeout(() => setClickedBlock(null), 400);
  }, [addElement, activeArtboardId, document.artboards]);

  const allElements = getAllElements();
  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: CATEGORY_KEYS[cat] ? t(CATEGORY_KEYS[cat]!) : cat,
    meta: CATEGORY_META[cat] || CATEGORY_META.content!,
    items: allElements.filter((el) => el.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100%",
      background: "linear-gradient(180deg, #fafbff 0%, #f5f5fa 100%)",
    }}>
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
          const isExpanded = expandedCat === category;
          return (
            <div key={category} style={{ marginBottom: 6 }}>
              {/* Category Accordion Header */}
              <button
                type="button"
                onClick={() => setExpandedCat(isExpanded ? null : category)}
                style={{
                  width: "100%",
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "none",
                  background: isExpanded ? "rgba(255,255,255,0.95)" : "transparent",
                  cursor: "pointer",
                  transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
                  boxShadow: isExpanded ? "0 1px 4px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.03)" : "none",
                }}
                onMouseEnter={(e) => {
                  if (!isExpanded) e.currentTarget.style.background = "rgba(255,255,255,0.6)";
                }}
                onMouseLeave={(e) => {
                  if (!isExpanded) e.currentTarget.style.background = "transparent";
                }}
              >
                {/* Category icon chip */}
                <div style={{
                  width: 30, height: 30, borderRadius: 9,
                  background: isExpanded ? meta.gradient : meta.iconBg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: isExpanded ? "#fff" : "#6b7280",
                  transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
                  boxShadow: isExpanded ? `0 3px 10px ${meta.glow}` : "none",
                }}>
                  {meta.icon}
                </div>

                <div style={{ flex: 1, textAlign: "left" }}>
                  <span style={{
                    fontSize: 11.5, fontWeight: 650, letterSpacing: "-0.01em",
                    color: isExpanded ? "#1a1a2e" : "#6b7280",
                    transition: "color 0.2s",
                  }}>{label}</span>
                  <span style={{
                    display: "block", fontSize: 9.5, color: "#b0b3c0",
                    fontWeight: 500, marginTop: 1,
                  }}>{items.length} block{items.length !== 1 ? "s" : ""}</span>
                </div>

                {/* Chevron */}
                <ChevronDown
                  size={14}
                  style={{
                    color: "#b0b3c0",
                    transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
                    transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </button>

              {/* Block Grid (collapsible) */}
              <div style={{
                maxHeight: isExpanded ? 1200 : 0,
                overflow: "hidden",
                transition: "max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.2s",
                opacity: isExpanded ? 1 : 0,
              }}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 6,
                  padding: "8px 4px 4px",
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
                          padding: "16px 8px 13px",
                          borderRadius: 14,
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
                          width: 36, height: 36,
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
                            borderRadius: 14,
                            pointerEvents: "none",
                            animation: "blockPulse 0.4s ease-out forwards",
                          }} />
                        )}
                      </button>
                    );
                  })}
                </div>
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
