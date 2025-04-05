import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { userEmail } from 'portal-core';

import { enhancedWaitAuthenticated } from './auth/auth-cache';

export const Route = createFileRoute('/_private')({
  component: RouteComponent,
  beforeLoad: async () => {
    const authResult = await enhancedWaitAuthenticated();

    if (authResult.status === 'not-registered') {
      throw redirect({
        to: '/user-information',
        search: {
          email: userEmail.value ?? ''
        }
      });
    }

    if (authResult.status === 'unauthorized') {
      throw redirect({
        to: '/signin',
        search: {
          redirect: window.location.href
        }
      });
    }
  }
});

function RouteComponent() {
  return <Outlet />;
}
