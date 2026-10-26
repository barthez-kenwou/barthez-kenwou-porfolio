import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { SpectrumButton } from '@/shared/ui/SpectrumButton';
import { trackContactClick, trackCtaClick, trackOutboundClick } from '@/app/lib/analytics';
import type { IProject } from '@/entities/projets/model/project.types';

type CTADetailsSectionProps = {
  project: IProject;
  sectionRef?: React.Ref<HTMLElement>;
};

export const CTADetailsSection: React.FC<CTADetailsSectionProps> = ({ project, sectionRef }) => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';
  const title = isFr ? project.titleFr : project.titleEn;
  const contactTo = `/contact?from=projects&article=${encodeURIComponent(title)}`;
  const hasGithub = Boolean(project.github && project.github !== '#');

  return (
    <section ref={sectionRef} className="mb-0 px-4 md:px-10 lg:px-14">
      <div className="border-t border-border/50 pt-10 pb-2 md:pt-14">
        <div className="mx-auto flex max-w-xl flex-col items-start text-left sm:items-center sm:text-center">
          <h2 className="mb-2 font-heading text-lg font-semibold leading-snug tracking-tight text-foreground sm:text-xl md:text-[1.35rem]">
            {isFr ? 'Un besoin proche de celui-ci ?' : 'A need close to this one?'}
          </h2>

          <p className="mb-6 max-w-md text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
            {isFr
              ? 'Si l’approche ou le niveau d’exigence vous convient, je suis disponible pour un échange direct.'
              : 'If the approach or the bar fits, I’m open to a direct conversation.'}
          </p>

          <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:items-center">
            <SpectrumButton asChild variant="solid" size="default">
              <Link
                to={contactTo}
                onClick={() => {
                  trackContactClick('project_detail_cta');
                  trackCtaClick('contact', 'project_detail_cta', contactTo);
                }}
                onMouseEnter={() => {
                  void import('@/app/routes/prefetch').then((m) => m.prefetchRoute('/contact'));
                }}
                onTouchStart={() => {
                  void import('@/app/routes/prefetch').then((m) => m.prefetchRoute('/contact'));
                }}
              >
                {isFr ? 'Discuter d’un projet' : 'Discuss a project'}
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </SpectrumButton>

            {hasGithub ? (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  if (project.github) {
                    trackOutboundClick(project.github, 'project_detail_github');
                  }
                }}
                className="text-[12px] font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline sm:text-[13px]"
              >
                {isFr ? 'Ou ouvrir le dépôt GitHub' : 'Or open the GitHub repo'}
              </a>
            ) : (
              <Link
                to="/projects"
                onClick={() => trackCtaClick('projects', 'project_detail_cta', '/projects')}
                className="text-[12px] font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline sm:text-[13px]"
              >
                {isFr ? 'Ou parcourir tous les projets' : 'Or browse all projects'}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
