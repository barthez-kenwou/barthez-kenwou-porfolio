import * as React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

type InputProps = React.ComponentProps<'input'>;

function parseStep(step: InputProps['step']): number {
  if (typeof step === 'number') return step > 0 ? step : 1;
  if (typeof step === 'string' && step !== 'any') {
    const n = Number(step);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return 1;
}

function clampNumber(value: number, min?: number, max?: number) {
  let next = value;
  if (min !== undefined && Number.isFinite(min)) next = Math.max(min, next);
  if (max !== undefined && Number.isFinite(max)) next = Math.min(max, next);
  return next;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, type, ...props },
  ref,
) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const setRefs = (node: HTMLInputElement | null) => {
    inputRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  if (type === 'number') {
    const { value, defaultValue, onChange, min, max, step, disabled, readOnly, ...rest } = props;

    const stepNum = parseStep(step);
    const minNum = min === undefined || min === '' ? undefined : Number(min);
    const maxNum = max === undefined || max === '' ? undefined : Number(max);

    const nudge = (direction: 1 | -1) => {
      const el = inputRef.current;
      if (!el || disabled || readOnly) return;
      const raw = value !== undefined ? String(value) : el.value;
      const current = raw === '' ? 0 : Number(raw);
      const base = Number.isFinite(current) ? current : 0;
      const next = clampNumber(base + direction * stepNum, minNum, maxNum);
      const nextStr = String(next);

      if (onChange) {
        const event = {
          target: { value: nextStr },
          currentTarget: { value: nextStr },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
        return;
      }

      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )?.set;
      setter?.call(el, nextStr);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    };

    return (
      <div className={cn('relative w-full', className)}>
        <input
          ref={setRefs}
          type="number"
          data-slot="input"
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          readOnly={readOnly}
          className={cn(
            'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-sm border bg-transparent py-1 pr-9 pl-3 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            'focus-visible:border-primary/50 focus-visible:ring-0',
            'aria-invalid:border-destructive',
            '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
          )}
          {...rest}
        />
        <div className="absolute top-1 right-1 bottom-1 flex w-7 flex-col overflow-hidden rounded-[3px] border border-border/55 bg-muted/35">
          <button
            type="button"
            tabIndex={-1}
            disabled={disabled || readOnly}
            onClick={() => nudge(1)}
            className="flex flex-1 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:bg-primary/15 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Increment"
          >
            <ChevronUp className="size-3" strokeWidth={2.25} />
          </button>
          <div className="h-px bg-border/50" aria-hidden />
          <button
            type="button"
            tabIndex={-1}
            disabled={disabled || readOnly}
            onClick={() => nudge(-1)}
            className="flex flex-1 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:bg-primary/15 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Decrement"
          >
            <ChevronDown className="size-3" strokeWidth={2.25} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-sm border bg-transparent px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-primary/50 focus-visible:ring-0',
        'aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };
