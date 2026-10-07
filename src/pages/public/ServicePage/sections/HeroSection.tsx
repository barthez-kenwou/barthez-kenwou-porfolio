import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { RetroGrid } from '@/shared/ui/retro-grid';
import React from 'react';

export const HeroSection: React.FC = () => {
  const { language } = useLanguageStore();

  return (
    <section className="relative mb-16 animate-fade-in pt-16 text-center">
      <div>
        <h1 className="section-title">
          {language === 'fr' ? 'Mes ' : 'My '}
          <span className="gradient-text">Services</span>
        </h1>

        <p className="section-subtitle">
          {language === 'fr'
            ? 'Offres claires pour concevoir, livrer et opérer des produits fiables: cloud, DevOps et full stack.'
            : 'Clear offers to design, ship, and operate reliable products: cloud, DevOps, and full stack.'}
        </p>
      </div>

      <RetroGrid />
    </section>
  );
};
