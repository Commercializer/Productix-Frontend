/* ─────────────────────────────────────────────
 * @/lib/gs1 barrel
 *
 * Only re-exports universal (client + server safe) modules. `./client`
 * (verifyGtin) is deliberately NOT re-exported here - it's server-only
 * (reads GS1_API_KEY) and must only ever be imported directly from
 * "use server" files, never through this barrel, so it can never end up in a
 * client-component bundle.
 * ──────────────────────────────────────────── */

export * from "./types";
export * from "./check-digit";
export * from "./digital-link";
export * from "./format";
