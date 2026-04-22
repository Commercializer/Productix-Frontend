/* ─────────────────────────────────────────────
 * Brand Introduction Template — Mobile-first canvas
 * ──────────────────────────────────────────── */

import type { CanvasDocument, Template } from "@productix/types";

const doc: CanvasDocument = {
  "version": 1,
  "pageTitle": "Brand Introduction",
  "artboards": [
    {
      "id": "ab-brand-1-merged",
      "name": "Canvas",
      "width": 428,
      "height": 344,
      "backgroundColor": "#fafafa",
      "position": 0,
      "elements": [
        "br-bg",
        "br-logo",
        "br-name",
        "br-tagline",
        "br-cta",
        "br-badge",
        "br-img",
        "br-about-title",
        "br-about-text",
        "br-stat-1",
        "br-stat-2",
        "br-stat-3",
        "br-stat-4",
        "br-divider"
      ]
    }
  ],
  "elements": {
    "br-bg": {
      "id": "br-bg",
      "type": "container",
      "zIndex": 0,
      "locked": true,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 0, "y": 0, "width": 488, "height": 214,
        "rotation": 0 },
      "props": {
        "bgGradientFrom": "#f8fafc",
        "bgGradientTo": "#e0e7ff"
      }
    },
    "br-logo": {
      "id": "br-logo",
      "type": "icon",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 196, "y": 35, "width": 24, "height": 24,
        "rotation": 0 },
      "props": {
        "icon": "💎",
        "fontSize": 13,
        "bgColor": "#4f46e5",
        "borderRadius": 5,
        "color": "#ffffff"
      }
    },
    "br-name": {
      "id": "br-name",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 110, "y": 65, "width": 208, "height": 18,
        "rotation": 0 },
      "props": {
        "text": "Acme Industries",
        "variant": "heading",
        "fontSize": 11,
        "fontWeight": "800",
        "color": "#1e1b4b",
        "textAlign": "center",
        "lineHeight": 1.1
      }
    },
    "br-tagline": {
      "id": "br-tagline",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 0.8,
      "transform": { "x": 119, "y": 89, "width": 191, "height": 18,
        "rotation": 0 },
      "props": {
        "text": "Building the future of digital experiences. Trusted by the world's most innovative companies.",
        "variant": "paragraph",
        "fontSize": 5,
        "color": "#64748b",
        "textAlign": "center",
        "lineHeight": 1.6
      }
    },
    "br-cta": {
      "id": "br-cta",
      "type": "button",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 176, "y": 116, "width": 78, "height": 16,
        "rotation": 0 },
      "props": {
        "text": "Explore Our Work →",
        "variant": "filled",
        "bgColor": "#4f46e5",
        "textColor": "#ffffff",
        "borderRadius": 3,
        "fontSize": 4,
        "fontWeight": "700"
      }
    },
    "br-badge": {
      "id": "br-badge",
      "type": "badge",
      "zIndex": 6,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 187, "y": 24, "width": 54, "height": 8,
        "rotation": 0 },
      "props": {
        "text": "Since 2010",
        "icon": "🏢",
        "bgColor": "#e0e7ff",
        "textColor": "#4338ca",
        "borderRadius": 260,
        "fontSize": 3,
        "fontWeight": "600"
      }
    },
    "br-img": {
      "id": "br-img",
      "type": "image",
      "zIndex": 4,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 102, "y": 143, "width": 226, "height": 65,
        "rotation": 0 },
      "props": {
        "src": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
        "alt": "Modern office",
        "objectFit": "cover",
        "borderRadius": 4
      }
    },
    "br-about-title": {
      "id": "br-about-title",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 35, "y": 232, "width": 178, "height": 15,
        "rotation": 0 },
      "props": {
        "text": "Our Impact in Numbers",
        "variant": "heading",
        "fontSize": 8,
        "fontWeight": "700",
        "color": "#1e1b4b",
        "textAlign": "left",
        "lineHeight": 1.2
      }
    },
    "br-about-text": {
      "id": "br-about-text",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 35, "y": 250, "width": 178, "height": 18,
        "rotation": 0 },
      "props": {
        "text": "For over a decade, we've been pushing boundaries and delivering exceptional results for our clients worldwide.",
        "variant": "paragraph",
        "fontSize": 4,
        "color": "#64748b",
        "textAlign": "left",
        "lineHeight": 1.6
      }
    },
    "br-stat-1": {
      "id": "br-stat-1",
      "type": "stat-card",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 35, "y": 279, "width": 83, "height": 54,
        "rotation": 0 },
      "props": {
        "value": "500+",
        "label": "Clients",
        "icon": "🏆",
        "bgColor": "#ffffff",
        "valueColor": "#1e1b4b",
        "labelColor": "#6b7280",
        "borderRadius": 5,
        "shadow": "lg"
      }
    },
    "br-stat-2": {
      "id": "br-stat-2",
      "type": "stat-card",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 124, "y": 279, "width": 83, "height": 54,
        "rotation": 0 },
      "props": {
        "value": "$2.4B",
        "label": "Revenue Generated",
        "icon": "📈",
        "bgColor": "#ffffff",
        "valueColor": "#1e1b4b",
        "labelColor": "#6b7280",
        "borderRadius": 5,
        "shadow": "lg"
      }
    },
    "br-stat-3": {
      "id": "br-stat-3",
      "type": "stat-card",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 215, "y": 279, "width": 83, "height": 54,
        "rotation": 0 },
      "props": {
        "value": "15+",
        "label": "Years",
        "icon": "📅",
        "bgColor": "#ffffff",
        "valueColor": "#1e1b4b",
        "labelColor": "#6b7280",
        "borderRadius": 5,
        "shadow": "lg"
      }
    },
    "br-stat-4": {
      "id": "br-stat-4",
      "type": "stat-card",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 304, "y": 279, "width": 83, "height": 54,
        "rotation": 0 },
      "props": {
        "value": "99.9%",
        "label": "Satisfaction",
        "icon": "💎",
        "bgColor": "#ffffff",
        "valueColor": "#1e1b4b",
        "labelColor": "#6b7280",
        "borderRadius": 5,
        "shadow": "lg"
      }
    },
    "br-divider": {
      "id": "br-divider",
      "type": "divider",
      "zIndex": 3,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 35, "y": 270, "width": 357, "height": 6,
        "rotation": 0 },
      "props": {
        "color": "#e2e8f0",
        "thickness": 1,
        "lineStyle": "solid",
        "orientation": "horizontal"
      }
    }
  }
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
