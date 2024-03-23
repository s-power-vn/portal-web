import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/document/mine')({
  component: () => <Outlet />,
  beforeLoad: () => ({ title: 'Tài liệu của tôi' })
});
