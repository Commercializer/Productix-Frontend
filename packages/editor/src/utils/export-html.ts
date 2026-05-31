/* ─────────────────────────────────────────────
 * Export HTML - Standalone responsive page export
 *
 * Generates production-ready HTML/CSS that works
 * independently in any browser without React.
 *
 * Features:
 * - Full HTML5 document with viewport meta tag
 * - Mobile-first responsive CSS with media queries
 * - Semantic HTML structure
 * - Google Fonts integration
 * - No JavaScript runtime required
 * - Proper viewport scaling for real devices
 * - Prevents horizontal overflow on mobile
 * ──────────────────────────────────────────── */

import type { CanvasDocument, ElementNode, Artboard } from "@productix/types";
import { DEFAULT_FLEX_CONTAINER } from "@productix/types";
import { generateResponsiveStylesheet } from "../engine/layout-engine";

/* ─── Element HTML Generators ──────────────── */

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Like escapeHtml, but preserves user-entered line breaks as <br>. */
function escapeHtmlMultiline(str: string): string {
  return escapeHtml(str).replace(/\r\n|\r|\n/g, "<br>");
}

/* ─── Shape geometry (mirrors elements/shapes-catalog) ─── */

type ShapeGeom =
  | { kind: "rect" }
  | { kind: "ellipse" }
  | { kind: "line" }
  | { kind: "polygon"; points: string }
  | { kind: "path"; d: string };

const SHAPE_GEOM: Record<string, ShapeGeom> = {
  "rectangle": { kind: "rect" },
  "rounded-rectangle": { kind: "rect" },
  "ellipse": { kind: "ellipse" },
  "triangle": { kind: "polygon", points: "50,2 98,98 2,98" },
  "right-triangle": { kind: "polygon", points: "2,2 2,98 98,98" },
  "diamond": { kind: "polygon", points: "50,2 98,50 50,98 2,50" },
  "pentagon": { kind: "polygon", points: "50,2 98,38 80,98 20,98 2,38" },
  "hexagon": { kind: "polygon", points: "25,3 75,3 98,50 75,97 25,97 2,50" },
  "star": { kind: "polygon", points: "50,2 64.7,30 97.5,34.5 73.8,57.7 79.4,90.5 50,75 20.6,90.5 26.2,57.7 2.5,34.5 35.3,30" },
  "heart": { kind: "path", d: "M50,90 C50,90 8,58 8,32 C8,17 20,8 32,8 C42,8 48,17 50,24 C52,17 58,8 68,8 C80,8 92,17 92,32 C92,58 50,90 50,90 Z" },
  "arrow-right": { kind: "polygon", points: "2,32 60,32 60,8 98,50 60,92 60,68 2,68" },
  "parallelogram": { kind: "polygon", points: "25,3 98,3 75,97 2,97" },
  "trapezoid": { kind: "polygon", points: "25,3 75,3 98,97 2,97" },
  "cross": { kind: "polygon", points: "35,2 65,2 65,35 98,35 98,65 65,65 65,98 35,98 35,65 2,65 2,35 35,35" },
  "semicircle": { kind: "path", d: "M2,98 A48,48 0 0 1 98,98 Z" },
  "line": { kind: "line" },
};

function shapeToHtml(p: Record<string, unknown>): string {
  const variant = (p.variant as string) || "rectangle";
  const geom = SHAPE_GEOM[variant] ?? SHAPE_GEOM.rectangle!;
  const fill = (p.fill as string) || "#8b5cf6";
  const stroke = (p.stroke as string) || "#1a1a2e";
  const strokeWidth = (p.strokeWidth as number) || 0;
  const radius = (p.radius as number) || 0;
  const lineStyle = (p.lineStyle as string) || "solid";

  if (geom.kind === "rect") {
    const border = strokeWidth > 0 ? `border:${strokeWidth}px solid ${stroke};` : "";
    return `<div style="width:100%;height:100%;background:${fill};border-radius:${radius}px;${border}box-sizing:border-box;"></div>`;
  }
  if (geom.kind === "ellipse") {
    const border = strokeWidth > 0 ? `border:${strokeWidth}px solid ${stroke};` : "";
    return `<div style="width:100%;height:100%;background:${fill};border-radius:50%;${border}box-sizing:border-box;"></div>`;
  }
  if (geom.kind === "line") {
    const thickness = strokeWidth || 3;
    const dash =
      lineStyle === "dashed" ? `stroke-dasharray:${Math.max(6, thickness * 3)} ${Math.max(4, thickness * 2)};`
      : lineStyle === "dotted" ? `stroke-dasharray:0 ${Math.max(4, thickness * 2)};stroke-linecap:round;`
      : "";
    return `<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style="display:block;overflow:visible;"><line x1="0" y1="50" x2="100" y2="50" stroke="${stroke}" stroke-width="${thickness}" style="${dash}" vector-effect="non-scaling-stroke" /></svg>`;
  }
  const strokeAttrs = strokeWidth > 0
    ? `stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round" vector-effect="non-scaling-stroke"`
    : "";
  const inner = geom.kind === "polygon"
    ? `<polygon points="${geom.points}" fill="${fill}" ${strokeAttrs} />`
    : `<path d="${geom.d}" fill="${fill}" ${strokeAttrs} />`;
  return `<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style="display:block;overflow:visible;">${inner}</svg>`;
}

/**
 * Generate HTML for a single element based on its type and props.
 */
function elementToHtml(el: ElementNode, isFlowMode: boolean): string {
  const type = el.type;
  const p = el.props as Record<string, unknown>;

  switch (type) {
    case "text":
    case "heading": {
      const text = (p.text as string) || "";
      const fontSize = (p.fontSize as number) || 16;
      const fontWeight = (p.fontWeight as string) || "400";
      const color = (p.color as string) || "#1a1a2e";
      const textAlign = (p.textAlign as string) || "left";
      const lineHeight = (p.lineHeight as number) || 1.5;
      const variant = (p.variant as string) || "paragraph";
      const actualFontSize = variant === "heading" ? Math.max(fontSize, 24) : fontSize;
      const actualFontWeight = variant === "heading" ? "700" : fontWeight;
      const tag = variant === "heading" ? "h2" : "p";
      return `<${tag} style="font-size:${actualFontSize}px;font-weight:${actualFontWeight};color:${color};text-align:${textAlign};line-height:${lineHeight};margin:0;padding:4px;word-break:break-word;white-space:pre-wrap;width:100%;">${escapeHtmlMultiline(text)}</${tag}>`;
    }

    case "image": {
      const src = (p.src as string) || "";
      const alt = (p.alt as string) || "";
      const objectFit = (p.objectFit as string) || "cover";
      const objectPosition = (p.objectPosition as string) || "center";
      const borderRadius = (p.borderRadius as number) || 0;
      const cropRect = p.cropRect as { x: number; y: number; w: number; h: number } | undefined;
      if (!src) return `<div style="width:100%;height:100%;background:#f3f4f6;display:flex;align-items:center;justify-content:center;border-radius:${borderRadius}px;"><span style="color:#9ca3af;font-size:14px;">🖼️ No image</span></div>`;
      if (cropRect) {
        // Cropped region is stretched to fill the block. Static HTML can't
        // know the source image's intrinsic size, so objectFit on top of the
        // crop is approximated as "fill" - the canvas editor honors objectFit
        // precisely.
        const cw = Math.max(0.0001, cropRect.w);
        const ch = Math.max(0.0001, cropRect.h);
        const sizePct = `${(100 / cw).toFixed(4)}% ${(100 / ch).toFixed(4)}%`;
        const posX = cw >= 0.9999 ? "0%" : `${((cropRect.x / (1 - cw)) * 100).toFixed(4)}%`;
        const posY = ch >= 0.9999 ? "0%" : `${((cropRect.y / (1 - ch)) * 100).toFixed(4)}%`;
        return `<div role="img" aria-label="${escapeHtml(alt)}" style="width:100%;height:100%;background-image:url('${escapeHtml(src)}');background-repeat:no-repeat;background-size:${sizePct};background-position:${posX} ${posY};border-radius:${borderRadius}px;"></div>`;
      }
      return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" style="width:100%;height:100%;object-fit:${objectFit};object-position:${objectPosition};border-radius:${borderRadius}px;display:block;" loading="lazy" />`;
    }

    case "button": {
      const text = (p.text as string) || "Click Me";
      const bgColor = (p.bgColor as string) || "#3b82f6";
      const textColor = (p.textColor as string) || "#ffffff";
      const borderRadius = (p.borderRadius as number) || 8;
      const fontSize = (p.fontSize as number) || 15;
      const fontWeight = (p.fontWeight as string) || "600";
      const url = (p.url as string) || "#";
      const variant = (p.variant as string) || "filled";
      // Shadow
      const shadowEnabled = !!p.shadowEnabled;
      const shadowColor = (p.shadowColor as string) || "rgba(0,0,0,0.25)";
      const shadowX = (p.shadowX as number) ?? 0;
      const shadowY = (p.shadowY as number) ?? 4;
      const shadowBlur = (p.shadowBlur as number) ?? 12;
      const shadowSpread = (p.shadowSpread as number) ?? 0;
      const shadowStyle = shadowEnabled
        ? `box-shadow:${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px ${shadowColor};`
        : "";
      const baseStyle = `display:inline-flex;align-items:center;justify-content:center;padding:12px 24px;border-radius:${borderRadius}px;font-size:${fontSize}px;font-weight:${fontWeight};text-decoration:none;cursor:pointer;transition:opacity 0.15s;width:100%;box-sizing:border-box;${shadowStyle}`;
      const variantStyle = variant === "filled"
        ? `background:${bgColor};color:${textColor};border:none;`
        : variant === "outline"
          ? `background:transparent;color:${bgColor};border:2px solid ${bgColor};`
          : `background:transparent;color:${bgColor};border:none;text-decoration:underline;`;
      return `<a href="${escapeHtml(url)}" style="${baseStyle}${variantStyle}">${escapeHtml(text)}</a>`;
    }

    case "container": {
      const bgColor = (p.bgColor as string) || "transparent";
      const borderRadius = (p.borderRadius as number) || 0;
      const bgImage = (p.bgImage as string) || "";
      const overlayColor = (p.overlayColor as string) || "";
      const overlayOpacity = (p.overlayOpacity as number) ?? 0.5;
      let html = `<div style="width:100%;height:100%;background:${bgColor};border-radius:${borderRadius}px;position:relative;overflow:hidden;">`;
      if (bgImage) {
        html += `<img src="${escapeHtml(bgImage)}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;" loading="lazy" />`;
        if (overlayColor) {
          html += `<div style="position:absolute;inset:0;background:${overlayColor};opacity:${overlayOpacity};z-index:1;"></div>`;
        }
      }
      html += `</div>`;
      return html;
    }

    case "row": {
      const gap = (p.gap as number) ?? 16;
      const justify = (p.justifyContent as string) || "flex-start";
      const align = (p.alignItems as string) || "stretch";
      const wrap = (p.wrap as string) || "wrap";
      const padding = (p.padding as number) ?? 16;
      const bgColor = (p.bgColor as string) || "transparent";
      const borderRadius = (p.borderRadius as number) ?? 0;
      return `<div style="display:flex;flex-direction:row;flex-wrap:${wrap};justify-content:${justify};align-items:${align};gap:${gap}px;padding:${padding}px;background:${bgColor};border-radius:${borderRadius}px;width:100%;box-sizing:border-box;"></div>`;
    }

    case "column": {
      const padding = (p.padding as number) ?? 16;
      const bgColor = (p.bgColor as string) || "transparent";
      const borderRadius = (p.borderRadius as number) ?? 0;
      const minWidth = (p.minWidth as number) ?? 200;
      return `<div style="flex:1;min-width:${minWidth}px;padding:${padding}px;background:${bgColor};border-radius:${borderRadius}px;box-sizing:border-box;"></div>`;
    }

    case "divider": {
      const color = (p.color as string) || "#e5e7eb";
      const thickness = (p.thickness as number) || 1;
      const style = (p.style as string) || "solid";
      return `<hr style="border:none;border-top:${thickness}px ${style} ${color};margin:8px 0;width:100%;" />`;
    }

    case "icon": {
      const iconName = (p.icon as string) || "Star";
      const iconSize = (p.fontSize as number) || (p.size as number) || 48;
      const color = (p.color as string) || "#3b82f6";
      const bgColor = (p.bgColor as string) || "transparent";
      const borderRadius = (p.borderRadius as number) || 12;
      const isEmojiIcon = /^[\p{Emoji}\u200d\ufe0f]/u.test(iconName);
      const grayscale = !!p.grayscale;
      const gsFilter = grayscale && isEmojiIcon ? "filter:grayscale(1);" : "";
      if (isEmojiIcon) {
        return `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:${bgColor};border-radius:${borderRadius}px;${gsFilter}"><span style="font-size:${iconSize}px;line-height:1;">${iconName}</span></div>`;
      }
      const svgUrl = `https://unpkg.com/lucide-static@latest/icons/${iconName.replace(/([A-Z])/g, (m: string, c: string, i: number) => (i ? "-" : "") + c.toLowerCase())}.svg`;
      return `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:${bgColor};border-radius:${borderRadius}px;"><img src="${svgUrl}" alt="${escapeHtml(iconName)}" width="${iconSize}" height="${iconSize}" style="filter:brightness(0) saturate(100%);color:${color};" /></div>`;
    }

    case "shape": {
      return shapeToHtml(p);
    }

    case "carousel": {
      // Static export: a JS-free horizontal scroll-snap carousel. Slides
      // are swipeable; autoplay/arrows are editor/live-renderer only.
      const slides = (Array.isArray(p.slides) ? p.slides : []) as Array<{
        src?: string;
        alt?: string;
        caption?: string;
        cropRect?: { x: number; y: number; w: number; h: number };
      }>;
      const objectFit = (p.objectFit as string) === "contain" ? "contain" : "cover";
      const borderRadius = (p.borderRadius as number) ?? 12;
      const bgColor = (p.bgColor as string) || "#000000";
      const captionColor = (p.captionColor as string) || "#ffffff";
      if (slides.length === 0) {
        return `<div style="width:100%;height:100%;background:#f3f4f6;display:flex;align-items:center;justify-content:center;border-radius:${borderRadius}px;"><span style="color:#9ca3af;font-size:14px;">🖼️ No slides</span></div>`;
      }
      const slidesHtml = slides
        .map((s) => {
          let media: string;
          if (!s.src) {
            media = `<div style="width:100%;height:100%;background:#f3f4f6;"></div>`;
          } else if (s.cropRect) {
            const cw = Math.max(0.0001, s.cropRect.w);
            const ch = Math.max(0.0001, s.cropRect.h);
            const sizePct = `${(100 / cw).toFixed(4)}% ${(100 / ch).toFixed(4)}%`;
            const posX = cw >= 0.9999 ? "0%" : `${((s.cropRect.x / (1 - cw)) * 100).toFixed(4)}%`;
            const posY = ch >= 0.9999 ? "0%" : `${((s.cropRect.y / (1 - ch)) * 100).toFixed(4)}%`;
            media = `<div role="img" aria-label="${escapeHtml(s.alt || "")}" style="width:100%;height:100%;background-image:url('${escapeHtml(s.src)}');background-repeat:no-repeat;background-size:${sizePct};background-position:${posX} ${posY};"></div>`;
          } else {
            media = `<img src="${escapeHtml(s.src)}" alt="${escapeHtml(s.alt || "")}" loading="lazy" style="width:100%;height:100%;object-fit:${objectFit};object-position:center;display:block;" />`;
          }
          const caption = s.caption
            ? `<div style="position:absolute;left:0;right:0;bottom:0;padding:28px 16px 14px;background:linear-gradient(transparent,rgba(0,0,0,0.6));color:${captionColor};font-size:14px;font-weight:600;line-height:1.3;">${escapeHtml(s.caption)}</div>`
            : "";
          return `<div style="position:relative;flex:0 0 100%;width:100%;height:100%;scroll-snap-align:start;overflow:hidden;">${media}${caption}</div>`;
        })
        .join("");
      return `<div style="display:flex;width:100%;height:100%;overflow-x:auto;scroll-snap-type:x mandatory;border-radius:${borderRadius}px;background:${bgColor};-webkit-overflow-scrolling:touch;scrollbar-width:none;">${slidesHtml}</div>`;
    }

    case "badge": {
      const text = (p.text as string) || "Badge";
      const bgColor = (p.bgColor as string) || "#3b82f6";
      const textColor = (p.textColor as string) || "#ffffff";
      const fontSize = (p.fontSize as number) || 12;
      return `<span style="display:inline-flex;align-items:center;padding:4px 12px;background:${bgColor};color:${textColor};font-size:${fontSize}px;font-weight:600;border-radius:999px;">${escapeHtml(text)}</span>`;
    }

    default: {
      // Generic fallback
      return `<div style="width:100%;height:100%;background:#f3f4f6;display:flex;align-items:center;justify-content:center;border-radius:4px;"><span style="color:#9ca3af;font-size:12px;">${type}</span></div>`;
    }
  }
}

/* ─── Full Page Export ─────────────────────── */

/**
 * Generate a complete, standalone HTML page from a canvas document.
 * The output is fully responsive and works on any device without
 * JavaScript.
 */
export function exportToHtml(doc: CanvasDocument): string {
  const responsiveCSS = generateResponsiveStylesheet(doc);

  const sections: string[] = [];

  for (const ab of doc.artboards) {
    const abElements = Object.values(doc.elements)
      .filter((el) => ab.elements.includes(el.id) && el.visible)
      .sort((a, b) => a.zIndex - b.zIndex);

    const flowElements = abElements.filter((el) => el.layout?.layoutMode === "flow");
    const absoluteElements = abElements.filter((el) => !el.layout || el.layout.layoutMode === "absolute");
    const hasFlow = flowElements.length > 0;

    // Build artboard styles
    const flexProps = ab.flexContainer ?? DEFAULT_FLEX_CONTAINER;
    let sectionStyle = `position:relative;width:100%;max-width:100%;overflow-x:hidden;background-color:${ab.backgroundColor};`;
    if (ab.backgroundImage) {
      sectionStyle += `background-image:url(${ab.backgroundImage});background-size:cover;background-position:center;`;
    }

    let sectionHtml = `  <section class="ab-${ab.id}" aria-label="${escapeHtml(ab.name)}" style="${sectionStyle}">\n`;

    // Flow elements in flex container
    if (hasFlow) {
      sectionHtml += `    <div style="display:flex;flex-direction:${flexProps.direction};flex-wrap:${flexProps.wrap};justify-content:${flexProps.justifyContent};align-items:${flexProps.alignItems};gap:${flexProps.gap}px;padding:${flexProps.padding.join("px ")}px;width:100%;min-height:100%;position:relative;z-index:1;">\n`;
      for (const el of flowElements) {
        const elHtml = elementToHtml(el, true);
        sectionHtml += `      <div class="el-${el.id}" style="z-index:${el.zIndex};opacity:${el.opacity};max-width:100%;">\n        ${elHtml}\n      </div>\n`;
      }
      sectionHtml += `    </div>\n`;
    }

    // Absolute elements
    for (const el of absoluteElements) {
      const pctX = (el.transform.x / ab.width) * 100;
      const pctY = (el.transform.y / ab.height) * 100;
      const pctW = (el.transform.width / ab.width) * 100;
      const rotation = el.transform.rotation;
      const elHtml = elementToHtml(el, false);
      // Filled shapes fill their box, so they need an explicit height rather
      // than content-driven "auto" (which would collapse them to zero).
      const needsExplicitHeight = el.type === "shape" || el.type === "carousel";
      const heightCss = needsExplicitHeight ? `${el.transform.height}px` : "auto";
      let absStyle = `position:absolute;left:${pctX.toFixed(2)}%;top:${pctY.toFixed(2)}%;width:${pctW.toFixed(2)}%;height:${heightCss};z-index:${el.zIndex};opacity:${el.opacity};`;
      if (rotation) absStyle += `transform:rotate(${rotation}deg);`;
      sectionHtml += `    <div class="el-${el.id}" style="${absStyle}">\n      ${elHtml}\n    </div>\n`;
    }

    sectionHtml += `  </section>`;
    sections.push(sectionHtml);
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${escapeHtml(doc.pageTitle)}">
  <title>${escapeHtml(doc.pageTitle)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    /* ── Reset ── */
    *, *::before, *::after { box-sizing: border-box; }
    html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }
    body { margin: 0; padding: 0; font-family: var(--font-sans); overflow-x: hidden; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
    img { max-width: 100%; height: auto; display: block; }
    a { text-decoration: none; }

    /* ── Responsive Styles ── */
    ${responsiveCSS}
  </style>
</head>
<body>
  <main>
${sections.join("\n\n")}
  </main>
</body>
</html>`;
}
