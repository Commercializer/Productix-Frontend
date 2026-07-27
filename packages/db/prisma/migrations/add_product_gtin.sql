-- GS1 GTIN field on products, plus local/external verification status and
-- timestamp. Purely additive: all three columns are nullable/defaulted, so
-- existing rows are unaffected. gtin is globally unique but nullable -
-- Postgres unique indexes permit unlimited NULLs, so products without a GTIN
-- (i.e. every existing row today) are unaffected.

-- CreateEnum
CREATE TYPE "Gs1VerificationStatus" AS ENUM (
  'UNVERIFIED',
  'INVALID_FORMAT',
  'VALID_FORMAT',
  'GS1_VERIFIED',
  'GS1_NOT_FOUND'
);

-- AlterTable
ALTER TABLE "products"
  ADD COLUMN "gtin" VARCHAR(14),
  ADD COLUMN "gtin_status" "Gs1VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
  ADD COLUMN "gtin_verified_at" TIMESTAMPTZ;

-- CreateIndex
CREATE UNIQUE INDEX "products_gtin_key" ON "products"("gtin");
