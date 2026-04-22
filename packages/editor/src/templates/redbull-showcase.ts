/* ─────────────────────────────────────────────
 * Red Bull Showcase Template — Mobile-first canvas
 * ──────────────────────────────────────────── */

import type { CanvasDocument, Template } from "@productix/types";

const doc: CanvasDocument = {
  "version": 1,
  "pageTitle": "Red Bull Energy Drink",
  "artboards": [
    {
      "id": "rb-hero-merged",
      "name": "Canvas",
      "width": 428,
      "height": 1167,
      "backgroundColor": "#0a1628",
      "backgroundImage": "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=1600&q=80",
      "position": 0,
      "elements": [
        "rb-hero-overlay",
        "rb-hero-lang",
        "rb-hero-img",
        "rb-logo-icon",
        "rb-logo-text",
        "rb-product-name",
        "rb-var-1",
        "rb-var-2",
        "rb-var-3",
        "rb-tagline",
        "rb-cta",
        "rb-social-group",
        "rb-about-card",
        "rb-about-title",
        "rb-about-text",
        "rb-about-more",
        "rb-feat-title",
        "rb-feat-card-1",
        "rb-feat-icon-1",
        "rb-feat-text-1",
        "rb-feat-card-2",
        "rb-feat-icon-2",
        "rb-feat-text-2",
        "rb-feat-card-3",
        "rb-feat-icon-3",
        "rb-feat-text-3",
        "rb-dl-card",
        "rb-dl-title",
        "rb-dl-desc",
        "rb-life-overlay",
        "rb-life-text",
        "rb-oth-title",
        "rb-oth-card-1",
        "rb-oth-img-1",
        "rb-oth-name-1",
        "rb-oth-sub-1",
        "rb-oth-card-2",
        "rb-oth-img-2",
        "rb-oth-name-2",
        "rb-oth-sub-2",
        "rb-oth-card-3",
        "rb-oth-img-3",
        "rb-oth-name-3",
        "rb-oth-sub-3",
        "rb-view-all",
        "rb-foot-overlay",
        "rb-foot-msg",
        "rb-foot-sub",
        "rb-foot-logo",
        "rb-foot-link"
      ]
    }
  ],
  "elements": {
    "rb-hero-overlay": {
      "id": "rb-hero-overlay",
      "type": "container",
      "zIndex": 1,
      "locked": true,
      "visible": true,
      "opacity": 0.7,
      "transform": { "x": 0, "y": 0, "width": 488, "height": 244,
        "rotation": 0 },
      "props": {
        "bgGradientFrom": "#0a1628",
        "bgGradientTo": "#1a3a5c"
      }
    },
    "rb-hero-lang": {
      "id": "rb-hero-lang",
      "type": "badge",
      "zIndex": 10,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 339, "y": 11, "width": 65, "height": 18,
        "rotation": 0 },
      "props": {
        "text": "English ▾",
        "bgColor": "rgba(255,255,255,0.15)",
        "textColor": "#ffffff",
        "borderRadius": 260,
        "fontSize": 6,
        "fontWeight": "500"
      }
    },
    "rb-hero-img": {
      "id": "rb-hero-img",
      "type": "image",
      "zIndex": 10,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 80, "y": 30, "width": 267, "height": 196,
        "rotation": 0 },
      "props": {
        "src": "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=800&q=90",
        "alt": "Red Bull Can",
        "objectFit": "contain",
        "borderRadius": 0
      }
    },
    "rb-logo-icon": {
      "id": "rb-logo-icon",
      "type": "icon",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 24, "y": 261, "width": 30, "height": 30,
        "rotation": 0 },
      "props": {
        "icon": "🐂",
        "fontSize": 16,
        "bgColor": "transparent",
        "borderRadius": 0
      }
    },
    "rb-logo-text": {
      "id": "rb-logo-text",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 56, "y": 266, "width": 119, "height": 21,
        "rotation": 0 },
      "props": {
        "text": "Red Bull",
        "variant": "heading",
        "fontSize": 9,
        "fontWeight": "800",
        "color": "#1e40af",
        "textAlign": "left",
        "lineHeight": 1.2
      }
    },
    "rb-product-name": {
      "id": "rb-product-name",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 24, "y": 297, "width": 380, "height": 24,
        "rotation": 0 },
      "props": {
        "text": "Red Bull Energy Drink",
        "variant": "heading",
        "fontSize": 14,
        "fontWeight": "800",
        "color": "#1a1a2e",
        "textAlign": "left",
        "lineHeight": 1.2
      }
    },
    "rb-var-1": {
      "id": "rb-var-1",
      "type": "button",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 24, "y": 333, "width": 78, "height": 24,
        "rotation": 0 },
      "props": {
        "text": "250 ml",
        "variant": "filled",
        "bgColor": "#1e40af",
        "textColor": "#ffffff",
        "borderRadius": 4,
        "fontSize": 7,
        "fontWeight": "600"
      }
    },
    "rb-var-2": {
      "id": "rb-var-2",
      "type": "button",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 110, "y": 333, "width": 78, "height": 24,
        "rotation": 0 },
      "props": {
        "text": "473 ml",
        "variant": "outline",
        "bgColor": "#f8fafc",
        "textColor": "#6b7280",
        "borderRadius": 4,
        "fontSize": 7,
        "fontWeight": "600"
      }
    },
    "rb-var-3": {
      "id": "rb-var-3",
      "type": "button",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 196, "y": 333, "width": 78, "height": 24,
        "rotation": 0 },
      "props": {
        "text": "355 ml",
        "variant": "outline",
        "bgColor": "#f8fafc",
        "textColor": "#6b7280",
        "borderRadius": 4,
        "fontSize": 7,
        "fontWeight": "600"
      }
    },
    "rb-tagline": {
      "id": "rb-tagline",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 24, "y": 368, "width": 357, "height": 35,
        "rotation": 0 },
      "props": {
        "text": "The original Red Bull Energy Drink. Giving wiiings to people and ideas since 1987.",
        "variant": "paragraph",
        "fontSize": 8,
        "color": "#6b7280",
        "textAlign": "left",
        "lineHeight": 1.6
      }
    },
    "rb-cta": {
      "id": "rb-cta",
      "type": "button",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 24, "y": 416, "width": 380, "height": 30,
        "rotation": 0 },
      "props": {
        "text": "💬  Feedback / Inquiry",
        "variant": "filled",
        "bgColor": "#1e3a5f",
        "textColor": "#ffffff",
        "borderRadius": 6,
        "fontSize": 8,
        "fontWeight": "600"
      }
    },
    "rb-social-group": {
      "id": "rb-social-group",
      "type": "social-group",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 107, "y": 469, "width": 215, "height": 35,
        "rotation": 0 },
      "props": {
        "platforms": [
          "twitter",
          "facebook",
          "instagram",
          "linkedin"
        ],
        "iconSize": 21,
        "gap": 10,
        "iconColor": "#1e40af",
        "iconBg": "#f0f4f8",
        "borderRadius": 260
      }
    },
    "rb-about-card": {
      "id": "rb-about-card",
      "type": "card",
      "zIndex": 2,
      "locked": true,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 18, "y": 529, "width": 393, "height": 124,
        "rotation": 0 },
      "props": {
        "bgColor": "#f8fafc",
        "borderRadius": 8,
        "shadow": "md",
        "borderWidth": 1,
        "borderColor": "#e2e8f0",
        "padding": 0
      }
    },
    "rb-about-title": {
      "id": "rb-about-title",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 35, "y": 541, "width": 357, "height": 18,
        "rotation": 0 },
      "props": {
        "text": "About Red Bull Energy Drink",
        "variant": "heading",
        "fontSize": 8,
        "fontWeight": "700",
        "color": "#1a1a2e",
        "textAlign": "left",
        "lineHeight": 1.3
      }
    },
    "rb-about-text": {
      "id": "rb-about-text",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 35, "y": 564, "width": 357, "height": 59,
        "rotation": 0 },
      "props": {
        "text": "Red Bull Energy Drink is appreciated worldwide by top athletes, busy professionals, college students and travelers on long journeys. It vitalizes body and mind. Red Bull gives you wiiings whenever you need them — whether at work, during sports, while studying, playing video games, or during leisure activities.",
        "variant": "paragraph",
        "fontSize": 7,
        "color": "#6b7280",
        "textAlign": "left",
        "lineHeight": 1.7
      }
    },
    "rb-about-more": {
      "id": "rb-about-more",
      "type": "button",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 35, "y": 629, "width": 357, "height": 18,
        "rotation": 0 },
      "props": {
        "text": "Read more ▾",
        "variant": "outline",
        "bgColor": "transparent",
        "textColor": "#6b7280",
        "borderRadius": 0,
        "fontSize": 7,
        "fontWeight": "600"
      }
    },
    "rb-feat-title": {
      "id": "rb-feat-title",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 24, "y": 683, "width": 178, "height": 15,
        "rotation": 0 },
      "props": {
        "text": "Benefits",
        "variant": "heading",
        "fontSize": 7,
        "fontWeight": "700",
        "color": "#1a1a2e",
        "textAlign": "left",
        "lineHeight": 1.2
      }
    },
    "rb-feat-card-1": {
      "id": "rb-feat-card-1",
      "type": "card",
      "zIndex": 2,
      "locked": true,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 18, "y": 704, "width": 250, "height": 30,
        "rotation": 0 },
      "props": {
        "bgColor": "#ffffff",
        "borderRadius": 5,
        "shadow": "sm",
        "borderWidth": 1,
        "borderColor": "#e2e8f0",
        "padding": 0
      }
    },
    "rb-feat-icon-1": {
      "id": "rb-feat-icon-1",
      "type": "icon",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 30, "y": 709, "width": 18, "height": 18,
        "rotation": 0 },
      "props": {
        "icon": "⚡",
        "fontSize": 8,
        "bgColor": "transparent",
        "borderRadius": 0
      }
    },
    "rb-feat-text-1": {
      "id": "rb-feat-text-1",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 54, "y": 712, "width": 178, "height": 15,
        "rotation": 0 },
      "props": {
        "text": "Stay alert",
        "variant": "paragraph",
        "fontSize": 7,
        "fontWeight": "600",
        "color": "#1a1a2e",
        "textAlign": "left",
        "lineHeight": 1.4
      }
    },
    "rb-feat-card-2": {
      "id": "rb-feat-card-2",
      "type": "card",
      "zIndex": 2,
      "locked": true,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 18, "y": 739, "width": 250, "height": 30,
        "rotation": 0 },
      "props": {
        "bgColor": "#ffffff",
        "borderRadius": 5,
        "shadow": "sm",
        "borderWidth": 1,
        "borderColor": "#e2e8f0",
        "padding": 0
      }
    },
    "rb-feat-icon-2": {
      "id": "rb-feat-icon-2",
      "type": "icon",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 30, "y": 746, "width": 18, "height": 18,
        "rotation": 0 },
      "props": {
        "icon": "🔋",
        "fontSize": 8,
        "bgColor": "transparent",
        "borderRadius": 0
      }
    },
    "rb-feat-text-2": {
      "id": "rb-feat-text-2",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 54, "y": 747, "width": 178, "height": 15,
        "rotation": 0 },
      "props": {
        "text": "Reduce fatigue",
        "variant": "paragraph",
        "fontSize": 7,
        "fontWeight": "600",
        "color": "#1a1a2e",
        "textAlign": "left",
        "lineHeight": 1.4
      }
    },
    "rb-feat-card-3": {
      "id": "rb-feat-card-3",
      "type": "card",
      "zIndex": 2,
      "locked": true,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 18, "y": 775, "width": 250, "height": 30,
        "rotation": 0 },
      "props": {
        "bgColor": "#ffffff",
        "borderRadius": 5,
        "shadow": "sm",
        "borderWidth": 1,
        "borderColor": "#e2e8f0",
        "padding": 0
      }
    },
    "rb-feat-icon-3": {
      "id": "rb-feat-icon-3",
      "type": "icon",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 30, "y": 781, "width": 18, "height": 18,
        "rotation": 0 },
      "props": {
        "icon": "🚀",
        "fontSize": 8,
        "bgColor": "transparent",
        "borderRadius": 0
      }
    },
    "rb-feat-text-3": {
      "id": "rb-feat-text-3",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 54, "y": 782, "width": 178, "height": 15,
        "rotation": 0 },
      "props": {
        "text": "Kickstart your day",
        "variant": "paragraph",
        "fontSize": 7,
        "fontWeight": "600",
        "color": "#1a1a2e",
        "textAlign": "left",
        "lineHeight": 1.4
      }
    },
    "rb-dl-card": {
      "id": "rb-dl-card",
      "type": "card",
      "zIndex": 2,
      "locked": true,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 280, "y": 704, "width": 131, "height": 101,
        "rotation": 0 },
      "props": {
        "bgColor": "#ffffff",
        "borderRadius": 6,
        "shadow": "md",
        "borderWidth": 1,
        "borderColor": "#e2e8f0",
        "padding": 0
      }
    },
    "rb-dl-title": {
      "id": "rb-dl-title",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 297, "y": 731, "width": 95, "height": 15,
        "rotation": 0 },
      "props": {
        "text": "📖 Recipe book",
        "variant": "heading",
        "fontSize": 7,
        "fontWeight": "700",
        "color": "#1a1a2e",
        "textAlign": "center",
        "lineHeight": 1.3
      }
    },
    "rb-dl-desc": {
      "id": "rb-dl-desc",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 297, "y": 752, "width": 95, "height": 24,
        "rotation": 0 },
      "props": {
        "text": "20 pages\n1.4 MB",
        "variant": "paragraph",
        "fontSize": 6,
        "color": "#9ca3af",
        "textAlign": "center",
        "lineHeight": 1.5
      }
    },
    "rb-life-overlay": {
      "id": "rb-life-overlay",
      "type": "container",
      "zIndex": 1,
      "locked": true,
      "visible": true,
      "opacity": 0.5,
      "transform": { "x": 0, "y": 826, "width": 488, "height": 148,
        "rotation": 0 },
      "props": {
        "bgGradientFrom": "transparent",
        "bgGradientTo": "#0a1628"
      }
    },
    "rb-life-text": {
      "id": "rb-life-text",
      "type": "heading",
      "zIndex": 10,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 24, "y": 939, "width": 237, "height": 24,
        "rotation": 0 },
      "props": {
        "text": "Ready to take off?",
        "variant": "heading",
        "fontSize": 9,
        "fontWeight": "700",
        "color": "#ffffff",
        "textAlign": "left",
        "lineHeight": 1.3
      }
    },
    "rb-oth-title": {
      "id": "rb-oth-title",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 24, "y": 986, "width": 237, "height": 18,
        "rotation": 0 },
      "props": {
        "text": "Other Red Bull Drinks",
        "variant": "heading",
        "fontSize": 8,
        "fontWeight": "700",
        "color": "#1a1a2e",
        "textAlign": "left",
        "lineHeight": 1.2
      }
    },
    "rb-oth-card-1": {
      "id": "rb-oth-card-1",
      "type": "card",
      "zIndex": 2,
      "locked": true,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 18, "y": 1013, "width": 124, "height": 124,
        "rotation": 0 },
      "props": {
        "bgColor": "#e8f0fe",
        "borderRadius": 7,
        "shadow": "md",
        "borderWidth": 0,
        "borderColor": "transparent",
        "padding": 0
      }
    },
    "rb-oth-img-1": {
      "id": "rb-oth-img-1",
      "type": "image",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 35, "y": 1018, "width": 89, "height": 72,
        "rotation": 0 },
      "props": {
        "src": "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=400&q=80",
        "alt": "Red Bull Zero",
        "objectFit": "contain",
        "borderRadius": 3
      }
    },
    "rb-oth-name-1": {
      "id": "rb-oth-name-1",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 30, "y": 1096, "width": 102, "height": 11,
        "rotation": 0 },
      "props": {
        "text": "Red Bull Zero",
        "variant": "heading",
        "fontSize": 7,
        "fontWeight": "700",
        "color": "#1a1a2e",
        "textAlign": "center",
        "lineHeight": 1.2
      }
    },
    "rb-oth-sub-1": {
      "id": "rb-oth-sub-1",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 30, "y": 1111, "width": 102, "height": 11,
        "rotation": 0 },
      "props": {
        "text": "Zero calories",
        "variant": "paragraph",
        "fontSize": 6,
        "color": "#6b7280",
        "textAlign": "center",
        "lineHeight": 1.3
      }
    },
    "rb-oth-card-2": {
      "id": "rb-oth-card-2",
      "type": "card",
      "zIndex": 2,
      "locked": true,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 152, "y": 1013, "width": 124, "height": 124,
        "rotation": 0 },
      "props": {
        "bgColor": "#dbeafe",
        "borderRadius": 7,
        "shadow": "md",
        "borderWidth": 0,
        "borderColor": "transparent",
        "padding": 0
      }
    },
    "rb-oth-img-2": {
      "id": "rb-oth-img-2",
      "type": "image",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 169, "y": 1018, "width": 89, "height": 72,
        "rotation": 0 },
      "props": {
        "src": "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=400&q=80",
        "alt": "Sugar-free",
        "objectFit": "contain",
        "borderRadius": 3
      }
    },
    "rb-oth-name-2": {
      "id": "rb-oth-name-2",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 163, "y": 1096, "width": 102, "height": 11,
        "rotation": 0 },
      "props": {
        "text": "Sugar-free",
        "variant": "heading",
        "fontSize": 7,
        "fontWeight": "700",
        "color": "#1a1a2e",
        "textAlign": "center",
        "lineHeight": 1.2
      }
    },
    "rb-oth-sub-2": {
      "id": "rb-oth-sub-2",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 163, "y": 1111, "width": 102, "height": 11,
        "rotation": 0 },
      "props": {
        "text": "Sugar-free energy drink",
        "variant": "paragraph",
        "fontSize": 6,
        "color": "#6b7280",
        "textAlign": "center",
        "lineHeight": 1.3
      }
    },
    "rb-oth-card-3": {
      "id": "rb-oth-card-3",
      "type": "card",
      "zIndex": 2,
      "locked": true,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 285, "y": 1013, "width": 124, "height": 124,
        "rotation": 0 },
      "props": {
        "bgColor": "#fee2e2",
        "borderRadius": 7,
        "shadow": "md",
        "borderWidth": 0,
        "borderColor": "transparent",
        "padding": 0
      }
    },
    "rb-oth-img-3": {
      "id": "rb-oth-img-3",
      "type": "image",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 304, "y": 1018, "width": 89, "height": 72,
        "rotation": 0 },
      "props": {
        "src": "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=400&q=80",
        "alt": "Red Edition",
        "objectFit": "contain",
        "borderRadius": 3
      }
    },
    "rb-oth-name-3": {
      "id": "rb-oth-name-3",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 297, "y": 1096, "width": 102, "height": 11,
        "rotation": 0 },
      "props": {
        "text": "Red Edition",
        "variant": "heading",
        "fontSize": 7,
        "fontWeight": "700",
        "color": "#1a1a2e",
        "textAlign": "center",
        "lineHeight": 1.2
      }
    },
    "rb-oth-sub-3": {
      "id": "rb-oth-sub-3",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 297, "y": 1111, "width": 102, "height": 11,
        "rotation": 0 },
      "props": {
        "text": "Watermelon flavor",
        "variant": "paragraph",
        "fontSize": 6,
        "color": "#6b7280",
        "textAlign": "center",
        "lineHeight": 1.3
      }
    },
    "rb-view-all": {
      "id": "rb-view-all",
      "type": "button",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 18, "y": 1150, "width": 393, "height": 24,
        "rotation": 0 },
      "props": {
        "text": "View all",
        "variant": "outline",
        "bgColor": "#f8fafc",
        "textColor": "#6b7280",
        "borderRadius": 5,
        "fontSize": 7,
        "fontWeight": "600"
      }
    },
    "rb-foot-overlay": {
      "id": "rb-foot-overlay",
      "type": "container",
      "zIndex": 1,
      "locked": true,
      "visible": true,
      "opacity": 0.85,
      "transform": { "x": 0, "y": 1181, "width": 488, "height": 148,
        "rotation": 0 },
      "props": {
        "bgGradientFrom": "#1e40af",
        "bgGradientTo": "#1d4ed8"
      }
    },
    "rb-foot-msg": {
      "id": "rb-foot-msg",
      "type": "heading",
      "zIndex": 10,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 35, "y": 1212, "width": 357, "height": 41,
        "rotation": 0 },
      "props": {
        "text": "Giving wiiings to people & ideas since 1987",
        "variant": "heading",
        "fontSize": 13,
        "fontWeight": "800",
        "color": "#ffffff",
        "textAlign": "center",
        "lineHeight": 1.2
      }
    },
    "rb-foot-sub": {
      "id": "rb-foot-sub",
      "type": "text",
      "zIndex": 10,
      "locked": false,
      "visible": true,
      "opacity": 0.7,
      "transform": { "x": 119, "y": 1262, "width": 191, "height": 11,
        "rotation": 0 },
      "props": {
        "text": "Red Bull GmbH",
        "variant": "paragraph",
        "fontSize": 6,
        "color": "#ffffff",
        "textAlign": "center",
        "lineHeight": 1.3
      }
    },
    "rb-foot-logo": {
      "id": "rb-foot-logo",
      "type": "icon",
      "zIndex": 10,
      "locked": false,
      "visible": true,
      "opacity": 0.8,
      "transform": { "x": 193, "y": 1280, "width": 24, "height": 24,
        "rotation": 0 },
      "props": {
        "icon": "🐂",
        "fontSize": 13,
        "bgColor": "transparent",
        "borderRadius": 0
      }
    },
    "rb-foot-link": {
      "id": "rb-foot-link",
      "type": "text",
      "zIndex": 10,
      "locked": false,
      "visible": true,
      "opacity": 0.6,
      "transform": { "x": 143, "y": 1309, "width": 143, "height": 11,
        "rotation": 0 },
      "props": {
        "text": "🔗 store.redbull.com",
        "variant": "paragraph",
        "fontSize": 6,
        "fontWeight": "600",
        "color": "#ffffff",
        "textAlign": "center",
        "lineHeight": 1.3
      }
    }
  }
};

export const redbullShowcaseTemplate: Template = {
  meta: {
    id: "redbull-showcase",
    name: "Red Bull Showcase",
    description: "Dynamic energy drink product showcase with sporty dark navy/blue theme. Hero splash, variant selector, benefits, lifestyle banner, and product carousel.",
    category: "marketing",
    tags: ["beverage", "energy", "redbull", "product", "showcase"],
  },
  data: doc,
};
