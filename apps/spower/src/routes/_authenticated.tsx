import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

import { DashboardLayout } from '../layouts';

export const Route = createFileRoute('/_authenticated')({
  component: () => {
    return (
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    );
  },
  beforeLoad: ({ context, location }) => {
    if (!context.pb?.authStore.isValid) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href
        }
      });
    }
  }
});
