-- Digital Product Passport identity record - one per Product. First slice of
-- the eventual full section-info schema (see
-- packages/db/prisma/seed-data/dpp-section-info/); later phases add columns
-- to this table rather than new child tables.

-- CreateEnum
CREATE TYPE "DppIdentifierType" AS ENUM ('GS1_GTIN', 'MA_DPP', 'EPC', 'UUID', 'DID');

-- CreateEnum
CREATE TYPE "DppSector" AS ENUM (
  'BATTERY', 'ELECTRONICS', 'TEXTILE', 'TYRE', 'FURNITURE', 'CONSTRUCTION',
  'CHEMICALS', 'TOYS', 'MACHINERY', 'VEHICLES', 'PACKAGING', 'COSMETICS',
  'FOOD', 'MEDICAL', 'INTERMEDIATE_PRODUCTS', 'OTHER'
);

-- CreateTable
CREATE TABLE "product_dpp" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "product_id" UUID NOT NULL,
  "identifier_type" "DppIdentifierType" NOT NULL,
  "identifier_value" VARCHAR(255),
  "sector" "DppSector",
  "brand_name" VARCHAR(255),
  "model_number" VARCHAR(255),
  "hs_code" VARCHAR(20),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "product_dpp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_dpp_product_id_key" ON "product_dpp"("product_id");

-- AddForeignKey
ALTER TABLE "product_dpp" ADD CONSTRAINT "product_dpp_product_id_fkey"
  FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
