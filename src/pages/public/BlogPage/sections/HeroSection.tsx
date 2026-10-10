import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { RetroGrid } from '@/shared/ui/retro-grid';
import React from 'react';

export const HeroSection: React.FC = () => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';

  return (
    <section className="relative mb-2 animate-fade-in px-4 pt-[350px] text-center md:mb-4 md:px-10 md:pt-[350px] lg:px-14">
      <div className="relative z-10 mx-auto max-w-3xl -mt-40 md:-mt-44">
        <h1 className="section-title">
          <span className="font-heading text-foreground">Blog</span>
        </h1>
        <p className="section-subtitle mx-auto !mb-0 max-w-lg text-foreground/70">
          {isFr
            ? 'Notes de terrain sur le cloud, le DevOps et le full stack, utiles à lire, actionnables ensuite.'
            : 'Field notes on cloud, DevOps, and full stack: useful to read, actionable next.'}
        </p>
      </div>
      <RetroGrid />
    </section>
  );
};
