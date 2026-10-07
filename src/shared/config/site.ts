/** Canonical public site identity - used by SEO, OG, JSON-LD, sitemap. */
export const SITE_URL = 'https://barthez-kenwou.dev';
export const SITE_NAME = 'Barthez Kenwou';
export const SITE_NAME_FULL = 'Barthez Kenwou - Portfolio';

export const DEFAULT_TITLE = 'Barthez Kenwou | Développeur Full Stack & Ingénieur DevOps';

export const DEFAULT_DESCRIPTION =
  'Portfolio de Barthez Kenwou - Développeur Full Stack JS & Ingénieur DevOps spécialiste AWS Cloud. Applications web modernes, CI/CD, Kubernetes et architectures cloud performantes.';

export const DEFAULT_KEYWORDS =
  'Barthez Kenwou, Full Stack Developer, DevOps Engineer, Ingénieur DevOps, AWS Cloud, React, Node.js, Kubernetes, Terraform, CI/CD, Docker, Portfolio, Développeur Web, Yaoundé, Cameroun';

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
