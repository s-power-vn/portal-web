import {
  Outlet,
  ParsedLocation,
  createFileRoute,
  redirect
} from '@tanstack/react-router';
import { api } from 'portal-api';
import { client2 } from 'portal-core';

import { DashboardLayout } from '../layouts';

async function protectRoute({ location }: { location: ParsedLocation }) {
  await client2.auth.authStateReady();
  if (!client2.auth.currentUser) {
    throw redirect({
      to: '/signin',
      search: {
        redirect: location.href
      }
    });
  }

  try {
    await client2.api.getRestToken({
      email: client2.auth.currentUser?.email ?? '',
      organizationId: '1'
    });

    await api.user.checkUser.fetcher();
  } catch (error) {
    throw redirect({
      to: '/user-information',
      search: {
        email: client2.auth.currentUser?.email ?? ''
      }
    });
  }
}

export const Route = createFileRoute('/_private')({
  component: () => {
    return (
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    );
  },
  beforeLoad: protectRoute
});
