// ─────────────────────────────────────────────
// @productix/db - Database package exports
// ─────────────────────────────────────────────

// Prisma client singleton
export { prisma } from "./client";

// Prisma namespace - needed for sentinels like Prisma.DbNull (a bare `null`
// on a nullable Json field writes a JSON null value, not SQL NULL).
export { Prisma } from "@prisma/client";

// Legacy schema types (deprecated - use @prisma/client types instead)
export type { DbPage, DbUser, DbTenant, DbTemplate } from "./schema";

// Re-export Prisma generated types for convenience
export type {
  User,
  Tenant,
  TenantAdmin,
  Company,
  CompanyAdmin,
  CompanyUser,
  CompanySocialAccount,
  BrandProfile,
  BrandProfileSocialAccount,
  Product,
  ProductProfile,
  ProductDpp,
  LinkedProduct,
  QrCode,
  QrScan,
  PageView,
  FeedbackInquiry,
  FeedbackResponse,
  MediaAsset,
  // Enums
  UserRole,
  TenantType,
  SubscriptionPlan,
  SubscriptionStatus,
  SocialPlatform,
  QrType,
  QrSource,
  QrScanType,
  Gs1VerificationStatus,
  DppIdentifierType,
  DppSector,
  DppDisplayMode,
  DeviceType,
  FeedbackInquiryType,
  FeedbackType,
  FeedbackStatus,
  MediaAssetType,
} from "@prisma/client";
