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
  const saving = create.isPending || update.isPending;
  const items = data?.items ?? [];

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
      ) : null}

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
          actions={(r) => (
            <>
              <Button
                size="icon-sm"
                variant="ghost"
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
