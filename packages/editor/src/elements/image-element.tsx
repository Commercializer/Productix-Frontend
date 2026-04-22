/* ─────────────────────────────────────────────
 * Image Element — Upload, preview, free placement
 * ──────────────────────────────────────────── */

"use client";

import React, { useCallback, useRef, useState } from "react";
import { ImageIcon } from "lucide-react";
import { registerElement, type ElementRenderProps, type PropertyPanelProps } from "./registry";
import { ImageUploadWidget } from "../media/image-upload-widget";

/* ─── Component ─────────────────────────────── */

function ImageElementComponent({ props, isEditing, onPropsChange }: ElementRenderProps) {
  const src = (props.src as string) || "";
  const alt = (props.alt as string) || "";
  const objectFit = (props.objectFit as string) || "cover";
  const borderRadius = (props.borderRadius as number) || 0;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => {
        onPropsChange({ src: reader.result as string });
      };
      reader.readAsDataURL(file);
    },
    [onPropsChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  if (!src) {
    return (
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => isEditing && fileInputRef.current?.click()}
        style={{
          width: "100%",
          height: "100%",
          borderRadius,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: dragOver ? "rgba(59,130,246,0.1)" : "rgba(0,0,0,0.04)",
          border: `2px dashed ${dragOver ? "#3b82f6" : "#d1d5db"}`,
          cursor: isEditing ? "pointer" : "default",
          transition: "all 0.15s ease",
          gap: 8,
        }}
      >
        <ImageIcon size={28} style={{ opacity: 0.5, color: "#9ca3af" }} />
        <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>
          {isEditing ? "Click or drag to upload" : "No image"}
        </span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      style={{
        width: "100%",
        height: "100%",
        borderRadius,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        style={{
          width: "100%",
          height: "100%",
          objectFit: objectFit as React.CSSProperties["objectFit"],
          display: "block",
        }}
      />
      {dragOver && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(59,130,246,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 600,
            color: "#1d4ed8",
          }}
        >
          Drop to replace
        </div>
      )}
    </div>
  );
}

/* ─── Property Panel ────────────────────────── */

function ImagePropertyPanel({ props, onChange }: PropertyPanelProps) {
  return (
    <div className="space-y-3">
      {/* Image upload widget */}
      <ImageUploadWidget
        value={(props.src as string) || ""}
        onChange={(url) => onChange({ src: url })}
        label="Image"
      />

      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Alt Text</span>
        <input
          type="text"
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          value={(props.alt as string) || ""}
          onChange={(e) => onChange({ alt: e.target.value })}
        />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Object Fit</span>
        <select
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          value={(props.objectFit as string) || "cover"}
          onChange={(e) => onChange({ objectFit: e.target.value })}
        >
          <option value="cover">Cover</option>
          <option value="contain">Contain</option>
          <option value="fill">Fill</option>
          <option value="none">None</option>
        </select>
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Border Radius</span>
        <input
          type="number"
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          value={(props.borderRadius as number) || 0}
          onChange={(e) => onChange({ borderRadius: Number(e.target.value) })}
          min={0}
          max={999}
        />
      </label>
    </div>
  );
}

/* ─── Registration ──────────────────────────── */

registerElement({
  type: "image",
  label: "Image",
  icon: <ImageIcon size={16} />,
  category: "media",
  defaultProps: {
    src: "",
    alt: "",
    objectFit: "cover",
    borderRadius: 8,
  },
  defaultTransform: { width: 343, height: 260 },
  component: ImageElementComponent,
  propertyPanel: ImagePropertyPanel,
});
