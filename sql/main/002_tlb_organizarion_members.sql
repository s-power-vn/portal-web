CREATE OR REPLACE FUNCTION check_user_organization_access(
    organization_id text, user_id text
)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_id = organization_id
    AND user_id = user_id
  );
$$;

GRANT EXECUTE ON FUNCTION
check_user_organization_access
TO anon, authenticated, org_member, org_operator, org_admin;

ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated to select organization members" ON organization_members;
CREATE POLICY "Allow authenticated to select organization members" ON organization_members
FOR SELECT TO authenticated
USING (
    check_user_organization_access(organization_id, current_user_id())
);

DROP POLICY IF EXISTS "Allow authenticated to insert organization members" ON organization_members;
CREATE POLICY "Allow authenticated to insert organization members" ON organization_members
FOR INSERT TO authenticated
WITH CHECK (current_user_id() IS NOT NULL);