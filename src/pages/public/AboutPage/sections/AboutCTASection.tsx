import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { SpectrumButton } from '@/shared/ui/SpectrumButton';
import { BrandAmbientField } from '@/shared/ui/BrandAmbientField';
import { trackContactClick, trackCtaClick } from '@/app/lib/analytics';

const CONTACT_FROM_ABOUT = '/contact?from=about';

export const AboutCTASection: React.FC = () => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';

  return (
    <section className="relative z-10 mx-4 mb-0 overflow-hidden rounded-lg border border-border md:mx-10 lg:mx-14">
      <BrandAmbientField intensity="soft" />
      <div className="relative z-10 mx-auto w-full p-2 text-center md:p-3">
        <div className="mx-auto flex max-w-xl flex-col items-center rounded-md border border-border/50 bg-background/70 px-4 py-4 shadow-sm backdrop-blur-md dark:bg-background/55 sm:px-5 sm:py-5">
          <h2 className="mb-1.5 font-heading text-base font-bold text-foreground sm:text-lg md:text-xl">
            {isFr
              ? 'Un profil aligné avec votre besoin ?'
              : 'A profile that matches your need?'}
          </h2>

          <p className="mb-4 max-w-md text-[11px] leading-relaxed text-foreground/70 sm:text-xs">
            {isFr
              ? "Vous avez un aperçu de mon parcours et de ma façon de travailler. Si vous cherchez un partenaire technique pour concevoir, livrer et opérer un produit fiable, poursuivons l'échange."
              : 'You now have a clear view of my background and how I work. If you need a technical partner to design, ship, and operate a reliable product, let us continue the conversation.'}
          </p>

          <div className="flex flex-col items-center gap-2.5">
            <SpectrumButton asChild variant="solid" size="default">
              <Link
                to={CONTACT_FROM_ABOUT}
                onClick={() => {
                  trackContactClick('about_cta');
                  trackCtaClick('contact', 'about_cta', CONTACT_FROM_ABOUT);
                }}
                onMouseEnter={() => {
                  void import('@/app/routes/prefetch').then((m) => m.prefetchRoute('/contact'));
                }}
                onTouchStart={() => {
                  void import('@/app/routes/prefetch').then((m) => m.prefetchRoute('/contact'));
                }}
              >
                {isFr ? 'Engager la conversation' : 'Start the conversation'}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </SpectrumButton>

            <Link
              to="/projects"
              onClick={() => trackCtaClick('projects', 'about_cta', '/projects')}
              className="text-[12px] font-medium text-foreground/70 underline-offset-4 transition-colors hover:text-primary hover:underline sm:text-[13px]"
            >
              {isFr ? 'Ou voir les réalisations' : 'Or view the case studies'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
