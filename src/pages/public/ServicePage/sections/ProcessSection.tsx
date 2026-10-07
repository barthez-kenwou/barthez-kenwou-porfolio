import { processSteps } from '@/shared/mocks/processSteps.mocks';
import React from 'react';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Globe } from '@/shared/ui/globe';
import { DeferredMount } from '@/shared/ui/DeferredMount';

export const ProcessSection: React.FC = () => {
  const { language } = useLanguageStore();

  return (
    <section className="relative mb-14 overflow-x-clip px-4 py-0 md:px-10 lg:px-14">
      <div className="text-center mb-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-title">
            {language === 'fr' ? 'Mon Processus ' : 'My Work '}
            <span className="gradient-text">{language === 'fr' ? 'de Travail' : 'Process'}</span>
          </h2>
          <div className="w-16 h-1 bg-primary/30 mx-auto rounded-full mb-4" />
          <p className="section-subtitle !mb-0 italic opacity-90">
            {language === 'fr'
              ? "Une approche structurée et transparente pour transformer vos idées en solutions numériques d'exception."
              : 'A structured and transparent approach to transform your ideas into exceptional digital solutions.'}
          </p>
        </motion.div>
      </div>

      <div className="relative max-w-6xl mx-auto px-2 sm:px-3">
        {/* Background Decorative Gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

        {/* Central Background Globe - deferred until near viewport */}
        <div className="absolute z-5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[78%] max-w-[560px] md:w-[62%] md:max-w-[520px] lg:max-w-[480px] aspect-square pointer-events-none -z-20 select-none opacity-35 dark:opacity-22 flex items-center justify-center">
          <DeferredMount
            className="absolute inset-0"
            timeout={900}
            fallback={<div className="absolute inset-0" aria-hidden />}
          >
            <Globe />
          </DeferredMount>
          <div className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-primary/20 blur-[100px] rounded-full" />
        </div>

        {/* Central Vertical Line (Visible on md+) */}
        <div className="absolute left-8 md:left-1/2 top-4 bottom-4 w-[1px] bg-linear-to-b from-transparent via-border to-transparent md:-translate-x-1/2 hidden sm:block" />

        <div className="space-y-6 md:space-y-0 relative z-10">
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;

            return (
              <div
                key={index}
                className={cn(
                  'relative flex flex-col md:flex-row items-center justify-between md:py-4 group',
                  !isEven && 'md:flex-row-reverse',
                )}
              >
                {/* Content Card container */}
                <motion.div
                  className="w-full md:w-[45%] z-10"
                  initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.7, delay: index * 0.1, ease: 'easeOut' }}
                >
                  <div
                    className={cn(
                      'glass p-3 md:p-4 rounded-md border border-border/40 shadow-sm transition-all duration-500 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 relative group/card ml-14 md:ml-0',
                      isEven ? 'md:text-right' : 'md:text-left',
                    )}
                  >
                    {/* Subtle inner glow */}
                    <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity rounded-md" />

                    <div className="relative z-10">
                      <div
                        className={cn(
                          'flex items-center gap-3 mb-4',
                          isEven ? 'md:flex-row-reverse' : 'md:flex-row',
                        )}
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary text-primary-foreground text-xs font-bold shadow-sm shadow-primary/20">
                          {index + 1}
                        </div>
                        <div className="h-[1px] flex-1 bg-linear-to-r from-primary/30 to-transparent hidden md:block" />
                      </div>

                      <h3 className="text-sm md:text-base font-bold text-foreground mb-3 group-hover/card:text-primary transition-colors duration-300">
                        {language === 'fr' ? step.titleFr : step.titleEn}
                      </h3>
                      <p className="text-muted-foreground text-xs leading-relaxed opacity-90">
                        {language === 'fr' ? step.descFr : step.descEn}
                      </p>
                    </div>

                    {/* Decorative accent */}
                    <div
                      className={cn(
                        'absolute top-1/2 -translate-y-1/2 w-1 h-12 bg-primary/40 rounded-full transition-all duration-500 group-hover/card:h-20 group-hover/card:bg-primary',
                        isEven ? 'right-0' : 'left-0',
                      )}
                    />
                  </div>
                </motion.div>

                {/* Central Icon Node */}
                <motion.div
                  className="absolute left-8 md:left-1/2 -translate-x-1/2 flex items-center justify-center z-20"
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 20,
                    delay: 0.3 + index * 0.1,
                  }}
                >
                  <div className="group relative">
                    <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-background border-2 border-primary/20 shadow-md flex items-center justify-center relative z-10 transition-all duration-500 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
                      <Icon className="h-3 w-3 md:h-5 md:w-5 transition-transform duration-500 group-hover:rotate-[360deg]" />
                    </div>
                  </div>
                </motion.div>

                {/* Vertical Line Connector (Mobile) */}
                <div className="absolute left-8 top-12 bottom-[-4rem] w-[1px] bg-border md:hidden z-0 last:hidden" />

                {/* Spacer for Alternate Layout */}
                <div className="w-full md:w-[45%] hidden md:block" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
