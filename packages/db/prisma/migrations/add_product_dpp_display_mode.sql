-- Adds Product.dpp_display_mode: controls what /01/{gtin} shows to visitors
-- (GS1 showcase, DPP passport, or a toggle between both). Applied via
-- `prisma db push`, not `migrate dev` - see DB migration workflow notes.

CREATE TYPE "DppDisplayMode" AS ENUM ('GS1', 'DPP', 'BOTH');

ALTER TABLE "products"
  ADD COLUMN "dpp_display_mode" "DppDisplayMode" NOT NULL DEFAULT 'BOTH';
