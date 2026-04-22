/* ─────────────────────────────────────────────
 * Beer Premium Showcase Template — Mobile-first canvas
 * ──────────────────────────────────────────── */

import type { CanvasDocument, Template } from "@productix/types";

const doc: CanvasDocument = {
  "version": 1,
  "pageTitle": "Golden Reserve Premium Lager",
  "artboards": [
    {
      "id": "br-hero-merged",
      "name": "Canvas",
      "width": 428,
      "height": 1167,
      "backgroundColor": "#0a0a0a",
      "backgroundImage": "https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=1600&q=80",
      "position": 0,
      "elements": [
        "br-hero-overlay",
        "br-hero-lang",
        "br-hero-img",
        "br-logo-icon",
        "br-logo-text",
        "br-product-name",
        "br-var-1",
        "br-var-2",
        "br-var-3",
        "br-tagline",
        "br-cta",
        "br-social-group",
        "br-about-card",
        "br-about-title",
        "br-about-text",
        "br-about-more",
        "br-feat-title",
        "br-feat-card-1",
        "br-feat-icon-1",
        "br-feat-text-1",
        "br-feat-card-2",
        "br-feat-icon-2",
        "br-feat-text-2",
        "br-feat-card-3",
        "br-feat-icon-3",
        "br-feat-text-3",
        "br-dl-card",
        "br-dl-title",
        "br-dl-desc",
        "br-life-overlay",
        "br-life-text",
        "br-oth-title",
        "br-oth-card-1",
        "br-oth-img-1",
        "br-oth-name-1",
        "br-oth-sub-1",
        "br-oth-card-2",
        "br-oth-img-2",
        "br-oth-name-2",
        "br-oth-sub-2",
        "br-view-all",
        "br-foot-overlay",
        "br-foot-msg",
        "br-foot-sub",
        "br-foot-logo",
        "br-foot-link"
      ]
    }
  ],
  "elements": {
    "br-hero-overlay": {
      "id": "br-hero-overlay",
      "type": "container",
      "zIndex": 1,
      "locked": true,
      "visible": true,
      "opacity": 0.75,
      "transform": { "x": 0, "y": 0, "width": 488, "height": 244,
        "rotation": 0 },
      "props": {
        "bgGradientFrom": "#0a0a0a",
        "bgGradientTo": "#2a1f0e"
      }
    },
    "br-hero-lang": {
      "id": "br-hero-lang",
      "type": "badge",
      "zIndex": 10,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 339, "y": 11, "width": 65, "height": 18,
        "rotation": 0 },
      "props": {
        "text": "English ▾",
        "bgColor": "rgba(212,168,67,0.2)",
        "textColor": "#d4a843",
        "borderRadius": 260,
        "fontSize": 6,
        "fontWeight": "500"
      }
    },
    "br-hero-img": {
      "id": "br-hero-img",
      "type": "image",
      "zIndex": 10,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 95, "y": 24, "width": 237, "height": 202,
        "rotation": 0 },
      "props": {
        "src": "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&q=90",
        "alt": "Beer Bottle",
        "objectFit": "contain",
        "borderRadius": 0
      }
    },
    "br-logo-icon": {
      "id": "br-logo-icon",
      "type": "icon",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 24, "y": 261, "width": 30, "height": 30,
        "rotation": 0 },
      "props": {
        "icon": "🍺",
        "fontSize": 16,
        "bgColor": "transparent",
        "borderRadius": 0
      }
    },
    "br-logo-text": {
      "id": "br-logo-text",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 56, "y": 266, "width": 148, "height": 21,
        "rotation": 0 },
      "props": {
        "text": "Golden Reserve",
        "variant": "heading",
        "fontSize": 9,
        "fontWeight": "800",
        "color": "#d4a843",
        "textAlign": "left",
        "lineHeight": 1.2
      }
    },
    "br-product-name": {
      "id": "br-product-name",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 24, "y": 297, "width": 380, "height": 24,
        "rotation": 0 },
      "props": {
        "text": "Golden Reserve Premium Lager",
        "variant": "heading",
        "fontSize": 12,
        "fontWeight": "800",
        "color": "#f5f0e8",
        "textAlign": "left",
        "lineHeight": 1.2
      }
    },
    "br-var-1": {
      "id": "br-var-1",
      "type": "button",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 24, "y": 333, "width": 83, "height": 24,
        "rotation": 0 },
      "props": {
        "text": "330 ml",
        "variant": "filled",
        "bgColor": "#d4a843",
        "textColor": "#0a0a0a",
        "borderRadius": 4,
        "fontSize": 7,
        "fontWeight": "600"
      }
    },
    "br-var-2": {
      "id": "br-var-2",
      "type": "button",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 116, "y": 333, "width": 83, "height": 24,
        "rotation": 0 },
      "props": {
        "text": "500 ml",
        "variant": "outline",
        "bgColor": "#1e1e1e",
        "textColor": "#9ca3af",
        "borderRadius": 4,
        "fontSize": 7,
        "fontWeight": "600"
      }
    },
    "br-var-3": {
      "id": "br-var-3",
      "type": "button",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 208, "y": 333, "width": 83, "height": 24,
        "rotation": 0 },
      "props": {
        "text": "650 ml",
        "variant": "outline",
        "bgColor": "#1e1e1e",
        "textColor": "#9ca3af",
        "borderRadius": 4,
        "fontSize": 7,
        "fontWeight": "600"
      }
    },
    "br-tagline": {
      "id": "br-tagline",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 24, "y": 368, "width": 357, "height": 35,
        "rotation": 0 },
      "props": {
        "text": "Crafted with precision. A distinguished premium lager brewed with the finest imported hops and mountain spring water.",
        "variant": "paragraph",
        "fontSize": 8,
        "color": "#9ca3af",
        "textAlign": "left",
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
      "transform": { "x": 24, "y": 416, "width": 380, "height": 30,
        "rotation": 0 },
      "props": {
        "text": "💬  Feedback / Inquiry",
        "variant": "filled",
        "bgColor": "#d4a843",
        "textColor": "#0a0a0a",
        "borderRadius": 6,
        "fontSize": 8,
        "fontWeight": "600"
      }
    },
    "br-social-group": {
      "id": "br-social-group",
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
        "iconColor": "#d4a843",
        "iconBg": "#1e1e1e",
        "borderRadius": 260
      }
    },
    "br-about-card": {
      "id": "br-about-card",
      "type": "card",
      "zIndex": 2,
      "locked": true,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 18, "y": 529, "width": 393, "height": 124,
        "rotation": 0 },
      "props": {
        "bgColor": "#1e1e1e",
        "borderRadius": 8,
        "shadow": "lg",
        "borderWidth": 1,
        "borderColor": "#2a2a2a",
        "padding": 0
      }
    },
    "br-about-title": {
      "id": "br-about-title",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 35, "y": 541, "width": 357, "height": 18,
        "rotation": 0 },
      "props": {
        "text": "About Golden Reserve",
        "variant": "heading",
        "fontSize": 8,
        "fontWeight": "700",
        "color": "#f5f0e8",
        "textAlign": "left",
        "lineHeight": 1.3
      }
    },
    "br-about-text": {
      "id": "br-about-text",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 35, "y": 564, "width": 357, "height": 59,
        "rotation": 0 },
      "props": {
        "text": "Golden Reserve is a premium lager crafted for the discerning palate. Brewed using traditional methods with the finest selected barley, imported Saaz hops, and crystal-clear mountain spring water. Aged slowly in controlled conditions for a golden clarity and smooth finish.",
        "variant": "paragraph",
        "fontSize": 7,
        "color": "#9ca3af",
        "textAlign": "left",
        "lineHeight": 1.7
      }
    },
    "br-about-more": {
      "id": "br-about-more",
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
        "textColor": "#9ca3af",
        "borderRadius": 0,
        "fontSize": 7,
        "fontWeight": "600"
      }
    },
    "br-feat-title": {
      "id": "br-feat-title",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 24, "y": 683, "width": 178, "height": 15,
        "rotation": 0 },
      "props": {
        "text": "Craftsmanship",
        "variant": "heading",
        "fontSize": 7,
        "fontWeight": "700",
        "color": "#d4a843",
        "textAlign": "left",
        "lineHeight": 1.2
      }
    },
    "br-feat-card-1": {
      "id": "br-feat-card-1",
      "type": "card",
      "zIndex": 2,
      "locked": true,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 18, "y": 704, "width": 250, "height": 30,
        "rotation": 0 },
      "props": {
        "bgColor": "#1e1e1e",
        "borderRadius": 5,
        "shadow": "sm",
        "borderWidth": 1,
        "borderColor": "#2a2a2a",
        "padding": 0
      }
    },
    "br-feat-icon-1": {
      "id": "br-feat-icon-1",
      "type": "icon",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 30, "y": 709, "width": 18, "height": 18,
        "rotation": 0 },
      "props": {
        "icon": "🏅",
        "fontSize": 8,
        "bgColor": "transparent",
        "borderRadius": 0
      }
    },
    "br-feat-text-1": {
      "id": "br-feat-text-1",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 54, "y": 712, "width": 178, "height": 15,
        "rotation": 0 },
      "props": {
        "text": "Award-winning brew",
        "variant": "paragraph",
        "fontSize": 7,
        "fontWeight": "600",
        "color": "#f5f0e8",
        "textAlign": "left",
        "lineHeight": 1.4
      }
    },
    "br-feat-card-2": {
      "id": "br-feat-card-2",
      "type": "card",
      "zIndex": 2,
      "locked": true,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 18, "y": 739, "width": 250, "height": 30,
        "rotation": 0 },
      "props": {
        "bgColor": "#1e1e1e",
        "borderRadius": 5,
        "shadow": "sm",
        "borderWidth": 1,
        "borderColor": "#2a2a2a",
        "padding": 0
      }
    },
    "br-feat-icon-2": {
      "id": "br-feat-icon-2",
      "type": "icon",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 30, "y": 746, "width": 18, "height": 18,
        "rotation": 0 },
      "props": {
        "icon": "🌾",
        "fontSize": 8,
        "bgColor": "transparent",
        "borderRadius": 0
      }
    },
    "br-feat-text-2": {
      "id": "br-feat-text-2",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 54, "y": 747, "width": 178, "height": 15,
        "rotation": 0 },
      "props": {
        "text": "Premium ingredients",
        "variant": "paragraph",
        "fontSize": 7,
        "fontWeight": "600",
        "color": "#f5f0e8",
        "textAlign": "left",
        "lineHeight": 1.4
      }
    },
    "br-feat-card-3": {
      "id": "br-feat-card-3",
      "type": "card",
      "zIndex": 2,
      "locked": true,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 18, "y": 775, "width": 250, "height": 30,
        "rotation": 0 },
      "props": {
        "bgColor": "#1e1e1e",
        "borderRadius": 5,
        "shadow": "sm",
        "borderWidth": 1,
        "borderColor": "#2a2a2a",
        "padding": 0
      }
    },
    "br-feat-icon-3": {
      "id": "br-feat-icon-3",
      "type": "icon",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 30, "y": 781, "width": 18, "height": 18,
        "rotation": 0 },
      "props": {
        "icon": "🏔️",
        "fontSize": 8,
        "bgColor": "transparent",
        "borderRadius": 0
      }
    },
    "br-feat-text-3": {
      "id": "br-feat-text-3",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 54, "y": 782, "width": 178, "height": 15,
        "rotation": 0 },
      "props": {
        "text": "Mountain spring water",
        "variant": "paragraph",
        "fontSize": 7,
        "fontWeight": "600",
        "color": "#f5f0e8",
        "textAlign": "left",
        "lineHeight": 1.4
      }
    },
    "br-dl-card": {
      "id": "br-dl-card",
      "type": "card",
      "zIndex": 2,
      "locked": true,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 280, "y": 704, "width": 131, "height": 101,
        "rotation": 0 },
      "props": {
        "bgColor": "#1e1e1e",
        "borderRadius": 6,
        "shadow": "md",
        "borderWidth": 1,
        "borderColor": "#2a2a2a",
        "padding": 0
      }
    },
    "br-dl-title": {
      "id": "br-dl-title",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 297, "y": 731, "width": 95, "height": 15,
        "rotation": 0 },
      "props": {
        "text": "📖 Tasting guide",
        "variant": "heading",
        "fontSize": 7,
        "fontWeight": "700",
        "color": "#d4a843",
        "textAlign": "center",
        "lineHeight": 1.3
      }
    },
    "br-dl-desc": {
      "id": "br-dl-desc",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 297, "y": 752, "width": 95, "height": 24,
        "rotation": 0 },
      "props": {
        "text": "8 pages\n1.8 MB",
        "variant": "paragraph",
        "fontSize": 6,
        "color": "#9ca3af",
        "textAlign": "center",
        "lineHeight": 1.5
      }
    },
    "br-life-overlay": {
      "id": "br-life-overlay",
      "type": "container",
      "zIndex": 1,
      "locked": true,
      "visible": true,
      "opacity": 0.65,
      "transform": { "x": 0, "y": 826, "width": 488, "height": 148,
        "rotation": 0 },
      "props": {
        "bgGradientFrom": "transparent",
        "bgGradientTo": "#0a0a0a"
      }
    },
    "br-life-text": {
      "id": "br-life-text",
      "type": "heading",
      "zIndex": 10,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 24, "y": 939, "width": 267, "height": 24,
        "rotation": 0 },
      "props": {
        "text": "Elevate the evening",
        "variant": "heading",
        "fontSize": 9,
        "fontWeight": "700",
        "color": "#d4a843",
        "textAlign": "left",
        "lineHeight": 1.3
      }
    },
    "br-oth-title": {
      "id": "br-oth-title",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 24, "y": 986, "width": 237, "height": 18,
        "rotation": 0 },
      "props": {
        "text": "The Collection",
        "variant": "heading",
        "fontSize": 8,
        "fontWeight": "700",
        "color": "#d4a843",
        "textAlign": "left",
        "lineHeight": 1.2
      }
    },
    "br-oth-card-1": {
      "id": "br-oth-card-1",
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
        "borderWidth": 1,
        "borderColor": "#2a2a2a",
        "padding": 0
      }
    },
    "br-oth-img-1": {
      "id": "br-oth-img-1",
      "type": "image",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 54, "y": 1018, "width": 113, "height": 72,
        "rotation": 0 },
      "props": {
        "src": "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&q=80",
        "alt": "Dark Reserve",
        "objectFit": "contain",
        "borderRadius": 3
      }
    },
    "br-oth-name-1": {
      "id": "br-oth-name-1",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 30, "y": 1096, "width": 161, "height": 11,
        "rotation": 0 },
      "props": {
        "text": "Dark Reserve Stout",
        "variant": "heading",
        "fontSize": 7,
        "fontWeight": "700",
        "color": "#f5f0e8",
        "textAlign": "center",
        "lineHeight": 1.2
      }
    },
    "br-oth-sub-1": {
      "id": "br-oth-sub-1",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 30, "y": 1111, "width": 161, "height": 11,
        "rotation": 0 },
      "props": {
        "text": "Rich dark stout",
        "variant": "paragraph",
        "fontSize": 6,
        "color": "#9ca3af",
        "textAlign": "center",
        "lineHeight": 1.3
      }
    },
    "br-oth-card-2": {
      "id": "br-oth-card-2",
      "type": "card",
      "zIndex": 2,
      "locked": true,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 215, "y": 1013, "width": 184, "height": 124,
        "rotation": 0 },
      "props": {
        "bgColor": "#2a1f0e",
        "borderRadius": 7,
        "shadow": "md",
        "borderWidth": 1,
        "borderColor": "#3a2f1e",
        "padding": 0
      }
    },
    "br-oth-img-2": {
      "id": "br-oth-img-2",
      "type": "image",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 250, "y": 1018, "width": 113, "height": 72,
        "rotation": 0 },
      "props": {
        "src": "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&q=80",
        "alt": "Wheat Gold",
        "objectFit": "contain",
        "borderRadius": 3
      }
    },
    "br-oth-name-2": {
      "id": "br-oth-name-2",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 226, "y": 1096, "width": 161, "height": 11,
        "rotation": 0 },
      "props": {
        "text": "Wheat Gold",
        "variant": "heading",
        "fontSize": 7,
        "fontWeight": "700",
        "color": "#d4a843",
        "textAlign": "center",
        "lineHeight": 1.2
      }
    },
    "br-oth-sub-2": {
      "id": "br-oth-sub-2",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 226, "y": 1111, "width": 161, "height": 11,
        "rotation": 0 },
      "props": {
        "text": "Premium wheat beer",
        "variant": "paragraph",
        "fontSize": 6,
        "color": "#9ca3af",
        "textAlign": "center",
        "lineHeight": 1.3
      }
    },
    "br-view-all": {
      "id": "br-view-all",
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
        "bgColor": "#1e1e1e",
        "textColor": "#d4a843",
        "borderRadius": 5,
        "fontSize": 7,
        "fontWeight": "600"
      }
    },
    "br-foot-overlay": {
      "id": "br-foot-overlay",
      "type": "container",
      "zIndex": 1,
      "locked": true,
      "visible": true,
      "opacity": 0.95,
      "transform": { "x": 0, "y": 1181, "width": 488, "height": 148,
        "rotation": 0 },
      "props": {
        "bgGradientFrom": "#2a1f0e",
        "bgGradientTo": "#0a0a0a"
      }
    },
    "br-foot-msg": {
      "id": "br-foot-msg",
      "type": "heading",
      "zIndex": 10,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": { "x": 30, "y": 1205, "width": 369, "height": 48,
        "rotation": 0 },
      "props": {
        "text": "Crafted for Those Who Appreciate the Finer Things",
        "variant": "heading",
        "fontSize": 11,
        "fontWeight": "800",
        "color": "#d4a843",
        "textAlign": "center",
        "lineHeight": 1.3
      }
    },
    "br-foot-sub": {
      "id": "br-foot-sub",
      "type": "text",
      "zIndex": 10,
      "locked": false,
      "visible": true,
      "opacity": 0.5,
      "transform": { "x": 119, "y": 1265, "width": 191, "height": 11,
        "rotation": 0 },
      "props": {
        "text": "Drink Responsibly. 21+",
        "variant": "paragraph",
        "fontSize": 6,
        "color": "#f5f0e8",
        "textAlign": "center",
        "lineHeight": 1.3
      }
    },
    "br-foot-logo": {
      "id": "br-foot-logo",
      "type": "icon",
      "zIndex": 10,
      "locked": false,
      "visible": true,
      "opacity": 0.7,
      "transform": { "x": 193, "y": 1283, "width": 24, "height": 24,
        "rotation": 0 },
      "props": {
        "icon": "🍺",
        "fontSize": 13,
        "bgColor": "transparent",
        "borderRadius": 0
      }
    },
    "br-foot-link": {
      "id": "br-foot-link",
      "type": "text",
      "zIndex": 10,
      "locked": false,
      "visible": true,
      "opacity": 0.4,
      "transform": { "x": 131, "y": 1309, "width": 167, "height": 11,
        "rotation": 0 },
      "props": {
        "text": "🔗 goldenreserve.com",
        "variant": "paragraph",
        "fontSize": 6,
        "fontWeight": "600",
        "color": "#d4a843",
        "textAlign": "center",
        "lineHeight": 1.3
      }
    }
  }
};

export const beerShowcaseTemplate: Template = {
  meta: { id: "beer-showcase", name: "Beer Premium Showcase", description: "Premium dark luxury beer showcase with gold accents and sophisticated mature styling.", category: "marketing", tags: ["beverage", "beer", "premium", "dark", "product", "showcase"] },
  data: doc,
};
