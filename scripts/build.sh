#!/usr/bin/env bash

echo "[scripts] build: validating env..."
if command -v bun >/dev/null 2>&1; then
  bun ./scripts/check-env.js || exit 1
elif command -v node >/dev/null 2>&1; then
  node ./scripts/check-env.js || exit 1
else
  echo "[scripts] warning: neither bun nor node found - skipping env check"
fi

echo "[scripts] build: running TypeScript & Vite build"
if command -v bun >/dev/null 2>&1; then
  bunx vite build || exit 1
else
  npx vite build || exit 1
fi

echo "[scripts] build: SEO discovery files + HTML prerender"
if command -v bun >/dev/null 2>&1; then
  bun ./scripts/seo/generate.ts || exit 1
elif command -v node >/dev/null 2>&1; then
  echo "[scripts] error: bun is required for scripts/seo/generate.ts"
  exit 1
else
  echo "[scripts] error: bun not found - cannot generate SEO assets"
  exit 1
fi
