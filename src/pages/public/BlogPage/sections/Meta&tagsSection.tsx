import type { IBlog } from '@/entities/blogs';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { HiOutlineCalendar, HiOutlineClock, HiOutlineUser } from 'react-icons/hi2';
import React from 'react';

export const MetaTagsSection: React.FC<{ post: IBlog }> = ({ post }) => {
  const { language } = useLanguageStore();

  const formattedDate = new Date(post.date).toLocaleDateString(
    language === 'fr' ? 'fr-FR' : 'en-US',
    { day: 'numeric', month: 'long', year: 'numeric' },
  );

  return (
    <header className="space-y-3 md:space-y-4">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-foreground/75">
        <div className="flex items-center gap-1.5">
          <HiOutlineUser className="size-3.5 shrink-0 text-primary" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em]">
            {post.author}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <HiOutlineCalendar className="size-3.5 shrink-0 text-primary" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em]">
            {formattedDate}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <HiOutlineClock className="size-3.5 shrink-0 text-primary" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em]">
            {post.readTime}
          </span>
        </div>
      </div>

      <h1 className="text-[1.35rem] font-bold leading-snug tracking-tight text-foreground sm:text-2xl md:text-3xl md:leading-tight">
        {language === 'fr' ? post.titleFr : post.titleEn}
      </h1>

      <div className="flex flex-wrap gap-1.5">
        {post.tags.slice(0, 6).map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-border bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-foreground/80"
          >
            {tag}
          </span>
        ))}
      </div>
    </header>
  );
};
