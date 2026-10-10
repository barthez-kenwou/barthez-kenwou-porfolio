import * as React from 'react';

import { cn } from '@/shared/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        data-slot="textarea"
        className={cn(
          'flex min-h-[80px] w-full resize-y rounded-sm border border-input bg-transparent px-3 py-2 text-base placeholder:text-muted-foreground outline-none focus-visible:border-primary/50 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30',
          className,
        )}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
