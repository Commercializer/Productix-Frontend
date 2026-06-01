-- ═══════════════════════════════════════════════════════════════
-- Media Assets - per-user, product-scoped uploaded media registry
--
-- Records every file uploaded to Cloudflare R2 so the editor's media
-- library can be scoped to the uploading user (and, optionally, the
-- product the file was uploaded for) instead of a shared per-browser cache.
-- ═══════════════════════════════════════════════════════════════

-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "MediaAssetType" AS ENUM ('IMAGE', 'AUDIO', 'DOCUMENT');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "media_assets" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "company_id" UUID,
    "product_profile_id" UUID,
    "r2_key" VARCHAR(500) NOT NULL,
    "url" VARCHAR(1000) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "size" INTEGER NOT NULL,
    "mime_type" VARCHAR(100) NOT NULL,
    "media_type" "MediaAssetType" NOT NULL,
    "width" INTEGER NOT NULL DEFAULT 0,
    "height" INTEGER NOT NULL DEFAULT 0,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "media_assets_r2_key_key" ON "media_assets"("r2_key");
CREATE INDEX IF NOT EXISTS "media_assets_user_id_created_at_idx" ON "media_assets"("user_id", "created_at");
CREATE INDEX IF NOT EXISTS "media_assets_user_id_product_profile_id_created_at_idx" ON "media_assets"("user_id", "product_profile_id", "created_at");
CREATE INDEX IF NOT EXISTS "media_assets_company_id_idx" ON "media_assets"("company_id");

-- AddForeignKey
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_product_profile_id_fkey" FOREIGN KEY ("product_profile_id") REFERENCES "product_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ─────────────────────────────────────────────────────────────
-- Row-Level Security: a user can only see / mutate their own assets.
-- (Defense-in-depth; the API routes also scope every query by user_id.)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS media_assets_select ON public.media_assets;
CREATE POLICY media_assets_select ON public.media_assets
  FOR SELECT
  USING (user_id = auth.uid() OR public.is_super_admin());

DROP POLICY IF EXISTS media_assets_insert ON public.media_assets;
CREATE POLICY media_assets_insert ON public.media_assets
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS media_assets_delete ON public.media_assets;
CREATE POLICY media_assets_delete ON public.media_assets
  FOR DELETE
  USING (user_id = auth.uid() OR public.is_super_admin());
