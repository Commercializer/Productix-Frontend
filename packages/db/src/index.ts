// ─────────────────────────────────────────────
// @productix/db - Database package exports
// ─────────────────────────────────────────────

// Prisma client singleton
export { prisma } from "./client";

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
  DeviceType,
  FeedbackInquiryType,
  FeedbackType,
  FeedbackStatus,
  MediaAssetType,
} from "@prisma/client";
