import { cn } from '@/shared/lib';
import React, { ReactNode } from 'react';

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
  /** Soft = ambient haze that doesn't fight hero visuals */
  intensity?: 'soft' | 'normal';
}

/** Theme-aware aurora - soft lilac pearl in light, deep violet haze in dark */
export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  intensity = 'normal',
  ...props
}: AuroraBackgroundProps) => {
  const isSoft = intensity === 'soft';

  return (
    <div
      className={cn(
        'relative flex flex-col min-h-screen w-full items-center justify-center bg-background text-foreground transition-bg',
        className,
      )}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={cn(
            `
          [--white-gradient:repeating-linear-gradient(100deg,#f7f5fb_0%,#f7f5fb_7%,transparent_10%,transparent_12%,#f7f5fb_16%)]
          [--dark-gradient:repeating-linear-gradient(100deg,#07050c_0%,#07050c_7%,transparent_10%,transparent_12%,#07050c_16%)]
          [--aurora-light:repeating-linear-gradient(100deg,#c4b0e8_10%,#a78bfa_15%,#ddd6fe_20%,#8b5cf6_25%,#c4b0e8_30%)]
          [--aurora-dark:repeating-linear-gradient(100deg,#2a1548_10%,#5b3a8c_15%,#1a0f2e_20%,#4b2a78_25%,#2a1548_30%)]
          [background-image:var(--white-gradient),var(--aurora-light)]
          dark:[background-image:var(--dark-gradient),var(--aurora-dark)]
          [background-size:300%,_200%]
          [background-position:50%_50%,50%_50%]
          filter blur-[14px] invert dark:invert-0
          after:content-[""] after:absolute after:inset-0
          after:[background-image:var(--white-gradient),var(--aurora-light)]
          after:dark:[background-image:var(--dark-gradient),var(--aurora-dark)]
          after:[background-size:200%,_100%]
          after:animate-aurora after:[background-attachment:fixed]
          after:mix-blend-difference dark:after:mix-blend-soft-light
          absolute -inset-[10px] will-change-transform`,
            isSoft ? 'opacity-[0.22] dark:opacity-[0.18]' : 'opacity-50 dark:opacity-40',
            showRadialGradient &&
              `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]`,
          )}
        ></div>
      </div>
      {children}
    </div>
  );
};
