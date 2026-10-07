import { useLanguageStore } from '@/shared/state/useLanguageStore';
import React from 'react';
import { AboutSectionIcon } from './AboutSectionIcon';

export const BioSection: React.FC = () => {
  const { language } = useLanguageStore();

  return (
    <section className="glass rounded-md p-4 md:p-6 border border-border animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <AboutSectionIcon variant="bio" />
        <h3 className="text-xl font-semibold text-foreground">Bio</h3>
      </div>

      <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
        <p>
          {language === 'fr'
            ? 'Dans un contexte où produire du code devient de plus en plus accessible, la vraie différence se joue dans la capacité à concevoir et livrer des systèmes utiles, fiables et durables. Ma valeur réside dans ma capacité à transformer une idée, un besoin métier ou une vision produit en une solution scalable, robuste et réellement exploitable.'
            : 'Passionate about web development and cloud computing for over 3 years, I specialize in creating modern, high-performance, and scalable web applications.'}
        </p>
        <p>
          {language === 'fr'
            ? 'En tant que Développeur Full Stack et Ingénieur DevOps, j’interviens sur l’ensemble de la chaîne de valeur : architecture, développement, cloud, automatisation, sécurité, performance et mise en production. Mon approche ne consiste pas seulement à faire fonctionner un produit, mais à le rendre robuste, maintenable et prêt pour la réalité du terrain.'
            : 'My expertise covers the entire development cycle, from design to production deployment, including performance optimization and security. I master AWS technologies and DevOps practices to ensure reliable and automated deployments.'}
        </p>
        <p>
          {language === 'fr'
            ? 'Je conçois la technologie comme un levier de livraison, de clarté et de confiance. Mon objectif est de construire des produits qui tiennent dans le temps, soutiennent la croissance et répondent à de vrais enjeux business.'
            : 'Always looking for new challenges, I continuously invest in learning new technologies and industry best practices.'}
        </p>
      </div>
    </section>
  );
};
