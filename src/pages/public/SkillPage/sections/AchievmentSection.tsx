import { AchievmentCard, mapAchievementDtoToCard, usePublicAchievements } from '@/entities/achievment';
import { QueryState } from '@/shared/ui/QueryState';
import { useTranslation } from 'react-i18next';
import React, { useMemo } from 'react';
import { AiFillTrophy } from 'react-icons/ai';

export const AchievmentSection: React.FC = () => {
  const { t } = useTranslation();
  const { data, isPending, isError, error } = usePublicAchievements();

  const achievements = useMemo(
    () => (data?.data.items ?? []).map(mapAchievementDtoToCard),
    [data],
  );

  return (
    <section className="px-4 md:px-10 lg:px-14">
      <div className="glass rounded-md border border-border p-3">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-sm bg-primary/10 p-2">
            <AiFillTrophy className="h-4 w-4 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">{t('skills.achievements')}</h3>
        </div>

        <QueryState
          isPending={isPending}
          isError={isError}
          errorMessage={error instanceof Error ? error.message : undefined}
          source={data?.source}
          empty={!isPending && achievements.length === 0}
        >
          <div className="grid grid-cols-2 justify-between gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-6">
            {achievements.map((achievement, index) => (
              <AchievmentCard key={index} Achievment={achievement} />
            ))}
          </div>
        </QueryState>
      </div>
    </section>
  );
};
