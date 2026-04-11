/* ─────────────────────────────────────────────
 * Product Promo Template — Freeform canvas
 * ──────────────────────────────────────────── */

import type { CanvasDocument } from "@productix/types";
import type { Template } from "@productix/types";

const doc: CanvasDocument = {
  version: 1,
  pageTitle: "Product Launch Page",
  artboards: [
    {
      id: "ab-promo-1",
      name: "Hero Section",
      width: 1440,
      height: 900,
      backgroundColor: "#0f172a",
      backgroundImage: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1600&q=80",
      position: 0,
      elements: ["el-overlay-1", "el-heading-1", "el-subtitle-1", "el-cta-1", "el-cta-2", "el-badge-1", "el-stat-1", "el-stat-2", "el-stat-3"],
    },
    {
      id: "ab-promo-2",
      name: "Features Section",
      width: 1440,
      height: 700,
      backgroundColor: "#ffffff",
      position: 1,
      elements: ["el-feat-heading", "el-feat-sub", "el-card-1", "el-card-2", "el-card-3", "el-icon-1", "el-icon-2", "el-icon-3", "el-card-text-1", "el-card-text-2", "el-card-text-3"],
    },
    {
      id: "ab-promo-3",
      name: "CTA Section",
      width: 1440,
      height: 400,
      backgroundColor: "#1e40af",
      position: 2,
      elements: ["el-cta-heading", "el-cta-desc", "el-cta-btn", "el-social-1"],
    },
  ],
  elements: {
    // -- Hero Section elements --
    "el-overlay-1": {
      id: "el-overlay-1", type: "container", zIndex: 1, locked: false, visible: true, opacity: 0.7,
      transform: { x: 0, y: 0, width: 1440, height: 900, rotation: 0 },
      props: { bgColor: "#0f172a", borderRadius: 0 },
    },
    "el-badge-1": {
      id: "el-badge-1", type: "badge", zIndex: 10, locked: false, visible: true, opacity: 1,
      transform: { x: 120, y: 200, width: 160, height: 32, rotation: 0 },
      props: { text: "✨ Now Available", bgColor: "rgba(59,130,246,0.3)", textColor: "#93c5fd", borderRadius: 999, fontSize: 13, fontWeight: "600" },
    },
    "el-heading-1": {
      id: "el-heading-1", type: "heading", zIndex: 10, locked: false, visible: true, opacity: 1,
      transform: { x: 120, y: 260, width: 600, height: 120, rotation: 0 },
      props: { text: "The Future of Visual Design Starts Here", variant: "heading", fontSize: 48, fontWeight: "800", color: "#ffffff", textAlign: "left", lineHeight: 1.1 },
    },
    "el-subtitle-1": {
      id: "el-subtitle-1", type: "text", zIndex: 10, locked: false, visible: true, opacity: 0.85,
      transform: { x: 120, y: 400, width: 500, height: 70, rotation: 0 },
      props: { text: "Create stunning, responsive pages in minutes — no code required. The most powerful visual editor for modern teams.", variant: "paragraph", fontSize: 17, color: "#cbd5e1", textAlign: "left", lineHeight: 1.6 },
    },
    "el-cta-1": {
      id: "el-cta-1", type: "button", zIndex: 10, locked: false, visible: true, opacity: 1,
      transform: { x: 120, y: 500, width: 200, height: 50, rotation: 0 },
      props: { text: "Start Building Free", variant: "filled", bgColor: "#3b82f6", textColor: "#ffffff", borderRadius: 10, fontSize: 15, fontWeight: "600" },
    },
    "el-cta-2": {
      id: "el-cta-2", type: "button", zIndex: 10, locked: false, visible: true, opacity: 1,
      transform: { x: 340, y: 500, width: 160, height: 50, rotation: 0 },
      props: { text: "Watch Demo", variant: "outline", bgColor: "#ffffff", textColor: "#ffffff", borderRadius: 10, fontSize: 15, fontWeight: "600" },
    },
    "el-stat-1": {
      id: "el-stat-1", type: "stat-card", zIndex: 12, locked: false, visible: true, opacity: 1,
      transform: { x: 860, y: 600, width: 160, height: 160, rotation: 0 },
      props: { value: "10K+", label: "Active Users", trend: "+34%", icon: "📄", bgColor: "#ffffff", valueColor: "#1a1a2e", labelColor: "#6b7280", borderRadius: 16, shadow: "lg" },
    },
    "el-stat-2": {
      id: "el-stat-2", type: "stat-card", zIndex: 12, locked: false, visible: true, opacity: 1,
      transform: { x: 1040, y: 600, width: 160, height: 160, rotation: 0 },
      props: { value: "99.9%", label: "Uptime", trend: "", icon: "🛡️", bgColor: "#ffffff", valueColor: "#1a1a2e", labelColor: "#6b7280", borderRadius: 16, shadow: "lg" },
    },
    "el-stat-3": {
      id: "el-stat-3", type: "stat-card", zIndex: 12, locked: false, visible: true, opacity: 1,
      transform: { x: 1220, y: 600, width: 160, height: 160, rotation: 0 },
      props: { value: "4.9★", label: "Rating", trend: "", icon: "⭐", bgColor: "#ffffff", valueColor: "#1a1a2e", labelColor: "#6b7280", borderRadius: 16, shadow: "lg" },
    },

    // -- Features Section elements --
    "el-feat-heading": {
      id: "el-feat-heading", type: "heading", zIndex: 5, locked: false, visible: true, opacity: 1,
      transform: { x: 370, y: 60, width: 700, height: 50, rotation: 0 },
      props: { text: "Everything You Need to Build Amazing Pages", variant: "heading", fontSize: 36, fontWeight: "800", color: "#1a1a2e", textAlign: "center", lineHeight: 1.2 },
    },
    "el-feat-sub": {
      id: "el-feat-sub", type: "text", zIndex: 5, locked: false, visible: true, opacity: 1,
      transform: { x: 400, y: 120, width: 640, height: 40, rotation: 0 },
      props: { text: "Powerful features designed for modern content creators and marketing teams.", variant: "paragraph", fontSize: 16, color: "#6b7280", textAlign: "center", lineHeight: 1.5 },
    },
    "el-card-1": {
      id: "el-card-1", type: "card", zIndex: 3, locked: false, visible: true, opacity: 1,
      transform: { x: 120, y: 200, width: 360, height: 280, rotation: 0 },
      props: { bgColor: "#f8fafc", borderRadius: 20, shadow: "md", borderWidth: 1, borderColor: "#e2e8f0", padding: 32 },
    },
    "el-card-2": {
      id: "el-card-2", type: "card", zIndex: 3, locked: false, visible: true, opacity: 1,
      transform: { x: 540, y: 200, width: 360, height: 280, rotation: 0 },
      props: { bgColor: "#f8fafc", borderRadius: 20, shadow: "md", borderWidth: 1, borderColor: "#e2e8f0", padding: 32 },
    },
    "el-card-3": {
      id: "el-card-3", type: "card", zIndex: 3, locked: false, visible: true, opacity: 1,
      transform: { x: 960, y: 200, width: 360, height: 280, rotation: 0 },
      props: { bgColor: "#f8fafc", borderRadius: 20, shadow: "md", borderWidth: 1, borderColor: "#e2e8f0", padding: 32 },
    },
    "el-icon-1": {
      id: "el-icon-1", type: "icon", zIndex: 5, locked: false, visible: true, opacity: 1,
      transform: { x: 168, y: 230, width: 56, height: 56, rotation: 0 },
      props: { icon: "⚡", fontSize: 36, bgColor: "#eff6ff", borderRadius: 14 },
    },
    "el-icon-2": {
      id: "el-icon-2", type: "icon", zIndex: 5, locked: false, visible: true, opacity: 1,
      transform: { x: 588, y: 230, width: 56, height: 56, rotation: 0 },
      props: { icon: "🎯", fontSize: 36, bgColor: "#fef3c7", borderRadius: 14 },
    },
    "el-icon-3": {
      id: "el-icon-3", type: "icon", zIndex: 5, locked: false, visible: true, opacity: 1,
      transform: { x: 1008, y: 230, width: 56, height: 56, rotation: 0 },
      props: { icon: "📱", fontSize: 36, bgColor: "#ecfdf5", borderRadius: 14 },
    },
    "el-card-text-1": {
      id: "el-card-text-1", type: "text", zIndex: 5, locked: false, visible: true, opacity: 1,
      transform: { x: 152, y: 300, width: 300, height: 140, rotation: 0 },
      props: { text: "Blazing Fast\n\nBuilt on cutting-edge technology. Your pages load in milliseconds, not seconds.", variant: "paragraph", fontSize: 14, color: "#475569", textAlign: "left", lineHeight: 1.6 },
    },
    "el-card-text-2": {
      id: "el-card-text-2", type: "text", zIndex: 5, locked: false, visible: true, opacity: 1,
      transform: { x: 572, y: 300, width: 300, height: 140, rotation: 0 },
      props: { text: "Visual Drag & Drop\n\nIntuitive visual editor that anyone can use. No design skills required.", variant: "paragraph", fontSize: 14, color: "#475569", textAlign: "left", lineHeight: 1.6 },
    },
    "el-card-text-3": {
      id: "el-card-text-3", type: "text", zIndex: 5, locked: false, visible: true, opacity: 1,
      transform: { x: 992, y: 300, width: 300, height: 140, rotation: 0 },
      props: { text: "Fully Responsive\n\nEvery page looks perfect on desktop, tablet, and mobile devices.", variant: "paragraph", fontSize: 14, color: "#475569", textAlign: "left", lineHeight: 1.6 },
    },

    // -- CTA Section elements --
    "el-cta-heading": {
      id: "el-cta-heading", type: "heading", zIndex: 5, locked: false, visible: true, opacity: 1,
      transform: { x: 370, y: 80, width: 700, height: 50, rotation: 0 },
      props: { text: "Ready to Build Something Amazing?", variant: "heading", fontSize: 36, fontWeight: "800", color: "#ffffff", textAlign: "center", lineHeight: 1.2 },
    },
    "el-cta-desc": {
      id: "el-cta-desc", type: "text", zIndex: 5, locked: false, visible: true, opacity: 0.85,
      transform: { x: 420, y: 150, width: 600, height: 40, rotation: 0 },
      props: { text: "Join thousands of teams already building better pages. Start free, upgrade anytime.", variant: "paragraph", fontSize: 16, color: "#bfdbfe", textAlign: "center", lineHeight: 1.5 },
    },
    "el-cta-btn": {
      id: "el-cta-btn", type: "button", zIndex: 5, locked: false, visible: true, opacity: 1,
      transform: { x: 590, y: 220, width: 260, height: 52, rotation: 0 },
      props: { text: "Start Free Trial →", variant: "filled", bgColor: "#ffffff", textColor: "#1e40af", borderRadius: 12, fontSize: 16, fontWeight: "700" },
    },
    "el-social-1": {
      id: "el-social-1", type: "social-group", zIndex: 5, locked: false, visible: true, opacity: 0.7,
      transform: { x: 600, y: 310, width: 240, height: 48, rotation: 0 },
      props: { platforms: ["twitter", "linkedin", "github"], iconSize: 36, gap: 12, iconColor: "#1e40af", iconBg: "rgba(255,255,255,0.2)", borderRadius: 999 },
    },
  },
};

export const productPromoTemplate: Template = {
  meta: {
    id: "product-promo",
    name: "Product Launch",
    description: "A premium product launch page with layered hero, floating stats, feature cards, and CTA.",
    category: "marketing",
    tags: ["product", "launch", "promo", "marketing"],
  },
  data: doc,
};
