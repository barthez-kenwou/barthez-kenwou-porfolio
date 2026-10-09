import React from 'react';
import { Archive, CheckCircle2, Mail, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  AdminPageHeader,
  AdminDataTable,
  AdminSectionCard,
  ConfirmDeleteDialog,
  Field,
  type IContactResponse,
  type ContactResponseStatus,
} from '@/features/admin-cms';
import {
  useAdminContactResponses,
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
import { useIsMobile } from '@/shared/hooks/use-mobile';
import { cn } from '@/shared/lib/utils';

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

function MessageDetail({
  selected,
  fr,
  onUpdate,
}: {
  selected: IContactResponse;
  fr: boolean;
  onUpdate: (id: string, patch: Partial<IContactResponse>) => Promise<void>;
}) {
  const [notes, setNotes] = React.useState(selected.notes || '');

  React.useEffect(() => {
    setNotes(selected.notes || '');
  }, [selected.id, selected.notes]);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5">
        <p className="text-sm font-medium">{selected.name}</p>
        <p className="text-xs text-muted-foreground">{selected.email}</p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          {new Date(selected.createdAt).toLocaleString(fr ? 'fr-FR' : 'en-US')}
        </p>
      </div>

      <p className="whitespace-pre-wrap rounded-lg border border-border/60 bg-background/60 p-3 text-sm leading-relaxed">
        {selected.message}
      </p>

      <Field label="Status">
        <Select
          value={selected.status}
          onValueChange={(v) => {
            void onUpdate(selected.id, { status: v as ContactResponseStatus });
          }}
        >
          <SelectTrigger className="h-11 md:h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(['new', 'read', 'replied', 'archived'] as const).map((s) => (
              <SelectItem key={s} value={s}>
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
          placeholder={fr ? 'Relance, contexte, priorités…' : 'Follow-up, context, priority…'}
        />
      </Field>

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          className="h-11 min-w-[7rem] md:h-8"
          onClick={() => {
            void onUpdate(selected.id, { status: 'replied' }).then(() => {
              toast.success(fr ? 'Marqué comme répondu' : 'Marked as replied');
            });
          }}
        >
          <CheckCircle2 className="size-3.5" />
          {fr ? 'Répondu' : 'Replied'}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-11 min-w-[7rem] md:h-8"
          onClick={() => void onUpdate(selected.id, { status: 'archived' })}
        >
          <Archive className="size-3.5" />
          {fr ? 'Archiver' : 'Archive'}
        </Button>
        <Button size="sm" variant="ghost" className="h-11 md:h-8" asChild>
          <a
            href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject}`)}`}
          >
            <Mail className="size-3.5" />
            Email
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
  const { data, isPending, isError, error } = useAdminContactResponses();
  const updateMut = useUpdateContactResponse();
  const removeMut = useDeleteContactResponse();
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState<IContactResponse | null>(null);

  const items = data?.items ?? [];
  const selected = items.find((i) => i.id === selectedId) || null;
  const newCount = items.filter((i) => i.status === 'new').length;

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
          newCount > 0 ? (
            <Badge variant="warning">
              {newCount} {fr ? 'non lus' : 'unread'}
            </Badge>
          ) : null
        }
      />

      <QueryState
        isPending={isPending}
        isError={isError}
        errorMessage={isApiError(error) ? error.message : undefined}
        empty={!isPending && !isError && items.length === 0}
        emptyTitle={fr ? 'Aucun message' : 'No messages'}
      >
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <AdminDataTable<IContactResponse>
            data={items}
            getRowId={(r) => r.id}
            searchKeys={['name', 'email', 'subject', 'message']}
            searchPlaceholder={fr ? 'Nom, email, sujet…' : 'Name, email, subject…'}
            emptyTitle={fr ? 'Aucun message' : 'No messages'}
            emptyDescription={
              fr
                ? 'Les soumissions du formulaire contact apparaîtront ici.'
                : 'Contact form submissions will land here.'
            }
            filters={[
              {
                key: 'status',
                label: 'Status',
                options: (['new', 'read', 'replied', 'archived'] as const).map((s) => ({
                  value: s,
                  label: statusLabel(s, fr),
                })),
              },
            ]}
            onRowClick={openMessage}
            columns={[
              {
                key: 'name',
                header: fr ? 'Expéditeur' : 'From',
                render: (r) => (
                  <div className="min-w-0">
                    <p
                      className={cn('truncate font-medium', r.status === 'new' && 'text-foreground')}
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
                render: (r) => <span className="line-clamp-1 max-w-[200px]">{r.subject}</span>,
              },
              {
                key: 'status',
                header: 'Status',
                render: (r) => (
                  <Badge variant={statusVariant[r.status]}>{statusLabel(r.status, fr)}</Badge>
                ),
              },
              {
                key: 'createdAt',
                header: fr ? 'Reçu' : 'Received',
                render: (r) =>
                  new Date(r.createdAt).toLocaleString(fr ? 'fr-FR' : 'en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  }),
              },
            ]}
            actions={(r) => (
              <Button
                size="icon-sm"
                variant="ghost"
                className="size-11 md:size-8"
                onClick={() => setPending(r)}
              >
                <Trash2 className="size-3.5 text-destructive" />
              </Button>
            )}
          />

          <AdminSectionCard
            title={selected ? selected.subject : fr ? 'Détail' : 'Detail'}
            className="hidden lg:sticky lg:top-4 lg:block lg:self-start"
          >
            {!selected ? (
              <div className="flex min-h-[220px] items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/15 px-6 text-center text-sm text-muted-foreground">
                {fr
                  ? 'Sélectionne un message pour le lire et le traiter.'
                  : 'Select a message to read and triage.'}
              </div>
            ) : (
              <MessageDetail selected={selected} fr={fr} onUpdate={onUpdate} />
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
            <SheetTitle className="pr-8 text-base leading-snug">{selected?.subject}</SheetTitle>
          </SheetHeader>
          <div className="mt-4 min-h-0 flex-1 overflow-y-auto">
            {selected ? <MessageDetail selected={selected} fr={fr} onUpdate={onUpdate} /> : null}
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
