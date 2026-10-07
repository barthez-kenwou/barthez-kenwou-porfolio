import { whyMe } from '@/shared/mocks/whyMe.mocks';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import React from 'react';
import { Terminal, AnimatedSpan, TypingAnimation } from '@/shared/ui/terminal';
import { Pointer } from '@/shared/ui/pointer';
import { motion } from 'motion/react';

export const WhyChooseMeSection: React.FC = () => {
  const { language } = useLanguageStore();

  const isFr = language === 'fr';
  const sectionTitle = isFr ? 'Pourquoi Me Choisir ?' : 'Why Choose Me?';

  return (
    <section className="w-full py-12 md:py-20 px-4 md:px-10 lg:px-14 bg-secondary/10 relative z-10 overflow-hidden flex flex-col items-center justify-center">
      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex flex-col items-center w-full max-w-5xl mx-auto">
        <div className="text-center mb-8 md:mb-12 w-full">
          <h2 className="section-title">
            <span className="gradient-text">{sectionTitle}</span>
          </h2>

          <p className="section-subtitle !mb-0">
            {isFr
              ? 'Une expertise technique au service de vos projets les plus ambitieux.'
              : 'Technical expertise at the service of your most ambitious projects.'}
          </p>
        </div>

        <div className="relative w-full max-w-2xl glass p-3 sm:p-5 md:p-10 rounded-md glow-primary/20">
          <div className="absolute inset-0 z-10 rounded-md">
            <Pointer>
              <motion.div
                animate={{
                  scale: [0.8, 1, 0.8],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-primary"
                >
                  <motion.path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    fill="currentColor"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                </svg>
              </motion.div>
            </Pointer>
          </div>

          <Terminal className="relative z-20 bg-background/80 backdrop-blur-xl border-primary/20 shadow-lg w-full max-w-full">
            <TypingAnimation className="text-primary font-bold text-xs sm:text-sm md:text-base">
              {isFr ? '$ ls specialites/' : '$ ls core-specialties/'}
            </TypingAnimation>

            <AnimatedSpan className="flex gap-2 sm:gap-1 flex-wrap text-muted-foreground mt-2 text-xs sm:text-sm md:text-base">
              <span className="bg-primary/10 px-2 py-1 rounded text-primary">aws-expert</span>
              <span className="bg-muted px-2 py-1 rounded">fullstack-js</span>
              <span className="bg-primary/10 px-2 py-1 rounded text-primary">devops-pro</span>
              <span className="bg-muted px-2 py-1 rounded">clean-code</span>
            </AnimatedSpan>

            <TypingAnimation
              delay={800}
              className="text-primary font-bold mt-3 text-xs sm:text-sm md:text-base"
            >
              {isFr ? '$ ./analyser_atouts.sh' : '$ ./analyze_capabilities.sh'}
            </TypingAnimation>

            <AnimatedSpan className="text-muted-foreground mt-1 text-xs sm:text-sm md:text-base">
              {isFr ? 'Recherche de correspondances...' : 'Searching for matches...'}
            </AnimatedSpan>

            <div className="grid gap-0 sm:gap-0 mt-2">
              {whyMe.map((item, index) => (
                <AnimatedSpan
                  key={index}
                  delay={index * 500}
                  className="flex items-start gap-3 sm:gap-4"
                >
                  <span className="text-primary font-bold shrink-0 mt-[2px] text-sm md:text-base">
                    [ ✓ ]
                  </span>
                  <span className="text-foreground/90 font-medium text-xs sm:text-sm md:text-base leading-relaxed">
                    {isFr ? item.textFr : item.textEn}
                  </span>
                </AnimatedSpan>
              ))}
            </div>

            <TypingAnimation
              delay={2000}
              className="text-primary font-bold mt-3 text-xs sm:text-sm md:text-base break-words"
            >
              {isFr ? '$ echo "Prêt à collaborer !"' : '$ echo "Ready to collaborate!"'}
            </TypingAnimation>

            <AnimatedSpan className="text-primary font-bold mt-0 text-xs sm:text-sm md:text-base break-words">
              {isFr
                ? '> Statut : DISPONIBLE POUR COLLABORER'
                : '> Status: AVAILABLE FOR COLLABORATION'}
            </AnimatedSpan>
          </Terminal>
        </div>
      </div>
    </section>
  );
};
