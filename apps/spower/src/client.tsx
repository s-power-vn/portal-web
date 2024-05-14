/// <reference types="vinxi/types/client" />
import { hydrateRoot } from 'react-dom/client';
import 'vinxi/client';

import { StartClient } from '@tanstack/start';
import { QueryClient } from '@tanstack/react-query';
import { createRouter } from './router';

import './global.css';

const queryClient = new QueryClient();

const router = createRouter(queryClient);

const app = <StartClient router={router} />;

router.hydrate();
hydrateRoot(document, app);
