import type { QueryClient } from '@tanstack/react-query';
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';

import { lazy } from 'react';

const TanStackRouterDevtools =
  process.env.NODE_ENV === 'prod'
    ? () => null
    : lazy(() =>
        import('@tanstack/router-devtools').then(res => ({
          default: res.TanStackRouterDevtools
        }))
      );

const ReactQueryDevtools =
  process.env.NODE_ENV === 'prod'
    ? () => null
    : lazy(() =>
        import('@tanstack/react-query-devtools').then(res => ({
          default: res.ReactQueryDevtools
        }))
      );

export type RouteContext = {
  queryClient?: QueryClient;
};

export const Route = createRootRouteWithContext<RouteContext>()({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools position={'bottom-right'} />
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  )
});
