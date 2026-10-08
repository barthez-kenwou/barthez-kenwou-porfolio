import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { SpectrumButton } from '@/shared/ui/SpectrumButton';
import { BrandAmbientField } from '@/shared/ui/BrandAmbientField';
import type { IProject } from '@/entities/projets/model/project.types';

type CTADetailsSectionProps = {
  project: IProject;
};

export const CTADetailsSection: React.FC<CTADetailsSectionProps> = ({ project }) => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';
  const title = isFr ? project.titleFr : project.titleEn;
  const contactTo = `/contact?from=projects&article=${encodeURIComponent(title)}`;
  const hasGithub = Boolean(project.github && project.github !== '#');

  return (
    <section className="mb-10 px-4 text-center md:mb-12 md:px-10 lg:px-14">
      <div className="relative z-10 overflow-hidden rounded-lg border border-border">
        <BrandAmbientField intensity="soft" />
        <div className="relative z-10 mx-auto w-full p-5 text-center sm:p-6 md:p-8">
          <div className="mx-auto flex max-w-xl flex-col items-center rounded-md border border-border/50 bg-background/70 px-4 py-5 shadow-sm backdrop-blur-md dark:bg-background/55 sm:px-6 sm:py-6">
            <h2 className="mb-2 font-heading text-lg font-bold leading-tight text-foreground sm:mb-3 sm:text-xl md:text-2xl">
              {isFr ? 'Un besoin proche de ce cas ?' : 'A need close to this case study?'}
            </h2>

            <p className="mb-5 max-w-md text-xs leading-relaxed text-foreground/75 sm:mb-6 sm:text-sm">
              {isFr
                ? "Si cette approche ou ce niveau d'exigence correspond à votre contexte, démarrons un échange concret."
                : 'If this approach or delivery standard matches your context, let us start a focused conversation.'}
            </p>

            <div className="flex flex-col items-center gap-3">
              <SpectrumButton asChild variant="solid" size="default">
                <Link
                  to={contactTo}
                  onMouseEnter={() => {
                    void import('@/app/routes/prefetch').then((m) => m.prefetchRoute('/contact'));
                  }}
                  onTouchStart={() => {
                    void import('@/app/routes/prefetch').then((m) => m.prefetchRoute('/contact'));
                  }}
                >
                  {isFr ? "Discuter d'un projet" : 'Discuss a project'}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </SpectrumButton>

              {hasGithub ? (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] font-medium text-foreground/70 underline-offset-4 transition-colors hover:text-primary hover:underline sm:text-[13px]"
                >
                  {isFr ? 'Ou voir sur GitHub' : 'Or view on GitHub'}
                </a>
              ) : (
                <Link
                  to="/projects"
                  className="text-[12px] font-medium text-foreground/70 underline-offset-4 transition-colors hover:text-primary hover:underline sm:text-[13px]"
                >
                  {isFr ? 'Ou voir tous les projets' : 'Or view all projects'}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
