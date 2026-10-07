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
import { blogPostsData } from '@/entities/blogs/api/mock/blog.mocks';
import { motion } from 'framer-motion';
import { findByNumericId, getBlogPathSlug } from '@/shared/lib/entity-slug';

export const BlogDetailPage = () => {
  const { blogID } = useParams();
  const post = findByNumericId(blogPostsData, blogID);
  const { language } = useLanguageStore();

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

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-16">
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

                <HeroDetailSection />
                <MetaTagsSection />

                <div className="mt-8 border-t border-border/40 pt-0">
                  <ArticleContentSection />
                </div>

                <div className="mt-10 space-y-12">
                  <ShareSection />
                  <NavigationSection />
                  <RelatedPostsSection />
                  <NewsletterCTA
                    source="blog-article"
                    contactTo={`/contact?from=blog&article=${encodeURIComponent(
                      language === 'fr' ? post.titleFr : post.titleEn || post.titleFr,
                    )}`}
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
    </>
  );
};
