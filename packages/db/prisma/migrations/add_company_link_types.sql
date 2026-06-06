-- Custom QR link types feature.
--
-- 1. New CUSTOM value on the QrScanType enum so scans through company-defined
--    link types can be tracked alongside the built-in ON_PACK / LINK / SOCIAL.
-- 2. qr_scan_prefix column on page_views holding the company-defined prefix
--    (e.g. "promo") a CUSTOM scan came through, so analytics can break custom
--    types out individually. Null for built-in types.
-- 3. company_link_types table storing each company's custom link types. Built-in
--    types are hardcoded in the app and are NOT stored here.

-- AlterEnum
ALTER TYPE "QrScanType" ADD VALUE IF NOT EXISTS 'CUSTOM';

-- AlterTable
ALTER TABLE "page_views" ADD COLUMN "qr_scan_prefix" VARCHAR(40);

-- CreateTable
CREATE TABLE "company_link_types" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_id" UUID NOT NULL,
    "label" VARCHAR(60) NOT NULL,
    "prefix" VARCHAR(40) NOT NULL,
    "icon" VARCHAR(40),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT "company_link_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "company_link_types_company_id_prefix_key" ON "company_link_types"("company_id", "prefix");

-- CreateIndex
CREATE INDEX "company_link_types_company_id_idx" ON "company_link_types"("company_id");

-- AddForeignKey
ALTER TABLE "company_link_types" ADD CONSTRAINT "company_link_types_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
