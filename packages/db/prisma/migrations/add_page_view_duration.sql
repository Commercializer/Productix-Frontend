-- AlterTable
-- Longest foreground session (ms) recorded for a visitor/page/day, updated by
-- the /api/analytics/duration beacon. Nullable: historical rows have no value.
ALTER TABLE "page_views" ADD COLUMN "duration_ms" INTEGER;
