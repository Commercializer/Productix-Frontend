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
  
  let originalCode = fs.readFileSync(filePath, "utf-8");

  // 1. Strip all TS imports and types to make it eval-able
  let jsCode = originalCode;
  jsCode = jsCode.replace(/import type .*?from ".*?";\n/g, "");
  jsCode = jsCode.replace(/import {.*?}.*?from ".*?";\n/g, "");
  jsCode = jsCode.replace(/const doc: CanvasDocument =/g, "const doc =");
  jsCode = jsCode.replace(/export const .*?: Template =/g, "global.templateData =");
  jsCode = jsCode.replace(/const W = 1440;/g, "const W = 1440;"); // keep it 1440 for eval, we will scale the resulting obj

  // Evaluate the JS code to get the javascript object in global.templateData
  try {
    eval(jsCode);
  } catch (e) {
    console.error(`Failed to eval ${filename}: `, e.message);
    return;
  }

  const template = global.templateData;
  if (!template || !template.data || !template.data.artboards) return;

  const doc = template.data;
  const SCALE = 375 / 1440;

  // We have the doc object. We will merge artboards into one.
  const oldArtboards = doc.artboards;
  const newArtboard = {
    id: oldArtboards[0].id + "-merged",
    name: "Canvas",
    width: 375,
    height: 0,
    backgroundColor: oldArtboards[0].backgroundColor,
    backgroundImage: oldArtboards[0].backgroundImage,
    position: 0,
    elements: []
  };

  let currentYOffset = 0;

  for (const ab of oldArtboards) {
    // Collect all elements for this artboard
    newArtboard.elements.push(...ab.elements);
    
    // For each element on this artboard, shift its Y and scale it
    for (const elId of ab.elements) {
      const el = doc.elements[elId];
      if (!el) continue;
      
      // Shift Y by current offset BEFORE scaling down
      el.transform.y += currentYOffset;

      // Now scale everything
      el.transform.x = Math.round(el.transform.x * SCALE);
      el.transform.y = Math.round(el.transform.y * SCALE);
      el.transform.width = Math.round(el.transform.width * SCALE);
      el.transform.height = Math.round(el.transform.height * SCALE);

      if (el.props) {
        if (el.props.fontSize) el.props.fontSize = Math.max(1, Math.round(el.props.fontSize * SCALE));
        if (el.props.padding) el.props.padding = Math.max(1, Math.round(el.props.padding * SCALE));
        if (el.props.gap) el.props.gap = Math.max(1, Math.round(el.props.gap * SCALE));
        if (el.props.iconSize) el.props.iconSize = Math.max(1, Math.round(el.props.iconSize * SCALE));
        if (el.props.borderRadius) el.props.borderRadius = Math.max(0, Math.round(el.props.borderRadius * SCALE));
      }
    }

    currentYOffset += ab.height;
  }

  newArtboard.height = Math.round(currentYOffset * SCALE);

  // Update doc structure
  doc.artboards = [newArtboard];

  // We need to rewrite the .ts file
  // Stringify the doc object
  const docString = JSON.stringify(doc, null, 2);

  // Rebuild the file content
  const tplNameMatch = originalCode.match(/export const (.*?): Template =/);
  const tplName = tplNameMatch ? tplNameMatch[1] : filename.replace(".ts", "Template").replace(/-./g, x=>x[1].toUpperCase());

  // We extract the meta component
  const metaMatch = originalCode.match(/meta:\s*{[\s\S]*?},/);
  const metaCode = metaMatch ? metaMatch[0] : `meta: ${JSON.stringify(template.meta, null, 2)},`;

  const newCode = `/* ─────────────────────────────────────────────
 * ${template.meta.name} Template - Mobile-first canvas
 * ──────────────────────────────────────────── */

import type { CanvasDocument, Template } from "@productix/types";

const doc: CanvasDocument = ${docString};

export const ${tplName}: Template = {
  ${metaCode}
  data: doc,
};
`;

  fs.writeFileSync(filePath, newCode, "utf-8");
  console.log(`Successfully rewrote ${filename} as single mobile-canvas`);
}

for (const file of files) {
  try {
    transformFile(file);
  } catch (e) {
    console.error("Error transforming ", file, e);
  }
}
