import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { usePublicContactInfo } from '@/entities/contact/hooks/useContact';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { SpectrumButton } from '@/shared/ui/SpectrumButton';
import { BrandAmbientField } from '@/shared/ui/BrandAmbientField';
import { trackContactClick, trackCtaClick, trackOutboundClick } from '@/app/lib/analytics';

const CONTACT_FROM_PROJECTS = '/contact?from=projects';

export const ProjectCTASection: React.FC = () => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';
  const { data } = usePublicContactInfo();
  const repository =
    data?.data.repository ?? 'https://github.com/barthez-kenwou?tab=repositories';

  return (
    <section className="relative z-10 mb-0 overflow-hidden rounded-lg border border-border">
      <BrandAmbientField intensity="soft" />
      <div className="relative z-10 mx-auto w-full p-2 text-center md:p-3">
        <div className="mx-auto flex max-w-xl flex-col items-center rounded-md border border-border/50 bg-background/70 px-4 py-4 shadow-sm backdrop-blur-md dark:bg-background/55 sm:px-5 sm:py-5">
          <h2 className="mb-1.5 font-heading text-base font-bold text-foreground sm:text-lg md:text-xl">
            {isFr ? 'Ces réalisations vous parlent ?' : 'Do these case studies speak to you?'}
          </h2>

          <p className="mb-4 max-w-md text-[11px] leading-relaxed text-foreground/70 sm:text-xs">
            {isFr
              ? "Si une approche, une stack ou un niveau d'exigence résonne avec votre contexte, démarrons un échange concret."
              : 'If an approach, a stack, or a delivery standard resonates with your context, let us start a focused conversation.'}
          </p>

          <div className="flex flex-col items-center gap-2.5">
            <SpectrumButton asChild variant="solid" size="default">
              <Link
                to={CONTACT_FROM_PROJECTS}
                onClick={() => {
                  trackContactClick('projects_cta');
                  trackCtaClick('contact', 'projects_cta', CONTACT_FROM_PROJECTS);
                }}
                onMouseEnter={() => {
                  void import('@/app/routes/prefetch').then((m) => m.prefetchRoute('/contact'));
                }}
                onTouchStart={() => {
                  void import('@/app/routes/prefetch').then((m) => m.prefetchRoute('/contact'));
                }}
              >
                {isFr ? "Discuter d'un projet" : 'Discuss a project'}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </SpectrumButton>

            <a
              href={repository}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackOutboundClick(repository, 'projects_cta_github')}
              className="text-[12px] font-medium text-foreground/70 underline-offset-4 transition-colors hover:text-primary hover:underline sm:text-[13px]"
            >
              {isFr ? 'Ou explorer sur GitHub' : 'Or explore on GitHub'}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
