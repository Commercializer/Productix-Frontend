-- Generalizes ProductDpp from "identifier + a few optional fields + one
-- sector block" to a full multi-section DPP (see
-- apps/web/src/lib/dpp/dpp-sections.ts + sector-sections.ts). Drops the
-- narrow per-field columns and the single-section sectorAnswers blob in
-- favor of one generic section_answers map keyed by section, then field.

-- AlterTable
ALTER TABLE "product_dpp" DROP COLUMN "brand_name";
ALTER TABLE "product_dpp" DROP COLUMN "model_number";
ALTER TABLE "product_dpp" DROP COLUMN "hs_code";
ALTER TABLE "product_dpp" DROP COLUMN "sector_answers";
ALTER TABLE "product_dpp" ADD COLUMN "section_answers" JSONB;
