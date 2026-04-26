/* ─────────────────────────────────────────────
 * Audio Element — Upload audio or link option
 * ──────────────────────────────────────────── */

"use client";

import React, { useCallback, useRef, useState } from "react";
import { Music2 } from "lucide-react";
import { registerElement, type ElementRenderProps, type PropertyPanelProps } from "./registry";

/* ─── Component ─────────────────────────────── */

function AudioElementComponent({ props, isEditing, onPropsChange }: ElementRenderProps) {
  const src = (props.src as string) || "";
  const borderRadius = (props.borderRadius as number) || 8;
  const autoPlay = (props.autoPlay as boolean) || false;
  const loop = (props.loop as boolean) || false;
  const muted = (props.muted as boolean) || false;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("audio/")) return;
      try {
        // Upload to R2 cloud storage
        const { addMedia } = await import("../media/media-store");
        const item = await addMedia(file);
        onPropsChange({ src: item.url });
      } catch {
        // Fallback: read as data URL
        const reader = new FileReader();
        reader.onload = () => {
          onPropsChange({ src: reader.result as string });
        };
        reader.readAsDataURL(file);
      }
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
        <Music2 size={28} style={{ opacity: 0.5, color: "#9ca3af" }} />
        <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500, textAlign: "center", padding: "0 8px" }}>
          {isEditing ? "Click or drag to upload audio" : "No audio"}
        </span>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.02)",
        position: "relative",
      }}
    >
      <audio
        src={src}
        controls={true}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        style={{
          width: "100%",
          height: "100%",
          minHeight: 40,
          pointerEvents: isEditing ? "none" : "auto",
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
            borderRadius,
          }}
        >
          Drop to replace
        </div>
      )}
    </div>
  );
}

/* ─── Property Panel ────────────────────────── */

function AudioPropertyPanel({ props, onChange }: PropertyPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("audio/")) return;
    try {
      const { addMedia } = await import("../media/media-store");
      const item = await addMedia(file);
      onChange({ src: item.url });
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        onChange({ src: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Audio Source</span>
        
        <div className="flex gap-2 mb-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 rounded-md bg-blue-50 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100"
          >
            Upload Audio
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </div>
        
        <div className="text-center text-xs text-gray-400 mb-2">or link from URL</div>
        
        <input
          type="url"
          className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          value={(props.src as string) || ""}
          onChange={(e) => onChange({ src: e.target.value })}
          placeholder="https://..."
        />
      </div>

      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Border Radius</span>
        <input
          type="number"
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          value={(props.borderRadius as number) || 8}
          onChange={(e) => onChange({ borderRadius: Number(e.target.value) })}
          min={0}
          max={999}
        />
      </label>

      <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            checked={(props.autoPlay as boolean) || false}
            onChange={(e) => onChange({ autoPlay: e.target.checked })}
          />
          <span className="text-xs text-gray-700">Autoplay</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            checked={(props.loop as boolean) || false}
            onChange={(e) => onChange({ loop: e.target.checked })}
          />
          <span className="text-xs text-gray-700">Loop playback</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            checked={(props.muted as boolean) || false}
            onChange={(e) => onChange({ muted: e.target.checked })}
          />
          <span className="text-xs text-gray-700">Muted</span>
        </label>
      </div>
    </div>
  );
}

/* ─── Registration ──────────────────────────── */

registerElement({
  type: "audio",
  label: "Audio",
  icon: <Music2 size={16} />,
  category: "media",
  defaultProps: {
    src: "",
    borderRadius: 8,
    autoPlay: false,
    loop: false,
    muted: false,
  },
  defaultTransform: { width: 300, height: 50 },
  component: AudioElementComponent,
  propertyPanel: AudioPropertyPanel,
});
