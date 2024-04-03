import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

import { client } from '@storeo/core';

import { DashboardLayout } from '../layouts';

export const Route = createFileRoute('/_authenticated')({
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
        to: '/login',
        search: {
          redirect: location.href
        }
      });
    }
  }
});
