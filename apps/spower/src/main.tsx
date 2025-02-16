import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import {
  ConfirmProvider,
  LoadingProvider,
  Toaster,
  TooltipProvider
} from '@minhdtb/storeo-theme';

import { App } from './app';
import './global.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <LoadingProvider>
      <ReactFlowProvider>
        <ConfirmProvider>
          <TooltipProvider>
            <App />
            <Toaster />
          </TooltipProvider>
        </ConfirmProvider>
      </ReactFlowProvider>
    </LoadingProvider>
  </StrictMode>
);
