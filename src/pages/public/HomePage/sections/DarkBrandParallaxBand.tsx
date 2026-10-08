import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { cn } from '@/shared/lib';

type DarkBrandParallaxBandProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Dark-mode only: brand nebula as a slow parallax wash
 * behind Testimonials. Hidden in light mode.
 */
export function DarkBrandParallaxBand({ children, className }: DarkBrandParallaxBandProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);

  return (
    <div ref={ref} className={cn('relative isolate', className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden dark:block"
      >
        <motion.div style={{ y }} className="absolute inset-x-0 -top-[18%] h-[136%] w-full">
          <img
            src="/images/brand-nebula.webp"
            alt=""
            decoding="async"
            className={cn(
              'h-full w-full object-cover object-center',
              'opacity-[0.1]',
              'mix-blend-screen',
              '[mask-image:linear-gradient(to_bottom,transparent_0%,black_12%,black_82%,transparent_100%)]',
              '[-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_12%,black_82%,transparent_100%)]',
            )}
          />
        </motion.div>
        <div className="absolute inset-0 bg-background/55" />
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}
