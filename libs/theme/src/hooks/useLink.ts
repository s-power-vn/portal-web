/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  RegisteredRouter,
  RoutePaths,
  UseLinkPropsOptions,
  deepEqual,
  useMatch,
  useRouter,
  useRouterState
} from '@tanstack/react-router';

export function useLink<
  TRouter extends RegisteredRouter = RegisteredRouter,
  TFrom extends RoutePaths<TRouter['routeTree']> | string = string,
  TTo extends string = '',
  TMaskFrom extends RoutePaths<TRouter['routeTree']> | string = TFrom,
  TMaskTo extends string = ''
>(options: UseLinkPropsOptions<TRouter, TFrom, TTo, TMaskFrom, TMaskTo>) {
  const matchPathname = useMatch({
    strict: false,
    select: s => s.pathname
  });

  const router = useRouter();

  const { activeOptions } = options;

  const dest = {
    from: options.to ? matchPathname : undefined,
    ...options
  };

  const next = router.buildLocation(dest as any);

  const isActive = useRouterState({
    select: s => {
      // Compare path/hash for matches
      const currentPathSplit = s.location.pathname.split('/');
      const nextPathSplit = next.pathname.split('/');
      const pathIsFuzzyEqual = nextPathSplit.every(
        (d, i) => d === currentPathSplit[i]
      );
      // Combine the matches based on user router.options
      const pathTest = activeOptions?.exact
        ? s.location.pathname === next.pathname
        : pathIsFuzzyEqual;
      const hashTest = activeOptions?.includeHash
        ? s.location.hash === next.hash
        : true;
      const searchTest =
        activeOptions?.includeSearch ?? true
          ? deepEqual(s.location.search, next.search, {
              partial: !activeOptions?.exact
            })
          : true;

      // The final "active" test
      return pathTest && hashTest && searchTest;
    }
  });

  return {
    isActive
  };
}
