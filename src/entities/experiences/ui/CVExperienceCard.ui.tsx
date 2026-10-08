import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { IExperience } from '../model/experience.types';

export const CVExperienceCard: React.FC<{ Experience: IExperience }> = ({ Experience }) => {
  const { language } = useLanguageStore();

  const { titleFr, titleEn, period, companyFr, companyEn, descriptionFr, descriptionEn } =
    Experience;

  return (
    <div className="ml-2 border-l-2 border-primary/30 pl-4">
      <div className="mb-1.5 flex flex-col gap-0.5 md:flex-row md:items-center md:justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          {language === 'fr' ? titleFr : titleEn}
        </h3>
        <span className="font-mono text-xs text-primary">{period}</span>
      </div>
      <p className="mb-2 text-xs text-foreground/70 sm:text-sm">
        {language === 'fr' ? companyFr : companyEn}
      </p>

      <ul className="list-inside list-disc space-y-1">
        {(language === 'fr' ? descriptionFr : descriptionEn).map((desc: string, i: number) => (
          <li key={i} className="text-xs leading-relaxed text-foreground/75 sm:text-sm">
            {desc}
          </li>
        ))}
      </ul>
    </div>
  );
};
