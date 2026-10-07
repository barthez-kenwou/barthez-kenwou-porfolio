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

const emptyItem = () => ({ id: createId('cert'), name: '', issuer: '', year: '', link: '' });

export const AdminCertificationsPage: React.FC = () => {
  const { language } = useLanguageStore();
  const fr = language === 'fr';
  const items = useAdminCmsStore((s) => s.certifications);
  const upsert = useAdminCmsStore((s) => s.upsertCertification);
  const remove = useAdminCmsStore((s) => s.deleteCertification);
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
        title={fr ? 'Certifications' : 'Certifications'}
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
            <Field label={fr ? 'Organisme' : 'Issuer'}>
              <Input
                value={editing.issuer}
                onChange={(e) => setEditing({ ...editing, issuer: e.target.value })}
              />
            </Field>
            <Field label={fr ? 'Année' : 'Year'}>
              <Input
                value={editing.year}
                onChange={(e) => setEditing({ ...editing, year: e.target.value })}
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
            render: (r: any) => <span className="font-medium">{r.name}</span>,
          },
          { key: 'issuer', header: fr ? 'Organisme' : 'Issuer' },
          { key: 'year', header: fr ? 'Année' : 'Year' },
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
