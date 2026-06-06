-- Default company seat limit changed from 5 → 3.
-- Only affects companies created after this runs; existing companies keep
-- their current maximum_users value. Super admins can adjust per-company.
ALTER TABLE companies
  ALTER COLUMN maximum_users SET DEFAULT 3;
