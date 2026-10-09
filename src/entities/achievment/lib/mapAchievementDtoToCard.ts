import type { ComponentType, SVGProps } from 'react';
import { Clock, Rocket, Target, Trophy } from 'lucide-react';
import type { IAchievementDto } from '../api/achievement.api';
import { ACHIEVEMENT_ICON_KEYS } from '../api/achievement.api';
import type { IAchievement } from '../model/achievement.type';

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const ACHIEVEMENT_ICONS: Record<(typeof ACHIEVEMENT_ICON_KEYS)[number], IconComponent> = {
  clock: Clock,
  rocket: Rocket,
  target: Target,
  trophy: Trophy,
};

export function mapAchievementDtoToCard(dto: IAchievementDto): IAchievement {
  const key = dto.iconKey as (typeof ACHIEVEMENT_ICON_KEYS)[number];
  return {
    icon: ACHIEVEMENT_ICONS[key] ?? Trophy,
    value: dto.value,
    labelFr: dto.labelFr,
    labelEn: dto.labelEn,
  };
}
