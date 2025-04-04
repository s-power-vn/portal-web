import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

import { TopLayout } from '../layouts';

export const Route = createFileRoute('/_private/_top')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
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
          email: context.auth.user_email
        }
      });
    }
  }
});

function RouteComponent() {
  return (
    <TopLayout>
      <Outlet />
    </TopLayout>
  );
}
