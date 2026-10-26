import React, { useRef, useState } from 'react';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { IProject } from '@/entities/projets/model/project.types';
import { ChevronLeft, ChevronRight, Github, ExternalLink, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { Image } from '@/shared/ui/Image';
import { cn } from '@/shared/lib/utils';
import { PROJECT_STATUS_CONFIG } from '@/entities/projets/model/project.config';
import type { ProjectStatus } from '@/entities/projets/model/project.types';

interface Props {
  project: IProject;
}

const SWIPE_THRESHOLD_PX = 40;

export const HeroDetailSection: React.FC<Props> = ({ project }) => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';
  const title = isFr ? project.titleFr : project.titleEn;
  const description = isFr ? project.descriptionFr : project.descriptionEn;

  const [currentIdx, setCurrentIdx] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const images = project.images?.length ? project.images : project.preview ? [project.preview] : [];
  const hasCarousel = images.length > 1;

  const goTo = (idx: number) => {
    if (images.length === 0) return;
    const next = ((idx % images.length) + images.length) % images.length;
    setCurrentIdx(next);
  };
  const next = () => goTo(currentIdx + 1);
  const prev = () => goTo(currentIdx - 1);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null || !hasCarousel) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;
    if (delta < 0) next();
    else prev();
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
    return <Image src={media} alt={title} className={cn(fillClasses, 'object-cover')} />;
  };

  return (
    <header className="mb-10 md:mb-14 border-b border-border/40">
      {/* Full-bleed media under the floating navbar — no spacer band */}
      <div
        className="relative w-full overflow-hidden aspect-[2.15/1] sm:aspect-[2.35/1] md:aspect-[2.75/1] max-h-[min(36vh,16rem)] sm:max-h-[min(40vh,18rem)] md:max-h-[min(44vh,22rem)] touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {images.map((img, i) => (
          <div
            key={`${img}-${i}`}
            className={cn(
              'absolute inset-0 transition-opacity duration-500 ease-out',
              i === currentIdx ? 'z-10 opacity-100' : 'z-0 opacity-0 pointer-events-none',
            )}
            aria-hidden={i !== currentIdx}
          >
            {renderMedia(img, currentIdx === i)}
          </div>
        ))}

        {/* Theme-aware edges: soft top for navbar, blend into page below */}
        <div
          className="pointer-events-none absolute inset-0 z-20 bg-linear-to-b from-black/35 via-transparent to-transparent dark:from-black/50"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-20 bg-linear-to-t from-background via-transparent to-transparent"
          aria-hidden
        />

        {hasCarousel && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-1.5 top-1/2 z-30 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-md bg-black/35 text-white hover:bg-black/50 transition-colors cursor-pointer backdrop-blur-[2px]"
              aria-label={isFr ? 'Image précédente' : 'Previous image'}
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-1.5 top-1/2 z-30 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-md bg-black/35 text-white hover:bg-black/50 transition-colors cursor-pointer backdrop-blur-[2px]"
              aria-label={isFr ? 'Image suivante' : 'Next image'}
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
            </button>

            <div className="absolute bottom-2.5 inset-x-0 z-30 flex items-center justify-center gap-1">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  className="inline-flex h-5 w-4 items-center justify-center cursor-pointer"
                  aria-label={isFr ? `Image ${i + 1}` : `Image ${i + 1}`}
                  aria-current={i === currentIdx}
                >
                  <span
                    className={cn(
                      'block h-0.5 rounded-full transition-all ring-1 ring-black/25',
                      i === currentIdx ? 'w-3.5 bg-white' : 'w-1.5 bg-white/55',
                    )}
                  />
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Copy — solid surface, clear of nav and media */}
      <div className="px-4 pt-5 pb-8 sm:px-8 md:px-10 md:pt-7 md:pb-10 lg:px-14">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors mb-5 md:mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {isFr ? 'Retour aux projets' : 'Back to projects'}
        </Link>

        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-8">
          <div className="min-w-0 max-w-3xl">
            <p className="mb-3.5 text-[12px] leading-relaxed text-muted-foreground">
              <span className="text-[11px] tracking-[0.06em] uppercase">{project.category}</span>
              {project.status && (
                <>
                  <span className="mx-2 text-muted-foreground/40" aria-hidden>
                    /
                  </span>
                  <span>
                    {PROJECT_STATUS_CONFIG[project.status as ProjectStatus]?.label ??
                      project.status}
                  </span>
                </>
              )}
              {project.confidential && (
                <>
                  <span className="mx-2 text-muted-foreground/40" aria-hidden>
                    /
                  </span>
                  <span>{isFr ? 'Confidentiel' : 'Confidential'}</span>
                </>
              )}
            </p>

            <h1 className="font-heading text-2xl md:text-3xl lg:text-[2.1rem] font-semibold text-foreground tracking-tight leading-snug mb-3">
              {title}
            </h1>
            <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed max-w-2xl">
              {description}
            </p>
          </div>

          {(Boolean(project.github && project.github !== '#') ||
            Boolean(project.demo && project.demo !== '#')) && (
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {project.github && project.github !== '#' && (
                <Button size="sm" variant="outline" className="rounded-md" asChild>
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
                    {isFr ? 'Code source' : 'Source'}
                  </Link>
                </Button>
              )}
              {project.demo && project.demo !== '#' && (
                <Button size="sm" className="rounded-md" asChild>
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
                    {isFr ? 'Voir en ligne' : 'Live site'}
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
