import React from 'react';
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2, Save, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  useAdminEducation,
  useCreateEducation,
  useUpdateEducation,
  useDeleteEducation,
} from '@/entities/education/hooks/useEducation';
import type { IEducationDto } from '@/entities/education/api/education.api';
import {
  AdminPageHeader,
  AdminDataTable,
  AdminSectionCard,
  AdminStickyActions,
  ConfirmDeleteDialog,
  BilingualField,
  Field,
  getReorderTargets,
  sortBySortOrder,
  useScrollToEditor,
} from '@/features/admin-cms';
import { isApiError } from '@/shared/api';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { QueryState } from '@/shared/ui/QueryState';

type EduDraft = Omit<IEducationDto, 'id'> & { id?: string };

const emptyItem = (): EduDraft => ({
  degreeFr: '',
  degreeEn: '',
  school: '',
  period: '',
  link: '',
});

const isPersistedId = (id?: string) =>
  Boolean(id && !id.startsWith('tmp') && !id.startsWith('new'));

export const AdminEducationPage: React.FC = () => {
  const { language } = useLanguageStore();
  const fr = language === 'fr';
  const { data, isPending, isError, error } = useAdminEducation();
  const create = useCreateEducation();
  const update = useUpdateEducation();
  const remove = useDeleteEducation();
  const items = React.useMemo(() => sortBySortOrder(data?.items ?? []), [data?.items]);
  const [editing, setEditing] = React.useState<EduDraft | null>(null);
  const [pending, setPending] = React.useState<IEducationDto | null>(null);
  const [reorderingId, setReorderingId] = React.useState<string | null>(null);
  const { editorRef, tableRef } = useScrollToEditor(editing);
  const saving = create.isPending || update.isPending;

  const save = async () => {
    if (!editing) return;
    const { id, ...payload } = editing;
    try {
      if (isPersistedId(id)) {
        await update.mutateAsync({ id: id!, payload });
      } else {
        await create.mutateAsync(payload);
      }
      toast.success(fr ? 'Enregistré' : 'Saved');
      setEditing(null);
    } catch (e) {
      toast.error(isApiError(e) ? e.message : fr ? 'Échec de l’enregistrement' : 'Save failed');
    }
  };

  const reorder = async (id: string, direction: 'up' | 'down') => {
    const patches = getReorderTargets(items, id, direction);
    if (!patches.length) return;
    setReorderingId(id);
    try {
      await Promise.all(
        patches.map((p) => update.mutateAsync({ id: p.id, payload: { sortOrder: p.sortOrder } })),
      );
    } catch (e) {
      toast.error(isApiError(e) ? e.message : fr ? 'Échec du réordonnancement' : 'Reorder failed');
    } finally {
      setReorderingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={fr ? 'Formations' : 'Education'}
        actions={
          <Button type="button" className="cursor-pointer" onClick={() => setEditing(emptyItem())}>
            <Plus className="size-4" />
            {fr ? 'Ajouter' : 'Add'}
          </Button>
        }
      />

      {editing ? (
        <div ref={editorRef}>
          <AdminSectionCard
            title={fr ? 'Édition' : 'Editor'}
            actions={
              <AdminStickyActions>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="cursor-pointer flex-1 md:flex-none"
                  onClick={() => setEditing(null)}
                  disabled={saving}
                >
                  <X className="size-3.5" /> {fr ? 'Fermer' : 'Close'}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="cursor-pointer flex-[1.4] md:flex-none"
                  onClick={() => void save()}
                  disabled={saving}
                >
                  {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                  {fr ? 'Enregistrer' : 'Save'}
                </Button>
              </AdminStickyActions>
            }
          >
            <div className="grid gap-4 md:grid-cols-2">
              <BilingualField
                label={fr ? 'Diplôme' : 'Degree'}
                valueFr={editing.degreeFr}
                valueEn={editing.degreeEn}
                onChangeFr={(v) => setEditing({ ...editing, degreeFr: v })}
                onChangeEn={(v) => setEditing({ ...editing, degreeEn: v })}
              />
              <Field label={fr ? 'École' : 'School'}>
                <Input
                  value={editing.school}
                  onChange={(e) => setEditing({ ...editing, school: e.target.value })}
                />
              </Field>
              <Field label={fr ? 'Période' : 'Period'}>
                <Input
                  value={editing.period}
                  onChange={(e) => setEditing({ ...editing, period: e.target.value })}
                />
              </Field>
              <Field label="Link">
                <Input
                  value={editing.link || ''}
                  onChange={(e) => setEditing({ ...editing, link: e.target.value })}
                />
              </Field>
            </div>
          </AdminSectionCard>
        </div>
      ) : null}

      <div ref={tableRef}>
        <QueryState
          isPending={isPending}
          isError={isError}
          errorMessage={isApiError(error) ? error.message : fr ? 'Chargement impossible' : 'Failed to load'}
          variant="page"
        >
          <AdminDataTable
            data={items}
            getRowId={(r) => String(r.id)}
            searchKeys={['degreeFr', 'degreeEn', 'school', 'period']}
            emptyTitle={fr ? 'Aucune formation' : 'No education entries'}
            columns={[
              {
                key: 'degree',
                header: fr ? 'Diplôme' : 'Degree',
                render: (r) => <span className="font-medium">{fr ? r.degreeFr : r.degreeEn}</span>,
              },
              { key: 'school', header: fr ? 'École' : 'School' },
              { key: 'period', header: fr ? 'Période' : 'Period' },
            ]}
            actions={(r) => {
              const idx = items.findIndex((x) => x.id === r.id);
              const busy = reorderingId === r.id;
              return (
                <>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    className="size-11 cursor-pointer md:size-8"
                    disabled={idx <= 0 || reorderingId !== null}
                    title={fr ? 'Monter' : 'Move up'}
                    onClick={() => void reorder(r.id, 'up')}
                  >
                    {busy ? <Loader2 className="size-3.5 animate-spin" /> : <ChevronUp className="size-3.5" />}
                  </Button>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    className="size-11 cursor-pointer md:size-8"
                    disabled={idx >= items.length - 1 || reorderingId !== null}
                    title={fr ? 'Descendre' : 'Move down'}
                    onClick={() => void reorder(r.id, 'down')}
                  >
                    <ChevronDown className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    className="size-11 cursor-pointer md:size-8"
                    onClick={() => setEditing({ ...r })}
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    className="size-11 cursor-pointer md:size-8"
                    onClick={() => setPending(r)}
                  >
                    <Trash2 className="size-3.5 text-destructive" />
                  </Button>
                </>
              );
            }}
          />
        </QueryState>
      </div>

      <ConfirmDeleteDialog
        open={!!pending}
        onOpenChange={(o) => !o && setPending(null)}
        onConfirm={() => {
          if (!pending) return;
          void (async () => {
            try {
              await remove.mutateAsync(pending.id);
              toast.success(fr ? 'Supprimé' : 'Deleted');
              setPending(null);
            } catch (e) {
              toast.error(isApiError(e) ? e.message : fr ? 'Suppression impossible' : 'Delete failed');
            }
          })();
        }}
      />
    </div>
  );
};
