import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_private/project/$projectId/issues/price'
)({
  component: () => <Outlet />,
  beforeLoad: () => ({ title: 'Phiếu đề nghị đơn giá' })
});
