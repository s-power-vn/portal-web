import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/settings')({
  component: () => <Outlet />,
  beforeLoad: () => ({ title: 'Cài đặt' })
});
