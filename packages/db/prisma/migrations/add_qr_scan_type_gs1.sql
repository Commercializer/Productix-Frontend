-- New GS1 Digital Link QR surface (/01/{gtin}). Scans through it record
-- qr_scan_type = 'GS1'; the optional channel extension param (?ch=) is stored
-- in the existing qr_scan_prefix column, exactly like CUSTOM link types reuse it.

-- AlterEnum
ALTER TYPE "QrScanType" ADD VALUE IF NOT EXISTS 'GS1';
