import type { IBlog } from '@/entities/blogs';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { HiOutlineArrowLeft, HiOutlineArrowRight } from 'react-icons/hi2';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getBlogPathSlug } from '@/shared/lib/entity-slug';

export const NavigationSection: React.FC<{ post: IBlog; posts: IBlog[] }> = ({ post, posts }) => {
  const { language } = useLanguageStore();

  const { prevPost, nextPost } = useMemo(() => {
    const currentIndex = posts.findIndex((p) => p.id === post.id);
    return {
      prevPost: currentIndex > 0 ? posts[currentIndex - 1] : null,
      nextPost:
        currentIndex >= 0 && currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null,
    };
  }, [posts, post.id]);

  return (
    <div className="flex justify-between items-center border-t border-border/50 pt-4 mb-8">
      {prevPost ? (
        <Link
          to={`/blog/${getBlogPathSlug(prevPost)}`}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors max-w-[45%] group"
        >
          <HiOutlineArrowLeft className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-medium truncate">
            {language === 'fr' ? prevPost.titleFr : prevPost.titleEn}
          </span>
        </Link>
      ) : (
        <div />
      )}
      {nextPost && (
        <Link
          to={`/blog/${getBlogPathSlug(nextPost)}`}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors max-w-[45%] text-right group"
        >
          <span className="text-sm font-medium truncate">
            {language === 'fr' ? nextPost.titleFr : nextPost.titleEn}
          </span>
          <HiOutlineArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
};
