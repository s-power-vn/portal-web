import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_authenticated/project/$projectId/issues/me'
)({
  component: () => <Outlet />,
  beforeLoad: () => ({ title: 'Công việc của tôi' })
});
