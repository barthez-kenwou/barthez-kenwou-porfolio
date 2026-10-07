'use client';

import { useEffect, useMemo, useState } from 'react';

import { cn } from '@/lib/utils';

type Grid = {
  rows: number;
  cols: number;
};

const DEFAULT_GRIDS: Record<string, Grid> = {
  '6x4': { rows: 4, cols: 6 },
  '8x8': { rows: 8, cols: 8 },
  '8x3': { rows: 3, cols: 8 },
  '4x6': { rows: 6, cols: 4 },
  '3x8': { rows: 8, cols: 3 },
};

type PredefinedGridKey = keyof typeof DEFAULT_GRIDS;

interface PixelImageProps {
  src: string;
  grid?: PredefinedGridKey;
  customGrid?: Grid;
  grayscaleAnimation?: boolean;
  pixelFadeInDuration?: number; // in ms
  maxAnimationDelay?: number; // in ms
  colorRevealDelay?: number; // in ms
  className?: string;
}

export const PixelImage = ({
  src,
  grid = '6x4',
  grayscaleAnimation = true,
  pixelFadeInDuration = 1000,
  maxAnimationDelay = 1200,
  colorRevealDelay = 1300,
  customGrid,
  className,
}: PixelImageProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showColor, setShowColor] = useState(false);

  const MIN_GRID = 1;
  const MAX_GRID = 20;

  const { rows, cols } = useMemo(() => {
    const isValidGrid = (grid?: Grid) => {
      if (!grid) return false;
      const { rows, cols } = grid;
      return (
        Number.isInteger(rows) &&
        Number.isInteger(cols) &&
        rows >= MIN_GRID &&
        cols >= MIN_GRID &&
        rows <= MAX_GRID &&
        cols <= MAX_GRID
      );
    };

    return isValidGrid(customGrid) ? customGrid! : DEFAULT_GRIDS[grid];
  }, [customGrid, grid, MAX_GRID]);

  useEffect(() => {
    // Small delay to ensure the initial render is caught by common observers
    const timer = setTimeout(() => setIsVisible(true), 50);
    const colorTimeout = setTimeout(() => {
      setShowColor(true);
    }, colorRevealDelay);
    return () => {
      clearTimeout(timer);
      clearTimeout(colorTimeout);
    };
  }, [colorRevealDelay]);

  const pieces = useMemo(() => {
    const total = rows * cols;
    return Array.from({ length: total }, (_, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;

      // Calculate width and height percentage for each piece
      const w = 100 / cols;
      const h = 100 / rows;
      const left = col * w;
      const top = row * h;

      const delay = Math.random() * maxAnimationDelay;
      return {
        width: `${w}%`,
        height: `${h}%`,
        left: `${left}%`,
        top: `${top}%`,
        backgroundPosition: `${left}% ${top}%`,
        delay,
      };
    });
  }, [rows, cols, maxAnimationDelay]);

  return (
    <div
      className={cn('relative overflow-hidden select-none', className)}
      style={{
        // Maintain a default aspect ratio if not provided via className
        aspectRatio: className?.includes('aspect-') ? undefined : '1/1',
      }}
    >
      {/* Target Image Source (hidden, for preloading/accessibility) */}
      <img src={src} alt="" className="sr-only" aria-hidden="true" />

      {pieces.map((piece, index) => (
        <div
          key={index}
          className={cn(
            'absolute transition-all ease-out will-change-[transform,opacity,filter]',
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-110',
            grayscaleAnimation && (!showColor ? 'grayscale' : 'grayscale-0'),
          )}
          style={{
            width: piece.width,
            height: piece.height,
            left: piece.left,
            top: piece.top,
            backgroundImage: `url(${src})`,
            backgroundSize: `${cols * 100}% ${rows * 100}%`,
            backgroundPosition: `${(parseFloat(piece.left) / (100 - 100 / cols)) * 100}% ${(parseFloat(piece.top) / (100 - 100 / rows)) * 100}%`,
            transitionDelay: `${piece.delay}ms`,
            transitionDuration: `${pixelFadeInDuration}ms`,
            transitionProperty: 'opacity, transform, filter',
          }}
        />
      ))}
    </div>
  );
};
