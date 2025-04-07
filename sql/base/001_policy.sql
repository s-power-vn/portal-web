DO $$ 
BEGIN
    DROP FUNCTION IF EXISTS current_user_id() CASCADE;
    DROP FUNCTION IF EXISTS current_organization_id() CASCADE;
    DROP FUNCTION IF EXISTS current_jwt_role() CASCADE;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error in cleanup: %', SQLERRM;
END $$;

DO $$
BEGIN
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

DO $$
BEGIN
    GRANT anon TO authenticated;
    GRANT authenticated TO org_member;
    GRANT org_member TO org_operator;
    GRANT org_operator TO org_admin;
END $$;

CREATE OR REPLACE FUNCTION current_user_id() RETURNS text AS $$
BEGIN
  RETURN (current_setting('request.jwt.claims', true)::json->>'user_id')::text;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION current_organization_id() RETURNS text AS $$
BEGIN
  RETURN (current_setting('request.jwt.claims', true)::json->>'organization_id')::text;
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

GRANT EXECUTE ON FUNCTION
  current_user_id,
  current_organization_id,
  current_jwt_role
TO anon, authenticated, org_member, org_operator, org_admin;


