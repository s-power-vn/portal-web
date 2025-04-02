-- Drop all existing policies, roles and functions to ensure clean migration reruns
DO $$ 
DECLARE
    r RECORD;
    policy_tables TEXT[] := ARRAY[
        'organizations', 'organization_members', 'departments', 'customers', 'suppliers', 
        'projects', 'objects', 'object_types', 'issues', 'details', 'requests', 
        'request_details', 'contracts', 'comments', 'detail_imports', 'templates', 
        'materials', 'prices', 'price_details', 'issue_files', 'processes', 
        'msg_teams', 'msg_channels', 'msg_chats', 'msg_messages', 'msg_reactions', 'msg_settings',
        'users'
    ];
    t TEXT;
BEGIN
    -- Drop all RLS policies
    FOREACH t IN ARRAY policy_tables LOOP
        FOR r IN SELECT policyname FROM pg_policies WHERE tablename = t LOOP
            EXECUTE FORMAT('DROP POLICY IF EXISTS %I ON %I', r.policyname, t);
        END LOOP;
        
        -- Ensure RLS is enabled
        EXECUTE FORMAT('ALTER TABLE IF EXISTS %I ENABLE ROW LEVEL SECURITY', t);
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
        'msg_teams', 'msg_channels', 'msg_chats', 'msg_messages', 'msg_reactions', 'msg_settings',
        'users'
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

-- Function để tự động set created_by cho organizations
CREATE OR REPLACE FUNCTION set_organization_creator() 
RETURNS TRIGGER AS $$
BEGIN
  -- Chỉ thực hiện nếu role là authenticated và created_by chưa được set (hoặc NULL)
  -- Điều này cho phép admin tạo org với created_by khác nếu cần (ít xảy ra)
  IF current_jwt_role() = 'authenticated' AND NEW.created_by IS NULL THEN
    NEW.created_by := current_user_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Lấy user_id từ email trong JWT
CREATE OR REPLACE FUNCTION current_user_id() RETURNS uuid AS $$
BEGIN
  RETURN (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid;
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

-- Áp dụng policy cho roles theo yêu cầu

-- POLICY CHO ROLE authenticated

-- Trigger để tự động set created_by khi tạo organization
DROP TRIGGER IF EXISTS trigger_set_organization_creator ON organizations;
CREATE TRIGGER trigger_set_organization_creator
  BEFORE INSERT ON organizations
  FOR EACH ROW
  -- Trigger chỉ nên chạy khi role là authenticated để không ảnh hưởng đến các role khác nếu họ tạo org
  WHEN (current_jwt_role() = 'authenticated') 
  EXECUTE FUNCTION set_organization_creator();

-- Có quyền tạo organization (tự động thêm created_by từ claim)
CREATE POLICY insert_organizations_authenticated ON organizations
    FOR INSERT 
    WITH CHECK (
        current_jwt_role() = 'authenticated'
    );

-- Chỉ list được các organization mà user tạo hoặc được invite
CREATE POLICY select_organizations_authenticated ON organizations
    FOR SELECT 
    USING (
        created_by = current_user_id() OR
        EXISTS (
            SELECT 1 FROM organization_members 
            WHERE organization_id = organizations.id 
            AND user_id = current_user_id()
        )
    );

-- Policy cho org_member, org_operator, org_admin xem organization hiện tại
CREATE POLICY select_organizations_member ON organizations
    FOR SELECT 
    USING (
        id = current_organization_id() AND
        current_jwt_role() IN ('org_member', 'org_operator', 'org_admin')
    );

-- POLICY CHO ROLE org_member
-- Có quyền SELECT trên tất cả các bảng trong organization
SELECT create_select_policy('organization_members');
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

-- Có quyền INSERT/UPDATE với các bảng quy định
SELECT create_insert_policy_for_member('comments');
SELECT create_insert_policy_for_member('contracts');
SELECT create_insert_policy_for_member('details');
SELECT create_insert_policy_for_member('detail_imports');
SELECT create_insert_policy_for_member('issues');
SELECT create_insert_policy_for_member('issue_files');
SELECT create_insert_policy_for_member('msg_chats');
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
SELECT create_update_policy_for_member('msg_settings');
SELECT create_update_policy_for_member('prices');
SELECT create_update_policy_for_member('price_details');
SELECT create_update_policy_for_member('requests');
SELECT create_update_policy_for_member('request_details');
SELECT create_update_policy_for_member('templates');

-- POLICY CHO ROLE org_operator
-- Kế thừa tất cả quyền của org_member
-- Có thêm quyền INSERT/UPDATE/DELETE với các bảng quy định
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

-- POLICY CHO ROLE org_admin
-- Kế thừa tất cả quyền của org_operator
-- Có quyền UPDATE/DELETE organization và toàn bộ dữ liệu liên quan
CREATE POLICY update_organizations_admin ON organizations
    FOR UPDATE 
    USING (
        id = current_organization_id() AND 
        current_jwt_role() = 'org_admin'
    );

-- Policy cho user - cho phép mọi người đọc users, nhưng chỉ update thông tin của chính mình
CREATE POLICY select_users ON users
    FOR SELECT 
    USING (true);

CREATE POLICY update_users ON users
    FOR UPDATE 
    USING (
        id = current_user_id()
    );

-- Không ai có quyền xóa user trực tiếp
CREATE POLICY delete_users ON users
    FOR DELETE 
    USING (false);

CREATE POLICY delete_organizations_admin ON organizations
    FOR DELETE 
    USING (
        id = current_organization_id() AND 
        current_jwt_role() = 'org_admin' AND
        (created_by = current_user_id() OR 
         EXISTS (
            SELECT 1 FROM organization_members 
            WHERE organization_id = organizations.id 
            AND user_id = current_user_id() 
            AND role = 'org_admin'
         ))
    );

-- Quyền đặc biệt cho organization_members
CREATE POLICY insert_org_members_admin ON organization_members 
    FOR INSERT 
    WITH CHECK (
        organization_id = current_organization_id() AND
        current_jwt_role() = 'org_admin'
    );

CREATE POLICY update_org_members_admin ON organization_members 
    FOR UPDATE 
    USING (
        organization_id = current_organization_id() AND
        current_jwt_role() = 'org_admin'
    );

CREATE POLICY delete_org_members_admin ON organization_members 
    FOR DELETE 
    USING (
        organization_id = current_organization_id() AND
        current_jwt_role() = 'org_admin'
    );

-- Áp dụng policy DELETE cho tất cả các bảng cho org_admin
SELECT create_delete_policy_for_admin('comments');
SELECT create_delete_policy_for_admin('contracts');
SELECT create_delete_policy_for_admin('details');
SELECT create_delete_policy_for_admin('detail_imports');
SELECT create_delete_policy_for_admin('issues');
SELECT create_delete_policy_for_admin('issue_files');
SELECT create_delete_policy_for_admin('msg_chats');
SELECT create_delete_policy_for_admin('msg_messages');
SELECT create_delete_policy_for_admin('msg_reactions');
SELECT create_delete_policy_for_admin('msg_settings');
SELECT create_delete_policy_for_admin('prices');
SELECT create_delete_policy_for_admin('price_details');
SELECT create_delete_policy_for_admin('requests');
SELECT create_delete_policy_for_admin('request_details');
SELECT create_delete_policy_for_admin('templates');

-- Policy đặc biệt cho msg_messages (không có organization_id)
-- Thay thế policy mặc định bằng policy dựa trên liên kết với msg_chats
DROP POLICY IF EXISTS select_msg_messages ON msg_messages;
CREATE POLICY select_msg_messages ON msg_messages
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM msg_chats 
            WHERE msg_chats.id = msg_messages.chat
            AND msg_chats.organization_id = current_organization_id()
        ) OR organization_id = current_organization_id()
    );

CREATE POLICY insert_msg_messages_member ON msg_messages
    FOR INSERT 
    WITH CHECK (
        organization_id = current_organization_id() AND
        current_jwt_role() IN ('org_member', 'org_operator', 'org_admin') AND
        EXISTS (
            SELECT 1 FROM msg_chats 
            WHERE msg_chats.id = chat
            AND msg_chats.organization_id = current_organization_id()
        )
    );

CREATE POLICY update_msg_messages_member ON msg_messages
    FOR UPDATE 
    USING (
        organization_id = current_organization_id() AND
        current_jwt_role() IN ('org_member', 'org_operator', 'org_admin') AND
        sender = current_user_id()
    );

-- Policy đặc biệt cho msg_reactions (không có organization_id)
-- Thay thế policy mặc định bằng policy dựa trên liên kết với msg_messages và msg_chats
DROP POLICY IF EXISTS select_msg_reactions ON msg_reactions;
CREATE POLICY select_msg_reactions ON msg_reactions
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM msg_messages
            JOIN msg_chats ON msg_chats.id = msg_messages.chat
            WHERE msg_messages.id = msg_reactions.message
            AND msg_chats.organization_id = current_organization_id()
        ) OR organization_id = current_organization_id() 
    );

CREATE POLICY insert_msg_reactions_member ON msg_reactions
    FOR INSERT 
    WITH CHECK (
        organization_id = current_organization_id() AND
        current_jwt_role() IN ('org_member', 'org_operator', 'org_admin') AND
        EXISTS (
            SELECT 1 FROM msg_messages
            JOIN msg_chats ON msg_chats.id = msg_messages.chat
            WHERE msg_messages.id = message
            AND msg_chats.organization_id = current_organization_id()
        )
    );

CREATE POLICY update_msg_reactions_member ON msg_reactions
    FOR UPDATE 
    USING (
        organization_id = current_organization_id() AND
        current_jwt_role() IN ('org_member', 'org_operator', 'org_admin') AND
        "user" = current_user_id()
    );

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

-- Grant execute on the new trigger function
GRANT EXECUTE ON FUNCTION set_organization_creator() TO authenticated, org_admin;
