import React, { useEffect, useState } from 'react';
import { useThemeStore } from '@/shared/state/useThemeStore';
import { cn } from '@/shared/lib/utils';

/** Shared purple-wave ambient - full-bleed cover, loads before overlay UI. */
export const AMBIENT_FLARE_SRC = '/images/ambient-flare.webp';
export const AMBIENT_FLARE_FALLBACK = '/images/ambient-flare.png';

interface AmbientFlareBackdropProps {
  className?: string;
  /** Soft edge vignette into page background */
  vignette?: boolean;
  /** Fires once the image is ready to paint */
  onReady?: () => void;
  /** Slightly stronger presence (error / 404) */
  intensity?: 'soft' | 'strong';
}

export const AmbientFlareBackdrop: React.FC<AmbientFlareBackdropProps> = ({
  className,
  vignette = true,
  onReady,
  intensity = 'strong',
}) => {
  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === 'dark';
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Safety: never block UI forever if the asset stalls
    const t = window.setTimeout(() => {
      setReady(true);
      onReady?.();
    }, 1200);
    return () => window.clearTimeout(t);
  }, [onReady]);

  const markReady = () => {
    setReady(true);
    onReady?.();
  };

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 z-0 overflow-hidden', className)}
      aria-hidden
    >
      <img
        src={AMBIENT_FLARE_SRC}
        alt=""
        width={612}
        height={459}
        decoding="async"
        fetchpriority="high"
        loading="eager"
        onLoad={markReady}
        onError={(e) => {
          const img = e.currentTarget;
          if (img.src.endsWith('.webp')) {
            img.src = AMBIENT_FLARE_FALLBACK;
            return;
          }
          markReady();
        }}
        className={cn(
          'absolute inset-0 h-full w-full object-cover object-center select-none',
          'transition-opacity duration-500',
          ready ? '' : '!opacity-0',
          intensity === 'strong'
            ? 'opacity-[0.78] dark:opacity-[0.9]'
            : 'opacity-[0.5] dark:opacity-[0.65]',
        )}
        style={{
          mixBlendMode: isDark ? 'screen' : 'multiply',
          filter: isDark ? 'saturate(1.25) brightness(0.92)' : 'saturate(0.95) brightness(1.05)',
        }}
      />

      {vignette && (
        <>
          {/* Top + bottom fade - keep bottom very light so wave stays visible at edges */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/45 via-transparent to-background/45" />
        </>
      )}
    </div>
  );
};
