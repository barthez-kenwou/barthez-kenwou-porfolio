import { blogPostsData } from '@/entities/blogs/api/mock/blog.mocks';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { HiOutlineCalendar, HiOutlineClock, HiOutlineUser } from 'react-icons/hi2';
import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { findByNumericId } from '@/shared/lib/entity-slug';

export const MetaTagsSection: React.FC = () => {
  const { blogID } = useParams();
  const { language } = useLanguageStore();

  const post = findByNumericId(blogPostsData, blogID) || {
    author: 'Barthez Kenwou',
    date: new Date().toISOString(),
    readTime: '5 min',
    titleFr: '',
    titleEn: '',
    tags: [],
  };

  const formattedDate = new Date(post.date).toLocaleDateString(
    language === 'fr' ? 'fr-FR' : 'en-US',
    { day: 'numeric', month: 'long', year: 'numeric' },
  );

  return (
    <div className="space-y-5 animate-fade-in-up">
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2 text-muted-foreground group">
          <div className="p-1 rounded-md bg-secondary/50 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
            <HiOutlineUser className="h-3.5 w-3.5" />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em]">
            {post.author}
          </span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground group">
          <div className="p-1 rounded-md bg-secondary/50 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
            <HiOutlineCalendar className="h-3.5 w-3.5" />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em]">
            {formattedDate}
          </span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground group">
          <div className="p-1 rounded-md bg-secondary/50 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
            <HiOutlineClock className="h-3.5 w-3.5" />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em]">
            {post.readTime}
          </span>
        </div>
      </div>

      <h1 className="article-title">
        <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
          {language === 'fr' ? post.titleFr : post.titleEn}
        </span>
      </h1>

      <div className="flex flex-wrap gap-1.5 pt-0.5">
        {post.tags.map((tag: string, index: number) => (
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            key={tag}
            className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold uppercase tracking-[0.12em] border border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all cursor-default"
          >
            {tag}
          </motion.span>
        ))}
      </div>
    </div>
  );
};
