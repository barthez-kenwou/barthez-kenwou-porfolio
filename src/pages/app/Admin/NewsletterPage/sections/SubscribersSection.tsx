import React from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  AdminDataTable,
  AdminSectionCard,
  ConfirmDeleteDialog,
} from '@/features/admin-cms';
import {
  useDeleteNewsletterSubscriber,
  useNewsletterSubscribers,
  type NewsletterSubscriber,
} from '@/features/newsletter';
import { isApiError } from '@/shared/api';
import { QueryState } from '@/shared/ui/QueryState';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/shared/ui/sheet';
import { useIsMobile } from '@/shared/hooks/use-mobile';
import {
  formatDate,
  subscriberStatusLabel,
  subscriberStatusVariant,
} from '../lib/labels';

type Props = { fr: boolean };

function SubscriberDetail({ row, fr }: { row: NewsletterSubscriber; fr: boolean }) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5">
        <p className="text-sm font-medium break-all">{row.email}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Badge variant={subscriberStatusVariant(row.status)}>
            {subscriberStatusLabel(row.status, fr)}
          </Badge>
          {row.locale ? <Badge variant="outline">{row.locale.toUpperCase()}</Badge> : null}
          {row.source ? <Badge variant="secondary">{row.source}</Badge> : null}
        </div>
      </div>

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        {(
          [
            [fr ? 'Inscrit le' : 'Joined', formatDate(row.createdAt, fr)],
            [fr ? 'Confirmé' : 'Confirmed', formatDate(row.confirmedAt, fr)],
            [fr ? 'Bienvenue envoyée' : 'Welcome sent', formatDate(row.welcomeSentAt, fr)],
            [fr ? 'Dernier email' : 'Last emailed', formatDate(row.lastEmailedAt, fr)],
            [fr ? 'Désabonné' : 'Unsubscribed', formatDate(row.unsubscribedAt, fr)],
            [fr ? 'Mis à jour' : 'Updated', formatDate(row.updatedAt, fr)],
          ] as const
        ).map(([label, value]) => (
          <div key={label} className="rounded-lg border border-border/50 px-3 py-2">
            <dt className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              {label}
            </dt>
            <dd className="mt-1 font-medium">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function SubscribersSection({ fr }: Props) {
  const isMobile = useIsMobile();
  const subscribersQuery = useNewsletterSubscribers();
  const remove = useDeleteNewsletterSubscriber();
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState<NewsletterSubscriber | null>(null);

  const subscribers = subscribersQuery.data?.items ?? [];
  const selected = subscribers.find((s) => s.id === selectedId) ?? null;
  const total = subscribersQuery.data?.totalItems ?? subscribers.length;

  const confirmDelete = async () => {
    if (!pending) return;
    try {
      await remove.mutateAsync(pending.id);
      if (selectedId === pending.id) setSelectedId(null);
      toast.success(fr ? 'Abonné désabonné' : 'Subscriber unsubscribed');
      setPending(null);
    } catch (e) {
      toast.error(isApiError(e) ? e.message : fr ? 'Échec de la suppression' : 'Delete failed');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold tracking-tight">
            {fr ? 'Abonnés' : 'Subscribers'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {fr
              ? `${total} contact${total > 1 ? 's' : ''} · recherche et filtres locaux`
              : `${total} contact${total === 1 ? '' : 's'} · local search & filters`}
          </p>
        </div>
      </div>

      <QueryState
        isPending={subscribersQuery.isPending}
        isError={subscribersQuery.isError}
        errorMessage={
          isApiError(subscribersQuery.error) ? subscribersQuery.error.message : undefined
        }
      >
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <AdminDataTable
            data={subscribers}
            getRowId={(r) => r.id}
            searchKeys={['email', 'status', 'locale', 'source']}
            searchPlaceholder={fr ? 'Email, statut, source…' : 'Email, status, source…'}
            emptyTitle={fr ? 'Aucun abonné' : 'No subscribers'}
            onRowClick={(r) => setSelectedId(r.id)}
            filters={[
              {
                key: 'status',
                label: 'Status',
                options: (
                  ['pending', 'active', 'unsubscribed', 'bounced'] as const
                ).map((s) => ({
                  value: s,
                  label: subscriberStatusLabel(s, fr),
                })),
              },
              {
                key: 'locale',
                label: 'Locale',
                options: [
                  { value: 'fr', label: 'FR' },
                  { value: 'en', label: 'EN' },
                ],
              },
            ]}
            columns={[
              {
                key: 'email',
                header: 'Email',
                render: (r) => <span className="font-medium break-all">{r.email}</span>,
              },
              {
                key: 'status',
                header: 'Status',
                render: (r) => (
                  <Badge variant={subscriberStatusVariant(r.status)}>
                    {subscriberStatusLabel(r.status, fr)}
                  </Badge>
                ),
              },
              {
                key: 'locale',
                header: 'Locale',
                hideOnMobile: true,
                render: (r) => (r.locale ? r.locale.toUpperCase() : '·'),
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
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  setPending(r);
                }}
              >
                <Trash2 className="size-3.5 text-destructive" />
              </Button>
            )}
          />

          <AdminSectionCard
            title={selected ? selected.email : fr ? 'Détail' : 'Detail'}
            className="hidden lg:sticky lg:top-4 lg:block lg:self-start"
          >
            {!selected ? (
              <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/15 px-6 text-center text-sm text-muted-foreground">
                {fr
                  ? 'Sélectionne un abonné pour voir le détail.'
                  : 'Select a subscriber to inspect details.'}
              </div>
            ) : (
              <SubscriberDetail row={selected} fr={fr} />
            )}
          </AdminSectionCard>
        </div>
      </QueryState>

      <Sheet
        open={isMobile && !!selected}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null);
        }}
      >
        <SheetContent
          side="bottom"
          className="flex max-h-[88dvh] flex-col rounded-t-2xl pb-[max(1rem,env(safe-area-inset-bottom))]"
        >
          <SheetHeader className="text-left">
            <SheetTitle className="pr-8 text-base leading-snug break-all">
              {selected?.email}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 min-h-0 flex-1 overflow-y-auto">
            {selected ? <SubscriberDetail row={selected} fr={fr} /> : null}
          </div>
        </SheetContent>
      </Sheet>

      <ConfirmDeleteDialog
        open={!!pending}
        onOpenChange={(o) => !o && setPending(null)}
        title={fr ? 'Désabonner ce contact ?' : 'Unsubscribe this contact?'}
        description={
          fr
            ? 'Le contact passera en statut désabonné (soft-delete).'
            : 'The contact will be marked unsubscribed (soft-delete).'
        }
        onConfirm={() => void confirmDelete()}
        loading={remove.isPending}
      />
    </div>
  );
}
