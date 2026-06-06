-- AlterTable
-- PIN lock for a product's public showcase page. When pin_enabled is true the
-- visitor must enter the matching PIN (compared against the bcrypt pin_hash)
-- before /p/<handle> renders. Both columns are nullable/defaulted so existing
-- rows stay unlocked.
ALTER TABLE "product_profiles" ADD COLUMN "pin_hash" VARCHAR(100);
ALTER TABLE "product_profiles" ADD COLUMN "pin_enabled" BOOLEAN NOT NULL DEFAULT false;
