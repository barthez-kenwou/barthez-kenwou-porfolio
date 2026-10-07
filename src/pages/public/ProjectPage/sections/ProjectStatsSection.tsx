import React from 'react';
import { useTranslation } from 'react-i18next';

import { IconCloud } from '@/shared/ui/icon-cloud';
import { imageIcon } from '@/entities/skills/api/mocks/skillsData.mocks';
import { DeferredMount } from '@/shared/ui/DeferredMount';
import { SparklesCore } from '@/shared/ui/sparkles';
import { cn } from '@/shared/lib/utils';
import { useThemeStore } from '@/shared/state/useThemeStore';

// ─── Static 3D metric icons (no animation) ─────────────────────────────────────

const iconClass = 'h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9';

const IconUsers3D = () => (
  <svg viewBox="0 0 64 64" className={iconClass} aria-hidden>
    <defs>
      <linearGradient id="u-body" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="hsl(262 83% 68%)" />
        <stop offset="100%" stopColor="hsl(262 72% 42%)" />
      </linearGradient>
      <linearGradient id="u-side" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="hsl(262 60% 38%)" />
        <stop offset="100%" stopColor="hsl(262 55% 28%)" />
      </linearGradient>
      <linearGradient id="u-face" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="hsl(262 90% 82%)" />
        <stop offset="100%" stopColor="hsl(262 75% 58%)" />
      </linearGradient>
    </defs>
    <ellipse cx="32" cy="54" rx="18" ry="4" fill="hsl(262 40% 20% / 0.25)" />
    <path d="M18 46c0-7 6-12 14-12s14 5 14 12v2H18v-2z" fill="url(#u-body)" />
    <path d="M46 46c0-5 4-9 10-9s10 4 10 9v2H46v-2z" fill="url(#u-side)" opacity="0.85" />
    <circle cx="32" cy="24" r="9" fill="url(#u-face)" />
    <circle cx="52" cy="28" r="7" fill="url(#u-face)" opacity="0.9" />
    <path d="M24 22c2-3 6-4 10-2" stroke="hsl(0 0% 100% / 0.35)" strokeWidth="1.5" fill="none" />
  </svg>
);

const IconPerformance3D = () => (
  <svg viewBox="0 0 64 64" className={iconClass} aria-hidden>
    <defs>
      <linearGradient id="p-bolt" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="hsl(45 95% 72%)" />
        <stop offset="55%" stopColor="hsl(32 95% 55%)" />
        <stop offset="100%" stopColor="hsl(18 90% 45%)" />
      </linearGradient>
      <linearGradient id="p-core" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0%" stopColor="hsl(262 80% 55%)" />
        <stop offset="100%" stopColor="hsl(280 70% 40%)" />
      </linearGradient>
    </defs>
    <ellipse cx="32" cy="56" rx="16" ry="3.5" fill="hsl(32 60% 20% / 0.22)" />
    <path d="M36 8L18 34h12l-4 22 22-30H36L40 8z" fill="url(#p-bolt)" />
    <path d="M34 12l-12 20h8l-2 14 14-20h-8l4-14z" fill="url(#p-core)" opacity="0.45" />
    <path d="M28 18l8 2-4 8" stroke="hsl(0 0% 100% / 0.4)" strokeWidth="1.2" fill="none" />
  </svg>
);

const IconCloud3D = () => (
  <svg viewBox="0 0 64 64" className={iconClass} aria-hidden>
    <defs>
      <linearGradient id="c-top" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="hsl(210 90% 92%)" />
        <stop offset="100%" stopColor="hsl(220 70% 78%)" />
      </linearGradient>
      <linearGradient id="c-base" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="hsl(262 55% 62%)" />
        <stop offset="100%" stopColor="hsl(262 65% 42%)" />
      </linearGradient>
    </defs>
    <ellipse cx="32" cy="54" rx="20" ry="4" fill="hsl(262 40% 20% / 0.2)" />
    <path
      d="M20 42c-6 0-10-4-10-9s4-9 10-9c1-7 7-12 14-12 6 0 11 4 13 9 6 1 10 5 10 11 0 6-5 10-11 10H20z"
      fill="url(#c-base)"
    />
    <path
      d="M22 38c-4.5 0-8-3-8-7s3.5-7 8-7c1-5.5 5.5-9.5 11-9.5 5 0 9 3 10.5 7.5 4.5.5 8 4 8 8.5 0 4.5-3.5 7.5-8 7.5H22z"
      fill="url(#c-top)"
      opacity="0.85"
    />
    <circle cx="28" cy="30" r="2" fill="hsl(0 0% 100% / 0.55)" />
    <circle cx="38" cy="28" r="1.5" fill="hsl(0 0% 100% / 0.4)" />
  </svg>
);

const IconPipeline3D = () => (
  <svg viewBox="0 0 64 64" className={iconClass} aria-hidden>
    <defs>
      <linearGradient id="pipe-a" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="hsl(160 70% 55%)" />
        <stop offset="100%" stopColor="hsl(170 65% 35%)" />
      </linearGradient>
      <linearGradient id="pipe-b" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="hsl(262 80% 70%)" />
        <stop offset="100%" stopColor="hsl(262 70% 42%)" />
      </linearGradient>
      <linearGradient id="pipe-c" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="hsl(200 85% 65%)" />
        <stop offset="100%" stopColor="hsl(210 75% 40%)" />
      </linearGradient>
    </defs>
    <ellipse cx="32" cy="56" rx="18" ry="3.5" fill="hsl(262 40% 20% / 0.22)" />
    <rect x="8" y="26" width="14" height="12" rx="3" fill="url(#pipe-a)" />
    <rect x="25" y="26" width="14" height="12" rx="3" fill="url(#pipe-b)" />
    <rect x="42" y="26" width="14" height="12" rx="3" fill="url(#pipe-c)" />
    <path
      d="M22 32h3M39 32h3"
      stroke="hsl(0 0% 100% / 0.55)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="15" cy="32" r="2.2" fill="hsl(0 0% 100% / 0.85)" />
    <circle cx="32" cy="32" r="2.2" fill="hsl(0 0% 100% / 0.85)" />
    <circle cx="49" cy="32" r="2.2" fill="hsl(0 0% 100% / 0.85)" />
    <path
      d="M15 20v6M32 18v8M49 22v4"
      stroke="hsl(262 40% 55% / 0.5)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="15" cy="18" r="2" fill="url(#pipe-a)" />
    <circle cx="32" cy="16" r="2" fill="url(#pipe-b)" />
    <circle cx="49" cy="20" r="2" fill="url(#pipe-c)" />
  </svg>
);

// ─── Impact metric card ────────────────────────────────────────────────────────

interface MetricProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  particleColor: string;
  beamVia: string;
  beamAccent: string;
}

const ImpactMetricCard: React.FC<MetricProps> = ({
  icon,
  value,
  label,
  particleColor,
  beamVia,
  beamAccent,
}) => {
  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === 'dark';
  const maskBg = isDark ? 'bg-background' : 'bg-background';

  return (
    <div
      className={cn(
        'relative flex min-h-0 flex-col items-center overflow-hidden rounded-md pt-2.5 sm:pt-3',
        'bg-secondary/10 dark:bg-black/40',
        'ring-1 ring-border/40 dark:ring-white/10',
      )}
    >
      <div className="relative z-20 mb-0.5 flex justify-center px-2 sm:mb-1 sm:px-3">{icon}</div>

      <div className="relative z-20 px-2 text-center sm:px-3">
        <p className="text-base font-bold tracking-tight text-foreground sm:text-lg md:text-xl">
          {value}
        </p>
        <p className="mt-0.5 text-[8px] font-semibold uppercase leading-tight tracking-[0.12em] text-primary sm:text-[9px] sm:tracking-[0.14em]">
          {label}
        </p>
      </div>

      <div className="relative mt-2 h-10 w-full sm:mt-2.5 sm:h-12 md:h-14">
        <div
          className={cn(
            'absolute inset-x-4 top-0 h-[2px] w-3/4 bg-gradient-to-r from-transparent to-transparent blur-sm sm:inset-x-6',
            beamVia,
          )}
        />
        <div
          className={cn(
            'absolute inset-x-4 top-0 h-px w-3/4 bg-gradient-to-r from-transparent to-transparent sm:inset-x-6',
            beamVia,
          )}
        />
        <div
          className={cn(
            'absolute inset-x-10 top-0 h-[4px] w-1/4 bg-gradient-to-r from-transparent to-transparent blur-sm sm:inset-x-14',
            beamAccent,
          )}
        />
        <div
          className={cn(
            'absolute inset-x-10 top-0 h-px w-1/4 bg-gradient-to-r from-transparent to-transparent sm:inset-x-14',
            beamAccent,
          )}
        />

        <SparklesCore
          background="transparent"
          minSize={0.3}
          maxSize={0.85}
          particleDensity={320}
          className="h-full w-full"
          particleColor={particleColor}
          speed={0.28}
        />

        <div
          className={cn(
            'absolute inset-0 h-full w-full',
            maskBg,
            '[mask-image:radial-gradient(120px_60px_at_top,transparent_20%,white)] sm:[mask-image:radial-gradient(150px_70px_at_top,transparent_20%,white)]',
          )}
        />
      </div>
    </div>
  );
};

// ─── Section ───────────────────────────────────────────────────────────────────

export const ProjectStatsSection: React.FC = () => {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';
  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === 'dark';

  const metrics = [
    {
      icon: <IconUsers3D />,
      value: '+1,000',
      label: isFr ? 'Utilisateurs' : 'Users',
      particleColor: isDark ? '#E9D5FF' : '#7C3AED',
      beamVia: 'via-primary',
      beamAccent: 'via-violet-400',
    },
    {
      icon: <IconPerformance3D />,
      value: '+15%',
      label: isFr ? 'Performance' : 'Performance',
      particleColor: isDark ? '#FDE68A' : '#D97706',
      beamVia: 'via-amber-400',
      beamAccent: 'via-orange-500',
    },
    {
      icon: <IconCloud3D />,
      value: '10+',
      label: isFr ? 'Projets Cloud' : 'Cloud Projects',
      particleColor: isDark ? '#BAE6FD' : '#0284C7',
      beamVia: 'via-sky-400',
      beamAccent: 'via-primary',
    },
    {
      icon: <IconPipeline3D />,
      value: '10+',
      label: isFr ? 'Pipelines CI/CD' : 'CI/CD Pipelines',
      particleColor: isDark ? '#A7F3D0' : '#059669',
      beamVia: 'via-emerald-400',
      beamAccent: 'via-teal-500',
    },
  ];

  return (
    <section className="grid items-center gap-12 py-12 lg:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="relative mx-auto mb-0 flex min-h-[260px] w-full max-w-[280px] items-center justify-center sm:min-h-[300px] sm:max-w-[320px] lg:min-h-[320px] lg:max-w-[340px]">
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
          <DeferredMount
            className="flex w-full justify-center"
            timeout={700}
            fallback={<div className="h-[300px] w-full" aria-hidden />}
          >
            <IconCloud images={imageIcon} size={340} className="w-full" />
          </DeferredMount>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-5">
        <div className="space-y-1.5 text-center lg:text-left sm:space-y-2">
          <h2 className="section-title">
            <span className="gradient-text text-2xl md:text-3xl">
              {isFr ? 'Impact & Expertise Globale' : 'Global Impact & Expertise'}
            </span>
          </h2>
          <p className="section-subtitle !mb-0 text-sm">
            {isFr
              ? "Des solutions robustes déployées à l'échelle, alliant performance et automatisation."
              : 'Robust solutions deployed at scale, combining performance and automation.'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
          {metrics.map((metric) => (
            <ImpactMetricCard key={metric.label} {...metric} />
          ))}
        </div>
      </div>
    </section>
  );
};
