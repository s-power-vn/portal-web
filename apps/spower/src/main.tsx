import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import {
  ConfirmProvider,
  LoadingProvider,
  ModalProvider,
  Toaster,
  TooltipProvider
} from '@storeo/theme';

import { App } from './app';
import './global.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <LoadingProvider>
      <ConfirmProvider>
        <ModalProvider>
          <TooltipProvider>
            <App />
            <Toaster />
          </TooltipProvider>
        </ModalProvider>
      </ConfirmProvider>
    </LoadingProvider>
  </StrictMode>
);
