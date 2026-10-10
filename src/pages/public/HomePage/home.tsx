import React, { Suspense, lazy } from 'react';
import { SEO } from '@/shared/ui/SEO/SEO';
import { HeroSection } from './sections/HeroSection';
import { ServiceSection } from './sections/ServiceSection';
import { WhyChooseMeSection } from './sections/WhyChooseMeSection';
import { TestimonialsSection } from './sections/TestimonialsSection';
import { DarkBrandParallaxBand } from './sections/DarkBrandParallaxBand';
import { CTASection } from './sections/CTASection';
import { DeferredMount } from '@/shared/ui/DeferredMount';
import { useLanguageStore } from '@/shared/state/useLanguageStore';

const PresentationVideo = lazy(() =>
  import('@/widgets/PresentationVideo/PresentationVideo').then((m) => ({
    default: m.PresentationVideo,
  })),
);

export const HomePage: React.FC = () => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';

  return (
    <>
      <SEO
        path="/"
        title={
          isFr
            ? 'Barthez Kenwou | Développeur Full Stack & Ingénieur DevOps'
            : 'Barthez Kenwou | Full Stack Developer & DevOps Engineer'
        }
        description={
          isFr
            ? 'Full Stack JS, DevOps et AWS Cloud. Je transforme une vision produit en solution fiable, scalable et exploitable.'
            : 'Full Stack JS, DevOps, and AWS Cloud. I turn a product vision into a reliable, scalable, production-ready solution.'
        }
      />

      <div className="relative min-h-screen overflow-x-clip">
        <HeroSection />

        <DeferredMount
          timeout={400}
          rootMargin="200px"
          fallback={<div className="min-h-[340px]" aria-hidden />}
        >
          <Suspense fallback={<div className="min-h-[340px]" aria-hidden />}>
            <PresentationVideo />
          </Suspense>
        </DeferredMount>

        <DarkBrandParallaxBand>
          <ServiceSection />
          <WhyChooseMeSection />
          <TestimonialsSection />
        </DarkBrandParallaxBand>
        <CTASection />
      </div>
    </>
  );
};
