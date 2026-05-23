-- One-time backfill: every page_views row inserted before the qr_scan_type
-- column existed has NULL. Historically /p was the only QR prefix in use, so
-- attribute all of them to ON_PACK. New scans through /l/ and /s/ are written
-- with the correct type from the route handler, so this is safe to run once.
UPDATE "page_views"
SET "qr_scan_type" = 'ON_PACK'
WHERE "qr_scan_type" IS NULL;
