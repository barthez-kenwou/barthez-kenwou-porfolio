import { RetroGrid } from '@/shared/ui/retro-grid';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const HeroSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="relative mb-16 animate-fade-in pt-24 text-center">
      <div>
        <h1 className="section-title">
          <span className="font-display text-foreground">{t('projects.title')}</span>
        </h1>

        <p className="section-subtitle">{t('projects.subtitle')}</p>
      </div>

      <RetroGrid />
    </section>
  );
};
