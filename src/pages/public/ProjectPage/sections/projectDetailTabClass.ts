import { cn } from '@/shared/lib/utils';

/** Quiet brand accent for filter / diagram tabs on the project detail page. */
export function projectDetailTabClass(active: boolean) {
  return cn(
    'text-xs transition-colors cursor-pointer underline-offset-4',
    active
      ? 'text-primary font-medium underline decoration-primary decoration-2'
      : 'text-muted-foreground hover:text-foreground',
  );
}
