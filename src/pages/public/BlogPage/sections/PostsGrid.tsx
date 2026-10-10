import { BlogCard, IBlog, usePublicBlogs } from '@/entities/blogs';
import { filterPublicBlogs, pickMostReadBlog, sortBlogsByArrival } from '@/entities/blogs/lib/blogListing';
import { EmptyBlogCard } from '@/entities/blogs/ui/EmptyBlogCard.ui';
import { categories } from '@/shared/constants/blogCategories.const';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { QueryState } from '@/shared/ui/QueryState';
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import React, { useMemo, useState, useTransition } from 'react';
import { cn } from '@/shared/lib/utils';

export const PostsGrid: React.FC = () => {
  const { language } = useLanguageStore();
  const fr = language === 'fr';
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { data, isPending: listPending, isError, error } = usePublicBlogs();
  const posts = data?.data.items ?? [];

  const filteredPosts = useMemo(() => {
    return sortBlogsByArrival(
      filterPublicBlogs(posts, {
        category: activeCategory,
        search: searchQuery,
        language,
      }),
    );
  }, [posts, activeCategory, searchQuery, language]);

  const showFeatured = activeCategory === 'All' && searchQuery.trim() === '';

  const featuredPost = useMemo(() => {
    if (!showFeatured) return null;
    return pickMostReadBlog(filteredPosts);
  }, [filteredPosts, showFeatured]);

  const gridPosts = useMemo(() => {
    if (!featuredPost) return filteredPosts;
    return filteredPosts.filter((p) => p.id !== featuredPost.id);
  }, [filteredPosts, featuredPost]);

  const isExpanded = searchFocused || searchQuery.length > 0;

  return (
    <>
      <div className="relative z-20 bg-background px-4 py-4 md:px-10 lg:px-14">
        <section className="mb-4 flex flex-col items-center gap-4 md:flex-row md:items-center md:justify-start">
          <div
            className={cn(
              'group/search relative w-full max-w-[11.5rem] transition-[max-width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:max-w-[13rem]',
              'md:max-w-[14rem]',
              isExpanded && 'max-w-full sm:max-w-md md:max-w-xl',
            )}
          >
            <div
              className={cn(
                'relative overflow-hidden rounded-full border transition-all duration-500',
                'bg-secondary/40 backdrop-blur-md',
                isExpanded
                  ? 'border-primary/45 shadow-[0_0_0_3px_hsl(var(--primary)/0.12)] shadow-primary/20'
                  : 'border-border/50 hover:border-primary/30',
              )}
            >
              <div
                aria-hidden
                className={cn(
                  'pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500',
                  'bg-[radial-gradient(120%_80%_at_0%_50%,hsl(var(--primary)/0.18),transparent_55%)]',
                  isExpanded && 'opacity-100',
                )}
              />
              <div
                aria-hidden
                className={cn(
                  'pointer-events-none absolute -inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity duration-500',
                  isExpanded && 'opacity-100',
                )}
              />

              <HiOutlineMagnifyingGlass
                className={cn(
                  'absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-300',
                  isExpanded ? 'text-primary' : 'text-muted-foreground',
                )}
              />

              <input
                type="search"
                placeholder={fr ? 'Rechercher…' : 'Search…'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className={cn(
                  'relative z-10 w-full bg-transparent py-2.5 pl-9 pr-4 text-sm text-foreground outline-none',
                  'placeholder:text-muted-foreground/55',
                )}
                aria-label={fr ? 'Rechercher un article' : 'Search articles'}
              />
            </div>
          </div>

          <div
            className={cn(
              'flex flex-wrap justify-center gap-2 md:justify-start',
              isPending && 'opacity-80',
            )}
            role="group"
            aria-label={fr ? 'Catégories' : 'Categories'}
          >
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => startTransition(() => setActiveCategory(category))}
                className={`rounded-md border px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
                  activeCategory === category
                    ? 'border-brand bg-brand text-brand-foreground'
                    : 'border-border/50 bg-secondary/30 text-muted-foreground hover:text-foreground'
                }`}
              >
                {category === 'All' ? (fr ? 'Tous' : 'All') : category}
              </button>
            ))}
          </div>
        </section>

        <QueryState
          isPending={listPending}
          isError={isError}
          errorMessage={error instanceof Error ? error.message : undefined}
          source={data?.source}
        >
          <section className="space-y-4 pb-10 md:space-y-6 md:pb-14">
            {featuredPost ? (
              <div>
                <BlogCard Blog={featuredPost} isFeatured />
              </div>
            ) : null}

            <div className="grid auto-rows-fr gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {gridPosts.map((blog: IBlog) => (
                <div key={blog.id} className="h-full min-h-0">
                  <BlogCard Blog={blog} />
                </div>
              ))}
            </div>

            {filteredPosts.length === 0 ? <EmptyBlogCard /> : null}
          </section>
        </QueryState>
      </div>
    </>
  );
};
