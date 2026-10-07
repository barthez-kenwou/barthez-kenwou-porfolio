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
import { Loader2 } from 'lucide-react';

export type ConfirmDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  onConfirm: () => void;
  loading?: boolean;
};

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  loading = false,
}: ConfirmDeleteDialogProps) {
  const language = useLanguageStore((s) => s.language);
  const isFr = language === 'fr';
  const resolvedTitle = title || (isFr ? 'Supprimer définitivement ?' : 'Delete permanently?');
  const resolvedDescription =
    description ||
    (isFr
      ? 'Cette action est irréversible dans le CMS local.'
      : 'This action cannot be undone in the local CMS.');

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (!loading) onOpenChange(next);
      }}
    >
      <AlertDialogContent className="border-border/70 shadow-xs">
        <AlertDialogHeader>
          <AlertDialogTitle>{resolvedTitle}</AlertDialogTitle>
          <AlertDialogDescription>{resolvedDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>{isFr ? 'Annuler' : 'Cancel'}</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className={cn(buttonVariants({ variant: 'destructive' }))}
            onClick={(event) => {
              event.preventDefault();
              onConfirm();
            }}
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                {isFr ? 'Suppression…' : 'Deleting…'}
              </>
            ) : isFr ? (
              'Supprimer'
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
