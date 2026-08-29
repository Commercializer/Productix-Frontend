"use client";

// Floating GS1 / DPP toggle shown at /01/{gtin} when a product has both a
// published showcase AND a filled-in Digital Product Passport. `gs1` and
// `dpp` are already-rendered server output (Server Components can be passed
// down as children/props to a Client Component) - this just decides which
// one is mounted, so switching never re-fetches or re-renders the other.
import { useState } from "react";
import type { ReactNode } from "react";

export function GtinModeSwitcher({
  gs1,
  dpp,
  defaultMode,
}: {
  gs1: ReactNode;
  dpp: ReactNode;
  defaultMode: "gs1" | "dpp";
}) {
  const [mode, setMode] = useState<"gs1" | "dpp">(defaultMode);

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "fixed",
          top: 16,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
          display: "flex",
          padding: 4,
          borderRadius: 999,
          background: "#fff",
          boxShadow: "0 2px 12px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.04)",
          fontFamily: "var(--font-sans)",
        }}
      >
        {(["gs1", "dpp"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            style={{
              padding: "7px 18px",
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.02em",
              transition: "all 0.15s ease",
              background: mode === m ? "#0f172a" : "transparent",
              color: mode === m ? "#fff" : "#64748b",
            }}
          >
            {m === "gs1" ? "GS1" : "DPP"}
          </button>
        ))}
      </div>

      {mode === "gs1" ? gs1 : dpp}
    </div>
  );
}
