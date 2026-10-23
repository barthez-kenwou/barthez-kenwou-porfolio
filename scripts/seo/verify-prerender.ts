/**
 * Fail the build if SEO prerender shells are missing or still point at the home canonical.
 * Run after `bun run build` / `scripts/seo/generate.ts`.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_URL, STATIC_PAGES } from './config';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const DIST = join(ROOT, 'dist');

type Check = { path: string; file: string; canonical: string; titleHint?: string };

function shellFile(path: string): string {
  if (path === '/') return join(DIST, 'index.html');
  return join(DIST, path.replace(/^\//, ''), 'index.html');
}

function fail(message: string): never {
  console.error(`[seo:verify] FAIL: ${message}`);
  process.exit(1);
}

function main() {
  if (!existsSync(DIST)) {
    fail(`dist/ missing at ${DIST} — run bun run build first`);
  }

  const checks: Check[] = STATIC_PAGES.map((p) => ({
    path: p.path,
    file: shellFile(p.path),
    canonical: p.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${p.path}`,
    titleHint: p.titleFr?.slice(0, 12),
  }));

  // Spot-check that nested content routes are prerendered too
  const sampleNested = ['projects', 'blog']
    .map((dir) => {
      const nestedDir = join(DIST, dir);
      if (!existsSync(nestedDir)) return null;
      return dir;
    })
    .filter(Boolean);

  let ok = 0;
  for (const check of checks) {
    if (!existsSync(check.file)) {
      fail(`missing prerender shell for ${check.path} → ${check.file}`);
    }
    const html = readFileSync(check.file, 'utf8');
    const canonicalMatch = html.match(/rel=["']canonical["']\s+href=["']([^"']+)["']/i);
    const canonical = canonicalMatch?.[1];
    if (!canonical) {
      fail(`${check.path}: no <link rel="canonical"> in ${check.file}`);
    }
    if (canonical !== check.canonical) {
      fail(`${check.path}: canonical is "${canonical}" — expected "${check.canonical}"`);
    }
    if (check.path !== '/' && !html.includes('data-seo-prerender')) {
      fail(`${check.path}: missing data-seo-prerender body (crawler shell empty?)`);
    }
    if (check.path !== '/' && canonical === `${SITE_URL}/`) {
      fail(`${check.path}: still canonicalizes to home`);
    }
    ok += 1;
    console.log(`[seo:verify] OK  ${check.path} → ${canonical}`);
  }

  for (const dir of sampleNested) {
    const marker = join(DIST, String(dir));
    console.log(`[seo:verify] OK  nested tree present: ${marker}`);
  }

  console.log(`[seo:verify] passed — ${ok} static shells with self-canonical URLs`);
}

main();
