import {
  AlertTriangle,
  Check,
  CircleAlert,
  Info,
  Loader2,
} from 'lucide-react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';
import { useThemeStore } from '@/shared/state/useThemeStore';

/**
 * Global toast surface — bottom-anchored, quiet chrome, no richColors fill.
 * Status is a thin accent + muted icon; body stays foreground for readability.
 */
export function Toaster({
  position = 'bottom-center',
  richColors = false,
  closeButton = true,
  expand = false,
  visibleToasts = 2,
  duration = 3400,
  gap = 8,
  // Desktop: sit clear of page chrome
  offset = { bottom: '1.5rem', left: '1rem', right: '1rem' },
  // Mobile: clear public/admin bottom docks + a little air + safe area
  mobileOffset = {
    bottom: 'calc(5.25rem + env(safe-area-inset-bottom, 0px))',
    left: '0.85rem',
    right: '0.85rem',
  },
  ...props
}: ToasterProps) {
  const theme = useThemeStore((s) => s.theme);

  return (
    <Sonner
      theme={theme === 'dark' ? 'dark' : 'light'}
      position={position}
      richColors={richColors}
      closeButton={closeButton}
      expand={expand}
      visibleToasts={visibleToasts}
      duration={duration}
      gap={gap}
      offset={offset}
      mobileOffset={mobileOffset}
      className="toaster group"
      icons={{
        success: <Check className="size-3.5 shrink-0" strokeWidth={2.25} aria-hidden />,
        info: <Info className="size-3.5 shrink-0" strokeWidth={2.25} aria-hidden />,
        warning: <AlertTriangle className="size-3.5 shrink-0" strokeWidth={2.25} aria-hidden />,
        error: <CircleAlert className="size-3.5 shrink-0" strokeWidth={2.25} aria-hidden />,
        loading: <Loader2 className="size-3.5 shrink-0 animate-spin" strokeWidth={2.25} aria-hidden />,
      }}
      toastOptions={{
        classNames: {
          toast: 'bk-toast',
          title: 'bk-toast__title',
          description: 'bk-toast__description',
          icon: 'bk-toast__icon',
          closeButton: 'bk-toast__close',
          actionButton: 'bk-toast__action',
          cancelButton: 'bk-toast__cancel',
          success: 'bk-toast--success',
          error: 'bk-toast--error',
          warning: 'bk-toast--warning',
          info: 'bk-toast--info',
          loading: 'bk-toast--loading',
        },
      }}
      {...props}
    />
  );
}
