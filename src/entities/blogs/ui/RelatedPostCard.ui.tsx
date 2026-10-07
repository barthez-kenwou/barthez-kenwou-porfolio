import React from 'react';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { IBlog } from '../model/blog.type';
import { Link } from 'react-router-dom';
import { Image } from '@/shared/ui/Image';
import { getBlogPathSlug } from '@/shared/lib/entity-slug';
import { cn } from '@/shared/lib/utils';

type RelatedPostCardProps = {
  Blog: IBlog;
  className?: string;
  compact?: boolean;
};

export const RelatedPostCard: React.FC<RelatedPostCardProps> = ({
  Blog,
  className,
  compact = false,
}) => {
  const { language } = useLanguageStore();

  const { titleFr, titleEn, image, readTime } = Blog;

  return (
    <Link
      to={`/blog/${getBlogPathSlug(Blog)}`}
      className={cn(
        'group block shrink-0 overflow-hidden rounded-md border border-border/50 bg-card transition-all duration-300 hover:border-primary/40',
        compact ? 'w-[46vw] max-w-[190px] sm:w-[200px] sm:max-w-none md:w-[220px]' : 'w-full',
        className,
      )}
    >
      <div
        className={cn(
          'relative w-full overflow-hidden bg-muted/30',
          compact ? 'aspect-[16/10]' : 'mb-3 aspect-video',
        )}
      >
        <Image
          src={image}
          alt={language === 'fr' ? titleFr : titleEn}
          className="absolute inset-0 h-full w-full [&_img]:h-full [&_img]:w-full [&_img]:object-cover [&_img]:transition-transform [&_img]:duration-500 group-hover:[&_img]:scale-110"
        />
      </div>

      <div className={cn(compact ? 'space-y-1.5 p-2' : 'p-2')}>
        <h3
          className={cn(
            'font-semibold leading-snug text-foreground transition-colors group-hover:text-primary',
            compact ? 'line-clamp-2 text-[11px] sm:text-xs' : 'line-clamp-2 text-sm font-bold',
          )}
        >
          {language === 'fr' ? titleFr : titleEn}
        </h3>
        <div className="flex items-center justify-between gap-1">
          <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60">
            {readTime}
          </span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-primary opacity-0 transition-opacity group-hover:opacity-100">
            {language === 'fr' ? 'Lire →' : 'Read →'}
          </span>
        </div>
      </div>
    </Link>
  );
};
