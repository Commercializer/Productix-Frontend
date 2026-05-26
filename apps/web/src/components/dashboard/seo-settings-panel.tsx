"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { ImageIcon, Loader2, UploadCloud, X, Check, AlertCircle } from "lucide-react";
import { SocialPreview } from "./social-preview";
import { updatePageMetaAction } from "@/lib/dashboard/actions";

export interface SeoSettingsValues {
  productName: string;
  tagline: string | null;
  metaDescription: string | null;
  ogImageUrl: string | null;
  logoUrl: string | null;
}

interface SeoSettingsPanelProps {
  profileId: string;
  initial: SeoSettingsValues;
  /** Public URL of the page - used for the social previews. */
  publicUrl: string;
  /** Public domain - used as the source line in social previews. */
  domain: string;
  /** Called when the user saves; parent can refresh the mockup with new values. */
  onSaved?: (values: SeoSettingsValues) => void;
  /** Called on every keystroke / upload so the parent can update the live mockup. */
  onChange?: (values: SeoSettingsValues) => void;
}

type SaveState = { kind: "idle" } | { kind: "saving" } | { kind: "saved" } | { kind: "error"; message: string };

const TITLE_MAX = 70;
const DESC_MAX = 160;

export function SeoSettingsPanel({
  profileId,
  initial,
  publicUrl,
  domain,
  onSaved,
  onChange,
}: SeoSettingsPanelProps) {
  const [values, setValues] = useState<SeoSettingsValues>(initial);
  const [saveState, setSaveState] = useState<SaveState>({ kind: "idle" });
  const [, startTransition] = useTransition();

  // Notify parent on change for live mockup updates
  useEffect(() => {
    onChange?.(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  // Auto-clear "saved" badge after a moment
  useEffect(() => {
    if (saveState.kind !== "saved") return;
    const t = window.setTimeout(() => setSaveState({ kind: "idle" }), 1800);
    return () => window.clearTimeout(t);
  }, [saveState.kind]);

  const dirty =
    values.productName !== initial.productName ||
    (values.tagline ?? "") !== (initial.tagline ?? "") ||
    (values.metaDescription ?? "") !== (initial.metaDescription ?? "") ||
    (values.ogImageUrl ?? "") !== (initial.ogImageUrl ?? "") ||
    (values.logoUrl ?? "") !== (initial.logoUrl ?? "");

  function handleSave() {
    setSaveState({ kind: "saving" });
    startTransition(async () => {
      const result = await updatePageMetaAction(profileId, {
        productName: values.productName,
        tagline: values.tagline,
        metaDescription: values.metaDescription,
        ogImageUrl: values.ogImageUrl,
        logoUrl: values.logoUrl,
      });
      if ("error" in result && result.error) {
        setSaveState({ kind: "error", message: result.error });
        return;
      }
      setSaveState({ kind: "saved" });
      onSaved?.(values);
    });
  }

  const previewTitle = values.tagline?.trim() || values.productName;
  const previewDescription = values.metaDescription?.trim() || "";
  const previewImage = values.ogImageUrl?.trim() || "";

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-(--ds-bg)">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-(--ds-border) bg-(--ds-bg)/90 backdrop-blur-xl px-6 py-4">
        <div>
          <h2 className="text-[15px] font-semibold text-(--ds-text-primary) leading-tight">
            SEO & sharing
          </h2>
          <p className="text-[12px] text-(--ds-text-secondary) mt-0.5">
            How this page appears in search and link previews
          </p>
        </div>
        <SaveButton state={saveState} disabled={!dirty} onClick={handleSave} />
      </div>

      <div className="flex flex-col gap-7 px-6 py-6">
        {/* Page title */}
        <Field label="Page title" hint={`${values.productName.length}/${TITLE_MAX}`}>
          <input
            type="text"
            value={values.productName}
            maxLength={TITLE_MAX}
            onChange={(e) => setValues((v) => ({ ...v, productName: e.target.value }))}
            placeholder="My awesome product"
            className="seo-input"
          />
        </Field>

        {/* OG title (tagline) */}
        <Field
          label="OG title / tagline"
          hint={`${(values.tagline ?? "").length}/${TITLE_MAX}`}
          description="The headline shown when the link is shared. Falls back to the page title if empty."
        >
          <input
            type="text"
            value={values.tagline ?? ""}
            maxLength={TITLE_MAX}
            onChange={(e) => setValues((v) => ({ ...v, tagline: e.target.value || null }))}
            placeholder="Short, scroll-stopping headline"
            className="seo-input"
          />
        </Field>

        {/* Description */}
        <Field
          label="Description"
          hint={`${(values.metaDescription ?? "").length}/${DESC_MAX}`}
          description="One-line summary for search results and link previews."
        >
          <textarea
            value={values.metaDescription ?? ""}
            maxLength={DESC_MAX}
            rows={3}
            onChange={(e) => setValues((v) => ({ ...v, metaDescription: e.target.value || null }))}
            placeholder="Tell people what they'll get when they tap through…"
            className="seo-input resize-none"
          />
        </Field>

        {/* OG image */}
        <Field
          label="Social image (OG)"
          description="Shown when this link is shared on Facebook, LinkedIn, WhatsApp, etc. Recommended 1200×630."
        >
          <ImageUploadField
            value={values.ogImageUrl}
            aspect="1.91/1"
            placeholderIcon={<ImageIcon size={20} className="text-(--ds-text-secondary)" />}
            placeholderText="Upload OG image"
            onChange={(url) => setValues((v) => ({ ...v, ogImageUrl: url }))}
          />
        </Field>

        {/* Favicon */}
        <Field
          label="Favicon"
          description="The tiny icon in browser tabs and address bars. PNG/SVG/ICO, square."
        >
          <ImageUploadField
            value={values.logoUrl}
            aspect="1/1"
            small
            accept="image/*,.ico"
            allowIco
            placeholderIcon={<ImageIcon size={16} className="text-(--ds-text-secondary)" />}
            placeholderText="Upload favicon"
            onChange={(url) => setValues((v) => ({ ...v, logoUrl: url }))}
          />
        </Field>

        {/* Link preview */}
        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <label className="text-[12px] font-semibold uppercase tracking-wider text-(--ds-text-secondary)">
              Link preview
            </label>
            <span className="text-[11px] text-(--ds-text-muted)">Live</span>
          </div>
          <SocialPreview
            title={previewTitle}
            description={previewDescription}
            image={previewImage}
            url={publicUrl}
            domain={domain}
          />
        </div>
      </div>

      <style jsx>{`
        :global(.seo-input) {
          width: 100%;
          padding: 10px 12px;
          font-size: 13px;
          line-height: 1.45;
          color: var(--ds-text-primary);
          background: var(--ds-surface);
          border: 1px solid var(--ds-border);
          border-radius: 10px;
          transition: border-color 0.15s, box-shadow 0.15s;
          font-family: inherit;
        }
        :global(.seo-input:focus) {
          outline: none;
          border-color: rgba(59, 130, 246, 0.5);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
        }
        :global(.seo-input::placeholder) {
          color: var(--ds-text-muted, #94a3b8);
        }
      `}</style>
    </div>
  );
}

/* ─── Field ─────────────────────────────────────────────── */

function Field({
  label,
  hint,
  description,
  children,
}: {
  label: string;
  hint?: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label className="text-[12px] font-semibold uppercase tracking-wider text-(--ds-text-secondary)">
          {label}
        </label>
        {hint && <span className="text-[11px] text-(--ds-text-muted)">{hint}</span>}
      </div>
      {description && (
        <p className="mb-2 text-[12px] leading-snug text-(--ds-text-secondary)">{description}</p>
      )}
      {children}
    </div>
  );
}

/* ─── Image upload ──────────────────────────────────────── */

function ImageUploadField({
  value,
  onChange,
  aspect,
  placeholderIcon,
  placeholderText,
  small,
  accept = "image/*",
  allowIco,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  aspect: string;
  placeholderIcon: React.ReactNode;
  placeholderText: string;
  small?: boolean;
  accept?: string;
  allowIco?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  async function upload(file: File) {
    setError(null);
    const isIco = allowIco && /\.ico$/i.test(file.name);
    if (!file.type.startsWith("image/") && !isIco) {
      setError("File must be an image");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/media/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Upload failed");
      }
      onChange(data.url);
    } catch (e: any) {
      setError(e?.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function openPicker() {
    inputRef.current?.click();
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) upload(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  }

  const padBox = small ? "p-2" : "p-3";
  const frameSize = small ? { width: 64, height: 64 } : undefined;

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFile}
        className="hidden"
      />

      {value ? (
        <div className={`flex items-center gap-3 rounded-xl border border-(--ds-border) bg-(--ds-surface) ${padBox}`}>
          <div
            className="relative overflow-hidden rounded-lg bg-(--ds-bg) shrink-0"
            style={frameSize ?? { aspectRatio: aspect, width: small ? 64 : 120 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" className="absolute inset-0 h-full w-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] text-(--ds-text-primary)">{value.split("/").pop()}</p>
            <div className="mt-1 flex items-center gap-2">
              <button
                type="button"
                onClick={openPicker}
                className="text-[11px] font-medium text-(--ds-text-secondary) hover:text-(--ds-text-primary) transition-colors"
              >
                Replace
              </button>
              <span className="text-(--ds-text-muted)">·</span>
              <button
                type="button"
                onClick={() => onChange(null)}
                className="text-[11px] font-medium text-red-500 hover:text-red-600 transition-colors flex items-center gap-0.5"
              >
                <X size={11} /> Remove
              </button>
            </div>
            {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`flex w-full items-center justify-center gap-2 rounded-xl border border-dashed transition-colors ${padBox} ${
            dragging
              ? "border-blue-400 bg-blue-50/40 dark:bg-blue-500/5"
              : "border-(--ds-border) bg-(--ds-surface) hover:bg-(--ds-surface-2)"
          }`}
          style={small ? { minHeight: 56 } : { minHeight: 96 }}
        >
          {uploading ? (
            <>
              <Loader2 size={14} className="animate-spin text-(--ds-text-secondary)" />
              <span className="text-[12px] text-(--ds-text-secondary)">Uploading…</span>
            </>
          ) : (
            <>
              {placeholderIcon}
              <div className="flex flex-col items-start">
                <span className="text-[12px] font-medium text-(--ds-text-primary)">{placeholderText}</span>
                <span className="text-[11px] text-(--ds-text-secondary)">Drag &amp; drop or click</span>
              </div>
              <UploadCloud size={14} className="ml-auto text-(--ds-text-secondary)" />
            </>
          )}
        </button>
      )}
      {error && !value && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
    </div>
  );
}

/* ─── Save button ───────────────────────────────────────── */

function SaveButton({
  state,
  disabled,
  onClick,
}: {
  state: SaveState;
  disabled: boolean;
  onClick: () => void;
}) {
  if (state.kind === "saved") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-3 py-1.5 text-[12px] font-semibold text-emerald-600">
        <Check size={13} /> Saved
      </span>
    );
  }
  if (state.kind === "error") {
    return (
      <span
        title={state.message}
        className="inline-flex items-center gap-1.5 rounded-md bg-red-500/10 px-3 py-1.5 text-[12px] font-semibold text-red-600"
      >
        <AlertCircle size={13} /> Error
      </span>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || state.kind === "saving"}
      className="inline-flex h-8 items-center gap-1.5 rounded-md bg-(--ds-text-primary) px-3.5 text-[12px] font-semibold text-(--ds-bg) transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {state.kind === "saving" && <Loader2 size={12} className="animate-spin" />}
      {state.kind === "saving" ? "Saving…" : "Save"}
    </button>
  );
}
