/* ─────────────────────────────────────────────
 * Element Wrapper — Transform + selection handles
 *
 * Wraps each canvas element with:
 * - Absolute positioning via transform data
 * - Selection border
 * - Resize handles (8-point)
 * - Drag interaction
 * - Hover highlight
 *
 * Responsive: accepts an effectiveTransform prop
 * that is already resolved for the active breakpoint.
 * ──────────────────────────────────────────── */

"use client";

import React, { memo, useCallback } from "react";
import { useCanvasStore } from "./canvas-store";
import { getElementDefinition } from "../elements/registry";
import { useDrag } from "../interactions/use-drag";
import { useResize, type ResizeHandle } from "../interactions/use-resize";
import { HANDLE_SIZE } from "../interactions/constants";
import type { ElementNode, Transform } from "@productix/types";

interface ElementWrapperProps {
  element: ElementNode;
  /** Pre-computed transform for the active breakpoint */
  effectiveTransform: Transform;
}

const HANDLE_POSITIONS: { key: ResizeHandle; style: React.CSSProperties }[] = [
  { key: "top-left", style: { top: -HANDLE_SIZE / 2, left: -HANDLE_SIZE / 2, cursor: "nwse-resize" } },
  { key: "top", style: { top: -HANDLE_SIZE / 2, left: "50%", marginLeft: -HANDLE_SIZE / 2, cursor: "ns-resize" } },
  { key: "top-right", style: { top: -HANDLE_SIZE / 2, right: -HANDLE_SIZE / 2, cursor: "nesw-resize" } },
  { key: "right", style: { top: "50%", right: -HANDLE_SIZE / 2, marginTop: -HANDLE_SIZE / 2, cursor: "ew-resize" } },
  { key: "bottom-right", style: { bottom: -HANDLE_SIZE / 2, right: -HANDLE_SIZE / 2, cursor: "nwse-resize" } },
  { key: "bottom", style: { bottom: -HANDLE_SIZE / 2, left: "50%", marginLeft: -HANDLE_SIZE / 2, cursor: "ns-resize" } },
  { key: "bottom-left", style: { bottom: -HANDLE_SIZE / 2, left: -HANDLE_SIZE / 2, cursor: "nesw-resize" } },
  { key: "left", style: { top: "50%", left: -HANDLE_SIZE / 2, marginTop: -HANDLE_SIZE / 2, cursor: "ew-resize" } },
];

export const ElementWrapper = memo(function ElementWrapper({ element, effectiveTransform }: ElementWrapperProps) {
  const selectedIds = useCanvasStore((s) => s.selectedIds);
  const hoveredId = useCanvasStore((s) => s.hoveredId);
  const editingElementId = useCanvasStore((s) => s.editingElementId);
  const select = useCanvasStore((s) => s.select);
  const setHovered = useCanvasStore((s) => s.setHovered);
  const setEditingElement = useCanvasStore((s) => s.setEditingElement);
  const updateElementProps = useCanvasStore((s) => s.updateElementProps);
  const activeBreakpoint = useCanvasStore((s) => s.activeBreakpoint);

  const { onDragStart, onDragMove, onDragEnd } = useDrag();
  const { onResizeStart, onResizeMove, onResizeEnd } = useResize();

  const isSelected = selectedIds.includes(element.id);
  const isHovered = hoveredId === element.id;
  const isEditing = editingElementId === element.id;
  const isNonDesktop = activeBreakpoint !== "desktop";

  const def = getElementDefinition(element.type);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (element.locked) return;
      if (isEditing) return; // Don't start drag when editing inline
      // Don't start element drag during pan mode (spacebar held or middle click)
      if ((window as unknown as Record<string, unknown>).__editorPanMode || e.button === 1) return;
      e.stopPropagation();
      select(element.id, e.shiftKey);
      onDragStart(e, element.id);
    },
    [element.id, element.locked, isEditing, select, onDragStart]
  );

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (element.type === "text" || element.type === "heading") {
        setEditingElement(element.id);
      }
    },
    [element.id, element.type, setEditingElement]
  );

  const handlePropsChange = useCallback(
    (changes: Record<string, unknown>) => {
      updateElementProps(element.id, changes);
    },
    [element.id, updateElementProps]
  );

  if (!def || !element.visible) return null;

  const Component = def.component;
  const { x, y, width, height, rotation } = effectiveTransform;

  // Check if element has a custom override for the current breakpoint
  const hasOverride = isNonDesktop && !!element.responsiveOverrides?.[activeBreakpoint];

  return (
    <div
      data-element-id={element.id}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
        zIndex: element.zIndex,
        opacity: element.opacity,
        cursor: element.locked ? "not-allowed" : isEditing ? "text" : "move",
        outline: isSelected
          ? `2px solid ${hasOverride ? "#8b5cf6" : "#3b82f6"}`
          : isHovered
            ? "1.5px solid rgba(59,130,246,0.4)"
            : "none",
        outlineOffset: 0,
        borderRadius: 1,
        // Prevent text selection during drag
        userSelect: isEditing ? "text" : "none",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={onDragMove}
      onPointerUp={onDragEnd}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setHovered(element.id)}
      onMouseLeave={() => setHovered(null)}
    >
      {/* Element content */}
      <Component
        props={element.props}
        isEditing={isEditing}
        width={width}
        height={height}
        onPropsChange={handlePropsChange}
      />

      {/* Resize handles */}
      {isSelected && !element.locked && !isEditing && (
        <>
          {HANDLE_POSITIONS.map(({ key, style }) => (
            <div
              key={key}
              onPointerDown={(e) => onResizeStart(e, element.id, key)}
              onPointerMove={onResizeMove}
              onPointerUp={onResizeEnd}
              style={{
                position: "absolute",
                width: HANDLE_SIZE,
                height: HANDLE_SIZE,
                backgroundColor: "#ffffff",
                border: `2px solid ${hasOverride ? "#8b5cf6" : "#3b82f6"}`,
                borderRadius: 2,
                zIndex: 9999,
                ...style,
              }}
            />
          ))}
        </>
      )}

      {/* Lock indicator */}
      {element.locked && isSelected && (
        <div
          style={{
            position: "absolute",
            top: -20,
            right: 0,
            fontSize: 12,
            background: "#f59e0b",
            color: "#fff",
            borderRadius: 4,
            padding: "1px 6px",
            fontWeight: 600,
            pointerEvents: "none",
          }}
        >
          🔒
        </div>
      )}

      {/* Responsive override indicator */}
      {isSelected && hasOverride && (
        <div
          style={{
            position: "absolute",
            top: -20,
            left: 0,
            fontSize: 9,
            background: "#8b5cf6",
            color: "#fff",
            borderRadius: 4,
            padding: "1px 6px",
            fontWeight: 600,
            pointerEvents: "none",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {activeBreakpoint} override
        </div>
      )}
    </div>
  );
});
