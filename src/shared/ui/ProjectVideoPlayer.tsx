import React, { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Play } from 'lucide-react';
import { HeroVideoDialog } from '@/shared/ui/hero-video-dialog';
import {
  filterPlayableFileSources,
  type ResolvedVideoMedia,
} from '@/shared/lib/videoEmbed';
import { cn } from '@/shared/lib/utils';

type Props = {
  media: ResolvedVideoMedia;
  title: string;
  isFr: boolean;
  className?: string;
};

/**
 * Unified project video player:
 * - embeds (YouTube / Vimeo / Drive / Loom) via dialog
 * - progressive files (S3, etc.) with codec fallbacks + graceful error UI
 */
export const ProjectVideoPlayer: React.FC<Props> = ({ media, title, isFr, className }) => {
  if (media.kind === 'embed') {
    return (
      <div className={cn('relative', className)}>
        <HeroVideoDialog
          animationStyle="from-center"
          aspect={media.aspect}
          videoSrc={media.embedSrc}
          thumbnailSrc={media.thumbnailSrc}
          thumbnailAlt={title}
        />
      </div>
    );
  }

  return <DirectFileVideo media={media} title={title} isFr={isFr} className={className} />;
};

function DirectFileVideo({
  media,
  title,
  isFr,
  className,
}: {
  media: Extract<ResolvedVideoMedia, { kind: 'file' }>;
  title: string;
  isFr: boolean;
  className?: string;
}) {
  const sources = useMemo(() => filterPlayableFileSources(media.sources), [media.sources]);
  const [sourceIndex, setSourceIndex] = useState(0);
  const [failed, setFailed] = useState(sources.length === 0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    setSourceIndex(0);
    setFailed(sources.length === 0);
    setStarted(false);
  }, [media.openUrl, sources.length]);

  const active = sources[sourceIndex];

  const onError = () => {
    if (sourceIndex < sources.length - 1) {
      setSourceIndex((i) => i + 1);
      return;
    }
    setFailed(true);
  };

  if (failed || !active) {
    return (
      <div
        className={cn(
          'flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-md border border-border/50 bg-muted/30 px-4 text-center',
          className,
        )}
      >
        <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
          {isFr
            ? 'Cette vidéo ne peut pas être lue dans ce navigateur (format ou codec non supporté). Ouvrez-la dans un onglet, ou fournissez aussi une version MP4.'
            : 'This video cannot be played in this browser (unsupported format or codec). Open it in a new tab, or also provide an MP4 version.'}
        </p>
        <a
          href={media.openUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          {isFr ? 'Ouvrir la vidéo' : 'Open video'}
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    );
  }

  if (!started) {
    return (
      <button
        type="button"
        onClick={() => setStarted(true)}
        className={cn(
          'group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-md border border-border/50 bg-muted/40 cursor-pointer',
          className,
        )}
        aria-label={isFr ? `Lire : ${title}` : `Play: ${title}`}
      >
        <div className="absolute inset-0 bg-linear-to-t from-background/50 via-transparent to-transparent" />
        <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
          <Play className="h-4 w-4 fill-current ml-0.5" />
        </span>
      </button>
    );
  }

  return (
    <video
      key={active.src}
      src={active.src}
      className={cn('w-full rounded-md aspect-video bg-black/40', className)}
      controls
      playsInline
      preload="metadata"
      autoPlay
      onError={onError}
    >
      {isFr
        ? 'Votre navigateur ne prend pas en charge la lecture vidéo.'
        : 'Your browser does not support video playback.'}
    </video>
  );
}
