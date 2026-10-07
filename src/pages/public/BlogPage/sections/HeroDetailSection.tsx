import { blogPostsData } from '@/entities/blogs/api/mock/blog.mocks';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { Image } from '@/shared/ui/Image';
import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { findByNumericId } from '@/shared/lib/entity-slug';

export const HeroDetailSection: React.FC = () => {
  const { blogID } = useParams();
  const { language } = useLanguageStore();
  const post = findByNumericId(blogPostsData, blogID);

  if (!post) return null;

  return (
    <section className="mb-8 relative group">
      {/* Decorative background glow */}
      <div className="absolute -inset-4 bg-gradient-to-r from-primary/15 to-transparent rounded-sm blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative aspect-[21/10] md:aspect-[21/9] overflow-hidden rounded-sm border border-white/10 shadow-lg shadow-primary/10 transition-transform duration-700"
      >
        <Image
          src={post.image}
          alt={language === 'fr' ? post.titleFr : post.titleEn}
          className="w-full h-full object-cover transition-transform duration-1000"
        />

        {/* Gradients for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent mix-blend-overlay" />

        {/* Subtle glassmorphism border highlight */}
        <div className="absolute inset-0 rounded-sm border border-white/20 pointer-events-none" />
      </motion.div>
    </section>
  );
};
