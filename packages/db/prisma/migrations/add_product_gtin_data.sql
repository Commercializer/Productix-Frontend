-- Raw GS1 verification API response, persisted at the moment a GTIN is set
-- to GS1_VERIFIED (via createPromptionAction or updateProductGtinAction), so
-- the "view GTIN details" UI reads a stored snapshot instead of re-hitting
-- the external API on every view. Nullable/additive - existing rows unaffected.

-- AlterTable
ALTER TABLE "products"
  ADD COLUMN "gtin_data" JSONB;
