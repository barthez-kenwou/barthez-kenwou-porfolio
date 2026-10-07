import { HeroSection } from './sections/HeroSection';
import { GridProject } from './sections/GridProject';
import { FeaturedProjectsMarquee } from './sections/FeaturedProjectsMarquee';
import { ProjectStatsSection } from './sections/ProjectStatsSection';
import { ProjectCTASection } from './sections/ProjectCTASection';
import { SEO } from '@/shared/ui/SEO/SEO';
import { useProjectFilters } from '@/features/projets-browse';
import { useLanguageStore } from '@/shared/state/useLanguageStore';

export const ProjectPage = () => {
  const filterState = useProjectFilters();
  const { language } = useLanguageStore();
  const isFr = language === 'fr';

  return (
    <>
      <SEO
        path="/projects"
        title={isFr ? 'Projets' : 'Projects'}
        description={
          isFr
            ? 'Études de cas: applications web, plateformes cloud et solutions DevOps livrées par Barthez Kenwou.'
            : 'Case studies: web apps, cloud platforms, and DevOps solutions delivered by Barthez Kenwou.'
        }
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
