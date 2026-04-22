const fs = require("fs");
const path = require("path");

const TEMPLATES_DIR = path.resolve(__dirname, "../packages/editor/src/templates");

const files = [
  "product-promo.ts",
  "campaign-event.ts",
  "brand-intro.ts",
  "social-share.ts",
  "redbull-showcase.ts",
  "sprite-showcase.ts",
  "cocacola-showcase.ts",
  "beer-showcase.ts",
  "kothmale-showcase.ts"
];

function transformFile(filename) {
  const filePath = path.join(TEMPLATES_DIR, filename);
  if (!fs.existsSync(filePath)) return;
  
  let code = fs.readFileSync(filePath, "utf-8");

  const scale = 375 / 1440;

  // 1. Process elements object to scale coordinates
  let elementsSectionStart = code.lastIndexOf("elements: {");
  if (elementsSectionStart === -1) return;

  // Scale object properties
  code = code.replace(/transform:\s*{\s*x:\s*([\d\.-]+),\s*y:\s*([\d\.-]+),\s*width:\s*([\d\.-]+),\s*height:\s*([\d\.-]+),\s*rotation:\s*([\d\.-]+)\s*}/g, (match, x, y, w, h, r) => {
    return `transform: { x: ${Math.round(parseFloat(x) * scale)}, y: ${Math.round(parseFloat(y) * scale)}, width: ${Math.round(parseFloat(w) * scale)}, height: ${Math.round(parseFloat(h) * scale)}, rotation: ${r} }`;
  });

  const propsToScale = ["fontSize", "padding", "gap", "iconSize", "borderRadius"];
  for (const prop of propsToScale) {
    const regex = new RegExp(`(${prop}:\\s*)([\\d\\.-]+)`, "g");
    code = code.replace(regex, (match, prefix, val) => {
      return `${prefix}${Math.max(1, Math.round(parseFloat(val) * scale))}`;
    });
  }

  // 2. We need to handle `const W = 1440;`
  code = code.replace(/const W = 1440;/g, `const W = 375;`);
  code = code.replace(/width:\s*1440/g, `width: 375`);

  // 3. Combine artboards into ONE.
  // We'll find all artboard blocks.
  const artboardRegex = /{\s*id:\s*['"]([^'"]+)['"][\s\S]*?height:\s*([\d\.-]+)[\s\S]*?elements:\s*\[([\s\S]*?)\]\s*,?\s*}/g;
  
  let match;
  let totalHeight = 0;
  let allElements = [];
  let firstAbId = null;
  let firstAbName = null;
  let firstAbBg = null;
  let firstAbBgImg = null;

  let artboardsBlockStart = code.indexOf("artboards: [");
  if (artboardsBlockStart === -1) return;
  // find matching closing bracket for artboards
  let openBrackets = 0;
  let artboardsBlockEnd = artboardsBlockStart + 11;
  while (artboardsBlockEnd < code.length) {
    if (code[artboardsBlockEnd] === '[') openBrackets++;
    if (code[artboardsBlockEnd] === ']') openBrackets--;
    if (openBrackets === 0) break;
    artboardsBlockEnd++;
  }
  
  const artboardsContent = code.substring(artboardsBlockStart, artboardsBlockEnd + 1);

  // Parse sequential artboards
  // Wait, if we just combine them, elements on artboard 2 need their Y coordinates shifted down by artboard 1's height.
  // But our regex above ALREADY scaled the initial Y coordinates AND height across the whole file. 
  // Let me rethink: if the original was:
  // AB1: height 1000
  // AB2: height 800. Element on AB2 at Y=50 inside AB2
  // But wait, the flat elements map uses relative coordinates to their artboard container?
  // Let's check `artboard.tsx`. The elements are mapped into the artboard. Their transform is relative to the artboard!
  // If we merge all artboards into one giant artboard, an element that was originally y=40 on AB2 (which starts below AB1) 
  // must now have its Y = 40 + (AB1 height) !!!
  // So we CANNOT just globally string-replace without knowing which element belongs to which artboard.
  
  console.log(`Skipped simple transform for ${filename} (need context aware Y shifting)`);
}

for (const file of files) {
  try {
    transformFile(file);
  } catch (e) {
    console.error("Error transforming ", file, e);
  }
}
