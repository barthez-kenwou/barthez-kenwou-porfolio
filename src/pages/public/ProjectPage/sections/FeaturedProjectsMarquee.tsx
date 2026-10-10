import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { usePublicProjects } from '@/entities/projets/hooks/useProjects';
import { FeaturedProjectCard } from '@/entities/projets';
import { QueryState } from '@/shared/ui/QueryState';
import { Button } from '@/shared/ui/button';

const MAX_FEATURED = 10;

export const FeaturedProjectsMarquee: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isFr = i18n.language?.startsWith('fr');
  const { data, isPending, isError, error } = usePublicProjects();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const featuredProjects = useMemo(() => {
    const items = data?.data.items ?? [];
    return items.filter((p) => p.isFeatured && p.isPublished !== false).slice(0, MAX_FEATURED);
  }, [data]);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < maxScroll - 4);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener('scroll', updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      ro.disconnect();
    };
  }, [featuredProjects.length, updateArrows]);

  const scrollByCard = (direction: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-featured-card]');
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.85;
    el.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  if (!isPending && !isError && featuredProjects.length === 0) return null;

  return (
    <section className="relative mb-14 mt-4 w-full max-w-full">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
            {t('projects.featuredTitle')}
          </h2>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            {t('projects.featuredSubtitle')}
          </p>
        </div>

        {featuredProjects.length > 1 && (
          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={!canPrev}
              onClick={() => scrollByCard(-1)}
              className="rounded-md border-border/50"
              aria-label={isFr ? 'Projet précédent' : 'Previous project'}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={!canNext}
              onClick={() => scrollByCard(1)}
              className="rounded-md border-border/50"
              aria-label={isFr ? 'Projet suivant' : 'Next project'}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <QueryState
        isPending={isPending}
        isError={isError}
        errorMessage={error instanceof Error ? error.message : undefined}
        source={data?.source}
      >
        {featuredProjects.length === 1 ? (
          <div className="mx-auto max-w-2xl">
            <FeaturedProjectCard project={featuredProjects[0]} />
          </div>
        ) : (
          <div className="relative">
            <div
              ref={scrollerRef}
              className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2 scroll-smooth [scrollbar-width:thin]"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {featuredProjects.map((project) => (
                <div
                  key={project.id}
                  data-featured-card
                  className="w-[min(100%,22rem)] shrink-0 snap-start sm:w-[min(100%,28rem)] lg:w-[min(100%,32rem)]"
                >
                  <FeaturedProjectCard project={project} />
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 sm:hidden">
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={!canPrev}
                onClick={() => scrollByCard(-1)}
                className="rounded-md border-border/50"
                aria-label={isFr ? 'Projet précédent' : 'Previous project'}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={!canNext}
                onClick={() => scrollByCard(1)}
                className="rounded-md border-border/50"
                aria-label={isFr ? 'Projet suivant' : 'Next project'}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </QueryState>
    </section>
  );
};
