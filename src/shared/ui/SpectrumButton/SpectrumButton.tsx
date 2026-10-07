import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Brand spectrum CTA - animated multi-stop border + underglow.
 * Fill stays dark/light so the moving spectrum rim stays readable.
 */
const spectrumButtonVariants = cva(
  cn(
    'relative isolate cursor-pointer group overflow-visible',
    'inline-flex items-center justify-center gap-2 shrink-0',
    'rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-primary/40',
    'text-sm font-semibold whitespace-nowrap',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg:not([class*=size-])]:size-4 [&_svg]:shrink-0',
    'animate-spectrum bg-[length:300%_100%]',
    '[background-origin:border-box]',
    '[background-clip:padding-box,border-box]',
    '[border:2px_solid_transparent]',
    // Underglow (spectrum smear under the button)
    'before:pointer-events-none before:absolute before:inset-x-[12%] before:-bottom-[30%] before:z-[-1]',
    'before:h-[55%] before:rounded-full before:opacity-90 before:blur-xl',
    'before:animate-spectrum before:bg-[length:300%_100%]',
    'before:bg-[linear-gradient(90deg,var(--spectrum-1),var(--spectrum-2),var(--spectrum-3),var(--spectrum-4),var(--spectrum-5),var(--spectrum-1))]',
  ),
  {
    variants: {
      variant: {
        /** Dark fill + vivid rim - primary CTA */
        solid: cn(
          'text-white',
          // Light: near-ink fill (kept as-is). Dark: darkviolet so it separates from secondary + page bg.
          'bg-[linear-gradient(#121018,#121018),linear-gradient(90deg,var(--spectrum-1),var(--spectrum-2),var(--spectrum-3),var(--spectrum-4),var(--spectrum-5),var(--spectrum-1))]',
          'dark:bg-[linear-gradient(#3b1f6e,#32185f),linear-gradient(90deg,var(--spectrum-1),var(--spectrum-2),var(--spectrum-3),var(--spectrum-4),var(--spectrum-5),var(--spectrum-1))]',
          'shadow-[0_0_0_1px_hsla(268,70%,60%,0.18),0_8px_28px_-10px_hsla(268,80%,55%,0.55)]',
          'dark:shadow-[0_0_0_1px_hsla(268,70%,55%,0.28),0_10px_32px_-8px_hsla(268,80%,50%,0.55)]',
          'hover:shadow-[0_0_0_1px_hsla(268,70%,65%,0.28),0_10px_32px_-8px_hsla(268,80%,58%,0.7)]',
          'transition-shadow duration-300',
        ),
        /** Soft surface + same rim */
        outline: cn(
          'text-foreground',
          'bg-[linear-gradient(hsl(var(--background)),hsl(var(--background))),linear-gradient(90deg,var(--spectrum-1),var(--spectrum-2),var(--spectrum-3),var(--spectrum-4),var(--spectrum-5),var(--spectrum-1))]',
          'shadow-[0_0_0_1px_hsla(268,50%,50%,0.12),0_6px_22px_-12px_hsla(268,70%,50%,0.4)]',
        ),
      },
      size: {
        default: 'h-10 px-6 py-2.5',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: {
      variant: 'solid',
      size: 'default',
    },
  },
);

interface SpectrumButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof spectrumButtonVariants> {
  asChild?: boolean;
}

const SpectrumButton = React.forwardRef<HTMLButtonElement, SpectrumButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        data-slot="spectrum-button"
        className={cn(spectrumButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

SpectrumButton.displayName = 'SpectrumButton';

export { SpectrumButton, spectrumButtonVariants, type SpectrumButtonProps };
