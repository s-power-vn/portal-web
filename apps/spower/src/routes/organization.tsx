import { Outlet, createFileRoute } from '@tanstack/react-router';
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

async function protectRoute() {
  const savedOrganizationId = localStorage.getItem('organizationId');
  if (savedOrganizationId) {
    await api.user.getRestToken.fetcher({
      email: client2.auth.currentUser?.email ?? '',
      organizationId: savedOrganizationId
    });
  }
}
