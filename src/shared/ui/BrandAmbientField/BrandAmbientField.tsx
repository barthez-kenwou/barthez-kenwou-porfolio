import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/shared/lib';
import { useThemeStore } from '@/shared/state/useThemeStore';

type BrandAmbientFieldProps = {
  className?: string;
  /** Quieter treatment for dense pages */
  intensity?: 'soft' | 'calm';
};

/**
 * Soft branded CTA atmosphere — violet→indigo only, slow, low contrast.
 * Replaces the old loud GradientDots / AuroraRibbons stack.
 */
export function BrandAmbientField({
  className,
  intensity = 'calm',
}: BrandAmbientFieldProps) {
  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === 'dark';
  const reduceMotion = useReducedMotion();

  const opacityPeak = intensity === 'soft' ? 0.55 : 0.72;

  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      <div
        className={cn(
          'absolute inset-0',
          isDark ? 'bg-[hsl(0_0%_3%)]' : 'bg-[hsl(240_8%_97%)]',
        )}
      />

      {/* Dot grid — neutral, barely there */}
      <div
        className="absolute inset-0 opacity-[0.35] dark:opacity-[0.28]"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, ${
            isDark ? 'hsl(262 40% 70% / 0.22)' : 'hsl(265 40% 40% / 0.14)'
          } 0.9px, transparent 1.1px)`,
          backgroundSize: '14px 14px',
        }}
      />

      {/* Slow brand wash — two soft orbs, no cyan/magenta */}
      <motion.div
        className="absolute -left-[20%] top-[-30%] h-[90%] w-[70%] rounded-full blur-3xl"
        style={{
          background: isDark
            ? 'radial-gradient(circle, hsl(265 58% 39% / 0.28) 0%, transparent 68%)'
            : 'radial-gradient(circle, hsl(265 58% 39% / 0.12) 0%, transparent 68%)',
        }}
        animate={
          reduceMotion
            ? undefined
            : {
                x: [0, 24, 0],
                y: [0, 12, 0],
                opacity: [opacityPeak * 0.75, opacityPeak, opacityPeak * 0.75],
              }
        }
        transition={{ duration: 14, ease: 'easeInOut', repeat: Infinity }}
      />
      <motion.div
        className="absolute -right-[15%] bottom-[-35%] h-[85%] w-[65%] rounded-full blur-3xl"
        style={{
          background: isDark
            ? 'radial-gradient(circle, hsl(245 45% 28% / 0.35) 0%, transparent 70%)'
            : 'radial-gradient(circle, hsl(245 40% 40% / 0.1) 0%, transparent 70%)',
        }}
        animate={
          reduceMotion
            ? undefined
            : {
                x: [0, -18, 0],
                y: [0, -10, 0],
                opacity: [opacityPeak * 0.65, opacityPeak * 0.9, opacityPeak * 0.65],
              }
        }
        transition={{ duration: 18, ease: 'easeInOut', repeat: Infinity }}
      />
    </div>
  );
}
