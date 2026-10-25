import React from 'react';
import { extractYoutubeId } from '@/shared/lib/videoEmbed';
import { cn } from '@/shared/lib/utils';

export function isBareYoutubeUrl(text: string): boolean {
  const t = text.trim();
  if (!t || /\s/.test(t)) return false;
  return Boolean(extractYoutubeId(t));
}

export function BlogYoutubeEmbed({ url, className }: { url: string; className?: string }) {
  const id = extractYoutubeId(url);
  if (!id) return null;

  return (
    <div
      className={cn(
        'my-6 overflow-hidden rounded-md border border-border/50 bg-black/40 shadow-sm',
        className,
      )}
    >
      <div className="relative aspect-video w-full">
        <iframe
          title="YouTube"
          src={`https://www.youtube-nocookie.com/embed/${id}`}
          className="absolute inset-0 size-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </div>
  );
}
