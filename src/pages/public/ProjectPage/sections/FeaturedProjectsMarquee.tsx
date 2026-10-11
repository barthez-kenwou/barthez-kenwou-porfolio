import React, { useMemo } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { usePublicProjects } from '@/entities/projets/hooks/useProjects';
import type { IProject } from '@/entities/projets/model/project.types';
import { QueryState } from '@/shared/ui/QueryState';
import { Marquee } from '@/shared/ui/marquee';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { getProjectPathSlug } from '@/shared/lib/entity-slug';
import { cn } from '@/shared/lib/utils';

const MAX_DESKTOP = 8;
const MAX_MOBILE = 4;

function pickSignatureProjects(items: IProject[], limit: number): IProject[] {
  const featured = items.filter((p) => p.isFeatured && p.isPublished !== false);
  const ranked = [...featured].sort((a, b) => {
    const score = (p: IProject) =>
      (p.metrics && Object.keys(p.metrics).length > 0 ? 2 : 0) +
      (p.impactFr?.length || p.impactEn?.length ? 1 : 0) +
      (p.images?.length ? 0.5 : 0);
    return score(b) - score(a);
  });
  return ranked.slice(0, limit);
}

function formatMetricLabel(key: string) {
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]/g, ' ')
    .toUpperCase();
}

function metricEntries(project: IProject, limit = 3) {
  if (!project.metrics) return [];
  return Object.entries(project.metrics).slice(0, limit);
}

/** First meaningful category token for narrow screens */
function shortCategory(category: string) {
  const first = category.split('•')[0]?.trim();
  return first || category;
}

/**
 * Mobile: editorial poster for the marquee track — media and copy as separate planes.
 */
const SignaturePosterMobile: React.FC<{
  project: IProject;
  isFr: boolean;
  index: number;
}> = ({ project, isFr, index }) => {
  const title = isFr ? project.titleFr : project.titleEn;
  const description = isFr ? project.descriptionFr : project.descriptionEn;
  const href = `/projects/${getProjectPathSlug(project)}`;
  const cover = project.images[0] || project.preview || '';
  const metrics = metricEntries(project, 2);

  return (
    <Link
      to={href}
      className={cn(
        'group/poster flex w-[min(78vw,19.5rem)] shrink-0 flex-col overflow-hidden rounded-lg',
        'border border-border/60 bg-card shadow-sm',
        'active:scale-[0.992] transition-transform duration-200',
      )}
      aria-label={title}
    >
      <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
        {cover ? (
          <img
            src={cover}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/poster:scale-[1.04]"
          />
        ) : null}
        <div className="absolute inset-0 bg-linear-to-t from-black/35 to-transparent" aria-hidden />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className="rounded-md border border-white/20 bg-black/45 px-2 py-0.5 font-heading text-[10px] font-semibold tabular-nums text-white backdrop-blur-md">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="max-w-[10rem] truncate rounded-md border border-white/15 bg-black/40 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-md">
            {shortCategory(project.category)}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 px-4 py-4">
        {project.role && (
          <p className="truncate text-[11px] font-medium text-muted-foreground">{project.role}</p>
        )}

        <h3 className="font-heading line-clamp-2 text-[1.05rem] font-semibold leading-snug tracking-tight text-foreground">
          {title}
        </h3>

        <p className="line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
          {description}
        </p>

        {metrics.length > 0 && (
          <dl className="mt-1 grid grid-cols-2 gap-2">
            {metrics.map(([label, value]) => (
              <div
                key={label}
                className="min-w-0 rounded-md border border-border/50 bg-muted/40 px-2.5 py-2"
              >
                <dt className="truncate text-[9px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                  {formatMetricLabel(label)}
                </dt>
                <dd className="mt-0.5 truncate font-heading text-xs font-semibold text-foreground">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          {isFr ? "Lire l'étude de cas" : 'Read the case study'}
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/poster:translate-x-0.5 group-hover/poster:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
};

/**
 * Desktop: cinematic landscape band for the marquee track.
 */
const SignatureBandDesktop: React.FC<{ project: IProject; isFr: boolean }> = ({
  project,
  isFr,
}) => {
  const title = isFr ? project.titleFr : project.titleEn;
  const description = isFr ? project.descriptionFr : project.descriptionEn;
  const href = `/projects/${getProjectPathSlug(project)}`;
  const cover = project.images[0] || project.preview || '';
  const metrics = metricEntries(project, 3);

  return (
    <Link
      to={href}
      className={cn(
        'group/band relative block h-[380px] w-[44rem] shrink-0 overflow-hidden rounded-lg lg:h-[400px] lg:w-[52rem]',
        'border border-border/60 bg-card shadow-sm',
        'transition-[border-color,box-shadow] duration-300',
        'hover:border-primary/35 hover:shadow-md',
        'dark:border-transparent dark:bg-transparent dark:shadow-none',
        'dark:ring-1 dark:ring-white/10 dark:hover:ring-white/25',
        'dark:hover:shadow-[0_20px_60px_-28px_rgba(0,0,0,0.55)]',
      )}
      aria-label={title}
    >
      {cover ? (
        <img
          src={cover}
          alt=""
          loading="lazy"
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-transform duration-[1.1s] ease-out group-hover/band:scale-110',
            'scale-105 brightness-[1.02] contrast-[0.98]',
            'dark:brightness-100 dark:contrast-100',
          )}
        />
      ) : (
        <div className="absolute inset-0 bg-muted" />
      )}

      <div
        className={cn(
          'absolute inset-0',
          'bg-linear-to-t from-background via-background/75 to-background/15',
          'dark:from-black/90 dark:via-black/50 dark:to-black/20',
        )}
        aria-hidden
      />
      <div
        className={cn(
          'absolute inset-0',
          'bg-linear-to-r from-background/70 via-background/25 to-transparent',
          'dark:from-black/55 dark:via-black/20 dark:to-transparent',
        )}
        aria-hidden
      />
      <div
        className={cn(
          'absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/band:opacity-100',
          'bg-[radial-gradient(ellipse_at_20%_90%,hsl(var(--primary)/0.12),transparent_55%)]',
          'dark:bg-[radial-gradient(ellipse_at_20%_90%,hsl(var(--primary)/0.28),transparent_50%)]',
        )}
        aria-hidden
      />

      <div className="relative z-10 flex h-full flex-col justify-end gap-3.5 p-8">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span
            className={cn(
              'max-w-full truncate rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] backdrop-blur-md',
              'border border-border/70 bg-background/80 text-foreground',
              'dark:border-white/15 dark:bg-black/45 dark:text-white/95',
            )}
          >
            {project.category}
          </span>
          {project.role && (
            <span className="truncate text-xs font-medium text-muted-foreground dark:text-white/60">
              {project.role}
            </span>
          )}
        </div>

        <div className="max-w-2xl space-y-2">
          <h3 className="font-heading line-clamp-2 text-[1.75rem] font-semibold leading-snug tracking-tight text-foreground dark:text-white">
            {title}
          </h3>
          <p className="line-clamp-2 max-w-xl text-sm leading-relaxed text-muted-foreground dark:text-white/72">
            {description}
          </p>
        </div>

        {metrics.length > 0 && (
          <div className="flex gap-2 overflow-hidden pt-0.5">
            {metrics.map(([label, value]) => (
              <div
                key={label}
                className={cn(
                  'min-w-0 max-w-[11.5rem] rounded-md px-3 py-2 backdrop-blur-md',
                  'border border-border/60 bg-background/75',
                  'dark:border-white/12 dark:bg-black/35',
                )}
              >
                <p className="truncate text-[9px] font-medium uppercase tracking-[0.12em] text-muted-foreground dark:text-white/50">
                  {formatMetricLabel(label)}
                </p>
                <p className="truncate font-heading text-sm font-semibold text-foreground dark:text-white">
                  {value}
                </p>
              </div>
            ))}
          </div>
        )}

        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary dark:text-white">
          {isFr ? "Lire l'étude de cas" : 'Read the case study'}
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/band:translate-x-0.5 group-hover/band:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
};

export const FeaturedProjectsMarquee: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { language } = useLanguageStore();
  const isFr = language === 'fr' || Boolean(i18n.language?.startsWith('fr'));
  const { data, isPending, isError, error } = usePublicProjects();

  const allSignature = useMemo(
    () => pickSignatureProjects(data?.data.items ?? [], MAX_DESKTOP),
    [data],
  );
  const mobileSignature = useMemo(() => allSignature.slice(0, MAX_MOBILE), [allSignature]);

  if (!isPending && !isError && allSignature.length === 0) return null;

  const desktopRepeat = allSignature.length <= 2 ? 4 : allSignature.length <= 4 ? 3 : 2;
  const mobileRepeat = mobileSignature.length <= 2 ? 5 : mobileSignature.length <= 3 ? 4 : 3;

  return (
    <section className="relative mb-14 mt-6 w-full max-w-full border-t border-border/50 pt-10 md:mb-16 md:mt-8 md:pt-14">
      <div className="mb-6 flex items-baseline gap-3 md:mb-8">
        <span className="h-px w-6 shrink-0 translate-y-[-0.35em] bg-primary" aria-hidden />
        <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground md:text-xl mb-0!">
          {t('projects.featuredTitle')}
        </h2>
      </div>

      <QueryState
        isPending={isPending}
        isError={isError}
        errorMessage={error instanceof Error ? error.message : undefined}
        source={data?.source}
      >
        {/* Mobile: poster cards in a clean horizontal marquee */}
        <div className="relative -mx-4 md:hidden">
          {mobileSignature.length === 1 ? (
            <div className="px-4">
              <SignaturePosterMobile project={mobileSignature[0]} isFr={isFr} index={0} />
            </div>
          ) : (
            <>
              <div
                className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-linear-to-r from-background via-background/85 to-transparent"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-linear-to-l from-background via-background/85 to-transparent"
                aria-hidden
              />
              <Marquee
                pauseOnHover
                repeat={mobileRepeat}
                className="p-0 py-0.5 [--duration:48s] [--gap:0.85rem]"
              >
                {mobileSignature.map((project, index) => (
                  <SignaturePosterMobile
                    key={project.id}
                    project={project}
                    isFr={isFr}
                    index={index}
                  />
                ))}
              </Marquee>
            </>
          )}
        </div>

        {/* Desktop: cinematic marquee bands */}
        <div className="relative -mx-4 hidden md:block md:-mx-10 lg:-mx-14">
          {allSignature.length === 1 ? (
            <div className="flex justify-center px-4 md:px-10 lg:px-14">
              <SignatureBandDesktop project={allSignature[0]} isFr={isFr} />
            </div>
          ) : (
            <>
              <div
                className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-background via-background/80 to-transparent"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-background via-background/80 to-transparent"
                aria-hidden
              />
              <Marquee
                pauseOnHover
                repeat={desktopRepeat}
                className="p-0 py-1 [--duration:90s] [--gap:1.25rem]"
              >
                {allSignature.map((project) => (
                  <SignatureBandDesktop key={project.id} project={project} isFr={isFr} />
                ))}
              </Marquee>
            </>
          )}
        </div>
      </QueryState>
    </section>
  );
};
