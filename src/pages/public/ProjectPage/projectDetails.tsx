import { useEffect } from 'react';
import { ProjectNotFound } from './sections/ProjectNotFound';
import { HeroDetailSection } from './sections/HeroDetailSection';
import { ProjectOverviewSection } from './sections/ProjectOverviewSection';
import { ProblemSolutionSection } from './sections/ProblemSolutionSection';
import { ProjectVideoSection } from './sections/ProjectVideoSection';
import { TechStackSection } from './sections/TechStackSection';
import { ProjectGallerySection } from './sections/ProjectGallerySection';
import { ArchitectureTestingSection } from './sections/ArchitectureTestingSection';
import { ProjectDiagramsSection } from './sections/ProjectDiagramsSection';
import { ProjectScopeSection } from './sections/ProjectScopeSection';
import { ProjectTimelineSection } from './sections/ProjectTimelineSection';
import { ProjectDecisionsSection } from './sections/ProjectDecisionsSection';
import { ProjectSecurityInfraSection } from './sections/ProjectSecurityInfraSection';
import { ImpactSection } from './sections/ImpactSection';
import { ProjectMidCta, ProjectMidCta2 } from './sections/ProjectMidCta';
import { ProjectBeforeAfterSection } from './sections/ProjectBeforeAfterSection';
import { ProjectTestimonialSection } from './sections/ProjectTestimonialSection';
import { ProjectLessonsSection } from './sections/ProjectLessonsSection';
import { ProjectResourcesSection } from './sections/ProjectResourcesSection';
import { ProjectLinksSection } from './sections/ProjectLinksSection';
import { OtherProjectSection } from './sections/OtherProjectSection';
import { CTADetailsSection } from './sections/CTADetailsSection';
import { useParams } from 'react-router-dom';
import { SEO } from '@/shared/ui/SEO/SEO';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { useProject } from '@/entities/projets/hooks/useProjects';
import { truncateFonction } from '@/shared/ui/utils/truncateText/helpers';
import { getProjectPathSlug, parseEntityIdFromParam } from '@/shared/lib/entity-slug';
import { QueryState } from '@/shared/ui/QueryState';

export const ProjectDetailPage = () => {
  const { id, projectID } = useParams();
  const searchId = projectID || id;
  const projectId = parseEntityIdFromParam(searchId) ?? undefined;
  const { data: project, isPending, isError, error } = useProject(projectId);
  const { language } = useLanguageStore();
  const projectPath = project
    ? `/projects/${getProjectPathSlug(project)}`
    : `/projects/${searchId}`;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchId]);

  if (isPending || isError) {
    return (
      <div className="min-h-screen px-4 py-24 md:px-10 lg:px-14">
        <QueryState
          variant="page"
          isPending={isPending}
          isError={isError}
          errorMessage={error instanceof Error ? error.message : undefined}
        >
          {null}
        </QueryState>
      </div>
    );
  }

  if (!project || project.isPublished === false) return <ProjectNotFound />;

  return (
    <>
      <SEO
        path={projectPath}
        title={`${
          language === 'fr'
            ? truncateFonction(project?.titleFr || '', 60)
            : truncateFonction(project?.titleEn || '', 60)
        }`}
        description={`${
          language === 'fr'
            ? truncateFonction(project.descriptionFr || '', 160)
            : truncateFonction(project.descriptionEn || '', 160)
        }`}
        openGraph={{
          type: 'article',
          image: project.images?.[0] || project.preview,
          imageAlt: language === 'fr' ? project.titleFr : project.titleEn,
        }}
        jsonLd={{
          '@type': 'CreativeWork',
          name: language === 'fr' ? project.titleFr : project.titleEn,
          alternateName: language === 'fr' ? project.titleEn : project.titleFr,
          description: language === 'fr' ? project.descriptionFr : project.descriptionEn,
          image: project.images?.[0] || project.preview,
          url: `https://barthez-kenwou.dev${projectPath}`,
          author: {
            '@type': 'Person',
            name: 'Barthez Kenwou',
            url: 'https://barthez-kenwou.dev',
          },
          keywords: [
            ...(project.techStack?.frontend || []),
            ...(project.techStack?.backend || []),
            ...(project.techStack?.devops || []),
          ].join(', '),
        }}
      />

      <div className="min-h-screen">
        <HeroDetailSection project={project} />
        <ProjectOverviewSection project={project} />
        <ProblemSolutionSection project={project} />
        <ProjectVideoSection project={project} />
        <TechStackSection project={project} />
        <ProjectMidCta project={project} />
        <ProjectGallerySection project={project} />
        <ArchitectureTestingSection project={project} />
        <ProjectDiagramsSection project={project} />
        <ProjectScopeSection project={project} />
        <ProjectTimelineSection project={project} />
        <ProjectDecisionsSection project={project} />
        <ProjectSecurityInfraSection project={project} />
        <ImpactSection project={project} />
        <ProjectBeforeAfterSection project={project} />
        <ProjectMidCta2 project={project} />
        <ProjectTestimonialSection project={project} />
        <ProjectLessonsSection project={project} />
        <ProjectResourcesSection project={project} />
        <ProjectLinksSection project={project} />
        <OtherProjectSection currentProjectId={project.id} />
        <CTADetailsSection project={project} />
      </div>
    </>
  );
};
