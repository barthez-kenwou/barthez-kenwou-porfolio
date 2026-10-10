import type { IBlog } from '@/entities/blogs';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import React from 'react';

/** Compact date · read time — sits opposite Back on one row. */
export const ArticleMeta: React.FC<{ post: IBlog }> = ({ post }) => {
  const { language } = useLanguageStore();

  const formattedDate = new Date(post.date).toLocaleDateString(
    language === 'fr' ? 'fr-FR' : 'en-US',
    { day: 'numeric', month: 'short', year: 'numeric' },
  );

  return (
    <div className="flex shrink-0 items-center gap-x-1.5 text-[11px] leading-none text-foreground/55 sm:text-xs">
      <time dateTime={post.date}>{formattedDate}</time>
      <span className="text-foreground/25" aria-hidden>
        ·
      </span>
      <span>{post.readTime}</span>
    </div>
  );
};

/** H1 only — meta lives on the Back row to avoid stacking secondary info. */
export const MetaTagsSection: React.FC<{ post: IBlog }> = ({ post }) => {
  const { language } = useLanguageStore();

  return (
    <h1 className="text-[1.45rem] font-bold leading-[1.2] tracking-tight text-foreground sm:text-[1.75rem] sm:leading-snug md:text-[2rem] md:leading-[1.2]">
      {language === 'fr' ? post.titleFr : post.titleEn}
    </h1>
  );
};
