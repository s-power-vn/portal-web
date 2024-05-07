import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/general/customers')({
  component: () => <Outlet />,
  beforeLoad: () => {
    return {
      title: 'Quản lý chủ đầu tư'
    };
  }
});
