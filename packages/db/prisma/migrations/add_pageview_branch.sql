-- Attribute scans to a branch. When a visitor arrives through a branch-scoped
-- QR (/p/<short>?b=<code>) the page view is now tagged with that branch, so the
-- analytics product breakdown can be filtered by branch the same way feedback
-- already is. Nullable: generic QRs and pre-migration rows carry no branch.

ALTER TABLE "page_views" ADD COLUMN "branch_id" UUID;

-- SET NULL on branch delete mirrors feedback_inquiries.branch_id — removing a
-- branch must never cascade-delete historical analytics.
ALTER TABLE "page_views"
  ADD CONSTRAINT "page_views_branch_id_fkey"
  FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE SET NULL;

-- Drives the branch-filtered analytics queries (WHERE company_id = … AND branch_id = …).
CREATE INDEX "page_views_company_id_branch_id_idx" ON "page_views"("company_id", "branch_id");
