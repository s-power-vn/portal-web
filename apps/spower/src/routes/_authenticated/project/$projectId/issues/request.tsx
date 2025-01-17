import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_authenticated/project/$projectId/issues/request'
)({
  component: () => <Outlet />,
  beforeLoad: () => ({ title: 'Phiếu đề nghị khối lượng' })
});
