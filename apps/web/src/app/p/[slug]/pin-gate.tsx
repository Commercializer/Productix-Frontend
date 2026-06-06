"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Lock, Delete, Check, Loader2 } from "lucide-react";
import { verifyPagePinAction, getUnlockedPageAction } from "@/lib/dashboard/actions";
import { PublicPageClient } from "./client";

type PageData = React.ComponentProps<typeof PublicPageClient>["page"];

interface PinGateProps {
  readonly profileId: string;
  readonly productName: string;
  readonly companyName: string;
  readonly logoUrl?: string | null;
  readonly themeColor?: string | null;
  /** Known PIN length so the gate shows the exact number of dots. */
  readonly pinLength?: number | null;
}

const MIN_PIN = 4;
const MAX_PIN = 6;
const DEFAULT_ACCENT = "#0284c7";

/** localStorage key for a product's unlock JWT — scoped per product so each
 * locked page is remembered independently. */
function storageKey(profileId: string): string {
  return `productix_pin_${profileId}`;
}

/**
 * The page's theme color can be a light background (used for browser chrome),
 * which would make an accent-tinted lock icon / dots invisible. Fall back to the
 * brand blue when the color is unparseable or too light to read on white.
 */
function resolveAccent(color?: string | null): string {
  if (!color) return DEFAULT_ACCENT;
  let hex = color.trim();
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex);
  if (!m) return DEFAULT_ACCENT;
  hex = m[1]!;
  if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);
  // Perceived luminance (0–255). Anything very bright won't read on the card.
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 215 ? DEFAULT_ACCENT : `#${hex}`;
}

/**
 * Full-screen PIN prompt rendered in place of a locked showcase page. Unlock
 * state lives in a signed JWT in the visitor's localStorage (one per product),
 * so repeat visits skip the prompt without any server-side session. The
 * showcase content is only fetched once a valid token / correct PIN is present.
 */
export function PinGate({ profileId, productName, companyName, logoUrl, themeColor, pinLength }: PinGateProps) {
  const [page, setPage] = useState<PageData | null>(null);
  const [checking, setChecking] = useState(true);
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [shake, setShake] = useState(false);

  const accent = resolveAccent(themeColor);
  // Exact number of dots to show. Falls back to the max for legacy pages that
  // were locked before the length was recorded.
  const targetLength = Math.min(MAX_PIN, Math.max(MIN_PIN, pinLength ?? MAX_PIN));

  const pinRef = useRef(pin);
  pinRef.current = pin;
  const submittingRef = useRef(submitting);
  submittingRef.current = submitting;
  const unlockedRef = useRef(false);

  // On mount, try the stored token for this product. A valid one fetches the
  // content straight away; anything stale is cleared and we show the prompt.
  useEffect(() => {
    let cancelled = false;
    let token: string | null = null;
    try {
      token = localStorage.getItem(storageKey(profileId));
    } catch {
      /* localStorage unavailable (private mode) — fall through to prompt */
    }
    if (!token) {
      setChecking(false);
      return;
    }
    getUnlockedPageAction(profileId, token)
      .then((res) => {
        if (cancelled) return;
        if ("success" in res && res.success) {
          unlockedRef.current = true;
          setPage(res.page as PageData);
        } else {
          try {
            localStorage.removeItem(storageKey(profileId));
          } catch {
            /* ignore */
          }
          setChecking(false);
        }
      })
      .catch(() => {
        if (!cancelled) setChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, [profileId]);

  const submit = useCallback(
    async (code: string) => {
      if (code.length < MIN_PIN || submittingRef.current || unlockedRef.current) return;
      setError(null);
      setSubmitting(true);
      const res = await verifyPagePinAction(profileId, code);
      if ("error" in res && res.error) {
        setError(res.error);
        setSubmitting(false);
        setShake(true);
        setTimeout(() => setShake(false), 450);
        setPin("");
        return;
      }
      // Correct PIN — persist the token (per product) and render the content.
      if ("token" in res && res.token) {
        try {
          localStorage.setItem(storageKey(profileId), res.token);
        } catch {
          /* ignore — visitor just won't be remembered next time */
        }
      }
      unlockedRef.current = true;
      setPage(("page" in res ? res.page : null) as PageData);
    },
    [profileId],
  );

  const press = useCallback(
    (d: string) => {
      setError(null);
      setPin((prev) => (prev.length >= targetLength ? prev : prev + d));
    },
    [targetLength],
  );

  const backspace = useCallback(() => {
    setError(null);
    setPin((prev) => prev.slice(0, -1));
  }, []);

  // Auto-submit once the visitor has entered the full PIN.
  useEffect(() => {
    if (pin.length === targetLength) submit(pin);
  }, [pin, targetLength, submit]);

  // Hardware keyboard support (desktop): digits, backspace, enter.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (unlockedRef.current) return;
      if (e.key >= "0" && e.key <= "9") press(e.key);
      else if (e.key === "Backspace") backspace();
      else if (e.key === "Enter") submit(pinRef.current);
    };
    globalThis.addEventListener("keydown", onKey);
    return () => globalThis.removeEventListener("keydown", onKey);
  }, [press, backspace, submit]);

  // Unlocked → render the real showcase.
  if (page) return <PublicPageClient page={page} />;

  const canSubmit = pin.length >= MIN_PIN && !submitting;
  const busy = submitting || checking;

  return (
    <div className="pg-root" style={{ ["--pg-accent" as string]: accent }}>
      <style>{`
        .pg-root {
          min-height: 100svh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          font-family: var(--font-sans);
          background:
            radial-gradient(120% 80% at 50% -10%, color-mix(in srgb, var(--pg-accent) 14%, transparent) 0%, transparent 60%),
            linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
        }
        .pg-card {
          width: 100%;
          max-width: 360px;
          background: #ffffff;
          border: 1px solid #eef2f7;
          border-radius: 28px;
          padding: 32px 24px 24px;
          box-shadow: 0 24px 60px -24px rgba(15, 23, 42, 0.25);
          text-align: center;
        }
        .pg-lock {
          width: 64px;
          height: 64px;
          margin: 0 auto 18px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          background: linear-gradient(160deg, color-mix(in srgb, var(--pg-accent) 88%, #ffffff) 0%, var(--pg-accent) 100%);
          box-shadow: 0 12px 24px -8px color-mix(in srgb, var(--pg-accent) 55%, transparent);
        }
        .pg-title { font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 6px; letter-spacing: -0.01em; }
        .pg-sub { font-size: 14px; color: #64748b; margin: 0 0 24px; line-height: 1.5; }
        .pg-sub strong { color: #0f172a; font-weight: 600; }
        .pg-dots { display: flex; gap: 14px; justify-content: center; margin-bottom: 8px; height: 16px; transition: transform 0.1s; }
        .pg-dots.pg-shake { animation: pg-shake 0.45s ease; }
        .pg-dot { width: 13px; height: 13px; border-radius: 50%; background: transparent; border: 2px solid #cbd5e1; transition: all 0.15s; }
        .pg-dot.on { background: var(--pg-accent); border-color: var(--pg-accent); transform: scale(1.05); }
        .pg-error { font-size: 13px; color: #dc2626; margin: 10px 0 0; min-height: 18px; }
        .pg-error.pg-empty { color: transparent; }
        .pg-pad {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 22px;
        }
        .pg-key {
          height: 60px;
          border: none;
          border-radius: 18px;
          background: #f1f5f9;
          color: #0f172a;
          font-size: 24px;
          font-weight: 500;
          font-family: inherit;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          transition: transform 0.08s, background 0.15s;
        }
        .pg-key:active { transform: scale(0.94); background: color-mix(in srgb, var(--pg-accent) 16%, #f1f5f9); }
        .pg-key.pg-ghost { background: transparent; color: #64748b; }
        .pg-key.pg-ghost:active { background: #f1f5f9; }
        .pg-key.pg-go { background: var(--pg-accent); color: #fff; }
        .pg-key.pg-go:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
        .pg-key.pg-go:not(:disabled):active { transform: scale(0.94); background: var(--pg-accent); filter: brightness(0.94); }
        .pg-key.pg-go.pg-loading, .pg-key.pg-go.pg-loading:disabled { opacity: 1; cursor: wait; }
        .pg-key:disabled { cursor: not-allowed; }
        .pg-spin { animation: pg-spin 0.7s linear infinite; }
        .pg-dot.pg-pulse { animation: pg-pulse 1.1s ease-in-out infinite; }
        .pg-checking { display: flex; flex-direction: column; align-items: center; gap: 14px; color: #64748b; font-size: 14px; padding: 8px 0 4px; }
        @keyframes pg-spin { to { transform: rotate(360deg); } }
        @keyframes pg-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
        @keyframes pg-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
      `}</style>

      <div className="pg-card">
        <div className="pg-lock">
          <Lock size={26} strokeWidth={2.2} />
        </div>

        {checking ? (
          <>
            <h1 className="pg-title">This page is locked</h1>
            <div className="pg-checking">
              <Loader2 className="pg-spin" size={26} style={{ color: accent }} />
              Checking access…
            </div>
          </>
        ) : (
          <>
            <h1 className="pg-title">This page is locked</h1>
            <p className="pg-sub">
              {submitting ? (
                "Checking your PIN…"
              ) : (
                <>
                  Enter the PIN to view <strong>{productName}</strong>.
                </>
              )}
            </p>

            <div
              className={`pg-dots${shake ? " pg-shake" : ""}`}
              aria-label={`${pin.length} of ${targetLength} digits entered`}
            >
              {Array.from({ length: targetLength }).map((_, i) => (
                <span
                  key={`dot-${i}`}
                  className={`pg-dot${i < pin.length ? " on" : ""}${submitting ? " pg-pulse" : ""}`}
                />
              ))}
            </div>

            <p className={`pg-error${error ? "" : " pg-empty"}`}>{error || "."}</p>

            <div className="pg-pad">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
                <button key={d} type="button" className="pg-key" onClick={() => press(d)} disabled={busy}>
                  {d}
                </button>
              ))}
              <button
                type="button"
                className="pg-key pg-ghost"
                onClick={backspace}
                disabled={busy || pin.length === 0}
                aria-label="Delete"
              >
                <Delete size={22} />
              </button>
              <button type="button" className="pg-key" onClick={() => press("0")} disabled={busy}>
                0
              </button>
              <button
                type="button"
                className={`pg-key pg-go${submitting ? " pg-loading" : ""}`}
                onClick={() => submit(pin)}
                disabled={!canSubmit}
                aria-label="Unlock"
              >
                {submitting ? <Loader2 className="pg-spin" size={24} /> : <Check size={24} strokeWidth={2.6} />}
              </button>
            </div>
          </>
        )}

        <p className="pg-footer" style={{ fontSize: 12, color: "#94a3b8", margin: "22px 0 4px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="" style={{ width: 18, height: 18, borderRadius: 5, objectFit: "cover" }} />
          ) : null}
          {companyName}
        </p>
      </div>
    </div>
  );
}
