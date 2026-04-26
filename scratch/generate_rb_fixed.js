const doc = {
  version: 1,
  pageTitle: "Red Bull Energy Drink",
  artboards: [
    {
      id: "rb-hero-merged",
      name: "Canvas",
      width: 428,
      height: 1700,
      backgroundColor: "#b2bcd1",
      backgroundImage: "",
      position: 0,
      elements: [
        "bg-splash", "top-lang", "hero-can",
        "main-card", "logo-img", "main-title",
        "var-250", "var-473", "var-355", "var-4cans",
        "desc", "btn-feedback",
        "soc-1", "soc-2", "soc-3", "soc-4",
        "separator", "about-title", "about-desc", "btn-readmore",
        "ben-card", "ben-title", "ben-ic-1", "ben-tx-1", "ben-ic-2", "ben-tx-2", "ben-ic-3", "ben-tx-3",
        "rec-card", "rec-ic", "rec-title", "rec-desc",
        "rdy-card", "rdy-title", "rdy-img",
        "oth-card", "oth-title", 
        "oth-bg-1", "oth-img-1", "oth-tx-1", "oth-sub-1",
        "oth-bg-2", "oth-img-2", "oth-tx-2", "oth-sub-2",
        "btn-viewall",
        "bot-banner", "bot-title", "bot-btn",
        "footer-bar", "footer-lock", "footer-link", "footer-share"
      ]
    }
  ],
  elements: {}
};

function addElement(id, type, zIndex, x, y, w, h, props) {
  doc.elements[id] = {
    id, type, zIndex, locked: false, visible: true, opacity: 1,
    transform: { x, y, width: w, height: h, rotation: 0 },
    props
  };
}

// Background
addElement("bg-splash", "image", 1, 0, 0, 428, 380, { src: "", alt: "Splash", objectFit: "cover", borderRadius: 0 });

// Top badge
addElement("top-lang", "button", 10, 320, 55, 84, 32, { text: "English ▾", variant: "filled", bgColor: "#ffffff", textColor: "#374151", borderRadius: 8, fontSize: 13, fontWeight: "500" });

// Hero Can
addElement("hero-can", "image", 5, 144, 30, 140, 300, { src: "", alt: "Red Bull Can", objectFit: "contain", borderRadius: 0 });

// Main Card
addElement("main-card", "card", 2, 18, 160, 392, 570, { bgColor: "#ffffff", borderRadius: 16, shadow: "lg", borderWidth: 0, padding: 0 });

// Logo inside Main Card
addElement("logo-img", "image", 5, 34, 180, 100, 24, { src: "", alt: "Red Bull Logo", objectFit: "contain", borderRadius: 0 });

// Main Title
addElement("main-title", "heading", 5, 34, 215, 360, 30, { text: "Red Bull Energy Drink", variant: "heading", fontSize: 22, fontWeight: "800", color: "#1a1a2e", textAlign: "left", lineHeight: 1.2 });

// Variants
addElement("var-250", "button", 5, 34, 260, 60, 28, { text: "250 ml", variant: "filled", bgColor: "#e5e7eb", textColor: "#1f2937", borderRadius: 6, fontSize: 12, fontWeight: "600" });
addElement("var-473", "button", 5, 104, 260, 60, 28, { text: "473 ml", variant: "filled", bgColor: "#f3f4f6", textColor: "#4b5563", borderRadius: 6, fontSize: 12, fontWeight: "500" });
addElement("var-355", "button", 5, 174, 260, 60, 28, { text: "355 ml", variant: "filled", bgColor: "#f3f4f6", textColor: "#4b5563", borderRadius: 6, fontSize: 12, fontWeight: "500" });
addElement("var-4cans", "button", 5, 244, 260, 60, 28, { text: "4 cans", variant: "filled", bgColor: "#fafafa", textColor: "#d1d5db", borderRadius: 6, fontSize: 12, fontWeight: "500" });

// Desc
addElement("desc", "text", 5, 34, 305, 360, 40, { text: "The original Red Bull Energy Drink. Giving wiiings to people and ideas since 1987.", variant: "paragraph", fontSize: 14, color: "#4b5563", textAlign: "left", lineHeight: 1.5 });

// Feedback button
addElement("btn-feedback", "button", 5, 34, 360, 360, 44, { text: "Feedback / Inquiry", variant: "filled", bgColor: "#3b5998", textColor: "#ffffff", borderRadius: 10, fontSize: 14, fontWeight: "600" });

// Social icons (using image blocks for them per instruction "use image blocks emply for images")
addElement("soc-1", "image", 5, 34, 420, 80, 44, { src: "", alt: "Globe", objectFit: "contain", borderRadius: 8 });
addElement("soc-2", "image", 5, 128, 420, 80, 44, { src: "", alt: "Facebook", objectFit: "contain", borderRadius: 8 });
addElement("soc-3", "image", 5, 222, 420, 80, 44, { src: "", alt: "Instagram", objectFit: "contain", borderRadius: 8 });
addElement("soc-4", "image", 5, 316, 420, 78, 44, { src: "", alt: "LinkedIn", objectFit: "contain", borderRadius: 8 });

// Separator
addElement("separator", "container", 5, 34, 480, 360, 1, { bgGradientFrom: "#e5e7eb", bgGradientTo: "#e5e7eb" });

// About title
addElement("about-title", "heading", 5, 34, 500, 360, 20, { text: "About Red Bull Energy Drink", variant: "heading", fontSize: 15, fontWeight: "700", color: "#1a1a2e", textAlign: "left", lineHeight: 1.2 });
addElement("about-desc", "text", 5, 34, 525, 360, 60, { text: "Red Bull Energy Drink is appreciated worldwide by top athletes, busy professionals, college students and travelers on long journeys.", variant: "paragraph", fontSize: 14, color: "#4b5563", textAlign: "left", lineHeight: 1.5 });

// Read more btn
addElement("btn-readmore", "button", 5, 34, 600, 360, 40, { text: "Read more", variant: "outline", bgColor: "#ffffff", textColor: "#111827", borderRadius: 8, fontSize: 14, fontWeight: "600" });

// Benefits Card
addElement("ben-card", "card", 2, 18, 745, 240, 140, { bgColor: "#ffffff", borderRadius: 12, shadow: "md", borderWidth: 0, padding: 0 });
addElement("ben-title", "text", 5, 34, 760, 200, 20, { text: "Benefits", variant: "paragraph", fontSize: 14, color: "#6b7280", textAlign: "left", lineHeight: 1.2 });
addElement("ben-ic-1", "image", 5, 34, 790, 18, 18, { src: "", alt: "icon", objectFit: "contain", borderRadius: 0 });
addElement("ben-tx-1", "text", 5, 62, 792, 180, 18, { text: "Stay alert", variant: "paragraph", fontSize: 14, color: "#111827", textAlign: "left", lineHeight: 1.2, fontWeight: "600" });
addElement("ben-ic-2", "image", 5, 34, 820, 18, 18, { src: "", alt: "icon", objectFit: "contain", borderRadius: 0 });
addElement("ben-tx-2", "text", 5, 62, 822, 180, 18, { text: "Reduce fatigue", variant: "paragraph", fontSize: 14, color: "#111827", textAlign: "left", lineHeight: 1.2, fontWeight: "600" });
addElement("ben-ic-3", "image", 5, 34, 850, 18, 18, { src: "", alt: "icon", objectFit: "contain", borderRadius: 0 });
addElement("ben-tx-3", "text", 5, 62, 852, 180, 18, { text: "Kickstart your day", variant: "paragraph", fontSize: 14, color: "#111827", textAlign: "left", lineHeight: 1.2, fontWeight: "600" });

// Recipe Card
addElement("rec-card", "card", 2, 270, 745, 140, 140, { bgColor: "#ffffff", borderRadius: 12, shadow: "md", borderWidth: 0, padding: 0 });
addElement("rec-ic", "image", 5, 286, 765, 20, 20, { src: "", alt: "icon", objectFit: "contain", borderRadius: 0 });
addElement("rec-title", "heading", 5, 286, 800, 110, 20, { text: "Recipe book", variant: "heading", fontSize: 14, fontWeight: "700", color: "#111827", textAlign: "left", lineHeight: 1.2 });
addElement("rec-desc", "text", 5, 286, 825, 110, 30, { text: "20 pages\n1.4 MB", variant: "paragraph", fontSize: 12, color: "#6b7280", textAlign: "left", lineHeight: 1.4 });

// Ready to take off Card
addElement("rdy-card", "card", 2, 18, 900, 392, 240, { bgColor: "#ffffff", borderRadius: 12, shadow: "md", borderWidth: 0, padding: 0 });
addElement("rdy-title", "text", 5, 34, 915, 360, 20, { text: "Ready to take off?", variant: "paragraph", fontSize: 14, color: "#6b7280", textAlign: "left", lineHeight: 1.2 });
addElement("rdy-img", "image", 5, 34, 945, 360, 180, { src: "", alt: "Illustration", objectFit: "cover", borderRadius: 8 });

// Other Drinks Card
addElement("oth-card", "card", 2, 18, 1155, 392, 260, { bgColor: "#ffffff", borderRadius: 12, shadow: "md", borderWidth: 0, padding: 0 });
addElement("oth-title", "text", 5, 34, 1170, 360, 20, { text: "Other Red Bull Drinks", variant: "paragraph", fontSize: 14, color: "#6b7280", textAlign: "left", lineHeight: 1.2 });

addElement("oth-bg-1", "card", 3, 34, 1205, 172, 120, { bgColor: "#eaf2fb", borderRadius: 8, shadow: "none", borderWidth: 0, padding: 0 });
addElement("oth-img-1", "image", 5, 70, 1215, 100, 110, { src: "", alt: "Can 1", objectFit: "contain", borderRadius: 0 });
addElement("oth-tx-1", "heading", 5, 34, 1340, 172, 18, { text: "Red Bull Zero", variant: "heading", fontSize: 14, fontWeight: "600", color: "#111827", textAlign: "center", lineHeight: 1.2 });
addElement("oth-sub-1", "text", 5, 34, 1360, 172, 16, { text: "Red Bull Zero", variant: "paragraph", fontSize: 12, color: "#6b7280", textAlign: "center", lineHeight: 1.2 });

addElement("oth-bg-2", "card", 3, 222, 1205, 172, 120, { bgColor: "#0099e5", borderRadius: 8, shadow: "none", borderWidth: 0, padding: 0 });
addElement("oth-img-2", "image", 5, 258, 1215, 100, 110, { src: "", alt: "Can 2", objectFit: "contain", borderRadius: 0 });
addElement("oth-tx-2", "heading", 5, 222, 1340, 172, 18, { text: "Sugar-free energy drink", variant: "heading", fontSize: 13, fontWeight: "600", color: "#111827", textAlign: "center", lineHeight: 1.2 });
addElement("oth-sub-2", "text", 5, 222, 1360, 172, 16, { text: "Sugar-free energy drink", variant: "paragraph", fontSize: 12, color: "#6b7280", textAlign: "center", lineHeight: 1.2 });

addElement("btn-viewall", "button", 5, 34, 1390, 360, 40, { text: "View all", variant: "outline", bgColor: "#ffffff", textColor: "#111827", borderRadius: 8, fontSize: 14, fontWeight: "600" });

// Bottom Banner
addElement("bot-banner", "image", 2, 18, 1430, 392, 160, { src: "", alt: "Banner", objectFit: "cover", borderRadius: 12 });
addElement("bot-title", "heading", 5, 50, 1465, 328, 60, { text: "Giving wiiings to\npeople & ideas\nsince 1987", variant: "heading", fontSize: 22, fontWeight: "800", color: "#ffffff", textAlign: "center", lineHeight: 1.2 });
addElement("bot-btn", "button", 5, 164, 1540, 100, 26, { text: "Red Bull GmbH", variant: "filled", bgColor: "#e30022", textColor: "#ffffff", borderRadius: 13, fontSize: 10, fontWeight: "600" });

// Footer Bar
addElement("footer-bar", "card", 2, 0, 1610, 428, 60, { bgColor: "#405282", borderRadius: 0, shadow: "none", borderWidth: 0, padding: 0 });
addElement("footer-lock", "image", 5, 130, 1630, 12, 16, { src: "", alt: "Lock", objectFit: "contain", borderRadius: 0 });
addElement("footer-link", "text", 5, 150, 1630, 140, 20, { text: "store.redbull.com", variant: "paragraph", fontSize: 15, color: "#d1d5db", textAlign: "left", lineHeight: 1.2 });
addElement("footer-share", "image", 5, 380, 1625, 20, 24, { src: "", alt: "Share", objectFit: "contain", borderRadius: 0 });

const tsCode = `import type { CanvasDocument, Template } from "@productix/types";

const doc: CanvasDocument = ${JSON.stringify(doc, null, 2)};

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
`;

require('fs').writeFileSync('packages/editor/src/templates/redbull-showcase.ts', tsCode);
