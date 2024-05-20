import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  RouterProvider,
  createRouter,
  parseSearchWith,
  stringifySearchWith
} from '@tanstack/react-router';
import { Loader } from 'lucide-react';
import { parse, stringify } from 'zipson';

import { routeTree } from './routes.gen';

export function decodeFromBinary(str: string): string {
  return decodeURIComponent(
    Array.prototype.map
      .call(atob(str), function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );
}

export function encodeToBinary(str: string): string {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
      return String.fromCharCode(parseInt(p1, 16));
    })
  );
}

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  context: {
    queryClient
  },
  defaultPendingComponent: () => (
    <div className={`p-2 text-2xl`}>
      <Loader className={'h-6 w-6 animate-spin'} />
    </div>
  ),
  parseSearch: parseSearchWith(value =>
    parse(decodeURIComponent(decodeFromBinary(value)))
  ),
  stringifySearch: stringifySearchWith(value =>
    encodeToBinary(encodeURIComponent(stringify(value)))
  ),
  defaultPreload: 'intent'
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};
