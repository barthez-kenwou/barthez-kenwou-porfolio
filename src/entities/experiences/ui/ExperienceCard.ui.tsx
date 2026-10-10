import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { IExperience } from '../model/experience.types';
import { cn } from '@/shared/lib/utils';

export const ExperienceCard: React.FC<{ Experience: IExperience }> = ({ Experience }) => {
  const { language } = useLanguageStore();

  const { titleFr, titleEn, period, companyFr, companyEn, descriptionFr, descriptionEn } =
    Experience;

  const title = language === 'fr' ? titleFr : titleEn;
  const company = language === 'fr' ? companyFr : companyEn;
  const bullets = language === 'fr' ? descriptionFr : descriptionEn;

  return (
    <article
      className={cn(
        'relative border-x-2 border-border px-5 pb-7 sm:px-6',
        'nth-[odd]:border-l-primary nth-[even]:border-r-primary',
      )}
    >
      <span
        aria-hidden
        className="absolute top-1.5 -left-[5px] size-2.5 rounded-full bg-primary ring-2 ring-background"
      />
      <span
        aria-hidden
        className="absolute top-1.5 -right-[5px] size-2.5 rounded-full bg-primary ring-2 ring-background"
      />

      <header className="mb-3 flex flex-col gap-1.5 sm:mb-3.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        <h4 className="font-heading text-sm font-semibold tracking-tight text-foreground sm:text-[15px] md:text-base">
          {title}
        </h4>
        <time className="shrink-0 font-mono text-[11px] font-medium tracking-wide text-primary sm:text-xs">
          {period}
        </time>
      </header>

      <p className="mb-3 text-[11px] font-semibold tracking-[0.14em] text-foreground/80 uppercase sm:text-xs dark:text-foreground/60">
        {company}
      </p>

      <ul className="space-y-2">
        {bullets.map((desc: string, i: number) => (
          <li
            key={i}
            className="relative pl-3.5 text-[13px] leading-relaxed text-foreground/80 sm:text-sm dark:text-foreground/70"
          >
            <span
              aria-hidden
              className="absolute top-[0.55em] left-0 size-1 rounded-full bg-primary/70"
            />
            {desc}
          </li>
        ))}
      </ul>
    </article>
  );
};
