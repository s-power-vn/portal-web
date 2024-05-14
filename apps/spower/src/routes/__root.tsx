import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { ReactNode } from 'react';
import { Meta, Scripts } from '@tanstack/start';
import { ConfirmProvider, TooltipProvider } from '@storeo/theme';

function RootComponent() {
  const queryClient = new QueryClient();
  return (
    <html lang="vi">
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <Meta />
    </head>
    <body>
    <ConfirmProvider>
      <TooltipProvider>
        <QueryClientProvider client={queryClient}>
          <Outlet />
        </QueryClientProvider>
      </TooltipProvider>
    </ConfirmProvider>
    <TanStackRouterDevtools position="bottom-right" />
    <Scripts />
    </body>
    </html>
  );
}

export type RouteContext = {
  queryClient?: QueryClient;
  assets: ReactNode
};

export const Route = createRootRouteWithContext<RouteContext>()({
  component: RootComponent,
  scripts: () => [
    {
      src: 'https://cdn.tailwindcss.com'
    }
  ]
});
