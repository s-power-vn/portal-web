import reactRefresh from '@vitejs/plugin-react'
import { serverFunctions } from '@vinxi/server-functions/plugin'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import { createApp } from 'vinxi'
import { join, resolve, dirname } from 'path';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import Unfonts from 'unplugin-fonts/vite';
const __dirname = resolve(dirname(''));

export default createApp({
  routers: [
    {
      name: 'public',
      type: 'static',
      dir: './public',
      base: '/',
    },
    {
      name: 'ssr',
      type: 'http',
      middleware: './src/middleware.tsx',
      handler: './src/server.tsx',
      target: 'server',
      plugins: () => [
        react(),
        nxViteTsPaths(),
        Unfonts({
          google: {
            families: [
              {
                name: 'Inter',
                styles: 'wght@300;400;500;600;700;800;900'
              }
            ]
          }
        }),
        TanStackRouterVite({
          routesDirectory: join(__dirname, 'src/routes'),
          generatedRouteTree: join(__dirname, 'src/routes.gen.ts'),
          experimental: {
            enableCodeSplitting: true,
          },
        }),
        reactRefresh(),
      ],
    },
    {
      name: 'client',
      type: 'client',
      handler: './src/client.tsx',
      target: 'browser',
      plugins: () => [
        react(),
        nxViteTsPaths(),
        Unfonts({
          google: {
            families: [
              {
                name: 'Inter',
                styles: 'wght@300;400;500;600;700;800;900'
              }
            ]
          }
        }),
        serverFunctions.client(),
        TanStackRouterVite({
          routesDirectory: join(__dirname, 'src/routes'),
          generatedRouteTree: join(__dirname, 'src/routes.gen.ts'),
          experimental: {
            enableCodeSplitting: true,
          },
        }),
        reactRefresh(),
      ],
      base: '/_build',
    },
    serverFunctions.router(),
  ],
})
