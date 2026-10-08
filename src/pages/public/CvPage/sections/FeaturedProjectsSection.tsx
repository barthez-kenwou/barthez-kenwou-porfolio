import { IProject } from '@/entities/projets/model/project.types';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { Briefcase, ExternalLink, Github } from 'lucide-react';
import React from 'react';

interface FeaturedProjectsSectionProps {
  projects: IProject[];
}

export const FeaturedProjectsSection: React.FC<FeaturedProjectsSectionProps> = ({ projects }) => {
  const { language } = useLanguageStore();

  if (!projects || projects.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 font-heading text-base font-bold text-foreground sm:mb-4">
        <div className="rounded-md bg-primary/10 p-1.5">
          <Briefcase className="h-4 w-4 text-primary" />
        </div>
        {language === 'fr' ? 'Projets Phares' : 'Featured Projects'}
      </h2>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        {projects.map((project, idx) => (
          <div
            key={idx}
            className="group relative rounded-md border border-border bg-secondary/20 p-3.5 transition-colors duration-300 hover:border-primary/40 sm:p-4"
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold leading-tight text-foreground">
                {language === 'fr' ? project.titleFr : project.titleEn}
              </h3>
              <div className="flex shrink-0 gap-2">
                {project.github && project.github !== '#' && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/60 transition-colors hover:text-primary"
                  >
                    <Github className="h-3.5 w-3.5" />
                  </a>
                )}
                {project.demo && project.demo !== '#' && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/60 transition-colors hover:text-primary"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>

            <p className="mb-3 line-clamp-3 text-xs leading-relaxed text-foreground/75 sm:text-sm">
              {language === 'fr' ? project.descriptionFr : project.descriptionEn}
            </p>

            <div className="mt-auto flex flex-wrap gap-1.5">
              {[
                ...(project.techStack?.frontend || []),
                ...(project.techStack?.backend || []),
                ...(project.techStack?.database || []),
                ...(project.techStack?.devops || []),
              ]
                .slice(0, 4)
                .map((tag, i) => (
                  <span
                    key={i}
                    className="rounded border border-border bg-background px-2 py-0.5 font-mono text-[10px] tracking-wide text-foreground/80 uppercase"
                  >
                    {tag}
                  </span>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
