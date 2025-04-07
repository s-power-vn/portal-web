GRANT SELECT ON users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON organizations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON organization_members TO authenticated;

GRANT SELECT ON departments TO org_member;
GRANT SELECT, INSERT, UPDATE, DELETE ON departments TO org_operator;

GRANT SELECT ON customers TO org_member;
GRANT SELECT, INSERT, UPDATE, DELETE ON customers TO org_operator;

GRANT SELECT ON suppliers TO org_member;
GRANT SELECT, INSERT, UPDATE, DELETE ON suppliers TO org_operator;


