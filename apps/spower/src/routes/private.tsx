import {
  Outlet,
  ParsedLocation,
  createFileRoute,
  redirect
} from '@tanstack/react-router';
import { api } from 'portal-api';
import { client2 } from 'portal-core';

export const Route = createFileRoute('/_private')({
  component: RouteComponent,
  beforeLoad: protectRoute
});

function RouteComponent() {
  return <Outlet />;
}

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
    await api.user.checkUser.fetcher();

    const savedOrganizationId = localStorage.getItem('organizationId');
    if (!savedOrganizationId) {
      redirect({
        to: '/top',
        search: {
          redirect: location.href
        }
      });
    }
  } catch (error) {
    throw redirect({
      to: '/user-information',
      search: {
        email: client2.auth.currentUser?.email ?? ''
      }
    });
  }
}
