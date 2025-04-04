import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

import { OrganizationLayout } from '../layouts';

export const Route = createFileRoute('/_private/$organizationId')({
  component: () => {
    return (
      <OrganizationLayout>
        <Outlet />
      </OrganizationLayout>
    );
  },
  beforeLoad: async ({ context, location }) => {
    if (context.auth.isLoading) {
      return;
    }

    if (context.auth.status === 'not-registered') {
      throw redirect({
        to: '/user-information',
        search: {
          email: context.auth.user_email
        }
      });
    }

    if (context.auth.status === 'unauthorized') {
      throw redirect({
        to: '/signin',
        search: {
          redirect: location.href
        }
      });
    }
  }
});
