/// <reference types='vitest' />
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { createRequire } from 'node:module';
import * as path from 'node:path';
import Unfonts from 'unplugin-fonts/vite';
import { defineConfig, normalizePath } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { viteStaticCopy } from 'vite-plugin-static-copy';

import moduleGenerator from '@minhdtb/vite-module-generator';

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
    port: 4000,
    host: 'localhost',
    headers: {
      'Cache-Control': 'no-store'
    }
  },

  plugins: [
    nodePolyfills(),
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
    moduleGenerator({
      projectRoot: __dirname,
      outputFile: 'src/modules.gen.ts',
      modulesDir: 'src/modules'
    }),
    TanStackRouterVite({
      generatedRouteTree: path.join(__dirname, 'src/routes.gen.ts'),
      target: 'react',
      virtualRouteConfig: './src/routes.ts'
    }),
    viteStaticCopy({
      targets: [
        { src: cMapsDir, dest: '' },
        { src: standardFontsDir, dest: '' },
        { src: path.resolve(__dirname, '../../serve.json'), dest: '' }
      ]
    })
  ],

  build: {
    emptyOutDir: true,
    outDir: '../../dist/apps/spower',
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true
    },
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash][extname]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
        manualChunks: {
          react: [
            'react',
            'react-dom',
            'react-image-crop',
            '@xyflow/react',
            '@preact/signals-react'
          ],
          lib: [
            'lodash',
            'luxon',
            'pocketbase',
            'print-js',
            'react-query-kit',
            'react-pdf',
            'zipson'
          ],
          print: ['@fileforge/react-print'],
          core: ['@minhdtb/storeo-core', '@minhdtb/storeo-theme'],
          form: ['react-hook-form', 'yup', '@hookform/resolvers'],
          tanstack: [
            '@tanstack/match-sorter-utils',
            '@tanstack/react-query',
            '@tanstack/react-router',
            '@tanstack/react-table',
            '@tanstack/react-virtual'
          ]
        }
      }
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
