import type { IBlog } from '@/entities/blogs';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { HiOutlineArrowLeft, HiOutlineArrowRight } from 'react-icons/hi2';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getBlogPathSlug } from '@/shared/lib/entity-slug';

export const NavigationSection: React.FC<{ post: IBlog; posts: IBlog[] }> = ({ post, posts }) => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';

  const { prevPost, nextPost } = useMemo(() => {
    const currentIndex = posts.findIndex((p) => p.id === post.id);
    return {
      prevPost: currentIndex > 0 ? posts[currentIndex - 1] : null,
      nextPost:
        currentIndex >= 0 && currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null,
    };
  }, [posts, post.id]);

  const prevTitle = prevPost
    ? isFr
      ? prevPost.titleFr
      : prevPost.titleEn || prevPost.titleFr
    : null;
  const nextTitle = nextPost
    ? isFr
      ? nextPost.titleFr
      : nextPost.titleEn || nextPost.titleFr
    : null;

  return (
    <nav
      className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-stretch sm:gap-3 md:gap-4"
      aria-label={isFr ? 'Navigation entre articles' : 'Article navigation'}
    >
      {prevPost ? (
        <Link
          to={`/blog/${getBlogPathSlug(prevPost)}`}
          className="group flex min-w-0 items-center gap-2.5 rounded-sm border border-border bg-card px-3.5 py-3.5 text-foreground/85 transition-colors hover:border-foreground/25 hover:text-foreground sm:py-3"
        >
          <HiOutlineArrowLeft className="size-4 shrink-0 transition-transform group-hover:-translate-x-0.5" />
          <span className="min-w-0">
            <span className="mb-0.5 block text-[11px] text-foreground/55">
              {isFr ? 'Précédent' : 'Previous'}
            </span>
            <span className="block truncate text-sm font-medium leading-snug">{prevTitle}</span>
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" aria-hidden />
      )}

      <Link
        to="/blog"
        className="flex min-w-0 items-center justify-center rounded-sm border border-border bg-muted/40 px-3.5 py-3.5 text-center text-sm font-medium text-foreground transition-colors hover:bg-muted/70 sm:py-3"
      >
        {isFr ? 'Tous les articles' : 'All articles'}
      </Link>

      {nextPost ? (
        <Link
          to={`/blog/${getBlogPathSlug(nextPost)}`}
          className="group flex min-w-0 items-center justify-end gap-2.5 rounded-sm border border-border bg-card px-3.5 py-3.5 text-right text-foreground/85 transition-colors hover:border-foreground/25 hover:text-foreground sm:py-3"
        >
          <span className="min-w-0">
            <span className="mb-0.5 block text-[11px] text-foreground/55">
              {isFr ? 'Suivant' : 'Next'}
            </span>
            <span className="block truncate text-sm font-medium leading-snug">{nextTitle}</span>
          </span>
          <HiOutlineArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : (
        <div className="hidden sm:block" aria-hidden />
      )}
    </nav>
  );
};
