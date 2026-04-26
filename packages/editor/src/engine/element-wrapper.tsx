/* ─────────────────────────────────────────────
 * Element Wrapper — Transform + selection handles
 *
 * Wraps each canvas element with:
 * - Absolute positioning via transform data (absolute mode)
 * - Flex-based sizing via layout data (flow mode)
 * - Selection border
 * - Resize handles (8-point)
 * - Drag interaction
 * - Hover highlight
 *
 * Responsive: supports both absolute and flow layout modes.
 * In flow mode, elements participate in flex container flow.
 * ──────────────────────────────────────────── */

"use client";

import React, { memo, useCallback, useMemo } from "react";
import { useCanvasStore } from "./canvas-store";
import { getElementDefinition } from "../elements/registry";
import { useDrag } from "../interactions/use-drag";
import { useResize, type ResizeHandle } from "../interactions/use-resize";
import { HANDLE_SIZE } from "../interactions/constants";
import { computeElementLayoutCSS } from "./layout-engine";
import { getLocalizedProps } from "../utils/localize-props";
import type { ElementNode, Transform, LayoutProps } from "@productix/types";

interface ElementWrapperProps {
  element: ElementNode;
  /** Pre-computed transform for the active breakpoint (absolute mode) */
  effectiveTransform: Transform;
  /** Pre-computed layout for the active breakpoint (flow mode) — optional */
  effectiveLayout?: LayoutProps;
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

export const ElementWrapper = memo(function ElementWrapper({
  element,
  effectiveTransform,
  effectiveLayout,
}: ElementWrapperProps) {
  const selectedIds = useCanvasStore((s) => s.selectedIds);
  const hoveredId = useCanvasStore((s) => s.hoveredId);
  const editingElementId = useCanvasStore((s) => s.editingElementId);
  const select = useCanvasStore((s) => s.select);
  const setHovered = useCanvasStore((s) => s.setHovered);
  const setEditingElement = useCanvasStore((s) => s.setEditingElement);
  const updateElementProps = useCanvasStore((s) => s.updateElementProps);
  const activeBreakpoint = useCanvasStore((s) => s.activeBreakpoint);
  const contentLocale = useCanvasStore((s) => s.contentLocale);
  const groups = useCanvasStore((s) => s.document.groups);
  const getGroupMemberIds = useCanvasStore((s) => s.getGroupMemberIds);

  const { onDragStart, onDragMove, onDragEnd } = useDrag();
  const { onResizeStart, onResizeMove, onResizeEnd } = useResize();

  const isSelected = selectedIds.includes(element.id);
  const isHovered = hoveredId === element.id;
  const isEditing = editingElementId === element.id;
  const isNonDesktop = activeBreakpoint !== "desktop";
  const isFlow = !!effectiveLayout && effectiveLayout.layoutMode === "flow";
  const isGrouped = !!element.groupId;
  const groupInfo = isGrouped && groups ? groups[element.groupId!] : null;

  const def = getElementDefinition(element.type);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (element.locked) return;
      if (isEditing) return; // Don't start drag when editing inline
      // Don't start element drag during pan mode (spacebar held or middle click)
      if ((window as unknown as Record<string, unknown>).__editorPanMode || e.button === 1) return;
      e.stopPropagation();

      // If grouped and not shift-clicking, select all group members
      if (isGrouped && !e.shiftKey) {
        const memberIds = getGroupMemberIds(element.id);
        if (memberIds.length > 1) {
          useCanvasStore.setState({ selectedIds: [...memberIds], editingElementId: null });
        } else {
          select(element.id, false);
        }
      } else {
        select(element.id, e.shiftKey);
      }

      // Only allow pixel dragging in absolute mode
      if (!isFlow) {
        onDragStart(e, element.id);
      }
    },
    [element.id, element.locked, isEditing, isFlow, isGrouped, select, onDragStart, getGroupMemberIds]
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

  // Check if element is hidden at current breakpoint (flow mode)
  if (isFlow && effectiveLayout?.hidden) return null;

  const Component = def.component;
  const { x, y, width, height, rotation } = effectiveTransform;

  // Check if element has a custom override for the current breakpoint
  const hasOverride = isNonDesktop && !!element.responsiveOverrides?.[activeBreakpoint];
  const hasLayoutOverride = isNonDesktop && isFlow && !!element.responsiveLayout?.[activeBreakpoint];
  const showOverrideIndicator = hasOverride || hasLayoutOverride;

  // Compute styles based on layout mode
  const flowCSS = useMemo(
    () => (isFlow && effectiveLayout ? computeElementLayoutCSS(effectiveLayout) : null),
    [isFlow, effectiveLayout]
  );

  // Group color — derive from groupId hash for visual distinction
  const groupColor = useMemo(() => {
    if (!element.groupId) return null;
    const GROUP_COLORS = ["#8b5cf6", "#ec4899", "#f59e0b", "#06b6d4", "#84cc16", "#f97316"];
    let hash = 0;
    for (let i = 0; i < element.groupId.length; i++) {
      hash = ((hash << 5) - hash + element.groupId.charCodeAt(i)) | 0;
    }
    return GROUP_COLORS[Math.abs(hash) % GROUP_COLORS.length];
  }, [element.groupId]);

  // Build element style
  const elementStyle: React.CSSProperties = isFlow && flowCSS
    ? {
        // Flow mode — participate in flex container
        ...flowCSS,
        zIndex: element.zIndex,
        opacity: element.opacity,
        cursor: element.locked ? "not-allowed" : isEditing ? "text" : "default",
        outline: isSelected
          ? `2px solid ${isGrouped && groupColor ? groupColor : showOverrideIndicator ? "#38bdf8" : "#10b981"}`
          : isHovered
            ? `1.5px solid ${isGrouped && groupColor ? groupColor + "66" : "rgba(16,185,129,0.4)"}`
            : "none",
        outlineOffset: 0,
        borderRadius: 1,
        userSelect: isEditing ? "text" : ("none" as const),
        transition: "width 0.2s ease, margin 0.2s ease, padding 0.2s ease",
      }
    : {
        // Absolute mode — pixel positioning
        position: "absolute" as const,
        left: x,
        top: y,
        width,
        height,
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
        zIndex: element.zIndex,
        opacity: element.opacity,
        cursor: element.locked ? "not-allowed" : isEditing ? "text" : "move",
        outline: isSelected
          ? `2px solid ${isGrouped && groupColor ? groupColor : showOverrideIndicator ? "#38bdf8" : "#3b82f6"}`
          : isHovered
            ? `1.5px solid ${isGrouped && groupColor ? groupColor + "66" : "rgba(59,130,246,0.4)"}`
            : "none",
        outlineOffset: 0,
        borderRadius: 1,
        userSelect: isEditing ? "text" : ("none" as const),
      };

  // Determine rendered width/height for the component
  const renderedWidth = isFlow && effectiveLayout
    ? (effectiveLayout.widthUnit === "auto" ? 200 : effectiveLayout.widthValue)
    : width;
  const renderedHeight = isFlow && effectiveLayout
    ? (effectiveLayout.heightUnit === "auto" ? undefined : effectiveLayout.heightValue)
    : height;

  return (
    <div
      data-element-id={element.id}
      data-layout-mode={isFlow ? "flow" : "absolute"}
      style={elementStyle}
      onPointerDown={handlePointerDown}
      onPointerMove={isFlow ? undefined : onDragMove}
      onPointerUp={isFlow ? undefined : onDragEnd}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setHovered(element.id)}
      onMouseLeave={() => setHovered(null)}
    >
      {/* Element content */}
      <Component
        props={getLocalizedProps(element, contentLocale)}
        isEditing={isEditing}
        width={renderedWidth}
        height={renderedHeight ?? 0}
        onPropsChange={handlePropsChange}
      />

      {/* Resize handles — only in absolute mode */}
      {isSelected && !element.locked && !isEditing && !isFlow && (
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
                border: `2px solid ${showOverrideIndicator ? "#38bdf8" : "#3b82f6"}`,
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

      {/* Layout mode badge */}
      {isSelected && isFlow && (
        <div
          style={{
            position: "absolute",
            top: -20,
            left: 0,
            fontSize: 9,
            background: "#10b981",
            color: "#fff",
            borderRadius: 4,
            padding: "1px 6px",
            fontWeight: 600,
            pointerEvents: "none",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          flow
        </div>
      )}

      {/* Group badge */}
      {isSelected && isGrouped && groupInfo && (
        <div
          style={{
            position: "absolute",
            top: -20,
            right: element.locked ? 30 : 0,
            fontSize: 9,
            background: groupColor || "#8b5cf6",
            color: "#fff",
            borderRadius: 4,
            padding: "1px 6px",
            fontWeight: 600,
            pointerEvents: "none",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            display: "flex",
            alignItems: "center",
            gap: 3,
          }}
        >
          ⊞ {groupInfo.name}
        </div>
      )}

      {/* Responsive override indicator */}
      {isSelected && showOverrideIndicator && !isFlow && (
        <div
          style={{
            position: "absolute",
            top: -20,
            left: 0,
            fontSize: 9,
            background: "#38bdf8",
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
