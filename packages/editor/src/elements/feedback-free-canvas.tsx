/* ─────────────────────────────────────────────
 * Feedback Free Canvas - the editor-only layer that
 * turns the standalone Feedback Form into a drag-to-
 * arrange block builder.
 *
 * Each field renders as a block (via the shared
 * <FieldInput>, made pointer-inert) that the author can:
 *   - click to select (settings open in the right panel)
 *   - drag (grip) to reorder vertically + offset horizontally
 *   - resize width via the right-edge handle
 *   - delete via the × button
 *
 * Layout mirrors the production "free" layout exactly
 * (flex-wrap rows, width + left-offset fractions, auto
 * height) so the editor is WYSIWYG. Geometry is written
 * to BASE props (never localized) so positions don't
 * fork per content-locale; one history entry per gesture.
 * ──────────────────────────────────────────── */

"use client";

import React, { useRef } from "react";
import { GripVertical, Trash2 } from "lucide-react";
import { FieldInput } from "./feedback-field-input";
import { useCanvasStore } from "../engine/canvas-store";
import { useFeedbackBuilderStore } from "./feedback-builder-store";
import {
  fieldGridColumn,
  resolveFields,
  type CustomField,
  type FeedbackSheetLabels,
  type FieldGeometry,
} from "./feedback-sheet";

const BUILTIN_TOGGLE_KEY: Record<string, string> = {
  name: "showNameField",
  phone: "showPhoneField",
  email: "showEmailField",
  details: "showDetailsField",
};

const WIDTH_SNAPS = [0.25, 1 / 3, 0.5, 2 / 3, 0.75, 1];
function snapWidth(w: number): number {
  for (const s of WIDTH_SNAPS) if (Math.abs(w - s) < 0.04) return s;
  return Math.max(0.1, Math.min(1, w));
}

interface FeedbackFreeCanvasProps {
  /** Store id of the element whose form is being edited. */
  elementId: string;
  props: Record<string, unknown>;
  labels: FeedbackSheetLabels;
  accentColor: string;
  /** Writes non-geometry changes (built-in toggles, custom-field removal). */
  onChange: (changes: Record<string, unknown>) => void;
}

export function FeedbackFreeCanvas({ elementId, props, labels, accentColor, onChange }: FeedbackFreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());

  const resolved = resolveFields(props, labels);
  const selection = useFeedbackBuilderStore((s) => s.selection);
  const select = useFeedbackBuilderStore((s) => s.select);

  const currentLayout = (): FieldGeometry[] =>
    resolved.map((rf) => ({ id: rf.field.id, x: rf.x, width: rf.width, order: rf.order }));

  // Persist a full geometry snapshot to BASE props (bypassing the per-locale
  // redirect in updateElementProps) so layout never forks across content-locales.
  const persist = (layout: FieldGeometry[]) => {
    const store = useCanvasStore.getState();
    const el = elementId ? store.document.elements[elementId] : undefined;
    if (el) {
      store.updateElement(elementId, { props: { ...el.props, fieldLayout: layout } });
    } else {
      onChange({ fieldLayout: layout });
    }
  };

  // ── Drag: reorder (vertical) + horizontal offset ──
  const beginMove = (e: React.PointerEvent, fieldId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const container = containerRef.current;
    const block = blockRefs.current.get(fieldId);
    if (!container || !block) return;

    useCanvasStore.getState().pushHistory();

    const blockRect = block.getBoundingClientRect();
    const grabDX = e.clientX - blockRect.left;
    const layout = currentLayout();

    // Snapshot sibling vertical centers once, for stable reorder hit-testing.
    const siblings = layout
      .filter((g) => g.id !== fieldId)
      .sort((a, b) => a.order - b.order)
      .map((g) => {
        const r = blockRefs.current.get(g.id)?.getBoundingClientRect();
        return { id: g.id, center: r ? r.top + r.height / 2 : Number.POSITIVE_INFINITY };
      });

    const move = (ev: PointerEvent) => {
      const cRect = container.getBoundingClientRect();
      const me = layout.find((g) => g.id === fieldId);
      if (!me) return;

      // Horizontal: left-margin fraction, clamped so x + width ≤ 1.
      const leftPx = ev.clientX - grabDX - cRect.left;
      const newX = Math.max(0, Math.min(1 - me.width, leftPx / cRect.width));

      // Vertical: insertion index among siblings by pointer Y.
      let insertIdx = siblings.length;
      for (let i = 0; i < siblings.length; i++) {
        if (ev.clientY < siblings[i]!.center) {
          insertIdx = i;
          break;
        }
      }
      const orderedIds = siblings.map((s) => s.id);
      orderedIds.splice(insertIdx, 0, fieldId);

      const next: FieldGeometry[] = orderedIds.map((gid, idx) => {
        const g = layout.find((l) => l.id === gid)!;
        return { id: gid, x: gid === fieldId ? newX : g.x, width: g.width, order: idx };
      });
      persist(next);
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  // ── Resize: width only (height is auto) ──
  const beginResize = (e: React.PointerEvent, fieldId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const container = containerRef.current;
    const block = blockRefs.current.get(fieldId);
    if (!container || !block) return;

    useCanvasStore.getState().pushHistory();

    const blockLeft = block.getBoundingClientRect().left;
    const layout = currentLayout();

    const move = (ev: PointerEvent) => {
      const cRect = container.getBoundingClientRect();
      const me = layout.find((g) => g.id === fieldId);
      if (!me) return;
      const rawW = (ev.clientX - blockLeft) / cRect.width;
      const w = Math.max(0.1, Math.min(1 - me.x, snapWidth(rawW)));
      const next = layout.map((g) => (g.id === fieldId ? { ...g, width: w } : g));
      persist(next);
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const removeField = (field: CustomField) => {
    useCanvasStore.getState().pushHistory();
    if (field.builtin) {
      const key = BUILTIN_TOGGLE_KEY[field.builtin];
      if (key) onChange({ [key]: false });
    } else {
      const customs = Array.isArray(props.customFields) ? (props.customFields as CustomField[]) : [];
      onChange({ customFields: customs.filter((c) => c.id !== field.id) });
    }
    useFeedbackBuilderStore.getState().clear();
  };

  return (
    <div
      ref={containerRef}
      style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gridAutoFlow: "row dense", columnGap: 10, rowGap: 14, width: "100%", position: "relative", alignItems: "start" }}
    >
      {resolved.map((rf) => {
        const f = rf.field;
        const isSel = selection?.elementId === elementId && selection?.fieldId === f.id;
        return (
          <div
            key={f.id}
            ref={(node) => {
              blockRefs.current.set(f.id, node);
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              select(elementId, f.id);
            }}
            style={{
              position: "relative",
              gridColumn: fieldGridColumn(rf.x, rf.width),
              minWidth: 0,
              cursor: "pointer",
            }}
          >
            {/* Block outline (faint when idle, accent when selected) */}
            <div
              style={{
                position: "absolute",
                inset: -4,
                borderRadius: 12,
                border: `1.5px ${isSel ? "solid" : "dashed"} ${isSel ? accentColor : "rgba(148,163,184,0.45)"}`,
                boxShadow: isSel ? `0 0 0 3px ${accentColor}22` : "none",
                pointerEvents: "none",
                zIndex: 2,
                transition: "border-color 0.12s ease",
              }}
            />

            {/* The field preview (pointer-inert so the block captures drags/clicks) */}
            <FieldInput field={f} value={undefined} onChange={() => {}} accentColor={accentColor} interactive={false} />

            {/* Controls (selected only) */}
            {isSel && (
              <>
                <button
                  type="button"
                  title="Drag to move / reorder"
                  onPointerDown={(e) => beginMove(e, f.id)}
                  style={{
                    position: "absolute",
                    top: -12,
                    left: -2,
                    width: 24,
                    height: 24,
                    borderRadius: 7,
                    border: "none",
                    background: accentColor,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "grab",
                    zIndex: 4,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                    touchAction: "none",
                  }}
                >
                  <GripVertical size={14} />
                </button>
                <button
                  type="button"
                  title="Remove field"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => removeField(f)}
                  style={{
                    position: "absolute",
                    top: -12,
                    right: -2,
                    width: 24,
                    height: 24,
                    borderRadius: 7,
                    border: "none",
                    background: "#ef4444",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    zIndex: 4,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                  }}
                >
                  <Trash2 size={13} />
                </button>
                {/* Width handle (right edge) */}
                <div
                  title="Drag to resize width"
                  onPointerDown={(e) => beginResize(e, f.id)}
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: -5,
                    transform: "translateY(-50%)",
                    width: 10,
                    height: 40,
                    borderRadius: 6,
                    background: "#fff",
                    border: `2px solid ${accentColor}`,
                    cursor: "ew-resize",
                    zIndex: 4,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                    touchAction: "none",
                  }}
                />
              </>
            )}
          </div>
        );
      })}

      {resolved.length === 0 && (
        <div
          style={{
            width: "100%",
            padding: "28px 16px",
            borderRadius: 12,
            border: "1.5px dashed rgba(148,163,184,0.5)",
            textAlign: "center",
            color: "#94a3b8",
            fontSize: 13,
          }}
        >
          No fields yet. Add fields from the panel on the right.
        </div>
      )}
    </div>
  );
}
