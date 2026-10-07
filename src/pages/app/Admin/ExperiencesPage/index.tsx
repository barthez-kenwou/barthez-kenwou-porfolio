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
  id: createId('exp'),
  titleFr: '',
  titleEn: '',
  companyFr: '',
  companyEn: '',
  period: '',
  descriptionFr: [],
  descriptionEn: [],
});

export const AdminExperiencesPage: React.FC = () => {
  const { language } = useLanguageStore();
  const fr = language === 'fr';
  const items = useAdminCmsStore((s) => s.experiences);
  const upsert = useAdminCmsStore((s) => s.upsertExperience);
  const remove = useAdminCmsStore((s) => s.deleteExperience);
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
                values={editing.descriptionFr || []}
                onChange={(v) => setEditing({ ...editing, descriptionFr: v })}
              />
            </div>
            <div className="md:col-span-2">
              <StringListEditor
                label={fr ? 'Description EN' : 'Description EN'}
                values={editing.descriptionEn || []}
                onChange={(v) => setEditing({ ...editing, descriptionEn: v })}
              />
            </div>
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
            key: 'title',
            header: fr ? 'Poste' : 'Title',
            render: (r: any) => (
              <div>
                <p className="font-medium">{fr ? r.titleFr : r.titleEn}</p>
                <p className="text-xs text-muted-foreground">{fr ? r.companyFr : r.companyEn}</p>
              </div>
            ),
          },
          { key: 'period', header: fr ? 'Période' : 'Period' },
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
