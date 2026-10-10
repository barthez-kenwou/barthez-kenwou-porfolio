/**
 * Privacy-first product analytics via Plausible CE.
 * Pageviews are automatic from the script in index.html.
 * Custom events go through `track()` → window.plausible.
 */

type PlausibleProps = Record<string, string | number | boolean | undefined>;

type PlausibleFn = {
  (event: string, options?: { props?: PlausibleProps }): void;
  q?: unknown[];
};

declare global {
  interface Window {
    plausible?: PlausibleFn;
  }
}

/** Canonical event names — keep in sync with Plausible goals / CMS engagement panel. */
export const AnalyticsEvents = {
  CtaClick: 'cta_click',
  CvDownload: 'cv_download',
  ContactClick: 'contact_click',
  ContactStart: 'contact_start',
  NewsletterSubscribe: 'newsletter_subscribe',
  OutboundClick: 'outbound_click',
  SocialClick: 'social_click',
  LocaleSwitch: 'locale_switch',
  ProjectFilter: 'project_filter',
  Share: 'share',
  ScrollDepth: 'scroll_depth',
  EngagementTime: 'engagement_time',
  VideoPlay: 'video_play',
  VideoProgress: 'video_progress',
  VideoComplete: 'video_complete',
  BlogRead: 'blog_read',
  ProjectView: 'project_view',
} as const;

export type AnalyticsEventName = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];

const DEDUPE_PREFIX = 'bk-analytics:';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function isAdminPath(pathname: string): boolean {
  return pathname.startsWith('/admin') || pathname.includes('/studio');
}

function shouldTrack(): boolean {
  if (!isBrowser()) return false;
  if (isAdminPath(window.location.pathname)) return false;
  return true;
}

function dedupeKey(event: string, key: string): string {
  return `${DEDUPE_PREFIX}${event}:${key}`;
}

function oncePerSession(event: string, key: string): boolean {
  if (!isBrowser()) return false;
  try {
    const storageKey = dedupeKey(event, key);
    if (sessionStorage.getItem(storageKey)) return false;
    sessionStorage.setItem(storageKey, '1');
    return true;
  } catch {
    return true;
  }
}

function sanitizeProps(props?: PlausibleProps): PlausibleProps | undefined {
  if (!props) return undefined;
  const out: PlausibleProps = {};
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || value === null) continue;
    // Never ship PII-looking fields
    if (/email|password|token|phone|name/i.test(key)) continue;
    out[key] = typeof value === 'string' ? value.slice(0, 120) : value;
  }
  return Object.keys(out).length ? out : undefined;
}

export function track(event: AnalyticsEventName | string, props?: PlausibleProps): void {
  if (!shouldTrack()) return;
  const clean = sanitizeProps(props);
  try {
    window.plausible?.(event, clean ? { props: clean } : undefined);
  } catch {
    // never break UX for analytics
  }
}

export function trackOnce(
  event: AnalyticsEventName | string,
  dedupe: string,
  props?: PlausibleProps,
): void {
  if (!oncePerSession(event, dedupe)) return;
  track(event, props);
}

export function trackCtaClick(ctaId: string, location: string, href?: string): void {
  track(AnalyticsEvents.CtaClick, { cta_id: ctaId, location, href });
}

export function trackCvDownload(locale: string, source: string): void {
  track(AnalyticsEvents.CvDownload, { locale, source });
}

export function trackContactClick(channel: string): void {
  track(AnalyticsEvents.ContactClick, { channel });
}

/** First focus on the contact form — once per session (funnel top). */
export function trackContactStart(source = 'contact_form'): void {
  trackOnce(AnalyticsEvents.ContactStart, source, { source });
}

export function trackNewsletterSubscribe(source: string, locale: string): void {
  track(AnalyticsEvents.NewsletterSubscribe, { source, locale });
}

export function trackOutboundClick(url: string, label?: string): void {
  track(AnalyticsEvents.OutboundClick, { url: url.slice(0, 120), label });
}

export function trackSocialClick(network: string, location?: string): void {
  track(AnalyticsEvents.SocialClick, {
    network: network.toLowerCase(),
    location,
  });
}

export function trackLocaleSwitch(from: string, to: string): void {
  if (from === to) return;
  track(AnalyticsEvents.LocaleSwitch, { from, to });
}

/** Project list filters — category / tech / role / status. */
export function trackProjectFilter(filter: string, tag: string): void {
  track(AnalyticsEvents.ProjectFilter, {
    filter,
    tag: tag.slice(0, 80),
  });
}

export function trackShare(
  channel: string,
  content: 'blog' | 'project',
  slug?: string,
): void {
  track(AnalyticsEvents.Share, {
    channel: channel.toLowerCase(),
    content,
    slug: slug?.slice(0, 80),
  });
}

export function trackScrollDepth(path: string, depth: 25 | 50 | 75 | 100): void {
  trackOnce(AnalyticsEvents.ScrollDepth, `${path}:${depth}`, { path, depth });
}

export function trackEngagementTime(path: string, seconds: number): void {
  trackOnce(AnalyticsEvents.EngagementTime, `${path}:${seconds}`, { path, seconds });
}

export function trackVideoPlay(videoId: string): void {
  trackOnce(AnalyticsEvents.VideoPlay, videoId, { video_id: videoId });
}

export function trackVideoProgress(videoId: string, percent: 25 | 50 | 75): void {
  trackOnce(AnalyticsEvents.VideoProgress, `${videoId}:${percent}`, {
    video_id: videoId,
    percent,
  });
}

export function trackVideoComplete(videoId: string): void {
  trackOnce(AnalyticsEvents.VideoComplete, videoId, { video_id: videoId });
}

export function trackBlogRead(slug: string, depth: 25 | 50 | 75 | 100): void {
  trackOnce(AnalyticsEvents.BlogRead, `${slug}:${depth}`, { slug, depth });
}

export function trackProjectView(slugOrId: string): void {
  trackOnce(AnalyticsEvents.ProjectView, slugOrId, { project: slugOrId });
}

class AnalyticsService {
  private initialized = false;

  init() {
    if (this.initialized) return;
    this.initialized = true;
  }

  track(event: { name: string; properties?: PlausibleProps }) {
    track(event.name, event.properties);
  }

  trackPageView(_page: string) {
    // Plausible auto pageviews handle SPA if configured; keep no-op for API compat.
  }

  trackError(error: Error, context?: PlausibleProps) {
    track('app_error', {
      message: error.message.slice(0, 80),
      ...sanitizeProps(context),
    });
  }
}

export const analytics = new AnalyticsService();
