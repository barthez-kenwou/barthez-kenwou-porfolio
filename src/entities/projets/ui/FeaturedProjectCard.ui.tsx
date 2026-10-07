import { ArrowRight, ExternalLink, Github } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { cn } from '@/shared/lib/utils';
import { getProjectPathSlug } from '@/shared/lib/entity-slug';
import { IProject } from '../model/project.types';

interface FeaturedProjectCardProps {
  project: IProject;
  className?: string;
}

export const FeaturedProjectCard: React.FC<FeaturedProjectCardProps> = ({ project, className }) => {
  const { language } = useLanguageStore();
  const { t } = useTranslation();

  const title = language === 'fr' ? project.titleFr : project.titleEn;
  const description = language === 'fr' ? project.descriptionFr : project.descriptionEn;
  const projectHref = `/projects/${getProjectPathSlug(project)}`;

  const allTechs = [
    ...(project.techStack?.frontend || []),
    ...(project.techStack?.backend || []),
    ...(project.techStack?.database || []),
    ...(project.techStack?.devops || []),
  ];

  return (
    <div
      className={cn(
        'group relative flex h-[400px] w-[320px] flex-col overflow-hidden rounded-md border border-border/40 bg-secondary/10 backdrop-blur-xl transition-all duration-500 md:h-[210px] md:w-[550px] md:flex-row',
        'hover:border-primary/40 hover:bg-secondary/20 hover:shadow-lg hover:shadow-primary/5',
        className,
      )}
    >
      {/* Full-card hit area - image, tags, title, description */}
      <Link to={projectHref} className="absolute inset-0 z-10" aria-label={title} />

      <div className="relative h-44 w-full shrink-0 overflow-hidden md:h-full md:w-[45%]">
        <img
          src={project.images[0]}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-40 md:bg-gradient-to-r" />

        <div className="absolute left-4 top-4 z-20 pointer-events-none">
          <span className="rounded-full border border-border/50 bg-background/80 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-foreground/80 backdrop-blur-md">
            {project.category}
          </span>
        </div>
      </div>

      <div className="relative flex min-h-0 w-full flex-1 flex-col justify-between p-5 md:w-[55%] md:p-6">
        <div className="min-h-0 space-y-2.5 pointer-events-none">
          <div className="flex h-5 flex-wrap gap-1.5 overflow-hidden">
            {allTechs.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-primary/10 bg-primary/5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary/80"
              >
                {tag}
              </span>
            ))}
          </div>

          <h3 className="line-clamp-1 text-lg font-black tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
            {title}
          </h3>

          <p className="line-clamp-2 text-xs font-medium leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="relative z-20 mt-auto flex items-center justify-between border-t border-border/30 pt-3">
          <div className="flex items-center gap-2">
            {project.github && project.github !== '#' && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-border/50 bg-secondary/50 p-2 text-muted-foreground transition-all duration-300 hover:bg-secondary hover:text-foreground"
                aria-label={t('projects.code')}
                onClick={(e) => e.stopPropagation()}
              >
                <Github size={14} strokeWidth={2.5} />
              </a>
            )}
            {project.demo && project.demo !== '#' && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-border/50 bg-secondary/50 p-2 text-muted-foreground transition-all duration-300 hover:bg-secondary hover:text-foreground"
                aria-label={t('projects.demo')}
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={14} strokeWidth={2.5} />
              </a>
            )}
          </div>

          <span className="group/btn flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary transition-all pointer-events-none">
            {t('projects.details')}
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={3}
            />
          </span>
        </div>
      </div>

      <div className="pointer-events-none absolute -inset-px -z-10 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 transition-opacity duration-1000 group-hover:opacity-100" />
    </div>
  );
};
