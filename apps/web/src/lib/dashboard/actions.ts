"use server";

import { prisma } from "@productix/db";
import type { DeviceType } from "@productix/db";
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
// REDIRECT LINK — when set + enabled, scanning the QR / hitting
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
// TOGGLE slug visibility — affects whether the public route
// redirects /p/<shortCode> to /p/<slug>.
// ═══════════════════════════════════════════════════════════════

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/;

/**
 * Rename a product profile's slug. Anyone with read/write access to the company
 * (admins and regular users) can rename — the slug only affects the pretty URL.
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
// SAVE PAGE CONTENT (from editor → DB)
// ═══════════════════════════════════════════════════════════════

export async function savePageContentAction(profileId: string, content: Record<string, unknown>) {
  if (!isUUID(profileId)) return { error: "Invalid profile ID" };
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    await prisma.productProfile.update({
      where: { id: profileId },
      data: { content: content as any },
    });
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

  return {
    id: profile.id,
    slug: profile.slug,
    productName: profile.productName,
    content: profile.content,
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
// PUBLIC PAGE — Unauthenticated access for published pages
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
// PREVIEW PAGE — Authenticated access for previewing pages
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
  meta: { metaDescription?: string; ogImageUrl?: string; tagline?: string }
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    await prisma.productProfile.update({
      where: { id: profileId },
      data: {
        metaDescription: meta.metaDescription,
        ogImageUrl: meta.ogImageUrl,
        tagline: meta.tagline,
      },
    });
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
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
      recentViewRows: Array<{ viewedAt: Date; referrer: string | null }>;
      topProductsRaw: Array<{ productId: string; _count: { _all: number } }>;
    };

    const emptyViewMetrics: ViewMetrics = {
      scanCount: 0,
      scansLast7Days: 0,
      scansLast30Days: 0,
      deviceRows: [],
      countryRows: [],
      recentViewRows: [],
      topProductsRaw: [],
    };

    let viewMetrics: ViewMetrics = emptyViewMetrics;
    try {
      const [scanCount, scansLast7Days, scansLast30Days, deviceRows, countryRows, recentViewRows, topProductsRaw] =
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
          prisma.pageView.findMany({
            where: { companyId, viewedAt: { gte: thirtyDaysAgo } },
            select: { viewedAt: true, referrer: true },
          }),
          prisma.pageView.groupBy({
            by: ["productId"],
            where: { companyId },
            _count: { _all: true },
            orderBy: { _count: { productId: "desc" } },
            take: 5,
          }),
        ]);
      viewMetrics = {
        scanCount,
        scansLast7Days,
        scansLast30Days,
        deviceRows,
        countryRows,
        recentViewRows,
        topProductsRaw,
      };
    } catch (viewErr) {
      // Page-view metrics unavailable (table missing, stale Prisma client in
      // dev, etc.) — degrade gracefully to zeros instead of blanking the
      // whole dashboard.
      console.error("[getCompanyAnalyticsAction] page-view metrics failed", viewErr);
    }

    const { scanCount, scansLast7Days, scansLast30Days, deviceRows, countryRows, recentViewRows, topProductsRaw } =
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
    // Direct visits (no referrer) bucket as ON_PACKAGE — historically that's
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
    const [topProductProfiles, topProductFeedback, perProductDevice, perProductCountry, perProductBrowser] =
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
    const topProducts = topProductsRaw.map((r) => {
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
      return {
        productId: pid,
        productName: profile?.productName ?? "Untitled",
        slug: profile?.slug ?? "",
        isPublished: profile?.isPublished ?? false,
        scans,
        devices,
        countries,
        browsers,
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

    const topCountries = countryRows.map((r) => ({
      country: r.country ?? "Unknown",
      count: r._count._all,
    }));

    const feedbackByStatus = feedbackStatusRows.map((r) => ({
      status: r.status,
      count: r._count._all,
    }));

    const scanToFeedbackRatio = scanCount > 0 ? (feedbackCount / scanCount) * 100 : 0;

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
        timeSeries,
        deviceBreakdown,
        sourceBreakdown,
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
// Empty/missing referrer counts as ON_PACKAGE (direct visit — likely a QR scan).
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
