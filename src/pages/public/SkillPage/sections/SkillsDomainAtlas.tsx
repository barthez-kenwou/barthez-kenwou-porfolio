import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';
import { cn } from '@/shared/lib/utils';
import { DomainIcon3D } from './DomainIcon3D';

export type SkillsDomainFilter = {
  id: string;
  label: string;
  count: number;
};

type SkillsDomainAtlasProps = {
  filters: SkillsDomainFilter[];
  activeId: string;
  onSelect: (id: string) => void;
  language: 'fr' | 'en' | string;
};

/**
 * SkillsDomainAtlas - cartographic instrument for domain navigation.
 * Meridian rail, soft isometric domain marks, density meters.
 */
export function SkillsDomainAtlas({
  filters,
  activeId,
  onSelect,
  language,
}: SkillsDomainAtlasProps) {
  const uid = useId().replace(/:/g, '');
  const activeIndex = Math.max(
    0,
    filters.findIndex((f) => f.id === activeId),
  );
  const nodeCount = filters.length;
  const litRatio = nodeCount <= 1 ? 1 : activeIndex / Math.max(nodeCount - 1, 1);
  const needleDeg = litRatio * 250;
  const atlasEase = { type: 'spring' as const, stiffness: 95, damping: 20, mass: 0.7 };

  const bodyRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [railHeight, setRailHeight] = useState(0);

  // Lit rail must end exactly at the active node center (not an index ratio guess).
  useLayoutEffect(() => {
    const measure = () => {
      const body = bodyRef.current;
      const list = listRef.current;
      if (!body || !list) return;
      const item = list.children[activeIndex] as HTMLElement | undefined;
      if (!item) return;
      const bodyRect = body.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      const nodeCenterY = itemRect.top - bodyRect.top + itemRect.height / 2;
      // Rail starts at top-5 (1.25rem = 20px)
      const railTop = 20;
      setRailHeight(Math.max(nodeCenterY - railTop, 2));
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [activeIndex, filters.length]);

  // Smooth dial needle via spring on angle → SVG tip coordinates
  const needleSpring = useSpring(needleDeg, {
    stiffness: 110,
    damping: 18,
    mass: 0.65,
  });

  useEffect(() => {
    needleSpring.set(needleDeg);
  }, [needleDeg, needleSpring]);

  const needleX = useTransform(needleSpring, (deg) => {
    const r = 15.5;
    return 24 + r * Math.sin((deg * Math.PI) / 180);
  });
  const needleY = useTransform(needleSpring, (deg) => {
    const r = 15.5;
    return 24 - r * Math.cos((deg * Math.PI) / 180);
  });
  const tipX = useTransform(needleSpring, (deg) => {
    const r = 14.2;
    return 24 + r * Math.sin((deg * Math.PI) / 180);
  });
  const tipY = useTransform(needleSpring, (deg) => {
    const r = 14.2;
    return 24 - r * Math.cos((deg * Math.PI) / 180);
  });

  return (
    <nav
      aria-label={language === 'fr' ? 'Atlas des compétences' : 'Skills atlas'}
      className="sticky top-28 relative isolate overflow-hidden rounded-md border border-border/70 bg-[linear-gradient(165deg,hsla(270,30%,98%,0.78)_0%,hsla(268,25%,96%,0.62)_48%,hsla(270,20%,94%,0.74)_100%)] shadow-[0_18px_50px_-28px_hsla(268,45%,18%,0.55),inset_0_1px_0_hsla(0,0%,100%,0.55)] backdrop-blur-xl dark:border-border/50 dark:bg-[linear-gradient(165deg,hsla(270,22%,10%,0.86)_0%,hsla(270,24%,8%,0.78)_50%,hsla(268,28%,7%,0.88)_100%)] dark:shadow-[0_18px_50px_-28px_hsla(268,60%,4%,0.85),inset_0_1px_0_hsla(268,40%,70%,0.08)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-inset ring-white/35 dark:ring-primary/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-primary/55 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-6 left-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent"
      />

      {/* Micro-grid + star dust */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.4] dark:opacity-[0.25]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 18% 22%, hsla(268,55%,55%,0.2) 0 1px, transparent 1.5px),
            radial-gradient(circle at 72% 38%, hsla(268,55%,60%,0.16) 0 1px, transparent 1.5px),
            radial-gradient(circle at 40% 70%, hsla(268,50%,50%,0.14) 0 1px, transparent 1.5px),
            linear-gradient(to right, hsla(268,40%,45%,0.06) 1px, transparent 1px),
            linear-gradient(to bottom, hsla(268,40%,45%,0.06) 1px, transparent 1px)
          `,
          backgroundSize: 'auto, auto, auto, 13px 13px, 13px 13px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 25% 35%, black 10%, transparent 72%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-14 top-10 h-44 w-44 rounded-full bg-primary/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 bottom-0 h-36 w-36 rounded-full bg-primary/10 blur-3xl"
      />

      {/* Header */}
      <header className="absolute right-1 top-1 z-50 rounded-md border-b border-border/40 px-1 pb-.75 pt-1 bg-[linear-gradient(165deg,hsla(270,30%,98%,0.78)_0%,hsla(268,25%,96%,0.62)_48%,hsla(270,20%,94%,0.74)_100%)] shadow-[0_18px_50px_-28px_hsla(268,45%,18%,0.55),inset_0_1px_0_hsla(0,0%,100%,0.55)] backdrop-blur-xl dark:border-border/50 dark:bg-[linear-gradient(165deg,hsla(270,22%,10%,0.86)_0%,hsla(270,24%,8%,0.78)_50%,hsla(268,28%,7%,0.88)_100%)] dark:shadow-[0_18px_50px_-28px_hsla(268,60%,4%,0.85),inset_0_1px_0_hsla(268,40%,70%,0.08)]">
        <div className="flex items-start justify-between gap-3">
          <div className="relative h-12 w-12 shrink-0">
            <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
              <defs>
                <linearGradient id={`atlas-dial-${uid}`} x1="6" y1="4" x2="42" y2="44">
                  <stop stopColor="hsl(268 55% 64%)" stopOpacity="0.95" />
                  <stop offset="1" stopColor="hsl(268 58% 34%)" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="hsla(268,40%,50%,0.06)"
                stroke={`url(#atlas-dial-${uid})`}
                strokeWidth="1"
                strokeDasharray="3 3.5"
              />
              <circle
                cx="24"
                cy="24"
                r="13.5"
                fill="none"
                stroke="hsl(268 50% 50%)"
                strokeWidth="0.7"
                opacity="0.35"
              />
              <circle cx="24" cy="24" r="3.4" fill="hsl(268 58% 42%)" />
              <circle cx="24" cy="24" r="1.25" fill="white" opacity="0.9" />
              {Array.from({ length: 12 }).map((_, i) => {
                const deg = i * 30;
                const rad = (deg * Math.PI) / 180;
                const major = i % 3 === 0;
                const r1 = major ? 16.2 : 17;
                const r2 = 19.2;
                return (
                  <line
                    key={deg}
                    x1={24 + Math.cos(rad) * r1}
                    y1={24 + Math.sin(rad) * r1}
                    x2={24 + Math.cos(rad) * r2}
                    y2={24 + Math.sin(rad) * r2}
                    stroke="hsl(268 42% 52%)"
                    strokeWidth={major ? 1 : 0.65}
                    opacity={major ? 0.7 : 0.35}
                  />
                );
              })}
              {/* Needle: spring-driven tip coords (reliable in SVG) */}
              <motion.line
                x1={24}
                y1={24}
                x2={needleX}
                y2={needleY}
                stroke="hsl(268 58% 48%)"
                strokeWidth="1.35"
                strokeLinecap="round"
              />
              <motion.circle cx={tipX} cy={tipY} r="1.15" fill="hsl(268 55% 62%)" />
            </svg>
          </div>
        </div>
      </header>

      {/* Body: meridian + nodes - single shared vertical axis */}
      <div ref={bodyRef} className="relative px-2.5 py-2.5">
        {/* Full dashed guide (inactive path) */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-5 left-4 top-5 z-[1] w-px -translate-x-1/2 opacity-35"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to bottom, transparent 0 3px, hsla(268,40%,70%,0.45) 3px 5px)',
          }}
        />
        {/* Lit solid rail - height measured to active node center */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-4 top-5 z-[1] w-px -translate-x-1/2 rounded-full bg-gradient-to-b from-primary/55 via-primary to-primary"
          style={{
            boxShadow: '0 0 10px hsla(268,58%,45%,0.45)',
          }}
          initial={false}
          animate={{ height: Math.max(railHeight, 2) }}
          transition={atlasEase}
        />

        <ul ref={listRef} className="relative z-10 flex flex-col gap-1">
          {filters.map((filter, index) => {
            const isActive = filter.id === activeId;
            const passed = index <= activeIndex;

            return (
              <li key={filter.id} className="relative">
                {/* Meridian node - same axis as rail */}
                <span
                  aria-hidden
                  className={cn(
                    'absolute left-4 top-1/2 z-20 flex h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-[background-color,box-shadow] duration-300',
                    isActive
                      ? 'bg-primary shadow-[0_0_0_3px_hsla(268,58%,45%,0.22),0_0_12px_hsla(268,58%,45%,0.5)]'
                      : passed
                        ? 'bg-primary/55'
                        : 'bg-muted-foreground/25',
                  )}
                >
                  {isActive && <span className="block h-1 w-1 shrink-0 rounded-full bg-white" />}
                </span>
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute left-4 top-1/2 z-[15] h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/35"
                  />
                )}

                <button
                  type="button"
                  onClick={() => onSelect(filter.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'group relative ml-7 flex w-[calc(100%-1.75rem)] cursor-pointer items-center gap-2 overflow-hidden rounded-sm px-2.5 py-2 text-left',
                    'outline-none focus-visible:ring-2 focus-visible:ring-primary/35',
                    isActive
                      ? 'bg-gradient-to-r from-primary/22 via-primary/[0.11] to-transparent text-foreground shadow-[inset_0_0_0_1px_hsla(268,50%,50%,0.2)]'
                      : 'text-muted-foreground hover:bg-secondary/40 hover:text-foreground',
                  )}
                >
                  <span className="relative flex h-[22px] w-[22px] shrink-0 items-center justify-center">
                    <DomainIcon3D id={filter.id} active={isActive} />
                  </span>

                  <span
                    className={cn(
                      'min-w-0 flex-1 truncate text-[12px] capitalize leading-none',
                      isActive ? 'font-semibold tracking-tight' : 'font-medium',
                    )}
                  >
                    {filter.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
