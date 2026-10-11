import { useEffect, useState } from 'react';
import { useSidebar } from '@/shared/ui/sidebar';

/** Shell width duration — keep in sync with sidebar.tsx */
export const SIDEBAR_WIDTH_MS = 500;

/** Start fading labels in while the shell is still widening (softer overlap). */
const EXPAND_REVEAL_MS = 160;

/**
 * Separates shell width animation from expanded chrome (labels, large photo, full CTA).
 * Expand: width starts → labels ease in mid-way.
 * Collapse: labels ease out with the width (no hard cut).
 */
export function useSidebarReveal() {
  const { state, isMobile } = useSidebar();
  const isExpanded = state === 'expanded';
  const [contentReady, setContentReady] = useState(isExpanded || isMobile);

  useEffect(() => {
    if (isMobile) {
      setContentReady(true);
      return;
    }

    if (isExpanded) {
      const id = window.setTimeout(() => setContentReady(true), EXPAND_REVEAL_MS);
      return () => window.clearTimeout(id);
    }

    setContentReady(false);
  }, [isExpanded, isMobile]);

  return {
    isExpanded,
    /** Labels / expanded layout — eased in after width has started opening */
    contentReady: isMobile ? true : contentReady,
  };
}
