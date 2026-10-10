import { RetroGrid } from '@/shared/ui/retro-grid';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const HeroSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="relative mb-8 animate-fade-in px-4 pt-[350px] text-center md:mb-12 md:px-10 md:pt-[350px] lg:px-14">
      <div className="relative z-10 mx-auto max-w-3xl -mt-40 md:-mt-44">
        <h1 className="section-title">
          <span className="font-heading text-foreground">{t('skills.title')}</span>
        </h1>
        <p className="section-subtitle mx-auto !mb-0 max-w-lg text-foreground/70">
          {t('skills.subtitle')}
        </p>
      </div>
      <RetroGrid />
    </section>
  );
};
