#!/usr/bin/env bun
const { resolve } = require('path');
const dotenvSafe = require('dotenv-safe');

const example = resolve(__dirname, '../.env.example');
const envPath = resolve(process.cwd(), '.env');

try {
  dotenvSafe.config({
    example,
    path: envPath,
    // VITE_API_BASE_URL may be empty (same-origin / Vite proxy in local & some deploys).
    allowEmptyValues: true,
  });
  console.log('[env] .env validated against .env.example');
} catch (err) {
  console.error('[env] .env validation failed:', err.message || err);
  process.exit(1);
}
