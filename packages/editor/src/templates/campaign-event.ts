/* ─────────────────────────────────────────────
 * Event Announcement Template - Mobile-first canvas
 * ──────────────────────────────────────────── */

import type { CanvasDocument, Template } from "@productix/types";

const doc: CanvasDocument = {
  "version": 1,
  "pageTitle": "Event Announcement",
  "artboards": [
    {
      "id": "ab-event-1-merged",
      "name": "Canvas",
      "width": 428,
      "height": 339,
      "backgroundColor": "#0f172a",
      "backgroundImage": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&q=80",
      "position": 0,
      "elements": [
        "ev-overlay",
        "ev-badge",
        "ev-title",
        "ev-desc",
        "ev-date-card",
        "ev-cta",
        "ev-cta2",
        "ev-det-title",
        "ev-det-text",
        "ev-promo",
        "ev-social"
      ]
    }
  ],
  "elements": {
    "ev-overlay": {
      "id": "ev-overlay",
      "type": "container",
      "zIndex": 1,
      "locked": false,
      "visible": true,
      "opacity": 0.65,
      "transform": {
        "x": 0, "y": 0, "width": 488, "height": 237,
        "rotation": 0
      },
      "props": {
        "bgGradientFrom": "#0f172a",
        "bgGradientTo": "#312e81"
      }
    },
    "ev-badge": {
      "id": "ev-badge",
      "type": "badge",
      "zIndex": 10,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 154, "y": 41, "width": 54, "height": 9,
        "rotation": 0
      },
      "props": {
        "text": "🎉 Coming Soon",
        "bgColor": "rgba(251,191,36,0.25)",
        "textColor": "#fbbf24",
        "borderRadius": 260,
        "fontSize": 3,
        "fontWeight": "600"
      }
    },
    "ev-title": {
      "id": "ev-title",
      "type": "heading",
      "zIndex": 10,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 80, "y": 59, "width": 267, "height": 30,
        "rotation": 0
      },
      "props": {
        "text": "The Biggest Design Conference of 2026",
        "variant": "heading",
        "fontSize": 14,
        "fontWeight": "800",
        "color": "#ffffff",
        "textAlign": "center",
        "lineHeight": 1.1
      }
    },
    "ev-desc": {
      "id": "ev-desc",
      "type": "text",
      "zIndex": 10,
      "locked": false,
      "visible": true,
      "opacity": 0.85,
      "transform": {
        "x": 110, "y": 95, "width": 208, "height": 18,
        "rotation": 0
      },
      "props": {
        "text": "Join 5,000+ designers and developers for three days of inspiration, learning, and connection.",
        "variant": "paragraph",
        "fontSize": 5,
        "color": "#cbd5e1",
        "textAlign": "center",
        "lineHeight": 1.6
      }
    },
    "ev-date-card": {
      "id": "ev-date-card",
      "type": "promo-card",
      "zIndex": 11,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 167, "y": 124, "width": 95, "height": 35,
        "rotation": 0
      },
      "props": {
        "title": "June 15–17, 2026",
        "subtitle": "San Francisco, CA",
        "ctaText": "",
        "gradientFrom": "#7c3aed",
        "gradientTo": "#2563eb",
        "textColor": "#ffffff",
        "borderRadius": 4
      }
    },
    "ev-cta": {
      "id": "ev-cta",
      "type": "button",
      "zIndex": 10,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 152, "y": 172, "width": 59, "height": 16,
        "rotation": 0
      },
      "props": {
        "text": "Register Now",
        "variant": "filled",
        "bgColor": "#f59e0b",
        "textColor": "#1a1a2e",
        "borderRadius": 3,
        "fontSize": 4,
        "fontWeight": "700"
      }
    },
    "ev-cta2": {
      "id": "ev-cta2",
      "type": "button",
      "zIndex": 10,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 217, "y": 172, "width": 59, "height": 16,
        "rotation": 0
      },
      "props": {
        "text": "View Speakers",
        "variant": "outline",
        "bgColor": "#ffffff",
        "textColor": "#ffffff",
        "borderRadius": 3,
        "fontSize": 4,
        "fontWeight": "600"
      }
    },
    "ev-det-title": {
      "id": "ev-det-title",
      "type": "heading",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 35, "y": 255, "width": 148, "height": 15,
        "rotation": 0
      },
      "props": {
        "text": "Why Attend?",
        "variant": "heading",
        "fontSize": 8,
        "fontWeight": "700",
        "color": "#1a1a2e",
        "textAlign": "left",
        "lineHeight": 1.2
      }
    },
    "ev-det-text": {
      "id": "ev-det-text",
      "type": "text",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 35, "y": 274, "width": 148, "height": 35,
        "rotation": 0
      },
      "props": {
        "text": "Get hands-on with the latest tools, learn from industry experts, and network with the best in the business. Three days of workshops, keynotes, and unforgettable experiences.",
        "variant": "paragraph",
        "fontSize": 4,
        "color": "#64748b",
        "textAlign": "left",
        "lineHeight": 1.7
      }
    },
    "ev-promo": {
      "id": "ev-promo",
      "type": "promo-card",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 237, "y": 250, "width": 148, "height": 101,
        "rotation": 0
      },
      "props": {
        "title": "Early Bird Pricing",
        "subtitle": "Save 40% when you register before May 1st. Includes full access to all sessions and workshops.",
        "ctaText": "Get Early Bird Pass",
        "bgImage": "",
        "gradientFrom": "#1e40af",
        "gradientTo": "#7c3aed",
        "textColor": "#ffffff",
        "borderRadius": 5
      }
    },
    "ev-social": {
      "id": "ev-social",
      "type": "social-group",
      "zIndex": 5,
      "locked": false,
      "visible": true,
      "opacity": 1,
      "transform": {
        "x": 35, "y": 344, "width": 72, "height": 15,
        "rotation": 0
      },
      "props": {
        "platforms": [
          "twitter",
          "instagram",
          "linkedin",
          "youtube"
        ],
        "iconSize": 9,
        "gap": 3,
        "iconColor": "#ffffff",
        "iconBg": "#1a1a2e",
        "borderRadius": 260
      }
    }
  }
};

export const campaignEventTemplate: Template = {
  meta: {
    id: "campaign-event",
    name: "Event Announcement",
    description: "Campaign/event announcement with date card overlay, early bird promo, and speaker CTA.",
    category: "event",
    tags: ["event", "campaign", "conference", "announcement"],
  },
  data: doc,
};
