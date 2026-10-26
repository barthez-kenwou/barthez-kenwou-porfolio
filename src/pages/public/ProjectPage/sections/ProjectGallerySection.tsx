import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  IProject,
  IProjectGalleryItem,
  ProjectGalleryKind,
} from '@/entities/projets/model/project.types';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { ProjectSectionShell } from './ProjectSectionShell';
import { Image } from '@/shared/ui/Image';
import { cn } from '@/shared/lib/utils';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { projectDetailTabClass } from './projectDetailTabClass';

const KIND_LABEL: Record<ProjectGalleryKind, { fr: string; en: string }> = {
  ui: { fr: 'UI', en: 'UI' },
  wip: { fr: 'En cours', en: 'WIP' },
  diagram: { fr: 'Diagramme', en: 'Diagram' },
  metric: { fr: 'Métrique', en: 'Metric' },
  test: { fr: 'Tests', en: 'Tests' },
  infra: { fr: 'Infra', en: 'Infra' },
  process: { fr: 'Process', en: 'Process' },
  other: { fr: 'Autre', en: 'Other' },
};

/** Max tiles in the collage — beyond that, last tile shows +N */
const MAX_VISIBLE = 5;
const SWIPE_THRESHOLD_PX = 48;

type CellProps = {
  item: IProjectGalleryItem;
  fallbackAlt: string;
  isFr: boolean;
  onOpen: () => void;
  overflowCount?: number;
  className?: string;
};

const GalleryCell: React.FC<CellProps> = ({
  item,
  fallbackAlt,
  isFr,
  onOpen,
  overflowCount = 0,
  className,
}) => {
  const caption = isFr ? item.captionFr : item.captionEn;
  const showOverflow = overflowCount > 0;

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        'group relative min-h-0 min-w-0 h-full w-full overflow-hidden border border-border/40 bg-muted/20 text-left cursor-pointer',
        className,
      )}
    >
      <Image src={item.src} alt={caption || fallbackAlt} className="w-full h-full object-cover" />
      {!showOverflow && (
        <>
          <div
            className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent"
            aria-hidden
          />
          <div className="absolute bottom-0 inset-x-0 p-2 md:p-2.5">
            {item.kind && (
              <span className="inline-block text-[10px] uppercase tracking-wide text-white/65 mb-0.5">
                {isFr ? KIND_LABEL[item.kind].fr : KIND_LABEL[item.kind].en}
              </span>
            )}
            {caption && (
              <p className="text-xs text-white/90 line-clamp-2 leading-snug">{caption}</p>
            )}
          </div>
        </>
      )}
      {showOverflow && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/55 transition-colors group-hover:bg-black/60">
          <span className="font-heading text-2xl md:text-3xl font-semibold text-white tabular-nums tracking-tight">
            +{overflowCount}
          </span>
        </div>
      )}
    </button>
  );
};

/** Facebook-style collage: readable tiles, last cell absorbs remainder as +N */
function CollageGrid({
  items,
  overflowCount,
  isFr,
  fallbackAlt,
  onOpen,
}: {
  items: IProjectGalleryItem[];
  overflowCount: number;
  isFr: boolean;
  fallbackAlt: string;
  onOpen: (idx: number) => void;
}) {
  const n = items.length;
  if (n === 0) return null;

  const cell = (idx: number, className?: string) => {
    const item = items[idx];
    if (!item) return null;
    const isLast = idx === n - 1;
    return (
      <GalleryCell
        key={`${item.src}-${idx}`}
        item={item}
        isFr={isFr}
        fallbackAlt={fallbackAlt}
        onOpen={() => onOpen(idx)}
        overflowCount={isLast ? overflowCount : 0}
        className={className}
      />
    );
  };

  if (n === 1) {
    return <div className="h-[16rem] md:h-[22rem] lg:h-[26rem]">{cell(0)}</div>;
  }

  if (n === 2) {
    return (
      <div className="grid grid-cols-2 gap-1.5 md:gap-2 h-[14rem] md:h-[20rem] lg:h-[24rem]">
        {cell(0)}
        {cell(1)}
      </div>
    );
  }

  if (n === 3) {
    return (
      <div className="grid grid-cols-2 grid-rows-2 gap-1.5 md:gap-2 h-[16rem] md:h-[22rem] lg:h-[26rem]">
        {cell(0, 'row-span-2')}
        {cell(1)}
        {cell(2)}
      </div>
    );
  }

  if (n === 4) {
    return (
      <div className="grid grid-cols-2 grid-rows-2 gap-1.5 md:gap-2 h-[16rem] md:h-[22rem] lg:h-[26rem]">
        {cell(0)}
        {cell(1)}
        {cell(2)}
        {cell(3)}
      </div>
    );
  }

  // 5 visible (+ optional overflow on last)
  return (
    <div className="grid grid-cols-2 grid-rows-6 gap-1.5 md:gap-2 h-[18rem] md:h-[24rem] lg:h-[28rem] md:grid-cols-3 md:grid-rows-2">
      {cell(0, 'row-span-6 md:row-span-2')}
      {cell(1, 'row-span-3 md:row-span-1')}
      {cell(2, 'row-span-3 md:row-span-1')}
      {cell(3, 'row-span-3 md:row-span-1')}
      {cell(4, 'row-span-3 md:row-span-1')}
    </div>
  );
}

type LightboxProps = {
  items: IProjectGalleryItem[];
  index: number;
  isFr: boolean;
  onClose: () => void;
  onChangeIndex: (idx: number) => void;
};

const GalleryLightbox: React.FC<LightboxProps> = ({
  items,
  index,
  isFr,
  onClose,
  onChangeIndex,
}) => {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const current = items[index];

  const goPrev = useCallback(() => {
    onChangeIndex(index <= 0 ? items.length - 1 : index - 1);
  }, [index, items.length, onChangeIndex]);

  const goNext = useCallback(() => {
    onChangeIndex(index >= items.length - 1 ? 0 : index + 1);
  }, [index, items.length, onChangeIndex]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev, onClose]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
    touchStartY.current = e.touches[0]?.clientY ?? null;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null || touchStartY.current == null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const endY = e.changedTouches[0]?.clientY ?? touchStartY.current;
    const dx = endX - touchStartX.current;
    const dy = endY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;
    if (Math.abs(dx) < SWIPE_THRESHOLD_PX || Math.abs(dx) < Math.abs(dy) * 1.15) return;
    if (dx > 0) goPrev();
    else goNext();
  };

  if (!current || typeof document === 'undefined') return null;

  const caption = isFr ? current.captionFr : current.captionEn;
  const kindLabel = current.kind
    ? isFr
      ? KIND_LABEL[current.kind].fr
      : KIND_LABEL[current.kind].en
    : null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/92"
      role="dialog"
      aria-modal
      aria-label={isFr ? 'Visionneuse' : 'Image viewer'}
      onClick={onClose}
    >
      {/* Top bar — close always reachable */}
      <div
        className="relative z-20 flex items-center justify-between gap-3 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2 sm:px-5"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs sm:text-sm text-white/70 tabular-nums">
          {index + 1}
          <span className="text-white/40"> / </span>
          {items.length}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
          aria-label={isFr ? 'Fermer' : 'Close'}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Stage */}
      <div
        className="relative z-10 flex min-h-0 flex-1 items-center justify-center px-2 sm:px-12 touch-pan-y"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-1 sm:left-3 top-1/2 z-20 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-md bg-black/45 text-white hover:bg-black/65 transition-colors cursor-pointer"
              aria-label={isFr ? 'Image précédente' : 'Previous image'}
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-1 sm:right-3 top-1/2 z-20 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-md bg-black/45 text-white hover:bg-black/65 transition-colors cursor-pointer"
              aria-label={isFr ? 'Image suivante' : 'Next image'}
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </>
        )}

        <img
          src={current.src}
          alt={caption || ''}
          className="max-h-full max-w-full object-contain select-none"
          draggable={false}
        />
      </div>

      {/* Caption / hint */}
      <div
        className="relative z-20 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {(kindLabel || caption) && (
          <p className="text-sm text-white/85 leading-snug max-w-2xl mx-auto">
            {kindLabel && (
              <span className="text-white/50 uppercase tracking-wide text-[11px] mr-2">
                {kindLabel}
              </span>
            )}
            {caption}
          </p>
        )}
        {items.length > 1 && (
          <p className="mt-1.5 text-[11px] text-white/40 sm:hidden">
            {isFr ? 'Glissez pour naviguer' : 'Swipe to browse'}
          </p>
        )}
      </div>
    </div>,
    document.body,
  );
};

export const ProjectGallerySection: React.FC<{ project: IProject }> = ({ project }) => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';
  const items = useMemo(() => project.gallery ?? [], [project.gallery]);
  const [filter, setFilter] = useState<ProjectGalleryKind | 'all'>('all');
  const [lightbox, setLightbox] = useState<number | null>(null);

  const kinds = useMemo(() => {
    const set = new Set<ProjectGalleryKind>();
    items.forEach((i) => set.add(i.kind ?? 'other'));
    return Array.from(set);
  }, [items]);

  const filtered = useMemo(() => {
    if (filter === 'all') return items;
    return items.filter((i) => (i.kind ?? 'other') === filter);
  }, [items, filter]);

  const visible = useMemo(() => filtered.slice(0, MAX_VISIBLE), [filtered]);
  const overflowCount = Math.max(0, filtered.length - MAX_VISIBLE);
  const fallbackAlt = isFr ? project.titleFr : project.titleEn;

  useEffect(() => {
    setLightbox(null);
  }, [filter]);

  if (items.length === 0) return null;

  return (
    <ProjectSectionShell title={isFr ? 'Captures' : 'Screens'} tone="ruled">
      {kinds.length > 1 && (
        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-5">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={projectDetailTabClass(filter === 'all')}
          >
            {isFr ? 'Tout' : 'All'}
          </button>
          {kinds.map((kind) => (
            <button
              key={kind}
              type="button"
              onClick={() => setFilter(kind)}
              className={projectDetailTabClass(filter === kind)}
            >
              {isFr ? KIND_LABEL[kind].fr : KIND_LABEL[kind].en}
            </button>
          ))}
        </div>
      )}

      <CollageGrid
        items={visible}
        overflowCount={overflowCount}
        isFr={isFr}
        fallbackAlt={fallbackAlt}
        onOpen={setLightbox}
      />

      {lightbox !== null && filtered[lightbox] && (
        <GalleryLightbox
          items={filtered}
          index={lightbox}
          isFr={isFr}
          onClose={() => setLightbox(null)}
          onChangeIndex={setLightbox}
        />
      )}
    </ProjectSectionShell>
  );
};
