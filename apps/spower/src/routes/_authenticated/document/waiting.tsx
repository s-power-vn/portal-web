import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/document/waiting')({
  component: () => <Outlet />,
  beforeLoad: () => ({ title: 'Đang chờ xử lý' })
});
