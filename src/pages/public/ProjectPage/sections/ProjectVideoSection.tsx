import React, { useMemo, useState } from 'react';
import { IProject } from '@/entities/projets/model/project.types';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { ProjectSectionShell } from './ProjectSectionShell';
import { resolveVideoMedia, type ResolvedVideoMedia } from '@/shared/lib/videoEmbed';
import { ProjectVideoPlayer } from '@/shared/ui/ProjectVideoPlayer';
import { projectDetailTabClass } from './projectDetailTabClass';

const TYPE_LABEL: Record<string, { fr: string; en: string }> = {
  demo: { fr: 'Démo', en: 'Demo' },
  walkthrough: { fr: 'Walkthrough', en: 'Walkthrough' },
  testimonial: { fr: 'Témoignage', en: 'Testimonial' },
  presentation: { fr: 'Présentation', en: 'Presentation' },
};

type ResolvedRow = {
  item: NonNullable<IProject['videos']>[number];
  media: ResolvedVideoMedia;
};

export const ProjectVideoSection: React.FC<{ project: IProject }> = ({ project }) => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';

  const items = useMemo(() => {
    const fromList = project.videos ?? [];
    if (fromList.length > 0) return fromList;
    if (project.videoDemo?.trim()) {
      return [{ url: project.videoDemo, type: 'demo' as const }];
    }
    return [];
  }, [project.videos, project.videoDemo]);

  const resolved = useMemo(() => {
    const out: ResolvedRow[] = [];
    for (const item of items) {
      const media = resolveVideoMedia(item.url, item.alternateUrls ?? []);
      if (media) out.push({ item, media });
    }
    return out;
  }, [items]);

  const [active, setActive] = useState(0);

  if (resolved.length === 0) return null;

  const current = resolved[Math.min(active, resolved.length - 1)]!;
  const title =
    (isFr ? current.item.titleFr : current.item.titleEn) ||
    (isFr ? TYPE_LABEL[current.item.type]?.fr : TYPE_LABEL[current.item.type]?.en) ||
    (isFr ? 'Vidéo du projet' : 'Project video');

  return (
    <ProjectSectionShell title={isFr ? 'Vidéo' : 'Video'} tone="plain">
      {resolved.length > 1 && (
        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-5">
          {resolved.map((row, idx) => {
            const label =
              (isFr ? row.item.titleFr : row.item.titleEn) ||
              (isFr ? TYPE_LABEL[row.item.type]?.fr : TYPE_LABEL[row.item.type]?.en) ||
              `Video ${idx + 1}`;
            return (
              <button
                key={`${row.item.url}-${idx}`}
                type="button"
                onClick={() => setActive(idx)}
                className={projectDetailTabClass(idx === active)}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      <div className="mx-auto max-w-4xl">
        <p className="text-sm text-muted-foreground mb-3">{title}</p>
        <div className="relative border border-primary/25 rounded-md p-3 sm:p-4 bg-card/30">
          <ProjectVideoPlayer media={current.media} title={title} isFr={isFr} />
        </div>
      </div>
    </ProjectSectionShell>
  );
};
