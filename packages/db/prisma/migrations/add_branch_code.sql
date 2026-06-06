-- Per-company short branch code for compact branch-scoped QR links
-- (/p/<short>?b=<code>). Sequential per company starting at 1, unique within
-- a company. Replaces the long UUID previously carried in the ?b= param.

-- AlterTable: add nullable first so we can backfill existing rows.
ALTER TABLE "branches" ADD COLUMN "code" INTEGER;

-- Backfill: number each company's existing branches 1..N by creation order.
WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY company_id ORDER BY created_at, id) AS rn
  FROM "branches"
)
UPDATE "branches" b
SET "code" = n.rn
FROM numbered n
WHERE b.id = n.id;

-- Enforce NOT NULL once every row has a code.
ALTER TABLE "branches" ALTER COLUMN "code" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "branches_company_id_code_key" ON "branches"("company_id", "code");
