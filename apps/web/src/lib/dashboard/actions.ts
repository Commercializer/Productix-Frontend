"use server";

import { prisma } from "@productix/db";
import { auth } from "@/auth";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isUUID(val: string): boolean {
  return UUID_RE.test(val);
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
    include: { product: { select: { companyId: true, id: true } } },
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
      isPublished: p.isPublished,
      publishedAt: p.publishedAt?.toISOString() ?? null,
      logoUrl: p.logoUrl,
      metaDescription: p.metaDescription,
    }))
  };
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

  // Create Product + ProductProfile in a transaction
  const result = await prisma.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: {
        companyId,
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
          qrUrl: `/p/${profile.slug}`,
          isActive: true,
        },
      });
    }

    return { success: true, slug: profile.slug };
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

export async function getPublicPageBySlugAction(slug: string) {
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

  if (!profile || !profile.isPublished) {
    return null;
  }

  return {
    id: profile.id,
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
    const productScope = { where: { product: { companyId } } } as const;

    const [
      productCount,
      publishedCount,
      scanCount,
      feedbackCount,
      scansLast7Days,
      scansLast30Days,
      feedbackLast30Days,
      deviceRows,
      sourceRows,
      countryRows,
      feedbackStatusRows,
      recentScanRows,
      recentFeedbackRows,
      topProductsRaw,
    ] = await Promise.all([
      prisma.product.count({ where: { companyId } }),
      prisma.productProfile.count({ where: { product: { companyId }, isPublished: true } }),
      prisma.qrScan.count(productScope),
      prisma.feedbackInquiry.count({ where: { companyId } }),
      prisma.qrScan.count({ where: { product: { companyId }, scannedAt: { gte: sevenDaysAgo } } }),
      prisma.qrScan.count({ where: { product: { companyId }, scannedAt: { gte: thirtyDaysAgo } } }),
      prisma.feedbackInquiry.count({ where: { companyId, createdAt: { gte: thirtyDaysAgo } } }),
      prisma.qrScan.groupBy({
        by: ["deviceType"],
        where: { product: { companyId } },
        _count: { _all: true },
      }),
      prisma.qrScan.groupBy({
        by: ["qrSource"],
        where: { product: { companyId } },
        _count: { _all: true },
      }),
      prisma.qrScan.groupBy({
        by: ["country"],
        where: { product: { companyId }, country: { not: null } },
        _count: { _all: true },
        orderBy: { _count: { country: "desc" } },
        take: 5,
      }),
      prisma.feedbackInquiry.groupBy({
        by: ["status"],
        where: { companyId },
        _count: { _all: true },
      }),
      prisma.qrScan.findMany({
        where: { product: { companyId }, scannedAt: { gte: thirtyDaysAgo } },
        select: { scannedAt: true },
      }),
      prisma.feedbackInquiry.findMany({
        where: { companyId, createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true },
      }),
      prisma.qrScan.groupBy({
        by: ["productId"],
        where: { product: { companyId } },
        _count: { _all: true },
        orderBy: { _count: { productId: "desc" } },
        take: 5,
      }),
    ]);

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
    for (const row of recentScanRows) {
      const b = buckets.get(dayKey(row.scannedAt));
      if (b) b.scans += 1;
    }
    for (const row of recentFeedbackRows) {
      const b = buckets.get(dayKey(row.createdAt));
      if (b) b.feedback += 1;
    }
    const timeSeries = Array.from(buckets.values());

    // Top products: hydrate with name + feedback counts.
    const topProductIds = topProductsRaw.map((r) => r.productId);
    const [topProductProfiles, topProductFeedback] = await Promise.all([
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

    const deviceBreakdown = deviceRows.map((r) => ({
      device: r.deviceType ?? "UNKNOWN",
      count: r._count._all,
    }));

    const sourceBreakdown = sourceRows.map((r) => ({
      source: r.qrSource ?? "UNKNOWN",
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
