/* ─────────────────────────────────────────────
 * Interaction Constants
 * ──────────────────────────────────────────── */

/** Snap threshold in pixels - how close a guide must be to snap */
export const SNAP_THRESHOLD = 6;

/** Grid size for optional grid snapping */
export const GRID_SIZE = 8;

/** Minimum element size during resize */
export const MIN_ELEMENT_SIZE = 20;

/** Resize handle size in pixels */
export const HANDLE_SIZE = 8;

/** Selection border width */
export const SELECTION_BORDER = 2;

/** Distance (px) the rotation handle sits below the element's bottom edge */
export const ROTATION_HANDLE_OFFSET = 24;

/**
 * Custom "rotate" cursor (a curved arrow) as an inline SVG data-URI.
 * White outline under a black stroke so it reads on any background.
 * Hotspot centered at 12 12.
 */
const ROTATE_CURSOR_SVG =
  "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke-linecap='round' stroke-linejoin='round'>" +
  "<g stroke='white' stroke-width='4'><path d='M4.5 9a8 8 0 1 1-1 5'/><polyline points='2 4 4.5 9 9.5 7'/></g>" +
  "<g stroke='black' stroke-width='2'><path d='M4.5 9a8 8 0 1 1-1 5'/><polyline points='2 4 4.5 9 9.5 7'/></g>" +
  "</svg>";

export const ROTATE_CURSOR = `url("data:image/svg+xml,${encodeURIComponent(
  ROTATE_CURSOR_SVG
)}") 12 12, grab`;

/** Keyboard nudge distance (px) */
export const NUDGE_DISTANCE = 1;

/** Shift + nudge distance (px) */
export const NUDGE_DISTANCE_LARGE = 10;

/** Default zoom level */
export const DEFAULT_ZOOM = 0.75;

/** Zoom range */
export const MIN_ZOOM = 0.25;
export const MAX_ZOOM = 3;

/** Zoom step per scroll tick */
export const ZOOM_STEP = 0.05;
