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
  type IProfessionalReference,
} from '@/features/admin-cms';
import {
  useAdminReferences,
  useCreateReference,
  useUpdateReference,
  useDeleteReference,
} from '@/entities/references/hooks/useReferences';
import { isApiError } from '@/shared/api';
import { QueryState } from '@/shared/ui/QueryState';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

type Draft = {
  id?: string;
  name: string;
  roleFr: string;
  roleEn: string;
  company: string;
  email: string;
  phone: string;
  isNew?: boolean;
};

const emptyItem = (): Draft => ({
  name: '',
  roleFr: '',
  roleEn: '',
  company: '',
  email: '',
  phone: '',
  isNew: true,
});

export const AdminReferencesPage: React.FC = () => {
  const { language } = useLanguageStore();
  const fr = language === 'fr';
  const { data, isPending, isError, error } = useAdminReferences();
  const create = useCreateReference();
  const update = useUpdateReference();
  const remove = useDeleteReference();
  const [editing, setEditing] = React.useState<Draft | null>(null);
  const [pending, setPending] = React.useState<IProfessionalReference | null>(null);
  const saving = create.isPending || update.isPending;
  const items = data?.items ?? [];

  const save = async () => {
    if (!editing) return;
    const payload = {
      name: editing.name.trim(),
      roleFr: editing.roleFr.trim(),
      roleEn: editing.roleEn.trim(),
      company: editing.company.trim(),
      email: editing.email.trim(),
      phone: editing.phone.trim(),
    };
    if (!payload.name) {
      toast.error(fr ? 'Le nom est requis' : 'Name is required');
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
        title={fr ? 'Références professionnelles' : 'Professional references'}
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
            <Field label={fr ? 'Nom' : 'Name'} required>
              <Input
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              />
            </Field>
            <Field label={fr ? 'Société' : 'Company'}>
              <Input
                value={editing.company}
                onChange={(e) => setEditing({ ...editing, company: e.target.value })}
              />
            </Field>
            <BilingualField
              label={fr ? 'Rôle' : 'Role'}
              valueFr={editing.roleFr}
              valueEn={editing.roleEn}
              onChangeFr={(v) => setEditing({ ...editing, roleFr: v })}
              onChangeEn={(v) => setEditing({ ...editing, roleEn: v })}
            />
            <Field label="Email">
              <Input
                value={editing.email}
                onChange={(e) => setEditing({ ...editing, email: e.target.value })}
              />
            </Field>
            <Field label={fr ? 'Téléphone' : 'Phone'}>
              <Input
                value={editing.phone}
                onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
              />
            </Field>
          </div>
        </AdminSectionCard>
      ) : null}

      <QueryState
        isPending={isPending}
        isError={isError}
        errorMessage={isApiError(error) ? error.message : undefined}
        empty={!isPending && !isError && items.length === 0}
        emptyTitle={fr ? 'Aucune référence' : 'No references'}
      >
        <AdminDataTable
          data={items}
          getRowId={(r) => String(r.id)}
          searchKeys={['name', 'company', 'roleFr', 'roleEn', 'email']}
          emptyTitle={fr ? 'Aucun élément' : 'No items'}
          columns={[
            {
              key: 'name',
              header: fr ? 'Nom' : 'Name',
              render: (r) => (
                <div>
                  <p className="font-medium">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.company}</p>
                </div>
              ),
            },
            {
              key: 'role',
              header: fr ? 'Rôle' : 'Role',
              render: (r) => (fr ? r.roleFr : r.roleEn),
            },
            { key: 'email', header: 'Email' },
          ]}
          actions={(r) => (
            <>
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() =>
                  setEditing({
                    id: r.id,
                    name: r.name,
                    roleFr: r.roleFr,
                    roleEn: r.roleEn,
                    company: r.company,
                    email: r.email,
                    phone: r.phone,
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
