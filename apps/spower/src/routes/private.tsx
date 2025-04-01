import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { client2 } from 'portal-core';

import { DashboardLayout } from '../layouts';

export const Route = createFileRoute('/_private')({
  component: () => {
    return (
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    );
  },
  beforeLoad: async ({ location }) => {
    await client2.auth.authStateReady();
    if (!client2.auth.currentUser) {
      throw redirect({
        to: '/signin',
        search: {
          redirect: location.href
        }
      });
    }
  }
});
