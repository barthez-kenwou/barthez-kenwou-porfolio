import React, { Suspense } from 'react';
import { ErrorBoundary } from '@/app/lib/ErrorBoundary';
import { lazyImport } from '@/shared/lib/lazyImport';
import { DeferredMount } from '@/shared/ui/DeferredMount';

const PresentationVideo = lazyImport(
  () => import('@/widgets/PresentationVideo/PresentationVideo'),
  'PresentationVideo',
);

type PresentationVideoSlotProps = {
  /** Defer mount until near viewport (home below-fold). */
  deferred?: boolean;
  className?: string;
};

/**
 * Isolates the presentation-video chunk: stale deploy hashes must not
 * take down Home/About — silent degrade + one chunk reload attempt.
 */
export const PresentationVideoSlot: React.FC<PresentationVideoSlotProps> = ({
  deferred = false,
  className,
}) => {
  const body = (
    <ErrorBoundary fallback={null} variant="content">
      <Suspense fallback={<div className="min-h-[340px]" aria-hidden />}>
        <PresentationVideo />
      </Suspense>
    </ErrorBoundary>
  );

  if (!deferred) {
    return className ? <div className={className}>{body}</div> : body;
  }

  return (
    <DeferredMount
      timeout={800}
      rootMargin="120px"
      fallback={<div className="min-h-[340px]" aria-hidden />}
      className={className}
    >
      {body}
    </DeferredMount>
  );
};
