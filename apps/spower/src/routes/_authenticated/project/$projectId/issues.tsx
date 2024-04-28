import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_authenticated/project/$projectId/issues'
)({
  component: () => <Outlet />,
  beforeLoad: () => ({ title: 'Quản lý công việc' })
});
