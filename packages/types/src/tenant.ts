/* ─────────────────────────────────────────────
 * Tenant & Organization Types
 * ──────────────────────────────────────────── */

// ── Subscription ────────────────────────────

export type SubscriptionPlan = "FREE" | "BASIC" | "PREMIUM" | "ENTERPRISE";
export type SubscriptionStatus = "ACTIVE" | "SUSPENDED" | "CANCELLED";

// ── Social Platforms ────────────────────────

export type SocialPlatform =
  | "FACEBOOK"
  | "INSTAGRAM"
  | "TWITTER"
  | "LINKEDIN"
  | "YOUTUBE"
  | "TIKTOK"
  | "PINTEREST"
  | "SNAPCHAT"
  | "OTHER";

// ── Company ─────────────────────────────────

export interface Company {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  businessUsername: string;
  customDomain?: string;
  logoUrl?: string;
  maximumBrandProfiles: number;
  maximumProducts: number;
  companyWebsiteUrl?: string;
  subscriptionPlan: SubscriptionPlan;
  subscriptionStatus: SubscriptionStatus;
  maximumUsers: number;
  subscriptionAmount?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CompanySocialAccount {
  id: string;
  companyId: string;
  platform: SocialPlatform;
  url: string;
  createdAt: string;
  updatedAt: string;
}

// ── Brand Profile ───────────────────────────

export interface BrandProfile {
  id: string;
  companyId: string;
  brandName: string;
  brandLogoUrl?: string;
  themeColor?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BrandProfileSocialAccount {
  id: string;
  brandProfileId: string;
  platform: SocialPlatform;
  url: string;
  createdAt: string;
  updatedAt: string;
}

// ── Product ─────────────────────────────────

export interface Product {
  id: string;
  brandProfileId?: string;
  companyId: string;
  defaultLanguageCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductProfile {
  id: string;
  productId: string;
  languageCode: string;
  slug: string;
  productName: string;
  tagline?: string;
  logoUrl?: string;
  themeColor: string;
  description: string;
  redirectUrl?: string;
  redirectEnabled: boolean;
  content: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface LinkedProduct {
  id: string;
  productId: string;
  linkedProductId: string;
  displayOrder: number;
  createdAt: string;
}

// ── QR Code System ──────────────────────────

export type QrType = "MASTER" | "BATCH" | "SERIAL";

export type QrSource =
  | "ON_PACKAGE"
  | "FACEBOOK"
  | "INSTAGRAM"
  | "TWITTER"
  | "LINKEDIN"
  | "YOUTUBE"
  | "TIKTOK"
  | "EMAIL"
  | "SMS"
  | "OTHER";

export type DeviceType = "MOBILE" | "TABLET" | "DESKTOP";

export interface QrCode {
  id: string;
  productId: string;
  qrType: QrType;
  qrUrl?: string;
  serialNumber?: string;
  batchNumber?: string;
  campaignName?: string;
  productionDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QrScan {
  id: string;
  qrCodeId: string;
  productId: string;
  qrType: QrType;
  scannedAt: string;
  qrSource?: QrSource;
  ipAddress?: string;
  country?: string;
  city?: string;
  deviceType?: DeviceType;
  browser?: string;
}

// ── Feedback & Inquiry ──────────────────────

export type FeedbackInquiryType = "FEEDBACK" | "INQUIRY";
export type FeedbackType = "DAMAGED_GOODS" | "EXPIRED_ITEM" | "OTHER";
export type FeedbackStatus = "NEW" | "IN_PROGRESS" | "RESPONDED" | "CLOSED";

export interface FeedbackInquiry {
  id: string;
  companyId: string;
  productId?: string;
  qrId?: string;
  type: FeedbackInquiryType;
  feedbackType?: FeedbackType;
  name: string;
  email: string;
  phoneNumber?: string;
  description: string;
  imageUrl?: string;
  status: FeedbackStatus;
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackResponse {
  id: string;
  feedbackInquiryId: string;
  userId?: string;
  responderName?: string;
  responderEmail?: string;
  responderPhone?: string;
  responseText: string;
  createdAt: string;
}
