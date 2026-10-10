import type { IBlog } from '@/entities/blogs';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { Image } from '@/shared/ui/Image';
import React from 'react';

/**
 * Banner sits under the title: illustration, not the page hero.
 * Slightly shorter ratios so the H1 still owns the first viewport.
 */
export const HeroDetailSection: React.FC<{ post: IBlog }> = ({ post }) => {
  const { language } = useLanguageStore();
  const title = language === 'fr' ? post.titleFr : post.titleEn || post.titleFr;

  return (
    <figure className="relative">
      <div className="relative aspect-[2/1] overflow-hidden rounded-sm border border-border/40 sm:aspect-[21/10] md:aspect-[21/9]">
        <Image
          src={post.image}
          alt={title}
          className="h-full w-full object-cover"
          priority
          lazy={false}
          showSpinner={false}
        />
      </div>
    </figure>
  );
};
