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
    <section className="mt-8">
      <div className="flex items-center gap-2 mb-6 border-b border-border pb-2">
        <Briefcase className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">
          {language === 'fr' ? 'Projets Phares' : 'Featured Projects'}
        </h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((project, idx) => (
          <div
            key={idx}
            className="group relative bg-secondary/30 border border-border rounded-md p-5 hover:border-primary/50 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-3 gap-2">
              <h3 className="font-bold text-lg text-primary leading-tight">
                {language === 'fr' ? project.titleFr : project.titleEn}
              </h3>
              <div className="flex gap-2 shrink-0">
                {project.github && project.github !== '#' && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                )}
                {project.demo && project.demo !== '#' && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
              {language === 'fr' ? project.descriptionFr : project.descriptionEn}
            </p>

            <div className="flex flex-wrap gap-2 mt-auto">
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
                    className="text-xs bg-background border border-border px-2 py-1 rounded-md text-foreground"
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
