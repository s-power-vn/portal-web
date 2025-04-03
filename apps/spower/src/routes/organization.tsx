import {
  Outlet,
  ParsedLocation,
  createFileRoute,
  redirect
} from '@tanstack/react-router';
import { api } from 'portal-api';
import { client2 } from 'portal-core';

import { OrganizationLayout } from '../layouts';

export const Route = createFileRoute('/_private/_organization')({
  component: () => {
    return (
      <OrganizationLayout>
        <Outlet />
      </OrganizationLayout>
    );
  },
  beforeLoad: protectRoute
});

async function protectRoute({ location }: { location: ParsedLocation }) {
  const savedOrganizationId = localStorage.getItem('organizationId');
  if (savedOrganizationId) {
    const data = await api.user.getRestToken.fetcher({
      email: client2.auth.currentUser?.email ?? '',
      organizationId: savedOrganizationId
    });

    if (data.token && data.role === 'authenticated') {
      throw redirect({
        to: '/top',
        search: {
          redirect: location.href
        }
      });
    }
  }

  throw redirect({
    to: '/top',
    search: {
      redirect: location.href
    }
  });
}
