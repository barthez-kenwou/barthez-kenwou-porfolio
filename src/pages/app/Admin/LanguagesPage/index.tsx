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
  useAdminLanguages,
  useCreateLanguage,
  useUpdateLanguage,
  useDeleteLanguage,
} from '@/entities/languages/hooks/useLanguages';
import type { LanguageDto } from '@/entities/languages/api/language.api';
import { isApiError } from '@/shared/api';
import { QueryState } from '@/shared/ui/QueryState';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

type Draft = {
  id?: string;
  language: string;
  proficiencyFr: string;
  proficiencyEn: string;
  isNew?: boolean;
};

const emptyItem = (): Draft => ({
  language: '',
  proficiencyFr: '',
  proficiencyEn: '',
  isNew: true,
});

export const AdminLanguagesPage: React.FC = () => {
  const { language } = useLanguageStore();
  const fr = language === 'fr';
  const { data, isPending, isError, error } = useAdminLanguages();
  const create = useCreateLanguage();
  const update = useUpdateLanguage();
  const remove = useDeleteLanguage();
  const [editing, setEditing] = React.useState<Draft | null>(null);
  const [pending, setPending] = React.useState<LanguageDto | null>(null);
  const saving = create.isPending || update.isPending;
  const items = data?.items ?? [];

  const save = async () => {
    if (!editing) return;
    const payload = {
      language: editing.language.trim(),
      proficiencyFr: editing.proficiencyFr.trim(),
      proficiencyEn: editing.proficiencyEn.trim(),
    };
    if (!payload.language || !payload.proficiencyFr || !payload.proficiencyEn) {
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
        title={fr ? 'Langues' : 'Languages'}
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
            <Field label={fr ? 'Langue' : 'Language'} required>
              <Input
                value={editing.language}
                onChange={(e) => setEditing({ ...editing, language: e.target.value })}
              />
            </Field>
            <BilingualField
              label={fr ? 'Niveau' : 'Proficiency'}
              valueFr={editing.proficiencyFr}
              valueEn={editing.proficiencyEn}
              onChangeFr={(v) => setEditing({ ...editing, proficiencyFr: v })}
              onChangeEn={(v) => setEditing({ ...editing, proficiencyEn: v })}
            />
          </div>
        </AdminSectionCard>
      ) : null}

      <QueryState
        isPending={isPending}
        isError={isError}
        errorMessage={isApiError(error) ? error.message : undefined}
        empty={!isPending && !isError && items.length === 0}
        emptyTitle={fr ? 'Aucune langue' : 'No languages'}
      >
        <AdminDataTable
          data={items}
          getRowId={(r) => String(r.id)}
          searchKeys={['language', 'proficiencyFr', 'proficiencyEn']}
          emptyTitle={fr ? 'Aucun élément' : 'No items'}
          columns={[
            {
              key: 'language',
              header: fr ? 'Langue' : 'Language',
              render: (r) => <span className="font-medium">{r.language}</span>,
            },
            {
              key: 'proficiency',
              header: fr ? 'Niveau' : 'Proficiency',
              render: (r) => (fr ? r.proficiencyFr : r.proficiencyEn),
            },
          ]}
          actions={(r) => (
            <>
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() =>
                  setEditing({
                    id: r.id,
                    language: r.language,
                    proficiencyFr: r.proficiencyFr,
                    proficiencyEn: r.proficiencyEn,
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
