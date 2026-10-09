import React from 'react';
import { Pencil, Plus, Trash2, Save, X } from 'lucide-react';
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
  ConfirmDeleteDialog,
  BilingualField,
  Field,
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
  isPublished: true,
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
  const items = data?.items ?? [];
  const [editing, setEditing] = React.useState<EduDraft | null>(null);
  const [pending, setPending] = React.useState<IEducationDto | null>(null);

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

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={fr ? 'Formations' : 'Education'}
        actions={
          <Button onClick={() => setEditing(emptyItem())}>
            <Plus className="size-4" />
            {fr ? 'Ajouter' : 'Add'}
          </Button>
        }
      />

      {editing ? (
        <AdminSectionCard
          title={fr ? 'Édition' : 'Editor'}
          actions={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditing(null)}>
                <X className="size-3.5" /> {fr ? 'Fermer' : 'Close'}
              </Button>
              <Button size="sm" onClick={() => void save()} disabled={create.isPending || update.isPending}>
                <Save className="size-3.5" /> {fr ? 'Enregistrer' : 'Save'}
              </Button>
            </div>
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
      ) : null}

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
          emptyTitle={fr ? 'Aucun élément' : 'No items'}
          columns={[
            {
              key: 'degree',
              header: fr ? 'Diplôme' : 'Degree',
              render: (r) => <span className="font-medium">{fr ? r.degreeFr : r.degreeEn}</span>,
            },
            { key: 'school', header: fr ? 'École' : 'School' },
            { key: 'period', header: fr ? 'Période' : 'Period' },
          ]}
          actions={(r) => (
            <>
              <Button size="icon-sm" variant="ghost" onClick={() => setEditing({ ...r })}>
                <Pencil className="size-3.5" />
              </Button>
              <Button size="icon-sm" variant="ghost" onClick={() => setPending(r)}>
                <Trash2 className="size-3.5 text-destructive" />
              </Button>
            </>
          )}
        />
      </QueryState>

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
