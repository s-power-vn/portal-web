import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/general/materials')({
  component: () => <Outlet />,
  beforeLoad: () => {
    return {
      title: 'Quản lý danh mục vật tư'
    };
  }
});
