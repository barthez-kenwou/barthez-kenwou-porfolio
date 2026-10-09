import React from 'react';
import { Pencil, Plus, Trash2, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  useAdminSkills,
  useCreateSkill,
  useUpdateSkill,
  useDeleteSkill,
} from '@/entities/skills/hooks/useSkills';
import type { ISkillDto } from '@/entities/skills/api/Skill.api';
import {
  AdminPageHeader,
  AdminDataTable,
  AdminSectionCard,
  ConfirmDeleteDialog,
  Field,
} from '@/features/admin-cms';
import { isApiError } from '@/shared/api';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { QueryState } from '@/shared/ui/QueryState';

type SkillDraft = Omit<ISkillDto, 'id'> & { id?: string };

const emptyItem = (): SkillDraft => ({
  name: '',
  category: 'cloud',
  level: 80,
  icon: '',
  isPublished: true,
});

const isPersistedId = (id?: string) =>
  Boolean(id && !id.startsWith('tmp') && !id.startsWith('new'));

export const AdminSkillsPage: React.FC = () => {
  const { language } = useLanguageStore();
  const fr = language === 'fr';
  const { data, isPending, isError, error } = useAdminSkills();
  const create = useCreateSkill();
  const update = useUpdateSkill();
  const remove = useDeleteSkill();
  const items = data?.items ?? [];
  const [editing, setEditing] = React.useState<SkillDraft | null>(null);
  const [pending, setPending] = React.useState<ISkillDto | null>(null);

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
        title={fr ? 'Compétences' : 'Skills'}
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
            <Field label={fr ? 'Nom' : 'Name'} required>
              <Input
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              />
            </Field>
            <Field label={fr ? 'Catégorie' : 'Category'}>
              <Input
                value={editing.category}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}
              />
            </Field>
            <Field label={fr ? 'Niveau (0-100)' : 'Level (0-100)'}>
              <Input
                type="number"
                min={0}
                max={100}
                value={editing.level}
                onChange={(e) => setEditing({ ...editing, level: Number(e.target.value) })}
              />
            </Field>
            <Field label="Icon URL">
              <Input
                value={editing.icon}
                onChange={(e) => setEditing({ ...editing, icon: e.target.value })}
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
          searchKeys={['name', 'category']}
          emptyTitle={fr ? 'Aucun élément' : 'No items'}
          columns={[
            {
              key: 'name',
              header: fr ? 'Nom' : 'Name',
              render: (r) => (
                <div className="flex items-center gap-2">
                  {r.icon ? <img src={r.icon} alt="" className="size-5" /> : null}
                  <span className="font-medium">{r.name}</span>
                </div>
              ),
            },
            { key: 'category', header: fr ? 'Catégorie' : 'Category' },
            {
              key: 'level',
              header: fr ? 'Niveau' : 'Level',
              render: (r) => `${r.level}%`,
            },
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
