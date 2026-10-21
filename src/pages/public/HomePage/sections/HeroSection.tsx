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
      className={cn(
        'overflow-x-clip bg-gradient-to-b from-transparent via-transparent to-background',
        'min-h-[100svh] justify-center',
      )}
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

      {/* Flare — dark mode only (harsh / washed-out in light) */}
      {isDark ? (
        <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden" aria-hidden>
          <div
            className={cn(
              // Pin to bottom-right of the first viewport (above the mobile dock).
              'absolute -right-[18%] bottom-[4.25rem] w-[130%] max-w-none',
              'sm:-right-[14%] sm:bottom-[4.75rem] sm:w-[115%]',
              'md:-right-[10%] md:bottom-[-2%] md:w-[95%]',
              'lg:-right-[6%] lg:bottom-[-2%] lg:w-[85%] xl:w-[78%]',
            )}
          >
            <img
              src={HERO_FLARE}
              alt=""
              decoding="async"
              {...{ fetchpriority: 'high' }}
              className={cn(
                'hero-flare-pulse h-auto w-full origin-bottom-right scale-110 -rotate-[3deg] select-none',
                'sm:scale-125 sm:-rotate-[4deg]',
                '[mask-image:linear-gradient(90deg,transparent_0%,black_18%,black_82%,transparent_100%),linear-gradient(180deg,transparent_0%,black_12%,black_88%,transparent_100%)]',
                '[-webkit-mask-image:linear-gradient(90deg,transparent_0%,black_18%,black_82%,transparent_100%),linear-gradient(180deg,transparent_0%,black_12%,black_88%,transparent_100%)]',
                '[mask-composite:intersect] [-webkit-mask-composite:source-in]',
              )}
              style={{ mixBlendMode: 'screen' }}
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent sm:h-24 md:h-28" />
        </div>
      ) : null}

      {/*
        Pad for fixed mobile chrome, then optically center the copy in the remaining band
        (slightly above true mid via heavier bottom pad = eye-line framing).
      */}
      <section className="relative z-30 flex w-full flex-1 flex-col items-center justify-center px-4 pt-[5.75rem] pb-[7.25rem] text-center sm:pt-24 sm:pb-28 md:px-10 md:pt-28 md:pb-16 lg:px-14 xl:pt-24">
        <div className="relative z-10 flex w-full max-w-3xl flex-col items-center">
          {/* Greeting - script, discreet */}
          <motion.p
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mb-1.5 font-greeting text-lg leading-none text-foreground/70 sm:mb-2 sm:text-xl md:text-2xl dark:text-muted-foreground"
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
            className="font-display mb-2 text-[2.15rem] leading-[1.05] text-foreground sm:mb-3 sm:text-5xl md:text-6xl lg:text-7xl"
          >
            <TextAnimate
              key={`barthez-${nameEnterKey}`}
              animation="blurIn"
              as="span"
              once={false}
              startOnView={false}
              className="mr-2 inline-block"
              segmentClassName="text-foreground"
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
              segmentClassName="text-foreground"
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
            className="mb-3 flex min-h-[1.5em] items-center justify-center sm:mb-4"
          >
            <p className="font-heading text-base font-medium tracking-wide text-primary sm:text-xl md:text-2xl lg:text-3xl leading-[1.35]">
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
            className="mx-auto mb-6 max-w-lg text-sm leading-relaxed text-foreground/75 sm:mb-8 md:mb-9"
          >
            {t('hero.description')}
          </motion.p>

          {/* CTAs - Contact (spectrum, sole rainbow) + Projects (outline) */}
          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center justify-center gap-2.5 sm:flex-row sm:gap-3"
          >
            <SpectrumButton asChild variant="spectrum" size="default">
              <Link
                to="/contact?from=home"
                onClick={() => {
                  void import('@/app/lib/analytics').then((m) => {
                    m.trackContactClick('home_hero');
                    m.trackCtaClick('contact', 'home_hero', '/contact?from=home');
                  });
                }}
              >
                {t('hero.cta.contact')}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </SpectrumButton>

            <Button asChild variant="outline" size="lg" className="min-h-10 px-6">
              <Link
                to="/projects"
                onClick={() => {
                  void import('@/app/lib/analytics').then((m) =>
                    m.trackCtaClick('projects', 'home_hero', '/projects'),
                  );
                }}
              >
                {t('hero.cta.projects')}
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </AuroraBackground>
  );
};
