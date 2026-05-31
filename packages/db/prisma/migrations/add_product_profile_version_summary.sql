-- AlterTable
-- Human-readable description of what changed in this snapshot vs the previous
-- one (e.g. "Added 2 images · Edited 3 elements (moved 1)"). Nullable: rows
-- written before this column have no summary.
ALTER TABLE "product_profile_versions" ADD COLUMN "summary" VARCHAR(600);
