import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/general/employees')({
  component: () => <Outlet />,
  beforeLoad: () => {
    return {
      title: 'Quản lý nhân viên'
    };
  }
});
