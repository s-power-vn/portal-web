DO $$ 
BEGIN
    DROP TRIGGER IF EXISTS trigger_customer_before_insert ON customers;
    DROP TRIGGER IF EXISTS trigger_customer_before_update ON customers;

    DROP FUNCTION IF EXISTS customer_before_insert() CASCADE;
    DROP FUNCTION IF EXISTS customer_before_update() CASCADE;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error in cleanup: %', SQLERRM;
END $$;

CREATE OR REPLACE FUNCTION customer_before_insert()
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

CREATE OR REPLACE FUNCTION customer_before_update()
RETURNS trigger AS $$
BEGIN

  IF NEW.updated_by IS NULL THEN
    NEW.updated_by := current_user_id();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_customer_before_insert
BEFORE INSERT ON customers
FOR EACH ROW
EXECUTE FUNCTION customer_before_insert();

CREATE TRIGGER trigger_customer_before_update
BEFORE UPDATE ON customers
FOR EACH ROW
EXECUTE FUNCTION customer_before_update();

GRANT EXECUTE ON FUNCTION
  customer_before_insert,
  customer_before_update
TO anon, authenticated, org_member, org_operator, org_admin;

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow org_member to select customers" ON customers;
CREATE POLICY "Allow org_member to select customers" ON customers
FOR SELECT TO org_member
USING (organization_id = current_organization_id());

DROP POLICY IF EXISTS "Allow org_operator to insert customers" ON customers;
CREATE POLICY "Allow org_operator to insert customers" ON customers
FOR INSERT TO org_operator
WITH CHECK (organization_id = current_organization_id());

DROP POLICY IF EXISTS "Allow org_operator to update customers" ON customers;
CREATE POLICY "Allow org_operator to update customers" ON customers
FOR UPDATE TO org_operator
USING (organization_id = current_organization_id());

DROP POLICY IF EXISTS "Allow org_operator to delete customers" ON customers;
CREATE POLICY "Allow org_operator to delete customers" ON customers
FOR DELETE TO org_operator
USING (organization_id = current_organization_id());



