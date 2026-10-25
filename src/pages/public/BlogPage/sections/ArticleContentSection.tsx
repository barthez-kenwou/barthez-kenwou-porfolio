import type { IBlog } from '@/entities/blogs';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { BlogMarkdown } from '@/shared/ui/markdown/BlogMarkdown';

function ReadingProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 36,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 h-0.5 origin-left bg-primary"
      style={{ scaleX }}
      aria-hidden
    />
  );
}

export const ArticleContentSection: React.FC<{ post: IBlog }> = React.memo(({ post }) => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';
  const content = isFr ? post.contentFr : post.contentEn;

  return (
    <article className="relative min-w-0 max-w-full">
      <ReadingProgressBar />
      <BlogMarkdown content={content} isFr={isFr} className="mb-8 md:mb-10" />
    </article>
  );
});

ArticleContentSection.displayName = 'ArticleContentSection';
