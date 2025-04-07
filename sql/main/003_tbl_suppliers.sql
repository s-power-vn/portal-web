DO $$ 
BEGIN
    DROP TRIGGER IF EXISTS trigger_supplier_before_insert ON suppliers;
    DROP TRIGGER IF EXISTS trigger_supplier_before_update ON suppliers;

    DROP FUNCTION IF EXISTS supplier_before_insert() CASCADE;
    DROP FUNCTION IF EXISTS supplier_before_update() CASCADE;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error in cleanup: %', SQLERRM;
END $$;

CREATE OR REPLACE FUNCTION supplier_before_insert()
RETURNS trigger AS $$
BEGIN

  IF NEW.organization_id IS NULL THEN
    NEW.organization_id := current_organization_id();
  END IF;

  IF NEW.created_by IS NULL THEN
    NEW.created_by := current_user_id();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION supplier_before_update()
RETURNS trigger AS $$
BEGIN

  IF NEW.updated_by IS NULL THEN
    NEW.updated_by := current_user_id();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_supplier_before_insert
BEFORE INSERT ON suppliers
FOR EACH ROW
EXECUTE FUNCTION supplier_before_insert();

CREATE TRIGGER trigger_supplier_before_update
BEFORE UPDATE ON suppliers
FOR EACH ROW
EXECUTE FUNCTION supplier_before_update();

GRANT EXECUTE ON FUNCTION
  supplier_before_insert,
  supplier_before_update
TO anon, authenticated, org_member, org_operator, org_admin;

ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow org_member to select suppliers" ON suppliers;
CREATE POLICY "Allow org_member to select suppliers" ON suppliers
FOR SELECT TO org_member
USING (organization_id = current_organization_id());

DROP POLICY IF EXISTS "Allow org_operator to insert suppliers" ON suppliers;
CREATE POLICY "Allow org_operator to insert suppliers" ON suppliers
FOR INSERT TO org_operator
WITH CHECK (organization_id = current_organization_id());

DROP POLICY IF EXISTS "Allow org_operator to update suppliers" ON suppliers;
CREATE POLICY "Allow org_operator to update suppliers" ON suppliers
FOR UPDATE TO org_operator
USING (organization_id = current_organization_id());

DROP POLICY IF EXISTS "Allow org_operator to delete suppliers" ON suppliers;
CREATE POLICY "Allow org_operator to delete suppliers" ON suppliers
FOR DELETE TO org_operator
USING (organization_id = current_organization_id());



