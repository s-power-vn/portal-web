// @ts-check
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import nxPlugin from '@nx/eslint-plugin';
import prettierConfig from 'eslint-config-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tương thích với cấu hình cũ
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended
});

export default [
  // Cấu hình toàn cục
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/.nx/**'
    ],
    linterOptions: {
      reportUnusedDisableDirectives: true
    }
  },

  // Cấu hình cơ bản
  js.configs.recommended,

  // Sử dụng cấu hình cũ thông qua FlatCompat
  ...compat.config({
    extends: ['plugin:@nx/javascript', 'plugin:@nx/typescript']
  }),

  // Cấu hình cho React Hooks
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      'react-hooks': reactHooksPlugin,
      react: reactPlugin
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/jsx-no-bind': [
        'warn',
        {
          allowArrowFunctions: false,
          allowBind: false,
          allowFunctions: false
        }
      ]
    }
  },

  // Cấu hình cho NX
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      '@nx': nxPlugin
    },
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*']
            }
          ]
        }
      ]
    }
  },

  // Thêm cấu hình Prettier ở cuối để tránh xung đột
  prettierConfig
];
