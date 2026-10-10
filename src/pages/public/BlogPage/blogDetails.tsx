import { useParams } from 'react-router-dom';
import { NotFoundPost } from './sections/NotFoundPost';
import { BackSection } from './sections/BackSection';
import { HeroDetailSection } from './sections/HeroDetailSection';
import { MetaTagsSection } from './sections/Meta&tagsSection';
import { NewsletterCTA } from './sections/NewsletterCTA';
import { RelatedPostsSection } from './sections/RelatedPostsSection';
import { NavigationSection } from './sections/NavigationSection';
import { ShareSection } from './sections/ShareSection';
import { ArticleContentSection } from './sections/ArticleContentSection';
import { TableOfContents } from './sections/TableOfContents';
import { SEO } from '@/shared/ui/SEO/SEO';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { truncateFonction } from '@/shared/ui/utils/truncateText/helpers';
import { useBlogBySlug, usePublicBlogs } from '@/entities/blogs';
import { motion } from 'framer-motion';
import { getBlogPathSlug } from '@/shared/lib/entity-slug';
import { QueryState } from '@/shared/ui/QueryState';
import { useEffect, useRef } from 'react';
import { MobileStickyCtaBar } from '@/shared/ui/MobileStickyCtaBar';
import { useStickyCtaVisibility } from '@/shared/hooks/useStickyCtaVisibility';

export const BlogDetailPage = () => {
  const { blogID } = useParams();
  const { language } = useLanguageStore();
  const isFr = language === 'fr';
  const { data, isPending, isError, error } = useBlogBySlug(blogID);
  const postsQuery = usePublicBlogs();
  const post = data?.data;
  const allPosts = postsQuery.data?.data.items ?? [];
  const heroRef = useRef<HTMLDivElement | null>(null);
  const endCtaRef = useRef<HTMLElement | null>(null);
  const stickyVisible = useStickyCtaVisibility({
    hideWhileInViewRef: heroRef,
    endCtaRef,
    ready: Boolean(post),
  });
  const contactTo = post
    ? `/contact?from=blog&article=${encodeURIComponent(
        isFr ? post.titleFr : post.titleEn || post.titleFr,
      )}`
    : '/contact?from=blog';

  useEffect(() => {
    if (!post || post.isPublished === false) return;
    // Scroll depth on /blog/:slug is already captured by usePageEngagement;
    // mark an explicit blog_read@25 once the article mounts.
    void import('@/app/lib/analytics').then((m) =>
      m.trackBlogRead(getBlogPathSlug(post), 25),
    );
  }, [post]);

  if (isPending || isError) {
    return (
      <div className="min-h-screen px-4 py-24 md:px-10 lg:px-14">
        <QueryState
          variant="page"
          isPending={isPending}
          isError={isError}
          errorMessage={error instanceof Error ? error.message : undefined}
          source={data?.source}
        >
          {null}
        </QueryState>
      </div>
    );
  }

  if (!post || post.isPublished === false) return <NotFoundPost />;

  const content = language === 'fr' ? post.contentFr : post.contentEn;
  const blogPath = `/blog/${getBlogPathSlug(post)}`;

  return (
    <>
      <SEO
        path={blogPath}
        title={`${
          language === 'fr'
            ? truncateFonction(post?.titleFr || '', 60)
            : truncateFonction(post?.titleEn || post?.titleFr || '', 60)
        }`}
        description={`${
          language === 'fr'
            ? truncateFonction(post?.excerptFr || post?.contentFr || '', 160)
            : truncateFonction(post?.excerptEn || post?.excerptFr || post?.contentEn || '', 160)
        }`}
        openGraph={{
          type: 'article',
          image: post.image,
          imageAlt: language === 'fr' ? post.titleFr : post.titleEn || post.titleFr,
        }}
        additionalMeta={[
          { property: 'article:published_time', content: post.date },
          { property: 'article:author', content: post.author },
          { property: 'article:section', content: post.category },
          ...post.tags.slice(0, 8).map((tag) => ({
            property: 'article:tag',
            content: tag,
          })),
        ]}
        jsonLd={{
          '@type': 'BlogPosting',
          headline: language === 'fr' ? post.titleFr : post.titleEn || post.titleFr,
          description: language === 'fr' ? post.excerptFr : post.excerptEn || post.excerptFr,
          image: post.image,
          datePublished: post.date,
          author: {
            '@type': 'Person',
            name: post.author,
            url: 'https://barthez-kenwou.dev',
          },
          mainEntityOfPage: `https://barthez-kenwou.dev${blogPath}`,
          keywords: post.tags.join(', '),
          articleSection: post.category,
        }}
      />

      <div className="min-h-screen bg-background relative overflow-x-clip">
        {/* Background Decorative Elements - contained so they never create page-level X scroll */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10" aria-hidden>
          <div className="absolute top-0 right-0 w-[min(400px,70vw)] h-[min(400px,70vw)] bg-primary/5 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[min(400px,70vw)] h-[min(400px,70vw)] bg-primary/5 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="mx-auto max-w-6xl px-4 pb-3 pt-24 sm:px-6 md:pb-4 md:pt-32 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16">
            {/* Sidebar - fixed TOC pinned to this column while reading */}
            <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 min-w-0 relative">
              <TableOfContents content={content} variant="desktop" />
            </aside>

            {/* Main Content */}
            <main className="lg:col-span-8 xl:col-span-9 min-w-0">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
              >
                <div className="mb-6 md:mb-8">
                  <BackSection />
                </div>

                <div ref={heroRef}>
                  <HeroDetailSection post={post} />
                </div>
                <MetaTagsSection post={post} />

                <div className="mt-8 border-t border-border/40 pt-0">
                  <ArticleContentSection post={post} />
                </div>

                <div className="mt-10 space-y-12">
                  <ShareSection post={post} />
                  <NavigationSection post={post} posts={allPosts} />
                  <RelatedPostsSection post={post} posts={allPosts} />
                  <NewsletterCTA
                    source="blog-article"
                    contactTo={contactTo}
                    sectionRef={endCtaRef}
                    className="!px-0"
                  />
                </div>
              </motion.div>
            </main>
          </div>

          <div className="lg:hidden">
            <TableOfContents content={content} variant="mobile" />
          </div>
        </div>
      </div>

      <MobileStickyCtaBar
        visible={stickyVisible}
        to={contactTo}
        location="blog_detail_sticky"
        label={isFr ? 'Parlons-en' : "Let's talk"}
      />
    </>
  );
};
