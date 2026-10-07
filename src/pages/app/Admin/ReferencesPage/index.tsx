import React from 'react';
import { Pencil, Plus, Trash2, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  AdminPageHeader,
  AdminDataTable,
  AdminSectionCard,
  ConfirmDeleteDialog,
  BilingualField,
  Field,
  StringListEditor,
  createId,
  useAdminCmsStore,
} from '@/features/admin-cms';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';

const emptyItem = () => ({
  id: createId('ref'),
  name: '',
  roleFr: '',
  roleEn: '',
  company: '',
  email: '',
  phone: '',
});

export const AdminReferencesPage: React.FC = () => {
  const { language } = useLanguageStore();
  const fr = language === 'fr';
  const items = useAdminCmsStore((s) => s.references);
  const upsert = useAdminCmsStore((s) => s.upsertReference);
  const remove = useAdminCmsStore((s) => s.deleteReference);
  const [editing, setEditing] = React.useState<any | null>(null);
  const [pending, setPending] = React.useState<any | null>(null);

  const save = () => {
    if (!editing) return;
    upsert(editing);
    toast.success(fr ? 'Enregistré' : 'Saved');
    setEditing(null);
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
              <Button variant="outline" size="sm" onClick={() => setEditing(null)}>
                <X className="size-3.5" /> {fr ? 'Fermer' : 'Close'}
              </Button>
              <Button size="sm" onClick={save}>
                <Save className="size-3.5" /> {fr ? 'Enregistrer' : 'Save'}
              </Button>
            </div>
          }
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field label={fr ? 'Nom' : 'Name'}>
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

      <AdminDataTable
        data={items}
        getRowId={(r: any) => String(r.id)}
        searchKeys={[
          'nameFr',
          'nameEn',
          'name',
          'titleFr',
          'titleEn',
          'title',
          'company',
          'companyFr',
          'companyEn',
          'role',
          'category',
        ]}
        emptyTitle={fr ? 'Aucun élément' : 'No items'}
        columns={[
          {
            key: 'name',
            header: fr ? 'Nom' : 'Name',
            render: (r: any) => (
              <div>
                <p className="font-medium">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.company}</p>
              </div>
            ),
          },
          {
            key: 'role',
            header: fr ? 'Rôle' : 'Role',
            render: (r: any) => (fr ? r.roleFr : r.roleEn),
          },
          { key: 'email', header: 'Email' },
        ]}
        actions={(r: any) => (
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

      <ConfirmDeleteDialog
        open={!!pending}
        onOpenChange={(o) => !o && setPending(null)}
        onConfirm={() => {
          if (!pending) return;
          remove(pending.id);
          toast.success(fr ? 'Supprimé' : 'Deleted');
          setPending(null);
        }}
      />
    </div>
  );
};
