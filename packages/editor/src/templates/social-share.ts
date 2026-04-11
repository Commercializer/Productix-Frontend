/* ─────────────────────────────────────────────
 * Social Share Template — Square/portrait artboard
 * ──────────────────────────────────────────── */

import type { CanvasDocument, Template } from "@productix/types";

const doc: CanvasDocument = {
  version: 1,
  pageTitle: "Social Media Share",
  artboards: [
    {
      id: "ab-social-1",
      name: "Social Post",
      width: 1080,
      height: 1080,
      backgroundColor: "#1e1b4b",
      position: 0,
      elements: ["so-bg", "so-heading", "so-subtitle", "so-badge-1", "so-badge-2", "so-cta", "so-avatar", "so-name", "so-handle", "so-divider"],
    },
  ],
  elements: {
    "so-bg": {
      id: "so-bg", type: "container", zIndex: 0, locked: true, visible: true, opacity: 1,
      transform: { x: 0, y: 0, width: 1080, height: 1080, rotation: 0 },
      props: { bgGradientFrom: "#1e1b4b", bgGradientTo: "#4c1d95" },
    },
    "so-heading": {
      id: "so-heading", type: "heading", zIndex: 5, locked: false, visible: true, opacity: 1,
      transform: { x: 80, y: 200, width: 920, height: 200, rotation: 0 },
      props: { text: "The Future of Visual Design is Freeform", variant: "heading", fontSize: 56, fontWeight: "800", color: "#ffffff", textAlign: "left", lineHeight: 1.1 },
    },
    "so-subtitle": {
      id: "so-subtitle", type: "text", zIndex: 5, locked: false, visible: true, opacity: 0.75,
      transform: { x: 80, y: 430, width: 700, height: 80, rotation: 0 },
      props: { text: "Build stunning pages with drag-and-drop. No code required. Try it free today.", variant: "paragraph", fontSize: 22, color: "#c4b5fd", textAlign: "left", lineHeight: 1.5 },
    },
    "so-badge-1": {
      id: "so-badge-1", type: "badge", zIndex: 6, locked: false, visible: true, opacity: 1,
      transform: { x: 80, y: 140, width: 120, height: 32, rotation: 0 },
      props: { text: "NEW", icon: "✨", bgColor: "rgba(168,85,247,0.3)", textColor: "#c4b5fd", borderRadius: 999, fontSize: 13, fontWeight: "700" },
    },
    "so-badge-2": {
      id: "so-badge-2", type: "badge", zIndex: 6, locked: false, visible: true, opacity: 1,
      transform: { x: 210, y: 140, width: 160, height: 32, rotation: 0 },
      props: { text: "#VisualEditor", bgColor: "rgba(59,130,246,0.2)", textColor: "#93c5fd", borderRadius: 999, fontSize: 13, fontWeight: "600" },
    },
    "so-cta": {
      id: "so-cta", type: "button", zIndex: 5, locked: false, visible: true, opacity: 1,
      transform: { x: 80, y: 560, width: 240, height: 56, rotation: 0 },
      props: { text: "Try It Free →", variant: "filled", bgColor: "#a855f7", textColor: "#ffffff", borderRadius: 14, fontSize: 18, fontWeight: "700" },
    },
    "so-divider": {
      id: "so-divider", type: "divider", zIndex: 3, locked: false, visible: true, opacity: 0.3,
      transform: { x: 80, y: 800, width: 920, height: 20, rotation: 0 },
      props: { color: "#6d28d9", thickness: 1, lineStyle: "solid", orientation: "horizontal" },
    },
    "so-avatar": {
      id: "so-avatar", type: "icon", zIndex: 5, locked: false, visible: true, opacity: 1,
      transform: { x: 80, y: 850, width: 56, height: 56, rotation: 0 },
      props: { icon: "💎", fontSize: 32, bgColor: "#7c3aed", borderRadius: 999 },
    },
    "so-name": {
      id: "so-name", type: "text", zIndex: 5, locked: false, visible: true, opacity: 1,
      transform: { x: 150, y: 853, width: 300, height: 25, rotation: 0 },
      props: { text: "Productix", variant: "paragraph", fontSize: 16, fontWeight: "700", color: "#ffffff", textAlign: "left", lineHeight: 1.2 },
    },
    "so-handle": {
      id: "so-handle", type: "text", zIndex: 5, locked: false, visible: true, opacity: 0.6,
      transform: { x: 150, y: 880, width: 300, height: 20, rotation: 0 },
      props: { text: "@productix · productix.com", variant: "paragraph", fontSize: 13, color: "#a78bfa", textAlign: "left", lineHeight: 1.2 },
    },
  },
};

export const socialShareTemplate: Template = {
  meta: {
    id: "social-share",
    name: "Social Share",
    description: "Square social media post with bold text, gradient background, hashtag badges, and profile footer.",
    category: "social",
    tags: ["social", "instagram", "share", "post"],
  },
  data: doc,
};
