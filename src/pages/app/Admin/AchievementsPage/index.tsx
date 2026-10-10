import React from 'react';
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2, Save, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
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
import {
  useAdminAchievements,
  useCreateAchievement,
  useUpdateAchievement,
  useDeleteAchievement,
} from '@/entities/achievment/hooks/useAchievements';
import {
  ACHIEVEMENT_ICON_KEYS,
  type IAchievementDto,
} from '@/entities/achievment/api/achievement.api';
import { isApiError } from '@/shared/api';
import { QueryState } from '@/shared/ui/QueryState';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

type Draft = {
  id?: string;
  iconKey: string;
  value: string;
  labelFr: string;
  labelEn: string;
  isNew?: boolean;
};

const emptyItem = (): Draft => ({
  iconKey: 'trophy',
  value: '',
  labelFr: '',
  labelEn: '',
  isNew: true,
});

export const AdminAchievementsPage: React.FC = () => {
  const { language } = useLanguageStore();
  const fr = language === 'fr';
  const { data, isPending, isError, error } = useAdminAchievements();
  const create = useCreateAchievement();
  const update = useUpdateAchievement();
  const remove = useDeleteAchievement();
  const [editing, setEditing] = React.useState<Draft | null>(null);
  const [pending, setPending] = React.useState<IAchievementDto | null>(null);
  const [reorderingId, setReorderingId] = React.useState<string | null>(null);
  const { editorRef, tableRef } = useScrollToEditor(editing);
  const saving = create.isPending || update.isPending;
  const items = React.useMemo(() => sortBySortOrder(data?.items ?? []), [data?.items]);

  const save = async () => {
    if (!editing) return;
    const payload = {
      iconKey: editing.iconKey,
      value: editing.value.trim(),
      labelFr: editing.labelFr.trim(),
      labelEn: editing.labelEn.trim(),
    };
    if (!payload.value || !payload.labelFr || !payload.labelEn) {
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
        title={fr ? 'Réalisations' : 'Achievements'}
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
              <Field label="Icon key">
                <Select
                  value={editing.iconKey}
                  onValueChange={(v) => setEditing({ ...editing, iconKey: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ACHIEVEMENT_ICON_KEYS.map((key) => (
                      <SelectItem key={key} value={key}>
                        {key}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label={fr ? 'Valeur' : 'Value'} required>
                <Input
                  value={editing.value}
                  onChange={(e) => setEditing({ ...editing, value: e.target.value })}
                  placeholder="50+"
                />
              </Field>
              <BilingualField
                label={fr ? 'Label' : 'Label'}
                valueFr={editing.labelFr}
                valueEn={editing.labelEn}
                onChangeFr={(v) => setEditing({ ...editing, labelFr: v })}
                onChangeEn={(v) => setEditing({ ...editing, labelEn: v })}
              />
            </div>
          </AdminSectionCard>
        </div>
      ) : null}

      <div ref={tableRef}>
        <QueryState
          isPending={isPending}
          isError={isError}
          errorMessage={isApiError(error) ? error.message : undefined}
          empty={!isPending && !isError && items.length === 0}
          emptyTitle={fr ? 'Aucune réalisation' : 'No achievements'}
        >
          <AdminDataTable
            data={items}
            getRowId={(r) => String(r.id)}
            searchKeys={['value', 'labelFr', 'labelEn', 'iconKey']}
            emptyTitle={fr ? 'Aucun élément' : 'No items'}
            columns={[
              {
                key: 'value',
                header: fr ? 'Valeur' : 'Value',
                render: (r) => <span className="font-medium">{r.value}</span>,
              },
              {
                key: 'label',
                header: 'Label',
                render: (r) => (fr ? r.labelFr : r.labelEn),
              },
              { key: 'iconKey', header: 'Icon' },
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
                    onClick={() =>
                      setEditing({
                        id: r.id,
                        iconKey: r.iconKey,
                        value: r.value,
                        labelFr: r.labelFr,
                        labelEn: r.labelEn,
                        isNew: false,
                      })
                    }
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
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
};
