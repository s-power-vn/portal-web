import type { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  Outlet,
  createRootRouteWithContext,
  useRouter
} from '@tanstack/react-router';

import { lazy, useEffect } from 'react';

import { AuthData, useAuth } from '../hooks/useAuth';

const TanStackRouterDevtools =
  process.env.NODE_ENV === 'prod'
    ? () => null
    : lazy(() =>
        import('@tanstack/router-devtools').then(res => ({
          default: res.TanStackRouterDevtools
        }))
      );

export type RouteContext = {
  queryClient?: QueryClient;
  auth: AuthData;
};

export const Route = createRootRouteWithContext<RouteContext>()({
  component: Root
});

function Root() {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    router.invalidate();
  }, [auth]);

  return (
    <>
      <Outlet />
      <TanStackRouterDevtools position={'bottom-right'} />
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}
