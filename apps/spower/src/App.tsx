import { RouterProvider, createRouter } from '@tanstack/react-router';

import { usePb } from '@storeo/core';

import './global.css';
import { routeTree } from './routes.gen';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export const App = () => {
  const pb = usePb();

  return <RouterProvider router={router} context={{ pb }} />;
};
