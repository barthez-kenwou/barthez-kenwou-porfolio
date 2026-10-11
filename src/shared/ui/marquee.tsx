import { ComponentPropsWithoutRef, useCallback, useState } from 'react';

import { cn } from '@/shared/lib/utils';

interface MarqueeProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Optional CSS class name to apply custom styles
   */
  className?: string;
  /**
   * Whether to reverse the animation direction
   * @default false
   */
  reverse?: boolean;
  /**
   * Pause on hover (desktop, CSS — zero latency) and on press/touch (mobile)
   * @default false
   */
  pauseOnHover?: boolean;
  /**
   * Content to be displayed in the marquee
   */
  children: React.ReactNode;
  /**
   * Whether to animate vertically instead of horizontally
   * @default false
   */
  vertical?: boolean;
  /**
   * Number of times to repeat the content
   * @default 4
   */
  repeat?: number;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  // Touch only — desktop pause is pure CSS (group-hover/marquee) for zero latency
  const [touchPaused, setTouchPaused] = useState(false);

  const onTouchStart = useCallback(() => {
    if (pauseOnHover) setTouchPaused(true);
  }, [pauseOnHover]);

  const onTouchEnd = useCallback(() => {
    if (pauseOnHover) setTouchPaused(false);
  }, [pauseOnHover]);

  return (
    <div
      {...props}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
      className={cn(
        // Named group so nested card `group-hover:` styles never cascade from the track
        'group/marquee flex overflow-hidden p-2 [gap:var(--gap)] [--duration:40s] [--gap:1rem]',
        {
          'flex-row': !vertical,
          'flex-col': vertical,
        },
        className,
      )}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn('flex shrink-0 justify-around [gap:var(--gap)]', {
              'animate-marquee flex-row': !vertical,
              'animate-marquee-vertical flex-col': vertical,
              'group-hover/marquee:[animation-play-state:paused]': pauseOnHover,
              '[animation-play-state:paused]': touchPaused,
              '[animation-direction:reverse]': reverse,
              'motion-reduce:animate-none': true,
            })}
          >
            {children}
          </div>
        ))}
    </div>
  );
}
