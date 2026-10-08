import {
  skillsByCategory,
  skillsData,
  imageIcon,
} from '@/entities/skills/api/mocks/skillsData.mocks';
import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'motion/react';
import { SkillCard } from '@/entities/skills/ui/SkillCard.ui';
import { IconCloud } from '@/shared/ui/icon-cloud';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { cn } from '@/shared/lib/utils';
import { SkillsDomainAtlas } from './SkillsDomainAtlas';

/** 1 = down the list (swipe L→R), -1 = up the list (swipe R→L) */
type SwipeDir = 1 | -1;

const panelEase = [0.22, 1, 0.36, 1] as const;

const panelVariants = {
  enter: (dir: SwipeDir) => ({
    x: dir > 0 ? -56 : 56,
    opacity: 0,
    filter: 'blur(6px)',
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      x: { type: 'spring' as const, stiffness: 120, damping: 22, mass: 0.75 },
      opacity: { duration: 0.35 },
      filter: { duration: 0.4 },
      staggerChildren: 0.045,
      delayChildren: 0.06,
    },
  },
  exit: (dir: SwipeDir) => ({
    x: dir > 0 ? 56 : -56,
    opacity: 0,
    filter: 'blur(5px)',
    transition: {
      duration: 0.32,
      ease: panelEase,
    },
  }),
};

const cardVariants = {
  enter: (dir: SwipeDir) => ({
    x: dir > 0 ? -28 : 28,
    opacity: 0,
    y: 10,
  }),
  center: {
    x: 0,
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 160,
      damping: 22,
      mass: 0.65,
    },
  },
  exit: (dir: SwipeDir) => ({
    x: dir > 0 ? 22 : -22,
    opacity: 0,
    y: -4,
    transition: { duration: 0.22, ease: panelEase },
  }),
};

export const SkillsSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [swipeDir, setSwipeDir] = useState<SwipeDir>(1);
  const prevIndexRef = useRef(0);

  const filteredSkills =
    activeFilter === 'all'
      ? skillsData
      : skillsData.filter((skill) => skill.category === activeFilter);
  const { t } = useTranslation();
  const { language } = useLanguageStore();

  const filters = useMemo(
    () => [
      { id: 'all', labelKey: 'all', count: skillsData.length },
      ...Object.keys(skillsByCategory).map((category) => ({
        id: category,
        labelKey: `${category}`,
        count: (skillsByCategory[category] as unknown[]).length,
      })),
    ],
    [],
  );

  const atlasFilters = useMemo(
    () =>
      filters.map((f) => ({
        id: f.id,
        label: t(f.labelKey),
        count: f.count,
      })),
    [filters, t, language],
  );

  const selectDomain = (id: string) => {
    const nextIndex = filters.findIndex((f) => f.id === id);
    const prevIndex = prevIndexRef.current;
    if (nextIndex !== prevIndex && nextIndex >= 0) {
      setSwipeDir(nextIndex > prevIndex ? 1 : -1);
      prevIndexRef.current = nextIndex;
    }
    setActiveFilter(id);
  };

  return (
    <section className="relative mx-auto w-full max-w-7xl py-12">
      <div className="mb-6 flex flex-wrap justify-center gap-3 md:hidden">
        {filters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => selectDomain(filter.id)}
            className={cn(
              'cursor-pointer rounded-sm border px-3 py-1 text-sm font-medium capitalize transition-colors duration-200',
              activeFilter === filter.id
                ? 'border-brand bg-brand text-brand-foreground'
                : 'border-border/50 bg-secondary/50 text-muted-foreground hover:border-primary/50 hover:text-foreground',
            )}
          >
            {t(filter.labelKey)}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-6 px-4 md:flex-row md:px-10 lg:px-14">
        <aside className="hidden w-full flex-shrink-0 md:block md:w-[13.5rem] lg:w-[15rem]">
          <SkillsDomainAtlas
            filters={atlasFilters}
            activeId={activeFilter}
            onSelect={selectDomain}
            language={language}
          />
        </aside>

        <div className="relative min-h-[320px] flex-1 overflow-hidden pt-6 md:pt-0">
          <AnimatePresence mode="wait" custom={swipeDir} initial={false}>
            {activeFilter === 'all' ? (
              <motion.div
                key="cloud"
                custom={swipeDir}
                variants={panelVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="relative mx-auto mb-0 flex min-h-[280px] w-full max-w-[300px] items-center justify-center sm:min-h-[300px] sm:max-w-[320px] lg:min-h-[320px] lg:max-w-[340px] xl:max-w-[360px]"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 opacity-70 blur-3xl"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-1/2 h-[52%] w-[52%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 opacity-80 blur-2xl"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,transparent_42%,hsl(var(--background)/0.55)_78%,hsl(var(--background)/0.85)_100%)]"
                />

                <div className="relative z-10 flex w-full justify-center">
                  <IconCloud images={imageIcon} size={360} className="w-full" />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={activeFilter}
                custom={swipeDir}
                variants={panelVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="mb-20 grid grid-cols-3 items-stretch gap-2 sm:grid-cols-4 sm:gap-2 md:gap-5 lg:grid-cols-5 xl:grid-cols-6"
              >
                {filteredSkills.map((skill) => (
                  <motion.div
                    key={skill.name}
                    custom={swipeDir}
                    variants={cardVariants}
                    className="h-full min-h-0"
                  >
                    <SkillCard Skill={skill} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
