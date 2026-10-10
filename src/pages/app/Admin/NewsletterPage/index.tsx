import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutDashboard, Megaphone, Send, Users } from 'lucide-react';
import { AdminPageHeader } from '@/features/admin-cms';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { cn } from '@/shared/lib/utils';
import { isNewsletterTab, type NewsletterTab } from './lib/labels';
import { OverviewSection } from './sections/OverviewSection';
import { SubscribersSection } from './sections/SubscribersSection';
import { CampaignsSection } from './sections/CampaignsSection';
import { ComposeSection } from './sections/ComposeSection';

const TAB_META: Record<
  NewsletterTab,
  { icon: React.ComponentType<{ className?: string }>; fr: string; en: string }
> = {
  overview: { icon: LayoutDashboard, fr: 'Vue d’ensemble', en: 'Overview' },
  subscribers: { icon: Users, fr: 'Abonnés', en: 'Subscribers' },
  campaigns: { icon: Megaphone, fr: 'Campagnes', en: 'Campaigns' },
  compose: { icon: Send, fr: 'Composer', en: 'Compose' },
};

export const AdminNewsletterPage: React.FC = () => {
  const { language } = useLanguageStore();
  const fr = language === 'fr';
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get('tab');
  const tab: NewsletterTab = isNewsletterTab(tabParam) ? tabParam : 'overview';

  const setTab = React.useCallback(
    (next: NewsletterTab) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          if (next === 'overview') params.delete('tab');
          else params.set('tab', next);
          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Newsletter" />

      <Tabs
        value={tab}
        onValueChange={(value) => {
          if (isNewsletterTab(value)) setTab(value);
        }}
        className="gap-5"
      >
        <TabsList className="h-auto w-full flex-wrap justify-start gap-1 p-1 sm:w-fit">
          {(Object.keys(TAB_META) as NewsletterTab[]).map((key) => {
            const meta = TAB_META[key];
            const Icon = meta.icon;
            return (
              <TabsTrigger
                key={key}
                value={key}
                className={cn('gap-1.5 px-3 py-2')}
              >
                <Icon className="size-3.5 opacity-80" />
                {fr ? meta.fr : meta.en}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          <OverviewSection fr={fr} onNavigate={setTab} />
        </TabsContent>
        <TabsContent value="subscribers" className="mt-0">
          <SubscribersSection fr={fr} />
        </TabsContent>
        <TabsContent value="campaigns" className="mt-0">
          <CampaignsSection fr={fr} />
        </TabsContent>
        <TabsContent value="compose" className="mt-0">
          <ComposeSection fr={fr} onSent={() => setTab('campaigns')} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
