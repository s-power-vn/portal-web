import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/project')({
  component: () => <Outlet />,
  beforeLoad: () => ({ title: 'Quản lý dự án' })
});
