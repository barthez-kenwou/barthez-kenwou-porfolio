import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

/** Flat config compatible with ESLint 8 + typescript-eslint */
export default tseslint.config(
  {
    ignores: [
      'dist',
      'coverage',
      'cypress',
      'node_modules',
      '**/*.config.*',
      'tailwind.config.ts',
      'velite.config.ts',
      '.velite/**',
      // Large generated / WebGL widgets - lint noise; covered by typecheck + manual review
      'src/shared/ui/text-animate.tsx',
      'src/shared/ui/retro-grid.tsx',
      'src/entities/blogs/api/mock/blog.mocks.ts',
    ],
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: { import: importPlugin },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'react-refresh/only-export-components': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/static-components': 'off',
      'react-hooks/unsupported-syntax': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/purity': 'off',
      'prefer-const': 'warn',
      'no-useless-escape': 'warn',
      'no-restricted-imports': [
        'error',
        {
          patterns: ['@/features/*/model/*', '@/features/*/ui/*', '@/features/*/*/*'],
        },
      ],
    },
  },
);
