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
    const baseClasses = 'w-full h-full object-cover transition-transform duration-500';
    if (isVideo) {
      return (
        <video src={media} autoPlay={isActive} loop muted playsInline className={baseClasses} />
      );
    }
    return <Image src={media} alt={title} className={baseClasses} />;
  };

  return (
    <article className="group rounded relative flex flex-col h-full overflow-hidden transition-all duration-300">
      {/* ── Image Area ────────────────────────────────────────────────────── */}
      <div className="relative h-56 w-full overflow-hidden bg-muted group/carousel">
        {project.images.length > 1 ? (
          <>
            <div
              className="flex w-full h-full transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
            >
              {project.images.map((media, idx) => (
                <div key={idx} className="w-full h-full flex-shrink-0 relative">
                  {renderMedia(media, currentImageIndex === idx)}
                </div>
              ))}
            </div>

            {/* Carousel Controls */}
            <div className="absolute inset-y-0 left-0 flex items-center px-2 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 z-20">
              <button
                type="button"
                onClick={handlePrevImage}
                className="p-1 rounded-full bg-black/40 text-white backdrop-blur-md border border-white/20 hover:bg-black/60 hover:scale-110 transition-all cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 z-20">
              <button
                type="button"
                onClick={handleNextImage}
                className="p-1 rounded-full bg-black/40 text-white backdrop-blur-md border border-white/20 hover:bg-black/60 hover:scale-110 transition-all cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Pagination Dots */}
            <div className="absolute bottom-2 inset-x-0 flex items-center justify-center gap-1.5 z-20">
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
                    'h-1.5 rounded-full transition-all cursor-pointer shadow-[0_0_2px_rgba(0,0,0,0.5)]',
                    currentImageIndex === idx
                      ? 'bg-white w-4'
                      : 'bg-white/60 hover:bg-white/90 w-1.5',
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />

        {/* Badges Overlay */}
        <div className="absolute top-4 inset-x-4 flex justify-between items-start pointer-events-none">
          <span className="max-w-[70%] truncate rounded-md border border-white/10 bg-black/50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md pointer-events-auto">
            {project.category}
          </span>
          {project.status && (
            <div className="pointer-events-auto">
              <ProjectStatusBadge status={project.status} />
            </div>
          )}
        </div>

        {/* Complexity (Bottom Left Overlay) */}
        <div className="absolute bottom-4 left-4 flex items-center px-3 py-.5 rounded-md bg-black/50 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-30 pointer-events-none">
          <span className="text-[10px] font-bold text-white truncate shadow-sm">
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
        <div className="mt-auto pt-2 border-t border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-4 text-[11px] font-semibold text-muted-foreground/70">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{project.duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              <span>{project.teamSize} p.</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
              className="ml-1 p-2 rounded-md bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
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
