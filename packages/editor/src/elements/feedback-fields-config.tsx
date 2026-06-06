/* ─────────────────────────────────────────────
 * Feedback field-builder UI - shared property-panel
 * pieces used by both the Feedback (button → sheet)
 * element and the standalone Feedback Form element.
 *
 * Keeping these here means the field builder (toggles,
 * per-type config, the add/remove custom-field list)
 * is authored once and stays identical across both.
 * ──────────────────────────────────────────── */

"use client";

import React from "react";
import { resolveFields, getDefaultFeedbackLabels, BUILTIN_FIELD_IDS, type CustomField, type FeedbackFieldType, type FeedbackSheetFields } from "./feedback-sheet";
import { useCanvasStore } from "../engine/canvas-store";
import { useFeedbackBuilderStore } from "./feedback-builder-store";

/* ─── Toggle switch for a built-in field ─────── */

export function FieldToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "10px 12px",
        borderRadius: 10,
        border: "1px solid #e5e7eb",
        background: "#fff",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1f2937" }}>{label}</div>
        {description && <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{description}</div>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        style={{
          flexShrink: 0,
          width: 36,
          height: 20,
          borderRadius: 10,
          border: "none",
          cursor: "pointer",
          position: "relative",
          background: checked ? "#0ea5e9" : "#d1d5db",
          transition: "background 0.18s ease",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 2,
            left: checked ? 18 : 2,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#fff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            transition: "left 0.18s ease",
          }}
        />
      </button>
    </div>
  );
}

/* ─── Per-type configuration for a custom field ── */

export function FieldTypeConfig({ field, update }: { field: CustomField; update: (patch: Partial<CustomField>) => void }) {
  const cfgInput: React.CSSProperties = { padding: "6px 9px", border: "1px solid #e5e7eb", borderRadius: 7, fontSize: 12, outline: "none", width: "100%", boxSizing: "border-box" };
  const cfgLabel: React.CSSProperties = { fontSize: 10.5, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 3, display: "block" };

  if (field.type === "select" || field.type === "multiselect") {
    const options = field.options ?? [];
    const setOption = (idx: number, value: string) => update({ options: options.map((o, i) => (i === idx ? value : o)) });
    const removeOption = (idx: number) => update({ options: options.filter((_, i) => i !== idx) });
    const addOption = () => update({ options: [...options, `Option ${options.length + 1}`] });
    return (
      <div style={{ borderTop: "1px dashed #e5e7eb", paddingTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={cfgLabel}>Choices</span>
        {options.length === 0 && <div style={{ fontSize: 11, color: "#9ca3af" }}>No choices yet. Add at least one option.</div>}
        {options.map((opt, i) => (
          <div key={i} style={{ display: "flex", gap: 6 }}>
            <input style={cfgInput} value={opt} onChange={(e) => setOption(i, e.target.value)} placeholder={`Option ${i + 1}`} />
            <button
              type="button"
              onClick={() => removeOption(i)}
              aria-label="Remove option"
              style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 6, border: "1px solid #fecaca", background: "#fef2f2", color: "#b91c1c", cursor: "pointer", fontSize: 13, lineHeight: 1 }}
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addOption}
          style={{ alignSelf: "flex-start", padding: "4px 9px", fontSize: 11, fontWeight: 600, borderRadius: 6, border: "1px solid #d1d5db", background: "#fff", color: "#374151", cursor: "pointer" }}
        >
          + Add choice
        </button>
      </div>
    );
  }

  if (field.type === "star") {
    return (
      <div style={{ borderTop: "1px dashed #e5e7eb", paddingTop: 8 }}>
        <span style={cfgLabel}>Number of stars</span>
        <input
          type="number"
          min={2}
          max={10}
          style={{ ...cfgInput, width: 90 }}
          value={field.max ?? 5}
          onChange={(e) => update({ max: Math.max(2, Math.min(10, Number(e.target.value) || 5)) })}
        />
      </div>
    );
  }

  if (field.type === "slider") {
    return (
      <div style={{ borderTop: "1px dashed #e5e7eb", paddingTop: 8, display: "flex", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <span style={cfgLabel}>Min</span>
          <input type="number" style={cfgInput} value={field.min ?? 0} onChange={(e) => update({ min: Number(e.target.value) })} />
        </div>
        <div style={{ flex: 1 }}>
          <span style={cfgLabel}>Max</span>
          <input type="number" style={cfgInput} value={field.max ?? 10} onChange={(e) => update({ max: Number(e.target.value) })} />
        </div>
        <div style={{ flex: 1 }}>
          <span style={cfgLabel}>Step</span>
          <input type="number" min={1} style={cfgInput} value={field.step ?? 1} onChange={(e) => update({ step: Math.max(1, Number(e.target.value) || 1) })} />
        </div>
      </div>
    );
  }

  if (field.type === "branch") {
    return (
      <div style={{ borderTop: "1px dashed #e5e7eb", paddingTop: 8, fontSize: 11, color: "#9ca3af", lineHeight: 1.4 }}>
        Visitors pick from your company's active branches (managed in Settings → Branches).
      </div>
    );
  }

  if (field.type === "emoji" || field.type === "nps") {
    return (
      <div style={{ borderTop: "1px dashed #e5e7eb", paddingTop: 8, fontSize: 11, color: "#9ca3af", lineHeight: 1.4 }}>
        {field.type === "emoji" ? "5-face happiness scale, stored as a 1–5 score." : "0–10 Net Promoter Score scale."}
      </div>
    );
  }

  return null;
}

/* ─── Built-in field toggles ─────────────────── */

export function BuiltInFieldToggles({
  fields,
  onChange,
}: {
  fields: FeedbackSheetFields;
  onChange: (patch: Partial<FeedbackSheetFields>) => void;
}) {
  return (
    <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 6 }}>
      <FieldToggle label="Name" description="Customer's name" checked={fields.name} onChange={(v) => onChange({ name: v })} />
      <FieldToggle label="Phone" description="Phone number (required when shown)" checked={fields.phone} onChange={(v) => onChange({ phone: v })} />
      <FieldToggle label="Email" description="Email address (optional when shown)" checked={fields.email} onChange={(v) => onChange({ email: v })} />
      <FieldToggle label="Details" description="The main message textarea" checked={fields.details} onChange={(v) => onChange({ details: v })} />
    </div>
  );
}

/* ─── Custom-field list editor (add / edit / remove) ── */

export function CustomFieldsEditor({
  customFields,
  onChange,
}: {
  customFields: CustomField[];
  onChange: (next: CustomField[]) => void;
}) {
  const updateCustomField = (id: string, patch: Partial<CustomField>) => {
    onChange(customFields.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  };
  const removeCustomField = (id: string) => {
    onChange(customFields.filter((f) => f.id !== id));
  };
  const addCustomField = () => {
    const id = `cf_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    const next: CustomField = { id, label: "New field", placeholder: "", type: "text", required: false };
    onChange([...customFields, next]);
  };

  const labelCls = "text-xs font-medium text-gray-500 uppercase tracking-wide";

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <span className={labelCls}>Custom fields</span>
        <button
          type="button"
          onClick={addCustomField}
          style={{ padding: "5px 10px", fontSize: 11, fontWeight: 600, borderRadius: 6, border: "1px solid #0ea5e9", background: "#0ea5e9", color: "#fff", cursor: "pointer" }}
        >
          + Add field
        </button>
      </div>

      {customFields.length === 0 && (
        <div style={{ padding: "12px 14px", borderRadius: 10, border: "1px dashed #e5e7eb", background: "#fafafa", fontSize: 11.5, color: "#9ca3af", textAlign: "center" }}>
          No extra fields yet. Add one to collect things like address, order number, or rating.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {customFields.map((f) => (
          <div key={f.id} style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff", display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="text"
                value={f.label}
                onChange={(e) => updateCustomField(f.id, { label: e.target.value })}
                placeholder="Field label"
                style={{ flex: 1, padding: "7px 10px", border: "1px solid #e5e7eb", borderRadius: 7, fontSize: 12.5, outline: "none" }}
              />
              <button
                type="button"
                onClick={() => removeCustomField(f.id)}
                aria-label="Remove field"
                style={{ width: 32, height: 32, borderRadius: 7, border: "1px solid #fecaca", background: "#fef2f2", color: "#b91c1c", cursor: "pointer", fontSize: 14, lineHeight: 1 }}
              >
                ×
              </button>
            </div>
            <input
              type="text"
              value={f.placeholder ?? ""}
              onChange={(e) => updateCustomField(f.id, { placeholder: e.target.value })}
              placeholder="Placeholder (optional)"
              style={{ padding: "7px 10px", border: "1px solid #e5e7eb", borderRadius: 7, fontSize: 12.5, outline: "none" }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <select
                value={f.type}
                onChange={(e) => updateCustomField(f.id, { type: e.target.value as CustomField["type"] })}
                style={{ flex: 1, padding: "7px 10px", border: "1px solid #e5e7eb", borderRadius: 7, fontSize: 12.5, background: "#fff", outline: "none" }}
              >
                <optgroup label="Text">
                  <option value="text">Text</option>
                  <option value="textarea">Long text</option>
                  <option value="tel">Phone</option>
                  <option value="email">Email</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                  <option value="image">Image upload</option>
                </optgroup>
                <optgroup label="Rating">
                  <option value="star">Star rating</option>
                  <option value="emoji">Emoji / happiness</option>
                  <option value="nps">NPS (0–10)</option>
                  <option value="slider">Slider</option>
                </optgroup>
                <optgroup label="Choice">
                  <option value="select">Dropdown (single)</option>
                  <option value="multiselect">Checkboxes (multi)</option>
                  <option value="branch">Branch picker</option>
                </optgroup>
              </select>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#374151", cursor: "pointer", paddingLeft: 4 }}>
                <input type="checkbox" checked={f.required} onChange={(e) => updateCustomField(f.id, { required: e.target.checked })} />
                Required
              </label>
            </div>
            <FieldTypeConfig field={f} update={(patch) => updateCustomField(f.id, patch)} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Free-canvas field builder (palette + selected-field settings) ── */

const PALETTE: Array<{ type: FeedbackFieldType; label: string }> = [
  { type: "text", label: "Text" },
  { type: "textarea", label: "Long text" },
  { type: "tel", label: "Phone" },
  { type: "email", label: "Email" },
  { type: "number", label: "Number" },
  { type: "date", label: "Date" },
  { type: "image", label: "Image" },
  { type: "star", label: "Star rating" },
  { type: "emoji", label: "Emoji" },
  { type: "nps", label: "NPS" },
  { type: "slider", label: "Slider" },
  { type: "select", label: "Dropdown" },
  { type: "multiselect", label: "Checkboxes" },
  { type: "branch", label: "Branch" },
];

/** Built-in field id → the props that hold its editable label / placeholder. */
const BUILTIN_PROP_KEYS: Record<string, { labelKey: string; placeholderKey: string; name: string }> = {
  [BUILTIN_FIELD_IDS.name]: { labelKey: "nameLabel", placeholderKey: "namePlaceholder", name: "Name" },
  [BUILTIN_FIELD_IDS.phone]: { labelKey: "phoneLabel", placeholderKey: "phonePlaceholder", name: "Phone" },
  [BUILTIN_FIELD_IDS.email]: { labelKey: "emailLabel", placeholderKey: "emailPlaceholder", name: "Email" },
  [BUILTIN_FIELD_IDS.details]: { labelKey: "detailsLabel", placeholderKey: "detailsPlaceholder", name: "Details" },
};

const settingsInput: React.CSSProperties = { width: "100%", padding: "7px 10px", border: "1px solid #e5e7eb", borderRadius: 7, fontSize: 12.5, outline: "none", boxSizing: "border-box" };
const settingsLabel = "text-xs font-medium text-gray-500 uppercase tracking-wide";

export function FeedbackFieldsBuilder({
  props,
  onChange,
}: {
  props: Record<string, unknown>;
  onChange: (changes: Record<string, unknown>) => void;
}) {
  const elementId = useCanvasStore((s) => s.selectedIds[0]);
  const selection = useFeedbackBuilderStore((s) => s.selection);
  const select = useFeedbackBuilderStore((s) => s.select);

  const customs: CustomField[] = Array.isArray(props.customFields) ? (props.customFields as CustomField[]) : [];
  const resolved = resolveFields(props, getDefaultFeedbackLabels());

  const selectedField =
    selection && selection.elementId === elementId ? resolved.find((rf) => rf.field.id === selection.fieldId)?.field : undefined;

  const addField = (type: FeedbackFieldType) => {
    const id = `cf_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    const paletteLabel = PALETTE.find((p) => p.type === type)?.label ?? "New field";
    const next: CustomField = {
      id,
      label: paletteLabel,
      placeholder: "",
      type,
      required: false,
      ...(type === "select" || type === "multiselect" ? { options: ["Option 1"] } : {}),
    };
    onChange({ customFields: [...customs, next] });
    if (elementId) select(elementId, id);
  };

  const setBuiltin = (kind: keyof FeedbackSheetFields, on: boolean) => {
    const key = { name: "showNameField", phone: "showPhoneField", email: "showEmailField", details: "showDetailsField" }[kind];
    onChange({ [key]: on });
  };

  return (
    <div className="space-y-3">
      {/* ── Add field palette ── */}
      <div>
        <span className={settingsLabel}>Add a field</span>
        <div style={{ marginTop: 6, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {PALETTE.map((p) => (
            <button
              key={p.type}
              type="button"
              onClick={() => addField(p.type)}
              style={{ padding: "8px 10px", fontSize: 11.5, fontWeight: 600, borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", color: "#374151", cursor: "pointer", textAlign: "left" }}
            >
              + {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Built-in contact fields ── */}
      <div>
        <span className={settingsLabel}>Built-in fields</span>
        <BuiltInFieldToggles
          fields={{
            name: props.showNameField !== false,
            phone: props.showPhoneField !== false,
            email: props.showEmailField !== false,
            details: props.showDetailsField !== false,
          }}
          onChange={(patch) => {
            if (patch.name !== undefined) setBuiltin("name", patch.name);
            if (patch.phone !== undefined) setBuiltin("phone", patch.phone);
            if (patch.email !== undefined) setBuiltin("email", patch.email);
            if (patch.details !== undefined) setBuiltin("details", patch.details);
          }}
        />
      </div>

      {/* ── Selected-field settings ── */}
      <div style={{ borderTop: "1px solid #eef2f7", paddingTop: 12 }}>
        <span className={settingsLabel}>Field settings</span>
        {!selectedField && (
          <div style={{ marginTop: 6, padding: "12px 14px", borderRadius: 10, border: "1px dashed #e5e7eb", background: "#fafafa", fontSize: 11.5, color: "#9ca3af", textAlign: "center" }}>
            Select a field on the canvas to edit its settings.
          </div>
        )}
        {selectedField && selectedField.builtin && (
          <BuiltinFieldSettings field={selectedField} props={props} onChange={onChange} />
        )}
        {selectedField && !selectedField.builtin && (
          <CustomFieldSettings
            field={customs.find((c) => c.id === selectedField.id) ?? selectedField}
            onChange={(patch) => onChange({ customFields: customs.map((c) => (c.id === selectedField.id ? { ...c, ...patch } : c)) })}
          />
        )}
      </div>
    </div>
  );
}

function BuiltinFieldSettings({ field, props, onChange }: { field: CustomField; props: Record<string, unknown>; onChange: (changes: Record<string, unknown>) => void }) {
  const meta = BUILTIN_PROP_KEYS[field.id];
  if (!meta) return null;
  const d = getDefaultFeedbackLabels() as unknown as Record<string, string>;
  return (
    <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ fontSize: 11, color: "#9ca3af" }}>Built-in <strong>{meta.name}</strong> field — saved to the contact record.</div>
      <div>
        <span className={settingsLabel}>Label</span>
        <input
          type="text"
          style={settingsInput}
          value={(props[meta.labelKey] as string) || ""}
          placeholder={d[meta.labelKey] || ""}
          onChange={(e) => onChange({ [meta.labelKey]: e.target.value })}
        />
      </div>
      <div>
        <span className={settingsLabel}>Placeholder</span>
        <input
          type="text"
          style={settingsInput}
          value={(props[meta.placeholderKey] as string) || ""}
          placeholder={d[meta.placeholderKey] || ""}
          onChange={(e) => onChange({ [meta.placeholderKey]: e.target.value })}
        />
      </div>
    </div>
  );
}

function CustomFieldSettings({ field, onChange }: { field: CustomField; onChange: (patch: Partial<CustomField>) => void }) {
  return (
    <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
      <div>
        <span className={settingsLabel}>Label</span>
        <input type="text" style={settingsInput} value={field.label} onChange={(e) => onChange({ label: e.target.value })} placeholder="Field label" />
      </div>
      <div>
        <span className={settingsLabel}>Placeholder</span>
        <input type="text" style={settingsInput} value={field.placeholder ?? ""} onChange={(e) => onChange({ placeholder: e.target.value })} placeholder="Placeholder (optional)" />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <select
          value={field.type}
          onChange={(e) => onChange({ type: e.target.value as CustomField["type"] })}
          style={{ ...settingsInput, flex: 1, background: "#fff" }}
        >
          <optgroup label="Text">
            <option value="text">Text</option>
            <option value="textarea">Long text</option>
            <option value="tel">Phone</option>
            <option value="email">Email</option>
            <option value="number">Number</option>
            <option value="date">Date</option>
            <option value="image">Image upload</option>
          </optgroup>
          <optgroup label="Rating">
            <option value="star">Star rating</option>
            <option value="emoji">Emoji / happiness</option>
            <option value="nps">NPS (0–10)</option>
            <option value="slider">Slider</option>
          </optgroup>
          <optgroup label="Choice">
            <option value="select">Dropdown (single)</option>
            <option value="multiselect">Checkboxes (multi)</option>
            <option value="branch">Branch picker</option>
          </optgroup>
        </select>
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#374151", cursor: "pointer", paddingLeft: 4 }}>
          <input type="checkbox" checked={field.required} onChange={(e) => onChange({ required: e.target.checked })} />
          Required
        </label>
      </div>
      <FieldTypeConfig field={field} update={onChange} />
    </div>
  );
}
