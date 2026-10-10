import React, { type ComponentPropsWithoutRef, type CSSProperties } from 'react';
import { cn } from '@/shared/lib/utils';

interface RippleProps extends ComponentPropsWithoutRef<'div'> {
  mainCircleSize?: number;
  mainCircleOpacity?: number;
  numCircles?: number;
}

/**
 * Soft concentric brand ripples for Contact hero.
 */
export const Ripple = React.memo(function Ripple({
  mainCircleSize = 220,
  mainCircleOpacity = 0.28,
  numCircles = 8,
  className,
  ...props
}: RippleProps) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 z-0 select-none overflow-hidden',
        '[mask-image:linear-gradient(to_bottom,white_20%,white_55%,transparent_100%)]',
        '[-webkit-mask-image:linear-gradient(to_bottom,white_20%,white_55%,transparent_100%)]',
        className,
      )}
      aria-hidden
      {...props}
    >
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * 72;
        const opacity = Math.max(0.05, mainCircleOpacity - i * 0.028);
        const animationDelay = `${i * 0.1}s`;

        return (
          <div
            key={i}
            className={cn(
              'absolute rounded-full border',
              'border-brand/35 bg-brand/[0.06]',
              'dark:border-primary/35 dark:bg-primary/[0.07]',
              'animate-[ripple_2.8s_ease-out_infinite]',
            )}
            style={
              {
                '--i': i,
                width: `${size}px`,
                height: `${size}px`,
                opacity,
                animationDelay,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) scale(1)',
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
});

Ripple.displayName = 'Ripple';
