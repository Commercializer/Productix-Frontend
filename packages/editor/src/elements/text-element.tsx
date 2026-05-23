/* ─────────────────────────────────────────────
 * Text Element - Heading / Paragraph / Text
 * ──────────────────────────────────────────── */

"use client";

import React, { useRef, useCallback, useEffect } from "react";
import { Type, Heading as HeadingIcon } from "lucide-react";
import { registerElement, type ElementRenderProps, type PropertyPanelProps } from "./registry";
import { FontPicker } from "../panels/font-picker";
import { HexColorPopover } from "./hex-color-popover";

/* ─── Component ─────────────────────────────── */

function TextElementComponent({ props, isEditing, scaleFactor = 1, onPropsChange }: ElementRenderProps) {
  const ref = useRef<HTMLDivElement>(null);

  const text = (props.text as string) || "Text";
  const fontSize = (props.fontSize as number) || 16;
  const fontWeight = (props.fontWeight as string) || "400";
  const color = (props.color as string) || "#1a1a2e";
  const textAlign = (props.textAlign as string) || "left";
  const fontFamily = (props.fontFamily as string) || "inherit";
  const lineHeight = (props.lineHeight as number) || 1.5;
  const variant = (props.variant as string) || "paragraph";

  const actualFontSize = variant === "heading" ? Math.max(fontSize, 24) : fontSize;
  const actualFontWeight = variant === "heading" ? "700" : fontWeight;

  // Scale font size responsively
  const scaledFontSize = Math.round(actualFontSize * scaleFactor);
  const scaledPadding = Math.round(4 * scaleFactor);

  // The contentEditable div has NO React children - we manage its content
  // imperatively via this effect. Rendering {text} as a JSX child would let
  // React reconcile and clobber the user's in-progress typing on any
  // re-render. Skip while focused so we never wipe the caret.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof document !== "undefined" && document.activeElement === el) return;
    if (el.innerText !== text) {
      el.innerText = text;
    }
  }, [text]);

  // Commit on every input so edits stick even if blur never fires - e.g. when
  // clicking another element flips isEditing to false and contentEditable
  // from true to false on a still-focused node, which some browsers do not
  // treat as a blur.
  const handleInput = useCallback(() => {
    if (!ref.current) return;
    const newText = ref.current.innerText;
    if (newText !== text) {
      onPropsChange({ text: newText });
    }
  }, [text, onPropsChange]);

  const handleBlur = useCallback(() => {
    if (!ref.current) return;
    const newText = ref.current.innerText;
    if (newText !== text) {
      onPropsChange({ text: newText });
    }
  }, [text, onPropsChange]);

  // Intercept Enter / Shift+Enter so the browser inserts a literal "\n"
  // text node instead of a <br> or wrapping <div>. With whiteSpace:
  // pre-wrap, the \n renders as a real line break, and on blur we get
  // a clean string with embedded newlines back from innerText - no
  // browser-specific DOM structure to interpret.
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // execCommand is deprecated but still the only one-liner that
      // works across browsers for inserting text at the caret while
      // preserving undo/redo. Falls back to manual Selection insertion.
      const ok = typeof document !== "undefined"
        && typeof document.execCommand === "function"
        && document.execCommand("insertText", false, "\n");
      if (!ok && typeof window !== "undefined") {
        const sel = window.getSelection();
        if (sel && sel.rangeCount) {
          const range = sel.getRangeAt(0);
          range.deleteContents();
          const node = document.createTextNode("\n");
          range.insertNode(node);
          range.setStartAfter(node);
          range.setEndAfter(node);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
    }
  }, []);

  return (
    <div
      ref={ref}
      contentEditable={isEditing}
      suppressContentEditableWarning
      onInput={isEditing ? handleInput : undefined}
      onBlur={handleBlur}
      onKeyDown={isEditing ? handleKeyDown : undefined}
      style={{
        width: "100%",
        height: "100%",
        fontSize: scaledFontSize,
        fontWeight: actualFontWeight,
        color,
        textAlign: textAlign as React.CSSProperties["textAlign"],
        fontFamily,
        lineHeight,
        outline: "none",
        overflow: "hidden",
        wordBreak: "break-word",
        whiteSpace: "pre-wrap",
        cursor: isEditing ? "text" : "default",
        padding: scaledPadding,
      }}
    />
  );
}

/* ─── Property Panel ────────────────────────── */

function TextPropertyPanel({ props, onChange }: PropertyPanelProps) {
  return (
    <div className="space-y-3">
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Text</span>
        <textarea
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          rows={3}
          value={(props.text as string) || ""}
          onChange={(e) => onChange({ text: e.target.value })}
        />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Variant</span>
        <select
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          value={(props.variant as string) || "paragraph"}
          onChange={(e) => onChange({ variant: e.target.value })}
        >
          <option value="heading">Heading</option>
          <option value="paragraph">Paragraph</option>
        </select>
      </label>
      <div className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Font Family</span>
        <FontPicker
          value={(props.fontFamily as string) || "inherit"}
          onChange={(family) => onChange({ fontFamily: family })}
        />
      </div>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Font Size</span>
        <input
          type="number"
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          value={(props.fontSize as number) || 16}
          onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
          min={8}
          max={200}
        />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Font Weight</span>
        <select
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          value={(props.fontWeight as string) || "400"}
          onChange={(e) => onChange({ fontWeight: e.target.value })}
        >
          <option value="300">Light</option>
          <option value="400">Regular</option>
          <option value="500">Medium</option>
          <option value="600">Semibold</option>
          <option value="700">Bold</option>
          <option value="800">Extra Bold</option>
        </select>
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Color</span>
        <div className="mt-1 flex gap-2 items-center">
          <HexColorPopover
            value={(props.color as string) || ""}
            onChange={(hex) => onChange({ color: hex })}
            fallback="#1a1a2e"
          />
          <input
            type="text"
            className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
            value={(props.color as string) || "#1a1a2e"}
            onChange={(e) => onChange({ color: e.target.value })}
          />
        </div>
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Alignment</span>
        <div className="mt-1 flex gap-1">
          {(["left", "center", "right"] as const).map((align) => (
            <button
              key={align}
              type="button"
              className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                (props.textAlign || "left") === align
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => onChange({ textAlign: align })}
            >
              {align.charAt(0).toUpperCase() + align.slice(1)}
            </button>
          ))}
        </div>
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Line Height</span>
        <input
          type="number"
          step="0.1"
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          value={(props.lineHeight as number) || 1.5}
          onChange={(e) => onChange({ lineHeight: Number(e.target.value) })}
          min={0.8}
          max={3}
        />
      </label>
    </div>
  );
}

/* ─── Registration ──────────────────────────── */

registerElement({
  type: "text",
  label: "Text",
  icon: <Type size={16} />,
  category: "content",
  defaultProps: {
    text: "Type something...",
    variant: "paragraph",
    fontSize: 16,
    fontWeight: "400",
    color: "#1a1a2e",
    textAlign: "left",
    lineHeight: 1.5,
    fontFamily: "inherit",
  },
  defaultTransform: { width: 300, height: 80 },
  component: TextElementComponent,
  propertyPanel: TextPropertyPanel,
});

registerElement({
  type: "heading",
  label: "Heading",
  icon: <HeadingIcon size={16} />,
  category: "content",
  defaultProps: {
    text: "Heading",
    variant: "heading",
    fontSize: 36,
    fontWeight: "700",
    color: "#1a1a2e",
    textAlign: "left",
    lineHeight: 1.2,
    fontFamily: "inherit",
  },
  defaultTransform: { width: 327, height: 60 },
  component: TextElementComponent,
  propertyPanel: TextPropertyPanel,
});
