import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import { PbProvider } from '@storeo/core';
import { Toaster, TooltipProvider } from '@storeo/theme';

import { App } from './app';
import './global.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const queryClient = new QueryClient();

root.render(
  <StrictMode>
    <TooltipProvider>
      <PbProvider endpoint={'http://localhost:8090'}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </PbProvider>
      <Toaster />
    </TooltipProvider>
  </StrictMode>
);
