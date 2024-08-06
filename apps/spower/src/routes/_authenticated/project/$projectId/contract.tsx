import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_authenticated/project/$projectId/contract'
)({
  component: () => <Outlet />,
  beforeLoad: () => ({ title: 'Dữ liệu hợp đồng' })
});
