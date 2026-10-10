import React from 'react';
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_TITLE,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  SITE_NAME,
  SITE_NAME_FULL,
  SITE_URL,
  SOCIAL,
  absoluteUrl,
  DEFAULT_OG_IMAGE as SITE_DEFAULT_OG,
} from '@/shared/config/site';
import { useLanguageStore } from '@/shared/state/useLanguageStore';

function toAbsoluteOgImage(url?: string): string {
  if (!url?.trim()) return SITE_DEFAULT_OG;
  const u = url.trim();
  if (u.startsWith('https://') || u.startsWith('http://')) return u;
  if (u.startsWith('//')) return `https:${u}`;
  return absoluteUrl(u.startsWith('/') ? u : `/${u}`);
}

export type OpenGraph = {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  type?: string;
  imageAlt?: string;
};

export type SEOProps = {
  title?: string;
  description?: string;
  canonical?: string;
  /** Path only (e.g. /about) - builds absolute canonical + og:url when canonical omitted */
  path?: string;
  lang?: string;
  openGraph?: OpenGraph;
  /** noindex for error / private pages */
  noIndex?: boolean;
  /** Article / person / etc. structured data objects (merged into graph) */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  additionalMeta?: Array<{ name?: string; property?: string; content: string }>;
};

type MetaLike = { name?: string; property?: string; content: string };

function upsertMetaTag(meta: MetaLike) {
  if (!meta.content) return;

  const selector = meta.name
    ? `meta[name="${CSS.escape(meta.name)}"]`
    : `meta[property="${CSS.escape(meta.property ?? '')}"]`;

  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    if (meta.name) el.setAttribute('name', meta.name);
    if (meta.property) el.setAttribute('property', meta.property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', meta.content);
}

function upsertLinkTag(rel: string, href: string, attrs?: Record<string, string>) {
  if (!href) return;
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${CSS.escape(rel)}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
  if (attrs) {
    Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
  }
}

function upsertJsonLd(id: string, data: Record<string, unknown>) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function buildPageTitle(title?: string): string {
  if (!title?.trim()) return DEFAULT_TITLE;
  const t = title.trim();
  // Avoid "X | Site | Site" when callers already brand the title
  if (t.includes(SITE_NAME) || t.includes(SITE_NAME_FULL)) return t;
  return `${t} | ${SITE_NAME}`;
}

function personWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME_FULL,
        description: DEFAULT_DESCRIPTION,
        inLanguage: ['fr-FR', 'en-US'],
        publisher: { '@id': `${SITE_URL}/#person` },
      },
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/#person`,
        name: SITE_NAME,
        url: SITE_URL,
        image: `${SITE_URL}/images/barthez-kenwou.png`,
        jobTitle: 'Full Stack Developer & DevOps Engineer',
        email: 'mailto:kenwoubarthez@gmail.com',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Yaoundé',
          addressCountry: 'CM',
        },
        sameAs: [SOCIAL.github, SOCIAL.linkedin],
        knowsAbout: [
          'DevOps',
          'AWS',
          'React',
          'Node.js',
          'Kubernetes',
          'CI/CD',
          'Full Stack JavaScript',
        ],
      },
      {
        '@type': 'WebPage',
        '@id': `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: DEFAULT_TITLE,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#person` },
        description: DEFAULT_DESCRIPTION,
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: DEFAULT_OG_IMAGE,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
        },
      },
    ],
  };
}

function ogImageMimeType(url: string): string {
  const path = url.split('?')[0].toLowerCase();
  if (path.endsWith('.webp')) return 'image/webp';
  if (path.endsWith('.jpg') || path.endsWith('.jpeg')) return 'image/jpeg';
  return 'image/png';
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  path,
  lang: langProp,
  openGraph,
  noIndex = false,
  jsonLd,
  additionalMeta = [],
}) => {
  const storeLang = useLanguageStore((s) => s.language);
  const lang = langProp ?? storeLang;
  const pageTitle = buildPageTitle(title);
  const pageUrl = canonical || (path ? absoluteUrl(path) : absoluteUrl('/'));
  const ogTitle = openGraph?.title || pageTitle;
  const ogDescription = openGraph?.description || description;
  const ogImage = toAbsoluteOgImage(openGraph?.image || DEFAULT_OG_IMAGE);
  const ogImageAlt = openGraph?.imageAlt || DEFAULT_OG_IMAGE_ALT;
  const ogType = openGraph?.type || 'website';
  const ogUrl = openGraph?.url || pageUrl;

  React.useEffect(() => {
    document.title = pageTitle;
    document.documentElement.lang = lang;

    upsertLinkTag('canonical', pageUrl);

    upsertMetaTag({
      name: 'robots',
      content: noIndex
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    });
    upsertMetaTag({ name: 'description', content: description });
    upsertMetaTag({ name: 'author', content: SITE_NAME });

    // Open Graph
    upsertMetaTag({ property: 'og:site_name', content: SITE_NAME_FULL });
    upsertMetaTag({ property: 'og:locale', content: lang === 'en' ? 'en_US' : 'fr_FR' });
    upsertMetaTag({
      property: 'og:locale:alternate',
      content: lang === 'en' ? 'fr_FR' : 'en_US',
    });
    upsertMetaTag({ property: 'og:type', content: ogType });
    upsertMetaTag({ property: 'og:title', content: ogTitle });
    upsertMetaTag({ property: 'og:description', content: ogDescription });
    upsertMetaTag({ property: 'og:url', content: ogUrl });
    upsertMetaTag({ property: 'og:image', content: ogImage });
    upsertMetaTag({ property: 'og:image:secure_url', content: ogImage });
    upsertMetaTag({ property: 'og:image:type', content: ogImageMimeType(ogImage) });
    upsertMetaTag({ property: 'og:image:width', content: String(OG_IMAGE_WIDTH) });
    upsertMetaTag({ property: 'og:image:height', content: String(OG_IMAGE_HEIGHT) });
    upsertMetaTag({ property: 'og:image:alt', content: ogImageAlt });

    // Twitter
    upsertMetaTag({ name: 'twitter:card', content: 'summary_large_image' });
    upsertMetaTag({ name: 'twitter:title', content: ogTitle });
    upsertMetaTag({ name: 'twitter:description', content: ogDescription });
    upsertMetaTag({ name: 'twitter:image', content: ogImage });
    upsertMetaTag({ name: 'twitter:image:alt', content: ogImageAlt });

    additionalMeta.forEach((m) => upsertMetaTag(m));

    upsertJsonLd('seo-jsonld-core', personWebSiteJsonLd());

    if (jsonLd) {
      const payload = Array.isArray(jsonLd)
        ? { '@context': 'https://schema.org', '@graph': jsonLd }
        : { '@context': 'https://schema.org', ...jsonLd };
      upsertJsonLd('seo-jsonld-page', payload);
    }
  }, [
    additionalMeta,
    description,
    jsonLd,
    lang,
    noIndex,
    ogDescription,
    ogImage,
    ogImageAlt,
    ogTitle,
    ogType,
    ogUrl,
    pageTitle,
    pageUrl,
  ]);

  return null;
};

export const SEOProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => children;
