-- AlterTable
-- Number of digits in the access PIN (4–6). Lets the public PIN gate render the
-- exact number of input dots and auto-submit at the right length. Nullable so
-- pages locked before this column existed keep working (gate falls back to 6).
ALTER TABLE "product_profiles" ADD COLUMN "pin_length" INTEGER;
