-- Drop all existing policies, roles and functions to ensure clean migration reruns
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- First drop trigger to avoid dependency issues
    DROP TRIGGER IF EXISTS trigger_set_organization_creator ON organizations;

    -- Then drop helper functions
    DROP FUNCTION IF EXISTS current_user_id() CASCADE;
    DROP FUNCTION IF EXISTS current_organization_id() CASCADE;
    DROP FUNCTION IF EXISTS current_jwt_role() CASCADE;
    DROP FUNCTION IF EXISTS set_organization_creator() CASCADE;
    
    -- Handle existing permissions
    BEGIN
        EXECUTE 'REVOKE org_member FROM org_operator';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Error handling existing permissions: %', SQLERRM;
    END;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error in cleanup: %', SQLERRM;
END $$;

-- Create roles for different user types
DO $$
BEGIN
    -- Create roles only if they don't exist
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
        CREATE ROLE anon NOLOGIN;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
        CREATE ROLE authenticated NOLOGIN;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'org_admin') THEN
        CREATE ROLE org_admin NOLOGIN;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'org_operator') THEN
        CREATE ROLE org_operator NOLOGIN;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'org_member') THEN
        CREATE ROLE org_member NOLOGIN;
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating roles: %', SQLERRM;
END $$;

-- Set up role hierarchy
DO $$
BEGIN
    GRANT anon TO authenticated;
    GRANT authenticated TO org_member;
    GRANT org_member TO org_operator;
    GRANT org_operator TO org_admin;
END $$;

-- Grant basic permissions
DO $$
BEGIN
    -- Basic permissions for anon
    GRANT USAGE ON SCHEMA public TO anon;
    
    -- Permissions for authenticated
    GRANT USAGE ON SCHEMA public TO authenticated;
    GRANT SELECT, INSERT ON TABLE organizations TO authenticated;
    GRANT SELECT, INSERT ON TABLE organization_members TO authenticated;
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
    
    -- Permissions for org_member
    GRANT USAGE ON SCHEMA public TO org_member;
    GRANT SELECT ON ALL TABLES IN SCHEMA public TO org_member;
    GRANT INSERT, UPDATE ON TABLE 
        comments, 
        contracts, 
        details, 
        detail_imports, 
        issues, 
        issue_files, 
        msg_chats, 
        msg_messages, 
        msg_reactions, 
        msg_settings, 
        prices, 
        price_details, 
        requests, 
        request_details, 
        templates
    TO org_member;
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO org_member;
    
    -- Permissions for org_operator
    GRANT USAGE ON SCHEMA public TO org_operator;
    GRANT SELECT ON ALL TABLES IN SCHEMA public TO org_operator;
    GRANT org_member TO org_operator;
    GRANT INSERT, UPDATE, DELETE ON TABLE 
        customers, 
        departments, 
        materials, 
        suppliers, 
        msg_channels, 
        msg_teams, 
        object_types, 
        objects, 
        processes, 
        projects
    TO org_operator;
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO org_operator;
    
    -- Permissions for org_admin
    GRANT USAGE ON SCHEMA public TO org_admin;
    GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO org_admin;
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO org_admin;
END $$;

-- Helper functions for JWT claims
CREATE OR REPLACE FUNCTION current_user_id() RETURNS uuid AS $$
BEGIN
  RETURN (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION current_organization_id() RETURNS uuid AS $$
BEGIN
  RETURN (current_setting('request.jwt.claims', true)::json->>'org_id')::uuid;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION current_jwt_role() RETURNS text AS $$
BEGIN
  RETURN current_setting('request.jwt.claims', true)::json->>'role';
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function for setting organization creator
CREATE OR REPLACE FUNCTION set_organization_creator() 
RETURNS TRIGGER AS $$
BEGIN
  -- Set created_by if not set
  IF NEW.created_by IS NULL THEN
    NEW.created_by := current_user_id();
  END IF;
  
  -- Insert into organization_members
  INSERT INTO organization_members (
    id,
    organization_id,
    user_id,
    role,
    created
  ) VALUES (
    gen_random_uuid(),
    NEW.id,
    current_user_id(),
    'org_admin',
    CURRENT_TIMESTAMP
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for setting organization creator
CREATE TRIGGER trigger_set_organization_creator
  AFTER INSERT ON organizations
  FOR EACH ROW
  WHEN (current_jwt_role() = 'authenticated')
  EXECUTE FUNCTION set_organization_creator();

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION 
    current_user_id, 
    current_organization_id, 
    current_jwt_role
TO anon, authenticated, org_member, org_operator, org_admin;

GRANT EXECUTE ON FUNCTION set_organization_creator() TO authenticated, org_admin;

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

-- Start policy cho role authenticated
DROP POLICY IF EXISTS authenticated_select_organizations ON organizations;
CREATE POLICY authenticated_select_organizations ON organizations
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_members.organization_id = organizations.id
    AND organization_members.user_id = current_user_id()
  )
);

DROP POLICY IF EXISTS authenticated_insert_organizations ON organizations;
CREATE POLICY authenticated_insert_organizations ON organizations
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE OR REPLACE FUNCTION check_user_organization_access(organization_id uuid, user_id uuid)
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

DROP POLICY IF EXISTS authenticated_select_organization_members ON organization_members;
CREATE POLICY authenticated_select_organization_members ON organization_members
FOR SELECT TO authenticated
USING (
  check_user_organization_access(organization_id, current_user_id())
);

DROP POLICY IF EXISTS authenticated_insert_organization_members ON organization_members;
CREATE POLICY authenticated_insert_organization_members ON organization_members
FOR INSERT TO authenticated
WITH CHECK (true);
-- End policy cho role authenticated
