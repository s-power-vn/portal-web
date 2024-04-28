import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_authenticated/project/$projectId/issues/all'
)({
  component: () => <Outlet />,
  beforeLoad: () => ({ title: 'Tất cả công việc' })
});
