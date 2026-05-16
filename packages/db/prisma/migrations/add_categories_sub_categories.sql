-- ─────────────────────────────────────────────────────────────
-- Add Category + SubCategory tables, and link from Product.
-- Idempotent — safe to re-run.
-- Run in Supabase SQL editor (or `psql $DIRECT_URL -f <this-file>`).
-- ─────────────────────────────────────────────────────────────

-- CreateTable: categories
CREATE TABLE IF NOT EXISTS "categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "categories_company_id_name_key"
    ON "categories"("company_id", "name");
CREATE INDEX IF NOT EXISTS "categories_company_id_idx"
    ON "categories"("company_id");

-- CreateTable: sub_categories
CREATE TABLE IF NOT EXISTS "sub_categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_id" UUID NOT NULL,
    "category_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sub_categories_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "sub_categories_category_id_name_key"
    ON "sub_categories"("category_id", "name");
CREATE INDEX IF NOT EXISTS "sub_categories_company_id_idx"
    ON "sub_categories"("company_id");
CREATE INDEX IF NOT EXISTS "sub_categories_category_id_idx"
    ON "sub_categories"("category_id");

-- AlterTable: products — add category_id, sub_category_id
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "category_id" UUID;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "sub_category_id" UUID;

CREATE INDEX IF NOT EXISTS "products_category_id_idx"
    ON "products"("category_id");
CREATE INDEX IF NOT EXISTS "products_sub_category_id_idx"
    ON "products"("sub_category_id");

-- Foreign keys (guarded so re-runs don't fail)
DO $$ BEGIN
    ALTER TABLE "categories"
        ADD CONSTRAINT "categories_company_id_fkey"
        FOREIGN KEY ("company_id") REFERENCES "companies"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE "sub_categories"
        ADD CONSTRAINT "sub_categories_company_id_fkey"
        FOREIGN KEY ("company_id") REFERENCES "companies"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE "sub_categories"
        ADD CONSTRAINT "sub_categories_category_id_fkey"
        FOREIGN KEY ("category_id") REFERENCES "categories"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE "products"
        ADD CONSTRAINT "products_category_id_fkey"
        FOREIGN KEY ("category_id") REFERENCES "categories"("id")
        ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE "products"
        ADD CONSTRAINT "products_sub_category_id_fkey"
        FOREIGN KEY ("sub_category_id") REFERENCES "sub_categories"("id")
        ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
