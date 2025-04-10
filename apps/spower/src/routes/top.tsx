import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

import { TopLayout } from '../layouts';

export const Route = createFileRoute('/_private/_top')({
  component: () => {
    return (
      <TopLayout>
        <Outlet />
      </TopLayout>
    );
  },
  beforeLoad: async () => {
    const savedOrganizationId = localStorage.getItem('organizationId');
    if (savedOrganizationId) {
      throw redirect({
        to: `/$organizationId/home`,
        params: {
          organizationId: savedOrganizationId
        }
      });
    }
  }
});
