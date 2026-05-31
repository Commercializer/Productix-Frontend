/* ─────────────────────────────────────────────
 * Shapes Catalog - Canva-style shape library
 *
 * A single `shape` element type renders any of these
 * variants. Geometry lives here so it's shared by the
 * canvas renderer, the blocks-panel picker previews,
 * and the HTML exporter.
 * ──────────────────────────────────────────── */

"use client";

import React from "react";
import type { Transform } from "@productix/types";

/* ─── Catalog ───────────────────────────────── */

export type ShapeKind = "rect" | "ellipse" | "line" | "polygon" | "path";

export interface ShapeDef {
  /** Variant id stored in props.variant */
  id: string;
  label: string;
  kind: ShapeKind;
  /** For kind "polygon" — points string in a 0..100 viewBox */
  points?: string;
  /** For kind "path" — path d in a 0..100 viewBox */
  d?: string;
  defaultTransform?: Partial<Transform>;
}

export const SHAPES: ShapeDef[] = [
  { id: "rectangle",         label: "Rectangle",        kind: "rect",    defaultTransform: { width: 200, height: 140 } },
  { id: "rounded-rectangle", label: "Rounded",          kind: "rect",    defaultTransform: { width: 200, height: 140 } },
  { id: "ellipse",           label: "Ellipse",          kind: "ellipse", defaultTransform: { width: 160, height: 160 } },
  { id: "triangle",          label: "Triangle",         kind: "polygon", points: "50,2 98,98 2,98",                                              defaultTransform: { width: 160, height: 150 } },
  { id: "right-triangle",    label: "Right Triangle",   kind: "polygon", points: "2,2 2,98 98,98",                                               defaultTransform: { width: 160, height: 150 } },
  { id: "diamond",           label: "Diamond",          kind: "polygon", points: "50,2 98,50 50,98 2,50",                                        defaultTransform: { width: 160, height: 160 } },
  { id: "pentagon",          label: "Pentagon",         kind: "polygon", points: "50,2 98,38 80,98 20,98 2,38",                                  defaultTransform: { width: 160, height: 160 } },
  { id: "hexagon",           label: "Hexagon",          kind: "polygon", points: "25,3 75,3 98,50 75,97 25,97 2,50",                             defaultTransform: { width: 170, height: 150 } },
  { id: "star",              label: "Star",             kind: "polygon", points: "50,2 64.7,30 97.5,34.5 73.8,57.7 79.4,90.5 50,75 20.6,90.5 26.2,57.7 2.5,34.5 35.3,30", defaultTransform: { width: 160, height: 160 } },
  { id: "heart",             label: "Heart",            kind: "path",    d: "M50,90 C50,90 8,58 8,32 C8,17 20,8 32,8 C42,8 48,17 50,24 C52,17 58,8 68,8 C80,8 92,17 92,32 C92,58 50,90 50,90 Z", defaultTransform: { width: 160, height: 150 } },
  { id: "arrow-right",       label: "Arrow",            kind: "polygon", points: "2,32 60,32 60,8 98,50 60,92 60,68 2,68",                       defaultTransform: { width: 200, height: 120 } },
  { id: "parallelogram",     label: "Parallelogram",    kind: "polygon", points: "25,3 98,3 75,97 2,97",                                         defaultTransform: { width: 200, height: 120 } },
  { id: "trapezoid",         label: "Trapezoid",        kind: "polygon", points: "25,3 75,3 98,97 2,97",                                         defaultTransform: { width: 200, height: 120 } },
  { id: "cross",             label: "Cross",            kind: "polygon", points: "35,2 65,2 65,35 98,35 98,65 65,65 65,98 35,98 35,65 2,65 2,35 35,35", defaultTransform: { width: 160, height: 160 } },
  { id: "semicircle",        label: "Semicircle",       kind: "path",    d: "M2,98 A48,48 0 0 1 98,98 Z",                                        defaultTransform: { width: 180, height: 100 } },
  { id: "line",              label: "Line",             kind: "line",    defaultTransform: { width: 240, height: 40 } },
];

const SHAPE_BY_ID: Record<string, ShapeDef> = Object.fromEntries(SHAPES.map((s) => [s.id, s]));

export function getShapeDef(variant: string): ShapeDef {
  return SHAPE_BY_ID[variant] ?? SHAPES[0]!;
}

/* ─── Default props per variant ─────────────── */

export interface ShapeProps {
  variant: string;
  fill: string;
  stroke: string;
  strokeWidth: number;
  radius: number;
  lineStyle: string;
}

export function getShapeDefaultProps(variant: string): ShapeProps {
  const isLine = variant === "line";
  return {
    variant,
    fill: "#8b5cf6",
    stroke: "#1a1a2e",
    strokeWidth: isLine ? 3 : 0,
    radius: variant === "rounded-rectangle" ? 24 : variant === "rectangle" ? 8 : 0,
    lineStyle: "solid",
  };
}

/* ─── Shared renderer ───────────────────────── */

export interface ShapeRenderParams {
  variant: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  radius?: number;
  lineStyle?: string;
  /** Responsive scale for stroke/radius (0..1). */
  scaleFactor?: number;
}

/**
 * Render a shape variant filling its parent box. Rectangles/ellipses/lines
 * use CSS (crisp corners); all other shapes use a non-uniformly-scaled SVG
 * with a non-scaling stroke so borders stay even when the box is stretched.
 */
export function ShapeRender({
  variant,
  fill = "#8b5cf6",
  stroke = "#1a1a2e",
  strokeWidth = 0,
  radius = 0,
  lineStyle = "solid",
  scaleFactor = 1,
}: ShapeRenderParams) {
  const def = getShapeDef(variant);
  const sw = Math.max(0, strokeWidth * scaleFactor);

  if (def.kind === "rect") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: fill,
          border: sw > 0 ? `${Math.round(sw)}px solid ${stroke}` : "none",
          borderRadius: Math.max(0, Math.round(radius * scaleFactor)),
          boxSizing: "border-box",
        }}
      />
    );
  }

  if (def.kind === "ellipse") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: fill,
          border: sw > 0 ? `${Math.round(sw)}px solid ${stroke}` : "none",
          borderRadius: "50%",
          boxSizing: "border-box",
        }}
      />
    );
  }

  if (def.kind === "line") {
    const dash =
      lineStyle === "dashed"
        ? `${Math.max(6, sw * 3)} ${Math.max(4, sw * 2)}`
        : lineStyle === "dotted"
          ? `0 ${Math.max(4, sw * 2)}`
          : undefined;
    return (
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ display: "block", overflow: "visible" }}>
        <line
          x1={0}
          y1={50}
          x2={100}
          y2={50}
          stroke={stroke}
          strokeWidth={Math.max(1, sw || 3)}
          strokeLinecap={lineStyle === "dotted" ? "round" : "butt"}
          strokeDasharray={dash}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    );
  }

  // polygon / path
  const common = {
    fill,
    stroke: sw > 0 ? stroke : "none",
    strokeWidth: sw > 0 ? Math.round(sw) : 0,
    strokeLinejoin: "round" as const,
    vectorEffect: "non-scaling-stroke" as const,
  };
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ display: "block", overflow: "visible" }}>
      {def.kind === "polygon" ? <polygon points={def.points} {...common} /> : <path d={def.d} {...common} />}
    </svg>
  );
}
