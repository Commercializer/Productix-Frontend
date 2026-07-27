-- "Require valid GTIN before publishing" company-level policy toggle.
-- Defaults to false so no existing company is retroactively blocked.

-- AlterTable
ALTER TABLE "companies"
  ADD COLUMN "require_valid_gtin" BOOLEAN NOT NULL DEFAULT false;
