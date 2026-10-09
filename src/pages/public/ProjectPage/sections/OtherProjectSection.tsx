import React, { useMemo } from 'react';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { usePublicProjects } from '@/entities/projets/hooks/useProjects';
import { ProjectCard } from '@/entities/projets';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { Marquee } from '@/shared/ui/marquee';
import { QueryState } from '@/shared/ui/QueryState';

export const OtherProjectSection: React.FC<{ currentProjectId: string | number }> = ({
  currentProjectId,
}) => {
  const { language } = useLanguageStore();
  const { data, isPending, isError, error } = usePublicProjects();

  const relatedProjects = useMemo(() => {
    const items = data?.data.items ?? [];
    return items
      .filter((p) => p.id !== currentProjectId && p.isPublished !== false)
      .slice(0, 6);
  }, [data, currentProjectId]);

  if (!isPending && !isError && relatedProjects.length === 0) return null;

  const useMarquee = relatedProjects.length > 1;

  return (
    <section className="mb-16 animate-fade-in-up px-4 md:px-10 lg:px-14">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="section-title mb-1 !text-left">
            {language === 'fr' ? 'Projets Similaires' : 'Related Projects'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {language === 'fr'
              ? "Découvrez d'autres réalisations qui pourraient vous intéresser."
              : 'Discover other projects that might interest you.'}
          </p>
        </div>
        <Button
          variant="ghost"
          className="hidden text-primary hover:bg-primary/10 hover:text-primary md:flex"
          asChild
        >
          <Link to="/projects">
            {language === 'fr' ? 'Voir tous les projets' : 'View all projects'}
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
        {useMarquee ? (
          <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-4 bg-gradient-to-r from-background to-transparent md:w-16" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-4 bg-gradient-to-l from-background to-transparent md:w-16" />
            <Marquee pauseOnHover repeat={3} className="[--duration:32s] [--gap:1rem] p-1">
              {relatedProjects.map((project) => (
                <div key={project.id} className="w-[min(88vw,380px)] shrink-0 md:w-[400px]">
                  <ProjectCard project={project} />
                </div>
              ))}
            </Marquee>
          </div>
        ) : relatedProjects[0] ? (
          <div className="mx-auto max-w-md">
            <ProjectCard project={relatedProjects[0]} />
          </div>
        ) : null}
      </QueryState>

      <Button
        variant="outline"
        className="mt-8 w-full border-border/50 text-foreground md:hidden"
        asChild
      >
        <Link to="/projects">
          {language === 'fr' ? 'Voir tous les projets' : 'View all projects'}
        </Link>
      </Button>
    </section>
  );
};
