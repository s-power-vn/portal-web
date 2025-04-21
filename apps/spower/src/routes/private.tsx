import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

import { enhancedWaitAuthenticated } from './auth/auth-cache';

export const Route = createFileRoute('/_private')({
  component: RouteComponent,
  beforeLoad: async () => {
    const authResult = await enhancedWaitAuthenticated();

    if (authResult?.status === 'not-registered') {
      localStorage.removeItem('organizationId');
      throw redirect({
        to: '/user-information',
        search: {
          email: authResult.email ?? ''
        }
      });
    }

    if (authResult?.status === 'unauthorized') {
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
