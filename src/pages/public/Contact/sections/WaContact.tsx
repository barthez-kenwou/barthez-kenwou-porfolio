import React, { forwardRef, useRef } from 'react';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { useThemeStore } from '@/shared/state/useThemeStore';
import { Link } from 'react-router-dom';
import { AnimatedBeam } from '@/shared/animated-beam';
import {
  FaWhatsapp,
  FaUserAstronaut,
  FaRegCommentDots,
  FaPhoneAlt,
  FaGlobeAmericas,
  FaPaperPlane,
  FaMobileAlt,
} from 'react-icons/fa';
import { cn } from '@/lib/utils';
import { usePublicContactInfo } from '@/entities/contact/hooks/useContact';

const Circle = forwardRef<HTMLDivElement, { className?: string; children?: React.ReactNode }>(
  ({ className, children }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative z-10 flex size-10 items-center justify-center rounded-full border p-2',
          'border-border bg-card text-foreground',
          'transition-[border-color,background-color,color] duration-300 ease-out',
          'group-hover:border-emerald-600/50 group-hover:text-emerald-700',
          'dark:group-hover:border-emerald-400/50 dark:group-hover:text-emerald-300',
          className,
        )}
      >
        {children}
      </div>
    );
  },
);
Circle.displayName = 'Circle';

type BeamSpec = {
  from: React.RefObject<HTMLDivElement | null>;
  curvature: number;
  endYOffset?: number;
  reverse?: boolean;
  duration: number;
  delay: number;
  repeatDelay: number;
};

export const WaContact = () => {
  const { language } = useLanguageStore();
  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === 'dark';
  const { data } = usePublicContactInfo();
  const whatsappLink = data?.data.whatsappLink ?? 'https://wa.me/237655646688';

  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);

  const beamTone = isDark
    ? {
        pathColor: 'hsla(152,40%,45%,0.35)',
        pathOpacity: 0.5,
        pathWidth: 2,
        gradientStartColor: 'hsla(152,65%,48%,0)',
        gradientStopColor: 'hsl(152 70% 52%)',
      }
    : {
        pathColor: 'hsla(152,35%,32%,0.4)',
        pathOpacity: 0.65,
        pathWidth: 2,
        gradientStartColor: 'hsla(152,50%,32%,0)',
        gradientStopColor: 'hsl(152 50% 32%)',
      };

  const beams: BeamSpec[] = [
    { from: div1Ref, curvature: -30, endYOffset: -8, duration: 2.5, delay: 0, repeatDelay: 1 },
    { from: div2Ref, curvature: 0, duration: 2, delay: 0.5, repeatDelay: 0.5 },
    { from: div3Ref, curvature: 30, endYOffset: 8, duration: 2.5, delay: 1, repeatDelay: 1 },
    {
      from: div4Ref,
      curvature: -30,
      endYOffset: -8,
      reverse: true,
      duration: 2.2,
      delay: 0.2,
      repeatDelay: 0.8,
    },
    {
      from: div5Ref,
      curvature: 0,
      reverse: true,
      duration: 2.5,
      delay: 0.8,
      repeatDelay: 0.4,
    },
    {
      from: div6Ref,
      curvature: 30,
      endYOffset: 8,
      reverse: true,
      duration: 2,
      delay: 1.2,
      repeatDelay: 0.8,
    },
  ];

  return (
    <Link
      to={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group relative flex w-full flex-col items-center justify-center overflow-hidden rounded-sm border border-border bg-card p-5 md:p-8',
        'transition-colors duration-300 hover:border-emerald-600/40 dark:hover:border-emerald-400/40',
      )}
    >
      <div
        ref={containerRef}
        className="relative z-10 mx-auto flex h-[150px] w-full max-w-4xl items-center justify-between px-4 md:h-[170px] md:px-12"
      >
        {beams.map((beam, i) => (
          <AnimatedBeam
            key={i}
            containerRef={containerRef}
            fromRef={beam.from}
            toRef={centerRef}
            className="z-0"
            curvature={beam.curvature}
            endYOffset={beam.endYOffset}
            reverse={beam.reverse}
            duration={beam.duration}
            delay={beam.delay}
            repeatDelay={beam.repeatDelay}
            {...beamTone}
          />
        ))}

        <div className="relative z-10 flex h-full flex-col items-center justify-between py-1">
          <Circle ref={div1Ref}>
            <FaUserAstronaut className="text-[13px]" />
          </Circle>
          <Circle ref={div2Ref}>
            <FaPhoneAlt className="text-[12px]" />
          </Circle>
          <Circle ref={div3Ref}>
            <FaGlobeAmericas className="text-[13px]" />
          </Circle>
        </div>

        <div className="relative z-20 flex flex-col items-center justify-center">
          <Circle
            ref={centerRef}
            className={cn(
              // Opaque bg so beams stay behind the logo (not visible through it)
              'size-[4.25rem] border-emerald-600/50 bg-card text-emerald-700',
              'group-hover:border-emerald-600',
              'dark:border-emerald-400/50 dark:bg-card dark:text-emerald-300',
              'dark:group-hover:border-emerald-300',
            )}
          >
            <FaWhatsapp className="relative z-10 text-[2.35rem]" />
          </Circle>
        </div>

        <div className="relative z-10 flex h-full flex-col items-center justify-between py-1">
          <Circle ref={div4Ref}>
            <FaRegCommentDots className="text-[13px]" />
          </Circle>
          <Circle ref={div5Ref}>
            <FaMobileAlt className="text-[13px]" />
          </Circle>
          <Circle ref={div6Ref}>
            <FaPaperPlane className="text-[12px]" />
          </Circle>
        </div>
      </div>

      <div className="relative z-20 mt-3 space-y-1 text-center md:mt-5">
        <p className="text-[10px] font-semibold tracking-[0.22em] text-emerald-700 uppercase dark:text-emerald-300">
          {language === 'fr' ? 'Réponse rapide' : 'Fast reply'}
        </p>
        <h3 className="text-lg font-bold tracking-tight text-foreground md:text-xl">
          {language === 'fr' ? 'Contactez-moi sur WhatsApp' : 'Contact me on WhatsApp'}
        </h3>
      </div>
    </Link>
  );
};
