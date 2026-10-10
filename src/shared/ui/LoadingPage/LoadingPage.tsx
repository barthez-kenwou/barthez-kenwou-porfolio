import React from 'react';
import { RouteFallback } from '@/shared/ui/RouteFallback/RouteFallback';

/**
 * App boot / auth gate loader.
 * Same branded BK orbits as route lazy-load — no flare / photo backdrop.
 */
export const LoadingPage: React.FC = () => {
  return <RouteFallback fullScreen showStatus />;
};
