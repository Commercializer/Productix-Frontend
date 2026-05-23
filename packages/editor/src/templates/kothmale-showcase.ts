/* ─────────────────────────────────────────────
 * Kothmale Fresh Milk Template - Mobile-first canvas
 * ──────────────────────────────────────────── */

import type { CanvasDocument, Template } from "@productix/types";

const doc: CanvasDocument = {
  "version": 1,
  "pageTitle": "Kothmale Fresh Milk",
  "artboards": [
    {
      "id": "km-hero-merged",
      "name": "Canvas",
      "width": 428,
      "height": 1167,
      "backgroundColor": "#f0f9ff",
      "backgroundImage": "https://images.unsplash.com/photo-1530268729831-4b0b9e170218?w=1600&q=80",
      "position": 0,
      "elements": [
        "km-hero-overlay",
        "km-hero-lang",
        "km-hero-img",
        "km-logo-icon",
        "km-logo-text",
        "km-product-name",
        "km-var-1",
        "km-var-2",
        "km-var-3",
        "km-tagline",
        "km-cta",
        "km-social-group",
        "km-about-card",
        "km-about-title",
        "km-about-text",
        "km-about-more",
        "km-feat-title",
        "km-feat-card-1",
        "km-feat-icon-1",
        "km-feat-text-1",
        "km-feat-card-2",
        "km-feat-icon-2",
        "km-feat-text-2",
        "km-feat-card-3",
        "km-feat-icon-3",
        "km-feat-text-3",
        "km-dl-card",
        "km-dl-title",
        "km-dl-desc",
        "km-life-overlay",
        "km-life-text",
        "km-oth-title",
        "km-oth-card-1",
        "km-oth-img-1",
        "km-oth-name-1",
        "km-oth-sub-1",
        "km-oth-card-2",
        "km-oth-img-2",
        "km-oth-name-2",
        "km-oth-sub-2",
        "km-view-all",
        "km-foot-overlay",
        "km-foot-msg",
        "km-foot-sub",
        "km-foot-logo",
        "km-foot-link"
      ]
    }
  ],
  "elements": {
    "km-hero-overlay": {
      "id": "km-hero-overlay",
      "type": "container",
      "zIndex": 1,
      "locked": true,
      "visible": true,
      "opacity": 0.6,
      "transform": {
        "x": 0, "y": 0, "width": 488, "height": 244,
        "rotation": 0
      },
      "props": {
        "bgGradientFrom": "#f0f9ff",
        "bgGradientTo": "#bae6fd"
      }
    },
    "km-hero-lang": {
      "id": "km-hero-lang",
      "type": "badge",
      "zIndex": 10,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 339, "y": 11, "width": 65, "height": 18,
        "rotation": 0
      },
      "props": {
        "text": "English ▾",
        "bgColor": "rgba(0,0,0,0.08)",
        "textColor": "#0c4a6e",
        "borderRadius": 260,
        "fontSize": 6,
        "fontWeight": "500"
      }
    },
    "km-hero-img": {
      "id": "km-hero-img",
      "type": "image",
      "zIndex": 10,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 95, "y": 24, "width": 237, "height": 202,
        "rotation": 0
      },
      "props": {
        "src": "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&q=90",
        "alt": "Kothmale Fresh Milk",
        "objectFit": "contain",
        "borderRadius": 0
      }
    },
    "km-logo-icon": {
      "id": "km-logo-icon",
      "type": "icon",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 24, "y": 261, "width": 30, "height": 30,
        "rotation": 0
      },
      "props": {
        "icon": "🥛",
        "fontSize": 16,
        "bgColor": "transparent",
        "borderRadius": 0
      }
    },
    "km-logo-text": {
      "id": "km-logo-text",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 56, "y": 266, "width": 119, "height": 21,
        "rotation": 0
      },
      "props": {
        "text": "Kothmale",
        "variant": "heading",
        "fontSize": 9,
        "fontWeight": "800",
        "color": "#0284c7",
        "textAlign": "left",
        "lineHeight": 1.2
      }
    },
    "km-product-name": {
      "id": "km-product-name",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 24, "y": 297, "width": 380, "height": 24,
        "rotation": 0
      },
      "props": {
        "text": "Kothmale Fresh Milk",
        "variant": "heading",
        "fontSize": 14,
        "fontWeight": "800",
        "color": "#0c4a6e",
        "textAlign": "left",
        "lineHeight": 1.2
      }
    },
    "km-var-1": {
      "id": "km-var-1",
      "type": "button",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 24, "y": 333, "width": 78, "height": 24,
        "rotation": 0
      },
      "props": {
        "text": "200 ml",
        "variant": "outline",
        "bgColor": "#f0f9ff",
        "textColor": "#64748b",
        "borderRadius": 4,
        "fontSize": 7,
        "fontWeight": "600"
      }
    },
    "km-var-2": {
      "id": "km-var-2",
      "type": "button",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 110, "y": 333, "width": 78, "height": 24,
        "rotation": 0
      },
      "props": {
        "text": "500 ml",
        "variant": "filled",
        "bgColor": "#0284c7",
        "textColor": "#ffffff",
        "borderRadius": 4,
        "fontSize": 7,
        "fontWeight": "600"
      }
    },
    "km-var-3": {
      "id": "km-var-3",
      "type": "button",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 196, "y": 333, "width": 78, "height": 24,
        "rotation": 0
      },
      "props": {
        "text": "1 L",
        "variant": "outline",
        "bgColor": "#f0f9ff",
        "textColor": "#64748b",
        "borderRadius": 4,
        "fontSize": 7,
        "fontWeight": "600"
      }
    },
    "km-tagline": {
      "id": "km-tagline",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 24, "y": 368, "width": 357, "height": 35,
        "rotation": 0
      },
      "props": {
        "text": "Pure, farm-fresh goodness from the lush green hills of Sri Lanka. Rich in calcium and essential vitamins for your daily nutrition.",
        "variant": "paragraph",
        "fontSize": 8,
        "color": "#64748b",
        "textAlign": "left",
        "lineHeight": 1.6
      }
    },
    "km-cta": {
      "id": "km-cta",
      "type": "button",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 24, "y": 416, "width": 380, "height": 30,
        "rotation": 0
      },
      "props": {
        "text": "💬  Feedback / Inquiry",
        "variant": "filled",
        "bgColor": "#0284c7",
        "textColor": "#ffffff",
        "borderRadius": 6,
        "fontSize": 8,
        "fontWeight": "600"
      }
    },
    "km-social-group": {
      "id": "km-social-group",
      "type": "social-group",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 107, "y": 469, "width": 215, "height": 35,
        "rotation": 0
      },
      "props": {
        "platforms": [
          "twitter",
          "facebook",
          "instagram",
          "youtube"
        ],
        "iconSize": 21,
        "gap": 10,
        "iconColor": "#0284c7",
        "iconBg": "#f0f9ff",
        "borderRadius": 260
      }
    },
    "km-about-card": {
      "id": "km-about-card",
      "type": "card",
      "zIndex": 2,
      "locked": true,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 18, "y": 529, "width": 393, "height": 124,
        "rotation": 0
      },
      "props": {
        "bgColor": "#f0f9ff",
        "borderRadius": 8,
        "shadow": "md",
        "borderWidth": 1,
        "borderColor": "#bae6fd",
        "padding": 0
      }
    },
    "km-about-title": {
      "id": "km-about-title",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 35, "y": 541, "width": 357, "height": 18,
        "rotation": 0
      },
      "props": {
        "text": "About Kothmale Fresh Milk",
        "variant": "heading",
        "fontSize": 8,
        "fontWeight": "700",
        "color": "#0c4a6e",
        "textAlign": "left",
        "lineHeight": 1.3
      }
    },
    "km-about-text": {
      "id": "km-about-text",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 35, "y": 564, "width": 357, "height": 59,
        "rotation": 0
      },
      "props": {
        "text": "Kothmale is Sri Lanka's beloved dairy brand, delivering pure, farm-fresh milk straight from the lush green pastures of the central highlands. Every pack is sourced from trusted local dairy farmers, pasteurized under strict conditions, and packed with the natural goodness of calcium, vitamins, and protein.",
        "variant": "paragraph",
        "fontSize": 7,
        "color": "#64748b",
        "textAlign": "left",
        "lineHeight": 1.7
      }
    },
    "km-about-more": {
      "id": "km-about-more",
      "type": "button",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 35, "y": 629, "width": 357, "height": 18,
        "rotation": 0
      },
      "props": {
        "text": "Read more ▾",
        "variant": "outline",
        "bgColor": "transparent",
        "textColor": "#64748b",
        "borderRadius": 0,
        "fontSize": 7,
        "fontWeight": "600"
      }
    },
    "km-feat-title": {
      "id": "km-feat-title",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 24, "y": 683, "width": 178, "height": 15,
        "rotation": 0
      },
      "props": {
        "text": "Goodness Inside",
        "variant": "heading",
        "fontSize": 7,
        "fontWeight": "700",
        "color": "#0c4a6e",
        "textAlign": "left",
        "lineHeight": 1.2
      }
    },
    "km-feat-card-1": {
      "id": "km-feat-card-1",
      "type": "card",
      "zIndex": 2,
      "locked": true,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 18, "y": 704, "width": 250, "height": 30,
        "rotation": 0
      },
      "props": {
        "bgColor": "#ffffff",
        "borderRadius": 5,
        "shadow": "sm",
        "borderWidth": 1,
        "borderColor": "#bae6fd",
        "padding": 0
      }
    },
    "km-feat-icon-1": {
      "id": "km-feat-icon-1",
      "type": "icon",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 30, "y": 709, "width": 18, "height": 18,
        "rotation": 0
      },
      "props": {
        "icon": "🐄",
        "fontSize": 8,
        "bgColor": "transparent",
        "borderRadius": 0
      }
    },
    "km-feat-text-1": {
      "id": "km-feat-text-1",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 54, "y": 712, "width": 178, "height": 15,
        "rotation": 0
      },
      "props": {
        "text": "Farm fresh daily",
        "variant": "paragraph",
        "fontSize": 7,
        "fontWeight": "600",
        "color": "#0c4a6e",
        "textAlign": "left",
        "lineHeight": 1.4
      }
    },
    "km-feat-card-2": {
      "id": "km-feat-card-2",
      "type": "card",
      "zIndex": 2,
      "locked": true,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 18, "y": 739, "width": 250, "height": 30,
        "rotation": 0
      },
      "props": {
        "bgColor": "#ffffff",
        "borderRadius": 5,
        "shadow": "sm",
        "borderWidth": 1,
        "borderColor": "#bae6fd",
        "padding": 0
      }
    },
    "km-feat-icon-2": {
      "id": "km-feat-icon-2",
      "type": "icon",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 30, "y": 746, "width": 18, "height": 18,
        "rotation": 0
      },
      "props": {
        "icon": "💪",
        "fontSize": 8,
        "bgColor": "transparent",
        "borderRadius": 0
      }
    },
    "km-feat-text-2": {
      "id": "km-feat-text-2",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 54, "y": 747, "width": 178, "height": 15,
        "rotation": 0
      },
      "props": {
        "text": "Calcium & vitamins",
        "variant": "paragraph",
        "fontSize": 7,
        "fontWeight": "600",
        "color": "#0c4a6e",
        "textAlign": "left",
        "lineHeight": 1.4
      }
    },
    "km-feat-card-3": {
      "id": "km-feat-card-3",
      "type": "card",
      "zIndex": 2,
      "locked": true,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 18, "y": 775, "width": 250, "height": 30,
        "rotation": 0
      },
      "props": {
        "bgColor": "#ffffff",
        "borderRadius": 5,
        "shadow": "sm",
        "borderWidth": 1,
        "borderColor": "#bae6fd",
        "padding": 0
      }
    },
    "km-feat-icon-3": {
      "id": "km-feat-icon-3",
      "type": "icon",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 30, "y": 781, "width": 18, "height": 18,
        "rotation": 0
      },
      "props": {
        "icon": "🌿",
        "fontSize": 8,
        "bgColor": "transparent",
        "borderRadius": 0
      }
    },
    "km-feat-text-3": {
      "id": "km-feat-text-3",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 54, "y": 782, "width": 178, "height": 15,
        "rotation": 0
      },
      "props": {
        "text": "100% natural, no preservatives",
        "variant": "paragraph",
        "fontSize": 7,
        "fontWeight": "600",
        "color": "#0c4a6e",
        "textAlign": "left",
        "lineHeight": 1.4
      }
    },
    "km-dl-card": {
      "id": "km-dl-card",
      "type": "card",
      "zIndex": 2,
      "locked": true,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 280, "y": 704, "width": 131, "height": 101,
        "rotation": 0
      },
      "props": {
        "bgColor": "#ffffff",
        "borderRadius": 6,
        "shadow": "md",
        "borderWidth": 1,
        "borderColor": "#bae6fd",
        "padding": 0
      }
    },
    "km-dl-title": {
      "id": "km-dl-title",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 297, "y": 731, "width": 95, "height": 15,
        "rotation": 0
      },
      "props": {
        "text": "🍳 Recipes booklet",
        "variant": "heading",
        "fontSize": 7,
        "fontWeight": "700",
        "color": "#0c4a6e",
        "textAlign": "center",
        "lineHeight": 1.3
      }
    },
    "km-dl-desc": {
      "id": "km-dl-desc",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 297, "y": 752, "width": 95, "height": 24,
        "rotation": 0
      },
      "props": {
        "text": "25 recipes\n2.5 MB",
        "variant": "paragraph",
        "fontSize": 6,
        "color": "#9ca3af",
        "textAlign": "center",
        "lineHeight": 1.5
      }
    },
    "km-life-overlay": {
      "id": "km-life-overlay",
      "type": "container",
      "zIndex": 1,
      "locked": true,
      "visible": true,
      "opacity": 0.5,
      "transform": {
        "x": 0, "y": 826, "width": 488, "height": 148,
        "rotation": 0
      },
      "props": {
        "bgGradientFrom": "transparent",
        "bgGradientTo": "#0c4a6e"
      }
    },
    "km-life-text": {
      "id": "km-life-text",
      "type": "heading",
      "zIndex": 10,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 24, "y": 927, "width": 326, "height": 35,
        "rotation": 0
      },
      "props": {
        "text": "Start every morning with farm-fresh goodness",
        "variant": "heading",
        "fontSize": 9,
        "fontWeight": "700",
        "color": "#ffffff",
        "textAlign": "left",
        "lineHeight": 1.3
      }
    },
    "km-oth-title": {
      "id": "km-oth-title",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 24, "y": 986, "width": 267, "height": 18,
        "rotation": 0
      },
      "props": {
        "text": "More Kothmale Products",
        "variant": "heading",
        "fontSize": 8,
        "fontWeight": "700",
        "color": "#0c4a6e",
        "textAlign": "left",
        "lineHeight": 1.2
      }
    },
    "km-oth-card-1": {
      "id": "km-oth-card-1",
      "type": "card",
      "zIndex": 2,
      "locked": true,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 18, "y": 1013, "width": 184, "height": 124,
        "rotation": 0
      },
      "props": {
        "bgColor": "#fef3c7",
        "borderRadius": 7,
        "shadow": "md",
        "borderWidth": 0,
        "borderColor": "transparent",
        "padding": 0
      }
    },
    "km-oth-img-1": {
      "id": "km-oth-img-1",
      "type": "image",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 54, "y": 1018, "width": 113, "height": 72,
        "rotation": 0
      },
      "props": {
        "src": "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80",
        "alt": "Chocolate Milk",
        "objectFit": "contain",
        "borderRadius": 3
      }
    },
    "km-oth-name-1": {
      "id": "km-oth-name-1",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 30, "y": 1096, "width": 161, "height": 11,
        "rotation": 0
      },
      "props": {
        "text": "Chocolate Milk",
        "variant": "heading",
        "fontSize": 7,
        "fontWeight": "700",
        "color": "#0c4a6e",
        "textAlign": "center",
        "lineHeight": 1.2
      }
    },
    "km-oth-sub-1": {
      "id": "km-oth-sub-1",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 30, "y": 1111, "width": 161, "height": 11,
        "rotation": 0
      },
      "props": {
        "text": "Rich cocoa flavor",
        "variant": "paragraph",
        "fontSize": 6,
        "color": "#64748b",
        "textAlign": "center",
        "lineHeight": 1.3
      }
    },
    "km-oth-card-2": {
      "id": "km-oth-card-2",
      "type": "card",
      "zIndex": 2,
      "locked": true,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 215, "y": 1013, "width": 184, "height": 124,
        "rotation": 0
      },
      "props": {
        "bgColor": "#ecfdf5",
        "borderRadius": 7,
        "shadow": "md",
        "borderWidth": 0,
        "borderColor": "transparent",
        "padding": 0
      }
    },
    "km-oth-img-2": {
      "id": "km-oth-img-2",
      "type": "image",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 250, "y": 1018, "width": 113, "height": 72,
        "rotation": 0
      },
      "props": {
        "src": "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80",
        "alt": "Curd",
        "objectFit": "contain",
        "borderRadius": 3
      }
    },
    "km-oth-name-2": {
      "id": "km-oth-name-2",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 226, "y": 1096, "width": 161, "height": 11,
        "rotation": 0
      },
      "props": {
        "text": "Traditional Curd",
        "variant": "heading",
        "fontSize": 7,
        "fontWeight": "700",
        "color": "#0c4a6e",
        "textAlign": "center",
        "lineHeight": 1.2
      }
    },
    "km-oth-sub-2": {
      "id": "km-oth-sub-2",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 226, "y": 1111, "width": 161, "height": 11,
        "rotation": 0
      },
      "props": {
        "text": "Sri Lankan tradition",
        "variant": "paragraph",
        "fontSize": 6,
        "color": "#64748b",
        "textAlign": "center",
        "lineHeight": 1.3
      }
    },
    "km-view-all": {
      "id": "km-view-all",
      "type": "button",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 18, "y": 1150, "width": 393, "height": 24,
        "rotation": 0
      },
      "props": {
        "text": "View all",
        "variant": "outline",
        "bgColor": "#f0f9ff",
        "textColor": "#64748b",
        "borderRadius": 5,
        "fontSize": 7,
        "fontWeight": "600"
      }
    },
    "km-foot-overlay": {
      "id": "km-foot-overlay",
      "type": "container",
      "zIndex": 1,
      "locked": true,
      "visible": true,
      "opacity": 0.88,
      "transform": {
        "x": 0, "y": 1181, "width": 488, "height": 148,
        "rotation": 0
      },
      "props": {
        "bgGradientFrom": "#0284c7",
        "bgGradientTo": "#22c55e"
      }
    },
    "km-foot-msg": {
      "id": "km-foot-msg",
      "type": "heading",
      "zIndex": 10,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 30, "y": 1205, "width": 369, "height": 48,
        "rotation": 0
      },
      "props": {
        "text": "Pure Goodness from the Hills of Sri Lanka",
        "variant": "heading",
        "fontSize": 13,
        "fontWeight": "800",
        "color": "#ffffff",
        "textAlign": "center",
        "lineHeight": 1.2
      }
    },
    "km-foot-sub": {
      "id": "km-foot-sub",
      "type": "text",
      "zIndex": 10,
      "locked": false,
      "visible": true,
      "opacity": 0.7,
      "transform": {
        "x": 119, "y": 1265, "width": 191, "height": 11,
        "rotation": 0
      },
      "props": {
        "text": "Milco (Pvt) Ltd",
        "variant": "paragraph",
        "fontSize": 6,
        "color": "#ffffff",
        "textAlign": "center",
        "lineHeight": 1.3
      }
    },
    "km-foot-logo": {
      "id": "km-foot-logo",
      "type": "icon",
      "zIndex": 10,
      "locked": false,
      "visible": true,
      "opacity": 0.8,
      "transform": {
        "x": 193, "y": 1283, "width": 24, "height": 24,
        "rotation": 0
      },
      "props": {
        "icon": "🥛",
        "fontSize": 13,
        "bgColor": "transparent",
        "borderRadius": 0
      }
    },
    "km-foot-link": {
      "id": "km-foot-link",
      "type": "text",
      "zIndex": 10,
      "locked": false,
      "visible": true,
      "opacity": 0.6,
      "transform": {
        "x": 143, "y": 1309, "width": 143, "height": 11,
        "rotation": 0
      },
      "props": {
        "text": "🔗 kothmale.lk",
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

export const kothmaleShowcaseTemplate: Template = {
  meta: { id: "kothmale-showcase", name: "Kothmale Fresh Milk", description: "Clean, natural dairy product showcase with sky blue/green Sri Lankan local theme.", category: "marketing", tags: ["beverage", "milk", "dairy", "kothmale", "product", "showcase", "sri-lanka"] },
  data: doc,
};
