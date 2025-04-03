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
        -- First revoke all grants from api by postgres
        REVOKE ALL ON ALL TABLES IN SCHEMA public FROM api;
        REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM api;
        REVOKE ALL ON SCHEMA public FROM api;
        
        -- Revoke role memberships granted by postgres
        EXECUTE 'REVOKE org_member FROM org_operator';
        EXECUTE 'REVOKE anon FROM api';
        EXECUTE 'REVOKE authenticated FROM api';
        EXECUTE 'REVOKE org_admin FROM api';
        EXECUTE 'REVOKE org_operator FROM api';
        EXECUTE 'REVOKE org_member FROM api';
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
    
    -- Create database user for PostgREST service if not exists
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'api') THEN
        CREATE ROLE api WITH LOGIN PASSWORD 'Aa123456@@' NOINHERIT;
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating roles: %', SQLERRM;
END $$;

-- Grant role memberships
DO $$
BEGIN
    GRANT anon TO api;
    GRANT authenticated TO api;
    GRANT org_admin TO api;
    GRANT org_operator TO api;
    GRANT org_member TO api;
END $$;

-- Grant basic permissions
DO $$
BEGIN
    -- Basic permissions for anon
    GRANT USAGE ON SCHEMA public TO anon;
    
    -- Permissions for authenticated
    GRANT USAGE ON SCHEMA public TO authenticated;
    GRANT SELECT, INSERT ON TABLE organizations TO authenticated;
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
  IF current_jwt_role() = 'authenticated' AND NEW.created_by IS NULL THEN
    NEW.created_by := current_user_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for setting organization creator
CREATE TRIGGER trigger_set_organization_creator
  BEFORE INSERT ON organizations
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
