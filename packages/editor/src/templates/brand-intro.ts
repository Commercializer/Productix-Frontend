/* ─────────────────────────────────────────────
 * Brand / Company Intro Template — Freeform canvas
 * ──────────────────────────────────────────── */

import type { CanvasDocument, Template } from "@productix/types";

const doc: CanvasDocument = {
  version: 1,
  pageTitle: "Brand Introduction",
  artboards: [
    {
      id: "ab-brand-1",
      name: "Brand Hero",
      width: 1440,
      height: 720,
      backgroundColor: "#fafafa",
      position: 0,
      elements: ["br-bg", "br-logo", "br-name", "br-tagline", "br-cta", "br-badge", "br-img"],
    },
    {
      id: "ab-brand-2",
      name: "About",
      width: 1440,
      height: 600,
      backgroundColor: "#ffffff",
      position: 1,
      elements: ["br-about-title", "br-about-text", "br-stat-1", "br-stat-2", "br-stat-3", "br-stat-4", "br-divider"],
    },
  ],
  elements: {
    "br-bg": {
      id: "br-bg", type: "container", zIndex: 0, locked: true, visible: true, opacity: 1,
      transform: { x: 0, y: 0, width: 1440, height: 720, rotation: 0 },
      props: { bgGradientFrom: "#f8fafc", bgGradientTo: "#e0e7ff" },
    },
    "br-logo": {
      id: "br-logo", type: "icon", zIndex: 5, locked: false, visible: true, opacity: 1,
      transform: { x: 660, y: 120, width: 80, height: 80, rotation: 0 },
      props: { icon: "💎", fontSize: 48, bgColor: "#4f46e5", borderRadius: 20, color: "#ffffff" },
    },
    "br-name": {
      id: "br-name", type: "heading", zIndex: 5, locked: false, visible: true, opacity: 1,
      transform: { x: 370, y: 220, width: 700, height: 60, rotation: 0 },
      props: { text: "Acme Industries", variant: "heading", fontSize: 44, fontWeight: "800", color: "#1e1b4b", textAlign: "center", lineHeight: 1.1 },
    },
    "br-tagline": {
      id: "br-tagline", type: "text", zIndex: 5, locked: false, visible: true, opacity: 0.8,
      transform: { x: 400, y: 300, width: 640, height: 60, rotation: 0 },
      props: { text: "Building the future of digital experiences. Trusted by the world's most innovative companies.", variant: "paragraph", fontSize: 18, color: "#64748b", textAlign: "center", lineHeight: 1.6 },
    },
    "br-cta": {
      id: "br-cta", type: "button", zIndex: 5, locked: false, visible: true, opacity: 1,
      transform: { x: 590, y: 390, width: 260, height: 52, rotation: 0 },
      props: { text: "Explore Our Work →", variant: "filled", bgColor: "#4f46e5", textColor: "#ffffff", borderRadius: 12, fontSize: 16, fontWeight: "700" },
    },
    "br-badge": {
      id: "br-badge", type: "badge", zIndex: 6, locked: false, visible: true, opacity: 1,
      transform: { x: 630, y: 80, width: 180, height: 28, rotation: 0 },
      props: { text: "Since 2010", icon: "🏢", bgColor: "#e0e7ff", textColor: "#4338ca", borderRadius: 999, fontSize: 12, fontWeight: "600" },
    },
    "br-img": {
      id: "br-img", type: "image", zIndex: 4, locked: false, visible: true, opacity: 1,
      transform: { x: 340, y: 480, width: 760, height: 220, rotation: 0 },
      props: { src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80", alt: "Modern office", objectFit: "cover", borderRadius: 16 },
    },
    "br-about-title": {
      id: "br-about-title", type: "heading", zIndex: 5, locked: false, visible: true, opacity: 1,
      transform: { x: 120, y: 60, width: 600, height: 50, rotation: 0 },
      props: { text: "Our Impact in Numbers", variant: "heading", fontSize: 32, fontWeight: "700", color: "#1e1b4b", textAlign: "left", lineHeight: 1.2 },
    },
    "br-about-text": {
      id: "br-about-text", type: "text", zIndex: 5, locked: false, visible: true, opacity: 1,
      transform: { x: 120, y: 120, width: 600, height: 60, rotation: 0 },
      props: { text: "For over a decade, we've been pushing boundaries and delivering exceptional results for our clients worldwide.", variant: "paragraph", fontSize: 16, color: "#64748b", textAlign: "left", lineHeight: 1.6 },
    },
    "br-stat-1": {
      id: "br-stat-1", type: "stat-card", zIndex: 5, locked: false, visible: true, opacity: 1,
      transform: { x: 120, y: 220, width: 280, height: 180, rotation: 0 },
      props: { value: "500+", label: "Clients", icon: "🏆", bgColor: "#ffffff", valueColor: "#1e1b4b", labelColor: "#6b7280", borderRadius: 20, shadow: "lg" },
    },
    "br-stat-2": {
      id: "br-stat-2", type: "stat-card", zIndex: 5, locked: false, visible: true, opacity: 1,
      transform: { x: 420, y: 220, width: 280, height: 180, rotation: 0 },
      props: { value: "$2.4B", label: "Revenue Generated", icon: "📈", bgColor: "#ffffff", valueColor: "#1e1b4b", labelColor: "#6b7280", borderRadius: 20, shadow: "lg" },
    },
    "br-stat-3": {
      id: "br-stat-3", type: "stat-card", zIndex: 5, locked: false, visible: true, opacity: 1,
      transform: { x: 720, y: 220, width: 280, height: 180, rotation: 0 },
      props: { value: "15+", label: "Years", icon: "📅", bgColor: "#ffffff", valueColor: "#1e1b4b", labelColor: "#6b7280", borderRadius: 20, shadow: "lg" },
    },
    "br-stat-4": {
      id: "br-stat-4", type: "stat-card", zIndex: 5, locked: false, visible: true, opacity: 1,
      transform: { x: 1020, y: 220, width: 280, height: 180, rotation: 0 },
      props: { value: "99.9%", label: "Satisfaction", icon: "💎", bgColor: "#ffffff", valueColor: "#1e1b4b", labelColor: "#6b7280", borderRadius: 20, shadow: "lg" },
    },
    "br-divider": {
      id: "br-divider", type: "divider", zIndex: 3, locked: false, visible: true, opacity: 1,
      transform: { x: 120, y: 190, width: 1200, height: 20, rotation: 0 },
      props: { color: "#e2e8f0", thickness: 1, lineStyle: "solid", orientation: "horizontal" },
    },
  },
};

export const brandIntroTemplate: Template = {
  meta: {
    id: "brand-intro",
    name: "Brand Introduction",
    description: "Professional brand/company introduction page with logo, tagline, image, and impact stats.",
    category: "brand",
    tags: ["brand", "company", "about", "corporate"],
  },
  data: doc,
};
