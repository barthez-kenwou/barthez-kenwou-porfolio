/** Canonical public site identity - used by SEO, OG, JSON-LD, sitemap. */
export const SITE_URL = 'https://barthez-kenwou.dev';
export const SITE_NAME = 'Barthez Kenwou';
export const SITE_NAME_FULL = 'Barthez Kenwou - Portfolio';

export const DEFAULT_TITLE = 'Barthez Kenwou | Développeur Full Stack & Ingénieur DevOps';

export const DEFAULT_DESCRIPTION =
  'Barthez Kenwou — développeur Full Stack JavaScript/TypeScript & ingénieur DevOps AWS (Yaoundé, Cameroun). React, Node.js, CI/CD GitHub Actions, Docker, Kubernetes, Terraform, DevSecOps. Freelance remote Afrique francophone & international.';

export const DEFAULT_KEYWORDS =
  'Barthez Kenwou, développeur Full Stack JavaScript, développeur React Node.js, ingénieur DevOps freelance, CI/CD GitHub Actions, AWS Cloud, Docker, Kubernetes, Terraform, DevSecOps, Trivy, Yaoundé, Cameroun, Afrique francophone, remote';

/**
 * Absolute OG/Twitter share image (1200×630).
 * Prefer a clean HTTPS JPEG path (no query string) - WhatsApp is picky.
 * Rename the file when you need a hard cache bust.
 */
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-share.jpg`;
export const DEFAULT_OG_IMAGE_ALT = 'Barthez Kenwou - Portfolio DevOps & Full Stack JS';

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export const SOCIAL = {
  github: 'https://github.com/barthez-kenwou',
  linkedin: 'https://linkedin.com/in/barthez-kenwou',
} as const;

export function absoluteUrl(path = '/'): string {
  if (!path || path === '/') return `${SITE_URL}/`;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}
