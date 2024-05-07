import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/general/suppliers')({
  component: () => <Outlet />,
  beforeLoad: () => {
    return {
      title: 'Quản lý nhà cung cấp'
    };
  }
});
