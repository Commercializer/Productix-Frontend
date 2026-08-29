-- Answers to the selected sector's section-info fields (see
-- apps/web/src/lib/dpp/sector-sections.ts), keyed by the field's raw text.
-- Cleared and replaced wholesale whenever sector changes.

-- AlterTable
ALTER TABLE "product_dpp" ADD COLUMN "sector_answers" JSONB;
