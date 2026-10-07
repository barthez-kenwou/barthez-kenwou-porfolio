import React from 'react';
import { HeroSection } from './sections/HeroSection';
import { NewsletterCTA } from './sections/NewsletterCTA';
import { PostsGrid } from './sections/PostsGrid';
import { SEO } from '@/shared/ui/SEO/SEO';

export const BlogPage: React.FC = () => {
  return (
    <>
      <SEO
        path="/blog"
        title="Blog"
        description="Articles et tutoriels sur le développement web, le cloud AWS, le DevOps, Kubernetes et les meilleures pratiques Full Stack."
      />

      <div className="min-h-screen overflow-x-clip">
        <HeroSection />
        <PostsGrid />
        <NewsletterCTA source="blog" contactTo="/contact?from=blog" />
      </div>
    </>
  );
};
