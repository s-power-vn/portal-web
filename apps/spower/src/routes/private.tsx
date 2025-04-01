import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { client } from 'portal-core';

import { DashboardLayout } from '../layouts';

export const Route = createFileRoute('/_private')({
  component: () => {
    return (
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    );
  },
  beforeLoad: ({ location }) => {
    if (!client.authStore.isValid) {
      throw redirect({
        to: '/signin',
        search: {
          redirect: location.href
        }
      });
    }
  }
});
