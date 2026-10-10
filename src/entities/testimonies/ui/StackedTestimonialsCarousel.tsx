import * as React from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  type PanInfo,
  type MotionValue,
} from 'motion/react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { GridPattern } from '@/shared/ui/grid-pattern';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { useThemeStore } from '@/shared/state/useThemeStore';
import type { ITestimonial } from '../model/testimonial.types';

/** Soft accent squares — same idea as the home hero grid */
function cardGridSquares(seed: number): [number, number][] {
  const result: [number, number][] = [];
  for (let i = 0; i < 12; i += 1) {
    const a = (seed * 9301 + i * 49297) % 233280;
    const b = (seed * 233280 + i * 49297) % 9301;
    result.push([a % 8, b % 10]);
  }
  return result;
}

type CarouselConfig = {
  distanceDivisor: number;
  velocityDivisor: number;
  sensitivity: number;
  xMultiplier: number;
  /** Extra horizontal step past |offset| > 1 (level 2+) — keep < 1 to tuck the arc */
  xOuterFactor: number;
  yMultiplier: number;
  rotationMultiplier: number;
  scaleReduction: number;
};

/** Deeper circular fan + stronger edge shrink */
const getCarouselConfig = (width: number): CarouselConfig => {
  if (width < 640) {
    return {
      distanceDivisor: 110,
      velocityDivisor: 480,
      sensitivity: 170,
      xMultiplier: 130,
      xOuterFactor: 0.52,
      yMultiplier: 33,
      rotationMultiplier: 11,
      scaleReduction: 0.13,
    };
  }
  if (width < 1024) {
    return {
      distanceDivisor: 150,
      velocityDivisor: 620,
      sensitivity: 210,
      xMultiplier: 200,
      xOuterFactor: 0.55,
      yMultiplier: 50,
      rotationMultiplier: 14,
      scaleReduction: 0.15,
    };
  }
  return {
    distanceDivisor: 190,
    velocityDivisor: 760,
    sensitivity: 240,
    xMultiplier: 250,
    xOuterFactor: 0.56,
    yMultiplier: 66,
    rotationMultiplier: 16,
    scaleReduction: 0.17,
  };
};

/** Dark: deep brand violet. Light: soft lilac / pearl — same hue family, calmer. */
const CARD_SURFACES_DARK = [
  'linear-gradient(155deg, hsl(265 58% 39%) 0%, hsl(245 45% 22%) 100%)',
  'linear-gradient(155deg, hsl(252 42% 32%) 0%, hsl(265 50% 18%) 100%)',
  'linear-gradient(155deg, hsl(240 28% 22%) 0%, hsl(265 40% 14%) 100%)',
  'linear-gradient(155deg, hsl(265 48% 28%) 0%, hsl(245 40% 16%) 100%)',
  'linear-gradient(155deg, hsl(258 36% 26%) 0%, hsl(240 30% 12%) 100%)',
];

const CARD_SURFACES_LIGHT = [
  'linear-gradient(155deg, hsl(265 42% 94%) 0%, hsl(250 28% 88%) 100%)',
  'linear-gradient(155deg, hsl(258 36% 93%) 0%, hsl(245 22% 87%) 100%)',
  'linear-gradient(155deg, hsl(270 30% 95%) 0%, hsl(255 24% 89%) 100%)',
  'linear-gradient(155deg, hsl(262 38% 92%) 0%, hsl(248 26% 86%) 100%)',
  'linear-gradient(155deg, hsl(255 32% 94%) 0%, hsl(240 20% 88%) 100%)',
];

type StackedTestimonialsCarouselProps = {
  testimonials: ITestimonial[];
  className?: string;
};

export function StackedTestimonialsCarousel({
  testimonials,
  className,
}: StackedTestimonialsCarouselProps) {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';
  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === 'dark';
  const scrollProgress = useMotionValue(0);
  const startProgress = React.useRef(0);
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024,
  );
  const [activeIndex, setActiveIndex] = React.useState(0);

  const slides = React.useMemo(
    () => testimonials.slice(0, Math.max(testimonials.length, 1)),
    [testimonials],
  );
  const total = slides.length;
  const surfaces = isDark ? CARD_SURFACES_DARK : CARD_SURFACES_LIGHT;

  React.useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  React.useEffect(() => {
    const unsub = scrollProgress.on('change', (v) => {
      const idx = ((Math.round(v) % total) + total) % total;
      setActiveIndex((prev) => (prev === idx ? prev : idx));
    });
    return unsub;
  }, [scrollProgress, total]);

  const config = React.useMemo(() => getCarouselConfig(windowWidth), [windowWidth]);

  const snapTo = React.useCallback(
    (target: number) => {
      animate(scrollProgress, target, {
        type: 'spring',
        stiffness: 210,
        damping: 28,
        mass: 0.95,
      });
    },
    [scrollProgress],
  );

  const handleDragStart = () => {
    startProgress.current = scrollProgress.get();
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distanceShift = -info.offset.x / config.distanceDivisor;
    const velocityShift = -info.velocity.x / config.velocityDivisor;
    let totalShift = Math.round(distanceShift + velocityShift);
    totalShift = Math.max(-3, Math.min(3, totalShift));
    snapTo(Math.round(startProgress.current) + totalShift);
  };

  const go = (dir: -1 | 1) => {
    snapTo(Math.round(scrollProgress.get()) + dir);
  };

  if (total === 0) return null;

  const pageLabel = `${String(activeIndex + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;

  return (
    <div
      className={cn(
        'relative mx-auto flex w-full max-w-5xl flex-col items-center justify-center select-none',
        className,
      )}
    >
      {/* Stage stays visible — section-level overflow clips surplus, not this tight box */}
      <div className="relative mx-auto flex h-80 w-full items-center justify-center overflow-visible sm:h-104 lg:h-120">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragStart={handleDragStart}
          onDrag={(_, info) => {
            scrollProgress.set(scrollProgress.get() - info.delta.x / config.sensitivity);
          }}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 z-50 cursor-grab active:cursor-grabbing"
          aria-hidden
        />

        {slides.map((slide, i) => (
          <StackedCard
            key={slide.id}
            slide={slide}
            index={i}
            total={total}
            progress={scrollProgress}
            config={config}
            surface={surfaces[i % surfaces.length]}
            isFr={isFr}
            isDark={isDark}
          />
        ))}
      </div>

      <div className="mt-6 flex items-center gap-5 sm:gap-6">
        <CarouselNavButton
          direction="prev"
          label={isFr ? 'Témoignage précédent' : 'Previous testimonial'}
          onClick={() => go(-1)}
        />

        <div
          className="min-w-[3.75rem] text-center font-mono text-[11px] font-medium tracking-[0.18em] text-foreground/55 tabular-nums sm:text-xs"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="text-brand dark:text-primary">{String(activeIndex + 1).padStart(2, '0')}</span>
          <span className="mx-1.5 text-foreground/25">/</span>
          <span>{String(total).padStart(2, '0')}</span>
          <span className="sr-only">{pageLabel}</span>
        </div>

        <CarouselNavButton
          direction="next"
          label={isFr ? 'Témoignage suivant' : 'Next testimonial'}
          onClick={() => go(1)}
        />
      </div>
    </div>
  );
}

function CarouselNavButton({
  direction,
  label,
  onClick,
}: {
  direction: 'prev' | 'next';
  label: string;
  onClick: () => void;
}) {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="group relative inline-flex size-10 items-center justify-center text-foreground/45 transition-colors duration-300 hover:text-brand dark:hover:text-primary"
    >
      <svg
        aria-hidden
        viewBox="0 0 40 40"
        className="pointer-events-none absolute inset-0 size-full -rotate-90"
      >
        <circle
          cx="20"
          cy="20"
          r="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          pathLength={1}
          className="opacity-0 transition-[stroke-dashoffset,opacity] duration-500 ease-out [stroke-dasharray:1] [stroke-dashoffset:1] group-hover:opacity-100 group-hover:[stroke-dashoffset:0]"
        />
      </svg>
      <Icon className="relative size-5 stroke-[1.5]" />
    </button>
  );
}

type CardProps = {
  slide: ITestimonial;
  index: number;
  total: number;
  progress: MotionValue<number>;
  config: CarouselConfig;
  surface: string;
  isFr: boolean;
  isDark: boolean;
};

function StackedCard({
  slide,
  index,
  total,
  progress,
  config,
  surface,
  isFr,
  isDark,
}: CardProps) {
  const offset = useTransform(progress, (p) => {
    let diff = (index - p) % total;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  });

  // Level ±1 keeps full spacing; level ±2+ steps in so the arc stays tight
  const x = useTransform(offset, (o) => {
    const a = Math.abs(o);
    if (a < 0.001) return 0;
    const inner = Math.min(a, 1) * config.xMultiplier;
    const outer = Math.max(0, a - 1) * config.xMultiplier * config.xOuterFactor;
    return Math.sign(o) * (inner + outer);
  });
  // Stronger fan: rotate more + slight inward lean
  const rotate = useTransform(offset, (o) => {
    if (Math.abs(o) < 0.04) return 0;
    return o * config.rotationMultiplier;
  });
  // Circular / parabolic arc — drops harder toward the edges
  const y = useTransform(offset, (o) => {
    const a = Math.abs(o);
    if (a < 0.04) return 0;
    return a * a * config.yMultiplier + a * (config.yMultiplier * 0.35);
  });
  const scale = useTransform(offset, (o) => {
    const a = Math.abs(o);
    // Extra shrink past ±1.5 for a clearer stack depth
    const base = 1 - a * config.scaleReduction;
    const edge = a > 1.4 ? (a - 1.4) * 0.08 : 0;
    return Math.max(0.58, base - edge);
  });
  const opacity = useTransform(
    offset,
    [-total / 2, -total / 2 + 0.45, 0, total / 2 - 0.45, total / 2],
    [0, 1, 1, 1, 0],
  );
  const zIndex = useTransform(offset, (o) => Math.round(100 - Math.abs(o) * 12));
  // Progressive blur: sharp center → soft mid → heavy extremities
  const blur = useTransform(offset, (o) => {
    const a = Math.abs(o);
    if (a < 0.2) return 'blur(0px)';
    if (a < 0.85) return `blur(${(a * 2.4).toFixed(2)}px)`;
    if (a < 1.6) return `blur(${(2 + a * 2.1).toFixed(2)}px)`;
    return `blur(${Math.min(9.5, 3.2 + a * 2.4).toFixed(2)}px)`;
  });
  const dim = useTransform(
    offset,
    [-2.4, -0.35, 0, 0.35, 2.4],
    isDark ? [0.62, 0.2, 0, 0.2, 0.62] : [0.28, 0.1, 0, 0.1, 0.28],
  );

  const quote = isFr ? slide.textFr : slide.textEn;
  const name = isFr ? slide.nameFr : slide.nameEn;
  const role = isFr ? slide.roleFr : slide.roleEn;
  const squares = React.useMemo(() => cardGridSquares(index + 1), [index]);

  return (
    <motion.div
      style={{
        x,
        rotate,
        y,
        scale,
        opacity,
        zIndex,
        filter: blur,
      }}
      className={cn(
        'pointer-events-none absolute overflow-hidden rounded-md',
        'w-44 h-60 sm:w-56 sm:h-80 lg:w-64 lg:h-[22rem]',
        isDark
          ? 'border border-white/10 shadow-[0_24px_48px_-28px_rgba(0,0,0,0.55)]'
          : 'border border-brand/15 shadow-[0_18px_40px_-28px_hsla(265,40%,30%,0.35)]',
      )}
    >
      <div className="absolute inset-0" style={{ background: surface }} />
      <div
        aria-hidden
        className={cn('absolute inset-0', isDark ? 'opacity-40' : 'opacity-50')}
        style={{
          backgroundImage: isDark
            ? 'radial-gradient(circle at 20% 15%, hsl(0 0% 100% / 0.18), transparent 42%), radial-gradient(circle at 80% 80%, hsl(262 55% 76% / 0.15), transparent 45%)'
            : 'radial-gradient(circle at 18% 12%, hsl(0 0% 100% / 0.7), transparent 48%), radial-gradient(circle at 82% 78%, hsl(265 50% 55% / 0.12), transparent 50%)',
        }}
      />

      {/* Hero-style grid — fades toward bottom-right */}
      <GridPattern
        width={28}
        height={28}
        squares={squares}
        className={cn(
          'z-[1] blur-[0.4px]',
          isDark
            ? 'fill-white/25 stroke-white/20 opacity-45'
            : 'fill-brand/25 stroke-brand/20 opacity-40',
          '[mask-image:linear-gradient(to_bottom_right,white,transparent_60%,transparent)]',
        )}
      />

      <motion.div
        style={{ opacity: dim }}
        className={cn('absolute inset-0 z-[2]', isDark ? 'bg-black' : 'bg-[hsl(265_30%_40%)]')}
      />

      <div
        className={cn(
          'absolute inset-0 z-[2] bg-gradient-to-t',
          isDark
            ? 'from-black/85 via-black/25 to-transparent'
            : 'from-[hsl(265_25%_28%/0.55)] via-[hsl(265_20%_40%/0.08)] to-transparent',
        )}
      />

      <div className="absolute top-3 right-3 z-[3] flex gap-0.5 sm:top-4 sm:right-4">
        {Array.from({ length: Math.min(slide.rating || 5, 5) }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              'size-3 sm:size-3.5',
              isDark ? 'fill-white/90 text-white/90' : 'fill-brand/80 text-brand/80',
            )}
          />
        ))}
      </div>

      {/* Decorative opening quote */}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute top-8 left-3 z-[3] select-none font-display text-5xl leading-none sm:top-10 sm:left-4 sm:text-6xl lg:text-7xl',
          isDark ? 'text-white/30' : 'text-brand/25',
        )}
      >
        “
      </span>

      <div
        className={cn(
          'absolute inset-x-3 bottom-4 z-[3] sm:inset-x-5 sm:bottom-6 lg:inset-x-6 lg:bottom-8',
          isDark ? 'text-white' : 'text-foreground',
        )}
      >
        <p
          className={cn(
            'mb-3 line-clamp-4 text-[10px] leading-relaxed font-medium italic sm:mb-4 sm:line-clamp-10',
            isDark ? 'text-white/90' : 'text-foreground/85',
          )}
        >
          {quote}
        </p>
        <div>
          <p className="font-heading text-sm font-medium tracking-tight">{name}</p>
          <p
            className={cn(
              'mt-0.5 text-[10px]',
              isDark ? 'text-white/65' : 'text-foreground/60',
            )}
          >
            {role}
            {slide.company ? ` · ${slide.company}` : ''}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
