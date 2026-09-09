"use client";

import { useState } from "react";

type Field = {
  name: string;
  label: string;
  type?: "text" | "email" | "textarea";
  placeholder?: string;
  required?: boolean;
};

export function LeadForm({
  fields,
  submitLabel,
  successMessage,
}: {
  fields: Field[];
  submitLabel: string;
  successMessage: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    for (const field of fields) {
      if (!field.required) continue;
      const value = data.get(field.name);
      if (typeof value !== "string" || value.trim() === "") {
        setError(`${field.label} is required.`);
        return;
      }
      if (field.type === "email" && !value.includes("@")) {
        setError("Enter a valid email address.");
        return;
      }
    }
    setError("");
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-cream px-6 py-8 text-center">
        <p className="text-[16px] font-medium text-ink">{successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col gap-1.5">
          <label htmlFor={field.name} className="text-[13px] font-medium text-ink/70">
            {field.label}
            {field.required && <span className="text-accent-dim"> *</span>}
          </label>
          {field.type === "textarea" ? (
            <textarea
              id={field.name}
              name={field.name}
              placeholder={field.placeholder}
              rows={4}
              className="rounded-2xl border border-ink/15 bg-white px-4 py-3 text-[14px] text-ink placeholder:text-ink/35 focus:border-accent focus:outline-none"
            />
          ) : (
            <input
              id={field.name}
              name={field.name}
              type={field.type ?? "text"}
              placeholder={field.placeholder}
              className="h-12 rounded-full border border-ink/15 bg-white px-4 text-[14px] text-ink placeholder:text-ink/35 focus:border-accent focus:outline-none"
            />
          )}
        </div>
      ))}
      {error && <p className="text-[12.5px] text-accent-dim">{error}</p>}
      <button
        type="submit"
        className="mt-2 inline-flex h-12 items-center justify-center rounded-full bg-ink text-[14px] font-semibold text-white transition-colors hover:bg-navy-deep"
      >
        {submitLabel}
      </button>
    </form>
  );
}
