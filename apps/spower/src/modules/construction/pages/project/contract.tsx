import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_private/project/$projectId/contract'
)({
  component: () => <Outlet />,
  beforeLoad: () => ({ title: 'Dữ liệu hợp đồng' })
});
