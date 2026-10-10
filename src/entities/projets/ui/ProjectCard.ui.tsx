import React from 'react';

import { Link } from 'react-router-dom';
import {
  Github,
  ExternalLink,
  ArrowUpRight,
  Clock,
  Users,
  Zap,
  Shield,
  Layout,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { Image } from '@/shared/ui/Image';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { cn } from '@/shared/lib/utils';
import { getProjectPathSlug } from '@/shared/lib/entity-slug';
import { Button } from '@/shared/ui/button';

import type { IProject, ProjectComplexity } from '../model/project.types';
import { ProjectStatusBadge } from './ProjectStatusBadge.ui';
import { TechBadge } from './TechBadge.ui';

// ─── Constants ──────────────────────────────────────────────────────────────────

const COMPLEXITY_CONFIG: Record<ProjectComplexity, { icon: any; color: string }> = {
  Avancé: { icon: Zap, color: 'text-primary' },
  Intermédiaire: { icon: Layout, color: 'text-muted-foreground' },
  Débutant: { icon: Shield, color: 'text-foreground/50' },
};

// ─── Props ──────────────────────────────────────────────────────────────────────

interface ProjectCardProps {
  project: IProject;
  activeTechs?: string[];
  onTechClick?: (tag: string) => void;
}

// ─── Component ──────────────────────────────────────────────────────────────────

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  activeTechs = [],
  onTechClick,
}) => {
  const { language } = useLanguageStore();

  const title = language === 'fr' ? project.titleFr : project.titleEn;
  const description = language === 'fr' ? project.descriptionFr : project.descriptionEn;
  const projectHref = `/projects/${getProjectPathSlug(project)}`;
  const complexityKey = (project.complexity as ProjectComplexity) || 'Intermédiaire';
  const ComplexityIcon = COMPLEXITY_CONFIG[complexityKey]?.icon || Shield;

  const allTechs = [
    ...(project.techStack?.frontend || []),
    ...(project.techStack?.backend || []),
    ...(project.techStack?.database || []),
    ...(project.techStack?.devops || []),
  ];

  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? project.images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === project.images.length - 1 ? 0 : prev + 1));
  };

  const renderMedia = (media: string, isActive: boolean) => {
    if (!media) return null;
    const isVideo = media.endsWith('.mp4') || media.endsWith('.webm') || media.endsWith('.ogg');
    const fillClasses = 'absolute inset-0 h-full w-full';
    if (isVideo) {
      return (
        <video
          src={media}
          autoPlay={isActive}
          loop
          muted
          playsInline
          className={cn(fillClasses, 'object-cover')}
        />
      );
    }
    return <Image src={media} alt={title} className={fillClasses} />;
  };

  return (
    <article className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded contain-paint">
      {/* ── Image Area ────────────────────────────────────────────────────── */}
      <div className="relative h-56 w-full shrink-0 overflow-hidden bg-muted group/carousel">
        {project.images.length > 1 ? (
          <>
            {/* Absolute slides: no flex track that can spill into neighbors */}
            {project.images.map((media, idx) => (
              <div
                key={idx}
                className={cn(
                  'absolute inset-0 transition-opacity duration-500 ease-in-out',
                  idx === currentImageIndex
                    ? 'z-1 opacity-100'
                    : 'z-0 opacity-0 pointer-events-none',
                )}
                aria-hidden={idx !== currentImageIndex}
              >
                {renderMedia(media, currentImageIndex === idx)}
              </div>
            ))}

            {/* Carousel Controls */}
            <div className="absolute inset-y-0 left-0 z-20 flex items-center px-2 opacity-0 transition-opacity duration-300 group-hover/carousel:opacity-100">
              <button
                type="button"
                onClick={handlePrevImage}
                className="cursor-pointer rounded-full border border-white/20 bg-black/40 p-1 text-white backdrop-blur-md transition-all hover:scale-110 hover:bg-black/60"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </div>
            <div className="absolute inset-y-0 right-0 z-20 flex items-center px-2 opacity-0 transition-opacity duration-300 group-hover/carousel:opacity-100">
              <button
                type="button"
                onClick={handleNextImage}
                className="cursor-pointer rounded-full border border-white/20 bg-black/40 p-1 text-white backdrop-blur-md transition-all hover:scale-110 hover:bg-black/60"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Pagination Dots */}
            <div className="absolute inset-x-0 bottom-2 z-20 flex items-center justify-center gap-1.5">
              {project.images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(idx);
                  }}
                  className={cn(
                    'h-1.5 cursor-pointer rounded-full shadow-[0_0_2px_rgba(0,0,0,0.5)] transition-all',
                    currentImageIndex === idx
                      ? 'w-4 bg-white'
                      : 'w-1.5 bg-white/60 hover:bg-white/90',
                  )}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        ) : (
          renderMedia(project.images[0] || '', true)
        )}

        {/* Overlay gradient for text readability */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Badges Overlay */}
        <div className="pointer-events-none absolute inset-x-4 top-4 z-20 flex items-start justify-between">
          <span className="pointer-events-auto max-w-[70%] truncate rounded-md border border-white/10 bg-black/50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
            {project.category}
          </span>
          {project.status && (
            <div className="pointer-events-auto">
              <ProjectStatusBadge status={project.status} />
            </div>
          )}
        </div>

        {/* Complexity (Bottom Left Overlay) */}
        <div className="pointer-events-none absolute bottom-4 left-4 z-30 flex translate-y-2 items-center rounded-md border border-white/10 bg-black/50 px-3 py-0.5 opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="truncate text-[10px] font-bold text-white shadow-sm">
            {project.complexity}
          </span>
        </div>
      </div>

      {/* ── Content Area ─────────────────────────────────────────────────── */}
      <div className="p-2 flex flex-col gap-4 flex-grow">
        {/* Header */}
        <div className="space-y-1">
          <Link
            to={projectHref}
            className="flex w-full items-start justify-between gap-2 rounded-md py-1"
            aria-label={title}
          >
            <h3 className="min-w-0 flex-1 text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-lg line-clamp-2 break-words">
              {title}
            </h3>

            <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 opacity-0 -translate-x-1 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
          </Link>

          <p className="cursor-default text-xs leading-relaxed text-muted-foreground line-clamp-3">
            {description}
          </p>
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1.5">
          {allTechs.slice(0, 5).map((tag) => (
            <TechBadge
              key={tag}
              tag={tag}
              active={activeTechs.includes(tag)}
              onClick={onTechClick}
            />
          ))}
          {allTechs.length > 5 && (
            <Link
              to={projectHref}
              className="flex items-center justify-center w-fit border border-border/30 px-2 rounded"
              title="View More"
            >
              <span className="text-[10px] font-bold text-muted-foreground/60 py-1">
                +{allTechs.length - 5}...
              </span>
            </Link>
          )}
        </div>

        {/* Footer Meta & CTA */}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/50 pt-3">
          <div className="flex min-w-0 items-center gap-3 text-[11px] font-medium leading-none text-muted-foreground">
            <div className="flex min-w-0 items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span className="truncate" title={project.duration}>
                {project.duration}
              </span>
            </div>
            {project.teamSize != null && (
              <div className="flex shrink-0 items-center gap-1.5">
                <Users className="h-3.5 w-3.5 shrink-0" aria-hidden />
                <span className="whitespace-nowrap tabular-nums">
                  {project.teamSize}&nbsp;p.
                </span>
              </div>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {project.github && project.github !== '#' && (
              <Button variant="ghost" size="icon-sm" asChild className="rounded-md">
                <Link to={project.github} target="_blank" title="GitHub">
                  <Github />
                </Link>
              </Button>
            )}
            {project.demo && project.demo !== '#' && (
              <Button variant="ghost" size="icon-sm" asChild className="rounded-md">
                <Link to={project.demo} target="_blank" title="Live Demo">
                  <ExternalLink />
                </Link>
              </Button>
            )}
            <Link
              to={projectHref}
              className="rounded-md bg-primary/10 p-2 text-primary transition-colors duration-300 hover:bg-primary hover:text-primary-foreground"
              title="View Details"
            >
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};
