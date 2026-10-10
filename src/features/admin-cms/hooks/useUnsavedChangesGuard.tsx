import React from 'react';
import { useBlocker } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog';
import { buttonVariants } from '@/shared/ui/button';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { cn } from '@/shared/lib/utils';

/**
 * Blocks in-app navigation (data router) + tab close/refresh when `isDirty`.
 * Call `allowNextNavigation()` right before an intentional leave (e.g. after save).
 * Render `dialog` once in the editor page.
 */
export function useUnsavedChangesGuard(isDirty: boolean) {
  const language = useLanguageStore((s) => s.language);
  const fr = language === 'fr';
  const allowNextRef = React.useRef(false);

  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    if (allowNextRef.current) return false;
    return isDirty && currentLocation.pathname !== nextLocation.pathname;
  });

  React.useEffect(() => {
    if (!isDirty) allowNextRef.current = false;
  }, [isDirty]);

  React.useEffect(() => {
    if (!isDirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [isDirty]);

  const allowNextNavigation = React.useCallback(() => {
    allowNextRef.current = true;
  }, []);

  const dialog = (
    <AlertDialog
      open={blocker.state === 'blocked'}
      onOpenChange={(open) => {
        if (!open && blocker.state === 'blocked') blocker.reset?.();
      }}
    >
      <AlertDialogContent className="border-border/70 shadow-xs">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {fr ? 'Modifications non enregistrées' : 'Unsaved changes'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {fr
              ? 'Tu as des changements non sauvegardés. Si tu quittes maintenant, ils seront perdus.'
              : 'You have unsaved changes. If you leave now, they will be lost.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer" onClick={() => blocker.reset?.()}>
            {fr ? 'Rester' : 'Stay'}
          </AlertDialogCancel>
          <AlertDialogAction
            className={cn(buttonVariants({ variant: 'destructive' }), 'cursor-pointer')}
            onClick={(event) => {
              event.preventDefault();
              blocker.proceed?.();
            }}
          >
            {fr ? 'Quitter sans enregistrer' : 'Leave without saving'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return { dialog, allowNextNavigation };
}

/**
 * Track dirty state against a baseline set on hydrate / after successful save.
 */
export function useDraftDirtyFlag<T>(draft: T) {
  const baselineRef = React.useRef<string | null>(null);
  const [, bump] = React.useState(0);

  const resetBaseline = React.useCallback((nextDraft: T) => {
    baselineRef.current = JSON.stringify(nextDraft);
    bump((n) => n + 1);
  }, []);

  const markClean = React.useCallback(
    (nextDraft?: T) => {
      baselineRef.current = JSON.stringify(nextDraft ?? draft);
      bump((n) => n + 1);
    },
    [draft],
  );

  const isDirty =
    baselineRef.current !== null && JSON.stringify(draft) !== baselineRef.current;

  return { isDirty, markClean, resetBaseline };
}
