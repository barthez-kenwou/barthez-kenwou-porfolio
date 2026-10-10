import type { IBlog } from '@/entities/blogs';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { Image } from '@/shared/ui/Image';
import React from 'react';
import { motion } from 'framer-motion';

export const HeroDetailSection: React.FC<{ post: IBlog }> = ({ post }) => {
  const { language } = useLanguageStore();

  return (
    <section className="relative mb-5 md:mb-7">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative aspect-[16/10] overflow-hidden rounded-md border border-border/40 shadow-sm sm:aspect-[21/11] md:aspect-[21/9]"
      >
        <Image
          src={post.image}
          alt={language === 'fr' ? post.titleFr : post.titleEn}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
      </motion.div>
    </section>
  );
};
