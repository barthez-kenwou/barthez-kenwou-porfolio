import React from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Archive,
  CheckCircle2,
  Inbox,
  Layers,
  Mail,
  MailOpen,
  MessageSquareText,
  Reply,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  AdminPageHeader,
  AdminDataTable,
  AdminEmptyState,
  AdminSectionCard,
  ConfirmDeleteDialog,
  Field,
  formatAdminDate,
  type IContactResponse,
  type ContactResponseStatus,
} from '@/features/admin-cms';
import {
  useAdminContactResponses,
  useContactResponseStats,
  useUpdateContactResponse,
  useDeleteContactResponse,
} from '@/entities/contact/hooks/useContact';
import { isApiError } from '@/shared/api';
import { QueryState } from '@/shared/ui/QueryState';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Textarea } from '@/shared/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/shared/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { useIsMobile } from '@/shared/hooks/use-mobile';
import { cn } from '@/shared/lib/utils';

type ResponsesTab = 'inbox' | 'replied' | 'archived' | 'all';

const RESPONSES_TABS: ResponsesTab[] = ['inbox', 'replied', 'archived', 'all'];

function isResponsesTab(value: string | null): value is ResponsesTab {
  return !!value && (RESPONSES_TABS as string[]).includes(value);
}

const TAB_META: Record<
  ResponsesTab,
  { icon: React.ComponentType<{ className?: string }>; fr: string; en: string }
> = {
  inbox: { icon: Inbox, fr: 'Boîte', en: 'Inbox' },
  replied: { icon: Reply, fr: 'Répondu', en: 'Replied' },
  archived: { icon: Archive, fr: 'Archivé', en: 'Archived' },
  all: { icon: Layers, fr: 'Tout', en: 'All' },
};

const statusVariant: Record<
  ContactResponseStatus,
  'default' | 'secondary' | 'warning' | 'success'
> = {
  new: 'warning',
  read: 'secondary',
  replied: 'success',
  archived: 'default',
};

const statusLabel = (s: ContactResponseStatus, fr: boolean) => {
  if (!fr) return s;
  return (
    {
      new: 'Nouveau',
      read: 'Lu',
      replied: 'Répondu',
      archived: 'Archivé',
    } as const
  )[s];
};

function filterByTab(items: IContactResponse[], tab: ResponsesTab): IContactResponse[] {
  switch (tab) {
    case 'inbox':
      return items.filter((i) => i.status === 'new' || i.status === 'read');
    case 'replied':
      return items.filter((i) => i.status === 'replied');
    case 'archived':
      return items.filter((i) => i.status === 'archived');
    default:
      return items;
  }
}

function tabEmptyCopy(tab: ResponsesTab, fr: boolean): { title: string; description: string } {
  if (tab === 'inbox') {
    return {
      title: fr ? 'Boîte vide' : 'Inbox clear',
      description: fr
        ? 'Aucun message nouveau ou lu à traiter pour le moment.'
        : 'No new or read messages to triage right now.',
    };
  }
  if (tab === 'replied') {
    return {
      title: fr ? 'Aucune réponse' : 'No replies yet',
      description: fr
        ? 'Les messages marqués comme répondus apparaîtront ici.'
        : 'Messages marked as replied will show up here.',
    };
  }
  if (tab === 'archived') {
    return {
      title: fr ? 'Archives vides' : 'Nothing archived',
      description: fr
        ? 'Archive un message pour le ranger hors de la boîte.'
        : 'Archive a message to keep it out of the inbox.',
    };
  }
  return {
    title: fr ? 'Aucun message' : 'No messages',
    description: fr
      ? 'Les soumissions du formulaire contact apparaîtront ici.'
      : 'Contact form submissions will land here.',
  };
}

function MessageDetail({
  selected,
  fr,
  language,
  onUpdate,
}: {
  selected: IContactResponse;
  fr: boolean;
  language: 'fr' | 'en';
  onUpdate: (id: string, patch: Partial<IContactResponse>) => Promise<void>;
}) {
  const [notes, setNotes] = React.useState(selected.notes || '');

  React.useEffect(() => {
    setNotes(selected.notes || '');
  }, [selected.id, selected.notes]);

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border/60 bg-muted/20 px-3 py-2.5">
        <p className="cursor-default text-sm font-medium">{selected.name}</p>
        <p className="cursor-default text-xs text-muted-foreground">{selected.email}</p>
        <p className="mt-1 cursor-default text-[11px] text-muted-foreground">
          {formatAdminDate(selected.createdAt, language, { withTime: true })}
        </p>
      </div>

      <p className="cursor-default whitespace-pre-wrap rounded-md border border-border/60 bg-background/60 p-3 text-sm leading-relaxed">
        {selected.message}
      </p>

      <Field label="Status">
        <Select
          value={selected.status}
          onValueChange={(v) => {
            void onUpdate(selected.id, { status: v as ContactResponseStatus });
          }}
        >
          <SelectTrigger className="h-11 cursor-pointer md:h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(['new', 'read', 'replied', 'archived'] as const).map((s) => (
              <SelectItem key={s} value={s} className="cursor-pointer">
                {statusLabel(s, fr)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label={fr ? 'Notes internes' : 'Internal notes'}>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => {
            if (notes !== (selected.notes || '')) {
              void onUpdate(selected.id, { notes });
            }
          }}
          rows={4}
          className="resize-none cursor-text"
          placeholder={fr ? 'Relance, contexte, priorités…' : 'Follow-up, context, priority…'}
        />
      </Field>

      <div className="grid grid-cols-3 gap-2">
        <Button
          size="sm"
          variant="outline"
          className="h-11 cursor-pointer px-2 md:h-8"
          onClick={() => {
            void onUpdate(selected.id, { status: 'replied' }).then(() => {
              toast.success(fr ? 'Marqué comme répondu' : 'Marked as replied');
            });
          }}
        >
          <CheckCircle2 className="size-3.5 shrink-0" />
          <span className="truncate">{fr ? 'Répondu' : 'Replied'}</span>
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-11 cursor-pointer px-2 md:h-8"
          onClick={() => void onUpdate(selected.id, { status: 'archived' })}
        >
          <Archive className="size-3.5 shrink-0" />
          <span className="truncate">{fr ? 'Archiver' : 'Archive'}</span>
        </Button>
        <Button size="sm" variant="outline" className="h-11 cursor-pointer px-2 md:h-8" asChild>
          <a
            href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject}`)}`}
          >
            <Mail className="size-3.5 shrink-0" />
            <span className="truncate">Email</span>
          </a>
        </Button>
      </div>
    </div>
  );
}

export const AdminContactResponsesPage: React.FC = () => {
  const { language } = useLanguageStore();
  const fr = language === 'fr';
  const isMobile = useIsMobile();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, isPending, isError, error } = useAdminContactResponses();
  const statsQuery = useContactResponseStats();
  const updateMut = useUpdateContactResponse();
  const removeMut = useDeleteContactResponse();
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState<IContactResponse | null>(null);

  const tabParam = searchParams.get('tab');
  const tab: ResponsesTab = isResponsesTab(tabParam) ? tabParam : 'inbox';

  const setTab = React.useCallback(
    (next: ResponsesTab) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          if (next === 'inbox') params.delete('tab');
          else params.set('tab', next);
          return params;
        },
        { replace: true },
      );
      setSelectedId(null);
    },
    [setSearchParams],
  );

  const items = data?.items ?? [];
  const selected = items.find((i) => i.id === selectedId) || null;

  const counts = React.useMemo(() => {
    const fromStats = statsQuery.data;
    if (fromStats) return fromStats;
    return {
      total: items.length,
      new: items.filter((i) => i.status === 'new').length,
      read: items.filter((i) => i.status === 'read').length,
      replied: items.filter((i) => i.status === 'replied').length,
      archived: items.filter((i) => i.status === 'archived').length,
    };
  }, [items, statsQuery.data]);

  const statusFiltersFor = (t: ResponsesTab) => {
    const statuses: ContactResponseStatus[] =
      t === 'inbox'
        ? ['new', 'read']
        : t === 'replied'
          ? ['replied']
          : t === 'archived'
            ? ['archived']
            : ['new', 'read', 'replied', 'archived'];
    return statuses.map((s) => ({ value: s, label: statusLabel(s, fr) }));
  };

  const onUpdate = async (id: string, patch: Partial<IContactResponse>) => {
    try {
      await updateMut.mutateAsync({ id, payload: patch });
    } catch (e) {
      toast.error(isApiError(e) ? e.message : fr ? 'Échec' : 'Failed');
    }
  };

  const openMessage = (r: IContactResponse) => {
    setSelectedId(r.id);
    if (r.status === 'new') void onUpdate(r.id, { status: 'read' });
  };

  const confirmDelete = async () => {
    if (!pending) return;
    try {
      await removeMut.mutateAsync(pending.id);
      if (selectedId === pending.id) setSelectedId(null);
      toast.success(fr ? 'Message supprimé' : 'Message deleted');
      setPending(null);
    } catch (e) {
      toast.error(isApiError(e) ? e.message : fr ? 'Échec de la suppression' : 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={fr ? 'Messages reçus' : 'Inbox'}
        actions={
          counts.new > 0 ? (
            <Badge variant="warning" className="cursor-default">
              {counts.new} {fr ? 'non lus' : 'unread'}
            </Badge>
          ) : null
        }
      />

      <Tabs
        value={tab}
        onValueChange={(value) => {
          if (isResponsesTab(value)) setTab(value);
        }}
        className="gap-5"
      >
        <TabsList className="h-auto w-full flex-wrap justify-start gap-1 p-1 sm:w-fit">
          {(Object.keys(TAB_META) as ResponsesTab[]).map((key) => {
            const meta = TAB_META[key];
            const Icon = meta.icon;
            return (
              <TabsTrigger
                key={key}
                value={key}
                className="cursor-pointer gap-1.5 px-3 py-2"
              >
                <Icon className="size-3.5 opacity-80" />
                {fr ? meta.fr : meta.en}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {tab === 'inbox' ? (
          <section className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border/70 bg-border/70 sm:grid-cols-4">
            {[
              { label: fr ? 'Nouveaux' : 'New', value: counts.new, tone: 'warning' as const },
              { label: fr ? 'Lus' : 'Read', value: counts.read, tone: 'muted' as const },
              { label: fr ? 'Répondus' : 'Replied', value: counts.replied, tone: 'muted' as const },
              {
                label: fr ? 'Archivés' : 'Archived',
                value: counts.archived,
                tone: 'muted' as const,
              },
            ].map((item) => (
              <div key={item.label} className="bg-card px-3 py-3 sm:px-4 sm:py-4">
                <p className="cursor-default text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  {item.label}
                </p>
                <p
                  className={cn(
                    'mt-1.5 cursor-default text-xl font-semibold tabular-nums tracking-tight',
                    item.tone === 'warning' && item.value > 0 && 'text-amber-600 dark:text-amber-400',
                  )}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </section>
        ) : null}

        {(RESPONSES_TABS as ResponsesTab[]).map((key) => {
          const tabItems = filterByTab(items, key);
          const empty = tabEmptyCopy(key, fr);
          const statusFilterOptions = statusFiltersFor(key);
          const selectedInTab = tabItems.find((i) => i.id === selectedId) || null;

          return (
            <TabsContent key={key} value={key} className="mt-0">
              <QueryState
                isPending={isPending}
                isError={isError}
                errorMessage={isApiError(error) ? error.message : undefined}
              >
                {tabItems.length === 0 && !isPending && !isError ? (
                  <AdminEmptyState
                    icon={MessageSquareText}
                    title={empty.title}
                    description={empty.description}
                    className="rounded-md shadow-none"
                  />
                ) : (
                  <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                    <AdminDataTable<IContactResponse>
                      data={tabItems}
                      getRowId={(r) => r.id}
                      searchKeys={['name', 'email', 'subject', 'message']}
                      searchPlaceholder={fr ? 'Nom, email, sujet…' : 'Name, email, subject…'}
                      emptyTitle={empty.title}
                      emptyDescription={empty.description}
                      filters={
                        statusFilterOptions.length > 1
                          ? [
                              {
                                key: 'status',
                                label: 'Status',
                                options: statusFilterOptions,
                              },
                            ]
                          : []
                      }
                      onRowClick={openMessage}
                      columns={[
                        {
                          key: 'name',
                          header: fr ? 'Expéditeur' : 'From',
                          render: (r) => (
                            <div className="min-w-0">
                              <p
                                className={cn(
                                  'truncate font-medium',
                                  r.status === 'new' && 'text-foreground',
                                )}
                              >
                                {r.name}
                                {r.status === 'new' ? (
                                  <span className="ml-2 inline-block size-1.5 rounded-full bg-amber-400 align-middle" />
                                ) : null}
                              </p>
                              <p className="truncate text-xs text-muted-foreground">{r.email}</p>
                              <p className="mt-1 line-clamp-1 text-sm text-muted-foreground md:hidden">
                                {r.subject}
                              </p>
                            </div>
                          ),
                        },
                        {
                          key: 'subject',
                          header: fr ? 'Sujet' : 'Subject',
                          hideOnMobile: true,
                          render: (r) => (
                            <span className="line-clamp-1 max-w-[200px]">{r.subject}</span>
                          ),
                        },
                        {
                          key: 'status',
                          header: 'Status',
                          render: (r) => (
                            <Badge
                              variant={statusVariant[r.status]}
                              className="max-w-[7.5rem] truncate"
                            >
                              {statusLabel(r.status, fr)}
                            </Badge>
                          ),
                        },
                        {
                          key: 'createdAt',
                          header: fr ? 'Reçu' : 'Received',
                          render: (r) => (
                            <span className="line-clamp-1 whitespace-nowrap text-muted-foreground">
                              {formatAdminDate(r.createdAt, language, { withTime: true })}
                            </span>
                          ),
                        },
                      ]}
                      actions={(r) => (
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          className="size-11 cursor-pointer md:size-8"
                          onClick={() => setPending(r)}
                        >
                          <Trash2 className="size-3.5 text-destructive" />
                        </Button>
                      )}
                    />

                    <AdminSectionCard
                      title={selectedInTab ? selectedInTab.subject : fr ? 'Détail' : 'Detail'}
                      className="hidden lg:sticky lg:top-4 lg:block lg:self-start"
                    >
                      {!selectedInTab ? (
                        <div className="flex min-h-[220px] flex-col items-center justify-center rounded-md border border-dashed border-border/70 bg-muted/15 px-6 text-center">
                          <MailOpen className="mb-3 size-5 text-muted-foreground/70" />
                          <p className="cursor-default text-sm text-muted-foreground">
                            {fr
                              ? 'Sélectionne un message pour le lire et le traiter.'
                              : 'Select a message to read and triage.'}
                          </p>
                        </div>
                      ) : (
                        <MessageDetail
                          selected={selectedInTab}
                          fr={fr}
                          language={language}
                          onUpdate={onUpdate}
                        />
                      )}
                    </AdminSectionCard>
                  </div>
                )}
              </QueryState>
            </TabsContent>
          );
        })}
      </Tabs>

      <Sheet
        open={isMobile && !!selected}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null);
        }}
      >
        <SheetContent
          side="bottom"
          className="flex max-h-[88dvh] flex-col gap-0 overflow-hidden rounded-t-2xl px-4 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
        >
          <SheetHeader className="space-y-0 px-0 pb-3 text-left">
            <SheetTitle className="cursor-default pr-10 text-base leading-snug">
              {selected?.subject}
            </SheetTitle>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-0.5">
            {selected ? (
              <MessageDetail
                selected={selected}
                fr={fr}
                language={language}
                onUpdate={onUpdate}
              />
            ) : null}
          </div>
        </SheetContent>
      </Sheet>

      <ConfirmDeleteDialog
        open={!!pending}
        onOpenChange={(o) => !o && setPending(null)}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
};
