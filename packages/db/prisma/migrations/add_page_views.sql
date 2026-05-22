-- CreateTable
CREATE TABLE "page_views" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_profile_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "visitor_hash" CHAR(64) NOT NULL,
    "day_bucket" DATE NOT NULL,
    "viewed_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "country" VARCHAR(100),
    "region" VARCHAR(100),
    "city" VARCHAR(100),
    "device_type" "DeviceType",
    "browser" VARCHAR(100),
    "os" VARCHAR(100),
    "referrer" VARCHAR(500),
    "language" VARCHAR(10),

    CONSTRAINT "page_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "page_views_product_profile_id_viewed_at_idx" ON "page_views"("product_profile_id", "viewed_at");

-- CreateIndex
CREATE INDEX "page_views_product_id_viewed_at_idx" ON "page_views"("product_id", "viewed_at");

-- CreateIndex
CREATE INDEX "page_views_company_id_viewed_at_idx" ON "page_views"("company_id", "viewed_at");

-- CreateIndex
CREATE UNIQUE INDEX "page_views_dedupe_unique" ON "page_views"("product_profile_id", "visitor_hash", "day_bucket");

-- AddForeignKey
ALTER TABLE "page_views" ADD CONSTRAINT "page_views_product_profile_id_fkey" FOREIGN KEY ("product_profile_id") REFERENCES "product_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
