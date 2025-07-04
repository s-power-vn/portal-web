import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_private/project/$projectId/issues'
)({
  component: () => <Outlet />,
  beforeLoad: () => ({ title: 'Quản lý công việc' })
});
