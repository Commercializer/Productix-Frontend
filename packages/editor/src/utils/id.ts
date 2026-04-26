/* ─────────────────────────────────────────────
 * ID Generation Utilities
 * ──────────────────────────────────────────── */

let counter = 0;

/** Generate a unique element ID */
export function generateElementId(): string {
  counter += 1;
  return `el_${Date.now().toString(36)}_${counter.toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

/** Generate a unique artboard ID */
export function generateArtboardId(): string {
  counter += 1;
  return `ab_${Date.now().toString(36)}_${counter.toString(36)}`;
}

/** Generate a unique block group ID */
export function generateGroupId(): string {
  counter += 1;
  return `grp_${Date.now().toString(36)}_${counter.toString(36)}`;
}
