import type { IBlog } from '@/entities/blogs';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import React from 'react';

/** End-of-article tags for SEO / discovery — kept out of the hero. */
export const ArticleEndTags: React.FC<{ post: IBlog }> = ({ post }) => {
  const { language } = useLanguageStore();
  const tags = post.tags.filter(Boolean);
  if (tags.length === 0) return null;

  return (
    <footer
      className="border-t border-border/50 pt-5"
      aria-label={language === 'fr' ? 'Mots-clés' : 'Keywords'}
    >
      <ul className="flex flex-wrap gap-x-3 gap-y-1.5">
        {tags.map((tag) => {
          const label = tag.startsWith('#') ? tag : `#${tag.replace(/\s+/g, '')}`;
          return (
            <li key={tag}>
              <span className="text-[12px] text-foreground/70">{label}</span>
            </li>
          );
        })}
      </ul>
    </footer>
  );
};
