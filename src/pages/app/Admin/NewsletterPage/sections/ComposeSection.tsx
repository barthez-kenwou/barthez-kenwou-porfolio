import React from 'react';
import { Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import {
  AdminSectionCard,
  AdminStickyActions,
  BilingualField,
  Field,
} from '@/features/admin-cms';
import {
  useBroadcastNewsletter,
  useNewsletterStats,
  type NewsletterBroadcastPayload,
} from '@/features/newsletter';
import { isApiError } from '@/shared/api';
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
import { Button, buttonVariants } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Textarea } from '@/shared/ui/textarea';
import { cn } from '@/shared/lib/utils';

const emptyBroadcast = (): NewsletterBroadcastPayload => ({
  subjectFr: '',
  subjectEn: '',
  headlineFr: '',
  headlineEn: '',
  bodyFr: '',
  bodyEn: '',
  previewFr: '',
  previewEn: '',
  ctaUrl: '',
  ctaLabelFr: '',
  ctaLabelEn: '',
  locale: undefined,
});

type Props = {
  fr: boolean;
  onSent?: () => void;
};

export function ComposeSection({ fr, onSent }: Props) {
  const statsQuery = useNewsletterStats();
  const broadcast = useBroadcastNewsletter();
  const [form, setForm] = React.useState(emptyBroadcast());
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const activeCount = statsQuery.data?.active ?? 0;
  const audienceLabel =
    form.locale === 'fr'
      ? fr
        ? 'abonnés actifs FR'
        : 'active FR subscribers'
      : form.locale === 'en'
        ? fr
          ? 'abonnés actifs EN'
          : 'active EN subscribers'
        : fr
          ? 'abonnés actifs'
          : 'active subscribers';

  const validate = (): boolean => {
    if (
      !form.subjectFr.trim() ||
      !form.subjectEn.trim() ||
      !form.headlineFr.trim() ||
      !form.headlineEn.trim() ||
      !form.bodyFr.trim() ||
      !form.bodyEn.trim()
    ) {
      toast.error(
        fr ? 'Sujet, titre et corps FR/EN requis' : 'Subject, headline and body FR/EN required',
      );
      return false;
    }
    return true;
  };

  const openConfirm = () => {
    if (!validate()) return;
    setConfirmOpen(true);
  };

  const sendBroadcast = async () => {
    const payload: NewsletterBroadcastPayload = {
      subjectFr: form.subjectFr.trim(),
      subjectEn: form.subjectEn.trim(),
      headlineFr: form.headlineFr.trim(),
      headlineEn: form.headlineEn.trim(),
      bodyFr: form.bodyFr.trim(),
      bodyEn: form.bodyEn.trim(),
      previewFr: form.previewFr?.trim() || undefined,
      previewEn: form.previewEn?.trim() || undefined,
      ctaUrl: form.ctaUrl?.trim() || undefined,
      ctaLabelFr: form.ctaLabelFr?.trim() || undefined,
      ctaLabelEn: form.ctaLabelEn?.trim() || undefined,
      locale: form.locale,
    };
    try {
      await broadcast.mutateAsync(payload);
      toast.success(fr ? 'Campagne mise en file' : 'Campaign queued');
      setForm(emptyBroadcast());
      setConfirmOpen(false);
      onSent?.();
    } catch (e) {
      toast.error(isApiError(e) ? e.message : fr ? 'Échec de l’envoi' : 'Send failed');
    }
  };

  const sendButton = (
    <Button
      type="button"
      className="cursor-pointer flex-1 md:flex-none"
      onClick={openConfirm}
      disabled={broadcast.isPending}
    >
      {broadcast.isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Send className="size-4" />
      )}
      {fr ? 'Préparer l’envoi' : 'Prepare send'}
    </Button>
  );

  return (
    <div className="space-y-4 pb-20 md:pb-0">
      <AdminStickyActions className="md:justify-end">{sendButton}</AdminStickyActions>

      <AdminSectionCard
        title={fr ? 'Composer une diffusion' : 'Compose broadcast'}
        description={
          fr
            ? `Envoi bilingue vers les abonnés actifs. Segment optionnel par locale.`
            : `Bilingual send to active subscribers. Optional locale segment.`
        }
      >
        <div className="mb-4 rounded-lg border border-border/60 bg-muted/15 px-3 py-2.5 text-sm">
          <p className="font-medium">
            {fr ? 'Audience estimée' : 'Estimated audience'}
          </p>
          <p className="mt-0.5 text-muted-foreground">
            {fr
              ? `${activeCount} abonné${activeCount > 1 ? 's' : ''} actif${activeCount > 1 ? 's' : ''} au total. Le segment locale (si choisi) sera appliqué côté serveur.`
              : `${activeCount} active subscriber${activeCount === 1 ? '' : 's'} total. Locale segment (if set) is applied server-side.`}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label={fr ? 'Segment locale' : 'Locale segment'}>
            <Select
              value={form.locale ?? 'all'}
              onValueChange={(v) =>
                setForm({
                  ...form,
                  locale: v === 'all' ? undefined : (v as 'fr' | 'en'),
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {fr ? 'Tous les actifs' : 'All active'}
                </SelectItem>
                <SelectItem value="fr">FR uniquement</SelectItem>
                <SelectItem value="en">EN only</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="CTA URL">
            <Input
              value={form.ctaUrl || ''}
              onChange={(e) => setForm({ ...form, ctaUrl: e.target.value })}
              placeholder="https://"
            />
          </Field>

          <BilingualField
            label={fr ? 'Sujet' : 'Subject'}
            required
            valueFr={form.subjectFr}
            valueEn={form.subjectEn}
            onChangeFr={(v) => setForm({ ...form, subjectFr: v })}
            onChangeEn={(v) => setForm({ ...form, subjectEn: v })}
          />
          <BilingualField
            label={fr ? 'Titre' : 'Headline'}
            required
            valueFr={form.headlineFr}
            valueEn={form.headlineEn}
            onChangeFr={(v) => setForm({ ...form, headlineFr: v })}
            onChangeEn={(v) => setForm({ ...form, headlineEn: v })}
          />
          <div className="md:col-span-2 grid gap-4 md:grid-cols-2">
            <Field label={fr ? 'Corps FR' : 'Body FR'} required>
              <Textarea
                rows={7}
                value={form.bodyFr}
                onChange={(e) => setForm({ ...form, bodyFr: e.target.value })}
              />
            </Field>
            <Field label={fr ? 'Corps EN' : 'Body EN'} required>
              <Textarea
                rows={7}
                value={form.bodyEn}
                onChange={(e) => setForm({ ...form, bodyEn: e.target.value })}
              />
            </Field>
          </div>
          <BilingualField
            label={fr ? 'Preview (optionnel)' : 'Preview (optional)'}
            valueFr={form.previewFr || ''}
            valueEn={form.previewEn || ''}
            onChangeFr={(v) => setForm({ ...form, previewFr: v })}
            onChangeEn={(v) => setForm({ ...form, previewEn: v })}
          />
          <BilingualField
            label={fr ? 'Label CTA' : 'CTA label'}
            valueFr={form.ctaLabelFr || ''}
            valueEn={form.ctaLabelEn || ''}
            onChangeFr={(v) => setForm({ ...form, ctaLabelFr: v })}
            onChangeEn={(v) => setForm({ ...form, ctaLabelEn: v })}
          />
        </div>
      </AdminSectionCard>

      <AlertDialog
        open={confirmOpen}
        onOpenChange={(next) => {
          if (!broadcast.isPending) setConfirmOpen(next);
        }}
      >
        <AlertDialogContent className="border-border/70 shadow-xs">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {fr ? 'Confirmer la diffusion ?' : 'Confirm broadcast?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {fr
                ? `La campagne sera mise en file et envoyée aux ${audienceLabel}. Cette action ne peut pas être annulée une fois l’envoi démarré.`
                : `The campaign will be queued and sent to ${audienceLabel}. It cannot be cancelled once sending has started.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={broadcast.isPending}>
              {fr ? 'Retour' : 'Back'}
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={broadcast.isPending}
              className={cn(buttonVariants())}
              onClick={(event) => {
                event.preventDefault();
                void sendBroadcast();
              }}
            >
              {broadcast.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {fr ? 'Envoi…' : 'Sending…'}
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  {fr ? 'Envoyer maintenant' : 'Send now'}
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
