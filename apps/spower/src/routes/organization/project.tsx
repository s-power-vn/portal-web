import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_private/$organizationId/project')({
  component: () => <Outlet />,
  beforeLoad: () => ({ title: 'Quản lý dự án' })
});
