import React from 'react';
import { cn } from '@/shared/lib/utils';

type MarkdownFigureProps = {
  src?: string;
  alt?: string;
  title?: string;
  className?: string;
};

/** True for status badges / shields that should stay inline in prose. */
export function isMarkdownInlineBadge(src?: string, alt?: string): boolean {
  if (!src) return false;
  const s = src.toLowerCase();
  if (s.includes('shields.io') || s.includes('/badge.') || s.includes('badge.svg')) {
    return true;
  }
  if (s.includes('github.com/') && s.includes('/badge')) return true;
  // Tiny decorative SVGs with short alt stay inline
  if (s.endsWith('.svg') && (alt?.trim().length ?? 0) > 0 && (alt?.trim().length ?? 0) <= 12) {
    return true;
  }
  return false;
}

/**
 * Article image: full-bleed within the content column, caption from alt,
 * airy margins, no card chrome clutter.
 */
export const MarkdownFigure: React.FC<MarkdownFigureProps> = ({
  src,
  alt = '',
  title,
  className,
}) => {
  if (!src) return null;

  if (isMarkdownInlineBadge(src, alt)) {
    return (
      <img
        src={src}
        alt={alt}
        title={title}
        className="my-0.5 inline-block h-5 w-auto align-middle"
        loading="lazy"
        decoding="async"
      />
    );
  }

  const caption = alt.trim() || title?.trim() || '';

  return (
    <figure
      data-md-figure="true"
      className={cn('not-prose my-7 w-full sm:my-8 md:my-10', className)}
    >
      <div className="overflow-hidden rounded-md border border-border/45 bg-muted/20">
        <img
          src={src}
          alt={alt || caption || 'Article image'}
          title={title}
          loading="lazy"
          decoding="async"
          className="mx-auto block h-auto max-h-[min(70vh,36rem)] w-full object-contain"
        />
      </div>
      {caption ? (
        <figcaption className="mx-auto mt-2.5 max-w-prose px-1 text-center text-[11px] leading-relaxed text-foreground/75 sm:mt-3 sm:text-xs">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
};
