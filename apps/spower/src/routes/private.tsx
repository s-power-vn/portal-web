import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { authStatus, userEmail, waitAuthenticated } from 'portal-core';

export const Route = createFileRoute('/_private')({
  component: RouteComponent,
  beforeLoad: async ({ location }) => {
    await waitAuthenticated();

    if (authStatus.value === 'not-registered') {
      throw redirect({
        to: '/user-information',
        search: {
          email: userEmail.value ?? ''
        }
      });
    }

    if (authStatus.value === 'unauthorized') {
      throw redirect({
        to: '/signin',
        search: {
          redirect: location.href
        }
      });
    }
  }
});

function RouteComponent() {
  return <Outlet />;
}
