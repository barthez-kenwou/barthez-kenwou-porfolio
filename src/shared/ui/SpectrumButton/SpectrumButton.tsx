import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Brand CTA.
 * - solid: brand fill, no motion
 * - outline: quiet secondary
 * - spectrum: disciplined violet→indigo rim (slow continuous + hover sheen)
 */
const spectrumButtonVariants = cva(
  cn(
    'relative isolate cursor-pointer group overflow-visible',
    'inline-flex items-center justify-center gap-2 shrink-0',
    'rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-primary/40',
    'text-sm font-semibold whitespace-nowrap',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg:not([class*=size-])]:size-4 [&_svg]:shrink-0',
    'transition-[box-shadow,transform,filter] duration-300',
  ),
  {
    variants: {
      variant: {
        solid: cn(
          'bg-brand text-brand-foreground',
          'hover:bg-brand-hover',
          'border border-transparent',
          'shadow-none',
        ),
        outline: cn(
          'bg-background text-foreground',
          'border border-border',
          'hover:border-primary/40 hover:bg-accent/40',
          'shadow-none',
        ),
        spectrum: cn(
          'text-white',
          '[border:2px_solid_transparent]',
          '[background-origin:border-box]',
          '[background-clip:padding-box,border-box]',
          'bg-[length:220%_100%]',
          // Deep ink / brand fill + disciplined violet→indigo rim (no cyan/magenta/gold)
          'bg-[linear-gradient(#16101f,#120c1a),linear-gradient(105deg,var(--spectrum-from),var(--spectrum-sheen)_42%,var(--spectrum-to),var(--spectrum-from))]',
          'dark:bg-[linear-gradient(#1f1233,#160e28),linear-gradient(105deg,var(--spectrum-from),var(--spectrum-sheen)_42%,var(--spectrum-to),var(--spectrum-from))]',
          'animate-[spectrum-sweep_7.5s_ease-in-out_infinite]',
          'shadow-[0_0_0_1px_hsla(265,50%,40%,0.22),0_10px_28px_-14px_hsla(265,58%,39%,0.55)]',
          'hover:shadow-[0_0_0_1px_hsla(265,55%,50%,0.35),0_14px_34px_-12px_hsla(265,58%,39%,0.7)]',
          'hover:brightness-[1.04]',
          'active:scale-[0.985]',
          'motion-reduce:animate-none',
          // Soft brand underglow — single hue, restrained
          'before:pointer-events-none before:absolute before:inset-x-[18%] before:-bottom-[28%] before:z-[-1]',
          'before:h-[45%] before:rounded-full before:blur-2xl',
          'before:bg-[radial-gradient(ellipse_at_center,hsla(265,58%,39%,0.55),transparent_70%)]',
          'before:opacity-70 before:transition-opacity before:duration-300',
          'hover:before:opacity-95',
          'motion-reduce:before:hidden',
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
