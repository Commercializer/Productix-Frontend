"use client";

import { useState } from "react";

export function EmailSignup() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email");
    if (typeof email !== "string" || !email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="text-[14px] font-medium text-ink">
        Thanks, you are on the list.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-2 sm:max-w-sm">
      <div className="flex gap-2">
        <label htmlFor="footer-email" className="sr-only">
          Email address
        </label>
        <input
          id="footer-email"
          name="email"
          type="email"
          placeholder="you@company.com"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "footer-email-error" : undefined}
          className="h-11 flex-1 rounded-full border border-ink/15 bg-white px-4 text-[13.5px] text-ink placeholder:text-ink/40 focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-[13.5px] font-semibold text-white transition-colors hover:bg-navy-deep"
        >
          Submit
        </button>
      </div>
      {error && (
        <p id="footer-email-error" className="text-[12px] text-accent-dim">
          {error}
        </p>
      )}
    </form>
  );
}
