/* ─────────────────────────────────────────────
 * Coca-Cola Showcase Template — Mobile-first canvas
 * ──────────────────────────────────────────── */

import type { CanvasDocument, Template } from "@productix/types";

const doc: CanvasDocument = {
  "version": 1,
  "pageTitle": "Coca-Cola Original Taste",
  "artboards": [
    {
      "id": "cc-hero-merged",
      "name": "Canvas",
      "width": 428,
      "height": 1167,
      "backgroundColor": "#7f1d1d",
      "backgroundImage": "https://images.unsplash.com/photo-1581098365948-6a5a912b7a49?w=1600&q=80",
      "position": 0,
      "elements": [
        "cc-hero-overlay",
        "cc-hero-lang",
        "cc-hero-img",
        "cc-logo-icon",
        "cc-logo-text",
        "cc-product-name",
        "cc-var-1",
        "cc-var-2",
        "cc-var-3",
        "cc-var-4",
        "cc-tagline",
        "cc-cta",
        "cc-social-group",
        "cc-about-card",
        "cc-about-title",
        "cc-about-text",
        "cc-about-more",
        "cc-feat-title",
        "cc-feat-card-1",
        "cc-feat-icon-1",
        "cc-feat-text-1",
        "cc-feat-card-2",
        "cc-feat-icon-2",
        "cc-feat-text-2",
        "cc-feat-card-3",
        "cc-feat-icon-3",
        "cc-feat-text-3",
        "cc-dl-card",
        "cc-dl-title",
        "cc-dl-desc",
        "cc-life-overlay",
        "cc-life-text",
        "cc-oth-title",
        "cc-oth-card-1",
        "cc-oth-img-1",
        "cc-oth-name-1",
        "cc-oth-sub-1",
        "cc-oth-card-2",
        "cc-oth-img-2",
        "cc-oth-name-2",
        "cc-oth-sub-2",
        "cc-view-all",
        "cc-foot-overlay",
        "cc-foot-msg",
        "cc-foot-sub",
        "cc-foot-logo",
        "cc-foot-link"
      ]
    }
  ],
  "elements": {
    "cc-hero-overlay": {
      "id": "cc-hero-overlay",
      "type": "container",
      "zIndex": 1,
      "locked": true,
      "visible": true,
      "opacity": 0.7,
      "transform": { "x": 0, "y": 0, "width": 488, "height": 244,
        "rotation": 0 },
      "props": {
        "bgGradientFrom": "#7f1d1d",
        "bgGradientTo": "#dc2626"
      }
    },
    "cc-hero-lang": {
      "id": "cc-hero-lang",
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
    "cc-hero-img": {
      "id": "cc-hero-img",
      "type": "image",
      "zIndex": 10,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 80, "y": 30, "width": 267, "height": 196,
        "rotation": 0 },
      "props": {
        "src": "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=800&q=90",
        "alt": "Coca-Cola Can",
        "objectFit": "contain",
        "borderRadius": 0
      }
    },
    "cc-logo-icon": {
      "id": "cc-logo-icon",
      "type": "icon",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 24, "y": 261, "width": 30, "height": 30,
        "rotation": 0 },
      "props": {
        "icon": "🥤",
        "fontSize": 16,
        "bgColor": "transparent",
        "borderRadius": 0
      }
    },
    "cc-logo-text": {
      "id": "cc-logo-text",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 56, "y": 266, "width": 119, "height": 21,
        "rotation": 0 },
      "props": {
        "text": "Coca-Cola",
        "variant": "heading",
        "fontSize": 9,
        "fontWeight": "800",
        "color": "#dc2626",
        "textAlign": "left",
        "lineHeight": 1.2
      }
    },
    "cc-product-name": {
      "id": "cc-product-name",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 24, "y": 297, "width": 380, "height": 24,
        "rotation": 0 },
      "props": {
        "text": "Coca-Cola Original Taste",
        "variant": "heading",
        "fontSize": 13,
        "fontWeight": "800",
        "color": "#1a1a1a",
        "textAlign": "left",
        "lineHeight": 1.2
      }
    },
    "cc-var-1": {
      "id": "cc-var-1",
      "type": "button",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 24, "y": 333, "width": 72, "height": 24,
        "rotation": 0 },
      "props": {
        "text": "250 ml",
        "variant": "outline",
        "bgColor": "#fff5f5",
        "textColor": "#6b7280",
        "borderRadius": 4,
        "fontSize": 7,
        "fontWeight": "600"
      }
    },
    "cc-var-2": {
      "id": "cc-var-2",
      "type": "button",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 104, "y": 333, "width": 72, "height": 24,
        "rotation": 0 },
      "props": {
        "text": "330 ml",
        "variant": "filled",
        "bgColor": "#dc2626",
        "textColor": "#ffffff",
        "borderRadius": 4,
        "fontSize": 7,
        "fontWeight": "600"
      }
    },
    "cc-var-3": {
      "id": "cc-var-3",
      "type": "button",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 184, "y": 333, "width": 72, "height": 24,
        "rotation": 0 },
      "props": {
        "text": "500 ml",
        "variant": "outline",
        "bgColor": "#fff5f5",
        "textColor": "#6b7280",
        "borderRadius": 4,
        "fontSize": 7,
        "fontWeight": "600"
      }
    },
    "cc-var-4": {
      "id": "cc-var-4",
      "type": "button",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 265, "y": 333, "width": 72, "height": 24,
        "rotation": 0 },
      "props": {
        "text": "1.5 L",
        "variant": "outline",
        "bgColor": "#fff5f5",
        "textColor": "#6b7280",
        "borderRadius": 4,
        "fontSize": 7,
        "fontWeight": "600"
      }
    },
    "cc-tagline": {
      "id": "cc-tagline",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 24, "y": 368, "width": 357, "height": 35,
        "rotation": 0 },
      "props": {
        "text": "Taste the feeling. The world's most iconic beverage — unchanged and unmatched since 1886.",
        "variant": "paragraph",
        "fontSize": 8,
        "color": "#6b7280",
        "textAlign": "left",
        "lineHeight": 1.6
      }
    },
    "cc-cta": {
      "id": "cc-cta",
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
        "bgColor": "#dc2626",
        "textColor": "#ffffff",
        "borderRadius": 6,
        "fontSize": 8,
        "fontWeight": "600"
      }
    },
    "cc-social-group": {
      "id": "cc-social-group",
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
        "iconColor": "#dc2626",
        "iconBg": "#fef2f2",
        "borderRadius": 260
      }
    },
    "cc-about-card": {
      "id": "cc-about-card",
      "type": "card",
      "zIndex": 2,
      "locked": true,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 18, "y": 529, "width": 393, "height": 124,
        "rotation": 0 },
      "props": {
        "bgColor": "#fff5f5",
        "borderRadius": 8,
        "shadow": "md",
        "borderWidth": 1,
        "borderColor": "#fecaca",
        "padding": 0
      }
    },
    "cc-about-title": {
      "id": "cc-about-title",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 35, "y": 541, "width": 357, "height": 18,
        "rotation": 0 },
      "props": {
        "text": "About Coca-Cola",
        "variant": "heading",
        "fontSize": 8,
        "fontWeight": "700",
        "color": "#1a1a1a",
        "textAlign": "left",
        "lineHeight": 1.3
      }
    },
    "cc-about-text": {
      "id": "cc-about-text",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 35, "y": 564, "width": 357, "height": 59,
        "rotation": 0 },
      "props": {
        "text": "Coca-Cola, introduced in 1886, is the world's favorite sparkling beverage. Made with a secret formula that has remained largely unchanged for over a century. Available in more than 200 countries, Coca-Cola is more than a drink — it's a symbol of happiness and togetherness.",
        "variant": "paragraph",
        "fontSize": 7,
        "color": "#6b7280",
        "textAlign": "left",
        "lineHeight": 1.7
      }
    },
    "cc-about-more": {
      "id": "cc-about-more",
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
    "cc-feat-title": {
      "id": "cc-feat-title",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 24, "y": 683, "width": 208, "height": 15,
        "rotation": 0 },
      "props": {
        "text": "What Makes It Special",
        "variant": "heading",
        "fontSize": 7,
        "fontWeight": "700",
        "color": "#1a1a1a",
        "textAlign": "left",
        "lineHeight": 1.2
      }
    },
    "cc-feat-card-1": {
      "id": "cc-feat-card-1",
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
        "borderColor": "#fecaca",
        "padding": 0
      }
    },
    "cc-feat-icon-1": {
      "id": "cc-feat-icon-1",
      "type": "icon",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 30, "y": 709, "width": 18, "height": 18,
        "rotation": 0 },
      "props": {
        "icon": "⭐",
        "fontSize": 8,
        "bgColor": "transparent",
        "borderRadius": 0
      }
    },
    "cc-feat-text-1": {
      "id": "cc-feat-text-1",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 54, "y": 712, "width": 178, "height": 15,
        "rotation": 0 },
      "props": {
        "text": "Original recipe since 1886",
        "variant": "paragraph",
        "fontSize": 7,
        "fontWeight": "600",
        "color": "#1a1a1a",
        "textAlign": "left",
        "lineHeight": 1.4
      }
    },
    "cc-feat-card-2": {
      "id": "cc-feat-card-2",
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
        "borderColor": "#fecaca",
        "padding": 0
      }
    },
    "cc-feat-icon-2": {
      "id": "cc-feat-icon-2",
      "type": "icon",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 30, "y": 746, "width": 18, "height": 18,
        "rotation": 0 },
      "props": {
        "icon": "🎉",
        "fontSize": 8,
        "bgColor": "transparent",
        "borderRadius": 0
      }
    },
    "cc-feat-text-2": {
      "id": "cc-feat-text-2",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 54, "y": 747, "width": 178, "height": 15,
        "rotation": 0 },
      "props": {
        "text": "Moments of happiness",
        "variant": "paragraph",
        "fontSize": 7,
        "fontWeight": "600",
        "color": "#1a1a1a",
        "textAlign": "left",
        "lineHeight": 1.4
      }
    },
    "cc-feat-card-3": {
      "id": "cc-feat-card-3",
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
        "borderColor": "#fecaca",
        "padding": 0
      }
    },
    "cc-feat-icon-3": {
      "id": "cc-feat-icon-3",
      "type": "icon",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 30, "y": 781, "width": 18, "height": 18,
        "rotation": 0 },
      "props": {
        "icon": "🌍",
        "fontSize": 8,
        "bgColor": "transparent",
        "borderRadius": 0
      }
    },
    "cc-feat-text-3": {
      "id": "cc-feat-text-3",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 54, "y": 782, "width": 178, "height": 15,
        "rotation": 0 },
      "props": {
        "text": "Available in 200+ countries",
        "variant": "paragraph",
        "fontSize": 7,
        "fontWeight": "600",
        "color": "#1a1a1a",
        "textAlign": "left",
        "lineHeight": 1.4
      }
    },
    "cc-dl-card": {
      "id": "cc-dl-card",
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
        "borderColor": "#fecaca",
        "padding": 0
      }
    },
    "cc-dl-title": {
      "id": "cc-dl-title",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 297, "y": 731, "width": 95, "height": 15,
        "rotation": 0 },
      "props": {
        "text": "📋 Brand story",
        "variant": "heading",
        "fontSize": 7,
        "fontWeight": "700",
        "color": "#1a1a1a",
        "textAlign": "center",
        "lineHeight": 1.3
      }
    },
    "cc-dl-desc": {
      "id": "cc-dl-desc",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 297, "y": 752, "width": 95, "height": 24,
        "rotation": 0 },
      "props": {
        "text": "12 pages\n3.2 MB",
        "variant": "paragraph",
        "fontSize": 6,
        "color": "#9ca3af",
        "textAlign": "center",
        "lineHeight": 1.5
      }
    },
    "cc-life-overlay": {
      "id": "cc-life-overlay",
      "type": "container",
      "zIndex": 1,
      "locked": true,
      "visible": true,
      "opacity": 0.55,
      "transform": { "x": 0, "y": 826, "width": 488, "height": 148,
        "rotation": 0 },
      "props": {
        "bgGradientFrom": "transparent",
        "bgGradientTo": "#7f1d1d"
      }
    },
    "cc-life-text": {
      "id": "cc-life-text",
      "type": "heading",
      "zIndex": 10,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 24, "y": 933, "width": 297, "height": 30,
        "rotation": 0 },
      "props": {
        "text": "Open happiness, share the moment",
        "variant": "heading",
        "fontSize": 9,
        "fontWeight": "700",
        "color": "#ffffff",
        "textAlign": "left",
        "lineHeight": 1.3
      }
    },
    "cc-oth-title": {
      "id": "cc-oth-title",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 24, "y": 986, "width": 267, "height": 18,
        "rotation": 0 },
      "props": {
        "text": "More Coca-Cola Products",
        "variant": "heading",
        "fontSize": 8,
        "fontWeight": "700",
        "color": "#1a1a1a",
        "textAlign": "left",
        "lineHeight": 1.2
      }
    },
    "cc-oth-card-1": {
      "id": "cc-oth-card-1",
      "type": "card",
      "zIndex": 2,
      "locked": true,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 18, "y": 1013, "width": 184, "height": 124,
        "rotation": 0 },
      "props": {
        "bgColor": "#1a1a1a",
        "borderRadius": 7,
        "shadow": "md",
        "borderWidth": 0,
        "borderColor": "transparent",
        "padding": 0
      }
    },
    "cc-oth-img-1": {
      "id": "cc-oth-img-1",
      "type": "image",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 54, "y": 1018, "width": 113, "height": 72,
        "rotation": 0 },
      "props": {
        "src": "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&q=80",
        "alt": "Coca-Cola Zero",
        "objectFit": "contain",
        "borderRadius": 3
      }
    },
    "cc-oth-name-1": {
      "id": "cc-oth-name-1",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 30, "y": 1096, "width": 161, "height": 11,
        "rotation": 0 },
      "props": {
        "text": "Coca-Cola Zero Sugar",
        "variant": "heading",
        "fontSize": 7,
        "fontWeight": "700",
        "color": "#ffffff",
        "textAlign": "center",
        "lineHeight": 1.2
      }
    },
    "cc-oth-sub-1": {
      "id": "cc-oth-sub-1",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 30, "y": 1111, "width": 161, "height": 11,
        "rotation": 0 },
      "props": {
        "text": "Zero sugar, same taste",
        "variant": "paragraph",
        "fontSize": 6,
        "color": "#9ca3af",
        "textAlign": "center",
        "lineHeight": 1.3
      }
    },
    "cc-oth-card-2": {
      "id": "cc-oth-card-2",
      "type": "card",
      "zIndex": 2,
      "locked": true,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 215, "y": 1013, "width": 184, "height": 124,
        "rotation": 0 },
      "props": {
        "bgColor": "#e5e7eb",
        "borderRadius": 7,
        "shadow": "md",
        "borderWidth": 0,
        "borderColor": "transparent",
        "padding": 0
      }
    },
    "cc-oth-img-2": {
      "id": "cc-oth-img-2",
      "type": "image",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 250, "y": 1018, "width": 113, "height": 72,
        "rotation": 0 },
      "props": {
        "src": "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&q=80",
        "alt": "Diet Coke",
        "objectFit": "contain",
        "borderRadius": 3
      }
    },
    "cc-oth-name-2": {
      "id": "cc-oth-name-2",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 226, "y": 1096, "width": 161, "height": 11,
        "rotation": 0 },
      "props": {
        "text": "Diet Coke",
        "variant": "heading",
        "fontSize": 7,
        "fontWeight": "700",
        "color": "#1a1a1a",
        "textAlign": "center",
        "lineHeight": 1.2
      }
    },
    "cc-oth-sub-2": {
      "id": "cc-oth-sub-2",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 226, "y": 1111, "width": 161, "height": 11,
        "rotation": 0 },
      "props": {
        "text": "Light & refreshing",
        "variant": "paragraph",
        "fontSize": 6,
        "color": "#6b7280",
        "textAlign": "center",
        "lineHeight": 1.3
      }
    },
    "cc-view-all": {
      "id": "cc-view-all",
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
        "bgColor": "#fff5f5",
        "textColor": "#6b7280",
        "borderRadius": 5,
        "fontSize": 7,
        "fontWeight": "600"
      }
    },
    "cc-foot-overlay": {
      "id": "cc-foot-overlay",
      "type": "container",
      "zIndex": 1,
      "locked": true,
      "visible": true,
      "opacity": 0.9,
      "transform": { "x": 0, "y": 1181, "width": 488, "height": 148,
        "rotation": 0 },
      "props": {
        "bgGradientFrom": "#dc2626",
        "bgGradientTo": "#b91c1c"
      }
    },
    "cc-foot-msg": {
      "id": "cc-foot-msg",
      "type": "heading",
      "zIndex": 10,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 35, "y": 1212, "width": 357, "height": 41,
        "rotation": 0 },
      "props": {
        "text": "Taste The Feeling Since 1886",
        "variant": "heading",
        "fontSize": 13,
        "fontWeight": "800",
        "color": "#ffffff",
        "textAlign": "center",
        "lineHeight": 1.2
      }
    },
    "cc-foot-sub": {
      "id": "cc-foot-sub",
      "type": "text",
      "zIndex": 10,
      "locked": false,
      "visible": true,
      "opacity": 0.7,
      "transform": { "x": 119, "y": 1262, "width": 191, "height": 11,
        "rotation": 0 },
      "props": {
        "text": "The Coca-Cola Company",
        "variant": "paragraph",
        "fontSize": 6,
        "color": "#ffffff",
        "textAlign": "center",
        "lineHeight": 1.3
      }
    },
    "cc-foot-logo": {
      "id": "cc-foot-logo",
      "type": "icon",
      "zIndex": 10,
      "locked": false,
      "visible": true,
      "opacity": 0.8,
      "transform": { "x": 193, "y": 1280, "width": 24, "height": 24,
        "rotation": 0 },
      "props": {
        "icon": "🥤",
        "fontSize": 13,
        "bgColor": "transparent",
        "borderRadius": 0
      }
    },
    "cc-foot-link": {
      "id": "cc-foot-link",
      "type": "text",
      "zIndex": 10,
      "locked": false,
      "visible": true,
      "opacity": 0.6,
      "transform": { "x": 143, "y": 1309, "width": 143, "height": 11,
        "rotation": 0 },
      "props": {
        "text": "🔗 coca-cola.com",
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

export const cocacolaShowcaseTemplate: Template = {
  meta: { id: "cocacola-showcase", name: "Coca-Cola Showcase", description: "Classic bold red Coca-Cola product showcase with nostalgic iconic theme.", category: "marketing", tags: ["beverage", "cocacola", "classic", "product", "showcase"] },
  data: doc,
};
