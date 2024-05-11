/// <reference types="vinxi/types/client" />
import { hydrateRoot } from 'react-dom/client';
import 'vinxi/client';

import { StartClient } from '@tanstack/start';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter } from './router';
import { ConfirmProvider, Toaster, TooltipProvider } from '@storeo/theme';
import { StrictMode } from 'react';

import './global.css';

const queryClient = new QueryClient();

const router = createRouter(queryClient);

const app = <StrictMode>
    <ConfirmProvider>
      <TooltipProvider>
        <QueryClientProvider client={queryClient}>
          <StartClient router={router} />
        </QueryClientProvider>
        <Toaster />
      </TooltipProvider>
    </ConfirmProvider>
  </StrictMode>
;

router.hydrate();
hydrateRoot(document, app);
