import React, { useMemo, useState } from 'react';
import { IProject } from '@/entities/projets/model/project.types';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { ProjectSectionShell } from './ProjectSectionShell';
import { HeroVideoDialog } from '@/shared/ui/hero-video-dialog';
import { parseVideoUrl, type ParsedVideo } from '@/shared/lib/videoEmbed';
import { cn } from '@/shared/lib/utils';

const TYPE_LABEL: Record<string, { fr: string; en: string }> = {
  demo: { fr: 'Démo', en: 'Demo' },
  walkthrough: { fr: 'Walkthrough', en: 'Walkthrough' },
  testimonial: { fr: 'Témoignage', en: 'Testimonial' },
  presentation: { fr: 'Présentation', en: 'Presentation' },
};

type ResolvedVideo =
  | { kind: 'embed'; item: NonNullable<IProject['videos']>[number]; video: ParsedVideo }
  | { kind: 'file'; item: NonNullable<IProject['videos']>[number]; src: string };

function isDirectVideoFile(url: string): boolean {
  return /\.(mp4|webm|ogg)(\?|$)/i.test(url.trim());
}

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
    const out: ResolvedVideo[] = [];
    for (const item of items) {
      const embed = parseVideoUrl(item.url);
      if (embed) {
        out.push({ kind: 'embed', item, video: embed });
        continue;
      }
      if (isDirectVideoFile(item.url)) {
        out.push({ kind: 'file', item, src: item.url });
      }
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
    <ProjectSectionShell title={isFr ? 'Vidéos' : 'Videos'}>
      {resolved.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-5">
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
                className={cn(
                  'px-3 py-1.5 text-xs rounded-md border transition-colors cursor-pointer',
                  idx === active
                    ? 'bg-primary/15 border-primary/40 text-foreground'
                    : 'bg-card/40 border-border/40 text-muted-foreground hover:border-primary/25',
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      <div className="mx-auto max-w-4xl">
        <p className="text-sm text-muted-foreground mb-3">{title}</p>
        <div className="relative border border-primary/25 rounded-md backdrop-blur-sm p-3 sm:p-4 bg-card/30">
          {current.kind === 'embed' ? (
            <HeroVideoDialog
              animationStyle="from-center"
              aspect={current.video.aspect}
              videoSrc={current.video.embedSrc}
              thumbnailSrc={current.video.thumbnailSrc}
              thumbnailAlt={title}
            />
          ) : (
            <video
              src={current.src}
              controls
              playsInline
              preload="metadata"
              className="w-full rounded-md aspect-video bg-black/40"
            >
              {isFr
                ? 'Votre navigateur ne prend pas en charge la lecture vidéo.'
                : 'Your browser does not support video playback.'}
            </video>
          )}
        </div>
      </div>
    </ProjectSectionShell>
  );
};
