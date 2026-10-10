import React, { useId, useState } from 'react';
import { cn } from '@/shared/lib/utils';

type FloatingFillFieldProps = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  name?: string;
  type?: string;
  multiline?: boolean;
  rows?: number;
  invalid?: boolean;
  className?: string;
};

/**
 * Homemade field: faint frame, visible bottom rail, floating label,
 * bottom accent rises into a soft primary fill on focus / filled.
 */
export const FloatingFillField = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  FloatingFillFieldProps
>(function FloatingFillField(
  {
    label,
    value,
    onChange,
    onBlur,
    onFocus,
    name,
    type = 'text',
    multiline = false,
    rows = 4,
    invalid = false,
    className,
  },
  ref,
) {
  const uid = useId();
  const [focused, setFocused] = useState(false);
  const hasValue = value.trim().length > 0;
  const floated = focused || hasValue;

  const fieldClass = cn(
    'relative z-20 w-full bg-transparent px-3 text-sm text-foreground',
    'border-0 outline-none ring-0 shadow-none',
    'focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0',
    'placeholder:text-transparent caret-primary',
    // Keep dark/light theme when the browser paints autofill yellow/blue.
    '[&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_hsl(var(--card))]',
    '[&:-webkit-autofill]:[-webkit-text-fill-color:hsl(var(--foreground))]',
    '[&:-webkit-autofill]:[transition:background-color_9999s_ease-out_0s]',
    multiline ? 'min-h-[7.5rem] resize-none pt-5 pb-3' : 'h-12 pt-4 pb-2',
  );

  return (
    <div className={cn('relative pt-2.5', className)}>
      {/* Rising fill - grows from the bottom rail */}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-x-0 bottom-0 z-0 rounded-sm',
          'bg-primary/12 dark:bg-primary/18',
          'transition-[height,opacity,background-color] duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
          floated ? 'h-[calc(100%-0.625rem)] opacity-100' : 'h-[2px] opacity-95',
          invalid && floated && 'bg-destructive/12 dark:bg-destructive/16',
        )}
      />

      {/* Ultra-faint frame */}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-x-0 bottom-0 top-2.5 z-10 rounded-sm border',
          'transition-colors duration-500 ease-out',
          floated
            ? invalid
              ? 'border-destructive/35'
              : 'border-primary/28'
            : 'border-border/20 dark:border-border/25',
        )}
      />

      {/* Always-visible bottom rail (source of the rise) */}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[2px] rounded-full',
          'transition-colors duration-500 ease-out',
          floated
            ? invalid
              ? 'bg-destructive'
              : 'bg-primary'
            : 'bg-primary/55 dark:bg-primary/50',
        )}
      />

      <label
        htmlFor={uid}
        className={cn(
          'pointer-events-none absolute z-40 select-none capitalize tracking-wide',
          'left-3 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          floated
            ? cn(
                'top-0 px-1.5 text-[10px] font-semibold leading-none',
                // Notch sits on the top border line
                'bg-card text-primary',
                invalid && 'text-destructive',
              )
            : cn(
                'top-[calc(0.625rem+1.5rem)] -translate-y-1/2',
                'text-[12px] font-medium text-muted-foreground/80',
              ),
        )}
      >
        {label}
      </label>

      {multiline ? (
        <textarea
          id={uid}
          name={name}
          ref={ref as React.Ref<HTMLTextAreaElement>}
          rows={rows}
          value={value}
          onChange={onChange}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          className={fieldClass}
          aria-invalid={invalid || undefined}
        />
      ) : (
        <input
          id={uid}
          name={name}
          type={type}
          ref={ref as React.Ref<HTMLInputElement>}
          value={value}
          onChange={onChange}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          className={fieldClass}
          aria-invalid={invalid || undefined}
        />
      )}
    </div>
  );
});
