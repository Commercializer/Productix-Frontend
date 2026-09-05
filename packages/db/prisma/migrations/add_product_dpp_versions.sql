-- CreateTable
-- Immutable point-in-time snapshots of a Digital Product Passport, captured on
-- every publish/update/restore - the audit trail required for regulatory
-- traceability. Unlike product_profile_versions, rows here are NEVER pruned
-- (retention is permanent) and no application code path ever updates or
-- deletes an existing row - see ProductDppVersion's doc comment in
-- schema.prisma for why this is enforced at the application level rather than
-- with a DB trigger (this table's FK cascades from product_dpp/products, and a
-- blanket trigger would also break that legitimate cascade delete).
CREATE TABLE "product_dpp_versions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "dpp_id" UUID NOT NULL,
    "user_id" UUID,
    "version_number" INTEGER NOT NULL,
    "identifier_type" "DppIdentifierType" NOT NULL,
    "identifier_value" VARCHAR(255),
    "sector" "DppSector",
    "section_answers" JSONB,
    "reason" VARCHAR(16) NOT NULL DEFAULT 'publish',
    "summary" VARCHAR(600),
    "change_detail" JSONB,
    "restored_from_version" INTEGER,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_dpp_versions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_dpp_versions_dpp_id_version_number_key" ON "product_dpp_versions"("dpp_id", "version_number");

-- CreateIndex
CREATE INDEX "product_dpp_versions_dpp_id_created_at_idx" ON "product_dpp_versions"("dpp_id", "created_at");

-- AddForeignKey
ALTER TABLE "product_dpp_versions" ADD CONSTRAINT "product_dpp_versions_dpp_id_fkey" FOREIGN KEY ("dpp_id") REFERENCES "product_dpp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_dpp_versions" ADD CONSTRAINT "product_dpp_versions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable
-- Per-company toggle for whether the DPP version history (version list + past
-- snapshots) is shown on the public passport page (/01/{gtin}) - see
-- getPublicDppVersionsAction. Defaults to visible, matching the spec's
-- "accessible from the public DPP profile" default expectation.
ALTER TABLE "companies" ADD COLUMN "show_dpp_version_history" BOOLEAN NOT NULL DEFAULT true;
