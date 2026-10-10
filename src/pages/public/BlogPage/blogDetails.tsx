import { useParams } from 'react-router-dom';
import { NotFoundPost } from './sections/NotFoundPost';
import { BackSection } from './sections/BackSection';
import { HeroDetailSection } from './sections/HeroDetailSection';
import { MetaTagsSection } from './sections/Meta&tagsSection';
import { NewsletterCTA } from './sections/NewsletterCTA';
import { NavigationSection } from './sections/NavigationSection';
import { FloatingShareRail } from './sections/FloatingShareRail';
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
    void import('@/app/lib/analytics').then((m) =>
      m.trackBlogRead(getBlogPathSlug(post), 25),
    );
  }, [post]);

  const notFound =
    !isPending &&
    (Boolean(
      error &&
        typeof error === 'object' &&
        'message' in error &&
        String((error as { message: string }).message)
          .toLowerCase()
          .includes('not found'),
    ) ||
      (!isError && !post));

  if (isPending || (isError && !notFound)) {
    return (
      <div className="min-h-screen px-4 py-24 md:px-10 lg:px-14">
        <QueryState
          variant="page"
          isPending={isPending}
          isError={isError}
          errorMessage={
            error instanceof Error
              ? error.message
              : error && typeof error === 'object' && 'message' in error
                ? String((error as { message: string }).message)
                : undefined
          }
          source={data?.source}
        >
          {null}
        </QueryState>
      </div>
    );
  }

  if (notFound || !post || post.isPublished === false) return <NotFoundPost />;

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
        <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10" aria-hidden>
          <div className="absolute top-0 right-0 w-[min(400px,70vw)] h-[min(400px,70vw)] bg-primary/5 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[min(400px,70vw)] h-[min(400px,70vw)] bg-primary/5 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3" />
        </div>

        <FloatingShareRail post={post} />

        {/* pr clears the fixed share rail on narrow viewports */}
        <div className="mx-auto max-w-6xl px-4 pr-12 pt-28 pb-36 sm:px-6 sm:pr-14 md:pt-32 md:pb-20 lg:px-8 lg:pr-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 xl:gap-14">
            <aside className="relative hidden min-w-0 lg:col-span-4 lg:block xl:col-span-3">
              <TableOfContents content={content} variant="desktop" />
            </aside>

            <main className="min-w-0 lg:col-span-8 xl:col-span-9">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-5 md:space-y-7"
              >
                <BackSection />

                <div ref={heroRef}>
                  <HeroDetailSection post={post} />
                </div>

                <MetaTagsSection post={post} />

                <div className="border-t border-border/40 pt-5 md:pt-7">
                  <ArticleContentSection post={post} />
                </div>

                <div className="space-y-6 border-t border-border/40 pt-6 md:space-y-8 md:pt-8">
                  <NavigationSection post={post} posts={allPosts} />
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
            <TableOfContents
              content={content}
              variant="mobile"
              clearStickyCta={stickyVisible}
            />
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
