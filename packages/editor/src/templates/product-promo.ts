/* ─────────────────────────────────────────────
 * Product Launch Template — Mobile-first canvas
 * ──────────────────────────────────────────── */

import type { CanvasDocument, Template } from "@productix/types";

const doc: CanvasDocument = {
  "version": 1,
  "pageTitle": "Product Launch Page",
  "artboards": [
    {
      "id": "ab-promo-1-merged",
      "name": "Canvas",
      "width": 428,
      "height": 521,
      "backgroundColor": "#0f172a",
      "backgroundImage": "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1600&q=80",
      "position": 0,
      "elements": [
        "el-overlay-1",
        "el-heading-1",
        "el-subtitle-1",
        "el-cta-1",
        "el-cta-2",
        "el-badge-1",
        "el-stat-1",
        "el-stat-2",
        "el-stat-3",
        "el-feat-heading",
        "el-feat-sub",
        "el-card-1",
        "el-card-2",
        "el-card-3",
        "el-icon-1",
        "el-icon-2",
        "el-icon-3",
        "el-card-text-1",
        "el-card-text-2",
        "el-card-text-3",
        "el-cta-heading",
        "el-cta-desc",
        "el-cta-btn",
        "el-social-1"
      ]
    }
  ],
  "elements": {
    "el-overlay-1": {
      "id": "el-overlay-1",
      "type": "container",
      "zIndex": 1,
      "locked": false,
      "visible": true,
      "opacity": 0.7,
      "transform": { "x": 0, "y": 0, "width": 488, "height": 267,
        "rotation": 0 },
      "props": {
        "bgColor": "#0f172a",
        "borderRadius": 0
      }
    },
    "el-badge-1": {
      "id": "el-badge-1",
      "type": "badge",
      "zIndex": 10,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 35, "y": 59, "width": 48, "height": 9,
        "rotation": 0 },
      "props": {
        "text": "✨ Now Available",
        "bgColor": "rgba(59,130,246,0.3)",
        "textColor": "#93c5fd",
        "borderRadius": 260,
        "fontSize": 3,
        "fontWeight": "600"
      }
    },
    "el-heading-1": {
      "id": "el-heading-1",
      "type": "heading",
      "zIndex": 10,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 35, "y": 78, "width": 178, "height": 35,
        "rotation": 0 },
      "props": {
        "text": "The Future of Visual Design Starts Here",
        "variant": "heading",
        "fontSize": 13,
        "fontWeight": "800",
        "color": "#ffffff",
        "textAlign": "left",
        "lineHeight": 1.1
      }
    },
    "el-subtitle-1": {
      "id": "el-subtitle-1",
      "type": "text",
      "zIndex": 10,
      "locked": false,
      "visible": true,
      "opacity": 0.85,
      "transform": { "x": 35, "y": 119, "width": 148, "height": 21,
        "rotation": 0 },
      "props": {
        "text": "Create stunning, responsive pages in minutes — no code required. The most powerful visual editor for modern teams.",
        "variant": "paragraph",
        "fontSize": 4,
        "color": "#cbd5e1",
        "textAlign": "left",
        "lineHeight": 1.6
      }
    },
    "el-cta-1": {
      "id": "el-cta-1",
      "type": "button",
      "zIndex": 10,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 35, "y": 148, "width": 59, "height": 15,
        "rotation": 0 },
      "props": {
        "text": "Start Building Free",
        "variant": "filled",
        "bgColor": "#3b82f6",
        "textColor": "#ffffff",
        "borderRadius": 3,
        "fontSize": 4,
        "fontWeight": "600"
      }
    },
    "el-cta-2": {
      "id": "el-cta-2",
      "type": "button",
      "zIndex": 10,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 102, "y": 148, "width": 48, "height": 15,
        "rotation": 0 },
      "props": {
        "text": "Watch Demo",
        "variant": "outline",
        "bgColor": "#ffffff",
        "textColor": "#ffffff",
        "borderRadius": 3,
        "fontSize": 4,
        "fontWeight": "600"
      }
    },
    "el-stat-1": {
      "id": "el-stat-1",
      "type": "stat-card",
      "zIndex": 12,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 256, "y": 178, "width": 48, "height": 48,
        "rotation": 0 },
      "props": {
        "value": "10K+",
        "label": "Active Users",
        "trend": "+34%",
        "icon": "📄",
        "bgColor": "#ffffff",
        "valueColor": "#1a1a2e",
        "labelColor": "#6b7280",
        "borderRadius": 4,
        "shadow": "lg"
      }
    },
    "el-stat-2": {
      "id": "el-stat-2",
      "type": "stat-card",
      "zIndex": 12,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 309, "y": 178, "width": 48, "height": 48,
        "rotation": 0 },
      "props": {
        "value": "99.9%",
        "label": "Uptime",
        "trend": "",
        "icon": "🛡️",
        "bgColor": "#ffffff",
        "valueColor": "#1a1a2e",
        "labelColor": "#6b7280",
        "borderRadius": 4,
        "shadow": "lg"
      }
    },
    "el-stat-3": {
      "id": "el-stat-3",
      "type": "stat-card",
      "zIndex": 12,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 363, "y": 178, "width": 48, "height": 48,
        "rotation": 0 },
      "props": {
        "value": "4.9★",
        "label": "Rating",
        "trend": "",
        "icon": "⭐",
        "bgColor": "#ffffff",
        "valueColor": "#1a1a2e",
        "labelColor": "#6b7280",
        "borderRadius": 4,
        "shadow": "lg"
      }
    },
    "el-feat-heading": {
      "id": "el-feat-heading",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 110, "y": 285, "width": 208, "height": 15,
        "rotation": 0 },
      "props": {
        "text": "Everything You Need to Build Amazing Pages",
        "variant": "heading",
        "fontSize": 9,
        "fontWeight": "800",
        "color": "#1a1a2e",
        "textAlign": "center",
        "lineHeight": 1.2
      }
    },
    "el-feat-sub": {
      "id": "el-feat-sub",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 119, "y": 303, "width": 191, "height": 11,
        "rotation": 0 },
      "props": {
        "text": "Powerful features designed for modern content creators and marketing teams.",
        "variant": "paragraph",
        "fontSize": 4,
        "color": "#6b7280",
        "textAlign": "center",
        "lineHeight": 1.5
      }
    },
    "el-card-1": {
      "id": "el-card-1",
      "type": "card",
      "zIndex": 3,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 35, "y": 326, "width": 107, "height": 83,
        "rotation": 0 },
      "props": {
        "bgColor": "#f8fafc",
        "borderRadius": 5,
        "shadow": "md",
        "borderWidth": 1,
        "borderColor": "#e2e8f0",
        "padding": 8
      }
    },
    "el-card-2": {
      "id": "el-card-2",
      "type": "card",
      "zIndex": 3,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 161, "y": 326, "width": 107, "height": 83,
        "rotation": 0 },
      "props": {
        "bgColor": "#f8fafc",
        "borderRadius": 5,
        "shadow": "md",
        "borderWidth": 1,
        "borderColor": "#e2e8f0",
        "padding": 8
      }
    },
    "el-card-3": {
      "id": "el-card-3",
      "type": "card",
      "zIndex": 3,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 285, "y": 326, "width": 107, "height": 83,
        "rotation": 0 },
      "props": {
        "bgColor": "#f8fafc",
        "borderRadius": 5,
        "shadow": "md",
        "borderWidth": 1,
        "borderColor": "#e2e8f0",
        "padding": 8
      }
    },
    "el-icon-1": {
      "id": "el-icon-1",
      "type": "icon",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 50, "y": 335, "width": 17, "height": 17,
        "rotation": 0 },
      "props": {
        "icon": "⚡",
        "fontSize": 9,
        "bgColor": "#eff6ff",
        "borderRadius": 4
      }
    },
    "el-icon-2": {
      "id": "el-icon-2",
      "type": "icon",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 175, "y": 335, "width": 17, "height": 17,
        "rotation": 0 },
      "props": {
        "icon": "🎯",
        "fontSize": 9,
        "bgColor": "#fef3c7",
        "borderRadius": 4
      }
    },
    "el-icon-3": {
      "id": "el-icon-3",
      "type": "icon",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 300, "y": 335, "width": 17, "height": 17,
        "rotation": 0 },
      "props": {
        "icon": "📱",
        "fontSize": 9,
        "bgColor": "#ecfdf5",
        "borderRadius": 4
      }
    },
    "el-card-text-1": {
      "id": "el-card-text-1",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 46, "y": 357, "width": 89, "height": 41,
        "rotation": 0 },
      "props": {
        "text": "Blazing Fast\n\nBuilt on cutting-edge technology. Your pages load in milliseconds, not seconds.",
        "variant": "paragraph",
        "fontSize": 4,
        "color": "#475569",
        "textAlign": "left",
        "lineHeight": 1.6
      }
    },
    "el-card-text-2": {
      "id": "el-card-text-2",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 170, "y": 357, "width": 89, "height": 41,
        "rotation": 0 },
      "props": {
        "text": "Visual Drag & Drop\n\nIntuitive visual editor that anyone can use. No design skills required.",
        "variant": "paragraph",
        "fontSize": 4,
        "color": "#475569",
        "textAlign": "left",
        "lineHeight": 1.6
      }
    },
    "el-card-text-3": {
      "id": "el-card-text-3",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 294, "y": 357, "width": 89, "height": 41,
        "rotation": 0 },
      "props": {
        "text": "Fully Responsive\n\nEvery page looks perfect on desktop, tablet, and mobile devices.",
        "variant": "paragraph",
        "fontSize": 4,
        "color": "#475569",
        "textAlign": "left",
        "lineHeight": 1.6
      }
    },
    "el-cta-heading": {
      "id": "el-cta-heading",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 110, "y": 499, "width": 208, "height": 15,
        "rotation": 0 },
      "props": {
        "text": "Ready to Build Something Amazing?",
        "variant": "heading",
        "fontSize": 9,
        "fontWeight": "800",
        "color": "#ffffff",
        "textAlign": "center",
        "lineHeight": 1.2
      }
    },
    "el-cta-desc": {
      "id": "el-cta-desc",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 0.85,
      "transform": { "x": 124, "y": 520, "width": 178, "height": 11,
        "rotation": 0 },
      "props": {
        "text": "Join thousands of teams already building better pages. Start free, upgrade anytime.",
        "variant": "paragraph",
        "fontSize": 4,
        "color": "#bfdbfe",
        "textAlign": "center",
        "lineHeight": 1.5
      }
    },
    "el-cta-btn": {
      "id": "el-cta-btn",
      "type": "button",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 176, "y": 541, "width": 78, "height": 16,
        "rotation": 0 },
      "props": {
        "text": "Start Free Trial →",
        "variant": "filled",
        "bgColor": "#ffffff",
        "textColor": "#1e40af",
        "borderRadius": 3,
        "fontSize": 4,
        "fontWeight": "700"
      }
    },
    "el-social-1": {
      "id": "el-social-1",
      "type": "social-group",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 0.7,
      "transform": { "x": 178, "y": 567, "width": 72, "height": 15,
        "rotation": 0 },
      "props": {
        "platforms": [
          "twitter",
          "linkedin",
          "github"
        ],
        "iconSize": 9,
        "gap": 3,
        "iconColor": "#1e40af",
        "iconBg": "rgba(255,255,255,0.2)",
        "borderRadius": 260
      }
    }
  }
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
