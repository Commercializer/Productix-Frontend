import type { CanvasDocument, Template } from "@productix/types";

const doc: CanvasDocument = {
  "version": 1,
  "pageTitle": "Red Bull Energy Drink",
  "artboards": [
    {
      "id": "rb-hero-merged",
      "name": "Canvas",
      "width": 428,
      "height": 1700,
      "backgroundColor": "#b2bcd1",
      "backgroundImage": "",
      "position": 0,
      "elements": [
        "bg-splash",
        "top-lang",
        "hero-can",
        "main-card",
        "logo-img",
        "main-title",
        "var-250",
        "var-473",
        "var-355",
        "var-4cans",
        "desc",
        "btn-feedback",
        "soc-1",
        "soc-2",
        "soc-3",
        "soc-4",
        "separator",
        "about-title",
        "about-desc",
        "btn-readmore",
        "ben-card",
        "ben-title",
        "ben-ic-1",
        "ben-tx-1",
        "ben-ic-2",
        "ben-tx-2",
        "ben-ic-3",
        "ben-tx-3",
        "rec-card",
        "rec-ic",
        "rec-title",
        "rec-desc",
        "rdy-card",
        "rdy-title",
        "rdy-img",
        "oth-card",
        "oth-title",
        "oth-bg-1",
        "oth-img-1",
        "oth-tx-1",
        "oth-sub-1",
        "oth-bg-2",
        "oth-img-2",
        "oth-tx-2",
        "oth-sub-2",
        "btn-viewall",
        "bot-banner",
        "bot-title",
        "bot-btn",
        "footer-bar",
        "footer-lock",
        "footer-link",
        "footer-share"
      ]
    }
  ],
  "elements": {
    "bg-splash": {
      "id": "bg-splash",
      "type": "image",
      "zIndex": 1,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 0,
        "y": 0,
        "width": 428,
        "height": 380,
        "rotation": 0
      },
      "props": {
        "src": "",
        "alt": "Splash",
        "objectFit": "cover",
        "borderRadius": 0
      }
    },
    "top-lang": {
      "id": "top-lang",
      "type": "button",
      "zIndex": 10,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 320,
        "y": 55,
        "width": 84,
        "height": 32,
        "rotation": 0
      },
      "props": {
        "text": "English ▾",
        "variant": "filled",
        "bgColor": "#ffffff",
        "textColor": "#374151",
        "borderRadius": 8,
        "fontSize": 13,
        "fontWeight": "500"
      }
    },
    "hero-can": {
      "id": "hero-can",
      "type": "image",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 144,
        "y": 30,
        "width": 140,
        "height": 300,
        "rotation": 0
      },
      "props": {
        "src": "",
        "alt": "Red Bull Can",
        "objectFit": "contain",
        "borderRadius": 0
      }
    },
    "main-card": {
      "id": "main-card",
      "type": "card",
      "zIndex": 2,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 18,
        "y": 160,
        "width": 392,
        "height": 570,
        "rotation": 0
      },
      "props": {
        "bgColor": "#ffffff",
        "borderRadius": 16,
        "shadow": "lg",
        "borderWidth": 0,
        "padding": 0
      }
    },
    "logo-img": {
      "id": "logo-img",
      "type": "image",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 34,
        "y": 180,
        "width": 100,
        "height": 24,
        "rotation": 0
      },
      "props": {
        "src": "",
        "alt": "Red Bull Logo",
        "objectFit": "contain",
        "borderRadius": 0
      }
    },
    "main-title": {
      "id": "main-title",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 34,
        "y": 215,
        "width": 360,
        "height": 30,
        "rotation": 0
      },
      "props": {
        "text": "Red Bull Energy Drink",
        "variant": "heading",
        "fontSize": 22,
        "fontWeight": "800",
        "color": "#1a1a2e",
        "textAlign": "left",
        "lineHeight": 1.2
      }
    },
    "var-250": {
      "id": "var-250",
      "type": "button",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 34,
        "y": 260,
        "width": 60,
        "height": 28,
        "rotation": 0
      },
      "props": {
        "text": "250 ml",
        "variant": "filled",
        "bgColor": "#e5e7eb",
        "textColor": "#1f2937",
        "borderRadius": 6,
        "fontSize": 12,
        "fontWeight": "600"
      }
    },
    "var-473": {
      "id": "var-473",
      "type": "button",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 104,
        "y": 260,
        "width": 60,
        "height": 28,
        "rotation": 0
      },
      "props": {
        "text": "473 ml",
        "variant": "filled",
        "bgColor": "#f3f4f6",
        "textColor": "#4b5563",
        "borderRadius": 6,
        "fontSize": 12,
        "fontWeight": "500"
      }
    },
    "var-355": {
      "id": "var-355",
      "type": "button",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 174,
        "y": 260,
        "width": 60,
        "height": 28,
        "rotation": 0
      },
      "props": {
        "text": "355 ml",
        "variant": "filled",
        "bgColor": "#f3f4f6",
        "textColor": "#4b5563",
        "borderRadius": 6,
        "fontSize": 12,
        "fontWeight": "500"
      }
    },
    "var-4cans": {
      "id": "var-4cans",
      "type": "button",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 244,
        "y": 260,
        "width": 60,
        "height": 28,
        "rotation": 0
      },
      "props": {
        "text": "4 cans",
        "variant": "filled",
        "bgColor": "#fafafa",
        "textColor": "#d1d5db",
        "borderRadius": 6,
        "fontSize": 12,
        "fontWeight": "500"
      }
    },
    "desc": {
      "id": "desc",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 34,
        "y": 305,
        "width": 360,
        "height": 40,
        "rotation": 0
      },
      "props": {
        "text": "The original Red Bull Energy Drink. Giving wiiings to people and ideas since 1987.",
        "variant": "paragraph",
        "fontSize": 14,
        "color": "#4b5563",
        "textAlign": "left",
        "lineHeight": 1.5
      }
    },
    "btn-feedback": {
      "id": "btn-feedback",
      "type": "button",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 34,
        "y": 360,
        "width": 360,
        "height": 44,
        "rotation": 0
      },
      "props": {
        "text": "Feedback / Inquiry",
        "variant": "filled",
        "bgColor": "#3b5998",
        "textColor": "#ffffff",
        "borderRadius": 10,
        "fontSize": 14,
        "fontWeight": "600"
      }
    },
    "soc-1": {
      "id": "soc-1",
      "type": "image",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 34,
        "y": 420,
        "width": 80,
        "height": 44,
        "rotation": 0
      },
      "props": {
        "src": "",
        "alt": "Globe",
        "objectFit": "contain",
        "borderRadius": 8
      }
    },
    "soc-2": {
      "id": "soc-2",
      "type": "image",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 128,
        "y": 420,
        "width": 80,
        "height": 44,
        "rotation": 0
      },
      "props": {
        "src": "",
        "alt": "Facebook",
        "objectFit": "contain",
        "borderRadius": 8
      }
    },
    "soc-3": {
      "id": "soc-3",
      "type": "image",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 222,
        "y": 420,
        "width": 80,
        "height": 44,
        "rotation": 0
      },
      "props": {
        "src": "",
        "alt": "Instagram",
        "objectFit": "contain",
        "borderRadius": 8
      }
    },
    "soc-4": {
      "id": "soc-4",
      "type": "image",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 316,
        "y": 420,
        "width": 78,
        "height": 44,
        "rotation": 0
      },
      "props": {
        "src": "",
        "alt": "LinkedIn",
        "objectFit": "contain",
        "borderRadius": 8
      }
    },
    "separator": {
      "id": "separator",
      "type": "container",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 34,
        "y": 480,
        "width": 360,
        "height": 1,
        "rotation": 0
      },
      "props": {
        "bgGradientFrom": "#e5e7eb",
        "bgGradientTo": "#e5e7eb"
      }
    },
    "about-title": {
      "id": "about-title",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 34,
        "y": 500,
        "width": 360,
        "height": 20,
        "rotation": 0
      },
      "props": {
        "text": "About Red Bull Energy Drink",
        "variant": "heading",
        "fontSize": 15,
        "fontWeight": "700",
        "color": "#1a1a2e",
        "textAlign": "left",
        "lineHeight": 1.2
      }
    },
    "about-desc": {
      "id": "about-desc",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 34,
        "y": 525,
        "width": 360,
        "height": 60,
        "rotation": 0
      },
      "props": {
        "text": "Red Bull Energy Drink is appreciated worldwide by top athletes, busy professionals, college students and travelers on long journeys.",
        "variant": "paragraph",
        "fontSize": 14,
        "color": "#4b5563",
        "textAlign": "left",
        "lineHeight": 1.5
      }
    },
    "btn-readmore": {
      "id": "btn-readmore",
      "type": "button",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 34,
        "y": 600,
        "width": 360,
        "height": 40,
        "rotation": 0
      },
      "props": {
        "text": "Read more",
        "variant": "outline",
        "bgColor": "#ffffff",
        "textColor": "#111827",
        "borderRadius": 8,
        "fontSize": 14,
        "fontWeight": "600"
      }
    },
    "ben-card": {
      "id": "ben-card",
      "type": "card",
      "zIndex": 2,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 18,
        "y": 745,
        "width": 240,
        "height": 140,
        "rotation": 0
      },
      "props": {
        "bgColor": "#ffffff",
        "borderRadius": 12,
        "shadow": "md",
        "borderWidth": 0,
        "padding": 0
      }
    },
    "ben-title": {
      "id": "ben-title",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 34,
        "y": 760,
        "width": 200,
        "height": 20,
        "rotation": 0
      },
      "props": {
        "text": "Benefits",
        "variant": "paragraph",
        "fontSize": 14,
        "color": "#6b7280",
        "textAlign": "left",
        "lineHeight": 1.2
      }
    },
    "ben-ic-1": {
      "id": "ben-ic-1",
      "type": "image",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 34,
        "y": 790,
        "width": 18,
        "height": 18,
        "rotation": 0
      },
      "props": {
        "src": "",
        "alt": "icon",
        "objectFit": "contain",
        "borderRadius": 0
      }
    },
    "ben-tx-1": {
      "id": "ben-tx-1",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 62,
        "y": 792,
        "width": 180,
        "height": 18,
        "rotation": 0
      },
      "props": {
        "text": "Stay alert",
        "variant": "paragraph",
        "fontSize": 14,
        "color": "#111827",
        "textAlign": "left",
        "lineHeight": 1.2,
        "fontWeight": "600"
      }
    },
    "ben-ic-2": {
      "id": "ben-ic-2",
      "type": "image",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 34,
        "y": 820,
        "width": 18,
        "height": 18,
        "rotation": 0
      },
      "props": {
        "src": "",
        "alt": "icon",
        "objectFit": "contain",
        "borderRadius": 0
      }
    },
    "ben-tx-2": {
      "id": "ben-tx-2",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 62,
        "y": 822,
        "width": 180,
        "height": 18,
        "rotation": 0
      },
      "props": {
        "text": "Reduce fatigue",
        "variant": "paragraph",
        "fontSize": 14,
        "color": "#111827",
        "textAlign": "left",
        "lineHeight": 1.2,
        "fontWeight": "600"
      }
    },
    "ben-ic-3": {
      "id": "ben-ic-3",
      "type": "image",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 34,
        "y": 850,
        "width": 18,
        "height": 18,
        "rotation": 0
      },
      "props": {
        "src": "",
        "alt": "icon",
        "objectFit": "contain",
        "borderRadius": 0
      }
    },
    "ben-tx-3": {
      "id": "ben-tx-3",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 62,
        "y": 852,
        "width": 180,
        "height": 18,
        "rotation": 0
      },
      "props": {
        "text": "Kickstart your day",
        "variant": "paragraph",
        "fontSize": 14,
        "color": "#111827",
        "textAlign": "left",
        "lineHeight": 1.2,
        "fontWeight": "600"
      }
    },
    "rec-card": {
      "id": "rec-card",
      "type": "card",
      "zIndex": 2,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 270,
        "y": 745,
        "width": 140,
        "height": 140,
        "rotation": 0
      },
      "props": {
        "bgColor": "#ffffff",
        "borderRadius": 12,
        "shadow": "md",
        "borderWidth": 0,
        "padding": 0
      }
    },
    "rec-ic": {
      "id": "rec-ic",
      "type": "image",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 286,
        "y": 765,
        "width": 20,
        "height": 20,
        "rotation": 0
      },
      "props": {
        "src": "",
        "alt": "icon",
        "objectFit": "contain",
        "borderRadius": 0
      }
    },
    "rec-title": {
      "id": "rec-title",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 286,
        "y": 800,
        "width": 110,
        "height": 20,
        "rotation": 0
      },
      "props": {
        "text": "Recipe book",
        "variant": "heading",
        "fontSize": 14,
        "fontWeight": "700",
        "color": "#111827",
        "textAlign": "left",
        "lineHeight": 1.2
      }
    },
    "rec-desc": {
      "id": "rec-desc",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 286,
        "y": 825,
        "width": 110,
        "height": 30,
        "rotation": 0
      },
      "props": {
        "text": "20 pages\n1.4 MB",
        "variant": "paragraph",
        "fontSize": 12,
        "color": "#6b7280",
        "textAlign": "left",
        "lineHeight": 1.4
      }
    },
    "rdy-card": {
      "id": "rdy-card",
      "type": "card",
      "zIndex": 2,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 18,
        "y": 900,
        "width": 392,
        "height": 240,
        "rotation": 0
      },
      "props": {
        "bgColor": "#ffffff",
        "borderRadius": 12,
        "shadow": "md",
        "borderWidth": 0,
        "padding": 0
      }
    },
    "rdy-title": {
      "id": "rdy-title",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 34,
        "y": 915,
        "width": 360,
        "height": 20,
        "rotation": 0
      },
      "props": {
        "text": "Ready to take off?",
        "variant": "paragraph",
        "fontSize": 14,
        "color": "#6b7280",
        "textAlign": "left",
        "lineHeight": 1.2
      }
    },
    "rdy-img": {
      "id": "rdy-img",
      "type": "image",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 34,
        "y": 945,
        "width": 360,
        "height": 180,
        "rotation": 0
      },
      "props": {
        "src": "",
        "alt": "Illustration",
        "objectFit": "cover",
        "borderRadius": 8
      }
    },
    "oth-card": {
      "id": "oth-card",
      "type": "card",
      "zIndex": 2,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 18,
        "y": 1155,
        "width": 392,
        "height": 260,
        "rotation": 0
      },
      "props": {
        "bgColor": "#ffffff",
        "borderRadius": 12,
        "shadow": "md",
        "borderWidth": 0,
        "padding": 0
      }
    },
    "oth-title": {
      "id": "oth-title",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 34,
        "y": 1170,
        "width": 360,
        "height": 20,
        "rotation": 0
      },
      "props": {
        "text": "Other Red Bull Drinks",
        "variant": "paragraph",
        "fontSize": 14,
        "color": "#6b7280",
        "textAlign": "left",
        "lineHeight": 1.2
      }
    },
    "oth-bg-1": {
      "id": "oth-bg-1",
      "type": "card",
      "zIndex": 3,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 34,
        "y": 1205,
        "width": 172,
        "height": 120,
        "rotation": 0
      },
      "props": {
        "bgColor": "#eaf2fb",
        "borderRadius": 8,
        "shadow": "none",
        "borderWidth": 0,
        "padding": 0
      }
    },
    "oth-img-1": {
      "id": "oth-img-1",
      "type": "image",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 70,
        "y": 1215,
        "width": 100,
        "height": 110,
        "rotation": 0
      },
      "props": {
        "src": "",
        "alt": "Can 1",
        "objectFit": "contain",
        "borderRadius": 0
      }
    },
    "oth-tx-1": {
      "id": "oth-tx-1",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 34,
        "y": 1340,
        "width": 172,
        "height": 18,
        "rotation": 0
      },
      "props": {
        "text": "Red Bull Zero",
        "variant": "heading",
        "fontSize": 14,
        "fontWeight": "600",
        "color": "#111827",
        "textAlign": "center",
        "lineHeight": 1.2
      }
    },
    "oth-sub-1": {
      "id": "oth-sub-1",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 34,
        "y": 1360,
        "width": 172,
        "height": 16,
        "rotation": 0
      },
      "props": {
        "text": "Red Bull Zero",
        "variant": "paragraph",
        "fontSize": 12,
        "color": "#6b7280",
        "textAlign": "center",
        "lineHeight": 1.2
      }
    },
    "oth-bg-2": {
      "id": "oth-bg-2",
      "type": "card",
      "zIndex": 3,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 222,
        "y": 1205,
        "width": 172,
        "height": 120,
        "rotation": 0
      },
      "props": {
        "bgColor": "#0099e5",
        "borderRadius": 8,
        "shadow": "none",
        "borderWidth": 0,
        "padding": 0
      }
    },
    "oth-img-2": {
      "id": "oth-img-2",
      "type": "image",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 258,
        "y": 1215,
        "width": 100,
        "height": 110,
        "rotation": 0
      },
      "props": {
        "src": "",
        "alt": "Can 2",
        "objectFit": "contain",
        "borderRadius": 0
      }
    },
    "oth-tx-2": {
      "id": "oth-tx-2",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 222,
        "y": 1340,
        "width": 172,
        "height": 18,
        "rotation": 0
      },
      "props": {
        "text": "Sugar-free energy drink",
        "variant": "heading",
        "fontSize": 13,
        "fontWeight": "600",
        "color": "#111827",
        "textAlign": "center",
        "lineHeight": 1.2
      }
    },
    "oth-sub-2": {
      "id": "oth-sub-2",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 222,
        "y": 1360,
        "width": 172,
        "height": 16,
        "rotation": 0
      },
      "props": {
        "text": "Sugar-free energy drink",
        "variant": "paragraph",
        "fontSize": 12,
        "color": "#6b7280",
        "textAlign": "center",
        "lineHeight": 1.2
      }
    },
    "btn-viewall": {
      "id": "btn-viewall",
      "type": "button",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 34,
        "y": 1390,
        "width": 360,
        "height": 40,
        "rotation": 0
      },
      "props": {
        "text": "View all",
        "variant": "outline",
        "bgColor": "#ffffff",
        "textColor": "#111827",
        "borderRadius": 8,
        "fontSize": 14,
        "fontWeight": "600"
      }
    },
    "bot-banner": {
      "id": "bot-banner",
      "type": "image",
      "zIndex": 2,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 18,
        "y": 1430,
        "width": 392,
        "height": 160,
        "rotation": 0
      },
      "props": {
        "src": "",
        "alt": "Banner",
        "objectFit": "cover",
        "borderRadius": 12
      }
    },
    "bot-title": {
      "id": "bot-title",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 50,
        "y": 1465,
        "width": 328,
        "height": 60,
        "rotation": 0
      },
      "props": {
        "text": "Giving wiiings to\npeople & ideas\nsince 1987",
        "variant": "heading",
        "fontSize": 22,
        "fontWeight": "800",
        "color": "#ffffff",
        "textAlign": "center",
        "lineHeight": 1.2
      }
    },
    "bot-btn": {
      "id": "bot-btn",
      "type": "button",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 164,
        "y": 1540,
        "width": 100,
        "height": 26,
        "rotation": 0
      },
      "props": {
        "text": "Red Bull GmbH",
        "variant": "filled",
        "bgColor": "#e30022",
        "textColor": "#ffffff",
        "borderRadius": 13,
        "fontSize": 10,
        "fontWeight": "600"
      }
    },
    "footer-bar": {
      "id": "footer-bar",
      "type": "card",
      "zIndex": 2,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 0,
        "y": 1610,
        "width": 428,
        "height": 60,
        "rotation": 0
      },
      "props": {
        "bgColor": "#405282",
        "borderRadius": 0,
        "shadow": "none",
        "borderWidth": 0,
        "padding": 0
      }
    },
    "footer-lock": {
      "id": "footer-lock",
      "type": "image",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 130,
        "y": 1630,
        "width": 12,
        "height": 16,
        "rotation": 0
      },
      "props": {
        "src": "",
        "alt": "Lock",
        "objectFit": "contain",
        "borderRadius": 0
      }
    },
    "footer-link": {
      "id": "footer-link",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 150,
        "y": 1630,
        "width": 140,
        "height": 20,
        "rotation": 0
      },
      "props": {
        "text": "store.redbull.com",
        "variant": "paragraph",
        "fontSize": 15,
        "color": "#d1d5db",
        "textAlign": "left",
        "lineHeight": 1.2
      }
    },
    "footer-share": {
      "id": "footer-share",
      "type": "image",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 380,
        "y": 1625,
        "width": 20,
        "height": 24,
        "rotation": 0
      },
      "props": {
        "src": "",
        "alt": "Share",
        "objectFit": "contain",
        "borderRadius": 0
      }
    }
  }
};

export const redbullShowcaseTemplate: Template = {
  meta: {
    id: "redbull-showcase",
    name: "Red Bull Showcase",
    description: "Exact 1:1 match of the Red Bull product showcase template.",
    category: "marketing",
    tags: ["beverage", "energy", "redbull"],
  },
  data: doc,
};
