import { Outlet, createFileRoute } from '@tanstack/react-router';

import { TopLayout } from '../layouts';

export const Route = createFileRoute('/_private/_top')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <TopLayout>
      <Outlet />
    </TopLayout>
  );
}
