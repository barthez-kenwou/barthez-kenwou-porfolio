import React from 'react';
import { IProject } from '@/entities/projets/model/project.types';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { useThemeStore } from '@/shared/state/useThemeStore';
import { cn } from '@/shared/lib/utils';

const PROBLEM_FLARE = '/images/project-problem-flare.webp';

export const ProblemSolutionSection: React.FC<{ project: IProject }> = ({ project }) => {
  const { language } = useLanguageStore();
  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === 'dark';
  const problem = language === 'fr' ? project.problemFr : project.problemEn;
  const solutions = language === 'fr' ? project.solutionFr : project.solutionEn;

  if (!problem && (!solutions || solutions.length === 0)) return null;

  return (
    <section className="relative mb-16 px-4 md:px-10 lg:px-14 overflow-hidden animate-fade-in-up">
      {/* Flare - vertically centered; from the right on desktop, behind glass on mobile */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <div
          className={cn(
            'absolute top-1/2 -translate-y-1/2',
            'left-1/2 -translate-x-1/2 w-[min(140vw,32rem)]',
            'md:left-auto md:right-[-12%] md:translate-x-0 md:w-[min(95vw,52rem)]',
            'lg:right-[-10%] lg:w-[min(80vw,58rem)]',
            'xl:w-[min(72vw,64rem)]',
          )}
        >
          <img
            src={PROBLEM_FLARE}
            alt=""
            decoding="async"
            className={cn(
              'w-full h-auto select-none scale-110 md:scale-125 lg:scale-[1.35]',
              'opacity-[0.36] dark:opacity-[0.55]',
              '[mask-image:linear-gradient(90deg,transparent_0%,black_12%,black_100%),linear-gradient(0deg,transparent_0%,black_14%,black_86%,transparent_100%)]',
              '[-webkit-mask-image:linear-gradient(90deg,transparent_0%,black_12%,black_100%),linear-gradient(0deg,transparent_0%,black_14%,black_86%,transparent_100%)]',
              '[mask-composite:intersect] [-webkit-mask-composite:source-in]',
            )}
            style={{
              mixBlendMode: isDark ? 'screen' : 'multiply',
              filter: isDark ? 'saturate(1.18) brightness(0.9)' : 'saturate(0.95) brightness(1.05)',
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/55 to-transparent md:via-background/35" />
      </div>

      <div className="relative z-10 grid md:grid-cols-2 gap-5 md:gap-8 lg:gap-10">
        {problem && (
          <div className="relative overflow-hidden rounded-md border border-border/40 bg-card/40 backdrop-blur-xl p-5 md:p-7 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.4)]">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent"
            />
            <div className="relative">
              <h2 className="text-lg md:text-xl font-bold text-foreground mb-3 md:mb-4 tracking-tight">
                {language === 'fr' ? 'Le Problème' : 'The Problem'}
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {problem}
              </p>
            </div>
          </div>
        )}

        {solutions && solutions.length > 0 && (
          <div className="relative overflow-hidden rounded-md border border-primary/25 bg-card/45 backdrop-blur-xl p-5 md:p-7 shadow-[0_8px_32px_-12px_rgba(124,58,237,0.18)]">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/12 via-transparent to-transparent"
            />
            <div className="relative">
              <h2 className="text-lg md:text-xl font-bold text-foreground mb-3 md:mb-4 tracking-tight">
                {language === 'fr' ? 'La Solution' : 'The Solution'}
              </h2>
              <ul className="space-y-3">
                {solutions.map((sol, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-muted-foreground leading-relaxed">{sol}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
