import React from 'react';
import { ExternalLink, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  AdminPageHeader,
  type AnalyticsPeriod,
  useAdminAnalytics,
  useAdminDashboard,
} from '@/features/admin-cms';
import { useNewsletterCampaigns, useNewsletterStats } from '@/features/newsletter';
import { isApiError } from '@/shared/api';
import { QueryState } from '@/shared/ui/QueryState';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { adminPath } from '@/shared/config/admin';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';
import { SignalsBarChart, SourcesBarChart, VisitorsLineChart } from './AnalyticsCharts';

type DashboardPeriod = Extract<AnalyticsPeriod, 'day' | '7d' | '30d'>;

const PERIODS: Array<{ value: DashboardPeriod; fr: string; en: string }> = [
  { value: 'day', fr: '24h', en: '24h' },
  { value: '7d', fr: '7j', en: '7d' },
  { value: '30d', fr: '30j', en: '30d' },
];

function periodLabel(period: DashboardPeriod, fr: boolean): string {
  if (period === 'day') return fr ? '24 heures' : '24 hours';
  if (period === '30d') return fr ? '30 jours' : '30 days';
  return fr ? '7 jours' : '7 days';
}

function formatDuration(seconds: number, fr: boolean): string {
  if (!seconds || seconds < 1) return fr ? '—' : '—';
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  if (m <= 0) return fr ? `${s}s` : `${s}s`;
  return `${m}m ${s.toString().padStart(2, '0')}s`;
}

function formatBounce(rate: number): string {
  if (!Number.isFinite(rate)) return '—';
  return `${Math.round(rate)}%`;
}

/** Product signals we care about — ignore Plausible auto-events (Outbound Link, etc.). */
const PRODUCT_SIGNALS = [
  { id: 'cta_click', fr: 'Clics CTA', en: 'CTA clicks' },
  { id: 'cv_download', fr: 'Téléch. CV', en: 'CV downloads' },
  { id: 'contact_click', fr: 'Contact', en: 'Contact' },
  { id: 'newsletter_subscribe', fr: 'Newsletter', en: 'Newsletter' },
  { id: 'video_complete', fr: 'Vidéo finie', en: 'Video complete' },
  { id: 'scroll_depth', fr: 'Scroll', en: 'Scroll depth' },
  { id: 'blog_read', fr: 'Lecture blog', en: 'Blog reads' },
  { id: 'project_view', fr: 'Vue projet', en: 'Project views' },
] as const;

const NOISE_EVENT_NAMES = new Set([
  'pageview',
  'engagement',
  'Outbound Link: Click',
  'File Download',
  '404',
  'Hash Change',
]);

function countForEvent(
  events: Array<{ name: string; visitors: number }> | undefined,
  id: string,
): number {
  if (!events?.length) return 0;
  return events
    .filter((row) => row.name === id || row.name.startsWith(`${id}:`))
    .reduce((sum, row) => sum + (Number(row.visitors) || 0), 0);
}

export function AdminDashboardPage() {
  const { language } = useLanguageStore();
  const fr = language === 'fr';
  const [period, setPeriod] = React.useState<DashboardPeriod>('7d');
  const { data, isPending, isError, error } = useAdminDashboard();
  const analytics = useAdminAnalytics(period);
  const newsletterStats = useNewsletterStats();
  const recentCampaigns = useNewsletterCampaigns({ limit: 1 });

  const publishedProjects = data?.publishedProjects ?? 0;
  const publishedBlogs = data?.publishedBlogs ?? 0;
  const newContactResponses = data?.newContactResponses ?? 0;
  const pendingTestimonials = data?.pendingTestimonials ?? 0;

  const activeSubscribers = newsletterStats.data?.active ?? 0;
  const pendingSubscribers = newsletterStats.data?.pending ?? 0;
  const latestCampaign = recentCampaigns.data?.items?.[0];
  const newsletterHint =
    pendingSubscribers > 0
      ? `${pendingSubscribers} ${fr ? 'en attente' : 'pending'}`
      : latestCampaign
        ? fr
          ? 'Dernière campagne'
          : 'Latest campaign'
        : undefined;

  const attention = [
    newContactResponses > 0
      ? {
          href: adminPath('contact-responses'),
          title: fr ? 'Messages à traiter' : 'Messages to triage',
          detail: `${newContactResponses} ${fr ? 'non lus' : 'unread'}`,
          tone: 'warning' as const,
        }
      : null,
    pendingTestimonials > 0
      ? {
          href: adminPath('testimonials'),
          title: fr ? 'Avis en attente' : 'Reviews pending',
          detail: `${pendingTestimonials} ${fr ? 'à valider' : 'to approve'}`,
          tone: 'primary' as const,
        }
      : null,
  ].filter(Boolean) as Array<{
    href: string;
    title: string;
    detail: string;
    tone: 'warning' | 'primary';
  }>;

  const pulse = [
    {
      label: fr ? 'Projets live' : 'Live projects',
      value: String(publishedProjects),
      href: adminPath('projects'),
    },
    {
      label: fr ? 'Articles live' : 'Live articles',
      value: String(publishedBlogs),
      href: adminPath('blogs'),
    },
    {
      label: fr ? 'Messages' : 'Inbox',
      value: String(newContactResponses),
      hint: newContactResponses
        ? `${newContactResponses} ${fr ? 'nouveaux' : 'new'}`
        : undefined,
      href: adminPath('contact-responses'),
    },
    {
      label: fr ? 'Avis à valider' : 'Pending reviews',
      value: String(pendingTestimonials),
      href: adminPath('testimonials'),
    },
    {
      label: 'Newsletter',
      value: String(activeSubscribers),
      hint: newsletterHint,
      href: adminPath('newsletter'),
    },
  ];

  const overview = analytics.data;
  const productSignals = PRODUCT_SIGNALS.map((signal) => ({
    ...signal,
    value: countForEvent(overview?.events, signal.id),
  }));
  const hasProductSignal = productSignals.some((row) => row.value > 0);
  const productBarRows = productSignals
    .filter((row) => row.value > 0)
    .map((row) => ({
      id: row.id,
      label: fr ? row.fr : row.en,
      value: row.value,
    }));
  const sourceBarRows = (overview?.topSources ?? []).map((row) => ({
    id: row.source,
    label: !row.source || row.source === 'Direct' ? 'Direct' : row.source,
    value: row.visitors,
  }));
  const otherProductEvents = (overview?.events ?? [])
    .filter(
      (row) =>
        row.name &&
        !NOISE_EVENT_NAMES.has(row.name) &&
        !PRODUCT_SIGNALS.some(
          (signal) => row.name === signal.id || row.name.startsWith(`${signal.id}:`),
        ),
    )
    .slice(0, 4);

  return (
    <div className="space-y-8 md:space-y-10">
      <AdminPageHeader
        title={fr ? 'Tableau de bord' : 'Dashboard'}
        actions={
          overview?.publicUrl ? (
            <Button variant="outline" size="sm" className="cursor-pointer" asChild>
              <a href={overview.publicUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="size-3.5" />
                Plausible
              </a>
            </Button>
          ) : null
        }
      />

      <QueryState
        isPending={isPending}
        isError={isError}
        errorMessage={isApiError(error) ? error.message : undefined}
      >
        {attention.length > 0 ? (
          <section className="grid gap-3 sm:grid-cols-2">
            {attention.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'cursor-pointer rounded-md border px-4 py-3 transition-colors',
                  item.tone === 'warning'
                    ? 'border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10'
                    : 'border-primary/30 bg-primary/5 hover:bg-primary/10',
                )}
              >
                <p className="cursor-default text-sm font-medium">{item.title}</p>
                <p className="mt-0.5 cursor-default text-xs text-muted-foreground">{item.detail}</p>
              </Link>
            ))}
          </section>
        ) : null}

        <section className="mt-2 grid grid-cols-3 gap-2 sm:gap-2.5 lg:grid-cols-5 lg:gap-3">
          {pulse.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="cursor-pointer rounded-md border border-border/70 bg-card/50 p-2.5 transition-colors hover:border-primary/40 hover:bg-card sm:p-3 lg:px-3 lg:py-2.5 [&_*]:cursor-pointer"
            >
              <p className="truncate text-[9px] uppercase tracking-[0.1em] text-muted-foreground sm:text-[10px] sm:tracking-[0.12em]">
                {item.label}
              </p>
              <p className="mt-1 text-base font-semibold tracking-tight tabular-nums sm:text-lg lg:text-xl">
                {item.value}
              </p>
              {item.hint ? (
                <Badge
                  variant="warning"
                  className="mt-1 max-w-full truncate text-[9px] sm:mt-1.5 sm:text-[10px]"
                >
                  {item.hint}
                </Badge>
              ) : (
                <p className="mt-1 text-[11px] text-muted-foreground/80 sm:mt-1.5">→</p>
              )}
            </Link>
          ))}
        </section>

        <section className="mt-8 grid gap-4 sm:gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-md border border-border/70 bg-card/50 p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="cursor-default text-sm font-semibold tracking-tight">
                  {fr ? `Audience · ${periodLabel(period, true)}` : `Audience · ${periodLabel(period, false)}`}
                </h2>
              </div>
              <div
                className="inline-flex rounded-md border border-border/70 bg-muted/30 p-0.5"
                role="group"
                aria-label={fr ? 'Période' : 'Period'}
              >
                {PERIODS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPeriod(p.value)}
                    className={cn(
                      'cursor-pointer rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors',
                      period === p.value
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {fr ? p.fr : p.en}
                  </button>
                ))}
              </div>
            </div>

            {analytics.isPending ? (
              <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                {fr ? 'Chargement des stats…' : 'Loading stats…'}
              </div>
            ) : analytics.isError ? (
              <p className="mt-6 cursor-default text-sm text-destructive">
                {isApiError(analytics.error)
                  ? analytics.error.message
                  : fr
                    ? 'Impossible de charger Plausible. Vérifie PLAUSIBLE_API_KEY côté API.'
                    : 'Could not load Plausible. Check PLAUSIBLE_API_KEY on the API.'}
              </p>
            ) : overview && overview.configured === false ? (
              <p className="mt-6 cursor-default text-sm text-muted-foreground">
                {fr
                  ? 'Plausible n’est pas branché : définis PLAUSIBLE_API_KEY dans le .env de l’API (VPS), puis redéploie.'
                  : 'Plausible is not wired: set PLAUSIBLE_API_KEY in the API .env on the VPS, then redeploy.'}
              </p>
            ) : (
              <>
                <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:grid-cols-4 sm:gap-4">
                  {[
                    { k: fr ? 'Visiteurs' : 'Visitors', v: overview?.visitors ?? 0 },
                    { k: fr ? 'Pages vues' : 'Pageviews', v: overview?.pageviews ?? 0 },
                    { k: 'Bounce', v: formatBounce(overview?.bounceRate ?? 0) },
                    {
                      k: fr ? 'Durée moy.' : 'Avg. duration',
                      v: formatDuration(overview?.visitDuration ?? 0, fr),
                    },
                  ].map((m) => (
                    <div key={m.k}>
                      <p className="cursor-default text-[10px] text-muted-foreground sm:text-[11px]">
                        {m.k}
                      </p>
                      <p className="mt-1 cursor-default text-lg font-semibold tabular-nums tracking-tight sm:text-xl">
                        {m.v}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 sm:mt-7">
                  <p className="cursor-default text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    {fr ? 'Tendance' : 'Trend'}
                  </p>
                  <VisitorsLineChart
                    className="mt-3"
                    series={overview?.timeseries ?? []}
                    fr={fr}
                  />
                </div>

                <div className="mt-6 grid gap-5 sm:mt-8 sm:grid-cols-2 sm:gap-6">
                  <div>
                    <p className="cursor-default text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                      {fr ? 'Articles' : 'Articles'}
                    </p>
                    <ul className="mt-3 space-y-2.5">
                      {(overview?.topBlogs ?? []).length === 0 ? (
                        <li className="cursor-default text-xs text-muted-foreground">
                          {fr ? 'Pas encore de données' : 'No data yet'}
                        </li>
                      ) : (
                        overview!.topBlogs.map((row) => (
                          <li
                            key={row.path}
                            className="flex items-center justify-between gap-3 text-sm"
                          >
                            <Link
                              to={adminPath('blogs')}
                              className="cursor-pointer truncate py-0.5 text-foreground/90 hover:text-primary"
                            >
                              {row.slug}
                            </Link>
                            <span className="cursor-default tabular-nums text-muted-foreground">
                              {row.views}
                            </span>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                  <div>
                    <p className="cursor-default text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                      {fr ? 'Projets' : 'Projects'}
                    </p>
                    <ul className="mt-3 space-y-2.5">
                      {(overview?.topProjects ?? []).length === 0 ? (
                        <li className="cursor-default text-xs text-muted-foreground">
                          {fr ? 'Pas encore de données' : 'No data yet'}
                        </li>
                      ) : (
                        overview!.topProjects.map((row) => (
                          <li
                            key={row.path}
                            className="flex items-center justify-between gap-3 text-sm"
                          >
                            <span className="cursor-default truncate py-0.5 text-foreground/90">
                              {row.slug}
                            </span>
                            <span className="cursor-default tabular-nums text-muted-foreground">
                              {row.views}
                            </span>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="cursor-default text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    {fr ? 'Sources' : 'Sources'}
                  </p>
                  <SourcesBarChart className="mt-3" rows={sourceBarRows} fr={fr} />
                </div>
              </>
            )}
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="rounded-md border border-border/70 bg-card/50 p-4 sm:p-6">
              <h2 className="cursor-default text-sm font-semibold tracking-tight">
                {fr ? 'Pages fortes' : 'Top pages'}
              </h2>
              {analytics.isPending ? (
                <p className="mt-4 cursor-default text-xs text-muted-foreground">…</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {(overview?.topPages ?? []).slice(0, 6).map((row, i) => (
                    <li key={row.path} className="flex items-center justify-between gap-3 text-sm">
                      <span className="flex min-w-0 items-center gap-2">
                        <span className="cursor-default font-mono text-[10px] text-muted-foreground">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="cursor-default truncate">{row.path}</span>
                      </span>
                      <span className="cursor-default tabular-nums text-muted-foreground">
                        {row.pageviews}
                      </span>
                    </li>
                  ))}
                  {(overview?.topPages?.length ?? 0) === 0 && !analytics.isError ? (
                    <li className="cursor-default text-xs text-muted-foreground">
                      {fr ? 'Pas encore de données' : 'No data yet'}
                    </li>
                  ) : null}
                </ul>
              )}
            </div>

            <div className="rounded-md border border-border/70 bg-card/50 p-4 sm:p-6">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="cursor-default text-sm font-semibold tracking-tight">
                  {fr ? 'Signaux produit' : 'Product signals'}
                </h2>
                <span className="cursor-default text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  {PERIODS.find((p) => p.value === period)?.[fr ? 'fr' : 'en']}
                </span>
              </div>
              <p className="mt-1 cursor-default text-[11px] text-muted-foreground">
                {fr
                  ? 'Actions clés du site public — hors pageviews auto.'
                  : 'Key public-site actions — excluding auto pageviews.'}
              </p>

              {analytics.isPending ? (
                <p className="mt-4 cursor-default text-xs text-muted-foreground">…</p>
              ) : !hasProductSignal && otherProductEvents.length === 0 ? (
                <p className="mt-5 cursor-default text-xs text-muted-foreground">
                  {fr
                    ? `Pas encore de signal produit sur ${periodLabel(period, true)}.`
                    : `No product signals in the last ${periodLabel(period, false)}.`}
                </p>
              ) : (
                <>
                  <SignalsBarChart className="mt-5" rows={productBarRows} fr={fr} />
                  {otherProductEvents.length > 0 ? (
                    <ul className="mt-5 space-y-2 border-t border-border/60 pt-4">
                      {otherProductEvents.map((row) => (
                        <li
                          key={row.name}
                          className="flex items-center justify-between gap-3 text-sm"
                        >
                          <span className="cursor-default truncate text-foreground/80">
                            {row.name.replace(/_/g, ' ')}
                          </span>
                          <span className="cursor-default tabular-nums text-muted-foreground">
                            {row.visitors}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </section>
      </QueryState>
    </div>
  );
}
