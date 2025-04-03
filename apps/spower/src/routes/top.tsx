import { Outlet, createFileRoute } from '@tanstack/react-router';
import { api } from 'portal-api';

import { TopLayout } from '../layouts';

export const Route = createFileRoute('/_private/_top')({
  component: RouteComponent,
  beforeLoad: async () => {
    await api.user.getRestToken.fetcher({});
  }
});

function RouteComponent() {
  return (
    <TopLayout>
      <Outlet />
    </TopLayout>
  );
}
