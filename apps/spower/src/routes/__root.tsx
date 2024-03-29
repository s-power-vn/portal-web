import { QueryClient } from '@tanstack/react-query';
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import PocketBase from 'pocketbase';

export type RouteContext = {
  queryClient?: QueryClient;
  pb?: PocketBase;
};

export const Route = createRootRouteWithContext<RouteContext>()({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools position={'bottom-right'} />
    </>
  ),
  notFoundComponent: () => {
    return <p>404</p>;
  }
});
