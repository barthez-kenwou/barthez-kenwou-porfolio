import React from 'react';
import { ArrowRight, Megaphone, Users } from 'lucide-react';
import {
  useNewsletterCampaignStats,
  useNewsletterCampaigns,
  useNewsletterStats,
} from '@/features/newsletter';
import { AdminSectionCard } from '@/features/admin-cms';
import { isApiError } from '@/shared/api';
import { QueryState } from '@/shared/ui/QueryState';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  campaignStatusLabel,
  campaignStatusVariant,
  campaignTypeLabel,
  formatDate,
  type NewsletterTab,
} from '../lib/labels';

type Props = {
  fr: boolean;
  onNavigate: (tab: NewsletterTab) => void;
};

export function OverviewSection({ fr, onNavigate }: Props) {
  const statsQuery = useNewsletterStats();
  const campaignStatsQuery = useNewsletterCampaignStats();
  const recentCampaignsQuery = useNewsletterCampaigns({ limit: 5 });

  const stats = statsQuery.data;
  const campaignStats = campaignStatsQuery.data;
  const recent = recentCampaignsQuery.data?.items ?? [];

  return (
    <div className="space-y-6">
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
            { label: 'Bounced', value: stats?.bounced ?? 0 },
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

      <div className="grid gap-4 md:grid-cols-2">
        <AdminSectionCard
          title={fr ? 'Actions rapides' : 'Quick actions'}
          description={
            fr
              ? 'Accès direct aux flux de gestion.'
              : 'Jump into the main management flows.'
          }
        >
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              size="sm"
              className="justify-between"
              onClick={() => onNavigate('compose')}
            >
              <span className="inline-flex items-center gap-2">
                <Megaphone className="size-3.5" />
                {fr ? 'Nouvelle diffusion' : 'New broadcast'}
              </span>
              <ArrowRight className="size-3.5 opacity-70" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="justify-between"
              onClick={() => onNavigate('subscribers')}
            >
              <span className="inline-flex items-center gap-2">
                <Users className="size-3.5" />
                {fr ? 'Gérer les abonnés' : 'Manage subscribers'}
              </span>
              <ArrowRight className="size-3.5 opacity-70" />
            </Button>
          </div>
          {stats?.active != null ? (
            <p className="mt-3 text-xs text-muted-foreground">
              {fr
                ? `${stats.active} abonné${stats.active > 1 ? 's' : ''} actif${stats.active > 1 ? 's' : ''} prêts à recevoir une campagne.`
                : `${stats.active} active subscriber${stats.active === 1 ? '' : 's'} ready for a campaign.`}
            </p>
          ) : null}
        </AdminSectionCard>

        <QueryState
          isPending={campaignStatsQuery.isPending}
          isError={campaignStatsQuery.isError}
          errorMessage={
            isApiError(campaignStatsQuery.error)
              ? campaignStatsQuery.error.message
              : undefined
          }
        >
          <AdminSectionCard
            title={fr ? 'Performance campagnes' : 'Campaign performance'}
            description={fr ? 'Agrégats sur l’historique.' : 'Aggregates across history.'}
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { label: fr ? 'Campagnes' : 'Campaigns', value: campaignStats?.total ?? 0 },
                { label: fr ? 'Envoyées' : 'Sent', value: campaignStats?.sent ?? 0 },
                { label: fr ? 'En file' : 'Queued', value: campaignStats?.queued ?? 0 },
                { label: fr ? 'Échecs' : 'Failed', value: campaignStats?.failed ?? 0 },
                {
                  label: fr ? 'Emails envoyés' : 'Emails sent',
                  value: campaignStats?.totalSent ?? 0,
                },
                {
                  label: fr ? 'Échecs envoi' : 'Send fails',
                  value: campaignStats?.totalFailed ?? 0,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-border/60 bg-muted/15 px-3 py-2.5"
                >
                  <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-1 text-lg font-semibold tabular-nums">{item.value}</p>
                </div>
              ))}
            </div>
            {campaignStats?.byType ? (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {(
                  [
                    'broadcast',
                    'blog_publish',
                    'digest',
                    'welcome',
                    'confirm',
                  ] as const
                ).map((type) => {
                  const count = campaignStats.byType[type] ?? 0;
                  if (!count) return null;
                  return (
                    <Badge key={type} variant="secondary">
                      {campaignTypeLabel(type, fr)} · {count}
                    </Badge>
                  );
                })}
              </div>
            ) : null}
          </AdminSectionCard>
        </QueryState>
      </div>

      <AdminSectionCard
        title={fr ? 'Campagnes récentes' : 'Recent campaigns'}
        actions={
          <Button size="sm" variant="ghost" onClick={() => onNavigate('campaigns')}>
            {fr ? 'Tout voir' : 'View all'}
            <ArrowRight className="size-3.5" />
          </Button>
        }
      >
        <QueryState
          isPending={recentCampaignsQuery.isPending}
          isError={recentCampaignsQuery.isError}
          errorMessage={
            isApiError(recentCampaignsQuery.error)
              ? recentCampaignsQuery.error.message
              : undefined
          }
          empty={
            !recentCampaignsQuery.isPending &&
            !recentCampaignsQuery.isError &&
            recent.length === 0
          }
          emptyTitle={fr ? 'Aucune campagne' : 'No campaigns yet'}
        >
          <ul className="divide-y divide-border/60">
            {recent.map((c) => (
              <li
                key={c.id}
                className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {fr ? c.subjectFr || c.subjectEn : c.subjectEn || c.subjectFr}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {campaignTypeLabel(c.type, fr)} · {formatDate(c.createdAt, fr)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {c.sentCount ?? 0}/{c.totalRecipients ?? 0}
                  </span>
                  <Badge variant={campaignStatusVariant(c.status)}>
                    {campaignStatusLabel(c.status, fr)}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        </QueryState>
      </AdminSectionCard>
    </div>
  );
}
