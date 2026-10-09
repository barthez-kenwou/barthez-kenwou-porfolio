import { Link } from 'react-router-dom';
import { AdminPageHeader, useAdminDashboard } from '@/features/admin-cms';
import { isApiError } from '@/shared/api';
import { QueryState } from '@/shared/ui/QueryState';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { adminPath } from '@/shared/config/admin';
import { Badge } from '@/shared/ui/badge';
import { cn } from '@/shared/lib/utils';

/** Lightweight stand-in until Plausible CE API is wired. */
const analyticsMock = {
  visitors7d: 1284,
  pageviews7d: 3921,
  bounce: '41%',
  top: [
    { path: '/projects', views: 812 },
    { path: '/blog', views: 640 },
    { path: '/', views: 518 },
    { path: '/services', views: 291 },
  ],
  topBlogs: [
    { slug: 'ci-cd-github-actions-zero-to-expert', views: 418 },
    { slug: 'nodejs-api-performance-2026', views: 296 },
    { slug: 'aws-iam-security-deep-dive', views: 241 },
  ],
  topProjects: [
    { id: 1, label: 'NEXUS ERP', views: 512 },
    { id: 25, label: 'DHJ', views: 187 },
    { id: 12, label: 'GTA Academy', views: 164 },
  ],
};

export function AdminDashboardPage() {
  const { language } = useLanguageStore();
  const fr = language === 'fr';
  const { data, isPending, isError, error } = useAdminDashboard();

  const publishedProjects = data?.publishedProjects ?? 0;
  const publishedBlogs = data?.publishedBlogs ?? 0;
  const newContactResponses = data?.newContactResponses ?? 0;
  const pendingTestimonials = data?.pendingTestimonials ?? 0;

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
  ];

  return (
    <div className="space-y-8 md:space-y-10">
      <AdminPageHeader title={fr ? 'Tableau de bord' : 'Dashboard'} />

      <QueryState
        isPending={isPending}
        isError={isError}
        errorMessage={isApiError(error) ? error.message : undefined}
        variant="page"
      >
        {attention.length > 0 ? (
          <section className="mb-8 space-y-2 md:hidden">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {fr ? 'À traiter' : 'Needs you'}
            </h2>
            <div className="space-y-2">
              {attention.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex min-h-14 items-center justify-between gap-3 rounded-xl border px-4 py-3',
                    'active:scale-[0.99] transition-transform',
                    item.tone === 'warning'
                      ? 'border-amber-500/30 bg-amber-500/10'
                      : 'border-primary/30 bg-primary/10',
                  )}
                >
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.detail}</p>
                  </div>
                  <span className="text-lg text-muted-foreground">→</span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="grid gap-px overflow-hidden rounded-xl border border-border/70 bg-border/70 grid-cols-2 lg:grid-cols-4">
          {pulse.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="min-h-[5.5rem] bg-card px-4 py-4 transition-colors active:bg-muted/40 sm:px-5 sm:py-5 hover:bg-muted/30"
            >
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground sm:text-[11px]">
                {item.label}
              </p>
              <p className="mt-2 text-xl font-semibold tracking-tight tabular-nums sm:text-2xl">
                {item.value}
              </p>
              {item.hint ? (
                <Badge variant="warning" className="mt-2">
                  {item.hint}
                </Badge>
              ) : (
                <p className="mt-2 text-xs text-muted-foreground/80">→</p>
              )}
            </Link>
          ))}
        </section>

        <section className="mt-8 grid gap-4 sm:gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-xl border border-border/70 bg-card/50 p-4 sm:p-6">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-sm font-semibold tracking-tight">
                {fr ? 'Audience · 7 jours' : 'Audience · 7 days'}
              </h2>
              <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Plausible CE
              </span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 sm:mt-6 sm:gap-4">
              {[
                { k: fr ? 'Visiteurs' : 'Visitors', v: analyticsMock.visitors7d },
                { k: fr ? 'Pages vues' : 'Pageviews', v: analyticsMock.pageviews7d },
                { k: 'Bounce', v: analyticsMock.bounce },
              ].map((m) => (
                <div key={m.k}>
                  <p className="text-[10px] text-muted-foreground sm:text-[11px]">{m.k}</p>
                  <p className="mt-1 text-lg font-semibold tabular-nums tracking-tight sm:text-xl">
                    {m.v}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-5 sm:mt-8 sm:grid-cols-2 sm:gap-6">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  {fr ? 'Articles' : 'Articles'}
                </p>
                <ul className="mt-3 space-y-2.5">
                  {analyticsMock.topBlogs.map((row) => (
                    <li key={row.slug} className="flex items-center justify-between gap-3 text-sm">
                      <Link
                        to={adminPath('blogs')}
                        className="truncate py-0.5 text-foreground/90 hover:text-primary"
                      >
                        {row.slug}
                      </Link>
                      <span className="tabular-nums text-muted-foreground">{row.views}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  {fr ? 'Projets' : 'Projects'}
                </p>
                <ul className="mt-3 space-y-2.5">
                  {analyticsMock.topProjects.map((row) => (
                    <li key={row.id} className="flex items-center justify-between gap-3 text-sm">
                      <Link
                        to={adminPath('projects', String(row.id))}
                        className="truncate py-0.5 text-foreground/90 hover:text-primary"
                      >
                        {row.label}
                      </Link>
                      <span className="tabular-nums text-muted-foreground">{row.views}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="mt-5 text-[11px] leading-relaxed text-muted-foreground sm:mt-6">
              {fr
                ? 'Chiffres illustratifs. Brancher l’API Plausible CE pour du live.'
                : 'Illustrative figures. Wire Plausible CE API for live data.'}
            </p>
          </div>

          <div className="rounded-xl border border-border/70 bg-card/50 p-4 sm:p-6">
            <h2 className="text-sm font-semibold tracking-tight">
              {fr ? 'Pages fortes' : 'Top pages'}
            </h2>
            <ul className="mt-4 space-y-3">
              {analyticsMock.top.map((row, i) => (
                <li key={row.path} className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="truncate">{row.path}</span>
                  </span>
                  <span className="tabular-nums text-muted-foreground">{row.views}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </QueryState>
    </div>
  );
}
