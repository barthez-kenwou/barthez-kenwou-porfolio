import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import { cn } from '@/shared/lib';
import { GridPattern } from '@/shared/ui/grid-pattern';
import { TextAnimate } from '@/shared/ui/text-animate';
import { TypingAnimation } from '@/shared/ui/typing-animation';
import { AuroraBackground } from '@/shared/ui/aurora-background';
import { Button } from '@/shared/ui/Button';
import { SpectrumButton } from '@/shared/ui/SpectrumButton';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { useThemeStore } from '@/shared/state/useThemeStore';

const HERO_FLARE = '/images/hero-flare.webp';

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.08 + i * 0.1,
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === 'dark';

  const nameWrapRef = React.useRef<HTMLHeadingElement | null>(null);
  const nameInView = useInView(nameWrapRef, { amount: 0.45, once: false });
  const wasNameInView = React.useRef(false);
  const nameSeenOnce = React.useRef(false);
  const [nameEnterKey, setNameEnterKey] = React.useState(0);

  const squares = React.useMemo(() => {
    const result: [number, number][] = [];
    for (let i = 0; i < 20; i += 1) {
      const a = (i * 9301 + 49297) % 233280;
      const b = (i * 233280 + 49297) % 9301;
      result.push([a % 20, b % 20]);
    }
    return result;
  }, []);

  const roleWords = React.useMemo(
    () =>
      language === 'fr'
        ? ['Développeur Full Stack JS', 'DevOps Engineer', 'AWS Cloud Engineer']
        : ['Full Stack JS Developer', 'DevOps Engineer', 'AWS Cloud Engineer'],
    [language],
  );

  // Replay name blur on each re-appearance (scroll back / route return), not on first paint
  React.useEffect(() => {
    if (nameInView && !wasNameInView.current) {
      if (nameSeenOnce.current) {
        setNameEnterKey((k) => k + 1);
      } else {
        nameSeenOnce.current = true;
      }
    }
    wasNameInView.current = nameInView;
  }, [nameInView]);

  return (
    <AuroraBackground
      intensity="soft"
      showRadialGradient
      className="bg-gradient-to-b from-transparent via-transparent to-background overflow-x-clip"
    >
      {/* Grid - opposite corner from the flare, lightly softened */}
      <GridPattern
        width={30}
        height={30}
        squares={squares}
        className={cn(
          'z-[4] opacity-40 dark:opacity-30 blur-[0.6px]',
          '[mask-image:linear-gradient(to_bottom_right,white,transparent_55%,transparent)]',
          'absolute inset-0 -top-20 -left-16 sm:-top-28 sm:-left-24',
        )}
      />

      {/* Flare is ambient decor: present immediately (no entrance fade with text) */}
      <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden" aria-hidden>
        <div className="absolute -right-[18%] bottom-[2%] w-[130%] max-w-none sm:-right-[14%] sm:bottom-[0%] sm:w-[115%] md:-right-[10%] md:bottom-[-2%] md:w-[95%] lg:-right-[6%] lg:w-[85%] xl:w-[78%]">
          <img
            src={HERO_FLARE}
            alt=""
            decoding="async"
            // React 18 DOM: lowercase attribute (camelCase warn)
            {...{ fetchpriority: 'high' }}
            className={cn(
              'hero-flare-pulse w-full h-auto select-none scale-110 sm:scale-125 -rotate-[3deg] sm:-rotate-[4deg] origin-bottom-right',
              '[mask-image:linear-gradient(90deg,transparent_0%,black_18%,black_82%,transparent_100%),linear-gradient(180deg,transparent_0%,black_12%,black_88%,transparent_100%)]',
              '[-webkit-mask-image:linear-gradient(90deg,transparent_0%,black_18%,black_82%,transparent_100%),linear-gradient(180deg,transparent_0%,black_12%,black_88%,transparent_100%)]',
              '[mask-composite:intersect] [-webkit-mask-composite:source-in]',
            )}
            style={{
              mixBlendMode: isDark ? 'screen' : 'multiply',
              filter: isDark ? undefined : 'saturate(0.8) brightness(1.08)',
            }}
          />
        </div>

        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background to-transparent" />
      </div>

      <section className="relative z-30 w-full px-4 md:px-10 lg:px-14 pt-24 md:pt-28 pb-20 md:pb-24 flex flex-col items-center text-center">
        {/* Greeting - script, discreet */}
        <motion.p
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="font-greeting text-lg sm:text-xl md:text-2xl text-muted-foreground/80 dark:text-muted-foreground/70 mb-2 leading-none"
        >
          {t('hero.greeting')}
        </motion.p>

        {/* Name - blurIn replays on each re-appearance */}
        <motion.h1
          ref={nameWrapRef}
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-3"
        >
          <TextAnimate
            key={`barthez-${nameEnterKey}`}
            animation="blurIn"
            as="span"
            once={false}
            startOnView={false}
            className="inline-block mr-2"
            segmentClassName="gradient-text"
          >
            Barthez
          </TextAnimate>
          <TextAnimate
            key={`kenwou-${nameEnterKey}`}
            animation="blurIn"
            by="character"
            duration={1}
            once={false}
            startOnView={false}
            className="inline-block uppercase"
            segmentClassName="gradient-text"
          >
            Kenwou
          </TextAnimate>
        </motion.h1>

        {/* Role - hand writing cursor (height reserved by TypingAnimation sizer) */}
        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mb-4 flex min-h-[1.5em] items-center justify-center"
        >
          <p className="text-base sm:text-xl md:text-2xl lg:text-3xl font-normal text-primary/85 dark:text-primary/90 tracking-wide leading-[1.35]">
            <TypingAnimation
              key={language}
              words={roleWords}
              loop
              startOnView={false}
              typeSpeed={55}
              duration={70}
              pauseDelay={1400}
              cursorStyle="hand"
            />
          </p>
        </motion.div>

        {/* Pitch - tighter type */}
        <motion.p
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mx-auto max-w-lg text-sm leading-relaxed text-muted-foreground/90 mb-9"
        >
          {t('hero.description')}
        </motion.p>

        {/* CTAs - Contact (spectrum, sole rainbow) + Projects (outline) */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <SpectrumButton asChild variant="solid" size="default">
            <Link to="/contact">
              {t('hero.cta.contact')}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </SpectrumButton>

          <Button asChild variant="outline" size="lg" className="min-h-10 px-6">
            <Link to="/projects">{t('hero.cta.projects')}</Link>
          </Button>
        </motion.div>
      </section>
    </AuroraBackground>
  );
};
