import { IBlog } from '@/entities/blogs';
import { RelatedPostCard } from '@/entities/blogs/ui/RelatedPostCard.ui';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { HiOutlineBookOpen } from 'react-icons/hi2';
import React, { useMemo } from 'react';
import { Marquee } from '@/shared/ui/marquee';

export const RelatedPostsSection: React.FC<{ post: IBlog; posts: IBlog[] }> = ({
  post,
  posts,
}) => {
  const { language } = useLanguageStore();

  const relatedPosts = useMemo(
    () => posts.filter((p) => p.id !== post.id && p.category === post.category).slice(0, 8),
    [posts, post],
  );

  if (relatedPosts.length === 0) return null;

  const useMarquee = relatedPosts.length > 2;

  return (
    <section className="mb-12">
      <h2 className="section-title mb-5 flex items-center gap-2 !text-left !text-xl sm:!text-2xl">
        <HiOutlineBookOpen className="h-5 w-5 shrink-0 text-primary" />
        <span>{language === 'fr' ? 'Articles similaires' : 'Related articles'}</span>
      </h2>

      {useMarquee ? (
        <div className="relative -mx-1 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-background to-transparent sm:w-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-background to-transparent sm:w-10" />
          <Marquee
            pauseOnHover
            repeat={3}
            className="[--duration:28s] [--gap:0.75rem] p-1 sm:[--gap:1rem]"
          >
            {relatedPosts.map((blog: IBlog) => (
              <RelatedPostCard key={blog.id} Blog={blog} compact />
            ))}
          </Marquee>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {relatedPosts.map((blog: IBlog) => (
            <RelatedPostCard key={blog.id} Blog={blog} compact />
          ))}
        </div>
      )}
    </section>
  );
};
