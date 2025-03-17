import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_private/project')({
  component: () => <Outlet />,
  beforeLoad: () => ({ title: 'Quản lý dự án' })
});
