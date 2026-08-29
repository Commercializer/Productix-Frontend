-- Lets a MediaAsset be scoped to a Product directly, not just a
-- ProductProfile - needed for the DPP "Product gallery" section, which isn't
-- tied to any single language profile.

-- AlterTable
ALTER TABLE "media_assets" ADD COLUMN "product_id" UUID;

-- CreateIndex
CREATE INDEX "media_assets_user_id_product_id_created_at_idx" ON "media_assets"("user_id", "product_id", "created_at");

-- AddForeignKey
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_product_id_fkey"
  FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
