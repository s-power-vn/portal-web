DO $$ 
BEGIN
    DROP TRIGGER IF EXISTS trigger_organization_before_insert ON organizations;
    DROP TRIGGER IF EXISTS trigger_organization_after_insert ON organizations;

    DROP FUNCTION IF EXISTS organization_before_insert() CASCADE;
    DROP FUNCTION IF EXISTS organization_after_insert() CASCADE;

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error in cleanup: %', SQLERRM;
END $$;

CREATE OR REPLACE FUNCTION organization_before_insert()
RETURNS trigger AS $$
BEGIN
  IF NEW.created_by IS NULL THEN
    NEW.created_by := current_user_id();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION organization_after_insert()
RETURNS trigger AS $$
BEGIN
  INSERT INTO organization_members (
    id,
    organization_id,
    user_id,
    role,
    created,
    created_by
  ) VALUES (
    generate_nanoid(),
    NEW.id,
    current_user_id(),
    'org_admin',
    CURRENT_TIMESTAMP,
    current_user_id()
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_organization_before_insert
BEFORE INSERT ON organizations
FOR EACH ROW
EXECUTE FUNCTION organization_before_insert();

CREATE TRIGGER trigger_organization_after_insert
AFTER INSERT ON organizations
FOR EACH ROW
EXECUTE FUNCTION organization_after_insert();

GRANT EXECUTE ON FUNCTION
  organization_before_insert,
  organization_after_insert
TO anon, authenticated, org_member, org_operator, org_admin;

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated to select organizations" ON organizations;
CREATE POLICY "Allow authenticated to select organizations" ON organizations
FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM organization_members
        WHERE
            organization_members.organization_id = organizations.id
            AND organization_members.user_id = current_user_id()
    )
);

DROP POLICY IF EXISTS "Allow authenticated to insert organizations" ON organizations;
CREATE POLICY "Allow authenticated to insert organizations" ON organizations
FOR INSERT TO authenticated
WITH CHECK (current_user_id() IS NOT NULL);

