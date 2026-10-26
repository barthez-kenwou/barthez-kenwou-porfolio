import React from 'react';
import { RouteFallback } from '@/shared/ui/RouteFallback/RouteFallback';

/** @deprecated Prefer RouteFallback / LoadingPage — kept as branded alias. */
export const LoadingSpinner: React.FC = () => <RouteFallback fullScreen />;
