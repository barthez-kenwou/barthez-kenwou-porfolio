import type { IBlog } from '@/entities/blogs';
import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '@/shared/config/site';
import { getBlogPathSlug } from '@/shared/lib/entity-slug';

export type BlogShareLocale = 'fr' | 'en';

export type BlogSharePayload = {
  url: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  /** Prefixed tags without spaces, e.g. ["CICD", "DevOps"] */
  hashtags: string[];
  /** Ready-made channel strings */
  tweet: string;
  emailSubject: string;
  emailBody: string;
  clipboard: string;
  facebookHref: string;
  linkedinHref: string;
  xHref: string;
  emailHref: string;
};

function stripMarkdownLite(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]+`/g, ' ')
    .replace(/!\[[^\]]*]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]*)]\([^)]+\)/g, '$1')
    .replace(/[#>*_~|-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function truncate(text: string, max: number): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

/** Absolute HTTPS URL for OG / share previews (cover or site default). */
export function toAbsoluteMediaUrl(url?: string | null): string {
  if (!url?.trim()) return DEFAULT_OG_IMAGE;
  const u = url.trim();
  if (u.startsWith('https://') || u.startsWith('http://')) return u;
  if (u.startsWith('//')) return `https:${u}`;
  return absoluteUrl(u.startsWith('/') ? u : `/${u}`);
}

function normalizeHashtag(tag: string): string {
  return tag
    .replace(/^#/, '')
    .replace(/[^\p{L}\p{N}_]/gu, '')
    .trim();
}

/**
 * Canonical share payload for a blog post — used by the floating rail
 * and kept in sync with OG/Twitter meta on the detail page.
 */
export function buildBlogSharePayload(
  post: IBlog,
  locale: BlogShareLocale,
): BlogSharePayload {
  const isFr = locale === 'fr';
  const slug = getBlogPathSlug(post);
  const url = absoluteUrl(`/blog/${slug}`);
  const title = (isFr ? post.titleFr : post.titleEn || post.titleFr).trim();
  const rawExcerpt =
    (isFr
      ? post.excerptFr || post.contentFr
      : post.excerptEn || post.excerptFr || post.contentEn) || '';
  const excerpt = truncate(stripMarkdownLite(rawExcerpt), 180);
  const image = toAbsoluteMediaUrl(post.image);
  const author = post.author?.trim() || SITE_NAME;
  const hashtags = (post.tags ?? [])
    .map(normalizeHashtag)
    .filter(Boolean)
    .slice(0, 5);

  const hook = isFr
    ? 'Article technique de mon blog'
    : 'Technical article from my blog';
  const tweet = truncate(
    [
      title,
      excerpt ? truncate(excerpt, 110) : '',
      hashtags.length ? hashtags.map((h) => `#${h}`).join(' ') : '',
    ]
      .filter(Boolean)
      .join('\n\n'),
    240,
  );

  const emailSubject = `${title} — ${SITE_NAME}`;
  const emailBody = [
    title,
    '',
    excerpt,
    '',
    isFr ? `Lire l’article : ${url}` : `Read the article: ${url}`,
    '',
    `— ${author}`,
    SITE_URL,
  ].join('\n');

  const clipboard = [
    title,
    '',
    excerpt,
    '',
    url,
    hashtags.length ? hashtags.map((h) => `#${h}`).join(' ') : '',
    '',
    `— ${author} · ${hook}`,
  ]
    .filter((line, i, arr) => !(line === '' && arr[i - 1] === ''))
    .join('\n')
    .trim();

  const encUrl = encodeURIComponent(url);
  const encTitle = encodeURIComponent(title);
  const encExcerpt = encodeURIComponent(excerpt);
  const encTweet = encodeURIComponent(tweet);
  const encHashtags = encodeURIComponent(hashtags.join(','));

  return {
    url,
    title,
    excerpt,
    image,
    author,
    hashtags,
    tweet,
    emailSubject,
    emailBody,
    clipboard,
    facebookHref: `https://www.facebook.com/sharer/sharer.php?u=${encUrl}&quote=${encTitle}`,
    // title + summary help LinkedIn compose a richer share before OG scrape resolves
    linkedinHref: `https://www.linkedin.com/shareArticle?mini=true&url=${encUrl}&title=${encTitle}&summary=${encExcerpt}&source=${encodeURIComponent(SITE_NAME)}`,
    xHref: `https://twitter.com/intent/tweet?text=${encTweet}&url=${encUrl}${
      hashtags.length ? `&hashtags=${encHashtags}` : ''
    }`,
    emailHref: `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`,
  };
}
