import { whyMe } from '@/shared/mocks/whyMe.mocks';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import React from 'react';
import { Terminal, AnimatedSpan, TypingAnimation } from '@/shared/ui/terminal';

export const WhyChooseMeSection: React.FC = () => {
  const { language } = useLanguageStore();

  const isFr = language === 'fr';
  const sectionTitle = isFr ? 'Pourquoi Me Choisir ?' : 'Why Choose Me?';

  return (
    <section className="relative z-10 flex w-full flex-col items-center justify-center overflow-hidden bg-background/40 px-4 py-12 md:px-10 md:py-20 lg:px-14 dark:bg-transparent">
      <div className="pointer-events-none absolute top-1/2 left-1/2 hidden h-[240px] w-full max-w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/[0.05] blur-[70px] dark:block" />

      <div className="flex flex-col items-center w-full max-w-5xl mx-auto">
        <div className="text-center mb-8 md:mb-12 w-full">
          <h2 className="section-title">
            <span className="font-heading text-foreground">{sectionTitle}</span>
          </h2>

          <p className="section-subtitle !mb-0">
            {isFr
              ? 'Une expertise technique au service de vos projets les plus ambitieux.'
              : 'Technical expertise at the service of your most ambitious projects.'}
          </p>
        </div>     

          <Terminal className="relative z-20 mx-auto w-full max-w-2xl border-primary/20 bg-background/80 shadow-lg backdrop-blur-xl">
            <TypingAnimation className="text-xs font-bold text-primary sm:text-sm">
              {isFr ? '$ ls specialites/' : '$ ls core-specialties/'}
            </TypingAnimation>

            <AnimatedSpan className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground sm:gap-1 sm:text-sm">
              <span className="rounded bg-primary/10 px-2 py-1 text-primary">aws-expert</span>
              <span className="rounded bg-muted px-2 py-1">fullstack-js</span>
              <span className="rounded bg-primary/10 px-2 py-1 text-primary">devops-pro</span>
              <span className="rounded bg-muted px-2 py-1">clean-code</span>
            </AnimatedSpan>

            <TypingAnimation
              delay={800}
              className="mt-3 text-xs font-bold text-primary sm:text-sm"
            >
              {isFr ? '$ ./analyser_atouts.sh' : '$ ./analyze_capabilities.sh'}
            </TypingAnimation>

            <AnimatedSpan className="mt-1 text-xs text-muted-foreground sm:text-sm">
              {isFr ? 'Recherche de correspondances...' : 'Searching for matches...'}
            </AnimatedSpan>

            <div className="mt-2 grid gap-0">
              {whyMe.map((item, index) => (
                <AnimatedSpan
                  key={index}
                  delay={index * 500}
                  className="flex items-start gap-3 sm:gap-4"
                >
                  <span className="mt-[2px] shrink-0 text-xs font-bold text-primary sm:text-sm">
                    [ ✓ ]
                  </span>
                  <span className="text-xs font-medium leading-relaxed text-foreground/90 sm:text-sm">
                    {isFr ? item.textFr : item.textEn}
                  </span>
                </AnimatedSpan>
              ))}
            </div>

            <TypingAnimation
              delay={2000}
              className="mt-3 break-words text-xs font-bold text-primary sm:text-sm"
            >
              {isFr ? '$ echo "Prêt à collaborer !"' : '$ echo "Ready to collaborate!"'}
            </TypingAnimation>

            <AnimatedSpan className="mt-0 break-words text-xs font-bold text-primary sm:text-sm">
              {isFr
                ? '> Statut : DISPONIBLE POUR COLLABORER'
                : '> Status: AVAILABLE FOR COLLABORATION'}
            </AnimatedSpan>
          </Terminal>
      </div>
    </section>
  );
};
