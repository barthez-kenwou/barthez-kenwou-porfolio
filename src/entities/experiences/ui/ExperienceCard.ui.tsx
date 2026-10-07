import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { IExperience } from '../model/experience.types';

export const ExperienceCard: React.FC<{ Experience: IExperience }> = ({ Experience }) => {
  const { language } = useLanguageStore();

  const { titleFr, titleEn, period, companyFr, companyEn, descriptionFr, descriptionEn } =
    Experience;

  return (
    <div className="relative pl-4 pb-6 border-l-2 border-border nth-[2n-1]:pb-0 nth-[2n-1]:border-l-primary pr-6 border-r-2 nth-[2n]:border-r-primary">
      <div className="absolute -left-2.25 top-0 h-4 w-4 rounded-full bg-primary" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
        <h4 className="font-medium text-[11px] text-foreground">
          {language === 'fr' ? titleFr : titleEn}
        </h4>
        <span className="text-xs text-primary font-mono">{period}</span>
      </div>

      <p className="text-sm font-thin uppercase text-muted-foreground mb-2">
        {language === 'fr' ? companyFr : companyEn}
      </p>

      <ul className="list-disc list-inside space-y-1">
        {(language === 'fr' ? descriptionFr : descriptionEn).map((desc: string, i: number) => (
          <li key={i} className="text-sm text-muted-foreground">
            {desc}
          </li>
        ))}
      </ul>

      <div className="absolute -right-2 -top-1.5 h-4 w-4 rounded-full bg-primary" />
    </div>
  );
};
