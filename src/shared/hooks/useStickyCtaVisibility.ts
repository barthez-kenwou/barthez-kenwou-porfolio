import { useEffect, useState, type RefObject } from 'react';

type UseStickyCtaVisibilityArgs = {
  /** Becomes sticky once this leaves the viewport (hero / early CTA). */
  hideWhileInViewRef: RefObject<HTMLElement | null>;
  /** Hide again when the end CTA enters view. */
  endCtaRef: RefObject<HTMLElement | null>;
  /** Re-bind when async content mounts. */
  ready?: boolean;
  threshold?: number;
};

/**
 * CV-style sticky CTA gate: visible after hero actions leave, until end CTA arrives.
 */
export function useStickyCtaVisibility({
  hideWhileInViewRef,
  endCtaRef,
  ready = true,
  threshold = 0.12,
}: UseStickyCtaVisibilityArgs) {
  const [pastAnchor, setPastAnchor] = useState(false);
  const [endInView, setEndInView] = useState(false);

  useEffect(() => {
    if (!ready) return;
    const anchor = hideWhileInViewRef.current;
    const endEl = endCtaRef.current;
    if (!anchor || !endEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === anchor) {
            setPastAnchor(!entry.isIntersecting);
          }
          if (entry.target === endEl) {
            setEndInView(entry.isIntersecting);
          }
        }
      },
      { threshold },
    );

    observer.observe(anchor);
    observer.observe(endEl);
    return () => observer.disconnect();
  }, [hideWhileInViewRef, endCtaRef, ready, threshold]);

  return pastAnchor && !endInView;
}
