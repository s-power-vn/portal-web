import { Outlet, createFileRoute } from '@tanstack/react-router';
import { client2 } from 'portal-core';

import { OrganizationLayout } from '../layouts';
import { authCache } from './auth/auth-cache';

export const Route = createFileRoute('/_private/$organizationId')({
  component: () => {
    return (
      <OrganizationLayout>
        <Outlet />
      </OrganizationLayout>
    );
  },
  beforeLoad: async ({ params }) => {
    const savedOrganizationId = localStorage.getItem('organizationId');
    if (savedOrganizationId !== params.organizationId) {
      localStorage.setItem('organizationId', params.organizationId);
      await client2.api.refreshRestToken(params.organizationId);
      if (authCache.result) {
        authCache.result.organizationId = params.organizationId;
      }
    }
  }
});
