import React from 'react';
import { HeroSection } from './sections/HeroSection';
import { NewsletterCTA } from './sections/NewsletterCTA';
import { PostsGrid } from './sections/PostsGrid';
import { SEO } from '@/shared/ui/SEO/SEO';
import { useLanguageStore } from '@/shared/state/useLanguageStore';

export const BlogPage: React.FC = () => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';

  return (
    <>
      <SEO
        path="/blog"
        title="Blog"
        description={
          isFr
            ? 'Notes de terrain sur le développement web, AWS, DevOps, Kubernetes et le Full Stack.'
            : 'Field notes on web development, AWS, DevOps, Kubernetes, and Full Stack engineering.'
        }
      />

      <div className="min-h-screen overflow-x-clip pb-3 md:pb-4">
        <HeroSection />
        <PostsGrid />
        <NewsletterCTA source="blog" contactTo="/contact?from=blog" />
      </div>
    </>
  );
};
