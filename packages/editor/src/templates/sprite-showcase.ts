/* ─────────────────────────────────────────────
 * Sprite Showcase Template - Mobile-first canvas
 * ──────────────────────────────────────────── */

import type { CanvasDocument, Template } from "@productix/types";

const doc: CanvasDocument = {
  "version": 1,
  "pageTitle": "Sprite Lemon-Lime",
  "artboards": [
    {
      "id": "sp-hero-merged",
      "name": "Canvas",
      "width": 428,
      "height": 1167,
      "backgroundColor": "#065f46",
      "backgroundImage": "https://images.unsplash.com/photo-1560512823-829485b8bf24?w=1600&q=80",
      "position": 0,
      "elements": [
        "sp-hero-overlay",
        "sp-hero-lang",
        "sp-hero-img",
        "sp-logo-icon",
        "sp-logo-text",
        "sp-product-name",
        "sp-var-1",
        "sp-var-2",
        "sp-var-3",
        "sp-var-4",
        "sp-tagline",
        "sp-cta",
        "sp-social-group",
        "sp-about-card",
        "sp-about-title",
        "sp-about-text",
        "sp-about-more",
        "sp-feat-title",
        "sp-feat-card-1",
        "sp-feat-icon-1",
        "sp-feat-text-1",
        "sp-feat-card-2",
        "sp-feat-icon-2",
        "sp-feat-text-2",
        "sp-feat-card-3",
        "sp-feat-icon-3",
        "sp-feat-text-3",
        "sp-dl-card",
        "sp-dl-title",
        "sp-dl-desc",
        "sp-life-overlay",
        "sp-life-text",
        "sp-oth-title",
        "sp-oth-card-1",
        "sp-oth-img-1",
        "sp-oth-name-1",
        "sp-oth-sub-1",
        "sp-oth-card-2",
        "sp-oth-img-2",
        "sp-oth-name-2",
        "sp-oth-sub-2",
        "sp-view-all",
        "sp-foot-overlay",
        "sp-foot-msg",
        "sp-foot-sub",
        "sp-foot-logo",
        "sp-foot-link"
      ]
    }
  ],
  "elements": {
    "sp-hero-overlay": {
      "id": "sp-hero-overlay",
      "type": "container",
      "zIndex": 1,
      "locked": true,
      "visible": true,
      "opacity": 0.65,
      "transform": {
        "x": 0, "y": 0, "width": 488, "height": 244,
        "rotation": 0
      },
      "props": {
        "bgGradientFrom": "#065f46",
        "bgGradientTo": "#059669"
      }
    },
    "sp-hero-lang": {
      "id": "sp-hero-lang",
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
        "bgColor": "rgba(255,255,255,0.15)",
        "textColor": "#ffffff",
        "borderRadius": 260,
        "fontSize": 6,
        "fontWeight": "500"
      }
    },
    "sp-hero-img": {
      "id": "sp-hero-img",
      "type": "image",
      "zIndex": 10,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 80, "y": 30, "width": 267, "height": 196,
        "rotation": 0
      },
      "props": {
        "src": "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=800&q=90",
        "alt": "Sprite Bottle",
        "objectFit": "contain",
        "borderRadius": 0
      }
    },
    "sp-logo-icon": {
      "id": "sp-logo-icon",
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
        "icon": "🍋",
        "fontSize": 16,
        "bgColor": "transparent",
        "borderRadius": 0
      }
    },
    "sp-logo-text": {
      "id": "sp-logo-text",
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
        "text": "Sprite",
        "variant": "heading",
        "fontSize": 9,
        "fontWeight": "800",
        "color": "#059669",
        "textAlign": "left",
        "lineHeight": 1.2
      }
    },
    "sp-product-name": {
      "id": "sp-product-name",
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
        "text": "Sprite Lemon-Lime",
        "variant": "heading",
        "fontSize": 14,
        "fontWeight": "800",
        "color": "#064e3b",
        "textAlign": "left",
        "lineHeight": 1.2
      }
    },
    "sp-var-1": {
      "id": "sp-var-1",
      "type": "button",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 24, "y": 333, "width": 72, "height": 24,
        "rotation": 0
      },
      "props": {
        "text": "250 ml",
        "variant": "outline",
        "bgColor": "#f0fdf4",
        "textColor": "#6b7280",
        "borderRadius": 4,
        "fontSize": 7,
        "fontWeight": "600"
      }
    },
    "sp-var-2": {
      "id": "sp-var-2",
      "type": "button",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 104, "y": 333, "width": 72, "height": 24,
        "rotation": 0
      },
      "props": {
        "text": "330 ml",
        "variant": "filled",
        "bgColor": "#059669",
        "textColor": "#ffffff",
        "borderRadius": 4,
        "fontSize": 7,
        "fontWeight": "600"
      }
    },
    "sp-var-3": {
      "id": "sp-var-3",
      "type": "button",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 184, "y": 333, "width": 72, "height": 24,
        "rotation": 0
      },
      "props": {
        "text": "500 ml",
        "variant": "outline",
        "bgColor": "#f0fdf4",
        "textColor": "#6b7280",
        "borderRadius": 4,
        "fontSize": 7,
        "fontWeight": "600"
      }
    },
    "sp-var-4": {
      "id": "sp-var-4",
      "type": "button",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 265, "y": 333, "width": 72, "height": 24,
        "rotation": 0
      },
      "props": {
        "text": "1.5 L",
        "variant": "outline",
        "bgColor": "#f0fdf4",
        "textColor": "#6b7280",
        "borderRadius": 4,
        "fontSize": 7,
        "fontWeight": "600"
      }
    },
    "sp-tagline": {
      "id": "sp-tagline",
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
        "text": "Obey your thirst. Crisp, clean, and refreshingly honest. The iconic lemon-lime soda since 1961.",
        "variant": "paragraph",
        "fontSize": 8,
        "color": "#6b7280",
        "textAlign": "left",
        "lineHeight": 1.6
      }
    },
    "sp-cta": {
      "id": "sp-cta",
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
        "bgColor": "#059669",
        "textColor": "#ffffff",
        "borderRadius": 6,
        "fontSize": 8,
        "fontWeight": "600"
      }
    },
    "sp-social-group": {
      "id": "sp-social-group",
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
        "iconColor": "#059669",
        "iconBg": "#ecfdf5",
        "borderRadius": 260
      }
    },
    "sp-about-card": {
      "id": "sp-about-card",
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
        "bgColor": "#f0fdf4",
        "borderRadius": 8,
        "shadow": "md",
        "borderWidth": 1,
        "borderColor": "#d1fae5",
        "padding": 0
      }
    },
    "sp-about-title": {
      "id": "sp-about-title",
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
        "text": "About Sprite",
        "variant": "heading",
        "fontSize": 8,
        "fontWeight": "700",
        "color": "#064e3b",
        "textAlign": "left",
        "lineHeight": 1.3
      }
    },
    "sp-about-text": {
      "id": "sp-about-text",
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
        "text": "Sprite is a colorless, caffeine-free, lemon and lime-flavored soft drink created by The Coca-Cola Company. First developed in 1959, Sprite was introduced as a competitor to 7 Up in 1961. Today, Sprite is sold in over 190 countries and is one of the world's best-selling soft drinks.",
        "variant": "paragraph",
        "fontSize": 7,
        "color": "#6b7280",
        "textAlign": "left",
        "lineHeight": 1.7
      }
    },
    "sp-about-more": {
      "id": "sp-about-more",
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
        "textColor": "#6b7280",
        "borderRadius": 0,
        "fontSize": 7,
        "fontWeight": "600"
      }
    },
    "sp-feat-title": {
      "id": "sp-feat-title",
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
        "text": "Why Sprite?",
        "variant": "heading",
        "fontSize": 7,
        "fontWeight": "700",
        "color": "#064e3b",
        "textAlign": "left",
        "lineHeight": 1.2
      }
    },
    "sp-feat-card-1": {
      "id": "sp-feat-card-1",
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
        "borderColor": "#d1fae5",
        "padding": 0
      }
    },
    "sp-feat-icon-1": {
      "id": "sp-feat-icon-1",
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
        "icon": "🍃",
        "fontSize": 8,
        "bgColor": "transparent",
        "borderRadius": 0
      }
    },
    "sp-feat-text-1": {
      "id": "sp-feat-text-1",
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
        "text": "Refreshingly crisp",
        "variant": "paragraph",
        "fontSize": 7,
        "fontWeight": "600",
        "color": "#064e3b",
        "textAlign": "left",
        "lineHeight": 1.4
      }
    },
    "sp-feat-card-2": {
      "id": "sp-feat-card-2",
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
        "borderColor": "#d1fae5",
        "padding": 0
      }
    },
    "sp-feat-icon-2": {
      "id": "sp-feat-icon-2",
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
        "icon": "💧",
        "fontSize": 8,
        "bgColor": "transparent",
        "borderRadius": 0
      }
    },
    "sp-feat-text-2": {
      "id": "sp-feat-text-2",
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
        "text": "Zero caffeine",
        "variant": "paragraph",
        "fontSize": 7,
        "fontWeight": "600",
        "color": "#064e3b",
        "textAlign": "left",
        "lineHeight": 1.4
      }
    },
    "sp-feat-card-3": {
      "id": "sp-feat-card-3",
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
        "borderColor": "#d1fae5",
        "padding": 0
      }
    },
    "sp-feat-icon-3": {
      "id": "sp-feat-icon-3",
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
        "icon": "✨",
        "fontSize": 8,
        "bgColor": "transparent",
        "borderRadius": 0
      }
    },
    "sp-feat-text-3": {
      "id": "sp-feat-text-3",
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
        "text": "Thirst-quenching",
        "variant": "paragraph",
        "fontSize": 7,
        "fontWeight": "600",
        "color": "#064e3b",
        "textAlign": "left",
        "lineHeight": 1.4
      }
    },
    "sp-dl-card": {
      "id": "sp-dl-card",
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
        "borderColor": "#d1fae5",
        "padding": 0
      }
    },
    "sp-dl-title": {
      "id": "sp-dl-title",
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
        "text": "🍹 Mocktail recipes",
        "variant": "heading",
        "fontSize": 7,
        "fontWeight": "700",
        "color": "#064e3b",
        "textAlign": "center",
        "lineHeight": 1.3
      }
    },
    "sp-dl-desc": {
      "id": "sp-dl-desc",
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
        "text": "15 recipes\n2.1 MB",
        "variant": "paragraph",
        "fontSize": 6,
        "color": "#9ca3af",
        "textAlign": "center",
        "lineHeight": 1.5
      }
    },
    "sp-life-overlay": {
      "id": "sp-life-overlay",
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
        "bgGradientTo": "#065f46"
      }
    },
    "sp-life-text": {
      "id": "sp-life-text",
      "type": "heading",
      "zIndex": 10,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 24, "y": 939, "width": 267, "height": 24,
        "rotation": 0
      },
      "props": {
        "text": "Stay cool, stay refreshed",
        "variant": "heading",
        "fontSize": 9,
        "fontWeight": "700",
        "color": "#ffffff",
        "textAlign": "left",
        "lineHeight": 1.3
      }
    },
    "sp-oth-title": {
      "id": "sp-oth-title",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 24, "y": 986, "width": 237, "height": 18,
        "rotation": 0
      },
      "props": {
        "text": "More from Sprite",
        "variant": "heading",
        "fontSize": 8,
        "fontWeight": "700",
        "color": "#064e3b",
        "textAlign": "left",
        "lineHeight": 1.2
      }
    },
    "sp-oth-card-1": {
      "id": "sp-oth-card-1",
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
        "bgColor": "#d1fae5",
        "borderRadius": 7,
        "shadow": "md",
        "borderWidth": 0,
        "borderColor": "transparent",
        "padding": 0
      }
    },
    "sp-oth-img-1": {
      "id": "sp-oth-img-1",
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
        "src": "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&q=80",
        "alt": "Sprite Zero",
        "objectFit": "contain",
        "borderRadius": 3
      }
    },
    "sp-oth-name-1": {
      "id": "sp-oth-name-1",
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
        "text": "Sprite Zero Sugar",
        "variant": "heading",
        "fontSize": 7,
        "fontWeight": "700",
        "color": "#064e3b",
        "textAlign": "center",
        "lineHeight": 1.2
      }
    },
    "sp-oth-sub-1": {
      "id": "sp-oth-sub-1",
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
        "text": "Zero sugar, same taste",
        "variant": "paragraph",
        "fontSize": 6,
        "color": "#6b7280",
        "textAlign": "center",
        "lineHeight": 1.3
      }
    },
    "sp-oth-card-2": {
      "id": "sp-oth-card-2",
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
        "bgColor": "#fef3c7",
        "borderRadius": 7,
        "shadow": "md",
        "borderWidth": 0,
        "borderColor": "transparent",
        "padding": 0
      }
    },
    "sp-oth-img-2": {
      "id": "sp-oth-img-2",
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
        "src": "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&q=80",
        "alt": "Sprite Lymonade",
        "objectFit": "contain",
        "borderRadius": 3
      }
    },
    "sp-oth-name-2": {
      "id": "sp-oth-name-2",
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
        "text": "Sprite Lymonade",
        "variant": "heading",
        "fontSize": 7,
        "fontWeight": "700",
        "color": "#064e3b",
        "textAlign": "center",
        "lineHeight": 1.2
      }
    },
    "sp-oth-sub-2": {
      "id": "sp-oth-sub-2",
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
        "text": "Lemonade twist",
        "variant": "paragraph",
        "fontSize": 6,
        "color": "#6b7280",
        "textAlign": "center",
        "lineHeight": 1.3
      }
    },
    "sp-view-all": {
      "id": "sp-view-all",
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
        "bgColor": "#f0fdf4",
        "textColor": "#6b7280",
        "borderRadius": 5,
        "fontSize": 7,
        "fontWeight": "600"
      }
    },
    "sp-foot-overlay": {
      "id": "sp-foot-overlay",
      "type": "container",
      "zIndex": 1,
      "locked": true,
      "visible": true,
      "opacity": 0.92,
      "transform": {
        "x": 0, "y": 1181, "width": 488, "height": 148,
        "rotation": 0
      },
      "props": {
        "bgGradientFrom": "#059669",
        "bgGradientTo": "#10b981"
      }
    },
    "sp-foot-msg": {
      "id": "sp-foot-msg",
      "type": "heading",
      "zIndex": 10,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 35, "y": 1212, "width": 357, "height": 41,
        "rotation": 0
      },
      "props": {
        "text": "Obey Your Thirst",
        "variant": "heading",
        "fontSize": 15,
        "fontWeight": "800",
        "color": "#ffffff",
        "textAlign": "center",
        "lineHeight": 1.2
      }
    },
    "sp-foot-sub": {
      "id": "sp-foot-sub",
      "type": "text",
      "zIndex": 10,
      "locked": false,
      "visible": true,
      "opacity": 0.7,
      "transform": {
        "x": 119, "y": 1262, "width": 191, "height": 11,
        "rotation": 0
      },
      "props": {
        "text": "The Coca-Cola Company",
        "variant": "paragraph",
        "fontSize": 6,
        "color": "#ffffff",
        "textAlign": "center",
        "lineHeight": 1.3
      }
    },
    "sp-foot-logo": {
      "id": "sp-foot-logo",
      "type": "icon",
      "zIndex": 10,
      "locked": false,
      "visible": true,
      "opacity": 0.8,
      "transform": {
        "x": 193, "y": 1280, "width": 24, "height": 24,
        "rotation": 0
      },
      "props": {
        "icon": "🍋",
        "fontSize": 13,
        "bgColor": "transparent",
        "borderRadius": 0
      }
    },
    "sp-foot-link": {
      "id": "sp-foot-link",
      "type": "text",
      "zIndex": 10,
      "locked": false,
      "visible": true,
      "opacity": 0.6,
      "transform": {
        "x": 148, "y": 1309, "width": 131, "height": 11,
        "rotation": 0
      },
      "props": {
        "text": "🔗 sprite.com",
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

export const spriteShowcaseTemplate: Template = {
  meta: { id: "sprite-showcase", name: "Sprite Showcase", description: "Fresh lemon-lime beverage showcase with green refreshing theme.", category: "marketing", tags: ["beverage", "sprite", "fresh", "product", "showcase"] },
  data: doc,
};
