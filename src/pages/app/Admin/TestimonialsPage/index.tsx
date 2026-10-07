import React from 'react';
import { Check, Link2, Pencil, Plus, Trash2, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import type {
  ITestimonial,
  TestimonialStatus,
} from '@/entities/testimonies/model/testimonial.types';
import {
  AdminPageHeader,
  AdminDataTable,
  AdminSectionCard,
  ConfirmDeleteDialog,
  BilingualField,
  Field,
  createId,
  useAdminCmsStore,
} from '@/features/admin-cms';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Badge } from '@/shared/ui/badge';
import { Switch } from '@/shared/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

const FEEDBACK_PATH = '/feedback';

const emptyItem = (): ITestimonial => ({
  id: createId('tst'),
  nameFr: '',
  nameEn: '',
  roleFr: '',
  roleEn: '',
  textFr: '',
  textEn: '',
  rating: 5,
  company: '',
  email: '',
  isPublished: false,
  status: 'approved',
  source: 'admin',
  createdAt: new Date().toISOString(),
});

export const AdminTestimonialsPage: React.FC = () => {
  const { language } = useLanguageStore();
  const fr = language === 'fr';
  const items = useAdminCmsStore((s) => s.testimonials);
  const upsert = useAdminCmsStore((s) => s.upsertTestimonial);
  const remove = useAdminCmsStore((s) => s.deleteTestimonial);
  const [editing, setEditing] = React.useState<ITestimonial | null>(null);
  const [pending, setPending] = React.useState<ITestimonial | null>(null);

  const copyFeedbackLink = () => {
    void navigator.clipboard.writeText(`${window.location.origin}${FEEDBACK_PATH}`);
    toast.success(fr ? 'Lien vitrine copié' : 'Public feedback link copied');
  };

  const save = () => {
    if (!editing) return;
    if (!editing.nameFr.trim() || !editing.textFr.trim()) {
      toast.error(fr ? 'Nom et texte FR requis' : 'FR name and quote required');
      return;
    }
    upsert({
      ...editing,
      nameEn: editing.nameEn || editing.nameFr,
      roleEn: editing.roleEn || editing.roleFr,
      textEn: editing.textEn || editing.textFr,
    });
    toast.success(fr ? 'Enregistré' : 'Saved');
    setEditing(null);
  };

  const setPublished = (row: ITestimonial, value: boolean) => {
    upsert({
      ...row,
      isPublished: value,
      status: value ? 'approved' : row.status === 'pending' ? 'pending' : 'approved',
    });
  };

  const approve = (row: ITestimonial) => {
    upsert({ ...row, status: 'approved', isPublished: true });
    toast.success(fr ? 'Approuvé et publié' : 'Approved & published');
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={fr ? 'Témoignages' : 'Testimonials'}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={copyFeedbackLink}>
              <Link2 className="size-4" />
              {fr ? 'Lien client' : 'Client link'}
            </Button>
            <Button onClick={() => setEditing(emptyItem())}>
              <Plus className="size-4" />
              {fr ? 'Ajouter' : 'Add'}
            </Button>
          </div>
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
              label={fr ? 'Nom' : 'Name'}
              valueFr={editing.nameFr}
              valueEn={editing.nameEn}
              onChangeFr={(v) => setEditing({ ...editing, nameFr: v })}
              onChangeEn={(v) => setEditing({ ...editing, nameEn: v })}
            />
            <BilingualField
              label={fr ? 'Rôle' : 'Role'}
              valueFr={editing.roleFr}
              valueEn={editing.roleEn}
              onChangeFr={(v) => setEditing({ ...editing, roleFr: v })}
              onChangeEn={(v) => setEditing({ ...editing, roleEn: v })}
            />
            <Field label={fr ? 'Entreprise' : 'Company'}>
              <Input
                value={editing.company || ''}
                onChange={(e) => setEditing({ ...editing, company: e.target.value })}
              />
            </Field>
            <Field label="Email">
              <Input
                type="email"
                value={editing.email || ''}
                onChange={(e) => setEditing({ ...editing, email: e.target.value })}
              />
            </Field>
            <div className="md:col-span-2">
              <BilingualField
                label={fr ? 'Texte' : 'Quote'}
                multiline
                valueFr={editing.textFr}
                valueEn={editing.textEn}
                onChangeFr={(v) => setEditing({ ...editing, textFr: v })}
                onChangeEn={(v) => setEditing({ ...editing, textEn: v })}
              />
            </div>
            <Field label={fr ? 'Note' : 'Rating'}>
              <Input
                type="number"
                min={1}
                max={5}
                value={editing.rating}
                onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })}
              />
            </Field>
            <Field label="Status">
              <Select
                value={editing.status || 'approved'}
                onValueChange={(v) => setEditing({ ...editing, status: v as TestimonialStatus })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">{fr ? 'En attente' : 'Pending'}</SelectItem>
                  <SelectItem value="approved">{fr ? 'Approuvé' : 'Approved'}</SelectItem>
                  <SelectItem value="rejected">{fr ? 'Rejeté' : 'Rejected'}</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <div className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 md:col-span-2">
              <span className="text-sm">{fr ? 'Visible sur le site' : 'Visible on site'}</span>
              <Switch
                checked={!!editing.isPublished}
                onCheckedChange={(v) => setEditing({ ...editing, isPublished: v })}
              />
            </div>
          </div>
        </AdminSectionCard>
      ) : null}

      <AdminDataTable<ITestimonial>
        data={items}
        getRowId={(r) => String(r.id)}
        searchKeys={[
          'nameFr',
          'nameEn',
          'roleFr',
          'roleEn',
          'company',
          'email',
          'textFr',
          'textEn',
        ]}
        emptyTitle={fr ? 'Aucun témoignage' : 'No testimonials'}
        filters={[
          {
            key: 'status',
            label: 'Status',
            options: [
              { value: 'pending', label: fr ? 'En attente' : 'Pending' },
              { value: 'approved', label: fr ? 'Approuvé' : 'Approved' },
              { value: 'rejected', label: fr ? 'Rejeté' : 'Rejected' },
            ],
            match: (row, selected) => (row.status || 'approved') === selected,
          },
          {
            key: 'isPublished',
            label: fr ? 'Visibilité' : 'Visibility',
            options: [
              { value: 'true', label: fr ? 'Public' : 'Public' },
              { value: 'false', label: fr ? 'Privé' : 'Private' },
            ],
            match: (row, selected) => {
              const pub = !!row.isPublished;
              return selected === 'true' ? pub : !pub;
            },
          },
        ]}
        columns={[
          {
            key: 'name',
            header: fr ? 'Nom' : 'Name',
            render: (r) => (
              <div>
                <p className="font-medium">{fr ? r.nameFr : r.nameEn}</p>
                <p className="text-xs text-muted-foreground">
                  {[fr ? r.roleFr : r.roleEn, r.company].filter(Boolean).join(' · ')}
                </p>
              </div>
            ),
          },
          {
            key: 'rating',
            header: fr ? 'Note' : 'Rating',
            render: (r) => `${r.rating}/5`,
          },
          {
            key: 'status',
            header: 'Status',
            render: (r) => {
              const status = r.status || 'approved';
              return (
                <Badge
                  variant={
                    status === 'pending'
                      ? 'warning'
                      : status === 'approved'
                        ? 'success'
                        : 'secondary'
                  }
                >
                  {status}
                </Badge>
              );
            },
          },
          {
            key: 'isPublished',
            header: fr ? 'Public' : 'Public',
            render: (r) => (
              <Switch
                checked={!!r.isPublished}
                onCheckedChange={(v) => setPublished(r, v)}
                aria-label={fr ? 'Visibilité' : 'Visibility'}
              />
            ),
          },
          {
            key: 'source',
            header: fr ? 'Source' : 'Source',
            hideOnMobile: true,
            render: (r) => (
              <span className="text-xs text-muted-foreground">{r.source || 'admin'}</span>
            ),
          },
        ]}
        actions={(r) => (
          <>
            {r.status === 'pending' ? (
              <Button
                size="icon-sm"
                variant="ghost"
                title={fr ? 'Approuver' : 'Approve'}
                onClick={() => approve(r)}
              >
                <Check className="size-3.5 text-emerald-500" />
              </Button>
            ) : null}
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
