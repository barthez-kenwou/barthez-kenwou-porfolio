import type { IBlog } from '@/entities/blogs';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { HiOutlineArrowLeft, HiOutlineArrowRight } from 'react-icons/hi2';
import { LayoutGrid } from 'lucide-react';
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
      className="grid grid-cols-1 gap-2 border-t border-border/40 pt-5 sm:grid-cols-3 sm:items-stretch sm:gap-3"
      aria-label={isFr ? 'Navigation entre articles' : 'Article navigation'}
    >
      {prevPost ? (
        <Link
          to={`/blog/${getBlogPathSlug(prevPost)}`}
          className="group flex min-w-0 items-center gap-2 rounded-md border border-border bg-card px-3 py-2.5 text-foreground/85 transition-colors hover:border-primary/40 hover:text-primary"
        >
          <HiOutlineArrowLeft className="size-4 shrink-0 transition-transform group-hover:-translate-x-0.5" />
          <span className="min-w-0">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground/60">
              {isFr ? 'Précédent' : 'Previous'}
            </span>
            <span className="block truncate text-sm font-medium">{prevTitle}</span>
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" aria-hidden />
      )}

      <Link
        to="/blog"
        className="group flex min-w-0 items-center justify-center gap-2 rounded-md border border-primary/30 bg-primary/8 px-3 py-2.5 text-center text-primary transition-colors hover:border-primary/50 hover:bg-primary/12"
      >
        <LayoutGrid className="size-4 shrink-0" />
        <span className="text-sm font-semibold">
          {isFr ? 'Tous les articles' : 'All articles'}
        </span>
      </Link>

      {nextPost ? (
        <Link
          to={`/blog/${getBlogPathSlug(nextPost)}`}
          className="group flex min-w-0 items-center justify-end gap-2 rounded-md border border-border bg-card px-3 py-2.5 text-right text-foreground/85 transition-colors hover:border-primary/40 hover:text-primary"
        >
          <span className="min-w-0">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground/60">
              {isFr ? 'Suivant' : 'Next'}
            </span>
            <span className="block truncate text-sm font-medium">{nextTitle}</span>
          </span>
          <HiOutlineArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : (
        <div className="hidden sm:block" aria-hidden />
      )}
    </nav>
  );
};
