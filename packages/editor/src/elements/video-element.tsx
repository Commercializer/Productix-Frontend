/* ─────────────────────────────────────────────
 * Video Element - Add video from link option
 *
 * Same pointer-event overlay pattern as the audio element:
 * in the editor, a transparent div covers the native <video>
 * controls so the ElementWrapper can handle selection /
 * dragging. On the public page the overlay is removed and
 * video controls work normally.
 * ──────────────────────────────────────────── */

"use client";

import React from "react";
import { Video } from "lucide-react";
import { registerElement, type ElementRenderProps, type PropertyPanelProps } from "./registry";

/** Returns true when running inside the editor canvas */
function isInsideEditor(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return !!(window as unknown as Record<string, unknown>).__productixEditor;
  } catch {
    return false;
  }
}

/* ─── URL Parsing ───────────────────────────── */

type VideoEmbed =
  | { kind: "youtube"; id: string }
  | { kind: "vimeo"; id: string }
  | { kind: "file"; src: string };

function parseVideoUrl(raw: string): VideoEmbed | null {
  const url = raw.trim();
  if (!url) return null;

  // YouTube: youtu.be/<id>, youtube.com/watch?v=<id>, youtube.com/shorts/<id>, youtube.com/embed/<id>
  const yt = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|v\/))([\w-]{11})/i,
  );
  if (yt?.[1]) return { kind: "youtube", id: yt[1] };

  // Vimeo: vimeo.com/<id> or player.vimeo.com/video/<id>
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (vm?.[1]) return { kind: "vimeo", id: vm[1] };

  return { kind: "file", src: url };
}

function buildEmbedSrc(
  embed: VideoEmbed,
  opts: { autoPlay: boolean; loop: boolean; muted: boolean },
): string {
  if (embed.kind === "youtube") {
    const params = new URLSearchParams({
      rel: "0",
      modestbranding: "1",
      playsinline: "1",
    });
    if (opts.autoPlay) params.set("autoplay", "1");
    if (opts.muted || opts.autoPlay) params.set("mute", "1");
    if (opts.loop) {
      params.set("loop", "1");
      params.set("playlist", embed.id);
    }
    return `https://www.youtube.com/embed/${embed.id}?${params}`;
  }
  if (embed.kind === "vimeo") {
    const params = new URLSearchParams();
    if (opts.autoPlay) params.set("autoplay", "1");
    if (opts.muted || opts.autoPlay) params.set("muted", "1");
    if (opts.loop) params.set("loop", "1");
    const qs = params.toString();
    return `https://player.vimeo.com/video/${embed.id}${qs ? `?${qs}` : ""}`;
  }
  return embed.src;
}

/* ─── Component ─────────────────────────────── */

function VideoElementComponent({ props }: ElementRenderProps) {
  const src = (props.src as string) || "";
  const borderRadius = (props.borderRadius as number) || 0;
  const autoPlay = (props.autoPlay as boolean) || false;
  const loop = (props.loop as boolean) || false;
  const muted = (props.muted as boolean) || false;
  const inEditor = isInsideEditor();
  const embed = parseVideoUrl(src);

  if (!embed) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.04)",
          border: "2px dashed #d1d5db",
          gap: 8,
        }}
      >
        <Video size={28} style={{ opacity: 0.5, color: "#9ca3af" }} />
        <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>
          {inEditor ? "Add video link in properties" : "No video"}
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {embed.kind === "file" ? (
        <video
          src={embed.src}
          controls
          autoPlay={autoPlay}
          loop={loop}
          muted={muted || autoPlay}
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
        <iframe
          src={buildEmbedSrc(embed, { autoPlay, loop, muted })}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          style={{
            width: "100%",
            height: "100%",
            border: 0,
            display: "block",
          }}
        />
      )}
      {/* Editor overlay - blocks native controls from stealing pointer events */}
      {inEditor && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            cursor: "move",
          }}
        />
      )}
    </div>
  );
}

/* ─── Property Panel ────────────────────────── */

function VideoPropertyPanel({ props, onChange }: PropertyPanelProps) {
  return (
    <div className="space-y-3">
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Video Link (URL)</span>
        <input
          type="url"
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          value={(props.src as string) || ""}
          onChange={(e) => onChange({ src: e.target.value })}
          placeholder="YouTube, Vimeo, or .mp4/.webm URL"
        />
        <span className="mt-1 block text-[10px] text-gray-400">
          YouTube and Vimeo links are embedded automatically.
        </span>
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

      <div className="flex flex-col gap-2 pt-2">
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
  type: "video",
  label: "Video",
  icon: <Video size={16} />,
  category: "media",
  defaultProps: {
    src: "",
    borderRadius: 8,
    autoPlay: false,
    loop: false,
    muted: false,
  },
  defaultTransform: { width: 343, height: 193 }, // 16:9 aspect ratio roughly
  component: VideoElementComponent,
  propertyPanel: VideoPropertyPanel,
});
