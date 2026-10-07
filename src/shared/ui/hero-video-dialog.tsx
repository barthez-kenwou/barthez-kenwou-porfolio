import { useState, useEffect, useCallback } from 'react';
import { Play, XIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Image } from '@/shared/ui/Image';
import { cn } from '@/shared/lib/utils';
import { buildVideoEmbedSrc } from '@/shared/lib/videoEmbed';

type AnimationStyle =
  | 'from-bottom'
  | 'from-center'
  | 'from-top'
  | 'from-left'
  | 'from-right'
  | 'fade'
  | 'top-in-bottom-out'
  | 'left-in-right-out';

interface HeroVideoProps {
  animationStyle?: AnimationStyle;
  videoSrc: string;
  thumbnailSrc: string;
  thumbnailAlt?: string;
  className?: string;
  aspect?: 'portrait' | 'landscape';
}

const animationVariants = {
  'from-bottom': {
    initial: { y: '100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '100%', opacity: 0 },
  },
  'from-center': {
    initial: { scale: 0.94, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.94, opacity: 0 },
  },
  'from-top': {
    initial: { y: '-100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '-100%', opacity: 0 },
  },
  'from-left': {
    initial: { x: '-100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '-100%', opacity: 0 },
  },
  'from-right': {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '100%', opacity: 0 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  'top-in-bottom-out': {
    initial: { y: '-100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '100%', opacity: 0 },
  },
  'left-in-right-out': {
    initial: { x: '-100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '100%', opacity: 0 },
  },
};

export function HeroVideoDialog({
  animationStyle = 'from-center',
  videoSrc,
  thumbnailSrc,
  thumbnailAlt = 'Video thumbnail',
  className,
  aspect = 'landscape',
}: HeroVideoProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const selectedAnimation = animationVariants[animationStyle];
  const isPortrait = aspect === 'portrait';

  useEffect(() => {
    if (!isVideoOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isVideoOpen]);

  const handleCloseVideo = useCallback(() => {
    setIsVideoOpen(false);
  }, []);

  useEffect(() => {
    if (!isVideoOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCloseVideo();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isVideoOpen, handleCloseVideo]);

  const embedSrc = buildVideoEmbedSrc(videoSrc, isVideoOpen);

  return (
    <div className={cn('relative w-full', className)}>
      <button
        type="button"
        aria-label="Play video"
        className={cn(
          'group relative w-full cursor-pointer border-0 bg-transparent p-0',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'rounded-lg overflow-hidden',
        )}
        onClick={() => setIsVideoOpen(true)}
      >
        <div
          className={cn(
            'relative w-full overflow-hidden rounded-lg border border-border/60 bg-card',
            'shadow-[0_8px_40px_-12px_hsla(268,52%,38%,0.35)]',
            'ring-1 ring-primary/10 transition-all duration-500',
            'group-hover:ring-primary/25',
            isPortrait
              ? 'mx-auto max-w-[168px] sm:max-w-[220px] md:max-w-[260px] aspect-[9/16] max-h-[248px] sm:max-h-[340px] md:max-h-[380px]'
              : 'aspect-video max-h-[240px] sm:max-h-[300px] md:max-h-[360px]',
          )}
        >
          <Image
            src={thumbnailSrc}
            alt={thumbnailAlt}
            priority
            className="absolute inset-0 h-full w-full"
            style={{ objectFit: 'cover', objectPosition: 'center center' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent pointer-events-none" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute size-12 sm:size-14 rounded-full bg-background/40 backdrop-blur-md border border-white/15 group-hover:scale-110 transition-transform duration-300" />
            <div className="relative flex size-10 sm:size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm group-hover:scale-110 transition-transform duration-300">
              <Play className="size-4 fill-current ml-0.5" />
            </div>
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-3 pt-[max(3.25rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6"
            onClick={(e) => {
              if (e.target === e.currentTarget) handleCloseVideo();
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Video player"
          >
            <button
              type="button"
              onClick={handleCloseVideo}
              className={cn(
                'fixed top-[max(0.65rem,env(safe-area-inset-top))] right-[max(0.65rem,env(safe-area-inset-right))] z-[60]',
                'cursor-pointer flex items-center justify-center size-11 rounded-full',
                'bg-background text-foreground border border-border shadow-md',
                'hover:bg-secondary active:scale-95 transition-all',
              )}
              aria-label="Close video"
            >
              <XIcon className="size-4" />
            </button>

            <motion.div
              {...selectedAnimation}
              transition={{ type: 'spring', damping: 30, stiffness: 340 }}
              className={cn(
                'relative w-full',
                isPortrait ? 'max-w-[min(100%,240px)] sm:max-w-[300px]' : 'max-w-3xl lg:max-w-4xl',
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={cn(
                  'relative isolate w-full overflow-hidden rounded-lg',
                  'border border-white/15 bg-black shadow-lg ring-1 ring-primary/20',
                  isPortrait
                    ? 'aspect-[9/16] max-h-[min(52dvh,420px)] sm:max-h-[min(70dvh,560px)]'
                    : 'aspect-video max-h-[min(62dvh,600px)]',
                )}
              >
                <iframe
                  key={embedSrc}
                  src={embedSrc}
                  title="Presentation video"
                  className="absolute inset-0 h-full w-full border-0"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
