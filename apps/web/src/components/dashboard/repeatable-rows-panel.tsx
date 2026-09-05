"use client";

// Generic repeatable-row table editor for every DPP section that's a real
// per-row table in the spreadsheet rather than a flat field list (Material
// composition, Substances' SVHC list, End-of-life assessment records, Repair
// & usage history's two logs, Product specifications) - see
// apps/web/src/lib/dpp/repeatable-rows.ts. One schema-driven component
// replaces what would otherwise be five near-identical hand-built editors;
// mirrors packaging-layers-panel.tsx's list/expand/remove pattern (the one
// section with genuinely unique per-row structure, so it keeps its own
// bespoke editor instead of using this one). Every entry's fields are always
// shown directly (no collapse-behind-"Edit", no numbered "Row N" header) -
// just the fields themselves, one entry after another.
import { Plus, X } from "lucide-react";
import { createEmptyRow, type Row, type RowFieldDef } from "@/lib/dpp/repeatable-rows";
import { isFullWidthField, isLongTextField } from "@/lib/dpp/sector-sections";

const inputClass =
  "w-full h-[38px] px-3 rounded-lg border border-(--ds-border) bg-(--ds-bg) text-[13px] text-(--ds-text-primary) placeholder-(--ds-text-muted) focus:outline-hidden focus:ring-2 focus:ring-[#0284c7]/20 focus:border-[#0284c7] transition-all";
const selectClass =
  "w-full h-[38px] px-3 rounded-lg border border-(--ds-border) bg-(--ds-bg) text-[13px] text-(--ds-text-primary) focus:outline-hidden focus:ring-2 focus:ring-[#0284c7]/20 focus:border-[#0284c7] transition-all";

function toggleOption(current: string, option: string): string {
  const selected = new Set(current ? current.split(",") : []);
  if (selected.has(option)) selected.delete(option);
  else selected.add(option);
  return [...selected].join(",");
}

function RowFieldInput({ field, value, onChange }: { field: RowFieldDef; value: string; onChange: (v: string) => void }) {
  if (field.type === "toggle") {
    const isYes = value === "Yes";
    return (
      <button
        type="button"
        onClick={() => onChange(isYes ? "No" : "Yes")}
        className={`inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          isYes ? "bg-(--ds-accent)" : "bg-[#cbd5e1] dark:bg-[#475569]"
        }`}
        aria-pressed={isYes}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white transition-transform ${
            isYes ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    );
  }

  if (field.type === "select") {
    return (
      <select value={value} onChange={(e) => onChange(e.target.value)} className={selectClass}>
        <option value="">— Select —</option>
        {field.options?.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "checkbox" && field.options && field.options.length > 0) {
    const selected = new Set(value ? value.split(",") : []);
    return (
      <div className="flex flex-wrap gap-3 h-[38px] items-center">
        {field.options.map((o) => (
          <label key={o} className="flex items-center gap-1.5 text-[13px] text-(--ds-text-primary) cursor-pointer select-none">
            <input type="checkbox" checked={selected.has(o)} onChange={() => onChange(toggleOption(value, o))} />
            {o}
          </label>
        ))}
      </div>
    );
  }

  if (field.type === "checkbox") {
    return (
      <div className="flex h-[38px] items-center">
        <input type="checkbox" checked={value === "Yes"} onChange={(e) => onChange(e.target.checked ? "Yes" : "No")} />
      </div>
    );
  }

  if (isLongTextField({ text: field.label, type: field.type })) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        placeholder={field.placeholder}
        className={`${inputClass} h-auto py-2.5 resize-y`}
      />
    );
  }

  return (
    <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} className={inputClass} />
  );
}

function RowForm({ fields, row, onChange }: { fields: RowFieldDef[]; row: Row; onChange: (row: Row) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {fields.map((f) => (
        <div key={f.key} className={isFullWidthField({ text: f.label, type: f.type }) ? "sm:col-span-2" : undefined}>
          <label className="block text-[12px] font-medium text-(--ds-text-primary) mb-1">{f.label}</label>
          <RowFieldInput field={f} value={row[f.key] ?? ""} onChange={(v) => onChange({ ...row, [f.key]: v })} />
        </div>
      ))}
    </div>
  );
}

export function RepeatableRowsPanel({
  fields,
  rows,
  onChange,
  addLabel,
  emptyLabel,
  max,
}: {
  fields: RowFieldDef[];
  rows: Row[];
  onChange: (rows: Row[]) => void;
  addLabel: string;
  emptyLabel: string;
  max?: number;
}) {
  const cap = max ?? Infinity;

  const addRow = () => {
    if (rows.length >= cap) return;
    onChange([...rows, createEmptyRow(fields)]);
  };

  const removeRow = (index: number) => onChange(rows.filter((_, i) => i !== index));

  const updateRow = (index: number, next: Row) => onChange(rows.map((r, i) => (i === index ? next : r)));

  return (
    <div className="space-y-5">
      {rows.length === 0 && <p className="text-[13px] text-(--ds-text-muted)">{emptyLabel}</p>}

      {rows.map((row, i) => (
        <div
          key={i}
          className={`relative pr-8 ${i > 0 ? "pt-5 border-t border-(--ds-border)" : ""}`}
        >
          <RowForm fields={fields} row={row} onChange={(next) => updateRow(i, next)} />
          <button
            type="button"
            onClick={() => removeRow(i)}
            className={`absolute right-0 text-(--ds-text-muted) hover:text-red-500 transition-colors ${i > 0 ? "top-5" : "top-0"}`}
            aria-label="Remove entry"
          >
            <X size={16} />
          </button>
        </div>
      ))}

      {rows.length < cap ? (
        <button
          type="button"
          onClick={addRow}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-(--ds-accent) hover:opacity-80 transition-opacity"
        >
          <Plus size={14} /> {addLabel}
        </button>
      ) : (
        <p className="text-[12px] text-(--ds-text-muted)">Maximum of {max} reached.</p>
      )}
    </div>
  );
}
