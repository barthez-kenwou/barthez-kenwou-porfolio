import React, { useMemo, useState } from 'react';
import {
  IProject,
  IProjectGalleryItem,
  ProjectGalleryKind,
} from '@/entities/projets/model/project.types';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { ProjectSectionShell } from './ProjectSectionShell';
import { Image } from '@/shared/ui/Image';
import { cn } from '@/shared/lib/utils';
import { X } from 'lucide-react';

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

type CellProps = {
  item: IProjectGalleryItem;
  fallbackAlt: string;
  isFr: boolean;
  onOpen: () => void;
};

const GalleryCell: React.FC<CellProps> = ({ item, fallbackAlt, isFr, onOpen }) => {
  const caption = isFr ? item.captionFr : item.captionEn;
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative h-full w-full min-h-[7rem] overflow-hidden rounded-md border border-border/40 bg-card/30 text-left cursor-pointer"
    >
      <Image
        src={item.src}
        alt={caption || fallbackAlt}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
      <div className="absolute bottom-0 inset-x-0 p-2 md:p-3">
        {item.kind && (
          <span className="inline-block text-[10px] uppercase tracking-wide text-primary mb-0.5">
            {isFr ? KIND_LABEL[item.kind].fr : KIND_LABEL[item.kind].en}
          </span>
        )}
        {caption && <p className="text-xs text-white/90 line-clamp-2 leading-snug">{caption}</p>}
      </div>
    </button>
  );
};

/**
 * ISO-style recursive split:
 * depth even → vertical split (image left, rest right)
 * depth odd  → horizontal split (image top, rest bottom)
 */
function SplitGallery({
  items,
  depth,
  indexOffset,
  isFr,
  fallbackAlt,
  onOpen,
}: {
  items: IProjectGalleryItem[];
  depth: number;
  indexOffset: number;
  isFr: boolean;
  fallbackAlt: string;
  onOpen: (idx: number) => void;
}) {
  if (items.length === 0) return null;

  if (items.length === 1) {
    return (
      <GalleryCell
        item={items[0]!}
        isFr={isFr}
        fallbackAlt={fallbackAlt}
        onOpen={() => onOpen(indexOffset)}
      />
    );
  }

  const [first, ...rest] = items;
  const vertical = depth % 2 === 0;

  return (
    <div
      className={cn(
        'flex h-full w-full gap-2 md:gap-2.5 min-h-0 min-w-0',
        vertical ? 'flex-row' : 'flex-col',
      )}
    >
      <div className="flex-1 min-h-0 min-w-0">
        <GalleryCell
          item={first!}
          isFr={isFr}
          fallbackAlt={fallbackAlt}
          onOpen={() => onOpen(indexOffset)}
        />
      </div>
      <div className="flex-1 min-h-0 min-w-0">
        <SplitGallery
          items={rest}
          depth={depth + 1}
          indexOffset={indexOffset + 1}
          isFr={isFr}
          fallbackAlt={fallbackAlt}
          onOpen={onOpen}
        />
      </div>
    </div>
  );
}

export const ProjectGallerySection: React.FC<{ project: IProject }> = ({ project }) => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';
  const items = project.gallery ?? [];
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

  if (items.length === 0) return null;

  return (
    <ProjectSectionShell title={isFr ? 'Galerie' : 'Gallery'}>
      {kinds.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-5">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={cn(
              'px-3 py-1.5 text-xs rounded-md border transition-colors cursor-pointer',
              filter === 'all'
                ? 'bg-primary/15 border-primary/40 text-foreground'
                : 'bg-card/40 border-border/40 text-muted-foreground hover:border-primary/25',
            )}
          >
            {isFr ? 'Tout' : 'All'}
          </button>
          {kinds.map((kind) => (
            <button
              key={kind}
              type="button"
              onClick={() => setFilter(kind)}
              className={cn(
                'px-3 py-1.5 text-xs rounded-md border transition-colors cursor-pointer',
                filter === kind
                  ? 'bg-primary/15 border-primary/40 text-foreground'
                  : 'bg-card/40 border-border/40 text-muted-foreground hover:border-primary/25',
              )}
            >
              {isFr ? KIND_LABEL[kind].fr : KIND_LABEL[kind].en}
            </button>
          ))}
        </div>
      )}

      <div
        className={cn(
          'w-full rounded-md overflow-hidden',
          // Keep recursive flex splits readable across counts
          filtered.length <= 2 && 'h-[16rem] md:h-[22rem] lg:h-[26rem]',
          filtered.length === 3 && 'h-[18rem] md:h-[24rem] lg:h-[28rem]',
          filtered.length === 4 && 'h-[20rem] md:h-[26rem] lg:h-[30rem]',
          filtered.length >= 5 && 'h-[22rem] md:h-[28rem] lg:h-[32rem]',
        )}
      >
        <SplitGallery
          items={filtered}
          depth={0}
          indexOffset={0}
          isFr={isFr}
          fallbackAlt={isFr ? project.titleFr : project.titleEn}
          onOpen={setLightbox}
        />
      </div>

      {lightbox !== null && filtered[lightbox] && (
        <div
          className="fixed inset-0 z-[80] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 p-2 rounded-md bg-white/10 text-white hover:bg-white/20 cursor-pointer"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div
            className="max-w-5xl w-full max-h-[85vh] flex flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filtered[lightbox].src}
              alt={(isFr ? filtered[lightbox].captionFr : filtered[lightbox].captionEn) || ''}
              className="w-full h-auto max-h-[75vh] object-contain rounded-md"
            />
            {(isFr ? filtered[lightbox].captionFr : filtered[lightbox].captionEn) && (
              <p className="text-sm text-white/80 text-center">
                {isFr ? filtered[lightbox].captionFr : filtered[lightbox].captionEn}
              </p>
            )}
          </div>
        </div>
      )}
    </ProjectSectionShell>
  );
};
