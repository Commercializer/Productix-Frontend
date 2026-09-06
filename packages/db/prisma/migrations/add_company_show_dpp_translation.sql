-- Company-wide toggle for the public DPP passport's (/01/{gtin}) language
-- picker (Google Translate of DPP terms only, never product/answer data).
-- See DppTranslationCard / updateDppTranslationVisibilityAction.
-- Applied via `prisma db push` - this file is a hand-written record, not the
-- apply step.
ALTER TABLE "companies"
  ADD COLUMN IF NOT EXISTS "show_dpp_translation" BOOLEAN NOT NULL DEFAULT true;
