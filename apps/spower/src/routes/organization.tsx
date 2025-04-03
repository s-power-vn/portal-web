import { Outlet, createFileRoute } from '@tanstack/react-router';
import { api } from 'portal-api';

import { OrganizationLayout } from '../layouts';

export const Route = createFileRoute('/_private/$organizationId')({
  component: () => {
    return (
      <OrganizationLayout>
        <Outlet />
      </OrganizationLayout>
    );
  },
  beforeLoad: async ({ params }) => {
    if (params.organizationId) {
      await api.user.getRestToken.fetcher({
        organizationId: params.organizationId
      });
    }
  }
});
