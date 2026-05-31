-- CreateTable
-- Point-in-time snapshots of a product profile's editor content, captured on each
-- save/publish (plus the editing user) = page version history + user edit log.
CREATE TABLE "product_profile_versions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "profile_id" UUID NOT NULL,
    "user_id" UUID,
    "content" JSONB NOT NULL,
    "product_name" VARCHAR(255),
    "reason" VARCHAR(16) NOT NULL DEFAULT 'save',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_profile_versions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_profile_versions_profile_id_created_at_idx" ON "product_profile_versions"("profile_id", "created_at");

-- AddForeignKey
ALTER TABLE "product_profile_versions" ADD CONSTRAINT "product_profile_versions_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "product_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_profile_versions" ADD CONSTRAINT "product_profile_versions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
