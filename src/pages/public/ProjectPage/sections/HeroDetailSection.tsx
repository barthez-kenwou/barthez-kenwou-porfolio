import React, { useState } from 'react';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { IProject } from '@/entities/projets/model/project.types';
import { ChevronLeft, ChevronRight, Github, ExternalLink, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { Image } from '@/shared/ui/Image';
import { cn } from '@/shared/lib/utils';
import { ProjectStatusBadge } from '@/entities/projets/ui/ProjectStatusBadge.ui';

interface Props {
  project: IProject;
}

export const HeroDetailSection: React.FC<Props> = ({ project }) => {
  const { language } = useLanguageStore();
  const title = language === 'fr' ? project.titleFr : project.titleEn;
  const description = language === 'fr' ? project.descriptionFr : project.descriptionEn;

  const [currentIdx, setCurrentIdx] = useState(0);

  const next = () => setCurrentIdx((prev) => (prev === project.images.length - 1 ? 0 : prev + 1));
  const prev = () => setCurrentIdx((p) => (p === 0 ? project.images.length - 1 : p - 1));

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
          className={cn(fillClasses, 'object-cover transition-transform duration-700 hover:scale-105')}
        />
      );
    }
    return <Image src={media} alt={title} className={fillClasses} />;
  };

  return (
    <div className="relative overflow-hidden mb-12 md:mb-16 group border-b border-border/40">
      <div className="relative w-full h-[52vh] md:h-[62vh] min-h-[22rem] bg-muted overflow-hidden">
        {/* Back - clear of floating navbar, same idea as blog pt-20/28 */}
        <div className="absolute top-24 left-4 md:top-28 md:left-8 z-30">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-black/55 backdrop-blur-md border border-white/15 text-white/90 hover:bg-black/70 transition-all text-xs md:text-sm shadow-sm"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {language === 'fr' ? 'Retour aux projets' : 'Back to projects'}
          </Link>
        </div>

        {project.images.length > 1 ? (
          <>
            {project.images.map((img, i) => (
              <div
                key={i}
                className={cn(
                  'absolute inset-0 transition-opacity duration-700 ease-in-out',
                  i === currentIdx ? 'z-1 opacity-100' : 'z-0 opacity-0 pointer-events-none',
                )}
                aria-hidden={i !== currentIdx}
              >
                {renderMedia(img, currentIdx === i)}
              </div>
            ))}

            <button
              type="button"
              onClick={prev}
              className="absolute top-1/2 -translate-y-1/2 left-2 md:left-4 z-20 p-1.5 bg-black/55 text-white rounded-full backdrop-blur-md hover:bg-black/75 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute top-1/2 -translate-y-1/2 right-2 md:right-4 z-20 p-1.5 bg-black/55 text-white rounded-full backdrop-blur-md hover:bg-black/75 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="absolute bottom-6 inset-x-0 flex justify-center gap-2 z-20">
              {project.images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentIdx(i)}
                  className={cn(
                    'h-1.5 rounded-full transition-all shadow-sm cursor-pointer',
                    currentIdx === i ? 'w-5 bg-white' : 'w-1.5 bg-white/45 hover:bg-white/80',
                  )}
                />
              ))}
            </div>
          </>
        ) : (
          renderMedia(project.images[0] || project.preview || '', true)
        )}

        {/* Very dark overlays - bright project shots stay readable */}
        <div className="absolute inset-0 bg-black/55 pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/45 pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent pointer-events-none z-10" />
      </div>

      {/* Title block anchored to bottom - detached from navbar */}
      <div className="absolute inset-x-0 bottom-0 z-30 px-4 pb-8 pt-24 sm:px-8 md:px-10 md:pb-10 md:pt-28 pointer-events-none">
        <div className="pointer-events-auto max-w-3xl flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-md bg-primary/25 backdrop-blur-md text-primary font-semibold text-[10px] md:text-xs uppercase tracking-wider border border-primary/30">
                {project.category}
              </span>
              {project.status && <ProjectStatusBadge status={project.status} />}
              {project.confidential && (
                <span className="px-3 py-1 rounded-md bg-white/10 backdrop-blur-md text-white/90 font-semibold text-[10px] md:text-xs uppercase tracking-wider border border-white/20">
                  {language === 'fr' ? 'NDA / Anonymisé' : 'NDA / Anonymized'}
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2.5 tracking-tight leading-snug">
              {title}
            </h1>
            <p className="text-xs md:text-sm text-white/75 leading-relaxed line-clamp-3 md:line-clamp-4 max-w-2xl">
              {description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {project.github && project.github !== '#' && (
              <Button
                size="sm"
                variant="outline"
                className="rounded-md border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
                asChild
              >
                <Link
                  to={project.github}
                  target="_blank"
                  onClick={() => {
                    void import('@/app/lib/analytics').then((m) =>
                      m.trackOutboundClick(project.github!, 'github'),
                    );
                  }}
                >
                  <Github className="mr-1.5 h-3.5 w-3.5" />
                  Code Source
                </Link>
              </Button>
            )}
            {project.demo && project.demo !== '#' && (
              <Button size="sm" className="rounded-md shadow-sm shadow-primary/20" asChild>
                <Link
                  to={project.demo}
                  target="_blank"
                  onClick={() => {
                    void import('@/app/lib/analytics').then((m) =>
                      m.trackOutboundClick(project.demo!, 'demo'),
                    );
                  }}
                >
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                  Live Demo
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
