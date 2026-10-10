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

  const { titleFr, titleEn, excerptFr, excerptEn, image, category, date, readTime, tags } = Blog;
  const blogHref = `/blog/${getBlogPathSlug(Blog)}`;

  return (
    <Link to={blogHref} className="block group">
      <article
        className={cn(
          'relative overflow-hidden rounded-md transition-all duration-300',
          isFeatured && 'md:grid md:grid-cols-2 lg:grid-cols-5 md:gap-2',
        )}
      >
        <div
          className={cn(
            'relative w-full overflow-hidden bg-muted/30',
            isFeatured
              ? 'h-40 sm:h-44 md:h-full md:min-h-[220px] md:max-h-[300px] lg:col-span-3'
              : 'h-40 sm:h-44',
          )}
        >
          <Image
            src={image}
            alt={language === 'fr' ? titleFr : titleEn}
            className="absolute inset-0 h-full w-full [&_img]:h-full [&_img]:w-full [&_img]:object-cover [&_img]:transition-transform [&_img]:duration-700"
          />
          <div className="absolute left-3 top-3 z-10">
            <span className="rounded-md border border-border/50 bg-background/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-foreground backdrop-blur-md">
              {category}
            </span>
          </div>
        </div>

        <div
          className={cn(
            'flex flex-col justify-center',
            isFeatured ? 'p-3 md:p-3 lg:col-span-2' : 'p-2',
          )}
        >
          <div className="mb-2 flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 md:mb-3">
            <span className="flex items-center gap-1">
              <HiOutlineCalendar className="h-3.5 w-3.5" />
              {new Date(date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
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
              'mb-1.5 font-extrabold leading-snug text-foreground transition-colors group-hover:text-primary md:mb-2 md:leading-tight',
              isFeatured
                ? 'line-clamp-3 text-base sm:text-lg md:line-clamp-none md:text-2xl'
                : 'line-clamp-2 text-base',
            )}
          >
            {language === 'fr' ? titleFr : titleEn}
          </h3>

          <p
            className={cn(
              'text-muted-foreground line-clamp-2',
              isFeatured ? 'mb-2 text-xs sm:text-sm md:text-base' : 'mb-4 text-xs',
            )}
          >
            {language === 'fr' ? excerptFr : excerptEn}
          </p>

          <div className="flex flex-wrap gap-1.5 mt-auto">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md bg-secondary/50 text-[9px] uppercase tracking-tighter font-bold text-muted-foreground border border-border/10"
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
