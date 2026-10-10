import React from 'react';
import { Ban, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AdminDataTable, AdminSectionCard } from '@/features/admin-cms';
import {
  useCancelNewsletterCampaign,
  useNewsletterCampaign,
  useNewsletterCampaigns,
  type NewsletterCampaign,
} from '@/features/newsletter';
import { isApiError } from '@/shared/api';
import { QueryState } from '@/shared/ui/QueryState';
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
import { Badge } from '@/shared/ui/badge';
import { Button, buttonVariants } from '@/shared/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/shared/ui/sheet';
import { useIsMobile } from '@/shared/hooks/use-mobile';
import { cn } from '@/shared/lib/utils';
import {
  campaignStatusLabel,
  campaignStatusVariant,
  campaignTypeLabel,
  formatDate,
} from '../lib/labels';

type Props = { fr: boolean };

function CampaignDetail({
  campaign,
  fr,
  onCancel,
  cancelling,
}: {
  campaign: NewsletterCampaign;
  fr: boolean;
  onCancel: () => void;
  cancelling: boolean;
}) {
  const payload = campaign.payload ?? null;
  const subject = fr
    ? campaign.subjectFr || campaign.subjectEn
    : campaign.subjectEn || campaign.subjectFr;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5">
        <p className="text-sm font-medium leading-snug">{subject}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Badge variant={campaignStatusVariant(campaign.status)}>
            {campaignStatusLabel(campaign.status, fr)}
          </Badge>
          <Badge variant="outline">{campaignTypeLabel(campaign.type, fr)}</Badge>
          {campaign.template ? <Badge variant="secondary">{campaign.template}</Badge> : null}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: fr ? 'Destinataires' : 'Recipients', value: campaign.totalRecipients ?? 0 },
          { label: fr ? 'Envoyés' : 'Sent', value: campaign.sentCount ?? 0 },
          { label: fr ? 'Échecs' : 'Fails', value: campaign.failCount ?? 0 },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-lg border border-border/50 px-2.5 py-2 text-center"
          >
            <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              {item.label}
            </p>
            <p className="mt-1 text-base font-semibold tabular-nums">{item.value}</p>
          </div>
        ))}
      </div>

      <dl className="grid gap-2 text-sm sm:grid-cols-2">
        {(
          [
            [fr ? 'Créée' : 'Created', formatDate(campaign.createdAt, fr)],
            [fr ? 'Démarrée' : 'Started', formatDate(campaign.startedAt, fr)],
            [fr ? 'Terminée' : 'Completed', formatDate(campaign.completedAt, fr)],
            ['Blog ID', campaign.blogId || '·'],
          ] as const
        ).map(([label, value]) => (
          <div key={label} className="rounded-lg border border-border/50 px-3 py-2">
            <dt className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              {label}
            </dt>
            <dd className="mt-1 break-all font-medium">{value}</dd>
          </div>
        ))}
      </dl>

      {(campaign.previewFr || campaign.previewEn) && (
        <div className="rounded-lg border border-border/50 px-3 py-2 text-sm">
          <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            Preview
          </p>
          <p className="mt-1 text-muted-foreground">
            {fr
              ? campaign.previewFr || campaign.previewEn
              : campaign.previewEn || campaign.previewFr}
          </p>
        </div>
      )}

      {payload && Object.keys(payload).length > 0 ? (
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            Payload
          </p>
          <pre className="max-h-56 overflow-auto rounded-lg border border-border/50 bg-muted/20 p-3 text-xs leading-relaxed">
            {JSON.stringify(payload, null, 2)}
          </pre>
        </div>
      ) : null}

      {campaign.status === 'queued' ? (
        <Button
          size="sm"
          variant="outline"
          className="w-full"
          disabled={cancelling}
          onClick={onCancel}
        >
          {cancelling ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Ban className="size-3.5" />
          )}
          {fr ? 'Annuler la campagne' : 'Cancel campaign'}
        </Button>
      ) : null}
    </div>
  );
}

export function CampaignsSection({ fr }: Props) {
  const isMobile = useIsMobile();
  const campaignsQuery = useNewsletterCampaigns();
  const cancel = useCancelNewsletterCampaign();
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [pendingCancel, setPendingCancel] = React.useState<NewsletterCampaign | null>(null);

  const campaigns = campaignsQuery.data?.items ?? [];
  const detailQuery = useNewsletterCampaign(selectedId);
  const selected =
    detailQuery.data ?? campaigns.find((c) => c.id === selectedId) ?? null;
  const total = campaignsQuery.data?.totalItems ?? campaigns.length;

  const confirmCancel = async () => {
    if (!pendingCancel) return;
    try {
      await cancel.mutateAsync(pendingCancel.id);
      toast.success(fr ? 'Campagne annulée' : 'Campaign cancelled');
      setPendingCancel(null);
    } catch (e) {
      toast.error(isApiError(e) ? e.message : fr ? 'Échec de l’annulation' : 'Cancel failed');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold tracking-tight">
          {fr ? 'Campagnes' : 'Campaigns'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {fr
            ? `${total} campagne${total > 1 ? 's' : ''} · historique, compteurs, annulation`
            : `${total} campaign${total === 1 ? '' : 's'} · history, counters, cancel`}
        </p>
      </div>

      <QueryState
        isPending={campaignsQuery.isPending}
        isError={campaignsQuery.isError}
        errorMessage={
          isApiError(campaignsQuery.error) ? campaignsQuery.error.message : undefined
        }
      >
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <AdminDataTable
            data={campaigns}
            getRowId={(r) => r.id}
            searchKeys={['subjectFr', 'subjectEn', 'type', 'status', 'template']}
            searchPlaceholder={fr ? 'Sujet, type, statut…' : 'Subject, type, status…'}
            emptyTitle={fr ? 'Aucune campagne' : 'No campaigns'}
            onRowClick={(r) => setSelectedId(r.id)}
            filters={[
              {
                key: 'type',
                label: fr ? 'Type' : 'Type',
                options: (
                  ['broadcast', 'blog_publish', 'digest', 'welcome', 'confirm'] as const
                ).map((t) => ({
                  value: t,
                  label: campaignTypeLabel(t, fr),
                })),
              },
              {
                key: 'status',
                label: 'Status',
                options: (
                  ['queued', 'sending', 'sent', 'failed', 'cancelled'] as const
                ).map((s) => ({
                  value: s,
                  label: campaignStatusLabel(s, fr),
                })),
              },
            ]}
            columns={[
              {
                key: 'subject',
                header: fr ? 'Sujet' : 'Subject',
                render: (r) => (
                  <div className="min-w-0">
                    <p className="line-clamp-1 font-medium">
                      {fr ? r.subjectFr || r.subjectEn : r.subjectEn || r.subjectFr}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground md:hidden">
                      {campaignTypeLabel(r.type, fr)}
                    </p>
                  </div>
                ),
              },
              {
                key: 'type',
                header: 'Type',
                hideOnMobile: true,
                render: (r) => (
                  <Badge variant="outline">{campaignTypeLabel(r.type, fr)}</Badge>
                ),
              },
              {
                key: 'status',
                header: 'Status',
                render: (r) => (
                  <Badge variant={campaignStatusVariant(r.status)}>
                    {campaignStatusLabel(r.status, fr)}
                  </Badge>
                ),
              },
              {
                key: 'delivery',
                header: fr ? 'Livraison' : 'Delivery',
                hideOnMobile: true,
                render: (r) => (
                  <span className="tabular-nums text-sm">
                    {r.sentCount ?? 0}/{r.totalRecipients ?? 0}
                    {(r.failCount ?? 0) > 0 ? (
                      <span className="ml-1 text-destructive">· {r.failCount}✗</span>
                    ) : null}
                  </span>
                ),
              },
              {
                key: 'createdAt',
                header: fr ? 'Créée' : 'Created',
                render: (r) =>
                  r.createdAt
                    ? new Date(r.createdAt).toLocaleDateString(fr ? 'fr-FR' : 'en-US')
                    : '·',
              },
            ]}
            actions={(r) =>
              r.status === 'queued' ? (
                <Button
                  size="icon-sm"
                  variant="ghost"
                  title={fr ? 'Annuler' : 'Cancel'}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPendingCancel(r);
                  }}
                >
                  <Ban className="size-3.5 text-destructive" />
                </Button>
              ) : null
            }
          />

          <AdminSectionCard
            title={
              selected
                ? fr
                  ? selected.subjectFr || selected.subjectEn || 'Détail'
                  : selected.subjectEn || selected.subjectFr || 'Detail'
                : fr
                  ? 'Détail campagne'
                  : 'Campaign detail'
            }
            className="hidden lg:sticky lg:top-4 lg:block lg:self-start"
          >
            {!selectedId ? (
              <div className="flex min-h-[220px] items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/15 px-6 text-center text-sm text-muted-foreground">
                {fr
                  ? 'Sélectionne une campagne pour inspecter le payload et les compteurs.'
                  : 'Select a campaign to inspect payload and delivery counters.'}
              </div>
            ) : detailQuery.isPending && !selected ? (
              <div className="flex min-h-[220px] items-center justify-center">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : selected ? (
              <CampaignDetail
                campaign={selected}
                fr={fr}
                cancelling={cancel.isPending}
                onCancel={() => setPendingCancel(selected)}
              />
            ) : null}
          </AdminSectionCard>
        </div>
      </QueryState>

      <Sheet
        open={isMobile && !!selectedId}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null);
        }}
      >
        <SheetContent
          side="bottom"
          className="flex max-h-[88dvh] flex-col rounded-t-2xl pb-[max(1rem,env(safe-area-inset-bottom))]"
        >
          <SheetHeader className="text-left">
            <SheetTitle className="pr-8 text-base leading-snug">
              {selected
                ? fr
                  ? selected.subjectFr || selected.subjectEn
                  : selected.subjectEn || selected.subjectFr
                : fr
                  ? 'Campagne'
                  : 'Campaign'}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 min-h-0 flex-1 overflow-y-auto">
            {selected ? (
              <CampaignDetail
                campaign={selected}
                fr={fr}
                cancelling={cancel.isPending}
                onCancel={() => setPendingCancel(selected)}
              />
            ) : null}
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={!!pendingCancel}
        onOpenChange={(open) => {
          if (!cancel.isPending && !open) setPendingCancel(null);
        }}
      >
        <AlertDialogContent className="border-border/70 shadow-xs">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {fr ? 'Annuler cette campagne ?' : 'Cancel this campaign?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {fr
                ? 'Seules les campagnes encore en file (queued) peuvent être annulées.'
                : 'Only campaigns still queued can be cancelled.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancel.isPending}>
              {fr ? 'Retour' : 'Back'}
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={cancel.isPending}
              className={cn(buttonVariants({ variant: 'destructive' }))}
              onClick={(event) => {
                event.preventDefault();
                void confirmCancel();
              }}
            >
              {cancel.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {fr ? 'Annulation…' : 'Cancelling…'}
                </>
              ) : fr ? (
                'Annuler la campagne'
              ) : (
                'Cancel campaign'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
