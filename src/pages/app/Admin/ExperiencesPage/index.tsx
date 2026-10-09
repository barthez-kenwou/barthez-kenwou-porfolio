import React from 'react';
import { Pencil, Plus, Trash2, Save, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  AdminPageHeader,
  AdminDataTable,
  AdminSectionCard,
  ConfirmDeleteDialog,
  BilingualField,
  Field,
  StringListEditor,
} from '@/features/admin-cms';
import {
  useAdminExperiences,
  useCreateExperience,
  useUpdateExperience,
  useDeleteExperience,
} from '@/entities/experiences/hooks/useExperiences';
import type { IExperienceDto } from '@/entities/experiences/api/experience.api';
import { isApiError } from '@/shared/api';
import { QueryState } from '@/shared/ui/QueryState';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

type Draft = {
  id?: string;
  titleFr: string;
  titleEn: string;
  companyFr: string;
  companyEn: string;
  period: string;
  descriptionFr: string[];
  descriptionEn: string[];
  isNew?: boolean;
};

const emptyItem = (): Draft => ({
  titleFr: '',
  titleEn: '',
  companyFr: '',
  companyEn: '',
  period: '',
  descriptionFr: [],
  descriptionEn: [],
  isNew: true,
});

export const AdminExperiencesPage: React.FC = () => {
  const { language } = useLanguageStore();
  const fr = language === 'fr';
  const { data, isPending, isError, error } = useAdminExperiences();
  const create = useCreateExperience();
  const update = useUpdateExperience();
  const remove = useDeleteExperience();
  const [editing, setEditing] = React.useState<Draft | null>(null);
  const [pending, setPending] = React.useState<IExperienceDto | null>(null);
  const saving = create.isPending || update.isPending;
  const items = data?.items ?? [];

  const save = async () => {
    if (!editing) return;
    const payload = {
      titleFr: editing.titleFr.trim(),
      titleEn: editing.titleEn.trim(),
      companyFr: editing.companyFr.trim(),
      companyEn: editing.companyEn.trim(),
      period: editing.period.trim(),
      descriptionFr: editing.descriptionFr,
      descriptionEn: editing.descriptionEn,
    };
    if (!payload.titleFr || !payload.titleEn || !payload.companyFr) {
      toast.error(fr ? 'Champs requis manquants' : 'Required fields missing');
      return;
    }
    try {
      if (editing.isNew || !editing.id) {
        await create.mutateAsync(payload);
      } else {
        await update.mutateAsync({ id: editing.id, payload });
      }
      toast.success(fr ? 'Enregistré' : 'Saved');
      setEditing(null);
    } catch (e) {
      toast.error(isApiError(e) ? e.message : fr ? 'Échec de la sauvegarde' : 'Save failed');
    }
  };

  const confirmDelete = async () => {
    if (!pending) return;
    try {
      await remove.mutateAsync(pending.id);
      toast.success(fr ? 'Supprimé' : 'Deleted');
      setPending(null);
    } catch (e) {
      toast.error(isApiError(e) ? e.message : fr ? 'Échec de la suppression' : 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={fr ? 'Expériences' : 'Experiences'}
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
              <Button variant="outline" size="sm" onClick={() => setEditing(null)} disabled={saving}>
                <X className="size-3.5" /> {fr ? 'Fermer' : 'Close'}
              </Button>
              <Button size="sm" onClick={() => void save()} disabled={saving}>
                {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                {fr ? 'Enregistrer' : 'Save'}
              </Button>
            </div>
          }
        >
          <div className="grid gap-4 md:grid-cols-2">
            <BilingualField
              label={fr ? 'Poste' : 'Title'}
              valueFr={editing.titleFr}
              valueEn={editing.titleEn}
              onChangeFr={(v) => setEditing({ ...editing, titleFr: v })}
              onChangeEn={(v) => setEditing({ ...editing, titleEn: v })}
            />
            <BilingualField
              label={fr ? 'Entreprise' : 'Company'}
              valueFr={editing.companyFr}
              valueEn={editing.companyEn}
              onChangeFr={(v) => setEditing({ ...editing, companyFr: v })}
              onChangeEn={(v) => setEditing({ ...editing, companyEn: v })}
            />
            <Field label={fr ? 'Période' : 'Period'}>
              <Input
                value={editing.period}
                onChange={(e) => setEditing({ ...editing, period: e.target.value })}
              />
            </Field>
            <div className="md:col-span-2">
              <StringListEditor
                label={fr ? 'Description FR' : 'Description FR'}
                values={editing.descriptionFr}
                onChange={(v) => setEditing({ ...editing, descriptionFr: v })}
              />
            </div>
            <div className="md:col-span-2">
              <StringListEditor
                label={fr ? 'Description EN' : 'Description EN'}
                values={editing.descriptionEn}
                onChange={(v) => setEditing({ ...editing, descriptionEn: v })}
              />
            </div>
          </div>
        </AdminSectionCard>
      ) : null}

      <QueryState
        isPending={isPending}
        isError={isError}
        errorMessage={isApiError(error) ? error.message : undefined}
        empty={!isPending && !isError && items.length === 0}
        emptyTitle={fr ? 'Aucune expérience' : 'No experiences'}
      >
        <AdminDataTable
          data={items}
          getRowId={(r) => String(r.id)}
          searchKeys={['titleFr', 'titleEn', 'companyFr', 'companyEn', 'period']}
          emptyTitle={fr ? 'Aucun élément' : 'No items'}
          columns={[
            {
              key: 'title',
              header: fr ? 'Poste' : 'Title',
              render: (r) => (
                <div>
                  <p className="font-medium">{fr ? r.titleFr : r.titleEn}</p>
                  <p className="text-xs text-muted-foreground">{fr ? r.companyFr : r.companyEn}</p>
                </div>
              ),
            },
            { key: 'period', header: fr ? 'Période' : 'Period' },
          ]}
          actions={(r) => (
            <>
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() =>
                  setEditing({
                    id: r.id,
                    titleFr: r.titleFr,
                    titleEn: r.titleEn,
                    companyFr: r.companyFr,
                    companyEn: r.companyEn,
                    period: r.period,
                    descriptionFr: r.descriptionFr || [],
                    descriptionEn: r.descriptionEn || [],
                    isNew: false,
                  })
                }
              >
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
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
};
