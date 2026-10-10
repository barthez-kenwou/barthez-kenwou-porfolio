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
  const cover = project.images[0] || project.preview || '';

  const allTechs = [
    ...(project.techStack?.frontend || []),
    ...(project.techStack?.backend || []),
    ...(project.techStack?.database || []),
    ...(project.techStack?.devops || []),
  ];

  return (
    <article
      className={cn(
        'group relative flex h-full min-h-[280px] w-full min-w-0 flex-col overflow-hidden rounded-md border border-border/50 bg-card/80',
        'transition-colors duration-300 hover:border-primary/35 hover:bg-card',
        'sm:min-h-[220px] sm:flex-row',
        className,
      )}
    >
      <Link to={projectHref} className="absolute inset-0 z-10" aria-label={title} />

      {/* Media — min-w-0 prevents intrinsic image width from crushing the text column */}
      <div className="relative h-40 w-full shrink-0 overflow-hidden bg-muted sm:h-auto sm:w-[38%] sm:min-w-0 sm:max-w-[38%]">
        {cover ? (
          <img
            src={cover}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="h-full w-full bg-secondary/60" />
        )}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/50 to-transparent sm:bg-linear-to-r sm:from-transparent sm:to-background/40" />
      </div>

      {/* Copy */}
      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="min-w-0 space-y-2 pointer-events-none">
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {project.category}
          </p>

          <h3 className="line-clamp-2 text-base font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-lg">
            {title}
          </h3>

          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground sm:line-clamp-3">
            {description}
          </p>

          {allTechs.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {allTechs.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded border border-border/60 bg-secondary/40 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-foreground/70"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="relative z-20 mt-auto flex items-center justify-between gap-3 border-t border-border/40 pt-3">
          <div className="flex items-center gap-1.5">
            {project.github && project.github !== '#' && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-border/50 p-2 text-muted-foreground transition-colors hover:border-border hover:text-foreground"
                aria-label={t('projects.code')}
                onClick={(e) => e.stopPropagation()}
              >
                <Github size={14} strokeWidth={2.25} />
              </a>
            )}
            {project.demo && project.demo !== '#' && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-border/50 p-2 text-muted-foreground transition-colors hover:border-border hover:text-foreground"
                aria-label={t('projects.demo')}
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={14} strokeWidth={2.25} />
              </a>
            )}
          </div>

          <span className="pointer-events-none inline-flex items-center gap-1 text-xs font-semibold text-primary">
            {t('projects.details')}
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
              strokeWidth={2.5}
            />
          </span>
        </div>
      </div>
    </article>
  );
};
