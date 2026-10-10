import React from 'react';
import { HeroVideoDialog } from '@/shared/ui/hero-video-dialog';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { parseVideoUrl } from '@/shared/lib/videoEmbed';
import { trackVideoPlay } from '@/app/lib/analytics';
import { usePublicContactInfo } from '@/entities/contact/hooks/useContact';

/**
 * Presentation video on Home / About.
 * Source of truth: contact-info.presentationVideoUrl (CMS).
 */
export const PresentationVideo: React.FC = () => {
  const { language } = useLanguageStore();
  const { data, isPending } = usePublicContactInfo();

  const rawUrl = data?.data?.presentationVideoUrl?.trim() ?? '';
  const video = parseVideoUrl(rawUrl);

  if (isPending && !rawUrl) return null;
  if (!video) return null;

  return (
    <section className="relative z-10 px-4 py-6 md:px-10 md:py-10 lg:px-14">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto mb-4 max-w-xl text-center md:mb-6">
          <h2 className="text-base font-bold text-foreground sm:text-xl md:text-2xl">
            {language === 'fr' ? 'Une minute pour me connaître' : 'One minute to know me'}
          </h2>
        </div>

        <div className="relative flex justify-center rounded-md border border-primary/35 p-3 backdrop-blur-lg sm:p-4">
          <div
            className="pointer-events-none absolute top-1/2 left-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[80px] sm:h-[280px] sm:w-[280px]"
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
            onPlayIntent={() => trackVideoPlay('presentation-home')}
          />
        </div>
      </div>
    </section>
  );
};
