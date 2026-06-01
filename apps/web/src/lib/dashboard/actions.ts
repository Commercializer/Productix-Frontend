"use server";

import { prisma } from "@productix/db";
import type { DeviceType, QrScanType } from "@productix/db";
import { auth } from "@/auth";

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
    include: { product: { select: { companyId: true, id: true, shortCode: true, slugVisible: true } } },
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
    }))
  };
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

export async function createPromptionAction(data: {
  productName: string;
  slug: string;
  description?: string;
  metaDescription?: string;
  ogImageUrl?: string;
  categoryId?: string | null;
  subCategoryId?: string | null;
  brandProfileId?: string | null;
}) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const userId = session.user.id;

  // Find the user's first company
  const adminMembership = await prisma.companyAdmin.findFirst({ where: { userId } });
  const userMembership = adminMembership
    ? null
    : await prisma.companyUser.findFirst({ where: { userId } });
  const companyId = adminMembership?.companyId ?? userMembership?.companyId;

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

  const shortCode = await generateUniqueShortCode();

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
    publishedAt: profile.publishedAt?.toISOString() ?? null,
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
  const userMembership = adminMembership
    ? null
    : await prisma.companyUser.findFirst({ where: { userId } });
  return adminMembership?.companyId ?? userMembership?.companyId;
}

export async function getCompanyAnalyticsAction() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const companyId = await getUserCompanyId(session.user.id);
  if (!companyId) return { error: "No company found for user" };

  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Split into two batches so a failure in page-view queries (e.g. stale
    // Prisma client in dev) can't blank out product/feedback counts.
    const [productCount, publishedCount, feedbackCount, feedbackLast30Days, feedbackStatusRows, recentFeedbackRows] =
      await Promise.all([
        prisma.product.count({ where: { companyId } }),
        prisma.productProfile.count({ where: { product: { companyId }, isPublished: true } }),
        prisma.feedbackInquiry.count({ where: { companyId } }),
        prisma.feedbackInquiry.count({ where: { companyId, createdAt: { gte: thirtyDaysAgo } } }),
        prisma.feedbackInquiry.groupBy({
          by: ["status"],
          where: { companyId },
          _count: { _all: true },
        }),
        prisma.feedbackInquiry.findMany({
          where: { companyId, createdAt: { gte: thirtyDaysAgo } },
          select: { createdAt: true },
        }),
      ]);

    type ViewMetrics = {
      scanCount: number;
      scansLast7Days: number;
      scansLast30Days: number;
      deviceRows: Array<{ deviceType: string | null; _count: { _all: number } }>;
      countryRows: Array<{ country: string | null; _count: { _all: number } }>;
      qrScanRows: Array<{ qrScanType: QrScanType | null; _count: { _all: number } }>;
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
          prisma.pageView.count({ where: { companyId } }),
          prisma.pageView.count({ where: { companyId, viewedAt: { gte: sevenDaysAgo } } }),
          prisma.pageView.count({ where: { companyId, viewedAt: { gte: thirtyDaysAgo } } }),
          prisma.pageView.groupBy({
            by: ["deviceType"],
            where: { companyId },
            _count: { _all: true },
          }),
          prisma.pageView.groupBy({
            by: ["country"],
            where: { companyId, country: { not: null } },
            _count: { _all: true },
            orderBy: { _count: { country: "desc" } },
            take: 5,
          }),
          prisma.pageView.groupBy({
            by: ["qrScanType"],
            where: { companyId },
            _count: { _all: true },
          }),
          prisma.pageView.findMany({
            where: { companyId, viewedAt: { gte: thirtyDaysAgo } },
            select: { viewedAt: true, referrer: true },
          }),
          prisma.pageView.groupBy({
            by: ["productId"],
            where: { companyId },
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
            where: { companyId, productId: { in: topProductIds } },
            _count: { _all: true },
          })
          : Promise.resolve([] as { productId: string | null; _count: { _all: number } }[]),
        topProductIds.length
          ? prisma.pageView.groupBy({
            by: ["productId", "deviceType"],
            where: { companyId, productId: { in: topProductIds } },
            _count: { _all: true },
          })
          : Promise.resolve([] as Array<{ productId: string; deviceType: DeviceType | null; _count: { _all: number } }>),
        topProductIds.length
          ? prisma.pageView.groupBy({
            by: ["productId", "country"],
            where: { companyId, productId: { in: topProductIds }, country: { not: null } },
            _count: { _all: true },
          })
          : Promise.resolve([] as Array<{ productId: string; country: string | null; _count: { _all: number } }>),
        topProductIds.length
          ? prisma.pageView.groupBy({
            by: ["productId", "browser"],
            where: { companyId, productId: { in: topProductIds }, browser: { not: null } },
            _count: { _all: true },
          })
          : Promise.resolve([] as Array<{ productId: string; browser: string | null; _count: { _all: number } }>),
        topProductIds.length
          ? prisma.pageView.groupBy({
            by: ["productId", "qrScanType"],
            where: { companyId, productId: { in: topProductIds } },
            _count: { _all: true },
          })
          : Promise.resolve([] as Array<{ productId: string; qrScanType: QrScanType | null; _count: { _all: number } }>),
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
          where: { companyId, productId: { in: topProductIds }, durationMs: { not: null } },
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
      const qrScans = perProductQrScanType
        .filter((r) => r.productId === pid)
        .map((r) => ({ qrScanType: r.qrScanType ?? "UNTAGGED", count: r._count._all }))
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

    // QR surface breakdown (On Pack / Link / Social). Pre-migration rows with a
    // null qrScanType land in UNTAGGED. Sorted desc so the dominant surface
    // leads the list in the dashboard.
    const qrScanBreakdown = qrScanRows
      .map((r) => ({
        qrScanType: r.qrScanType ?? "UNTAGGED",
        count: r._count._all,
      }))
      .sort((a, b) => b.count - a.count);

    const topCountries = countryRows.map((r) => ({
      country: r.country ?? "Unknown",
      count: r._count._all,
    }));

    const feedbackByStatus = feedbackStatusRows.map((r) => ({
      status: r.status,
      count: r._count._all,
    }));

    const scanToFeedbackRatio = scanCount > 0 ? (feedbackCount / scanCount) * 100 : 0;

    // Average active time-on-page across visits that reported a duration.
    // Isolated try/catch: this column is newer than the rest of page_views, so
    // a not-yet-migrated DB degrades to null here instead of zeroing all the
    // metrics above.
    let averageVisitorDurationMs: number | null = null;
    let totalVisitorDurationMs: number | null = null;
    try {
      const durationAgg = await prisma.pageView.aggregate({
        where: { companyId, durationMs: { not: null } },
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
          where: { companyId, productId },
          select: { viewedAt: true },
          orderBy: { viewedAt: "asc" },
        }).catch(() => null),
        prisma.feedbackInquiry.findFirst({
          where: { companyId, productId },
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
    };
    let viewRows: RangeView[] = [];
    try {
      viewRows = await prisma.pageView.findMany({
        where: { companyId, productId, viewedAt: { gte: startDate } },
        select: {
          viewedAt: true,
          deviceType: true,
          country: true,
          browser: true,
          referrer: true,
          qrScanType: true,
        },
      });
    } catch (viewErr) {
      console.error("[getProductAnalyticsAction] page-view query failed", viewErr);
    }

    const feedbackRows = await prisma.feedbackInquiry.findMany({
      where: { companyId, productId, createdAt: { gte: startDate } },
      select: { createdAt: true },
    });

    let totalScans = 0;
    try {
      totalScans = await prisma.pageView.count({ where: { companyId, productId } });
    } catch (viewErr) {
      console.error("[getProductAnalyticsAction] page-view count failed", viewErr);
    }
    const totalFeedback = await prisma.feedbackInquiry.count({
      where: { companyId, productId },
    });

    // Lifetime active time-on-page for this product (total + average across
    // visits that reported a duration). Isolated try/catch because durationMs
    // is a newer column - degrade to null instead of failing the whole panel.
    let totalDurationMs: number | null = null;
    let avgDurationMs: number | null = null;
    try {
      const durationAgg = await prisma.pageView.aggregate({
        where: { companyId, productId, durationMs: { not: null } },
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
      include: { product: { include: { profiles: true } } }
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
        productName: m.product?.profiles?.[0]?.productName || "General"
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
        createdAt: company.createdAt.toISOString()
      }
    };
  } catch (error: any) {
    return { error: error.message };
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
