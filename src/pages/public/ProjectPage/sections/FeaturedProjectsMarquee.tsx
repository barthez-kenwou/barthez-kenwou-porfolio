import React from 'react';
import { Marquee } from '@/shared/ui/marquee';
import { projectsData } from '@/entities/projets/api/mocks/projectData.mocks';
import { FeaturedProjectCard } from '@/entities/projets';

export const FeaturedProjectsMarquee: React.FC = () => {
  const featuredProjects = projectsData.filter((p) => p.isFeatured && p.isPublished !== false);

  if (featuredProjects.length === 0) return null;

  return (
    <section className="mb-8 relative w-full max-w-full overflow-hidden bg-background">
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
    </section>
  );
};
