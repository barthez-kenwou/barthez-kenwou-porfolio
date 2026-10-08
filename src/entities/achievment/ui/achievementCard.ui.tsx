import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { IAchievement } from '../model/achievement.type';

export const AchievmentCard: React.FC<{ Achievment: IAchievement }> = ({ Achievment }) => {
  const { language } = useLanguageStore();

  const { value, labelFr, labelEn } = Achievment;

  return (
    <div className="text-center p-3 rounded-sm bg-linear-to-br from-primary/10 to-transparent border border-primary/10 hover:border-primary/30 transition-colors">
      <span className="block text-2xl font-bold text-foreground font-heading mb-1">{value}</span>
      <span className="text-xs text-muted-foreground">{language === 'fr' ? labelFr : labelEn}</span>
    </div>
  );
};
