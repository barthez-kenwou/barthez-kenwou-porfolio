import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

/**
 * Unit tests live under `tests/unit/` (not colocated in `src/`).
 * Browser E2E remains in `cypress/`.
 */
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'node',
    globals: true,
    pool: 'forks',
    include: ['tests/unit/**/*.{test,spec}.{ts,tsx}'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      // Needs jsdom + component rewrite; keep out of the node unit pool for now
      'tests/unit/shared/ui/Image/Image.test.tsx',
    ],
    passWithNoTests: true,
  },
});
