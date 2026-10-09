import React from 'react';
import { Loader2, Send, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  AdminPageHeader,
  AdminDataTable,
  AdminSectionCard,
  ConfirmDeleteDialog,
  BilingualField,
  Field,
} from '@/features/admin-cms';
import {
  useNewsletterStats,
  useNewsletterSubscribers,
  useDeleteNewsletterSubscriber,
  useBroadcastNewsletter,
  type NewsletterSubscriber,
  type NewsletterBroadcastPayload,
} from '@/features/newsletter';
import { isApiError } from '@/shared/api';
import { QueryState } from '@/shared/ui/QueryState';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Badge } from '@/shared/ui/badge';

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
});

export const AdminNewsletterPage: React.FC = () => {
  const { language } = useLanguageStore();
  const fr = language === 'fr';
  const statsQuery = useNewsletterStats();
  const subscribersQuery = useNewsletterSubscribers();
  const remove = useDeleteNewsletterSubscriber();
  const broadcast = useBroadcastNewsletter();
  const [form, setForm] = React.useState(emptyBroadcast());
  const [pending, setPending] = React.useState<NewsletterSubscriber | null>(null);

  const stats = statsQuery.data;
  const subscribers = subscribersQuery.data?.items ?? [];

  const sendBroadcast = async () => {
    if (
      !form.subjectFr.trim() ||
      !form.subjectEn.trim() ||
      !form.headlineFr.trim() ||
      !form.headlineEn.trim() ||
      !form.bodyFr.trim() ||
      !form.bodyEn.trim()
    ) {
      toast.error(fr ? 'Sujet, titre et corps FR/EN requis' : 'Subject, headline and body FR/EN required');
      return;
    }
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
    };
    try {
      await broadcast.mutateAsync(payload);
      toast.success(fr ? 'Campagne envoyée' : 'Campaign sent');
      setForm(emptyBroadcast());
    } catch (e) {
      toast.error(isApiError(e) ? e.message : fr ? 'Échec de l’envoi' : 'Send failed');
    }
  };

  const confirmDelete = async () => {
    if (!pending) return;
    try {
      await remove.mutateAsync(pending.id);
      toast.success(fr ? 'Abonné supprimé' : 'Subscriber deleted');
      setPending(null);
    } catch (e) {
      toast.error(isApiError(e) ? e.message : fr ? 'Échec de la suppression' : 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Newsletter" />

      <QueryState
        isPending={statsQuery.isPending}
        isError={statsQuery.isError}
        errorMessage={isApiError(statsQuery.error) ? statsQuery.error.message : undefined}
      >
        <section className="grid gap-px overflow-hidden rounded-xl border border-border/70 bg-border/70 grid-cols-2 lg:grid-cols-5">
          {[
            { label: fr ? 'Total' : 'Total', value: stats?.total ?? 0 },
            { label: fr ? 'En attente' : 'Pending', value: stats?.pending ?? 0 },
            { label: fr ? 'Actifs' : 'Active', value: stats?.active ?? 0 },
            { label: fr ? 'Désabonnés' : 'Unsubscribed', value: stats?.unsubscribed ?? 0 },
            { label: fr ? 'Bounced' : 'Bounced', value: stats?.bounced ?? 0 },
          ].map((item) => (
            <div key={item.label} className="bg-card px-4 py-4 sm:px-5 sm:py-5">
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {item.label}
              </p>
              <p className="mt-2 text-xl font-semibold tabular-nums tracking-tight sm:text-2xl">
                {item.value}
              </p>
            </div>
          ))}
        </section>
      </QueryState>

      <AdminSectionCard
        title={fr ? 'Diffuser une campagne' : 'Broadcast campaign'}
        actions={
          <Button size="sm" onClick={() => void sendBroadcast()} disabled={broadcast.isPending}>
            {broadcast.isPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Send className="size-3.5" />
            )}
            {fr ? 'Envoyer' : 'Send'}
          </Button>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
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
                rows={6}
                value={form.bodyFr}
                onChange={(e) => setForm({ ...form, bodyFr: e.target.value })}
              />
            </Field>
            <Field label={fr ? 'Corps EN' : 'Body EN'} required>
              <Textarea
                rows={6}
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
          <Field label="CTA URL">
            <Input
              value={form.ctaUrl || ''}
              onChange={(e) => setForm({ ...form, ctaUrl: e.target.value })}
              placeholder="https://"
            />
          </Field>
          <BilingualField
            label={fr ? 'Label CTA' : 'CTA label'}
            valueFr={form.ctaLabelFr || ''}
            valueEn={form.ctaLabelEn || ''}
            onChangeFr={(v) => setForm({ ...form, ctaLabelFr: v })}
            onChangeEn={(v) => setForm({ ...form, ctaLabelEn: v })}
          />
        </div>
      </AdminSectionCard>

      <QueryState
        isPending={subscribersQuery.isPending}
        isError={subscribersQuery.isError}
        errorMessage={
          isApiError(subscribersQuery.error) ? subscribersQuery.error.message : undefined
        }
        empty={!subscribersQuery.isPending && !subscribersQuery.isError && subscribers.length === 0}
        emptyTitle={fr ? 'Aucun abonné' : 'No subscribers'}
      >
        <AdminDataTable
          data={subscribers}
          getRowId={(r) => r.id}
          searchKeys={['email', 'status', 'locale', 'source']}
          emptyTitle={fr ? 'Aucun abonné' : 'No subscribers'}
          columns={[
            {
              key: 'email',
              header: 'Email',
              render: (r) => <span className="font-medium">{r.email}</span>,
            },
            {
              key: 'status',
              header: 'Status',
              render: (r) => <Badge variant="secondary">{r.status}</Badge>,
            },
            {
              key: 'locale',
              header: 'Locale',
              hideOnMobile: true,
              render: (r) => r.locale || '·',
            },
            {
              key: 'source',
              header: 'Source',
              hideOnMobile: true,
              render: (r) => r.source || '·',
            },
            {
              key: 'createdAt',
              header: fr ? 'Inscrit' : 'Joined',
              render: (r) =>
                r.createdAt
                  ? new Date(r.createdAt).toLocaleDateString(fr ? 'fr-FR' : 'en-US')
                  : '·',
            },
          ]}
          actions={(r) => (
            <Button size="icon-sm" variant="ghost" onClick={() => setPending(r)}>
              <Trash2 className="size-3.5 text-destructive" />
            </Button>
          )}
        />
      </QueryState>

      <ConfirmDeleteDialog
        open={!!pending}
        onOpenChange={(o) => !o && setPending(null)}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
};
