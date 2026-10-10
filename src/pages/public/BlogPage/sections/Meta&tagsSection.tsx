import type { IBlog } from '@/entities/blogs';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import React from 'react';

export const MetaTagsSection: React.FC<{ post: IBlog }> = ({ post }) => {
  const { language } = useLanguageStore();

  const formattedDate = new Date(post.date).toLocaleDateString(
    language === 'fr' ? 'fr-FR' : 'en-US',
    { day: 'numeric', month: 'long', year: 'numeric' },
  );

  return (
    <header className="space-y-3 md:space-y-4">
      <div className="flex flex-wrap items-center justify-end gap-x-2.5 gap-y-1 text-[11px] leading-none text-foreground/65 sm:text-xs">
        <time dateTime={post.date}>{formattedDate}</time>
        <span className="text-border" aria-hidden>
          ·
        </span>
        <span>{post.readTime}</span>
      </div>

      <h1 className="text-[1.35rem] font-bold leading-snug tracking-tight text-foreground sm:text-2xl md:text-3xl md:leading-tight">
        {language === 'fr' ? post.titleFr : post.titleEn}
      </h1>
    </header>
  );
};
