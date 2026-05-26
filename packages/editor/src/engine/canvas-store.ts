/* ─────────────────────────────────────────────
 * Canvas Store - Zustand + Immer state management
 *
 * Flat element map with O(1) lookups.
 * Immer for immutable updates.
 * Built-in undo/redo history.
 * ──────────────────────────────────────────── */

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { CanvasDocument, ElementNode, Transform, Artboard, Breakpoint, LayoutProps, FlexContainerProps, ContentLocale, BlockGroup } from "@productix/types";
import { DEFAULT_LAYOUT_PROPS, DEFAULT_FLEX_CONTAINER } from "@productix/types";
import { createEmptyDocument, createDefaultArtboard } from "../utils/defaults";
import { generateElementId, generateArtboardId, generateGroupId } from "../utils/id";
import type { SnapGuide } from "../interactions/snap-engine";

/* ─── History ───────────────────────────────── */

interface HistoryEntry {
  artboards: Artboard[];
  elements: Record<string, ElementNode>;
  groups?: Record<string, BlockGroup>;
}

const MAX_HISTORY = 50;

/* ─── Store Shape ───────────────────────────── */

export interface CanvasState {
  // ── Document ──
  document: CanvasDocument;

  // ── Selection ──
  selectedIds: string[];
  hoveredId: string | null;

  // ── Editor UI ──
  zoom: number;
  panX: number;
  panY: number;
  snapGuides: SnapGuide[];
  activeArtboardId: string | null;
  activeBreakpoint: Breakpoint;
  editingElementId: string | null;

  // ── Content Locale (multilingual content editing) ──
  contentLocale: ContentLocale;

  // ── History ──
  past: HistoryEntry[];
  future: HistoryEntry[];

  // ── Document actions ──
  loadDocument: (doc: CanvasDocument) => void;
  setPageTitle: (title: string) => void;
  setShowSearchOverlay: (show: boolean) => void;

  // ── Artboard actions ──
  addArtboard: (overrides?: Partial<Artboard>) => string;
  updateArtboard: (id: string, changes: Partial<Artboard>) => void;
  removeArtboard: (id: string) => void;

  // ── Element actions ──
  addElement: (type: string, props: Record<string, unknown>, transform?: Partial<Transform>, artboardId?: string) => string;
  updateElement: (id: string, changes: Partial<ElementNode>) => void;
  updateElementTransform: (id: string, transform: Partial<Transform>) => void;
  updateElementProps: (id: string, props: Record<string, unknown>) => void;
  removeElement: (id: string) => void;
  duplicateElement: (id: string) => string | null;

  // ── Content Locale ──
  setContentLocale: (locale: ContentLocale) => void;
  addAvailableLocale: (locale: ContentLocale) => void;
  removeAvailableLocale: (locale: ContentLocale) => void;

  // ── Selection ──
  select: (id: string, additive?: boolean) => void;
  selectAll: () => void;
  deselectAll: () => void;
  setHovered: (id: string | null) => void;
  setEditingElement: (id: string | null) => void;

  // ── Layer ordering ──
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;

  // ── Locking ──
  toggleLock: (id: string) => void;
  toggleVisibility: (id: string) => void;

  // ── Zoom / Pan ──
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;

  // ── Responsive breakpoints ──
  setActiveBreakpoint: (bp: Breakpoint) => void;
  updateElementResponsiveOverride: (id: string, bp: Breakpoint, transform: Partial<Transform>) => void;
  clearElementResponsiveOverride: (id: string, bp: Breakpoint) => void;

  // ── Layout system ──
  updateElementLayout: (id: string, changes: Partial<LayoutProps>) => void;
  updateElementResponsiveLayout: (id: string, bp: Breakpoint, changes: Partial<LayoutProps>) => void;
  toggleElementLayoutMode: (id: string) => void;
  updateArtboardFlexContainer: (id: string, changes: Partial<FlexContainerProps>) => void;
  updateArtboardResponsiveFlexContainer: (id: string, bp: Breakpoint, changes: Partial<FlexContainerProps>) => void;
  reorderElementInFlow: (artboardId: string, elementId: string, targetIndex: number) => void;

  // ── Snap guides ──
  setSnapGuides: (guides: SnapGuide[]) => void;
  clearSnapGuides: () => void;

  // ── Block Groups ──
  groupElements: (ids: string[], name?: string) => string | null;
  ungroupElements: (groupId: string) => void;
  getGroupMemberIds: (elementId: string) => string[];

  // ── History ──
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
}

/* ─── Helpers ───────────────────────────────── */

function findArtboardForElement(state: CanvasState, elementId: string): Artboard | undefined {
  return state.document.artboards.find((ab) => ab.elements.includes(elementId));
}

function getMaxZIndex(state: CanvasState): number {
  const allZ = Object.values(state.document.elements).map((el) => el.zIndex);
  return allZ.length > 0 ? Math.max(...allZ) : 0;
}

function getCurrentSnapshot(state: CanvasState): HistoryEntry {
  return {
    artboards: JSON.parse(JSON.stringify(state.document.artboards)),
    elements: JSON.parse(JSON.stringify(state.document.elements)),
    groups: state.document.groups ? JSON.parse(JSON.stringify(state.document.groups)) : undefined,
  };
}

function getTopLevelEntityId(state: CanvasState, entityId: string): string {
  let currentId = entityId;
  while (true) {
    const parentGroupId = state.document.elements[currentId]?.groupId || state.document.groups?.[currentId]?.groupId;
    if (!parentGroupId || !state.document.groups?.[parentGroupId]) break;
    currentId = parentGroupId;
  }
  return currentId;
}

function getLeafMemberIds(state: CanvasState, entityId: string): string[] {
  const group = state.document.groups?.[entityId];
  if (group) {
    let leaves: string[] = [];
    for (const childId of group.memberIds) {
      leaves = leaves.concat(getLeafMemberIds(state, childId));
    }
    return leaves;
  }
  // It's an element (or an invalid group ID, in which case returning it does no harm since the caller verifies existence)
  return [entityId];
}

/* ─── Store ─────────────────────────────────── */

export const useCanvasStore = create<CanvasState>()(
  immer((set, get) => ({
    // ── Initial state ──
    document: createEmptyDocument(),
    selectedIds: [],
    hoveredId: null,
    zoom: 0.75,
    panX: 0,
    panY: 0,
    snapGuides: [],
    activeArtboardId: null,
    activeBreakpoint: "desktop" as Breakpoint,
    editingElementId: null,
    contentLocale: "en" as ContentLocale,
    past: [],
    future: [],

    // ── Document ──
    loadDocument: (doc) =>
      set((s) => {
        s.document = doc;
        s.selectedIds = [];
        s.hoveredId = null;
        s.editingElementId = null;
        s.past = [];
        s.future = [];
        s.activeArtboardId = doc.artboards[0]?.id ?? null;
      }),

    setPageTitle: (title) =>
      set((s) => {
        s.document.pageTitle = title;
      }),

    setShowSearchOverlay: (show) =>
      set((s) => {
        s.document.showSearchOverlay = show;
      }),

    // ── Artboard ──
    addArtboard: (overrides) => {
      const id = generateArtboardId();
      set((s) => {
        const position = s.document.artboards.length;
        s.document.artboards.push(
          createDefaultArtboard({ id, position, name: `Artboard ${position + 1}`, ...overrides })
        );
        s.activeArtboardId = id;
      });
      return id;
    },

    updateArtboard: (id, changes) =>
      set((s) => {
        const ab = s.document.artboards.find((a) => a.id === id);
        if (ab) Object.assign(ab, changes);
      }),

    removeArtboard: (id) =>
      set((s) => {
        const idx = s.document.artboards.findIndex((a) => a.id === id);
        if (idx === -1) return;
        const ab = s.document.artboards[idx];
        if (!ab) return;
        // Remove all elements belonging to this artboard
        for (const elId of ab.elements) {
          delete s.document.elements[elId];
          s.selectedIds = s.selectedIds.filter((sid) => sid !== elId);
        }
        s.document.artboards.splice(idx, 1);
        if (s.activeArtboardId === id) {
          s.activeArtboardId = s.document.artboards[0]?.id ?? null;
        }
      }),

    // ── Element ──
    addElement: (type, props, transform, artboardId) => {
      const id = generateElementId();
      const state = get();
      get().pushHistory();

      set((s) => {
        const targetAb = artboardId
          ? s.document.artboards.find((a) => a.id === artboardId)
          : s.document.artboards.find((a) => a.id === s.activeArtboardId) ||
          s.document.artboards[0];

        if (!targetAb) return;

        const maxZ = getMaxZIndex(s);
        s.document.elements[id] = {
          id,
          type,
          transform: {
            x: transform?.x ?? 100,
            y: transform?.y ?? 100,
            width: transform?.width ?? 200,
            height: transform?.height ?? 80,
            rotation: transform?.rotation ?? 0,
          },
          zIndex: maxZ + 1,
          locked: false,
          visible: true,
          opacity: 1,
          props,
        };
        targetAb.elements.push(id);
        s.selectedIds = [id];
        s.editingElementId = null;
      });
      return id;
    },

    updateElement: (id, changes) =>
      set((s) => {
        const el = s.document.elements[id];
        if (el) Object.assign(el, changes);
      }),

    updateElementTransform: (id, transform) =>
      set((s) => {
        const el = s.document.elements[id];
        if (el) Object.assign(el.transform, transform);
      }),

    updateElementProps: (id, props) =>
      set((s) => {
        const el = s.document.elements[id];
        if (!el) return;
        if (s.contentLocale === "en") {
          // English edits go directly to base props
          Object.assign(el.props, props);
        } else {
          // Non-English edits go to i18nProps[locale]
          if (!el.i18nProps) {
            el.i18nProps = {};
          }
          if (!el.i18nProps[s.contentLocale]) {
            el.i18nProps[s.contentLocale] = {};
          }
          Object.assign(el.i18nProps[s.contentLocale]!, props);
          // Track available locales on the document
          if (!s.document.availableLocales) {
            s.document.availableLocales = ["en"];
          }
          if (!s.document.availableLocales.includes(s.contentLocale)) {
            s.document.availableLocales.push(s.contentLocale);
          }
        }
      }),

    removeElement: (id) => {
      get().pushHistory();
      set((s) => {
        delete s.document.elements[id];
        for (const ab of s.document.artboards) {
          ab.elements = ab.elements.filter((eid) => eid !== id);
        }
        s.selectedIds = s.selectedIds.filter((sid) => sid !== id);
        if (s.editingElementId === id) s.editingElementId = null;
      });
    },

    duplicateElement: (id) => {
      const state = get();
      const el = state.document.elements[id];
      if (!el) return null;
      const newId = generateElementId();
      const ab = findArtboardForElement(state, id);

      get().pushHistory();
      set((s) => {
        s.document.elements[newId] = {
          ...JSON.parse(JSON.stringify(el)),
          id: newId,
          transform: {
            ...el.transform,
            x: el.transform.x + 20,
            y: el.transform.y + 20,
          },
          zIndex: getMaxZIndex(s) + 1,
        };
        if (ab) {
          const targetAb = s.document.artboards.find((a) => a.id === ab.id);
          targetAb?.elements.push(newId);
        }
        s.selectedIds = [newId];
      });
      return newId;
    },

    // ── Selection ──
    select: (id, additive) =>
      set((s) => {
        if (additive) {
          if (s.selectedIds.includes(id)) {
            s.selectedIds = s.selectedIds.filter((sid) => sid !== id);
          } else {
            s.selectedIds.push(id);
          }
        } else {
          s.selectedIds = [id];
        }
        s.editingElementId = null;
      }),

    selectAll: () =>
      set((s) => {
        s.selectedIds = Object.keys(s.document.elements);
      }),

    deselectAll: () =>
      set((s) => {
        s.selectedIds = [];
        s.editingElementId = null;
      }),

    setHovered: (id) =>
      set((s) => {
        s.hoveredId = id;
      }),

    setEditingElement: (id) =>
      set((s) => {
        s.editingElementId = id;
        if (id) s.selectedIds = [id];
      }),

    // ── Content Locale ──
    setContentLocale: (locale) =>
      set((s) => {
        s.contentLocale = locale;
        if (locale !== "en") {
          if (!s.document.availableLocales) s.document.availableLocales = ["en"];
          if (!s.document.availableLocales.includes(locale)) {
            s.document.availableLocales.push(locale);
          }
        }
      }),

    addAvailableLocale: (locale) =>
      set((s) => {
        if (!s.document.availableLocales) s.document.availableLocales = ["en"];
        if (!s.document.availableLocales.includes(locale)) {
          s.document.availableLocales.push(locale);
        }
        s.contentLocale = locale;
      }),

    removeAvailableLocale: (locale) =>
      set((s) => {
        if (locale === "en") return;
        if (s.document.availableLocales) {
          s.document.availableLocales = s.document.availableLocales.filter((l) => l !== locale);
        }
        for (const el of Object.values(s.document.elements)) {
          if (el.i18nProps && el.i18nProps[locale]) {
            delete el.i18nProps[locale];
            if (Object.keys(el.i18nProps).length === 0) delete el.i18nProps;
          }
        }
        if (s.contentLocale === locale) s.contentLocale = "en";
      }),

    // ── Layer ordering ──
    bringForward: (id) =>
      set((s) => {
        const el = s.document.elements[id];
        if (!el) return;
        const allZ = Object.values(s.document.elements)
          .map((e) => e.zIndex)
          .sort((a, b) => a - b);
        const idx = allZ.indexOf(el.zIndex);
        if (idx < allZ.length - 1) {
          // Swap with the next higher
          const nextZ = allZ[idx + 1];
          if (nextZ === undefined) return;
          const nextEl = Object.values(s.document.elements).find((e) => e.zIndex === nextZ && e.id !== id);
          if (nextEl) {
            nextEl.zIndex = el.zIndex;
            el.zIndex = nextZ;
          } else {
            el.zIndex += 1;
          }
        }
      }),

    sendBackward: (id) =>
      set((s) => {
        const el = s.document.elements[id];
        if (!el) return;
        const allZ = Object.values(s.document.elements)
          .map((e) => e.zIndex)
          .sort((a, b) => a - b);
        const idx = allZ.indexOf(el.zIndex);
        if (idx > 0) {
          const prevZ = allZ[idx - 1];
          if (prevZ === undefined) return;
          const prevEl = Object.values(s.document.elements).find((e) => e.zIndex === prevZ && e.id !== id);
          if (prevEl) {
            prevEl.zIndex = el.zIndex;
            el.zIndex = prevZ;
          } else {
            el.zIndex = Math.max(0, el.zIndex - 1);
          }
        }
      }),

    bringToFront: (id) =>
      set((s) => {
        const el = s.document.elements[id];
        if (!el) return;
        el.zIndex = getMaxZIndex(s) + 1;
      }),

    sendToBack: (id) =>
      set((s) => {
        const el = s.document.elements[id];
        if (!el) return;
        const minZ = Math.min(...Object.values(s.document.elements).map((e) => e.zIndex));
        el.zIndex = minZ - 1;
      }),

    // ── Locking ──
    toggleLock: (id) =>
      set((s) => {
        const el = s.document.elements[id];
        if (el) el.locked = !el.locked;
      }),

    toggleVisibility: (id) =>
      set((s) => {
        const el = s.document.elements[id];
        if (el) el.visible = !el.visible;
      }),

    // ── Zoom / Pan ──
    setZoom: (zoom) =>
      set((s) => {
        s.zoom = Math.max(0.25, Math.min(3, zoom));
      }),

    setPan: (x, y) =>
      set((s) => {
        s.panX = x;
        s.panY = y;
      }),

    // ── Responsive breakpoints ──
    setActiveBreakpoint: (bp) =>
      set((s) => {
        s.activeBreakpoint = bp;
      }),

    updateElementResponsiveOverride: (id, bp, transform) =>
      set((s) => {
        const el = s.document.elements[id];
        if (!el) return;
        if (bp === "desktop") {
          // Desktop edits go directly to the base transform
          Object.assign(el.transform, transform);
          return;
        }
        if (!el.responsiveOverrides) {
          el.responsiveOverrides = {};
        }
        el.responsiveOverrides[bp] = {
          ...(el.responsiveOverrides[bp] || {}),
          ...transform,
        };
      }),

    clearElementResponsiveOverride: (id, bp) =>
      set((s) => {
        const el = s.document.elements[id];
        if (!el || !el.responsiveOverrides) return;
        delete el.responsiveOverrides[bp];
        if (Object.keys(el.responsiveOverrides).length === 0) {
          delete el.responsiveOverrides;
        }
      }),

    // ── Layout system ──
    updateElementLayout: (id, changes) =>
      set((s) => {
        const el = s.document.elements[id];
        if (!el) return;
        if (!el.layout) {
          el.layout = { ...DEFAULT_LAYOUT_PROPS };
        }
        Object.assign(el.layout, changes);
        // Deep-copy arrays
        if (changes.margin) el.layout.margin = [...changes.margin] as [number, number, number, number];
        if (changes.padding) el.layout.padding = [...changes.padding] as [number, number, number, number];
      }),

    updateElementResponsiveLayout: (id, bp, changes) =>
      set((s) => {
        const el = s.document.elements[id];
        if (!el) return;
        if (!el.responsiveLayout) {
          el.responsiveLayout = {};
        }
        el.responsiveLayout[bp] = {
          ...(el.responsiveLayout[bp] || {}),
          ...changes,
        };
      }),

    toggleElementLayoutMode: (id) => {
      get().pushHistory();
      set((s) => {
        const el = s.document.elements[id];
        if (!el) return;
        if (el.layout?.layoutMode === "flow") {
          // Switch to absolute: remove layout, keep transform as-is
          delete el.layout;
          delete el.responsiveLayout;
        } else {
          // Switch to flow: create default layout props from current transform
          const ab = s.document.artboards.find((a) => a.elements.includes(id));
          const abWidth = ab?.width ?? 1440;
          el.layout = {
            ...DEFAULT_LAYOUT_PROPS,
            widthValue: Math.round((el.transform.width / abWidth) * 100),
            widthUnit: "%",
            heightValue: el.transform.height,
            heightUnit: "px",
          };
        }
      });
    },

    updateArtboardFlexContainer: (id, changes) =>
      set((s) => {
        const ab = s.document.artboards.find((a) => a.id === id);
        if (!ab) return;
        if (!ab.flexContainer) {
          ab.flexContainer = { ...DEFAULT_FLEX_CONTAINER };
        }
        Object.assign(ab.flexContainer, changes);
        if (changes.padding) ab.flexContainer.padding = [...changes.padding] as [number, number, number, number];
      }),

    updateArtboardResponsiveFlexContainer: (id, bp, changes) =>
      set((s) => {
        const ab = s.document.artboards.find((a) => a.id === id);
        if (!ab) return;
        if (!ab.responsiveFlexContainer) {
          ab.responsiveFlexContainer = {};
        }
        ab.responsiveFlexContainer[bp] = {
          ...(ab.responsiveFlexContainer[bp] || {}),
          ...changes,
        };
      }),

    reorderElementInFlow: (artboardId, elementId, targetIndex) => {
      get().pushHistory();
      set((s) => {
        const ab = s.document.artboards.find((a) => a.id === artboardId);
        if (!ab) return;
        const currentIndex = ab.elements.indexOf(elementId);
        if (currentIndex === -1) return;
        // Remove from current position
        ab.elements.splice(currentIndex, 1);
        // Insert at target position
        const clampedTarget = Math.max(0, Math.min(targetIndex, ab.elements.length));
        ab.elements.splice(clampedTarget, 0, elementId);
      });
    },

    // ── Snap ──
    setSnapGuides: (guides) =>
      set((s) => {
        s.snapGuides = guides;
      }),

    clearSnapGuides: () =>
      set((s) => {
        s.snapGuides = [];
      }),

    // ── Block Groups ──
    groupElements: (ids, name) => {
      const state = get();
      // Verify all elements exist and resolve their top-level parent entity
      const validIds = ids.filter((id) => !!state.document.elements[id]);
      if (validIds.length < 2) return null;

      const topLevelIds = new Set<string>();
      for (const id of validIds) {
        topLevelIds.add(getTopLevelEntityId(state, id));
      }

      const memberIdsToGroup = Array.from(topLevelIds);
      if (memberIdsToGroup.length < 2) return null; // Can't group less than 2 distinct entities

      const groupId = generateGroupId();
      state.pushHistory();

      set((s) => {
        // Create the new group
        if (!s.document.groups) {
          s.document.groups = {};
        }

        const groupName = name || `Group ${Object.keys(s.document.groups).length + 1}`;
        s.document.groups[groupId] = {
          id: groupId,
          name: groupName,
          memberIds: [...memberIdsToGroup],
          locked: false,
        };

        // Tag each top-level entity with the new parent groupId
        for (const id of memberIdsToGroup) {
          const el = s.document.elements[id];
          if (el) el.groupId = groupId;
          const grp = s.document.groups[id];
          if (grp) grp.groupId = groupId;
        }

        // Selection remains the same (leaf node IDs)
      });

      return groupId;
    },

    ungroupElements: (groupId) => {
      const state = get();
      const group = state.document.groups?.[groupId];
      if (!group) return;

      state.pushHistory();
      set((s) => {
        const g = s.document.groups?.[groupId];
        if (!g) return;

        const parentGroupId = g.groupId;

        // Reparent all children (elements and nested groups)
        for (const childId of g.memberIds) {
          const childEl = s.document.elements[childId];
          if (childEl) childEl.groupId = parentGroupId;
          const childGrp = s.document.groups?.[childId];
          if (childGrp) childGrp.groupId = parentGroupId;
        }

        if (parentGroupId) {
          // Replace this group with its children in the parent's memberIds
          const parentGrp = s.document.groups![parentGroupId];
          if (parentGrp) {
            const idx = parentGrp.memberIds.indexOf(groupId);
            if (idx !== -1) {
              parentGrp.memberIds.splice(idx, 1, ...g.memberIds);
            } else {
              parentGrp.memberIds.push(...g.memberIds);
            }
          }
        }

        // Remove the group
        delete s.document.groups![groupId];

        // Clean up groups map if empty
        if (s.document.groups && Object.keys(s.document.groups).length === 0) {
          delete s.document.groups;
        }
      });
    },

    getGroupMemberIds: (elementId) => {
      const state = get();
      const el = state.document.elements[elementId];
      if (!el?.groupId) return [elementId];

      const topLevelId = getTopLevelEntityId(state, elementId);
      const leafIds = getLeafMemberIds(state, topLevelId);

      return leafIds.filter((id) => !!state.document.elements[id]);
    },

    // ── History ──
    pushHistory: () =>
      set((s) => {
        s.past.push(getCurrentSnapshot(s));
        if (s.past.length > MAX_HISTORY) s.past.shift();
        s.future = [];
      }),

    undo: () =>
      set((s) => {
        if (s.past.length === 0) return;
        const current = getCurrentSnapshot(s);
        s.future.push(current);
        const prev = s.past.pop()!;
        s.document.artboards = prev.artboards;
        s.document.elements = prev.elements;
        s.document.groups = prev.groups;
        s.selectedIds = [];
        s.editingElementId = null;
      }),

    redo: () =>
      set((s) => {
        if (s.future.length === 0) return;
        const current = getCurrentSnapshot(s);
        s.past.push(current);
        const next = s.future.pop()!;
        s.document.artboards = next.artboards;
        s.document.elements = next.elements;
        s.document.groups = next.groups;
        s.selectedIds = [];
        s.editingElementId = null;
      }),
  }))
);
