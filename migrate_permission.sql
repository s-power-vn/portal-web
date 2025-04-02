-- Drop all existing policies, roles and functions to ensure clean migration reruns
DO $$ 
DECLARE
    r RECORD;
    policy_tables TEXT[] := ARRAY[
        'organizations', 'organization_members', 'departments', 'customers', 'suppliers', 
        'projects', 'objects', 'object_types', 'issues', 'details', 'requests', 
        'request_details', 'contracts', 'comments', 'detail_imports', 'templates', 
        'materials', 'prices', 'price_details', 'issue_files', 'processes', 
        'msg_teams', 'msg_channels', 'msg_chats', 'msg_messages', 'msg_reactions', 'msg_settings'
    ];
    t TEXT;
BEGIN
    -- Drop all RLS policies
    FOREACH t IN ARRAY policy_tables LOOP
        FOR r IN SELECT policyname FROM pg_policies WHERE tablename = t LOOP
            EXECUTE FORMAT('DROP POLICY IF EXISTS %I ON %I', r.policyname, t);
        END LOOP;
        
        -- Disable RLS
        EXECUTE FORMAT('ALTER TABLE IF EXISTS %I DISABLE ROW LEVEL SECURITY', t);
    END LOOP;
    
    -- Drop helper functions
    DROP FUNCTION IF EXISTS current_user_id();
    DROP FUNCTION IF EXISTS current_organization_id();
    DROP FUNCTION IF EXISTS current_jwt_role();
    
    -- Drop policy creation functions
    DROP FUNCTION IF EXISTS create_select_policy(text);
    DROP FUNCTION IF EXISTS create_insert_policy_for_member(text);
    DROP FUNCTION IF EXISTS create_insert_policy_for_operator(text);
    DROP FUNCTION IF EXISTS create_update_policy_for_member(text);
    DROP FUNCTION IF EXISTS create_update_policy_for_operator(text);
    DROP FUNCTION IF EXISTS create_delete_policy_for_operator(text);
    DROP FUNCTION IF EXISTS create_delete_policy_for_admin(text);
    
    -- Handle role dependencies by revoking memberships first
    BEGIN
        IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'api') THEN
            IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
                REVOKE anon FROM api;
            END IF;
            IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
                REVOKE authenticated FROM api;
            END IF;
            IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'org_admin') THEN
                REVOKE org_admin FROM api;
            END IF;
            IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'org_operator') THEN
                REVOKE org_operator FROM api;
            END IF;
            IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'org_member') THEN
                REVOKE org_member FROM api;
            END IF;
        END IF;
        
        IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'org_operator') AND 
           EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'org_member') THEN
            REVOKE org_member FROM org_operator;
        END IF;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Error revoking role memberships: %', SQLERRM;
    END;
    
    -- Drop roles if they exist
    BEGIN
        DROP ROLE IF EXISTS api;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Could not drop role api: %', SQLERRM;
    END;
    
    BEGIN
        DROP ROLE IF EXISTS anon;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Could not drop role anon: %', SQLERRM;
    END;
    
    BEGIN
        DROP ROLE IF EXISTS authenticated;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Could not drop role authenticated: %', SQLERRM;
    END;
    
    BEGIN
        DROP ROLE IF EXISTS org_member;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Could not drop role org_member: %', SQLERRM;
    END;
    
    BEGIN
        DROP ROLE IF EXISTS org_operator;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Could not drop role org_operator: %', SQLERRM;
    END;
    
    BEGIN
        DROP ROLE IF EXISTS org_admin;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Could not drop role org_admin: %', SQLERRM;
    END;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error in cleanup: %', SQLERRM;
END $$;

-- Re-enable RLS for all tables
DO $$
DECLARE
    policy_tables TEXT[] := ARRAY[
        'organizations', 'organization_members', 'departments', 'customers', 'suppliers', 
        'projects', 'objects', 'object_types', 'issues', 'details', 'requests', 
        'request_details', 'contracts', 'comments', 'detail_imports', 'templates', 
        'materials', 'prices', 'price_details', 'issue_files', 'processes', 
        'msg_teams', 'msg_channels', 'msg_chats', 'msg_messages', 'msg_reactions', 'msg_settings'
    ];
    t TEXT;
BEGIN
    -- Enable RLS
    FOREACH t IN ARRAY policy_tables LOOP
        EXECUTE FORMAT('ALTER TABLE IF EXISTS %I ENABLE ROW LEVEL SECURITY', t);
    END LOOP;
END $$;

-- Grant permissions for PostgREST with JWT containing email, org_id, and role

-- 1. Tạo role cho các loại người dùng nếu chưa tồn tại
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
    
    -- 2. Tạo database user cho PostgREST service nếu chưa tồn tại
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'api') THEN
        CREATE ROLE api WITH LOGIN PASSWORD 'Aa123456@@' NOINHERIT;
    END IF;
END $$;

-- 3. Cấp quyền vào các role 
DO $$
BEGIN
    -- Check if api already has these roles granted and only grant if not
    PERFORM 1 FROM pg_auth_members m
             JOIN pg_roles r1 ON m.roleid = r1.oid
             JOIN pg_roles r2 ON m.member = r2.oid
             WHERE r1.rolname = 'anon' AND r2.rolname = 'api';
    IF NOT FOUND THEN
        GRANT anon TO api;
    END IF;
    
    PERFORM 1 FROM pg_auth_members m
             JOIN pg_roles r1 ON m.roleid = r1.oid
             JOIN pg_roles r2 ON m.member = r2.oid
             WHERE r1.rolname = 'authenticated' AND r2.rolname = 'api';
    IF NOT FOUND THEN
        GRANT authenticated TO api;
    END IF;
    
    PERFORM 1 FROM pg_auth_members m
             JOIN pg_roles r1 ON m.roleid = r1.oid
             JOIN pg_roles r2 ON m.member = r2.oid
             WHERE r1.rolname = 'org_admin' AND r2.rolname = 'api';
    IF NOT FOUND THEN
        GRANT org_admin TO api;
    END IF;
    
    PERFORM 1 FROM pg_auth_members m
             JOIN pg_roles r1 ON m.roleid = r1.oid
             JOIN pg_roles r2 ON m.member = r2.oid
             WHERE r1.rolname = 'org_operator' AND r2.rolname = 'api';
    IF NOT FOUND THEN
        GRANT org_operator TO api;
    END IF;
    
    PERFORM 1 FROM pg_auth_members m
             JOIN pg_roles r1 ON m.roleid = r1.oid
             JOIN pg_roles r2 ON m.member = r2.oid
             WHERE r1.rolname = 'org_member' AND r2.rolname = 'api';
    IF NOT FOUND THEN
        GRANT org_member TO api;
    END IF;
END $$;

-- 3.5. Bật Row Level Security cho các bảng
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE object_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE details ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE detail_imports ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE issue_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE processes ENABLE ROW LEVEL SECURITY;
ALTER TABLE msg_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE msg_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE msg_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE msg_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE msg_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE msg_settings ENABLE ROW LEVEL SECURITY;

-- 4. Cấp quyền basic cho role anon (không đăng nhập)
DO $$
BEGIN
    -- Chỉ giữ quyền USAGE cơ bản nhất
    GRANT USAGE ON SCHEMA public TO anon;
    
    -- 5. Cấp quyền cho role authenticated (đã đăng nhập nhưng chưa vào org)
    GRANT USAGE ON SCHEMA public TO authenticated;
    GRANT SELECT, INSERT ON TABLE organizations TO authenticated;
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
    
    -- 6. Cấp quyền cho role org_member (quyền thấp nhất)
    GRANT USAGE ON SCHEMA public TO org_member;
    GRANT SELECT ON ALL TABLES IN SCHEMA public TO org_member;
    
    -- INSERT quyền cho các bảng mà org_member có thể thêm mới
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
    
    -- 7. Cấp quyền cho role org_operator (quyền vận hành)
    GRANT USAGE ON SCHEMA public TO org_operator;
    GRANT SELECT ON ALL TABLES IN SCHEMA public TO org_operator;
    
    -- Kế thừa tất cả quyền từ org_member
    PERFORM 1 FROM pg_auth_members m
             JOIN pg_roles r1 ON m.roleid = r1.oid
             JOIN pg_roles r2 ON m.member = r2.oid
             WHERE r1.rolname = 'org_member' AND r2.rolname = 'org_operator';
    IF NOT FOUND THEN
        GRANT org_member TO org_operator;
    END IF;
    
    -- Thêm quyền cho các bảng mà org_operator có thể quản lý
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
    
    -- 8. Cấp quyền cho role org_admin (quyền cao nhất)
    GRANT USAGE ON SCHEMA public TO org_admin;
    GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO org_admin;
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO org_admin;
END $$;

-- 9. Tạo các helper function để làm việc với JWT claims

-- Lấy user_id từ email trong JWT
CREATE OR REPLACE FUNCTION current_user_id() RETURNS uuid AS $$
DECLARE
  user_email text;
  user_id uuid;
BEGIN
  user_email := current_setting('request.jwt.claims', true)::json->>'email';
  IF user_email IS NULL THEN
    RETURN NULL;
  END IF;
  
  SELECT id INTO user_id FROM users WHERE email = user_email;
  RETURN user_id;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Lấy organization_id trực tiếp từ JWT
CREATE OR REPLACE FUNCTION current_organization_id() RETURNS uuid AS $$
BEGIN
  RETURN (current_setting('request.jwt.claims', true)::json->>'org_id')::uuid;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Lấy role trực tiếp từ JWT
CREATE OR REPLACE FUNCTION current_jwt_role() RETURNS text AS $$
BEGIN
  RETURN current_setting('request.jwt.claims', true)::json->>'role';
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 10. Tạo các function để tạo policy tự động

-- Template chung cho policy SELECT - áp dụng cho tất cả các bảng có organization_id
CREATE OR REPLACE FUNCTION create_select_policy(table_name text) RETURNS void AS $$
BEGIN
  EXECUTE format('
    CREATE POLICY select_%I ON %I
    FOR SELECT 
    USING (organization_id = current_organization_id());
  ', table_name, table_name);
END;
$$ LANGUAGE plpgsql;

-- Template chung cho policy INSERT của org_member
CREATE OR REPLACE FUNCTION create_insert_policy_for_member(table_name text) RETURNS void AS $$
BEGIN
  EXECUTE format('
    CREATE POLICY insert_%I_member ON %I
    FOR INSERT 
    WITH CHECK (
      organization_id = current_organization_id() AND
      current_jwt_role() IN (''org_member'', ''org_operator'', ''org_admin'')
    );
  ', table_name, table_name);
END;
$$ LANGUAGE plpgsql;

-- Template chung cho policy INSERT của org_operator
CREATE OR REPLACE FUNCTION create_insert_policy_for_operator(table_name text) RETURNS void AS $$
BEGIN
  EXECUTE format('
    CREATE POLICY insert_%I_operator ON %I
    FOR INSERT 
    WITH CHECK (
      organization_id = current_organization_id() AND
      current_jwt_role() IN (''org_operator'', ''org_admin'')
    );
  ', table_name, table_name);
END;
$$ LANGUAGE plpgsql;

-- Template chung cho policy UPDATE của org_member
CREATE OR REPLACE FUNCTION create_update_policy_for_member(table_name text) RETURNS void AS $$
BEGIN
  EXECUTE format('
    CREATE POLICY update_%I_member ON %I
    FOR UPDATE 
    USING (
      organization_id = current_organization_id() AND
      current_jwt_role() IN (''org_member'', ''org_operator'', ''org_admin'')
    );
  ', table_name, table_name);
END;
$$ LANGUAGE plpgsql;

-- Template chung cho policy UPDATE của org_operator
CREATE OR REPLACE FUNCTION create_update_policy_for_operator(table_name text) RETURNS void AS $$
BEGIN
  EXECUTE format('
    CREATE POLICY update_%I_operator ON %I
    FOR UPDATE 
    USING (
      organization_id = current_organization_id() AND
      current_jwt_role() IN (''org_operator'', ''org_admin'')
    );
  ', table_name, table_name);
END;
$$ LANGUAGE plpgsql;

-- Template chung cho policy DELETE của org_operator
CREATE OR REPLACE FUNCTION create_delete_policy_for_operator(table_name text) RETURNS void AS $$
BEGIN
  EXECUTE format('
    CREATE POLICY delete_%I_operator ON %I
    FOR DELETE 
    USING (
      organization_id = current_organization_id() AND
      current_jwt_role() IN (''org_operator'', ''org_admin'')
    );
  ', table_name, table_name);
END;
$$ LANGUAGE plpgsql;

-- Template chung cho policy DELETE của org_admin
CREATE OR REPLACE FUNCTION create_delete_policy_for_admin(table_name text) RETURNS void AS $$
BEGIN
  EXECUTE format('
    CREATE POLICY delete_%I_admin ON %I
    FOR DELETE 
    USING (
      organization_id = current_organization_id() AND
      current_jwt_role() = ''org_admin''
    );
  ', table_name, table_name);
END;
$$ LANGUAGE plpgsql;

-- 11. Áp dụng policy cho từng bảng

-- Tất cả các bảng đều có policy SELECT chung
SELECT create_select_policy('departments');
SELECT create_select_policy('customers');
SELECT create_select_policy('suppliers');
SELECT create_select_policy('projects');
SELECT create_select_policy('objects');
SELECT create_select_policy('object_types');
SELECT create_select_policy('issues');
SELECT create_select_policy('details');
SELECT create_select_policy('requests');
SELECT create_select_policy('request_details');
SELECT create_select_policy('contracts');
SELECT create_select_policy('comments');
SELECT create_select_policy('detail_imports');
SELECT create_select_policy('templates');
SELECT create_select_policy('materials');
SELECT create_select_policy('prices');
SELECT create_select_policy('price_details');
SELECT create_select_policy('issue_files');
SELECT create_select_policy('processes');
SELECT create_select_policy('msg_teams');
SELECT create_select_policy('msg_channels');
SELECT create_select_policy('msg_chats');
SELECT create_select_policy('msg_messages');
SELECT create_select_policy('msg_reactions');
SELECT create_select_policy('msg_settings');

-- Áp dụng policy INSERT/UPDATE cho các bảng mà org_member có thể thao tác
SELECT create_insert_policy_for_member('comments');
SELECT create_insert_policy_for_member('contracts');
SELECT create_insert_policy_for_member('details');
SELECT create_insert_policy_for_member('detail_imports');
SELECT create_insert_policy_for_member('issues');
SELECT create_insert_policy_for_member('issue_files');
SELECT create_insert_policy_for_member('msg_chats');
SELECT create_insert_policy_for_member('msg_messages');
SELECT create_insert_policy_for_member('msg_reactions');
SELECT create_insert_policy_for_member('msg_settings');
SELECT create_insert_policy_for_member('prices');
SELECT create_insert_policy_for_member('price_details');
SELECT create_insert_policy_for_member('requests');
SELECT create_insert_policy_for_member('request_details');
SELECT create_insert_policy_for_member('templates');

SELECT create_update_policy_for_member('comments');
SELECT create_update_policy_for_member('contracts');
SELECT create_update_policy_for_member('details');
SELECT create_update_policy_for_member('detail_imports');
SELECT create_update_policy_for_member('issues');
SELECT create_update_policy_for_member('issue_files');
SELECT create_update_policy_for_member('msg_chats');
SELECT create_update_policy_for_member('msg_messages');
SELECT create_update_policy_for_member('msg_reactions');
SELECT create_update_policy_for_member('msg_settings');
SELECT create_update_policy_for_member('prices');
SELECT create_update_policy_for_member('price_details');
SELECT create_update_policy_for_member('requests');
SELECT create_update_policy_for_member('request_details');
SELECT create_update_policy_for_member('templates');

-- Áp dụng policy INSERT/UPDATE/DELETE cho các bảng mà org_operator có thể thao tác
SELECT create_insert_policy_for_operator('customers');
SELECT create_insert_policy_for_operator('departments');
SELECT create_insert_policy_for_operator('materials');
SELECT create_insert_policy_for_operator('suppliers');
SELECT create_insert_policy_for_operator('msg_channels');
SELECT create_insert_policy_for_operator('msg_teams');
SELECT create_insert_policy_for_operator('object_types');
SELECT create_insert_policy_for_operator('objects');
SELECT create_insert_policy_for_operator('processes');
SELECT create_insert_policy_for_operator('projects');

SELECT create_update_policy_for_operator('customers');
SELECT create_update_policy_for_operator('departments');
SELECT create_update_policy_for_operator('materials');
SELECT create_update_policy_for_operator('suppliers');
SELECT create_update_policy_for_operator('msg_channels');
SELECT create_update_policy_for_operator('msg_teams');
SELECT create_update_policy_for_operator('object_types');
SELECT create_update_policy_for_operator('objects');
SELECT create_update_policy_for_operator('processes');
SELECT create_update_policy_for_operator('projects');

SELECT create_delete_policy_for_operator('customers');
SELECT create_delete_policy_for_operator('departments');
SELECT create_delete_policy_for_operator('materials');
SELECT create_delete_policy_for_operator('suppliers');
SELECT create_delete_policy_for_operator('msg_channels');
SELECT create_delete_policy_for_operator('msg_teams');
SELECT create_delete_policy_for_operator('object_types');
SELECT create_delete_policy_for_operator('objects');
SELECT create_delete_policy_for_operator('processes');
SELECT create_delete_policy_for_operator('projects');

-- Policy đặc biệt cho organizations
CREATE POLICY select_organizations ON organizations
    FOR SELECT 
    USING (
        -- Chỉ thấy org mình tạo hoặc được invite
        created_by = current_user_id()
        OR EXISTS (
            SELECT 1 FROM organization_members 
            WHERE organization_id = organizations.id 
            AND user_id = current_user_id()
        )
    );

CREATE POLICY insert_organizations ON organizations
    FOR INSERT 
    WITH CHECK (
        current_jwt_role() = 'authenticated'  -- Chỉ cần authenticated
        AND created_by = current_user_id()    -- Và phải set created_by là chính mình
    );

CREATE POLICY update_organizations ON organizations
    FOR UPDATE 
    USING (id = current_organization_id() AND current_jwt_role() = 'org_admin');

CREATE POLICY delete_organizations ON organizations
    FOR DELETE 
    USING (id = current_organization_id() AND current_jwt_role() = 'org_admin');

-- Policy đặc biệt cho organization_members
CREATE POLICY select_org_members ON organization_members 
    FOR SELECT 
    USING (organization_id = current_organization_id());

CREATE POLICY insert_org_members ON organization_members 
    FOR INSERT 
    WITH CHECK (
        organization_id = current_organization_id() AND
        current_jwt_role() = 'org_admin'
    );

CREATE POLICY update_org_members ON organization_members 
    FOR UPDATE 
    USING (
        organization_id = current_organization_id() AND
        current_jwt_role() = 'org_admin'
    );

CREATE POLICY delete_org_members ON organization_members 
    FOR DELETE 
    USING (
        organization_id = current_organization_id() AND
        current_jwt_role() = 'org_admin'
    );

-- Policy đặc biệt cho msg_messages (không có organization_id)
-- Lấy organization_id qua liên kết với bảng msg_chats
-- REMOVE OLD COMPLEX POLICIES FOR msg_messages

-- Policy đặc biệt cho msg_reactions (không có organization_id)
-- Lấy organization_id qua liên kết với bảng msg_messages và msg_chats
-- REMOVE OLD COMPLEX POLICIES FOR msg_reactions

-- 12. Cấp quyền thực thi các function
GRANT EXECUTE ON FUNCTION 
    current_user_id, 
    current_organization_id, 
    current_jwt_role, 
    create_select_policy,
    create_insert_policy_for_member,
    create_insert_policy_for_operator,
    create_update_policy_for_member, 
    create_update_policy_for_operator,
    create_delete_policy_for_operator,
    create_delete_policy_for_admin
TO anon, authenticated, org_member, org_operator, org_admin;
