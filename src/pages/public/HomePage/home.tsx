import React, { Suspense, lazy, useEffect, useState } from 'react';
import { SEO } from '@/shared/ui/SEO/SEO';
import { HeroSection } from './sections/HeroSection';
import { ServiceSection } from './sections/ServiceSection';
import { WhyChooseMeSection } from './sections/WhyChooseMeSection';
import { TestimonialsSection } from './sections/TestimonialsSection';
import { DarkBrandParallaxBand } from './sections/DarkBrandParallaxBand';
import { CTASection } from './sections/CTASection';
import { DeferredMount } from '@/shared/ui/DeferredMount';
import { ErrorBoundary } from '@/app/lib/ErrorBoundary';
import { useLanguageStore } from '@/shared/state/useLanguageStore';

const SplashCursor = lazy(() =>
  import('@/shared/ui/splash-cursor').then((m) => ({ default: m.SplashCursor })),
);

const PresentationVideo = lazy(() =>
  import('@/widgets/PresentationVideo/PresentationVideo').then((m) => ({
    default: m.PresentationVideo,
  })),
);

function canUseWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

function DeferredSplash() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (reduced || coarse || !canUseWebGL()) return;

    const schedule =
      (
        window as Window & {
          requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
        }
      ).requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 400));

    const id = schedule(() => setReady(true), { timeout: 1800 });
    return () => {
      const cancel =
        (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback ??
        clearTimeout;
      cancel(id as number);
    };
  }, []);

  if (!ready) return null;

  return (
    <ErrorBoundary fallback={null}>
      <Suspense fallback={null}>
        <SplashCursor />
      </Suspense>
    </ErrorBoundary>
  );
}

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
        <DeferredSplash />

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

        <ServiceSection />
        <DarkBrandParallaxBand>
        <WhyChooseMeSection />
          <TestimonialsSection />
        </DarkBrandParallaxBand>
        <CTASection />
      </div>
    </>
  );
};
