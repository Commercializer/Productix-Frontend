/* ─────────────────────────────────────────────
 * Feedback Builder Store - ephemeral selection bridge
 *
 * The feedback form's free-canvas (rendered on the
 * artboard, inside the element component) and its
 * property panel (rendered in the right sidebar) are
 * separate React trees that only share element props.
 * This tiny store lets them agree on which field block
 * is currently selected.
 *
 * It is ephemeral UI state: NOT part of the saved
 * document and NOT tracked by undo/redo. Selection is
 * keyed by elementId + fieldId so multiple feedback
 * forms on one page don't collide (built-in field ids
 * like "__name" repeat across forms).
 * ──────────────────────────────────────────── */

import { create } from "zustand";

export interface FeedbackSelection {
  elementId: string;
  fieldId: string;
}

interface FeedbackBuilderState {
  selection: FeedbackSelection | null;
  select: (elementId: string, fieldId: string) => void;
  clear: () => void;
  /** Clear the selection only if it currently belongs to the given element. */
  clearForElement: (elementId: string) => void;
}

export const useFeedbackBuilderStore = create<FeedbackBuilderState>((set) => ({
  selection: null,
  select: (elementId, fieldId) => set({ selection: { elementId, fieldId } }),
  clear: () => set({ selection: null }),
  clearForElement: (elementId) =>
    set((s) => (s.selection?.elementId === elementId ? { selection: null } : s)),
}));
