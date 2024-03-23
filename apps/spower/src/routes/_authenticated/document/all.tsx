import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/document/all')({
  component: () => <Outlet />,
  beforeLoad: () => ({ title: 'Tất cả tài liệu' })
});
