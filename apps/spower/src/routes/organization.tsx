import { Outlet, createFileRoute } from '@tanstack/react-router';
import { client2, restToken } from 'portal-core';

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
    const token = await client2.api.getRestToken(params.organizationId);
    restToken.value = token.token;
  }
});
