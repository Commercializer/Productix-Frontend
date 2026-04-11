/* ─────────────────────────────────────────────
 * Default Element Properties & Transforms
 * ──────────────────────────────────────────── */

import type { Transform, Artboard, CanvasDocument, ElementNode } from "@productix/types";
import { generateArtboardId } from "./id";

/** Default transform for a newly placed element */
export function defaultTransform(
  overrides: Partial<Transform> = {}
): Transform {
  return {
    x: 100,
    y: 100,
    width: 200,
    height: 80,
    rotation: 0,
    ...overrides,
  };
}

/** Default artboard */
export function createDefaultArtboard(
  overrides: Partial<Artboard> = {}
): Artboard {
  return {
    id: generateArtboardId(),
    name: "Artboard 1",
    width: 1440,
    height: 900,
    backgroundColor: "#ffffff",
    elements: [],
    position: 0,
    ...overrides,
  };
}

/** Empty canvas document */
export function createEmptyDocument(title = "Untitled Page"): CanvasDocument {
  const artboard = createDefaultArtboard();
  return {
    version: 1,
    pageTitle: title,
    artboards: [artboard],
    elements: {},
  };
}

/** Default element node factory */
export function createDefaultElement(
  id: string,
  type: string,
  props: Record<string, unknown>,
  transform: Partial<Transform> = {}
): ElementNode {
  return {
    id,
    type,
    transform: defaultTransform(transform),
    zIndex: 0,
    locked: false,
    visible: true,
    opacity: 1,
    props,
  };
}
