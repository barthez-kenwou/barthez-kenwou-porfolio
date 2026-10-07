import { HeroVideoDialog } from '@/shared/ui/hero-video-dialog';
import React from 'react';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { parseVideoUrl } from '@/shared/lib/videoEmbed';

/**
 * ↓ COLLE UNIQUEMENT TON LIEN YOUTUBE ICI ↓
 * Formats OK : watch?v=… | youtu.be/… | shorts/… | embed/… | ID seul
 * Miniature, embed, ratio (16:9 ou short vertical) : automatiques.
 */
const PRESENTATION_YOUTUBE_URL =
  (import.meta.env.VITE_PRESENTATION_YOUTUBE_URL as string | undefined)?.trim() || '';

export const PresentationVideo: React.FC = () => {
  const { language } = useLanguageStore();
  const video = parseVideoUrl(PRESENTATION_YOUTUBE_URL);

  if (!video) {
    if (import.meta.env.DEV && PRESENTATION_YOUTUBE_URL) {
      console.warn(
        '[PresentationVideo] Lien invalide - colle un lien YouTube dans PRESENTATION_YOUTUBE_URL.',
      );
    }
    return null;
  }

  return (
    <section className="relative z-10 px-4 md:px-10 lg:px-14 py-6 md:py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 md:mb-6 text-center max-w-xl mx-auto">
          <h2 className="text-base sm:text-xl md:text-2xl font-bold text-foreground">
            {language === 'fr' ? 'Une minute pour me connaître' : 'One minute to know me'}
          </h2>
        </div>

        <div className="relative flex justify-center border border-primary/35 rounded-md backdrop-blur-lg p-3 sm:p-4">
          <div
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] rounded-full bg-primary/15 blur-[80px]"
            aria-hidden
          />

          <HeroVideoDialog
            animationStyle="from-center"
            aspect={video.aspect}
            videoSrc={video.embedSrc}
            thumbnailSrc={video.thumbnailSrc}
            thumbnailAlt={
              language === 'fr' ? 'Présentation - Barthez Kenwou' : 'Presentation - Barthez Kenwou'
            }
          />
        </div>
      </div>
    </section>
  );
};
