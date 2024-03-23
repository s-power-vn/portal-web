import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/general')({
  component: () => <Outlet />,
  beforeLoad: () => ({ title: 'Quản lý chung' })
});
