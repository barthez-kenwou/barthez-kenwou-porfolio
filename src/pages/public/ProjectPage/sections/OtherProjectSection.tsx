import React, { useMemo } from 'react';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { usePublicProjects } from '@/entities/projets/hooks/useProjects';
import { ProjectCard } from '@/entities/projets';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { QueryState } from '@/shared/ui/QueryState';
import { Marquee } from '@/shared/ui/marquee';

export const OtherProjectSection: React.FC<{ currentProjectId: string | number }> = ({
  currentProjectId,
}) => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';
  const { data, isPending, isError, error } = usePublicProjects();

  const relatedProjects = useMemo(() => {
    const items = data?.data.items ?? [];
    return items
      .filter((p) => p.id !== currentProjectId && p.isPublished !== false)
      .slice(0, 6);
  }, [data, currentProjectId]);

  if (!isPending && !isError && relatedProjects.length === 0) return null;

  const useMarquee = relatedProjects.length > 1;
  // Enough repeats to fill wide viewports without a visible loop seam
  const repeat = relatedProjects.length <= 2 ? 6 : relatedProjects.length <= 3 ? 4 : 3;

  return (
    <section className="mb-14 md:mb-20">
      <div className="mb-6 md:mb-8 flex items-end justify-between gap-4 border-t border-border/50 px-4 pt-8 md:px-10 md:pt-10 lg:px-14">
        <div className="flex items-baseline gap-3">
          <span className="w-6 h-px bg-primary shrink-0 translate-y-[-0.35em]" aria-hidden />
          <h2 className="font-heading text-lg md:text-xl font-semibold tracking-tight text-foreground !mb-0">
            {isFr ? 'Autres projets' : 'More work'}
          </h2>
        </div>
        <Button
          variant="ghost"
          className="hidden text-muted-foreground hover:text-primary md:flex"
          asChild
        >
          <Link to="/projects">
            {isFr ? 'Tous les projets' : 'All projects'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <QueryState
        isPending={isPending}
        isError={isError}
        errorMessage={error instanceof Error ? error.message : undefined}
        source={data?.source}
      >
        {!useMarquee ? (
          <div className="mx-auto max-w-md px-4 md:px-10 lg:px-14">
            <ProjectCard project={relatedProjects[0]} />
          </div>
        ) : (
          <div className="relative">
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-background to-transparent md:w-20"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-background to-transparent md:w-20"
              aria-hidden
            />
            <Marquee
              pauseOnHover
              repeat={repeat}
              className="p-0 [--duration:48s] [--gap:1rem] md:[--duration:56s] md:[--gap:1.25rem]"
            >
              {relatedProjects.map((project) => (
                <div
                  key={project.id}
                  className="w-[min(78vw,20rem)] shrink-0 md:w-[21rem]"
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </Marquee>
          </div>
        )}
      </QueryState>

      <div className="mt-6 px-4 md:hidden">
        <Button
          variant="outline"
          className="w-full border-border/50 text-foreground hover:border-primary/40 hover:text-primary"
          asChild
        >
          <Link to="/projects">{isFr ? 'Tous les projets' : 'All projects'}</Link>
        </Button>
      </div>
    </section>
  );
};
