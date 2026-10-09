import React, { forwardRef, useRef } from 'react';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
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
          'z-10 flex size-9 items-center justify-center rounded-full border p-2 backdrop-blur-md',
          'border-border/70 bg-background/80 text-foreground shadow-sm',
          'transition-all duration-500 ease-out',
          'group-hover:border-primary/30 group-hover:bg-primary/5',
          className,
        )}
      >
        {children}
      </div>
    );
  },
);
Circle.displayName = 'Circle';

export const WaContact = () => {
  const { language } = useLanguageStore();
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

  return (
    <Link
      to={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex w-full flex-col items-center justify-center overflow-hidden rounded-sm border border-border/60 bg-card/50 p-3 shadow-sm backdrop-blur-sm transition-all duration-500 hover:border-primary/30 hover:bg-card/70 hover:shadow-[0_0_40px_-12px_hsla(268,52%,38%,0.2)]"
    >
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div
        ref={containerRef}
        className="relative z-10 mx-auto flex h-[120px] w-full max-w-4xl items-center justify-between px-4 md:px-12"
      >
        <div className="flex h-full flex-col items-center justify-between py-1">
          <Circle ref={div1Ref}>
            <FaUserAstronaut className="text-xs text-muted-foreground transition-colors duration-500 group-hover:text-foreground" />
          </Circle>
          <Circle ref={div2Ref}>
            <FaPhoneAlt className="text-xs text-muted-foreground transition-colors duration-500 group-hover:text-foreground" />
          </Circle>
          <Circle ref={div3Ref}>
            <FaGlobeAmericas className="text-xs text-muted-foreground transition-colors duration-500 group-hover:text-foreground" />
          </Circle>
        </div>

        <div className="relative z-20 flex flex-col items-center justify-center">
          <Circle
            ref={centerRef}
            className="size-16 border-green-500/30 bg-green-500/10 shadow-[0_0_24px_-6px_rgba(34,197,94,0.35)] transition-all duration-500 group-hover:scale-105 group-hover:bg-green-500/20 group-hover:shadow-[0_0_36px_-6px_rgba(34,197,94,0.4)]"
          >
            <FaWhatsapp className="text-4xl text-green-600 drop-shadow-sm transition-transform duration-500 group-hover:scale-105 dark:text-green-500" />
          </Circle>
        </div>

        <div className="flex h-full flex-col items-center justify-between py-1">
          <Circle ref={div4Ref}>
            <FaRegCommentDots className="text-xs text-muted-foreground transition-colors duration-500 group-hover:text-foreground" />
          </Circle>
          <Circle ref={div5Ref}>
            <FaMobileAlt className="text-xs text-muted-foreground transition-colors duration-500 group-hover:text-foreground" />
          </Circle>
          <Circle ref={div6Ref}>
            <FaPaperPlane className="text-xs text-muted-foreground transition-colors duration-500 group-hover:text-foreground" />
          </Circle>
        </div>

        <AnimatedBeam
          containerRef={containerRef}
          fromRef={div1Ref}
          toRef={centerRef}
          className="z-0"
          curvature={-30}
          endYOffset={-8}
          duration={2.5}
          delay={0}
          repeatDelay={1}
          pathColor="hsla(268,20%,50%,0.12)"
          gradientStartColor="hsla(268,55%,45%,0)"
          gradientStopColor="hsl(268 55% 45%)"
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={div2Ref}
          toRef={centerRef}
          className="z-0"
          curvature={0}
          duration={2}
          delay={0.5}
          repeatDelay={0.5}
          pathColor="hsla(268,20%,50%,0.12)"
          gradientStartColor="hsla(268,55%,45%,0)"
          gradientStopColor="hsl(268 55% 45%)"
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={div3Ref}
          toRef={centerRef}
          className="z-0"
          curvature={30}
          endYOffset={8}
          duration={2.5}
          delay={1}
          repeatDelay={1}
          pathColor="hsla(268,20%,50%,0.12)"
          gradientStartColor="hsla(268,55%,45%,0)"
          gradientStopColor="hsl(268 55% 45%)"
        />

        <AnimatedBeam
          containerRef={containerRef}
          fromRef={div4Ref}
          toRef={centerRef}
          className="z-0"
          curvature={-30}
          endYOffset={-8}
          reverse
          duration={2.2}
          delay={0.2}
          repeatDelay={0.8}
          pathColor="hsla(268,20%,50%,0.12)"
          gradientStartColor="hsla(268,55%,45%,0)"
          gradientStopColor="hsl(268 55% 45%)"
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={div5Ref}
          toRef={centerRef}
          className="z-0"
          curvature={0}
          reverse
          duration={2.5}
          delay={0.8}
          repeatDelay={0.4}
          pathColor="hsla(268,20%,50%,0.12)"
          gradientStartColor="hsla(268,55%,45%,0)"
          gradientStopColor="hsl(268 55% 45%)"
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={div6Ref}
          toRef={centerRef}
          className="z-0"
          curvature={30}
          endYOffset={8}
          reverse
          duration={2}
          delay={1.2}
          repeatDelay={0.8}
          pathColor="hsla(268,20%,50%,0.12)"
          gradientStartColor="hsla(268,55%,45%,0)"
          gradientStopColor="hsl(268 55% 45%)"
        />
      </div>

      <div className="z-20 -mt-4 text-center">
        <h3 className="text-lg font-bold tracking-tight text-foreground md:text-xl">
          {language === 'fr' ? 'Contactez-moi sur WhatsApp' : 'Contact me on WhatsApp'}
        </h3>
      </div>

      <div className="pointer-events-none absolute -right-8 -bottom-8 z-0 size-40 rounded-full bg-primary/8 blur-[60px] transition-colors duration-500 group-hover:bg-primary/12" />
    </Link>
  );
};
