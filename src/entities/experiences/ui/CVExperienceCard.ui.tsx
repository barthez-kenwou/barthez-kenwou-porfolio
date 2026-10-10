import React from 'react';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { IExperience } from '../model/experience.types';

/** Renders `inline code` with readable light/dark contrast */
function ExperienceLine({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
          return (
            <code
              key={i}
              className="mx-0.5 rounded-sm bg-primary/12 px-1 py-0.5 font-mono text-[0.92em] font-medium text-primary dark:bg-primary/15 dark:text-primary"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
}

export const CVExperienceCard: React.FC<{ Experience: IExperience }> = ({ Experience }) => {
  const { language } = useLanguageStore();

  const { titleFr, titleEn, period, companyFr, companyEn, descriptionFr, descriptionEn } =
    Experience;

  const bullets = language === 'fr' ? descriptionFr : descriptionEn;

  return (
    <div className="ml-2 border-l-2 border-primary/45 pl-4 dark:border-primary/35">
      <div className="mb-1.5 flex flex-col gap-0.5 md:flex-row md:items-baseline md:justify-between md:gap-3">
        <h3 className="text-sm font-semibold tracking-tight text-foreground sm:text-[15px]">
          {language === 'fr' ? titleFr : titleEn}
        </h3>
        <span className="shrink-0 font-mono text-xs font-medium text-primary">{period}</span>
      </div>

      <p className="mb-2.5 text-xs font-medium text-foreground/80 sm:text-sm dark:text-foreground/70">
        {language === 'fr' ? companyFr : companyEn}
      </p>

      <ul className="space-y-1.5">
        {bullets.map((desc: string, i: number) => (
          <li
            key={i}
            className="relative pl-3.5 text-xs leading-relaxed text-foreground/80 sm:text-sm dark:text-foreground/75"
          >
            <span
              aria-hidden
              className="absolute top-[0.55em] left-0 size-1 rounded-full bg-primary/80"
            />
            <ExperienceLine text={desc} />
          </li>
        ))}
      </ul>
    </div>
  );
};
