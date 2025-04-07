-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop all existing tables
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;

-- Drop all views
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT viewname FROM pg_views WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP VIEW IF EXISTS ' || quote_ident(r.viewname) || ' CASCADE';
    END LOOP;
END $$;

-- Drop all indexes
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT 
            schemaname || '.' || tablename || '.' || indexname as full_index_name
        FROM 
            pg_indexes 
        WHERE 
            schemaname = 'public' 
            AND indexname NOT IN (
                SELECT conname 
                FROM pg_constraint 
                WHERE contype = 'p'
            )
    ) LOOP
        EXECUTE 'DROP INDEX IF EXISTS ' || r.full_index_name || ' CASCADE';
    END LOOP;
END $$;

-- Create NanoID generation function
CREATE OR REPLACE FUNCTION generate_nanoid(size INT DEFAULT 21)
RETURNS TEXT AS $$
DECLARE
  id TEXT := '';
  i INT;
  bytes BYTEA;
  alphabet TEXT := '_-0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  alphabet_length INT := length(alphabet);
BEGIN
  bytes := gen_random_bytes(size);
  FOR i IN 0..size-1 LOOP
    id := id || substr(alphabet, 
                      (get_byte(bytes, i) & 63) + 1,
                      1);
  END LOOP;
  RETURN id;
END;
$$ LANGUAGE plpgsql VOLATILE;

CREATE TABLE users (
    id TEXT PRIMARY KEY DEFAULT generate_nanoid(),
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT DEFAULT '',
    address TEXT DEFAULT '',
    avatar TEXT DEFAULT '',
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE organizations (
    id TEXT PRIMARY KEY DEFAULT generate_nanoid(),
    name TEXT NOT NULL,
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    settings JSONB DEFAULT '{}',
    created_by TEXT REFERENCES users(id),
    updated_by TEXT REFERENCES users(id)
);

CREATE TABLE departments (
    id TEXT PRIMARY KEY DEFAULT generate_nanoid(),
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    roles JSONB,
    organization_id TEXT REFERENCES organizations(id),
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT REFERENCES users(id),
    updated_by TEXT REFERENCES users(id)
);

CREATE TABLE organization_members (
    id TEXT PRIMARY KEY DEFAULT generate_nanoid(),
    user_id TEXT REFERENCES users(id),
    department TEXT REFERENCES departments(id),
    role TEXT NOT NULL CHECK (role IN ('org_admin', 'org_operator', 'org_member')),
    organization_id TEXT REFERENCES organizations(id),
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT REFERENCES users(id),
    updated_by TEXT REFERENCES users(id),
    UNIQUE(organization_id, user_id)
);

CREATE TABLE customers (
    id TEXT PRIMARY KEY DEFAULT generate_nanoid(),
    address TEXT DEFAULT '',
    email TEXT DEFAULT '',
    name TEXT NOT NULL,
    note TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    code TEXT DEFAULT '',
    organization_id TEXT REFERENCES organizations(id),
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT REFERENCES users(id),
    updated_by TEXT REFERENCES users(id)
);

CREATE TABLE suppliers (
    id TEXT PRIMARY KEY DEFAULT generate_nanoid(),
    address TEXT DEFAULT '',
    code TEXT DEFAULT '',
    email TEXT DEFAULT '',
    name TEXT NOT NULL,
    note TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    organization_id TEXT REFERENCES organizations(id),
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT REFERENCES users(id),
    updated_by TEXT REFERENCES users(id)
);

CREATE TABLE projects (
    id TEXT PRIMARY KEY DEFAULT generate_nanoid(),
    bidding TEXT DEFAULT '',
    customer TEXT REFERENCES customers(id),
    name TEXT NOT NULL,
    organization_id TEXT REFERENCES organizations(id),
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT REFERENCES users(id),
    updated_by TEXT REFERENCES users(id)
);

CREATE TABLE object_types (
    id TEXT PRIMARY KEY DEFAULT generate_nanoid(),
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    display TEXT DEFAULT '',
    color TEXT DEFAULT '',
    icon TEXT DEFAULT '',
    organization_id TEXT REFERENCES organizations(id),
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT REFERENCES users(id),
    updated_by TEXT REFERENCES users(id)
);

CREATE TABLE objects (
    id TEXT PRIMARY KEY DEFAULT generate_nanoid(),
    name TEXT NOT NULL,
    type TEXT REFERENCES object_types(id),
    organization_id TEXT REFERENCES organizations(id),
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT REFERENCES users(id),
    updated_by TEXT REFERENCES users(id)
);

CREATE TABLE issues (
    id TEXT PRIMARY KEY DEFAULT generate_nanoid(),
    title TEXT NOT NULL,
    project TEXT REFERENCES projects(id),
    deleted BOOLEAN DEFAULT FALSE,
    deadline_status TEXT DEFAULT '',
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    changed TEXT DEFAULT '',
    last_assignee JSONB,
    status TEXT DEFAULT '',
    code TEXT DEFAULT '',
    approver JSONB,
    object TEXT REFERENCES objects(id),
    assignees JSONB DEFAULT '[]',
    assigned_date TIMESTAMP WITH TIME ZONE,
    organization_id TEXT REFERENCES organizations(id),
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT REFERENCES users(id),
    updated_by TEXT REFERENCES users(id)
);

CREATE TABLE details (
    id TEXT PRIMARY KEY DEFAULT generate_nanoid(),
    project TEXT REFERENCES projects(id),
    note TEXT DEFAULT '',
    parent TEXT REFERENCES details(id),
    title TEXT NOT NULL,
    unit TEXT DEFAULT '',
    unit_price NUMERIC DEFAULT 0,
    volume NUMERIC DEFAULT 0,
    level TEXT DEFAULT '',
    extend JSONB,
    organization_id TEXT REFERENCES organizations(id),
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT REFERENCES users(id),
    updated_by TEXT REFERENCES users(id)
);

CREATE TABLE requests (
    id TEXT PRIMARY KEY DEFAULT generate_nanoid(),
    project TEXT REFERENCES projects(id),
    issue TEXT REFERENCES issues(id),
    organization_id TEXT REFERENCES organizations(id),
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT REFERENCES users(id),
    updated_by TEXT REFERENCES users(id)
);

CREATE TABLE request_details (
    id TEXT PRIMARY KEY DEFAULT generate_nanoid(),
    detail TEXT REFERENCES details(id),
    request TEXT REFERENCES requests(id),
    request_volume NUMERIC DEFAULT 0,
    custom_level TEXT DEFAULT '',
    custom_title TEXT DEFAULT '',
    custom_unit TEXT DEFAULT '',
    index TEXT DEFAULT '',
    note TEXT DEFAULT '',
    delivery_date TIMESTAMP WITH TIME ZONE,
    organization_id TEXT REFERENCES organizations(id),
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT REFERENCES users(id),
    updated_by TEXT REFERENCES users(id)
);

CREATE TABLE contracts (
    id TEXT PRIMARY KEY DEFAULT generate_nanoid(),
    request TEXT REFERENCES requests(id),
    supplier TEXT REFERENCES suppliers(id),
    count NUMERIC DEFAULT 0,
    note TEXT DEFAULT '',
    organization_id TEXT REFERENCES organizations(id),
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT REFERENCES users(id),
    updated_by TEXT REFERENCES users(id)
);

CREATE TABLE comments (
    id TEXT PRIMARY KEY DEFAULT generate_nanoid(),
    content TEXT NOT NULL,
    issue TEXT REFERENCES issues(id),
    status TEXT DEFAULT '',
    organization_id TEXT REFERENCES organizations(id),
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT REFERENCES users(id),
    updated_by TEXT REFERENCES users(id)
);

CREATE TABLE detail_imports (
    id TEXT PRIMARY KEY DEFAULT generate_nanoid(),
    error TEXT DEFAULT '',
    file TEXT NOT NULL,
    percent NUMERIC DEFAULT 0,
    project TEXT REFERENCES projects(id),
    status TEXT DEFAULT '',
    organization_id TEXT REFERENCES organizations(id),
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT REFERENCES users(id),
    updated_by TEXT REFERENCES users(id)
);

CREATE TABLE templates (
    id TEXT PRIMARY KEY DEFAULT generate_nanoid(),
    detail TEXT NOT NULL,
    organization_id TEXT REFERENCES organizations(id),
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT REFERENCES users(id),
    updated_by TEXT REFERENCES users(id)
);

CREATE TABLE materials (
    id TEXT PRIMARY KEY DEFAULT generate_nanoid(),
    code TEXT DEFAULT '',
    name TEXT NOT NULL,
    note TEXT DEFAULT '',
    unit TEXT DEFAULT '',
    organization_id TEXT REFERENCES organizations(id),
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT REFERENCES users(id),
    updated_by TEXT REFERENCES users(id)
);

CREATE TABLE prices (
    id TEXT PRIMARY KEY DEFAULT generate_nanoid(),
    issue TEXT REFERENCES issues(id),
    project TEXT REFERENCES projects(id),
    organization_id TEXT REFERENCES organizations(id),
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT REFERENCES users(id),
    updated_by TEXT REFERENCES users(id)
);

CREATE TABLE price_details (
    id TEXT PRIMARY KEY DEFAULT generate_nanoid(),
    estimate_price NUMERIC DEFAULT 0,
    index TEXT DEFAULT '',
    level TEXT DEFAULT '',
    title TEXT NOT NULL,
    unit TEXT DEFAULT '',
    volume NUMERIC DEFAULT 0,
    prices JSONB,
    price TEXT REFERENCES prices(id),
    estimate_amount NUMERIC DEFAULT 0,
    organization_id TEXT REFERENCES organizations(id),
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT REFERENCES users(id),
    updated_by TEXT REFERENCES users(id)
);

CREATE TABLE issue_files (
    id TEXT PRIMARY KEY DEFAULT generate_nanoid(),
    name TEXT NOT NULL,
    size NUMERIC DEFAULT 0,
    type TEXT DEFAULT '',
    upload TEXT NOT NULL,
    issue TEXT REFERENCES issues(id),
    organization_id TEXT REFERENCES organizations(id),
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT REFERENCES users(id),
    updated_by TEXT REFERENCES users(id)
);

CREATE TABLE processes (
    id TEXT PRIMARY KEY DEFAULT generate_nanoid(),
    finish_node TEXT DEFAULT '',
    process JSONB,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    object_type TEXT REFERENCES object_types(id),
    start_node TEXT DEFAULT '',
    organization_id TEXT REFERENCES organizations(id),
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT REFERENCES users(id),
    updated_by TEXT REFERENCES users(id)
);

CREATE TABLE msg_teams (
    id TEXT PRIMARY KEY DEFAULT generate_nanoid(),
    name TEXT NOT NULL,
    owner TEXT REFERENCES users(id),
    members JSONB DEFAULT '[]',
    organization_id TEXT REFERENCES organizations(id),
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT REFERENCES users(id),
    updated_by TEXT REFERENCES users(id)
);

CREATE TABLE msg_channels (
    id TEXT PRIMARY KEY DEFAULT generate_nanoid(),
    name TEXT NOT NULL,
    team TEXT REFERENCES msg_teams(id),
    description TEXT DEFAULT '',
    organization_id TEXT REFERENCES organizations(id),
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT REFERENCES users(id),
    updated_by TEXT REFERENCES users(id)
);

CREATE TABLE msg_chats (
    id TEXT PRIMARY KEY DEFAULT generate_nanoid(),
    type TEXT NOT NULL,
    participants JSONB DEFAULT '[]',
    organization_id TEXT REFERENCES organizations(id),
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT REFERENCES users(id),
    updated_by TEXT REFERENCES users(id)
);

CREATE TABLE msg_messages (
    id TEXT PRIMARY KEY DEFAULT generate_nanoid(),
    chat TEXT REFERENCES msg_chats(id),
    content TEXT NOT NULL,
    sender TEXT REFERENCES users(id),
    type TEXT DEFAULT 'text',
    reply_to TEXT REFERENCES msg_messages(id),
    organization_id TEXT REFERENCES organizations(id),
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT REFERENCES users(id),
    updated_by TEXT REFERENCES users(id)
);

CREATE TABLE msg_reactions (
    id TEXT PRIMARY KEY DEFAULT generate_nanoid(),
    message TEXT REFERENCES msg_messages(id),
    "user" TEXT REFERENCES users(id),
    reaction TEXT NOT NULL,
    organization_id TEXT REFERENCES organizations(id),
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT REFERENCES users(id),
    updated_by TEXT REFERENCES users(id)
);

CREATE TABLE msg_settings (
    id TEXT PRIMARY KEY DEFAULT generate_nanoid(),
    chat TEXT REFERENCES msg_chats(id),
    "user" TEXT REFERENCES users(id),
    last_read TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    organization_id TEXT REFERENCES organizations(id),
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT REFERENCES users(id),
    updated_by TEXT REFERENCES users(id)
);

-- Create views
CREATE OR REPLACE VIEW request_detail_info AS
SELECT 
    rd.id,
    rd.detail,
    rd.request_volume,
    rd.request,
    i.deleted,
    rd.organization_id
FROM request_details rd
    INNER JOIN requests r ON r.id = rd.request
    INNER JOIN issues i ON i.id = r.issue
WHERE i.deleted = false 
    AND i.status <> '' 
    AND CASE 
        WHEN position('-' in i.status) > 0 THEN
            substring(
                i.status 
                from position('-' in i.status) + 1 
                for CASE 
                    WHEN position('#' in i.status) > 0
                    THEN position('#' in i.status) - position('-' in i.status) - 1
                    ELSE length(i.status)
                END
            )
        ELSE i.status
    END IN (
        SELECT finish_node 
        FROM processes 
        WHERE finish_node <> ''
        AND processes.organization_id = i.organization_id
    );

CREATE OR REPLACE VIEW detail_info AS
SELECT 
    d.id as group_id,
    d.project,
    d.created,
    d.updated,
    d.title,
    d.volume,
    d.level,
    d.unit,
    d.unit_price,
    d.parent,
    d.note,
    d.extend,
    rdi.request,
    rdi.request_volume,
    i.title as issue_title,
    i.id as issue,
    i.code as issue_code,
    d.organization_id
FROM details d
    LEFT JOIN request_detail_info rdi 
        ON rdi.detail = d.id 
        AND rdi.request_volume > 0
        AND rdi.organization_id = d.organization_id
    LEFT JOIN requests r 
        ON r.id = rdi.request
        AND r.organization_id = d.organization_id
    LEFT JOIN issues i 
        ON i.id = r.issue
        AND i.organization_id = d.organization_id;

CREATE OR REPLACE VIEW msg_unread AS
SELECT 
    c.id AS chat_id,
    c.type AS chat_type,
    u.id AS user_id,
    c.organization_id,
    (
        SELECT COUNT(*) 
        FROM msg_messages m 
        WHERE m.chat = c.id 
        AND m.sender != u.id
        AND m.created > COALESCE(
            (SELECT s.last_read FROM msg_settings s WHERE s.chat = c.id AND s.user = u.id),
            '1970-01-01T00:00:00.000Z'::timestamp with time zone
        )
    ) AS unread_count
FROM 
    msg_chats c
CROSS JOIN 
    users u
JOIN 
    organization_members om ON om.user_id = u.id AND om.organization_id = c.organization_id
WHERE 
    (c.participants::jsonb @> to_jsonb(u.id)
    OR c.type = 'Channel');

CREATE OR REPLACE VIEW issue_user_info AS
WITH issue_assignments AS (
    SELECT 
        i.id AS issue_id,
        i.project,
        i.organization_id,
        jsonb_array_elements_text(i.assignees) AS assignee_id
    FROM 
        issues i
    WHERE 
        i.deleted = false 
        AND (
            i.status = '' OR
            CASE 
                WHEN position('-' in i.status) > 0 THEN
                    substring(
                        i.status 
                        from position('-' in i.status) + 1 
                        for CASE 
                            WHEN position('#' in i.status) > 0
                            THEN position('#' in i.status) - position('-' in i.status) - 1
                            ELSE length(i.status)
                        END
                    )
                ELSE i.status
            END NOT IN (
                SELECT finish_node 
                FROM processes 
                WHERE finish_node <> ''
                AND processes.organization_id = i.organization_id
            )
        )
)
SELECT 
    u.id as user_id,
    ia.project,
    ia.organization_id,
    COUNT(DISTINCT ia.issue_id) as count
FROM 
    issue_assignments ia
JOIN 
    users u ON u.id = ia.assignee_id
JOIN 
    organization_members om ON om.user_id = u.id AND om.organization_id = ia.organization_id
GROUP BY 
    u.id, ia.project, ia.organization_id;

CREATE OR REPLACE VIEW request_finished AS
SELECT
    i.id as issue_id,
    r.id as request_id,
    i.project,
    i.title,
    i.changed,
    i.organization_id
FROM 
    issues i
JOIN
    objects o ON i.object = o.id AND o.organization_id = i.organization_id
JOIN
    projects p ON i.project = p.id AND p.organization_id = i.organization_id
LEFT JOIN
    requests r ON i.id = r.issue AND r.organization_id = i.organization_id
WHERE 
    i.deleted = false 
    AND (
        i.status <> '' AND
        CASE 
            WHEN position('-' in i.status) > 0 THEN
                substring(
                    i.status 
                    from position('-' in i.status) + 1 
                    for CASE 
                        WHEN position('#' in i.status) > 0
                        THEN position('#' in i.status) - position('-' in i.status) - 1
                        ELSE length(i.status)
                    END
                )
            ELSE i.status
        END IN (
            SELECT finish_node 
            FROM processes 
            WHERE finish_node <> ''
            AND processes.organization_id = i.organization_id
        )
    );

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_organizations_created_by ON organizations(created_by);
CREATE INDEX idx_departments_name ON departments(name);
CREATE INDEX idx_departments_organization ON departments(organization_id);
CREATE INDEX idx_customers_code ON customers(code);
CREATE INDEX idx_customers_organization ON customers(organization_id);
CREATE INDEX idx_suppliers_code ON suppliers(code);
CREATE INDEX idx_suppliers_organization ON suppliers(organization_id);
CREATE INDEX idx_projects_customer ON projects(customer);
CREATE INDEX idx_projects_created_by ON projects(created_by);
CREATE INDEX idx_projects_organization ON projects(organization_id);
CREATE INDEX idx_details_project ON details(project);
CREATE INDEX idx_details_parent ON details(parent);
CREATE INDEX idx_details_organization ON details(organization_id);
CREATE INDEX idx_issues_project ON issues(project);
CREATE INDEX idx_issues_created_by ON issues(created_by);
CREATE INDEX idx_issues_object ON issues(object);
CREATE INDEX idx_issues_organization ON issues(organization_id);
CREATE INDEX idx_requests_project ON requests(project);
CREATE INDEX idx_requests_issue ON requests(issue);
CREATE INDEX idx_requests_organization ON requests(organization_id);
CREATE INDEX idx_request_details_detail ON request_details(detail);
CREATE INDEX idx_request_details_request ON request_details(request);
CREATE INDEX idx_request_details_organization ON request_details(organization_id);
CREATE INDEX idx_contracts_supplier ON contracts(supplier);
CREATE INDEX idx_contracts_request ON contracts(request);
CREATE INDEX idx_contracts_organization ON contracts(organization_id);
CREATE INDEX idx_comments_issue ON comments(issue);
CREATE INDEX idx_comments_created_by ON comments(created_by);
CREATE INDEX idx_comments_organization ON comments(organization_id);
CREATE INDEX idx_detail_imports_project ON detail_imports(project);
CREATE INDEX idx_detail_imports_organization ON detail_imports(organization_id);
CREATE INDEX idx_materials_code ON materials(code);
CREATE INDEX idx_materials_organization ON materials(organization_id);
CREATE INDEX idx_prices_project ON prices(project);
CREATE INDEX idx_prices_issue ON prices(issue);
CREATE INDEX idx_prices_organization ON prices(organization_id);
CREATE INDEX idx_price_details_price ON price_details(price);
CREATE INDEX idx_price_details_organization ON price_details(organization_id);
CREATE INDEX idx_issue_files_issue ON issue_files(issue);
CREATE INDEX idx_issue_files_organization ON issue_files(organization_id);
CREATE INDEX idx_processes_object_type ON processes(object_type);
CREATE INDEX idx_processes_created_by ON processes(created_by);
CREATE INDEX idx_processes_organization ON processes(organization_id);
CREATE INDEX idx_object_types_organization ON object_types(organization_id);
CREATE INDEX idx_objects_organization ON objects(organization_id);
CREATE INDEX idx_templates_organization ON templates(organization_id);
CREATE INDEX idx_msg_teams_owner ON msg_teams(owner);
CREATE INDEX idx_msg_teams_organization ON msg_teams(organization_id);
CREATE INDEX idx_msg_channels_team ON msg_channels(team);
CREATE INDEX idx_msg_channels_organization ON msg_channels(organization_id);
CREATE INDEX idx_msg_chats_organization ON msg_chats(organization_id);
CREATE INDEX idx_msg_messages_chat ON msg_messages(chat);
CREATE INDEX idx_msg_messages_sender ON msg_messages(sender);
CREATE INDEX idx_msg_reactions_message ON msg_reactions(message);
CREATE INDEX idx_msg_reactions_user ON msg_reactions("user");
CREATE INDEX idx_msg_settings_chat_user ON msg_settings(chat, "user");
CREATE INDEX idx_organization_members ON organization_members(organization_id, user_id);
CREATE INDEX idx_organization_members_user ON organization_members(user_id);
CREATE INDEX idx_organization_members_role ON organization_members(role);
CREATE INDEX idx_msg_messages_organization ON msg_messages(organization_id);
CREATE INDEX idx_msg_reactions_organization ON msg_reactions(organization_id);
CREATE INDEX idx_msg_settings_organization ON msg_settings(organization_id);

-- Create GIN indexes for JSONB fields
CREATE INDEX idx_departments_roles ON departments USING GIN (roles);
CREATE INDEX idx_issues_last_assignee ON issues USING GIN (last_assignee);
CREATE INDEX idx_issues_approver ON issues USING GIN (approver);
CREATE INDEX idx_issues_assignees ON issues USING GIN (assignees);
CREATE INDEX idx_details_extend ON details USING GIN (extend);
CREATE INDEX idx_price_details_prices ON price_details USING GIN (prices);
CREATE INDEX idx_processes_process ON processes USING GIN (process);
CREATE INDEX idx_msg_teams_members ON msg_teams USING GIN (members);
CREATE INDEX idx_msg_chats_participants ON msg_chats USING GIN (participants);
CREATE INDEX idx_organizations_settings ON organizations USING GIN (settings);
