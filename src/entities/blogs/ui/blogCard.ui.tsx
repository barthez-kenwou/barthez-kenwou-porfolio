import React from 'react';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { IBlog } from '../model/blog.type';
import { HiOutlineCalendar, HiOutlineClock } from 'react-icons/hi2';
import { Image } from '@/shared/ui/Image';
import { Link } from 'react-router-dom';
import { cn } from '@/shared/lib/utils';
import { getBlogPathSlug } from '@/shared/lib/entity-slug';

export const BlogCard: React.FC<{ Blog: IBlog; isFeatured?: boolean }> = ({ Blog, isFeatured }) => {
  const { language } = useLanguageStore();
  const fr = language === 'fr';

  const { titleFr, titleEn, excerptFr, excerptEn, image, category, date, readTime, tags } = Blog;
  const blogHref = `/blog/${getBlogPathSlug(Blog)}`;
  const title = fr ? titleFr : titleEn;

  return (
    <Link to={blogHref} className={cn('group flex', !isFeatured && 'h-full')}>
      <article
        className={cn(
          'relative flex w-full flex-col overflow-hidden rounded-md border border-border/40 bg-card/40 transition-colors duration-300',
          'hover:border-border/70',
          !isFeatured && 'h-full',
          isFeatured && 'md:grid md:grid-cols-[1.05fr_1fr] md:gap-0 lg:grid-cols-[1.15fr_1fr]',
        )}
      >
        <div
          className={cn(
            'relative w-full shrink-0 overflow-hidden bg-muted/30',
            isFeatured ? 'h-36 sm:h-40 md:h-full md:min-h-[168px] md:max-h-[200px]' : 'h-40 sm:h-44',
          )}
        >
          <Image
            src={image}
            alt={title}
            className="absolute inset-0 h-full w-full [&_img]:h-full [&_img]:w-full [&_img]:object-cover [&_img]:transition-transform [&_img]:duration-700 group-hover:[&_img]:scale-[1.03]"
          />
          <div className="absolute left-2.5 top-2.5 z-10 flex items-center gap-1.5">
            {isFeatured ? (
              <span className="rounded-md border border-primary/35 bg-background/85 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary backdrop-blur-md">
                {fr ? 'Plus lu' : 'Most read'}
              </span>
            ) : null}
            <span className="rounded-md border border-border/50 bg-background/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-foreground backdrop-blur-md">
              {category}
            </span>
          </div>
        </div>

        <div
          className={cn(
            'flex min-h-0 flex-1 flex-col',
            isFeatured ? 'gap-1.5 p-3 sm:p-3.5 md:p-4' : 'gap-1.5 p-3',
          )}
        >
          <div className="flex shrink-0 items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
            <span className="flex items-center gap-1">
              <HiOutlineCalendar className="h-3.5 w-3.5" />
              {new Date(date).toLocaleDateString(fr ? 'fr-FR' : 'en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1">
              <HiOutlineClock className="h-3.5 w-3.5" />
              {readTime}
            </span>
          </div>

          <h3
            className={cn(
              'shrink-0 font-bold text-foreground transition-colors group-hover:text-primary',
              isFeatured
                ? 'line-clamp-2 min-h-[2.6em] text-[0.95rem] leading-snug sm:text-base md:min-h-0 md:text-lg md:leading-snug'
                : 'line-clamp-2 min-h-[2.75em] text-base leading-snug',
            )}
          >
            {title}
          </h3>

          <p
            className={cn(
              'text-muted-foreground',
              isFeatured
                ? 'line-clamp-2 text-xs leading-relaxed'
                : 'line-clamp-2 min-h-[2.5em] flex-1 text-xs leading-relaxed',
            )}
          >
            {fr ? excerptFr : excerptEn}
          </p>

          {/* Single-line tags so wrapping never breaks row height parity */}
          <div className="mt-auto flex min-h-6 shrink-0 items-center gap-1.5 overflow-hidden pt-1">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="max-w-[7.5rem] truncate rounded-md border border-border/10 bg-secondary/50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-tighter text-muted-foreground"
                title={`#${tag}`}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  );
};
