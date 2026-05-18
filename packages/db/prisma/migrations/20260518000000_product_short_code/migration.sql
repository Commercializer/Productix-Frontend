-- Add short_code (8-char shareable handle) and slug_visible toggle to products.

ALTER TABLE "products"
  ADD COLUMN "short_code" VARCHAR(8),
  ADD COLUMN "slug_visible" BOOLEAN NOT NULL DEFAULT true;

-- Backfill short_code for existing rows with random 8-char [a-z0-9] strings,
-- retrying until every row has a globally unique value.
DO $$
DECLARE
  alphabet CONSTANT text := 'abcdefghijklmnopqrstuvwxyz0123456789';
  rec RECORD;
  candidate text;
  attempts int;
BEGIN
  FOR rec IN SELECT id FROM "products" WHERE "short_code" IS NULL LOOP
    attempts := 0;
    LOOP
      candidate := '';
      FOR i IN 1..8 LOOP
        candidate := candidate || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
      END LOOP;
      EXIT WHEN NOT EXISTS (SELECT 1 FROM "products" WHERE "short_code" = candidate);
      attempts := attempts + 1;
      IF attempts > 32 THEN
        RAISE EXCEPTION 'Failed to generate unique short_code after 32 attempts';
      END IF;
    END LOOP;
    UPDATE "products" SET "short_code" = candidate WHERE id = rec.id;
  END LOOP;
END $$;

ALTER TABLE "products" ALTER COLUMN "short_code" SET NOT NULL;
CREATE UNIQUE INDEX "products_short_code_key" ON "products"("short_code");
