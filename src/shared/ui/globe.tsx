'use client';

import { useEffect, useRef, useCallback, useMemo } from 'react';
import createGlobe, { type COBEOptions } from 'cobe';
import { useSpring } from 'motion/react';

import { cn } from '@/lib/utils';
import { useThemeStore } from '@/shared/state/useThemeStore';

const MOVEMENT_DAMPING = 1400;

// Shared marker/arc data (position + size is theme-independent)
const MARKERS_DATA = [
  { location: [49.6116, 6.13] as [number, number], size: 0.15 }, // Luxembourg
  { location: [4.0511, 9.7679] as [number, number], size: 0.13 }, // Cameroun – Douala
  { location: [48.8566, 2.3522] as [number, number], size: 0.1 }, // France – Paris
  { location: [40.7128, -74.006] as [number, number], size: 0.09 }, // USA – New York
  { location: [51.5072, -0.1276] as [number, number], size: 0.08 }, // UK – London
  { location: [35.6764, 139.65] as [number, number], size: 0.07 }, // Japon – Tokyo
  { location: [52.52, 13.405] as [number, number], size: 0.08 }, // Allemagne – Berlin
  { location: [37.7749, -122.4194] as [number, number], size: 0.07 }, // USA – San Francisco
];

const LUX: [number, number] = [49.6116, 6.13];
const DLA: [number, number] = [4.0511, 9.7679];

const ARCS_DATA = [
  { from: LUX, to: DLA },
  { from: LUX, to: [48.8566, 2.3522] as [number, number] },
  { from: LUX, to: [40.7128, -74.006] as [number, number] },
  { from: LUX, to: [51.5072, -0.1276] as [number, number] },
  { from: LUX, to: [35.6764, 139.65] as [number, number] },
  { from: LUX, to: [52.52, 13.405] as [number, number] },
  { from: DLA, to: [48.8566, 2.3522] as [number, number] },
];

// ─── Dark mode config ────────────────────────────────────────────────
const DARK_CONFIG: Omit<COBEOptions, 'width' | 'height'> = {
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.15,
  dark: 1,
  diffuse: 1.2,
  mapSamples: 40000,
  mapBrightness: 6,
  baseColor: [0.06, 0.05, 0.09],
  markerColor: [0.42, 0.28, 0.75],
  glowColor: [0.18, 0.1, 0.32],
  scale: 1.05,
  offset: [0, 0],
  markerElevation: 0.03,
  arcColor: [0.42, 0.28, 0.75],
  arcWidth: 2,
  arcHeight: 0.5,
  arcs: ARCS_DATA.map((a) => ({
    ...a,
    color: [0.42, 0.28, 0.75] as [number, number, number],
  })),
  markers: MARKERS_DATA.map((m, i) => ({
    ...m,
    color:
      i < 2
        ? ([0.42, 0.28, 0.75] as [number, number, number])
        : i % 2 === 0
          ? ([0.3, 0.18, 0.55] as [number, number, number])
          : ([0.72, 0.72, 0.78] as [number, number, number]),
  })),
};

// ─── Light mode config ───────────────────────────────────────────────
// Light mode: bright globe with subtle purple accents on a white surface
const LIGHT_CONFIG: Omit<COBEOptions, 'width' | 'height'> = {
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.15,
  dark: 0,
  diffuse: 2,
  mapSamples: 40000,
  mapBrightness: 1.5,
  baseColor: [0.97, 0.96, 0.99],
  markerColor: [0.35, 0.2, 0.62],
  glowColor: [0.9, 0.88, 0.96],
  scale: 1.05,
  offset: [0, 0],
  markerElevation: 0.03,
  arcColor: [0.35, 0.2, 0.62],
  arcWidth: 2,
  arcHeight: 0.5,
  arcs: ARCS_DATA.map((a) => ({
    ...a,
    color: [0.35, 0.2, 0.62] as [number, number, number],
  })),
  markers: MARKERS_DATA.map((m, i) => ({
    ...m,
    color:
      i < 2
        ? ([0.35, 0.2, 0.62] as [number, number, number])
        : i % 2 === 0
          ? ([0.48, 0.32, 0.72] as [number, number, number])
          : ([0.55, 0.52, 0.62] as [number, number, number]),
  })),
};

export function Globe({ className }: { className?: string }) {
  const theme = useThemeStore((s) => s.theme);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const phiRef = useRef(0);
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null);
  const animationRef = useRef<number>(0);

  const springValue = useSpring(0, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  });

  const config = useMemo(() => (theme === 'dark' ? DARK_CONFIG : LIGHT_CONFIG), [theme]);

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? 'grabbing' : 'grab';
    }
  };

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      springValue.set(springValue.get() + delta / MOVEMENT_DAMPING);
    }
  };

  const animate = useCallback(() => {
    if (!globeRef.current) return;

    if (!pointerInteracting.current) {
      phiRef.current += 0.02;
    }

    globeRef.current.update({
      phi: phiRef.current + springValue.get(),
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [springValue]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const width = canvas.offsetWidth;

    // Destroy previous globe if it exists (theme change)
    if (globeRef.current) {
      cancelAnimationFrame(animationRef.current);
      globeRef.current.destroy();
      globeRef.current = null;
    }

    globeRef.current = createGlobe(canvas, {
      ...config,
      width: width * 2,
      height: width * 2,
    });

    // Start animation loop
    animationRef.current = requestAnimationFrame(animate);

    // Fade in
    setTimeout(() => {
      canvas.style.opacity = '1';
    }, 0);

    const onResize = () => {
      if (!canvasRef.current || !globeRef.current) return;
      const w = canvasRef.current.offsetWidth;
      globeRef.current.update({
        width: w * 2,
        height: w * 2,
      });
    };

    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animationRef.current);
      globeRef.current?.destroy();
      globeRef.current = null;
      window.removeEventListener('resize', onResize);
    };
  }, [config, animate]);

  return (
    <div className={cn('absolute inset-0 mx-auto aspect-square w-full', className)}>
      <canvas
        className={cn(
          'size-full opacity-0 transition-opacity duration-500 contain-[layout_paint_size]',
        )}
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX;
          updatePointerInteraction(e.clientX);
        }}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) => e.touches[0] && updateMovement(e.touches[0].clientX)}
      />
    </div>
  );
}
