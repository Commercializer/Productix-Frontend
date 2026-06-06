-- AlterTable
-- Plaintext copy of the access PIN so the owner can view / re-share it after
-- setting (the bcrypt pin_hash is one-way and can't be read back). This is a
-- low-sensitivity page-access code, not a user credential, and is only ever
-- returned to the authenticated owner — never to public visitors. Nullable so
-- existing rows are unaffected; pages locked before this column existed simply
-- have no viewable code until the PIN is set again.
ALTER TABLE "product_profiles" ADD COLUMN "pin_code" VARCHAR(12);
