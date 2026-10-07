import { HeroSection } from './sections/HeroSection';
import { GridProject } from './sections/GridProject';
import { FeaturedProjectsMarquee } from './sections/FeaturedProjectsMarquee';
import { ProjectStatsSection } from './sections/ProjectStatsSection';
import { ProjectCTASection } from './sections/ProjectCTASection';
import { SEO } from '@/shared/ui/SEO/SEO';
import { useProjectFilters } from '@/features/projets-browse';

export const ProjectPage = () => {
  const filterState = useProjectFilters();

  return (
    <>
      <SEO
        path="/projects"
        title="Projets"
        description="Réalisations récentes - applications web, plateformes cloud et solutions DevOps conçues par Barthez Kenwou."
      />
      <div className="min-h-screen overflow-x-clip py-10 md:py-16 lg:py-20">
        {/* 1. Frame the journey */}
        <HeroSection />

        <div className="px-4 md:px-10 lg:px-14">
          {/* 2. Explore the work */}
          <GridProject filterState={filterState} />

          {/* 3. Highlight featured case studies */}
          <FeaturedProjectsMarquee />

          {/* 4. Credibility / impact */}
          <ProjectStatsSection />

          {/* 5. Convert: contact (prefilled) + GitHub */}
          <ProjectCTASection />
        </div>
      </div>
    </>
  );
};
