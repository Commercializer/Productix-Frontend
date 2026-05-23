-- CreateEnum
CREATE TYPE "QrScanType" AS ENUM ('ON_PACK', 'LINK', 'SOCIAL');

-- AlterTable
ALTER TABLE "page_views" ADD COLUMN "qr_scan_type" "QrScanType";
