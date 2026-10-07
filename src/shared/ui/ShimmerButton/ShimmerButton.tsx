import React, { type ComponentPropsWithoutRef, type CSSProperties } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

export interface ShimmerButtonProps extends ComponentPropsWithoutRef<'button'> {
  shimmerColor?: string;
  borderWidth?: number;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
  asChild?: boolean;
}

/**
 * Secondary CTA - light travels on the border only (mask-composite ring).
 * The button face stays opaque; the beam never washes over the surface.
 */
export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = 'hsla(268, 78%, 78%, 1)',
      borderWidth = 1.5,
      shimmerDuration = '2.6s',
      borderRadius = '0.375rem',
      background,
      className,
      children,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const face = background ?? 'hsl(var(--card))';

    const shellClassName = cn(
      'group relative inline-flex cursor-pointer items-center justify-center overflow-hidden',
      'whitespace-nowrap text-sm font-semibold text-foreground',
      'transform-gpu transition-[transform,box-shadow] duration-300 ease-out',
      'active:translate-y-px',
      'hover:shadow-[0_0_22px_-10px_hsla(268,70%,55%,0.4)]',
      className,
    );

    const shellStyle = {
      '--shimmer-color': shimmerColor,
      '--speed': shimmerDuration,
      '--bw': `${borderWidth}px`,
      borderRadius,
      // Fully opaque face - prevents any beam bleed-through
      background: face,
    } as CSSProperties;

    const label =
      asChild && React.isValidElement<{ children?: React.ReactNode }>(children)
        ? children.props.children
        : children;

    const effects = (
      <>
        {/*
          Mask ring: only the padding band is paintable.
          Spinner lives inside - face of the button never receives light.
        */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            borderRadius,
            padding: borderWidth,
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
          }}
        >
          <span
            className="animate-shimmer-orbit absolute left-1/2 top-1/2 aspect-square w-[240%]"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0deg, transparent 310deg, var(--shimmer-color) 338deg, #fff 350deg, var(--shimmer-color) 360deg)',
            }}
          />
        </span>

        {/* Quiet resting rim between beam passes */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit]"
          style={{
            boxShadow: `inset 0 0 0 ${borderWidth}px hsla(268, 45%, 62%, 0.2)`,
          }}
        />

        <span className="relative z-[2] inline-flex items-center gap-2 px-5 py-2.5">{label}</span>
      </>
    );

    if (asChild && React.isValidElement(children)) {
      return (
        <Slot ref={ref} style={shellStyle} className={shellClassName} {...props}>
          {React.cloneElement(children, undefined, effects)}
        </Slot>
      );
    }

    return (
      <button ref={ref} type="button" style={shellStyle} className={shellClassName} {...props}>
        {effects}
      </button>
    );
  },
);

ShimmerButton.displayName = 'ShimmerButton';
