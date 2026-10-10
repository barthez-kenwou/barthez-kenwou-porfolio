import type { IBlog } from '@/entities/blogs';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { Image } from '@/shared/ui/Image';
import React from 'react';

export const HeroDetailSection: React.FC<{ post: IBlog }> = ({ post }) => {
  const { language } = useLanguageStore();

  return (
    <section className="relative mb-5 md:mb-6">
      <div className="relative aspect-[16/10] overflow-hidden rounded-sm border border-border/50 sm:aspect-[21/11] md:aspect-[21/9]">
        <Image
          src={post.image}
          alt={language === 'fr' ? post.titleFr : post.titleEn}
          className="h-full w-full object-cover"
        />
      </div>
    </section>
  );
};
