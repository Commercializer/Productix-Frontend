"use server";

import { prisma } from "@productix/db";
import type { DeviceType, QrScanType, Gs1VerificationStatus } from "@productix/db";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";
import { createHash, createHmac, timingSafeEqual } from "crypto";
import { validateGtinFormat } from "@/lib/gs1/check-digit";
import type { GtinFormatResult, Gs1VerificationResult } from "@/lib/gs1/types";
import { verifyGtin } from "@/lib/gs1/client";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isUUID(val: string): boolean {
  return UUID_RE.test(val);
}

const SHORT_CODE_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";
const SHORT_CODE_LEN = 8;
const SHORT_CODE_RE = /^[a-z0-9]{8}$/;

function randomShortCode(): string {
  let out = "";
  for (let i = 0; i < SHORT_CODE_LEN; i++) {
    out += SHORT_CODE_ALPHABET[Math.floor(Math.random() * SHORT_CODE_ALPHABET.length)];
  }
  return out;
}

async function generateUniqueShortCode(): Promise<string> {
  for (let attempt = 0; attempt < 16; attempt++) {
    const candidate = randomShortCode();
    const clash = await prisma.product.findFirst({ where: { shortCode: candidate }, select: { id: true } });
    if (!clash) return candidate;
  }
  throw new Error("Failed to allocate unique short code");
}

// ═══════════════════════════════════════════════════════════════
// LIST PROMPTIONS
// ═══════════════════════════════════════════════════════════════

export async function getMyPromptionsAction() {
  const session = await auth();
  if (!session?.user?.id) return { items: [] };

  const userId = session.user.id;

  const [userCompanies, adminCompanies] = await Promise.all([
    prisma.companyUser.findMany({ where: { userId }, select: { companyId: true } }),
    prisma.companyAdmin.findMany({ where: { userId }, select: { companyId: true } }),
  ]);

  const companyIds = Array.from(new Set([
    ...userCompanies.map(c => c.companyId),
    ...adminCompanies.map(c => c.companyId),
  ]));

  if (companyIds.length === 0) return { items: [] };

  const profiles = await prisma.productProfile.findMany({
    where: { product: { companyId: { in: companyIds } } },
    include: {
      product: {
        select: {
          companyId: true,
          id: true,
          shortCode: true,
          slugVisible: true,
          gtin: true,
          gtinStatus: true,
          gtinVerifiedAt: true,
          gtinData: true,
          company: { select: { customDomain: true, requireValidGtin: true } },
        },
      },
    },
    orderBy: { updatedAt: 'desc' }
  });

  return {
    items: profiles.map(p => ({
      id: p.id,
      slug: p.slug,
      productName: p.productName,
      tagline: p.tagline,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      productId: p.product.id,
      companyId: p.product.companyId,
      shortCode: p.product.shortCode as string,
      slugVisible: p.product.slugVisible,
      isPublished: p.isPublished,
      publishedAt: p.publishedAt?.toISOString() ?? null,
      logoUrl: p.logoUrl,
      metaDescription: p.metaDescription,
      redirectUrl: p.redirectUrl,
      redirectEnabled: p.redirectEnabled,
      pinEnabled: p.pinEnabled,
      // Whether a viewable plaintext PIN exists. The PIN itself is never sent in
      // this payload — it's only returned by revealProductPinAction after the
      // owner re-enters their account password.
      hasPinCode: !!p.pinCode,
      gtin: p.product.gtin,
      gtinStatus: p.product.gtinStatus,
      gtinVerifiedAt: p.product.gtinVerifiedAt?.toISOString() ?? null,
      gtinData: (p.product.gtinData as Record<string, unknown> | null) ?? null,
      companyCustomDomain: p.product.company.customDomain,
      companyRequireValidGtin: p.product.company.requireValidGtin,
    }))
  };
}

// ═══════════════════════════════════════════════════════════════
// PIN LOCK - when enabled, a visitor must enter the matching PIN
// before the public showcase page renders. The PIN is stored as a
// bcrypt hash; we never read it back. Verification (below) sets a
// short-lived, per-page cookie so the visitor isn't re-prompted on
// every navigation.
// ═══════════════════════════════════════════════════════════════

const PIN_RE = /^\d{6}$/;

// Unlock tokens are signed HS256 JWTs stored in the visitor's localStorage,
// one per product. They're self-verifying (no DB lookup to validate the
// signature) and carry a fingerprint of the PIN hash so rotating the PIN
// invalidates every outstanding token. 12-hour lifetime.
const PIN_TOKEN_TTL_SEC = 60 * 60 * 12;

function getPinSecret(): string {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET / NEXTAUTH_SECRET is not configured");
  return secret;
}

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url");
}

/** Short, non-reversible fingerprint of the PIN hash. Embedded in the token so
 * changing the PIN (new hash) invalidates previously issued tokens. */
function pinFingerprint(pinHash: string): string {
  return createHash("sha256").update(pinHash).digest("base64url").slice(0, 16);
}

/** Issue an HS256 JWT proving the visitor entered the correct PIN for a product. */
function signPinToken(profileId: string, pinHash: string, nowSec: number): string {
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = b64url(
    JSON.stringify({ sub: profileId, pf: pinFingerprint(pinHash), iat: nowSec, exp: nowSec + PIN_TOKEN_TTL_SEC }),
  );
  const data = `${header}.${payload}`;
  const sig = createHmac("sha256", getPinSecret()).update(data).digest("base64url");
  return `${data}.${sig}`;
}

type PinTokenPayload = { sub: string; pf: string; iat: number; exp: number };

/** Validate a token's signature + expiry. Returns the payload, or null when the
 * token is malformed, tampered, or expired. Does NOT hit the database. */
function verifyPinToken(token: string, nowSec: number): PinTokenPayload | null {
  if (typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, payload, sig] = parts as [string, string, string];
  const expected = createHmac("sha256", getPinSecret()).update(`${header}.${payload}`).digest();
  let provided: Buffer;
  try {
    provided = Buffer.from(sig, "base64url");
  } catch {
    return null;
  }
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) return null;
  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString()) as PinTokenPayload;
    if (!decoded?.sub || typeof decoded.exp !== "number" || decoded.exp < nowSec) return null;
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Set / change / clear a product page's access PIN, and toggle the lock.
 * Owner-only (same company scoping as the other product mutations).
 * Pass `pin = null` to keep the existing PIN, or a 6 digit string to set a
 * new one. The lock can't be enabled until a PIN exists.
 */
export async function setPinLockAction(
  profileId: string,
  pin: string | null,
  pinEnabled: boolean,
) {
  if (!isUUID(profileId)) return { error: "Invalid profile ID" };
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const companyId = await getUserCompanyId(session.user.id);
  if (!companyId) return { error: "No company found for user" };

  const profile = await prisma.productProfile.findUnique({
    where: { id: profileId },
    select: { id: true, pinHash: true, pinLength: true, pinCode: true, product: { select: { companyId: true } } },
  });
  if (!profile || profile.product.companyId !== companyId) return { error: "Product not found" };

  // Resolve the hash + length + plaintext to persist: a new PIN re-hashes and
  // stores the plaintext (so the owner can view it later), otherwise keep the
  // existing values.
  let pinHash = profile.pinHash;
  let pinLength = profile.pinLength;
  let pinCode = profile.pinCode;
  if (pin !== null) {
    const trimmed = pin.trim();
    if (!PIN_RE.test(trimmed)) {
      return { error: "PIN must be 6 digits." };
    }
    pinHash = await bcrypt.hash(trimmed, 10);
    pinLength = trimmed.length;
    pinCode = trimmed;
  }

  // Can't lock without a PIN to check against.
  const effectiveEnabled = pinEnabled && !!pinHash;

  try {
    await prisma.productProfile.update({
      where: { id: profileId },
      data: { pinHash, pinLength, pinCode, pinEnabled: effectiveEnabled },
    });
    return { success: true, pinEnabled: effectiveEnabled, hasPin: !!pinHash, hasPinCode: !!pinCode };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Reveal a product's stored plaintext PIN to its owner. Gated behind the owner's
 * own account password — the PIN is never shipped to the client until this check
 * passes, so it can't be read out of the page payload. Owner-only (same company
 * scoping as the other product mutations).
 */
export async function revealProductPinAction(profileId: string, password: string) {
  if (!isUUID(profileId)) return { error: "Invalid profile ID" as const };
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: "Not authenticated" as const };

  if (!password) return { error: "Enter your account password to view the PIN." as const };

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { passwordHash: true },
  });
  if (!user?.passwordHash) {
    return { error: "Your account has no password set. Contact an administrator." as const };
  }
  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) return { error: "Incorrect password." as const };

  const companyId = await getUserCompanyId(userId);
  if (!companyId) return { error: "No company found for user" as const };

  const profile = await prisma.productProfile.findUnique({
    where: { id: profileId },
    select: { pinCode: true, product: { select: { companyId: true } } },
  });
  if (!profile || profile.product.companyId !== companyId) {
    return { error: "Product not found" as const };
  }
  if (!profile.pinCode) {
    return { error: "This PIN was set before it could be saved for viewing. Set a new PIN to view it." as const };
  }

  return { success: true as const, pinCode: profile.pinCode };
}

/**
 * Public (unauthenticated) PIN check for a locked showcase page. On success it
 * returns a signed JWT (for the visitor to store in localStorage, per product)
 * plus the full page payload so the client can render immediately without a
 * second round trip.
 */
export async function verifyPagePinAction(profileId: string, pin: string) {
  if (!isUUID(profileId)) return { error: "Invalid page" as const };

  const profile = await prisma.productProfile.findUnique({
    where: { id: profileId },
    include: productProfileInclude,
  });
  if (!profile || !profile.isPublished) return { error: "Page not found" as const };

  // Not locked → hand back the page directly (no token needed).
  if (!profile.pinEnabled || !profile.pinHash) {
    return { success: true as const, token: null, page: publicProfileShape(profile) };
  }

  const ok = await bcrypt.compare(pin.trim(), profile.pinHash);
  if (!ok) return { error: "Incorrect PIN. Try again." as const };

  const nowSec = Math.floor(Date.now() / 1000);
  const token = signPinToken(profileId, profile.pinHash, nowSec);
  return { success: true as const, token, page: publicProfileShape(profile) };
}

/**
 * Validate a stored unlock token and return the page payload. Used on repeat
 * visits: the client reads its localStorage token and calls this. The signature
 * check needs no DB, but we still load the profile to (a) get the content to
 * render and (b) confirm the token's fingerprint matches the current PIN hash,
 * so a rotated/disabled PIN invalidates old tokens.
 */
export async function getUnlockedPageAction(profileId: string, token: string) {
  if (!isUUID(profileId)) return { error: "Invalid page" as const };

  const nowSec = Math.floor(Date.now() / 1000);
  const payload = verifyPinToken(token, nowSec);
  if (!payload || payload.sub !== profileId) return { error: "Locked" as const };

  const profile = await prisma.productProfile.findUnique({
    where: { id: profileId },
    include: productProfileInclude,
  });
  if (!profile || !profile.isPublished) return { error: "Page not found" as const };

  // Lock turned off since the token was issued → page is open to everyone.
  if (!profile.pinEnabled || !profile.pinHash) {
    return { success: true as const, page: publicProfileShape(profile) };
  }

  // PIN rotated since issue → token no longer valid.
  if (payload.pf !== pinFingerprint(profile.pinHash)) return { error: "Locked" as const };

  return { success: true as const, page: publicProfileShape(profile) };
}

// ═══════════════════════════════════════════════════════════════
// REDIRECT LINK - when set + enabled, scanning the QR / hitting
// the public page sends the visitor to the external URL instead
// of rendering the showcase page.
// ═══════════════════════════════════════════════════════════════

const REDIRECT_URL_MAX = 500;

export async function updateRedirectAction(
  profileId: string,
  redirectUrl: string | null,
  redirectEnabled: boolean,
) {
  if (!isUUID(profileId)) return { error: "Invalid profile ID" };
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const companyId = await getUserCompanyId(session.user.id);
  if (!companyId) return { error: "No company found for user" };

  const profile = await prisma.productProfile.findUnique({
    where: { id: profileId },
    select: { id: true, product: { select: { companyId: true } } },
  });
  if (!profile || profile.product.companyId !== companyId) return { error: "Product not found" };

  let normalized: string | null = null;
  if (redirectUrl !== null) {
    const trimmed = redirectUrl.trim();
    if (trimmed.length > 0) {
      const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
      if (withScheme.length > REDIRECT_URL_MAX) {
        return { error: `Redirect URL must be ${REDIRECT_URL_MAX} characters or fewer.` };
      }
      try {
        const u = new URL(withScheme);
        if (u.protocol !== "http:" && u.protocol !== "https:") {
          return { error: "Redirect URL must use http or https." };
        }
        normalized = u.toString();
      } catch {
        return { error: "Enter a valid URL (e.g. https://example.com)." };
      }
    }
  }

  // Can't enable without a URL.
  const effectiveEnabled = redirectEnabled && !!normalized;

  try {
    await prisma.productProfile.update({
      where: { id: profileId },
      data: { redirectUrl: normalized, redirectEnabled: effectiveEnabled },
    });
    return { success: true, redirectUrl: normalized, redirectEnabled: effectiveEnabled };
  } catch (error: any) {
    return { error: error.message };
  }
}

// ═══════════════════════════════════════════════════════════════
// TOGGLE slug visibility - affects whether the public route
// redirects /p/<shortCode> to /p/<slug>.
// ═══════════════════════════════════════════════════════════════

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/;

/**
 * Rename a product profile's slug. Anyone with read/write access to the company
 * (admins and regular users) can rename - the slug only affects the pretty URL.
 */
export async function updateSlugAction(profileId: string, slug: string) {
  if (!isUUID(profileId)) return { error: "Invalid profile ID" };
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const trimmed = slug.trim().toLowerCase();
  if (!SLUG_RE.test(trimmed)) {
    return { error: "Slug must be 1–64 chars, lowercase letters, numbers, or hyphens (no leading/trailing hyphen)." };
  }
  if (SHORT_CODE_RE.test(trimmed)) {
    return { error: "Slug cannot look like an 8-char short code." };
  }

  const companyId = await getUserCompanyId(session.user.id);
  if (!companyId) return { error: "No company found for user" };

  const profile = await prisma.productProfile.findUnique({
    where: { id: profileId },
    select: { id: true, slug: true, product: { select: { companyId: true } } },
  });
  if (!profile || profile.product.companyId !== companyId) return { error: "Product not found" };

  if (profile.slug === trimmed) return { success: true, slug: trimmed };

  const clash = await prisma.productProfile.findUnique({ where: { slug: trimmed }, select: { id: true } });
  if (clash && clash.id !== profileId) return { error: "That slug is already taken." };

  try {
    await prisma.productProfile.update({ where: { id: profileId }, data: { slug: trimmed } });
    return { success: true, slug: trimmed };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Rename a product profile's display name. Like updateSlugAction, anyone with
 * read/write access to the company can rename - this is the human-facing label
 * shown on the dashboard and public page.
 */
const PRODUCT_NAME_MAX = 120;

export async function updateProductNameAction(profileId: string, productName: string) {
  if (!isUUID(profileId)) return { error: "Invalid profile ID" };
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const trimmed = productName.trim();
  if (trimmed.length === 0) return { error: "Name is required." };
  if (trimmed.length > PRODUCT_NAME_MAX) {
    return { error: `Name must be ${PRODUCT_NAME_MAX} characters or fewer.` };
  }

  const companyId = await getUserCompanyId(session.user.id);
  if (!companyId) return { error: "No company found for user" };

  const profile = await prisma.productProfile.findUnique({
    where: { id: profileId },
    select: { id: true, productName: true, content: true, product: { select: { companyId: true } } },
  });
  if (!profile || profile.product.companyId !== companyId) return { error: "Product not found" };

  if (profile.productName === trimmed) return { success: true, productName: trimmed };

  // Keep the editor's pageTitle inside the saved canvas content in sync with
  // the dashboard's productName so both surfaces show the same label.
  const currentContent = profile.content as Record<string, unknown> | null;
  const updateData: { productName: string; content?: Record<string, unknown> } = { productName: trimmed };
  if (currentContent && typeof currentContent === "object" && !Array.isArray(currentContent)) {
    updateData.content = { ...currentContent, pageTitle: trimmed };
  }

  try {
    await prisma.productProfile.update({ where: { id: profileId }, data: updateData as any });
    return { success: true, productName: trimmed };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function setSlugVisibleAction(productId: string, visible: boolean) {
  if (!isUUID(productId)) return { error: "Invalid product ID" };
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const companyId = await getUserCompanyId(session.user.id);
  if (!companyId) return { error: "No company found for user" };

  const product = await prisma.product.findFirst({ where: { id: productId, companyId }, select: { id: true } });
  if (!product) return { error: "Product not found" };

  try {
    await prisma.product.update({ where: { id: productId }, data: { slugVisible: visible } });
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Adds a GTIN to an existing product that doesn't have one yet. Only supports
 * the null -> set transition — an already-set GTIN can't be changed here (see
 * GS1_DIGITAL_LINK_ROADMAP.md for why GTIN is treated as set-once). Re-runs
 * the same format + external-verification pipeline as createPromptionAction,
 * never trusting a client-supplied status.
 */
export async function updateProductGtinAction(productId: string, gtin: string) {
  if (!isUUID(productId)) return { error: "Invalid product ID" };
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const companyId = await getUserCompanyId(session.user.id);
  if (!companyId) return { error: "No company found for user" };

  const product = await prisma.product.findFirst({
    where: { id: productId, companyId },
    select: { id: true, gtin: true },
  });
  if (!product) return { error: "Product not found" };
  if (product.gtin) return { error: "This product already has a GTIN and it can't be changed." };

  const gtinResult = await resolveGtinForCreate(gtin);
  if (!gtinResult.ok) return { error: gtinResult.error };
  if (!gtinResult.gtin) return { error: "GTIN is required" };

  try {
    await prisma.product.update({
      where: { id: productId },
      data: {
        gtin: gtinResult.gtin,
        gtinStatus: gtinResult.status,
        gtinVerifiedAt: new Date(),
        gtinData: gtinResult.data as any,
      },
    });
    return { success: true, gtin: gtinResult.gtin, gtinStatus: gtinResult.status, gtinData: gtinResult.data ?? null };
  } catch (error: any) {
    if (error?.code === "P2002" && error?.meta?.target?.includes?.("gtin")) {
      return { error: "This GTIN is already registered to another product." };
    }
    return { error: error.message };
  }
}

// ═══════════════════════════════════════════════════════════════
// DELETE PROMPTION
// ═══════════════════════════════════════════════════════════════

export async function deletePromptionAction(id: string) {
  if (!isUUID(id)) return { error: "Invalid ID" };
  try {
    await prisma.productProfile.delete({ where: { id } });
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

// ═══════════════════════════════════════════════════════════════
// CREATE PROMPTION (Product + ProductProfile)
// ═══════════════════════════════════════════════════════════════

export async function checkSlugAction(slug: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  if (!slug) return { available: false };

  const existing = await prisma.productProfile.findUnique({ where: { slug } });
  return { available: !existing };
}

// ═══════════════════════════════════════════════════════════════
// GTIN VALIDATION / VERIFICATION
// ═══════════════════════════════════════════════════════════════

function gtinFormatErrorMessage(reason: GtinFormatResult["reason"]): string {
  switch (reason) {
    case "non_numeric":
      return "GTIN must contain only digits.";
    case "wrong_length":
      return "GTIN must be 8, 12, 13, or 14 digits long.";
    case "bad_check_digit":
      return "This GTIN's check digit doesn't match — double-check the number.";
    default:
      return "Invalid GTIN.";
  }
}

/** Maps a raw verifyGtin() result to the stored Gs1VerificationStatus + data blob. */
function mapVerificationToStatus(
  verification: Gs1VerificationResult,
): { status: Gs1VerificationStatus; data?: Record<string, unknown> } {
  const status: Gs1VerificationStatus =
    verification.ok && verification.verified
      ? "GS1_VERIFIED"
      : verification.ok && !verification.verified
        ? "GS1_NOT_FOUND"
        : "VALID_FORMAT";
  return { status, data: verification.ok ? verification.data : undefined };
}

/** Local-only format check, used for live validation as the user types. No DB write. */
export async function checkGtinAction(gtin: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const format = validateGtinFormat(gtin);
  if (!format.valid) {
    return { valid: false, canonical14: format.canonical14, error: gtinFormatErrorMessage(format.reason) };
  }
  return { valid: true, canonical14: format.canonical14 };
}

/**
 * Format check + (if GS1_API_KEY is configured) a live external verification
 * call, for the Add-Product preview panel. Does not take a productId (the
 * product doesn't exist yet at this point) and does not write to the DB —
 * the same validation runs again, authoritatively, inside
 * createPromptionAction at submit time.
 */
export async function verifyGtinAction(gtin: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const format = validateGtinFormat(gtin);
  if (!format.valid) {
    return {
      formatValid: false,
      status: "INVALID_FORMAT" as Gs1VerificationStatus,
      error: gtinFormatErrorMessage(format.reason),
    };
  }

  const dupe = await prisma.product.findFirst({
    where: { gtin: format.canonical14! },
    select: { id: true },
  });
  if (dupe) {
    return {
      formatValid: false,
      status: "INVALID_FORMAT" as Gs1VerificationStatus,
      error: "This GTIN is already registered to another product.",
    };
  }

  const verification = await verifyGtin(format.canonical14!);
  if (verification.ok && verification.verified) {
    return { formatValid: true, status: "GS1_VERIFIED" as Gs1VerificationStatus, data: verification.data };
  }
  if (verification.ok && !verification.verified) {
    return { formatValid: true, status: "GS1_NOT_FOUND" as Gs1VerificationStatus, data: verification.data };
  }
  // External API not configured / unreachable — still a locally valid GTIN.
  return { formatValid: true, status: "VALID_FORMAT" as Gs1VerificationStatus };
}

/**
 * Re-runs GTIN validation server-side for createPromptionAction. Never trusts
 * a client-supplied status — always recomputes it here — so a tampered
 * client request can't fake GS1_VERIFIED. GS1_NOT_FOUND is still treated as
 * an acceptable ("gtin set") outcome for the requireValidGtin gate below: it
 * means the GTIN is locally well-formed but wasn't found in GS1's index,
 * which can just as easily mean incomplete registry data as a bad GTIN, so
 * it shouldn't block a merchant from publishing.
 */
async function resolveGtinForCreate(
  rawGtin: string | undefined | null
): Promise<
  | { ok: true; gtin: string | null; status: Gs1VerificationStatus; data?: Record<string, unknown> }
  | { ok: false; error: string }
> {
  if (!rawGtin || !rawGtin.trim()) {
    return { ok: true, gtin: null, status: "UNVERIFIED" };
  }

  const format = validateGtinFormat(rawGtin);
  if (!format.valid) {
    return { ok: false, error: gtinFormatErrorMessage(format.reason) };
  }

  const dupe = await prisma.product.findFirst({
    where: { gtin: format.canonical14! },
    select: { id: true },
  });
  if (dupe) {
    return { ok: false, error: "This GTIN is already registered to another product." };
  }

  const verification = await verifyGtin(format.canonical14!);
  return { ok: true, gtin: format.canonical14!, ...mapVerificationToStatus(verification) };
}

/**
 * Re-runs GS1 verification for a product that already has a GTIN set, and
 * persists the refreshed status/data. Never changes the GTIN value itself
 * (that's still immutable once set) - only the verification snapshot, which
 * legitimately goes stale: the GS1 registry's own data can change over time
 * (e.g. a registration becomes active), and any GTIN checked while the API
 * integration was still being finished only ever got "Valid GTIN format"
 * regardless of what GS1 actually had on file.
 */
export async function refreshGtinVerificationAction(productId: string) {
  if (!isUUID(productId)) return { error: "Invalid product ID" };
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const companyId = await getUserCompanyId(session.user.id);
  if (!companyId) return { error: "No company found for user" };

  const product = await prisma.product.findFirst({
    where: { id: productId, companyId },
    select: { id: true, gtin: true },
  });
  if (!product) return { error: "Product not found" };
  if (!product.gtin) return { error: "This product doesn't have a GTIN yet" };

  const verification = await verifyGtin(product.gtin);
  const { status, data } = mapVerificationToStatus(verification);

  try {
    await prisma.product.update({
      where: { id: productId },
      data: { gtinStatus: status, gtinVerifiedAt: new Date(), gtinData: data as any },
    });
    return { success: true, gtinStatus: status, gtinData: data ?? null };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createPromptionAction(data: {
  productName: string;
  slug: string;
  description?: string;
  metaDescription?: string;
  ogImageUrl?: string;
  categoryId?: string | null;
  subCategoryId?: string | null;
  brandProfileId?: string | null;
  gtin?: string | null;
}) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const userId = session.user.id;

  // Find the user's company (handles company admins/users and tenant admins).
  const companyId = await getUserCompanyId(userId);

  if (!companyId) return { error: "No company found for user" };

  // Check slug uniqueness
  const existing = await prisma.productProfile.findUnique({ where: { slug: data.slug } });
  if (existing) return { error: "Slug already taken. Choose a different one." };

  // Validate scoped lookups belong to this company.
  if (data.categoryId && isUUID(data.categoryId)) {
    const cat = await prisma.category.findFirst({ where: { id: data.categoryId, companyId } });
    if (!cat) return { error: "Selected category not found" };
  }
  if (data.subCategoryId && isUUID(data.subCategoryId)) {
    const sub = await prisma.subCategory.findFirst({ where: { id: data.subCategoryId, companyId } });
    if (!sub) return { error: "Selected sub-category not found" };
    if (data.categoryId && sub.categoryId !== data.categoryId) {
      return { error: "Sub-category does not belong to the selected category" };
    }
  }
  if (data.brandProfileId && isUUID(data.brandProfileId)) {
    const brand = await prisma.brandProfile.findFirst({ where: { id: data.brandProfileId, companyId } });
    if (!brand) return { error: "Selected brand not found" };
  }

  const gtinResult = await resolveGtinForCreate(data.gtin);
  if (!gtinResult.ok) return { error: gtinResult.error };

  const company = await prisma.company.findUnique({ where: { id: companyId }, select: { requireValidGtin: true } });
  if (company?.requireValidGtin && !gtinResult.gtin) {
    return { error: "This company requires a valid GTIN before creating a product. Add one above." };
  }

  const shortCode = await generateUniqueShortCode();

  try {
    // Create Product + ProductProfile in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          companyId,
          categoryId: data.categoryId && isUUID(data.categoryId) ? data.categoryId : null,
          subCategoryId: data.subCategoryId && isUUID(data.subCategoryId) ? data.subCategoryId : null,
          brandProfileId: data.brandProfileId && isUUID(data.brandProfileId) ? data.brandProfileId : null,
          shortCode,
          isActive: true,
          gtin: gtinResult.gtin,
          gtinStatus: gtinResult.status,
          gtinVerifiedAt: gtinResult.gtin ? new Date() : null,
          gtinData: gtinResult.data as any,
        },
      });

      const profile = await tx.productProfile.create({
        data: {
          productId: product.id,
          languageCode: "en",
          slug: data.slug,
          productName: data.productName,
          description: data.description || "",
          metaDescription: data.metaDescription || null,
          ogImageUrl: data.ogImageUrl || null,
          content: {},
        },
      });

      return { productId: product.id, profileId: profile.id, slug: profile.slug };
    });

    return { success: true, ...result };
  } catch (error: any) {
    if (error?.code === "P2002" && error?.meta?.target?.includes?.("gtin")) {
      return { error: "This GTIN is already registered to another product." };
    }
    return { error: error.message };
  }
}

// ═══════════════════════════════════════════════════════════════
// TAXONOMY (Category / SubCategory) + BRAND PROFILE LOOKUPS
// ═══════════════════════════════════════════════════════════════

export async function getCategoriesAction() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const companyId = await getUserCompanyId(session.user.id);
  if (!companyId) return { error: "No company found for user" };

  const categories = await prisma.category.findMany({
    where: { companyId },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return { success: true, items: categories };
}

export async function getSubCategoriesAction(categoryId: string) {
  if (!isUUID(categoryId)) return { error: "Invalid category ID" };

  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const companyId = await getUserCompanyId(session.user.id);
  if (!companyId) return { error: "No company found for user" };

  const subCategories = await prisma.subCategory.findMany({
    where: { companyId, categoryId },
    orderBy: { name: "asc" },
    select: { id: true, name: true, categoryId: true },
  });

  return { success: true, items: subCategories };
}

export async function getBrandProfilesAction() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const companyId = await getUserCompanyId(session.user.id);
  if (!companyId) return { error: "No company found for user" };

  const brands = await prisma.brandProfile.findMany({
    where: { companyId },
    orderBy: { brandName: "asc" },
    select: { id: true, brandName: true, brandLogoUrl: true },
  });

  return { success: true, items: brands };
}

export async function createCategoryAction(name: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const trimmed = name.trim();
  if (!trimmed) return { error: "Name is required" };
  if (trimmed.length > 255) return { error: "Name too long" };

  const companyId = await getUserCompanyId(session.user.id);
  if (!companyId) return { error: "No company found for user" };

  try {
    const existing = await prisma.category.findFirst({
      where: { companyId, name: { equals: trimmed, mode: "insensitive" } },
      select: { id: true, name: true },
    });
    if (existing) return { success: true, item: existing };

    const item = await prisma.category.create({
      data: { companyId, name: trimmed },
      select: { id: true, name: true },
    });
    return { success: true, item };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createSubCategoryAction(categoryId: string, name: string) {
  if (!isUUID(categoryId)) return { error: "Invalid category ID" };

  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const trimmed = name.trim();
  if (!trimmed) return { error: "Name is required" };
  if (trimmed.length > 255) return { error: "Name too long" };

  const companyId = await getUserCompanyId(session.user.id);
  if (!companyId) return { error: "No company found for user" };

  const parent = await prisma.category.findFirst({ where: { id: categoryId, companyId } });
  if (!parent) return { error: "Parent category not found" };

  try {
    const existing = await prisma.subCategory.findFirst({
      where: { companyId, categoryId, name: { equals: trimmed, mode: "insensitive" } },
      select: { id: true, name: true, categoryId: true },
    });
    if (existing) return { success: true, item: existing };

    const item = await prisma.subCategory.create({
      data: { companyId, categoryId, name: trimmed },
      select: { id: true, name: true, categoryId: true },
    });
    return { success: true, item };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createBrandProfileAction(brandName: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const trimmed = brandName.trim();
  if (!trimmed) return { error: "Brand name is required" };
  if (trimmed.length > 255) return { error: "Brand name too long" };

  const companyId = await getUserCompanyId(session.user.id);
  if (!companyId) return { error: "No company found for user" };

  try {
    const existing = await prisma.brandProfile.findFirst({
      where: { companyId, brandName: { equals: trimmed, mode: "insensitive" } },
      select: { id: true, brandName: true, brandLogoUrl: true },
    });
    if (existing) return { success: true, item: existing };

    const item = await prisma.brandProfile.create({
      data: { companyId, brandName: trimmed },
      select: { id: true, brandName: true, brandLogoUrl: true },
    });
    return { success: true, item };
  } catch (error: any) {
    return { error: error.message };
  }
}

// ═══════════════════════════════════════════════════════════════
// BRANCHES (company locations used for feedback segmentation)
// ═══════════════════════════════════════════════════════════════

export async function getBranchesAction() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const companyId = await getUserCompanyId(session.user.id);
  if (!companyId) return { error: "No company found for user" };

  const branches = await prisma.branch.findMany({
    where: { companyId },
    orderBy: { name: "asc" },
    select: { id: true, code: true, name: true, city: true, address: true, isActive: true },
  });

  return { success: true, items: branches };
}

export async function createBranchAction(input: { name: string; city?: string; address?: string }) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const name = input.name.trim();
  if (!name) return { error: "Branch name is required" };
  if (name.length > 255) return { error: "Branch name too long" };
  const city = input.city?.trim() || null;
  const address = input.address?.trim() || null;

  const companyId = await getUserCompanyId(session.user.id);
  if (!companyId) return { error: "No company found for user" };

  try {
    const existing = await prisma.branch.findFirst({
      where: { companyId, name: { equals: name, mode: "insensitive" } },
      select: { id: true, code: true, name: true, city: true, address: true, isActive: true },
    });
    if (existing) return { success: true, item: existing };

    // Assign the next per-company code (max + 1, starting at 1). Done in a
    // transaction so concurrent creates don't read the same max; the
    // (companyId, code) unique index is the final backstop.
    const item = await prisma.$transaction(async (tx) => {
      const last = await tx.branch.findFirst({
        where: { companyId },
        orderBy: { code: "desc" },
        select: { code: true },
      });
      const code = (last?.code ?? 0) + 1;
      return tx.branch.create({
        data: { companyId, code, name, city, address },
        select: { id: true, code: true, name: true, city: true, address: true, isActive: true },
      });
    });
    return { success: true, item };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateBranchAction(
  id: string,
  patch: { name?: string; city?: string; address?: string; isActive?: boolean },
) {
  if (!isUUID(id)) return { error: "Invalid branch ID" };

  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const companyId = await getUserCompanyId(session.user.id);
  if (!companyId) return { error: "No company found for user" };

  // Confirm the branch belongs to the caller's company before mutating it.
  const owned = await prisma.branch.findFirst({ where: { id, companyId }, select: { id: true } });
  if (!owned) return { error: "Branch not found" };

  const data: { name?: string; city?: string | null; address?: string | null; isActive?: boolean } = {};
  if (patch.name !== undefined) {
    const name = patch.name.trim();
    if (!name) return { error: "Branch name is required" };
    if (name.length > 255) return { error: "Branch name too long" };
    data.name = name;
  }
  if (patch.city !== undefined) data.city = patch.city.trim() || null;
  if (patch.address !== undefined) data.address = patch.address.trim() || null;
  if (patch.isActive !== undefined) data.isActive = patch.isActive;

  try {
    const item = await prisma.branch.update({
      where: { id },
      data,
      select: { id: true, code: true, name: true, city: true, address: true, isActive: true },
    });
    return { success: true, item };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteBranchAction(id: string) {
  if (!isUUID(id)) return { error: "Invalid branch ID" };

  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const companyId = await getUserCompanyId(session.user.id);
  if (!companyId) return { error: "No company found for user" };

  const owned = await prisma.branch.findFirst({ where: { id, companyId }, select: { id: true } });
  if (!owned) return { error: "Branch not found" };

  try {
    // Feedback keeps its branchId set to null (onDelete: SetNull) so history survives.
    await prisma.branch.delete({ where: { id } });
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

// ═══════════════════════════════════════════════════════════════
// EXPORT / IMPORT (.productix encrypted project file)
// ═══════════════════════════════════════════════════════════════

export async function exportProductixFileAction(profileId: string) {
  if (!isUUID(profileId)) return { error: "Invalid profile ID" };
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const profile = await prisma.productProfile.findUnique({
    where: { id: profileId },
    select: { id: true, slug: true, productName: true, content: true },
  });
  if (!profile) return { error: "Page not found" };

  try {
    const { encryptProductixFile } = await import("@/lib/share/productix-file");
    const fileContent = encryptProductixFile(profile.content ?? {}, {
      productName: profile.productName,
      slug: profile.slug,
      exportedAt: new Date().toISOString(),
    });
    const safeSlug = (profile.slug || "page").replace(/[^a-z0-9_-]/gi, "-").slice(0, 64);
    return {
      success: true,
      filename: `${safeSlug}.productix`,
      fileContent,
    };
  } catch (error: any) {
    return { error: error?.message ?? "Failed to export" };
  }
}

export async function importProductixFileAction(fileContent: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  if (typeof fileContent !== "string" || fileContent.length === 0) {
    return { error: "Empty file" };
  }
  if (fileContent.length > 25 * 1024 * 1024) {
    return { error: "File too large" };
  }

  try {
    const { decryptProductixFile } = await import("@/lib/share/productix-file");
    const document = decryptProductixFile<Record<string, unknown>>(fileContent);
    return { success: true, document };
  } catch (error: any) {
    return { error: error?.message ?? "Failed to import" };
  }
}

// ═══════════════════════════════════════════════════════════════
// SAVE PAGE CONTENT (from editor → DB)
// ═══════════════════════════════════════════════════════════════

// How many version snapshots to retain per profile (older ones are pruned).
const VERSION_RETENTION = 50;

// Friendly names for the element types we diff (falls back to the raw type key).
const ELEMENT_TYPE_LABELS: Record<string, string> = {
  text: "text",
  heading: "heading",
  image: "image",
  button: "button",
  card: "card",
  video: "video",
  audio: "audio",
  shape: "shape",
  carousel: "carousel",
  search: "search bar",
  "pdf-viewer": "PDF",
  group: "group",
  divider: "divider",
  icon: "icon",
};

function elementCountLabel(type: string | undefined, n: number): string {
  const base = (type && ELEMENT_TYPE_LABELS[type]) || type || "element";
  return `${n} ${base}${n === 1 ? "" : "s"}`;
}

function truncate(s: string, max: number): string {
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

function asObj(v: unknown): Record<string, any> {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, any>) : {};
}

// Props that carry user-facing text, used to label an element in the detail view
// (e.g. a text block becomes its first words rather than just "text").
const TEXTUAL_PROP_KEYS = ["text", "title", "label", "heading", "caption", "content", "alt"];

function elementLabel(el: any): string {
  const props = asObj(el?.props);
  for (const k of TEXTUAL_PROP_KEYS) {
    const v = props[k];
    if (typeof v === "string" && v.trim()) return truncate(v.trim().replace(/\s+/g, " "), 48);
  }
  const type = (el?.type as string) || "element";
  return ELEMENT_TYPE_LABELS[type] || type;
}

function groupByTypeFromList(items: { type: string }[]): string {
  const counts: Record<string, number> = {};
  for (const it of items) counts[it.type] = (counts[it.type] ?? 0) + 1;
  return Object.entries(counts)
    .map(([t, n]) => elementCountLabel(t, n))
    .join(", ");
}

export type ElementChangeKind = "content" | "moved" | "resized" | "rotated" | "styled";

export type ElementRef = { type: string; label: string };

// Structured diff between two canvas documents — the basis for both the one-line
// summary stored on each version and the detailed per-element breakdown shown on
// the version-history page.
export type CanvasChanges = {
  isInitial: boolean;
  pageRenamedTo: string | null;
  added: ElementRef[];
  removed: ElementRef[];
  modified: (ElementRef & { kinds: ElementChangeKind[] })[];
  sectionsDelta: number;
};

function diffCanvasDetailed(prev: unknown, next: unknown): CanvasChanges {
  const nextDoc = asObj(next);
  const nextEls = asObj(nextDoc.elements);

  if (prev == null) {
    return {
      isInitial: true,
      pageRenamedTo: null,
      added: Object.keys(nextEls).map((id) => ({
        type: (nextEls[id]?.type as string) || "element",
        label: elementLabel(nextEls[id]),
      })),
      removed: [],
      modified: [],
      sectionsDelta: 0,
    };
  }

  const prevDoc = asObj(prev);
  const prevEls = asObj(prevDoc.elements);
  const prevIds = Object.keys(prevEls);
  const nextIds = Object.keys(nextEls);

  const added = nextIds
    .filter((id) => !(id in prevEls))
    .map((id) => ({ type: (nextEls[id]?.type as string) || "element", label: elementLabel(nextEls[id]) }));
  const removed = prevIds
    .filter((id) => !(id in nextEls))
    .map((id) => ({ type: (prevEls[id]?.type as string) || "element", label: elementLabel(prevEls[id]) }));

  const modified: (ElementRef & { kinds: ElementChangeKind[] })[] = [];
  for (const id of nextIds) {
    if (!(id in prevEls)) continue;
    const a = prevEls[id];
    const b = nextEls[id];
    if (JSON.stringify(a) === JSON.stringify(b)) continue;
    const kinds: ElementChangeKind[] = [];
    const ta = asObj(a?.transform);
    const tb = asObj(b?.transform);
    if (JSON.stringify(a?.props) !== JSON.stringify(b?.props)) kinds.push("content");
    if (ta.x !== tb.x || ta.y !== tb.y) kinds.push("moved");
    if (ta.width !== tb.width || ta.height !== tb.height) kinds.push("resized");
    if (ta.rotation !== tb.rotation) kinds.push("rotated");
    if (a?.opacity !== b?.opacity || a?.visible !== b?.visible || a?.locked !== b?.locked || a?.zIndex !== b?.zIndex) {
      kinds.push("styled");
    }
    modified.push({ type: (b?.type as string) || "element", label: elementLabel(b), kinds });
  }

  const prevAb = Array.isArray(prevDoc.artboards) ? prevDoc.artboards.length : 0;
  const nextAb = Array.isArray(nextDoc.artboards) ? nextDoc.artboards.length : 0;

  return {
    isInitial: false,
    pageRenamedTo:
      typeof nextDoc.pageTitle === "string" && nextDoc.pageTitle !== prevDoc.pageTitle
        ? String(nextDoc.pageTitle)
        : null,
    added,
    removed,
    modified,
    sectionsDelta: nextAb - prevAb,
  };
}

// Build a one-line human-readable summary from a structured diff. `prev` null
// means this is the first snapshot. Stored on each version as the "what happened"
// line shown in the editor/dashboard history.
function summarizeChanges(c: CanvasChanges): string {
  if (c.isInitial) {
    return c.added.length ? `Initial version — ${elementCountLabel(undefined, c.added.length)}` : "Initial version";
  }

  const parts: string[] = [];
  if (c.pageRenamedTo) parts.push(`Renamed page to “${truncate(c.pageRenamedTo, 40)}”`);
  if (c.added.length) parts.push(`Added ${groupByTypeFromList(c.added)}`);
  if (c.removed.length) parts.push(`Removed ${groupByTypeFromList(c.removed)}`);

  if (c.modified.length) {
    const counts: Record<ElementChangeKind, number> = {
      content: 0,
      moved: 0,
      resized: 0,
      rotated: 0,
      styled: 0,
    };
    for (const m of c.modified) for (const k of m.kinds) counts[k]++;
    const detail: string[] = [];
    if (counts.content) detail.push(`content ×${counts.content}`);
    if (counts.moved) detail.push(`moved ×${counts.moved}`);
    if (counts.resized) detail.push(`resized ×${counts.resized}`);
    if (counts.rotated) detail.push(`rotated ×${counts.rotated}`);
    if (counts.styled) detail.push(`styled ×${counts.styled}`);
    parts.push(
      `Edited ${c.modified.length} element${c.modified.length === 1 ? "" : "s"}` +
        (detail.length ? ` (${detail.join(", ")})` : ""),
    );
  }

  if (c.sectionsDelta > 0) parts.push(`Added ${c.sectionsDelta} section${c.sectionsDelta === 1 ? "" : "s"}`);
  else if (c.sectionsDelta < 0)
    parts.push(`Removed ${-c.sectionsDelta} section${-c.sectionsDelta === 1 ? "" : "s"}`);

  if (!parts.length) return "Minor changes";
  return truncate(parts.join(" · "), 580);
}

function describeCanvasDiff(prev: unknown, next: unknown): string {
  return summarizeChanges(diffCanvasDetailed(prev, next));
}

// Best-effort: append a point-in-time snapshot of the canvas content to the
// page's version history (= the user edit log). Deduped against the newest
// version because a single editor "Save" calls savePageContentAction twice
// (onSave + the onPublish path), and pruned to VERSION_RETENTION. Never throws —
// version capture must not fail a save.
async function captureVersion(
  profileId: string,
  content: Record<string, unknown>,
  userId: string | null,
  reason: "save" | "publish" | "restore"
) {
  try {
    const latest = await prisma.productProfileVersion.findFirst({
      where: { profileId },
      orderBy: { createdAt: "desc" },
      select: { content: true },
    });
    if (latest && JSON.stringify(latest.content) === JSON.stringify(content)) return;

    const rawTitle = typeof content?.pageTitle === "string" ? content.pageTitle.trim() : "";
    const productName = rawTitle.length > 0 && rawTitle.length <= PRODUCT_NAME_MAX ? rawTitle : null;

    const summary =
      reason === "restore"
        ? "Restored an earlier version"
        : describeCanvasDiff(latest?.content ?? null, content);

    await prisma.productProfileVersion.create({
      data: { profileId, userId, content: content as any, productName, reason, summary },
    });

    const stale = await prisma.productProfileVersion.findMany({
      where: { profileId },
      orderBy: { createdAt: "desc" },
      skip: VERSION_RETENTION,
      select: { id: true },
    });
    if (stale.length > 0) {
      await prisma.productProfileVersion.deleteMany({
        where: { id: { in: stale.map((s) => s.id) } },
      });
    }
  } catch {
    // swallow — a snapshot failure must never block the underlying save
  }
}

export async function savePageContentAction(profileId: string, content: Record<string, unknown>) {
  if (!isUUID(profileId)) return { error: "Invalid profile ID" };
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  // Mirror the canvas pageTitle into the dashboard's productName column so a
  // rename in the editor's top bar shows up on the products list. Skip if
  // empty (defensive: don't let an accidental clear wipe the canonical name)
  // or if it exceeds the column constraint.
  const rawTitle = typeof content?.pageTitle === "string" ? content.pageTitle.trim() : "";
  const syncName = rawTitle.length > 0 && rawTitle.length <= PRODUCT_NAME_MAX ? rawTitle : null;

  try {
    await prisma.productProfile.update({
      where: { id: profileId },
      data: syncName
        ? { content: content as any, productName: syncName }
        : { content: content as any },
    });
    await captureVersion(profileId, content, session.user.id, "save");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

// ═══════════════════════════════════════════════════════════════
// LOAD PAGE CONTENT (DB → editor)
// ═══════════════════════════════════════════════════════════════

export async function getPageContentAction(profileId: string) {
  if (!isUUID(profileId)) return { error: "Invalid profile ID" };
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const profile = await prisma.productProfile.findUnique({
    where: { id: profileId },
    select: {
      id: true,
      slug: true,
      productName: true,
      content: true,
      isPublished: true,
      product: { select: { gtin: true } },
    },
  });

  if (!profile) return { error: "Profile not found" };

  // Defensive: if a legacy record was saved before the title-sync was wired,
  // the editor's pageTitle inside content can disagree with productName.
  // Normalize on read so the editor always boots with the canonical name.
  let content = profile.content;
  if (content && typeof content === "object" && !Array.isArray(content)) {
    const contentObj = content as Record<string, unknown>;
    if (contentObj.pageTitle !== profile.productName) {
      content = { ...contentObj, pageTitle: profile.productName } as typeof profile.content;
    }
  }

  return {
    id: profile.id,
    slug: profile.slug,
    productName: profile.productName,
    content,
    isPublished: profile.isPublished,
    hasGtin: Boolean(profile.product.gtin),
  };
}

// ═══════════════════════════════════════════════════════════════
// PUBLISH / UNPUBLISH
// ═══════════════════════════════════════════════════════════════

export async function publishPageAction(profileId: string) {
  if (!isUUID(profileId)) return { error: "Invalid profile ID" };
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    const gtinCheck = await prisma.productProfile.findUnique({
      where: { id: profileId },
      select: {
        product: {
          select: { gtin: true, company: { select: { requireValidGtin: true } } },
        },
      },
    });
    if (!gtinCheck) return { error: "Page not found" };
    if (gtinCheck.product.company.requireValidGtin && !gtinCheck.product.gtin) {
      return {
        error:
          "This company requires a valid GTIN before publishing, and this product was created without one. GTIN can only be set when a product is created — add one by recreating the product, or ask an admin to turn off the GTIN requirement in Settings.",
      };
    }

    const profile = await prisma.productProfile.update({
      where: { id: profileId },
      data: {
        isPublished: true,
        publishedAt: new Date(),
      },
      include: { product: true },
    });

    // Auto-create a MASTER QR code if it doesn't exist
    const existingQr = await prisma.qrCode.findFirst({
      where: {
        productId: profile.productId,
        qrType: "MASTER",
      },
    });

    if (!existingQr) {
      await prisma.qrCode.create({
        data: {
          productId: profile.productId,
          qrType: "MASTER",
          qrUrl: `/p/${profile.product.shortCode}`,
          isActive: true,
        },
      });
    }

    // Mark the newest snapshot as the published one so it stands out in history.
    try {
      const latestVersion = await prisma.productProfileVersion.findFirst({
        where: { profileId },
        orderBy: { createdAt: "desc" },
        select: { id: true },
      });
      if (latestVersion) {
        await prisma.productProfileVersion.update({
          where: { id: latestVersion.id },
          data: { reason: "publish" },
        });
      }
    } catch {
      // best-effort label; never fail the publish over it
    }

    return { success: true, slug: profile.slug, shortCode: profile.product.shortCode };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function unpublishPageAction(profileId: string) {
  if (!isUUID(profileId)) return { error: "Invalid profile ID" };
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    await prisma.productProfile.update({
      where: { id: profileId },
      data: { isPublished: false },
    });
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

// ═══════════════════════════════════════════════════════════════
// VERSION HISTORY / EDIT LOG
// ═══════════════════════════════════════════════════════════════

export type PageVersionSummary = {
  id: string;
  reason: string;
  createdAt: string;
  productName: string | null;
  email: string | null;
  summary: string | null;
};

// List a page's version history (newest first), without the heavy content blob.
export async function getPageVersionsAction(profileId: string) {
  if (!isUUID(profileId)) return { error: "Invalid profile ID" as const };
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" as const };

  const versions = await prisma.productProfileVersion.findMany({
    where: { profileId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      reason: true,
      createdAt: true,
      productName: true,
      summary: true,
      user: { select: { email: true } },
    },
  });

  return {
    versions: versions.map((v) => ({
      id: v.id,
      reason: v.reason,
      createdAt: v.createdAt.toISOString(),
      productName: v.productName,
      email: v.user?.email ?? null,
      summary: v.summary,
    })) satisfies PageVersionSummary[],
  };
}

export type PageVersionDetail = PageVersionSummary & {
  changes: CanvasChanges;
  isCurrent: boolean;
};

// Full, detailed history for the dedicated version-history page. Loads each
// snapshot's content and recomputes a structured diff against its predecessor so
// the page can show a per-element breakdown (content is NOT returned to the
// client — only the computed change lists). Newest first.
export async function getPageVersionDetailsAction(profileId: string) {
  if (!isUUID(profileId)) return { error: "Invalid profile ID" as const };
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" as const };

  const profile = await prisma.productProfile.findUnique({
    where: { id: profileId },
    select: { productName: true, slug: true },
  });
  if (!profile) return { error: "Profile not found" as const };

  // Ascending so each row can be diffed against the one before it.
  const rows = await prisma.productProfileVersion.findMany({
    where: { profileId },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      reason: true,
      createdAt: true,
      productName: true,
      summary: true,
      content: true,
      user: { select: { email: true } },
    },
  });

  const detailed: PageVersionDetail[] = rows.map((v, i) => {
    const prevContent = i > 0 ? rows[i - 1]!.content : null;
    const changes = diffCanvasDetailed(prevContent, v.content);
    return {
      id: v.id,
      reason: v.reason,
      createdAt: v.createdAt.toISOString(),
      productName: v.productName,
      email: v.user?.email ?? null,
      summary: v.summary ?? summarizeChanges(changes),
      changes,
      isCurrent: false,
    };
  });

  // Newest first; the newest snapshot is the live/current content.
  detailed.reverse();
  if (detailed.length > 0) detailed[0]!.isCurrent = true;

  return {
    productName: profile.productName,
    slug: profile.slug,
    versions: detailed,
  };
}

// Fetch a single version's full canvas content (for preview / inspection).
export async function getPageVersionContentAction(versionId: string) {
  if (!isUUID(versionId)) return { error: "Invalid version ID" };
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const version = await prisma.productProfileVersion.findUnique({
    where: { id: versionId },
    select: { content: true },
  });
  if (!version) return { error: "Version not found" };

  return { content: version.content };
}

// Restore a prior version: copy its content back onto the live profile and log
// the restore as a fresh version (so it is itself reversible).
export async function restorePageVersionAction(profileId: string, versionId: string) {
  if (!isUUID(profileId) || !isUUID(versionId)) return { error: "Invalid ID" };
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    // Scope the lookup to the profile so a version can't be restored across pages.
    const version = await prisma.productProfileVersion.findFirst({
      where: { id: versionId, profileId },
      select: { content: true },
    });
    if (!version) return { error: "Version not found" };

    const content = version.content as Record<string, unknown>;
    const rawTitle = typeof content?.pageTitle === "string" ? content.pageTitle.trim() : "";
    const syncName = rawTitle.length > 0 && rawTitle.length <= PRODUCT_NAME_MAX ? rawTitle : null;

    await prisma.productProfile.update({
      where: { id: profileId },
      data: syncName
        ? { content: content as any, productName: syncName }
        : { content: content as any },
    });
    await captureVersion(profileId, content, session.user.id, "restore");

    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

// ═══════════════════════════════════════════════════════════════
// PUBLIC PAGE - Unauthenticated access for published pages
// ═══════════════════════════════════════════════════════════════

const productProfileInclude = {
  product: {
    include: {
      company: {
        select: {
          name: true,
          logoUrl: true,
          businessUsername: true,
          customDomain: true,
        },
      },
      brandProfile: {
        select: {
          brandName: true,
          brandLogoUrl: true,
          themeColor: true,
        },
      },
    },
  },
} as const;

function publicProfileShape(profile: any) {
  return {
    id: profile.id,
    productId: profile.product.id as string,
    companyId: profile.product.companyId as string,
    slug: profile.slug,
    shortCode: profile.product.shortCode as string,
    slugVisible: profile.product.slugVisible as boolean,
    productName: profile.productName,
    tagline: profile.tagline,
    description: profile.description,
    logoUrl: profile.logoUrl,
    themeColor: profile.themeColor,
    content: profile.content,
    metaDescription: profile.metaDescription,
    ogImageUrl: profile.ogImageUrl,
    redirectUrl: profile.redirectUrl as string | null,
    redirectEnabled: profile.redirectEnabled as boolean,
    pinEnabled: profile.pinEnabled as boolean,
    pinLength: profile.pinLength as number | null,
    publishedAt: profile.publishedAt?.toISOString() ?? null,
    gtin: profile.product.gtin as string | null,
    gtinStatus: profile.product.gtinStatus as string | null,
    gtinVerifiedAt: profile.product.gtinVerifiedAt?.toISOString() ?? null,
    gtinData: (profile.product.gtinData as Record<string, unknown> | null) ?? null,
    company: {
      name: profile.product.company.name,
      logoUrl: profile.product.company.logoUrl,
      businessUsername: profile.product.company.businessUsername,
    },
    brand: profile.product.brandProfile
      ? {
        name: profile.product.brandProfile.brandName,
        logoUrl: profile.product.brandProfile.brandLogoUrl,
        themeColor: profile.product.brandProfile.themeColor,
      }
      : null,
  };
}

export async function getPublicPageBySlugAction(slug: string) {
  const profile = await prisma.productProfile.findUnique({
    where: { slug },
    include: productProfileInclude,
  });
  if (!profile || !profile.isPublished) return null;
  return publicProfileShape(profile);
}

/**
 * Resolve a public page from either a slug or an 8-char shortCode.
 * Returns the page payload plus the resolved kind so the route can decide
 * whether to redirect (shortCode + slugVisible=true) or render in place.
 */
export async function getPublicPageByHandleAction(handle: string) {
  if (SHORT_CODE_RE.test(handle)) {
    const product = await prisma.product.findFirst({
      where: { shortCode: handle },
      select: { id: true, defaultLanguageCode: true },
    });
    if (!product) return null;
    const profile =
      (await prisma.productProfile.findUnique({
        where: { productId_languageCode: { productId: product.id, languageCode: product.defaultLanguageCode } },
        include: productProfileInclude,
      })) ??
      (await prisma.productProfile.findFirst({
        where: { productId: product.id },
        include: productProfileInclude,
        orderBy: { createdAt: "asc" },
      }));
    if (!profile || !profile.isPublished) return null;
    return { kind: "shortCode" as const, page: publicProfileShape(profile) };
  }

  const profile = await prisma.productProfile.findUnique({
    where: { slug: handle },
    include: productProfileInclude,
  });
  if (!profile || !profile.isPublished) return null;
  return { kind: "slug" as const, page: publicProfileShape(profile) };
}

/**
 * Resolve a public page from a canonical 14-digit GTIN — the /01/{gtin} GS1
 * Digital Link resolver route. Mirrors the shortCode branch of
 * getPublicPageByHandleAction above.
 */
export async function getPublicPageByGtinAction(gtin: string) {
  const product = await prisma.product.findFirst({
    where: { gtin },
    select: { id: true, defaultLanguageCode: true },
  });
  if (!product) return null;

  const profile =
    (await prisma.productProfile.findUnique({
      where: { productId_languageCode: { productId: product.id, languageCode: product.defaultLanguageCode } },
      include: productProfileInclude,
    })) ??
    (await prisma.productProfile.findFirst({
      where: { productId: product.id },
      include: productProfileInclude,
      orderBy: { createdAt: "asc" },
    }));
  if (!profile || !profile.isPublished) return null;

  return publicProfileShape(profile);
}

// ═══════════════════════════════════════════════════════════════
// PREVIEW PAGE - Authenticated access for previewing pages
// ═══════════════════════════════════════════════════════════════

export async function getPreviewPageBySlugAction(slug: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const profile = await prisma.productProfile.findUnique({
    where: { slug },
    include: {
      product: {
        include: {
          company: {
            select: {
              name: true,
              logoUrl: true,
              businessUsername: true,
              customDomain: true,
            },
          },
          brandProfile: {
            select: {
              brandName: true,
              brandLogoUrl: true,
              themeColor: true,
            },
          },
        },
      },
    },
  });

  if (!profile) {
    return null;
  }

  return {
    id: profile.id,
    productId: profile.product.id as string,
    slug: profile.slug,
    productName: profile.productName,
    tagline: profile.tagline,
    description: profile.description,
    logoUrl: profile.logoUrl,
    themeColor: profile.themeColor,
    content: profile.content,
    metaDescription: profile.metaDescription,
    ogImageUrl: profile.ogImageUrl,
    publishedAt: profile.publishedAt?.toISOString() ?? null,
    company: {
      name: profile.product.company.name,
      logoUrl: profile.product.company.logoUrl,
      businessUsername: profile.product.company.businessUsername,
      customDomain: (profile.product.company as any).customDomain ?? null,
    },
    brand: profile.product.brandProfile
      ? {
        name: profile.product.brandProfile.brandName,
        logoUrl: profile.product.brandProfile.brandLogoUrl,
        themeColor: profile.product.brandProfile.themeColor,
      }
      : null,
  };
}

// ═══════════════════════════════════════════════════════════════
// UPDATE PAGE METADATA (SEO fields)
// ═══════════════════════════════════════════════════════════════

export async function updatePageMetaAction(
  profileId: string,
  meta: {
    metaDescription?: string | null;
    ogImageUrl?: string | null;
    tagline?: string | null;
    productName?: string;
    logoUrl?: string | null;
  }
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    const data: Record<string, unknown> = {};
    if (meta.metaDescription !== undefined) data.metaDescription = meta.metaDescription;
    if (meta.ogImageUrl !== undefined) data.ogImageUrl = meta.ogImageUrl;
    if (meta.tagline !== undefined) data.tagline = meta.tagline;
    if (meta.logoUrl !== undefined) data.logoUrl = meta.logoUrl;

    let newProductName: string | null = null;
    if (meta.productName !== undefined && meta.productName.trim().length > 0) {
      newProductName = meta.productName.trim();
      data.productName = newProductName;
    }

    // Mirror the dashboard productName into the canvas content's pageTitle so
    // a rename from the SEO panel shows up in the editor's top bar too.
    if (newProductName) {
      const existing = await prisma.productProfile.findUnique({
        where: { id: profileId },
        select: { content: true },
      });
      const currentContent = existing?.content as Record<string, unknown> | null;
      if (currentContent && typeof currentContent === "object" && !Array.isArray(currentContent)) {
        data.content = { ...currentContent, pageTitle: newProductName };
      }
    }

    await prisma.productProfile.update({
      where: { id: profileId },
      data,
    });
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

// Lightweight fetch for the SEO settings modal (dashboard dropdown / editor
// top-bar button). Loads just the columns the panel renders, no canvas blob.
export async function getSeoFieldsAction(profileId: string) {
  if (!isUUID(profileId)) return { error: "Invalid profile ID" as const };
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" as const };

  const companyId = await getUserCompanyId(session.user.id);
  if (!companyId) return { error: "No company found for user" as const };

  const profile = await prisma.productProfile.findUnique({
    where: { id: profileId },
    select: {
      id: true,
      slug: true,
      productName: true,
      tagline: true,
      metaDescription: true,
      ogImageUrl: true,
      logoUrl: true,
      product: { select: { companyId: true } },
    },
  });
  if (!profile || profile.product.companyId !== companyId) {
    return { error: "Product not found" as const };
  }

  return {
    id: profile.id,
    slug: profile.slug,
    productName: profile.productName,
    tagline: profile.tagline,
    metaDescription: profile.metaDescription,
    ogImageUrl: profile.ogImageUrl,
    logoUrl: profile.logoUrl,
  };
}

// ═══════════════════════════════════════════════════════════════
// UPLOAD IMAGE (Cloudflare R2)
// ═══════════════════════════════════════════════════════════════

export async function uploadImageAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const file = formData.get("file") as File | null;
  if (!file) return { error: "No file provided" };

  if (!file.type.startsWith("image/")) return { error: "File must be an image" };

  try {
    const { uploadToR2 } = await import("@/lib/r2");
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await uploadToR2(buffer, file.name, file.type, "uploads");

    return { url: result.url };
  } catch (error: any) {
    return { error: error.message };
  }
}

// ═══════════════════════════════════════════════════════════════
// NEW DATA ENDPOINTS
// ═══════════════════════════════════════════════════════════════

async function getUserCompanyId(userId: string) {
  const adminMembership = await prisma.companyAdmin.findFirst({ where: { userId } });
  if (adminMembership) return adminMembership.companyId;

  const userMembership = await prisma.companyUser.findFirst({ where: { userId } });
  if (userMembership) return userMembership.companyId;

  // Tenant admins aren't tied to a single company, so they act on the first
  // company under their tenant.
  const tenantLink = await prisma.tenantAdmin.findUnique({
    where: { userId },
    select: {
      tenant: {
        select: {
          companies: { select: { id: true }, orderBy: { createdAt: "asc" }, take: 1 },
        },
      },
    },
  });
  return tenantLink?.tenant.companies[0]?.id;
}

export async function getCompanyAnalyticsAction(branchId?: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const companyId = await getUserCompanyId(session.user.id);
  if (!companyId) return { error: "No company found for user" };

  try {
    const now = new Date();

    // Optional branch filter for the product breakdown. Validate ownership so a
    // foreign/invalid id can't leak another company's data — an unrecognized id
    // simply degrades to "all branches" (company-wide) rather than erroring.
    // Scoped to scan (page_views) and feedback queries; the product catalog
    // counts below stay company-wide so the header still reflects total inventory.
    let branchScope: { branchId?: string } = {};
    if (branchId && isUUID(branchId)) {
      const ownedBranch = await prisma.branch.findFirst({
        where: { id: branchId, companyId },
        select: { id: true },
      });
      if (ownedBranch) branchScope = { branchId };
    }
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Resolve custom link-type prefixes to their friendly labels for the QR
    // scan breakdown. Wrapped so a pre-migration DB (no table) degrades to the
    // raw prefix rather than blanking analytics.
    let linkTypeLabel = new Map<string, string>();
    try {
      const linkTypeRows = await prisma.companyLinkType.findMany({
        where: { companyId },
        select: { prefix: true, label: true },
      });
      linkTypeLabel = new Map(linkTypeRows.map((t) => [t.prefix, t.label]));
    } catch {
      // Table not migrated yet - custom types just show by prefix.
    }
    // Display key for a QR scan row: built-in enum value (or UNTAGGED for null),
    // or the custom link type's label (falling back to its prefix) for CUSTOM.
    const qrScanKey = (qrScanType: QrScanType | null, qrScanPrefix: string | null): string => {
      if (qrScanType === "CUSTOM") {
        return qrScanPrefix ? linkTypeLabel.get(qrScanPrefix) ?? qrScanPrefix : "Custom";
      }
      if (qrScanType === "GS1") {
        return qrScanPrefix ? `GS1 · ${qrScanPrefix}` : "GS1 Digital Link";
      }
      return qrScanType ?? "UNTAGGED";
    };

    // Split into two batches so a failure in page-view queries (e.g. stale
    // Prisma client in dev) can't blank out product/feedback counts.
    const [productCount, publishedCount, feedbackCount, feedbackLast30Days, feedbackStatusRows, recentFeedbackRows, ratedFeedbackCount] =
      await Promise.all([
        prisma.product.count({ where: { companyId } }),
        prisma.productProfile.count({ where: { product: { companyId }, isPublished: true } }),
        prisma.feedbackInquiry.count({ where: { companyId, ...branchScope } }),
        prisma.feedbackInquiry.count({ where: { companyId, ...branchScope, createdAt: { gte: thirtyDaysAgo } } }),
        prisma.feedbackInquiry.groupBy({
          by: ["status"],
          where: { companyId, ...branchScope },
          _count: { _all: true },
        }),
        prisma.feedbackInquiry.findMany({
          where: { companyId, ...branchScope, createdAt: { gte: thirtyDaysAgo } },
          select: { createdAt: true },
        }),
        prisma.feedbackInquiry.count({ where: { companyId, ...branchScope, ratingScore: { not: null } } }),
      ]);

    type ViewMetrics = {
      scanCount: number;
      scansLast7Days: number;
      scansLast30Days: number;
      deviceRows: Array<{ deviceType: string | null; _count: { _all: number } }>;
      countryRows: Array<{ country: string | null; _count: { _all: number } }>;
      qrScanRows: Array<{ qrScanType: QrScanType | null; qrScanPrefix: string | null; _count: { _all: number } }>;
      recentViewRows: Array<{ viewedAt: Date; referrer: string | null }>;
      topProductsRaw: Array<{ productId: string; _count: { _all: number } }>;
    };

    const emptyViewMetrics: ViewMetrics = {
      scanCount: 0,
      scansLast7Days: 0,
      scansLast30Days: 0,
      deviceRows: [],
      countryRows: [],
      qrScanRows: [],
      recentViewRows: [],
      topProductsRaw: [],
    };

    let viewMetrics: ViewMetrics = emptyViewMetrics;
    try {
      const [scanCount, scansLast7Days, scansLast30Days, deviceRows, countryRows, qrScanRows, recentViewRows, topProductsRaw] =
        await Promise.all([
          prisma.pageView.count({ where: { companyId, ...branchScope } }),
          prisma.pageView.count({ where: { companyId, ...branchScope, viewedAt: { gte: sevenDaysAgo } } }),
          prisma.pageView.count({ where: { companyId, ...branchScope, viewedAt: { gte: thirtyDaysAgo } } }),
          prisma.pageView.groupBy({
            by: ["deviceType"],
            where: { companyId, ...branchScope },
            _count: { _all: true },
          }),
          prisma.pageView.groupBy({
            by: ["country"],
            where: { companyId, ...branchScope, country: { not: null } },
            _count: { _all: true },
            orderBy: { _count: { country: "desc" } },
            take: 5,
          }),
          prisma.pageView.groupBy({
            by: ["qrScanType", "qrScanPrefix"],
            where: { companyId, ...branchScope },
            _count: { _all: true },
          }),
          prisma.pageView.findMany({
            where: { companyId, ...branchScope, viewedAt: { gte: thirtyDaysAgo } },
            select: { viewedAt: true, referrer: true },
          }),
          prisma.pageView.groupBy({
            by: ["productId"],
            where: { companyId, ...branchScope },
            _count: { _all: true },
            orderBy: { _count: { productId: "desc" } },
          }),
        ]);
      viewMetrics = {
        scanCount,
        scansLast7Days,
        scansLast30Days,
        deviceRows,
        countryRows,
        qrScanRows,
        recentViewRows,
        topProductsRaw,
      };
    } catch (viewErr) {
      // Page-view metrics unavailable (table missing, stale Prisma client in
      // dev, etc.) - degrade gracefully to zeros instead of blanking the
      // whole dashboard.
      console.error("[getCompanyAnalyticsAction] page-view metrics failed", viewErr);
    }

    const { scanCount, scansLast7Days, scansLast30Days, deviceRows, countryRows, qrScanRows, recentViewRows, topProductsRaw } =
      viewMetrics;

    // Time-series: bucket scans + feedback by day for the last 30 days.
    const dayMs = 24 * 60 * 60 * 1000;
    const dayKey = (d: Date) => {
      const x = new Date(d);
      x.setUTCHours(0, 0, 0, 0);
      return x.toISOString().slice(0, 10);
    };
    const buckets = new Map<string, { date: string; scans: number; feedback: number }>();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * dayMs);
      const key = dayKey(d);
      buckets.set(key, { date: key, scans: 0, feedback: 0 });
    }
    for (const row of recentViewRows) {
      const b = buckets.get(dayKey(row.viewedAt));
      if (b) b.scans += 1;
    }
    for (const row of recentFeedbackRows) {
      const b = buckets.get(dayKey(row.createdAt));
      if (b) b.feedback += 1;
    }
    const timeSeries = Array.from(buckets.values());

    // Source breakdown: bucket referrers into the same labels QrSource used.
    // Direct visits (no referrer) bucket as ON_PACKAGE - historically that's
    // how QR scans without a referrer were attributed.
    const sourceCounts = new Map<string, number>();
    for (const row of recentViewRows) {
      const bucket = bucketReferrer(row.referrer);
      sourceCounts.set(bucket, (sourceCounts.get(bucket) ?? 0) + 1);
    }
    const sourceRows = Array.from(sourceCounts, ([source, count]) => ({
      source,
      _count: { _all: count },
    }));

    // Top products: hydrate with name + feedback counts + per-product splits.
    const topProductIds = topProductsRaw.map((r) => r.productId);
    const [topProductProfiles, topProductFeedback, perProductDevice, perProductCountry, perProductBrowser, perProductQrScanType] =
      await Promise.all([
        topProductIds.length
          ? prisma.productProfile.findMany({
            where: { productId: { in: topProductIds } },
            select: { productId: true, productName: true, slug: true, isPublished: true, languageCode: true },
          })
          : Promise.resolve([]),
        topProductIds.length
          ? prisma.feedbackInquiry.groupBy({
            by: ["productId"],
            where: { companyId, ...branchScope, productId: { in: topProductIds } },
            _count: { _all: true },
          })
          : Promise.resolve([] as { productId: string | null; _count: { _all: number } }[]),
        topProductIds.length
          ? prisma.pageView.groupBy({
            by: ["productId", "deviceType"],
            where: { companyId, ...branchScope, productId: { in: topProductIds } },
            _count: { _all: true },
          })
          : Promise.resolve([] as Array<{ productId: string; deviceType: DeviceType | null; _count: { _all: number } }>),
        topProductIds.length
          ? prisma.pageView.groupBy({
            by: ["productId", "country"],
            where: { companyId, ...branchScope, productId: { in: topProductIds }, country: { not: null } },
            _count: { _all: true },
          })
          : Promise.resolve([] as Array<{ productId: string; country: string | null; _count: { _all: number } }>),
        topProductIds.length
          ? prisma.pageView.groupBy({
            by: ["productId", "browser"],
            where: { companyId, ...branchScope, productId: { in: topProductIds }, browser: { not: null } },
            _count: { _all: true },
          })
          : Promise.resolve([] as Array<{ productId: string; browser: string | null; _count: { _all: number } }>),
        topProductIds.length
          ? prisma.pageView.groupBy({
            by: ["productId", "qrScanType", "qrScanPrefix"],
            where: { companyId, ...branchScope, productId: { in: topProductIds } },
            _count: { _all: true },
          })
          : Promise.resolve([] as Array<{ productId: string; qrScanType: QrScanType | null; qrScanPrefix: string | null; _count: { _all: number } }>),
      ]);
    const profileByProduct = new Map<string, { productName: string; slug: string; isPublished: boolean }>();
    for (const p of topProductProfiles) {
      // Prefer default language profile if multiple; first wins otherwise.
      const existing = profileByProduct.get(p.productId);
      if (!existing || p.languageCode === "en") {
        profileByProduct.set(p.productId, { productName: p.productName, slug: p.slug, isPublished: p.isPublished });
      }
    }
    const feedbackByProduct = new Map<string, number>();
    for (const row of topProductFeedback) {
      if (row.productId) feedbackByProduct.set(row.productId, row._count._all);
    }

    // Per-product active time-on-page (total + average). Isolated try/catch
    // because durationMs is a newer column than the rest of page_views - a
    // not-yet-migrated DB degrades to null per product instead of throwing.
    const totalDurationByProduct = new Map<string, number>();
    const avgDurationByProduct = new Map<string, number>();
    if (topProductIds.length) {
      try {
        const durationRows = await prisma.pageView.groupBy({
          by: ["productId"],
          where: { companyId, ...branchScope, productId: { in: topProductIds }, durationMs: { not: null } },
          _sum: { durationMs: true },
          _avg: { durationMs: true },
        });
        for (const row of durationRows) {
          if (row._sum.durationMs != null) totalDurationByProduct.set(row.productId, row._sum.durationMs);
          if (row._avg.durationMs != null) avgDurationByProduct.set(row.productId, row._avg.durationMs);
        }
      } catch (durErr) {
        console.error("[getCompanyAnalyticsAction] per-product duration metric failed", durErr);
      }
    }

    const topProducts = topProductsRaw.slice(0, 5).map((r) => {
      const profile = profileByProduct.get(r.productId);
      const scans = r._count._all;
      const fb = feedbackByProduct.get(r.productId) ?? 0;
      return {
        productId: r.productId,
        productName: profile?.productName ?? "Untitled",
        slug: profile?.slug ?? "",
        isPublished: profile?.isPublished ?? false,
        scans,
        feedback: fb,
        conversionRate: scans > 0 ? (fb / scans) * 100 : 0,
        totalDurationMs: totalDurationByProduct.get(r.productId) ?? null,
        avgDurationMs: avgDurationByProduct.get(r.productId) ?? null,
      };
    });

    // Per-product breakdown: for each top product, the top 3 devices / countries
    // / browsers driving their views. Powers the per-product cards on the
    // analytics page.
    const productBreakdowns = topProductIds.map((pid) => {
      const profile = profileByProduct.get(pid);
      const scans = topProductsRaw.find((r) => r.productId === pid)?._count._all ?? 0;
      const devices = perProductDevice
        .filter((r) => r.productId === pid)
        .map((r) => ({ device: r.deviceType ?? "UNKNOWN", count: r._count._all }))
        .sort((a, b) => b.count - a.count);
      const countries = perProductCountry
        .filter((r) => r.productId === pid)
        .map((r) => ({ country: r.country ?? "Unknown", count: r._count._all }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);
      const browsers = perProductBrowser
        .filter((r) => r.productId === pid)
        .map((r) => ({ browser: r.browser ?? "Unknown", count: r._count._all }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);
      const qrAcc = new Map<string, number>();
      for (const r of perProductQrScanType) {
        if (r.productId !== pid) continue;
        const key = qrScanKey(r.qrScanType, r.qrScanPrefix);
        qrAcc.set(key, (qrAcc.get(key) ?? 0) + r._count._all);
      }
      const qrScans = Array.from(qrAcc, ([qrScanType, count]) => ({ qrScanType, count }))
        .sort((a, b) => b.count - a.count);
      return {
        productId: pid,
        productName: profile?.productName ?? "Untitled",
        slug: profile?.slug ?? "",
        isPublished: profile?.isPublished ?? false,
        scans,
        devices,
        countries,
        browsers,
        qrScans,
      };
    });

    const deviceBreakdown = deviceRows.map((r) => ({
      device: r.deviceType ?? "UNKNOWN",
      count: r._count._all,
    }));

    const sourceBreakdown = sourceRows.map((r) => ({
      source: r.source,
      count: r._count._all,
    }));

    // QR surface breakdown (On Pack / Link / Social + custom link types). Custom
    // scans are keyed by their link-type label; pre-migration rows with a null
    // qrScanType land in UNTAGGED. Sorted desc so the dominant surface leads.
    const qrScanCounts = new Map<string, number>();
    for (const r of qrScanRows) {
      const key = qrScanKey(r.qrScanType, r.qrScanPrefix);
      qrScanCounts.set(key, (qrScanCounts.get(key) ?? 0) + r._count._all);
    }
    const qrScanBreakdown = Array.from(qrScanCounts, ([qrScanType, count]) => ({ qrScanType, count }))
      .sort((a, b) => b.count - a.count);

    const topCountries = countryRows.map((r) => ({
      country: r.country ?? "Unknown",
      count: r._count._all,
    }));

    const feedbackByStatus = feedbackStatusRows.map((r) => ({
      status: r.status,
      count: r._count._all,
    }));

    // Conversion funnel metrics, all expressed as percentages.
    //  - scanToFeedbackRatio: visits that resulted in a feedback submission.
    //  - feedbackResolutionRate: feedback the team has actioned (responded/closed).
    //  - ratedFeedbackRate: feedback that included a star/emoji/nps rating.
    //  - publishRate: products that have at least one published page.
    const scanToFeedbackRatio = scanCount > 0 ? (feedbackCount / scanCount) * 100 : 0;
    const resolvedFeedbackCount = feedbackStatusRows
      .filter((r) => r.status === "RESPONDED" || r.status === "CLOSED")
      .reduce((sum, r) => sum + r._count._all, 0);
    const feedbackResolutionRate = feedbackCount > 0 ? (resolvedFeedbackCount / feedbackCount) * 100 : 0;
    const ratedFeedbackRate = feedbackCount > 0 ? (ratedFeedbackCount / feedbackCount) * 100 : 0;
    const publishRate = productCount > 0 ? (publishedCount / productCount) * 100 : 0;

    // Average active time-on-page across visits that reported a duration.
    // Isolated try/catch: this column is newer than the rest of page_views, so
    // a not-yet-migrated DB degrades to null here instead of zeroing all the
    // metrics above.
    let averageVisitorDurationMs: number | null = null;
    let totalVisitorDurationMs: number | null = null;
    try {
      const durationAgg = await prisma.pageView.aggregate({
        where: { companyId, ...branchScope, durationMs: { not: null } },
        _avg: { durationMs: true },
        _sum: { durationMs: true },
      });
      averageVisitorDurationMs = durationAgg._avg.durationMs ?? null;
      totalVisitorDurationMs = durationAgg._sum.durationMs ?? null;
    } catch (durErr) {
      console.error("[getCompanyAnalyticsAction] duration metric failed", durErr);
    }

    return {
      success: true,
      stats: {
        totalProducts: productCount,
        publishedProducts: publishedCount,
        draftProducts: Math.max(0, productCount - publishedCount),
        totalQrLeads: scanCount,
        feedbackCount,
        scansLast7Days,
        scansLast30Days,
        feedbackLast30Days,
        scanToFeedbackRatio,
        feedbackResolutionRate,
        ratedFeedbackRate,
        publishRate,
        resolvedFeedbackCount,
        ratedFeedbackCount,
        averageVisitorDurationMs,
        totalVisitorDurationMs,
        timeSeries,
        deviceBreakdown,
        sourceBreakdown,
        qrScanBreakdown,
        topCountries,
        feedbackByStatus,
        topProducts,
        productBreakdowns,
      },
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

export type ProductAnalyticsRange = "weekly" | "monthly" | "yearly" | "lifetime";

export async function getProductAnalyticsAction(
  productId: string,
  range: ProductAnalyticsRange,
  branchId?: string,
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const companyId = await getUserCompanyId(session.user.id);
  if (!companyId) return { error: "No company found for user" };
  if (!isUUID(productId)) return { error: "Invalid product id" };

  const product = await prisma.product.findFirst({
    where: { id: productId, companyId },
    select: { id: true, createdAt: true },
  });
  if (!product) return { error: "Product not found" };

  // Optional branch filter. Validate ownership so a foreign/invalid id can't
  // leak another company's data — an unrecognized id degrades to "all branches".
  // When set, every scan/feedback query below re-scopes to that branch.
  let branchScope: { branchId?: string } = {};
  if (branchId && isUUID(branchId)) {
    const ownedBranch = await prisma.branch.findFirst({
      where: { id: branchId, companyId },
      select: { id: true },
    });
    if (ownedBranch) branchScope = { branchId };
  }

  try {
    const now = new Date();
    let startDate: Date;
    let bucket: "day" | "month";

    if (range === "weekly") {
      startDate = new Date(now);
      startDate.setUTCHours(0, 0, 0, 0);
      startDate.setUTCDate(startDate.getUTCDate() - 6);
      bucket = "day";
    } else if (range === "monthly") {
      startDate = new Date(now);
      startDate.setUTCHours(0, 0, 0, 0);
      startDate.setUTCDate(startDate.getUTCDate() - 29);
      bucket = "day";
    } else if (range === "yearly") {
      startDate = new Date(now);
      startDate.setUTCHours(0, 0, 0, 0);
      startDate.setUTCDate(1);
      startDate.setUTCMonth(startDate.getUTCMonth() - 11);
      bucket = "month";
    } else {
      const [firstView, firstFeedback] = await Promise.all([
        prisma.pageView.findFirst({
          where: { companyId, productId, ...branchScope },
          select: { viewedAt: true },
          orderBy: { viewedAt: "asc" },
        }).catch(() => null),
        prisma.feedbackInquiry.findFirst({
          where: { companyId, productId, ...branchScope },
          select: { createdAt: true },
          orderBy: { createdAt: "asc" },
        }),
      ]);
      const candidates = [firstView?.viewedAt, firstFeedback?.createdAt, product.createdAt].filter(
        (d): d is Date => !!d,
      );
      const earliest = candidates.length
        ? candidates.reduce((a, b) => (a < b ? a : b))
        : new Date(now);
      startDate = new Date(earliest);
      startDate.setUTCDate(1);
      startDate.setUTCHours(0, 0, 0, 0);
      bucket = "month";
    }

    type RangeView = {
      viewedAt: Date;
      deviceType: DeviceType | null;
      country: string | null;
      browser: string | null;
      referrer: string | null;
      qrScanType: QrScanType | null;
      branchId: string | null;
    };
    let viewRows: RangeView[] = [];
    try {
      viewRows = await prisma.pageView.findMany({
        where: { companyId, productId, ...branchScope, viewedAt: { gte: startDate } },
        select: {
          viewedAt: true,
          deviceType: true,
          country: true,
          browser: true,
          referrer: true,
          qrScanType: true,
          branchId: true,
        },
      });
    } catch (viewErr) {
      console.error("[getProductAnalyticsAction] page-view query failed", viewErr);
    }

    const feedbackRows = await prisma.feedbackInquiry.findMany({
      where: { companyId, productId, ...branchScope, createdAt: { gte: startDate } },
      select: { createdAt: true },
    });

    let totalScans = 0;
    try {
      totalScans = await prisma.pageView.count({ where: { companyId, productId, ...branchScope } });
    } catch (viewErr) {
      console.error("[getProductAnalyticsAction] page-view count failed", viewErr);
    }
    const totalFeedback = await prisma.feedbackInquiry.count({
      where: { companyId, productId, ...branchScope },
    });

    // Lifetime active time-on-page for this product (total + average across
    // visits that reported a duration). Isolated try/catch because durationMs
    // is a newer column - degrade to null instead of failing the whole panel.
    let totalDurationMs: number | null = null;
    let avgDurationMs: number | null = null;
    try {
      const durationAgg = await prisma.pageView.aggregate({
        where: { companyId, productId, ...branchScope, durationMs: { not: null } },
        _sum: { durationMs: true },
        _avg: { durationMs: true },
      });
      totalDurationMs = durationAgg._sum.durationMs ?? null;
      avgDurationMs = durationAgg._avg.durationMs ?? null;
    } catch (durErr) {
      console.error("[getProductAnalyticsAction] duration metric failed", durErr);
    }

    const buckets = new Map<string, { date: string; scans: number; feedback: number }>();
    if (bucket === "day") {
      const dayMs = 24 * 60 * 60 * 1000;
      const startMs = startDate.getTime();
      const todayKey = (() => {
        const x = new Date(now);
        x.setUTCHours(0, 0, 0, 0);
        return x.getTime();
      })();
      const totalDays = Math.max(1, Math.round((todayKey - startMs) / dayMs) + 1);
      for (let i = 0; i < totalDays; i++) {
        const d = new Date(startMs + i * dayMs);
        const key = d.toISOString().slice(0, 10);
        buckets.set(key, { date: key, scans: 0, feedback: 0 });
      }
      for (const row of viewRows) {
        const x = new Date(row.viewedAt);
        x.setUTCHours(0, 0, 0, 0);
        const b = buckets.get(x.toISOString().slice(0, 10));
        if (b) b.scans += 1;
      }
      for (const row of feedbackRows) {
        const x = new Date(row.createdAt);
        x.setUTCHours(0, 0, 0, 0);
        const b = buckets.get(x.toISOString().slice(0, 10));
        if (b) b.feedback += 1;
      }
    } else {
      const startY = startDate.getUTCFullYear();
      const startM = startDate.getUTCMonth();
      const nowY = now.getUTCFullYear();
      const nowM = now.getUTCMonth();
      const months = Math.max(1, (nowY - startY) * 12 + (nowM - startM) + 1);
      for (let i = 0; i < months; i++) {
        const d = new Date(Date.UTC(startY, startM + i, 1));
        const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
        buckets.set(key, { date: key, scans: 0, feedback: 0 });
      }
      const monthKey = (d: Date) =>
        `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
      for (const row of viewRows) {
        const b = buckets.get(monthKey(new Date(row.viewedAt)));
        if (b) b.scans += 1;
      }
      for (const row of feedbackRows) {
        const b = buckets.get(monthKey(new Date(row.createdAt)));
        if (b) b.feedback += 1;
      }
    }

    const timeSeries = Array.from(buckets.values());
    const rangeScans = timeSeries.reduce((sum, b) => sum + b.scans, 0);
    const rangeFeedback = timeSeries.reduce((sum, b) => sum + b.feedback, 0);

    const tallyTop = (
      rows: RangeView[],
      pick: (r: RangeView) => string | null,
      fallback: string,
      limit?: number,
    ) => {
      const counts = new Map<string, number>();
      for (const row of rows) {
        const key = pick(row) ?? fallback;
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
      const sorted = Array.from(counts, ([key, count]) => ({ key, count })).sort(
        (a, b) => b.count - a.count,
      );
      return limit ? sorted.slice(0, limit) : sorted;
    };

    const devices = tallyTop(viewRows, (r) => r.deviceType, "UNKNOWN").map((d) => ({
      device: d.key,
      count: d.count,
    }));
    const countries = tallyTop(viewRows, (r) => r.country, "Unknown", 10).map((c) => ({
      country: c.key,
      count: c.count,
    }));
    const browsers = tallyTop(viewRows, (r) => r.browser, "Unknown", 10).map((b) => ({
      browser: b.key,
      count: b.count,
    }));
    const sources = tallyTop(viewRows, (r) => bucketReferrer(r.referrer), "OTHER").map((s) => ({
      source: s.key,
      count: s.count,
    }));
    // QR scan type - which QR surface (On Pack / Link / Social) the scan came
    // through. Distinct from `sources` above (which buckets HTTP referrer);
    // historical rows pre-migration land in UNTAGGED.
    const qrScanTypes = tallyTop(viewRows, (r) => r.qrScanType, "UNTAGGED").map((q) => ({
      qrScanType: q.key,
      count: q.count,
    }));

    // Per-branch scan split for this product. Only meaningful when the company
    // actually has branches; otherwise every scan is "no branch" and the
    // breakdown adds nothing, so we omit it (empty array → card hidden).
    const NO_BRANCH = "__none__";
    let branchNameById = new Map<string, string>();
    let companyHasBranches = false;
    try {
      const branchRows = await prisma.branch.findMany({
        where: { companyId },
        select: { id: true, name: true, city: true },
      });
      companyHasBranches = branchRows.length > 0;
      branchNameById = new Map(
        branchRows.map((b) => [b.id, b.city ? `${b.name} — ${b.city}` : b.name]),
      );
    } catch (branchErr) {
      console.error("[getProductAnalyticsAction] branch query failed", branchErr);
    }
    const branches = companyHasBranches
      ? tallyTop(viewRows, (r) => r.branchId, NO_BRANCH).map((b) => ({
          branch:
            b.key === NO_BRANCH
              ? "Direct / No branch"
              : branchNameById.get(b.key) ?? "Unknown branch",
          count: b.count,
        }))
      : [];

    return {
      success: true,
      data: {
        bucket,
        range,
        timeSeries,
        rangeScans,
        rangeFeedback,
        rangeConversion: rangeScans > 0 ? (rangeFeedback / rangeScans) * 100 : 0,
        totalScans,
        totalFeedback,
        totalDurationMs,
        avgDurationMs,
        devices,
        countries,
        browsers,
        sources,
        qrScanTypes,
        branches,
      },
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getCompanyMessagesAction() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const companyId = await getUserCompanyId(session.user.id);
  if (!companyId) return { error: "No company found for user" };

  try {
    const messages = await prisma.feedbackInquiry.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
      include: {
        product: { include: { profiles: true, category: true } },
        branch: { select: { name: true } },
        answers: {
          orderBy: { createdAt: 'asc' },
          select: { fieldId: true, label: true, fieldType: true, valueText: true, valueNumber: true, valueOptions: true },
        },
      }
    });

    return {
      success: true,
      items: messages.map(m => ({
        id: m.id,
        name: m.name,
        email: m.email,
        phoneNumber: m.phoneNumber,
        type: m.type,
        feedbackType: m.feedbackType,
        status: m.status,
        description: m.description,
        createdAt: m.createdAt.toISOString(),
        productName: m.product?.profiles?.[0]?.productName || "General",
        branchName: m.branch?.name ?? null,
        categoryName: m.product?.category?.name ?? null,
        ratingScore: m.ratingScore ?? null,
        answers: m.answers.map(a => ({
          fieldId: a.fieldId,
          label: a.label,
          fieldType: a.fieldType,
          valueText: a.valueText,
          valueNumber: a.valueNumber,
          valueOptions: a.valueOptions,
        })),
      }))
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getCompanySettingsAction() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const companyId = await getUserCompanyId(session.user.id);
  if (!companyId) return { error: "No company found for user" };

  try {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: { tenant: true }
    });

    if (!company) return { error: "Company not found" };

    return {
      success: true,
      company: {
        id: company.id,
        name: company.name,
        email: company.email,
        businessUsername: company.businessUsername,
        subscriptionPlan: company.subscriptionPlan,
        subscriptionStatus: company.subscriptionStatus,
        maximumProducts: company.maximumProducts,
        maximumBrandProfiles: company.maximumBrandProfiles,
        createdAt: company.createdAt.toISOString(),
        requireValidGtin: company.requireValidGtin,
      }
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

/** Toggles the "require a valid GTIN before publishing" company-wide policy. */
export async function updateGtinPolicyAction(requireValidGtin: boolean) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const companyId = await getUserCompanyId(session.user.id);
  if (!companyId) return { error: "No company found for user" };

  try {
    await prisma.company.update({ where: { id: companyId }, data: { requireValidGtin } });
    return { success: true, requireValidGtin };
  } catch (error: any) {
    return { error: error.message };
  }
}

// ═══════════════════════════════════════════════════════════════
// Custom QR link types (per-company)
// ═══════════════════════════════════════════════════════════════

// Custom link types resolve at the top level as /<prefix>/<code>, so a prefix
// must never collide with a real top-level route. This blocks every existing
// top-level segment (built-in QR routes p/l/s, app routes, route-group pages)
// plus reserved/likely-future names and Next.js internals. Compared
// case-insensitively against the prefix.
const RESERVED_LINK_PREFIXES = new Set([
  // Existing top-level routes
  "p", "l", "s", "x", "api", "editor", "preview", "showcase",
  "dashboard", "admin", "login",
  // Reserved / likely-future
  "tenant", "signup", "register", "logout", "auth", "settings", "account",
  "_next", "__next", "public", "static", "assets", "favicon", "robots", "sitemap",
  // GS1 Digital Link resolver route (/01/{gtin}) - LINK_PREFIX_RE already
  // requires a leading letter so "01" can never match, but reserve it
  // defensively in case that regex is ever loosened.
  "01",
]);

const LINK_PREFIX_RE = /^[a-z][a-z0-9-]{0,39}$/;

/** Normalize + validate a custom link-type prefix. Returns the cleaned value or an error. */
function normalizeLinkPrefix(raw: string): { prefix: string } | { error: string } {
  const prefix = raw.trim().toLowerCase();
  if (!prefix) return { error: "Prefix is required" };
  if (!LINK_PREFIX_RE.test(prefix)) {
    return {
      error:
        "Prefix must be 1-40 chars, start with a letter, and contain only lowercase letters, numbers, or hyphens",
    };
  }
  if (RESERVED_LINK_PREFIXES.has(prefix)) {
    return { error: `"${prefix}" is reserved - pick a different prefix` };
  }
  return { prefix };
}

export async function getCompanyLinkTypesAction() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const companyId = await getUserCompanyId(session.user.id);
  if (!companyId) return { error: "No company found for user" };

  try {
    const items = await prisma.companyLinkType.findMany({
      where: { companyId },
      orderBy: { createdAt: "asc" },
      select: { id: true, label: true, prefix: true, icon: true, isActive: true },
    });
    return { success: true, items };
  } catch (error: any) {
    return { error: error?.message ?? "Failed to load link types" };
  }
}

export async function createCompanyLinkTypeAction(input: { label: string; prefix: string; icon?: string }) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const companyId = await getUserCompanyId(session.user.id);
  if (!companyId) return { error: "No company found for user" };

  const label = input.label?.trim() ?? "";
  if (!label) return { error: "Label is required" };
  if (label.length > 60) return { error: "Label too long (max 60 chars)" };

  const normalized = normalizeLinkPrefix(input.prefix ?? "");
  if ("error" in normalized) return { error: normalized.error };

  const icon = input.icon?.trim() || null;
  if (icon && icon.length > 40) return { error: "Icon name too long" };

  try {
    const item = await prisma.companyLinkType.create({
      data: { companyId, label, prefix: normalized.prefix, icon },
      select: { id: true, label: true, prefix: true, icon: true, isActive: true },
    });
    return { success: true, item };
  } catch (error: any) {
    // Unique constraint on (companyId, prefix)
    if (error?.code === "P2002") {
      return { error: `Prefix "${normalized.prefix}" is already in use` };
    }
    return { error: error?.message ?? "Failed to create link type" };
  }
}

export async function deleteCompanyLinkTypeAction(id: string) {
  if (!isUUID(id)) return { error: "Invalid link type ID" };

  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const companyId = await getUserCompanyId(session.user.id);
  if (!companyId) return { error: "No company found for user" };

  // Confirm ownership before deleting.
  const owned = await prisma.companyLinkType.findFirst({ where: { id, companyId }, select: { id: true } });
  if (!owned) return { error: "Link type not found" };

  try {
    await prisma.companyLinkType.delete({ where: { id } });
    return { success: true };
  } catch (error: any) {
    return { error: error?.message ?? "Failed to delete link type" };
  }
}

// Map a referrer URL onto the same source labels the QrSource enum used,
// so the dashboard's existing SOURCE_LABEL mapping still renders nicely.
// Empty/missing referrer counts as ON_PACKAGE (direct visit - likely a QR scan).
function bucketReferrer(referrer: string | null): string {
  if (!referrer) return "ON_PACKAGE";
  let host: string;
  try {
    host = new URL(referrer).hostname.toLowerCase();
  } catch {
    return "OTHER";
  }
  if (host.includes("facebook.") || host === "fb.com" || host.endsWith(".fb.com")) return "FACEBOOK";
  if (host.includes("instagram.")) return "INSTAGRAM";
  if (host === "t.co" || host.includes("twitter.") || host === "x.com" || host.endsWith(".x.com")) return "TWITTER";
  if (host.includes("linkedin.") || host === "lnkd.in") return "LINKEDIN";
  if (host.includes("youtube.") || host === "youtu.be") return "YOUTUBE";
  if (host.includes("tiktok.")) return "TIKTOK";
  return "OTHER";
}
