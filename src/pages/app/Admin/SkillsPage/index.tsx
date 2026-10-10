import React from 'react';
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2, Save, X, Loader2 } from 'lucide-react';
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
  AdminStickyActions,
  ConfirmDeleteDialog,
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

type SkillDraft = Omit<ISkillDto, 'id'> & { id?: string };

const emptyItem = (): SkillDraft => ({
  name: '',
  category: 'cloud',
  level: 80,
  icon: '',
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
  const items = React.useMemo(() => sortBySortOrder(data?.items ?? []), [data?.items]);
  const [editing, setEditing] = React.useState<SkillDraft | null>(null);
  const [pending, setPending] = React.useState<ISkillDto | null>(null);
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
        title={fr ? 'Compétences' : 'Skills'}
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
            searchKeys={['name', 'category']}
            emptyTitle={fr ? 'Aucune compétence' : 'No skills'}
            filters={
              Array.from(new Set(items.map((i) => i.category).filter(Boolean))).length
                ? [
                    {
                      key: 'category',
                      label: fr ? 'Catégorie' : 'Category',
                      options: Array.from(
                        new Set(items.map((i) => i.category).filter(Boolean)),
                      ).map((c) => ({ value: String(c), label: String(c) })),
                    },
                  ]
                : []
            }
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
