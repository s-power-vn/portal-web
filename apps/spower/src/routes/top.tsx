import { Outlet, createFileRoute } from '@tanstack/react-router';
import { api } from 'portal-api';
import { client2 } from 'portal-core';

import { TopLayout } from '../layouts';

export const Route = createFileRoute('/_private/_top')({
  component: RouteComponent,
  beforeLoad: async () => {
    await api.user.getRestToken.fetcher({
      email: client2.auth.currentUser?.email ?? ''
    });
  }
});

function RouteComponent() {
  return (
    <TopLayout>
      <Outlet />
    </TopLayout>
  );
}
