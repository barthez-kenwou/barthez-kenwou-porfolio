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
  id: createId('skill'),
  name: '',
  category: 'cloud',
  level: 80,
  icon: '',
});

export const AdminSkillsPage: React.FC = () => {
  const { language } = useLanguageStore();
  const fr = language === 'fr';
  const items = useAdminCmsStore((s) => s.skills);
  const upsert = useAdminCmsStore((s) => s.upsertSkill);
  const remove = useAdminCmsStore((s) => s.deleteSkill);
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
              <Button size="sm" onClick={save}>
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
            render: (r: any) => `${r.level}%`,
          },
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
