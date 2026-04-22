/* ─────────────────────────────────────────────
 * Social Share Template — Mobile-first canvas
 * ──────────────────────────────────────────── */

import type { CanvasDocument, Template } from "@productix/types";

const doc: CanvasDocument = {
  "version": 1,
  "pageTitle": "Social Media Share",
  "artboards": [
    {
      "id": "ab-social-1-merged",
      "name": "Canvas",
      "width": 428,
      "height": 281,
      "backgroundColor": "#1e1b4b",
      "position": 0,
      "elements": [
        "so-bg",
        "so-heading",
        "so-subtitle",
        "so-badge-1",
        "so-badge-2",
        "so-cta",
        "so-avatar",
        "so-name",
        "so-handle",
        "so-divider"
      ]
    }
  ],
  "elements": {
    "so-bg": {
      "id": "so-bg",
      "type": "container",
      "zIndex": 0,
      "locked": true,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 0, "y": 0, "width": 321, "height": 320,
        "rotation": 0 },
      "props": {
        "bgGradientFrom": "#1e1b4b",
        "bgGradientTo": "#4c1d95"
      }
    },
    "so-heading": {
      "id": "so-heading",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 24, "y": 59, "width": 274, "height": 59,
        "rotation": 0 },
      "props": {
        "text": "The Future of Visual Design is Freeform",
        "variant": "heading",
        "fontSize": 15,
        "fontWeight": "800",
        "color": "#ffffff",
        "textAlign": "left",
        "lineHeight": 1.1
      }
    },
    "so-subtitle": {
      "id": "so-subtitle",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 0.75,
      "transform": { "x": 24, "y": 128, "width": 208, "height": 24,
        "rotation": 0 },
      "props": {
        "text": "Build stunning pages with drag-and-drop. No code required. Try it free today.",
        "variant": "paragraph",
        "fontSize": 6,
        "color": "#c4b5fd",
        "textAlign": "left",
        "lineHeight": 1.5
      }
    },
    "so-badge-1": {
      "id": "so-badge-1",
      "type": "badge",
      "zIndex": 6,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 24, "y": 41, "width": 35, "height": 9,
        "rotation": 0 },
      "props": {
        "text": "NEW",
        "icon": "✨",
        "bgColor": "rgba(168,85,247,0.3)",
        "textColor": "#c4b5fd",
        "borderRadius": 260,
        "fontSize": 3,
        "fontWeight": "700"
      }
    },
    "so-badge-2": {
      "id": "so-badge-2",
      "type": "badge",
      "zIndex": 6,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 63, "y": 41, "width": 48, "height": 9,
        "rotation": 0 },
      "props": {
        "text": "#VisualEditor",
        "bgColor": "rgba(59,130,246,0.2)",
        "textColor": "#93c5fd",
        "borderRadius": 260,
        "fontSize": 3,
        "fontWeight": "600"
      }
    },
    "so-cta": {
      "id": "so-cta",
      "type": "button",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 24, "y": 166, "width": 72, "height": 17,
        "rotation": 0 },
      "props": {
        "text": "Try It Free →",
        "variant": "filled",
        "bgColor": "#a855f7",
        "textColor": "#ffffff",
        "borderRadius": 4,
        "fontSize": 5,
        "fontWeight": "700"
      }
    },
    "so-divider": {
      "id": "so-divider",
      "type": "divider",
      "zIndex": 3,
      "locked": false,
      "visible": true,
      "opacity": 0.3,
      "transform": { "x": 24, "y": 237, "width": 274, "height": 6,
        "rotation": 0 },
      "props": {
        "color": "#6d28d9",
        "thickness": 1,
        "lineStyle": "solid",
        "orientation": "horizontal"
      }
    },
    "so-avatar": {
      "id": "so-avatar",
      "type": "icon",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 24, "y": 252, "width": 17, "height": 17,
        "rotation": 0 },
      "props": {
        "icon": "💎",
        "fontSize": 8,
        "bgColor": "#7c3aed",
        "borderRadius": 260
      }
    },
    "so-name": {
      "id": "so-name",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 45, "y": 253, "width": 89, "height": 8,
        "rotation": 0 },
      "props": {
        "text": "Productix",
        "variant": "paragraph",
        "fontSize": 4,
        "fontWeight": "700",
        "color": "#ffffff",
        "textAlign": "left",
        "lineHeight": 1.2
      }
    },
    "so-handle": {
      "id": "so-handle",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 0.6,
      "transform": { "x": 45, "y": 261, "width": 89, "height": 6,
        "rotation": 0 },
      "props": {
        "text": "@productix · productix.com",
        "variant": "paragraph",
        "fontSize": 3,
        "color": "#a78bfa",
        "textAlign": "left",
        "lineHeight": 1.2
      }
    }
  }
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
