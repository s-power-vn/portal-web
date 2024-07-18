/// <reference types='vitest' />
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';
import react from '@vitejs/plugin-react';
import { createRequire } from 'node:module';
import * as path from 'node:path';
import { join } from 'path';
import Unfonts from 'unplugin-fonts/vite';
import { defineConfig, normalizePath } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const require = createRequire(import.meta.url);

const cMapsDir = normalizePath(
  path.join(path.dirname(require.resolve('pdfjs-dist/package.json')), 'cmaps')
);

const standardFontsDir = normalizePath(
  path.join(
    path.dirname(require.resolve('pdfjs-dist/package.json')),
    'standard_fonts'
  )
);

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/spower',

  server: {
    port: 4200,
    host: 'localhost'
  },

  preview: {
    port: 4300,
    host: 'localhost'
  },

  plugins: [
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
      generatedRouteTree: join(__dirname, 'src/routes.gen.ts')
    }),
    viteStaticCopy({
      targets: [
        { src: cMapsDir, dest: '' },
        { src: standardFontsDir, dest: '' }
      ]
    })
  ],

  build: {
    outDir: '../../dist/apps/spower',
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },

  test: {
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest'
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/spower',
      provider: 'v8'
    }
  }
});
