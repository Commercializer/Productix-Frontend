-- DB-level enforcement that product_dpp_versions rows are immutable, per the
-- DPP versioning spec's "immutable and tamper-resistant" requirement.
-- Previously this was enforced only by application convention (no code path
-- calls .update()/.delete() on this table) - this trigger makes it true even
-- against a rogue script, a future bug, or direct DB access.
--
-- UPDATE is blocked unconditionally: no legitimate flow ever modifies a
-- published version row.
--
-- DELETE is blocked UNLESS the owning product_dpp row is already gone. This
-- preserves the legitimate FK cascade (Product -> ProductDpp -> ProductDppVersion,
-- both ON DELETE CASCADE) when an entire product is deleted - by the time the
-- cascade reaches this table, the parent product_dpp row has already been
-- removed within the same transaction, so the EXISTS check below reliably
-- tells a cascade apart from a direct DELETE against a live DPP's history.
CREATE OR REPLACE FUNCTION prevent_product_dpp_version_mutation()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    RAISE EXCEPTION 'product_dpp_versions rows are immutable and cannot be updated (version %, id %)', OLD.version_number, OLD.id;
  ELSIF TG_OP = 'DELETE' THEN
    IF EXISTS (SELECT 1 FROM product_dpp WHERE id = OLD.dpp_id) THEN
      RAISE EXCEPTION 'product_dpp_versions rows cannot be deleted while their DPP still exists (version %, id %)', OLD.version_number, OLD.id;
    END IF;
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_product_dpp_versions_immutable ON product_dpp_versions;

CREATE TRIGGER trg_product_dpp_versions_immutable
BEFORE UPDATE OR DELETE ON product_dpp_versions
FOR EACH ROW
EXECUTE FUNCTION prevent_product_dpp_version_mutation();
