import React from 'react';
import { ArrowRight, Briefcase } from 'lucide-react';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { DualCtaButtons } from '@/shared/ui/DualCtaButtons';
import { AuroraRibbons } from '@/shared/ui/aurora-ribbons';

const CONTACT_FROM_ABOUT = '/contact?from=about';

export const AboutCTASection: React.FC = () => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';

  return (
    <section className="relative z-10 mx-4 mb-8 overflow-hidden rounded-lg border border-primary/25 shadow-[0_0_40px_-16px_hsla(268,52%,38%,0.35)] md:mx-10 md:mb-12 lg:mx-14">
      <AuroraRibbons ribbonCount={6} />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-background/15 via-transparent to-background/30" />

      <div className="relative z-10 mx-auto w-full p-5 text-center sm:p-6 md:p-8">
        <div className="mx-auto flex max-w-xl flex-col items-center rounded-md border border-border/40 bg-background/55 px-4 py-5 shadow-sm backdrop-blur-lg dark:bg-background/50 sm:px-6 sm:py-6">
          <h2 className="mb-2 text-lg font-bold text-foreground sm:mb-3 sm:text-xl md:text-2xl">
            {isFr
              ? 'Un profil aligné avec votre besoin ?'
              : 'A profile that matches your need?'}
          </h2>

          <p className="mb-5 max-w-md text-xs leading-relaxed text-muted-foreground sm:mb-6 sm:text-sm">
            {isFr
              ? "Vous avez un aperçu de mon parcours et de ma façon de travailler. Si vous cherchez un partenaire technique pour concevoir, livrer et opérer un produit fiable, poursuivons l'échange ou explorez d'abord les réalisations concrètes."
                  : 'You now have a clear view of my background and how I work. If you need a technical partner to design, ship, and operate a reliable product, let us continue the conversation or start with the concrete case studies.'}
          </p>

          <DualCtaButtons
            className="w-full sm:w-auto"
            primary={{
              label: isFr ? 'Engager la conversation' : 'Start the conversation',
              to: CONTACT_FROM_ABOUT,
              endIcon: (
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              ),
            }}
            secondary={{
              label: isFr ? 'Voir les projets' : 'View projects',
              to: '/projects',
            }}
          />
        </div>
      </div>
    </section>
  );
};
