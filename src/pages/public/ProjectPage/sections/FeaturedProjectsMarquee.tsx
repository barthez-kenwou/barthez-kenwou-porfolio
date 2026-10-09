import React, { useMemo } from 'react';
import { Marquee } from '@/shared/ui/marquee';
import { usePublicProjects } from '@/entities/projets/hooks/useProjects';
import { FeaturedProjectCard } from '@/entities/projets';
import { QueryState } from '@/shared/ui/QueryState';

export const FeaturedProjectsMarquee: React.FC = () => {
  const { data, isPending, isError, error } = usePublicProjects();

  const featuredProjects = useMemo(() => {
    const items = data?.data.items ?? [];
    return items.filter((p) => p.isFeatured && p.isPublished !== false);
  }, [data]);

  if (!isPending && !isError && featuredProjects.length === 0) return null;

  return (
    <section className="mb-8 relative w-full max-w-full overflow-hidden bg-background">
      <QueryState
        isPending={isPending}
        isError={isError}
        errorMessage={error instanceof Error ? error.message : undefined}
        source={data?.source}
      >
        <div className="relative w-full overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-4 md:w-64 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-4 md:w-64 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <Marquee pauseOnHover className="[--duration:40s] py-.5 border">
            {featuredProjects.map((project) => (
              <div key={project.id} className="mx-0">
                <FeaturedProjectCard project={project} />
              </div>
            ))}
          </Marquee>
        </div>
      </QueryState>
    </section>
  );
};
