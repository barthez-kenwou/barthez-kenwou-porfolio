import React from 'react';
import { Check, Link2, Pencil, Plus, Trash2, Save, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type {
  ITestimonial,
  TestimonialStatus,
} from '@/entities/testimonies/model/testimonial.types';
import {
  useAdminTestimonials,
  useCreateTestimonial,
  useUpdateTestimonial,
  useDeleteTestimonial,
  useApproveTestimonial,
  useRejectTestimonial,
} from '@/entities/testimonies/hooks/useTestimonials';
import { useAdminProjects } from '@/entities/projets/hooks/useProjects';
import {
  AdminPageHeader,
  AdminDataTable,
  AdminSectionCard,
  AdminStickyActions,
  ConfirmDeleteDialog,
  BilingualField,
  Field,
  useScrollToEditor,
} from '@/features/admin-cms';
import { isApiError } from '@/shared/api';
import { QueryState } from '@/shared/ui/QueryState';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Badge } from '@/shared/ui/badge';
import { Switch } from '@/shared/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

const FEEDBACK_PATH = '/feedback';
const NO_PROJECT = '__none__';

type Draft = {
  id?: string;
  nameFr: string;
  nameEn: string;
  roleFr: string;
  roleEn: string;
  textFr: string;
  textEn: string;
  rating: number;
  company: string;
  email: string;
  isPublished: boolean;
  status: TestimonialStatus;
  projectId?: string | null;
  source?: 'admin' | 'public-form';
  isNew?: boolean;
};

const emptyItem = (): Draft => ({
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
  projectId: null,
  source: 'admin',
  isNew: true,
});

export const AdminTestimonialsPage: React.FC = () => {
  const { language } = useLanguageStore();
  const fr = language === 'fr';
  const { data, isPending, isError, error } = useAdminTestimonials();
  const { data: projectsData } = useAdminProjects();
  const create = useCreateTestimonial();
  const update = useUpdateTestimonial();
  const remove = useDeleteTestimonial();
  const approveMut = useApproveTestimonial();
  const rejectMut = useRejectTestimonial();
  const [editing, setEditing] = React.useState<Draft | null>(null);
  const [pending, setPending] = React.useState<ITestimonial | null>(null);
  const { editorRef, tableRef } = useScrollToEditor(editing);
  const saving = create.isPending || update.isPending;
  const items = data?.items ?? [];
  const projects = projectsData?.items ?? [];

  const projectTitleById = React.useMemo(() => {
    const map = new Map<string, string>();
    for (const p of projects) {
      map.set(String(p.id), fr ? p.titleFr : p.titleEn);
    }
    return map;
  }, [projects, fr]);

  const copyFeedbackLink = () => {
    void navigator.clipboard.writeText(`${window.location.origin}${FEEDBACK_PATH}`);
    toast.success(fr ? 'Lien vitrine copié' : 'Public feedback link copied');
  };

  const save = async () => {
    if (!editing) return;
    if (!editing.nameFr.trim() || !editing.textFr.trim()) {
      toast.error(fr ? 'Nom et texte FR requis' : 'FR name and quote required');
      return;
    }
    const payload = {
      nameFr: editing.nameFr.trim(),
      nameEn: (editing.nameEn || editing.nameFr).trim(),
      roleFr: editing.roleFr.trim(),
      roleEn: (editing.roleEn || editing.roleFr).trim(),
      textFr: editing.textFr.trim(),
      textEn: (editing.textEn || editing.textFr).trim(),
      rating: editing.rating,
      company: editing.company.trim() || undefined,
      email: editing.email.trim() || undefined,
      isPublished: editing.isPublished,
      status: editing.status,
      projectId: editing.projectId || null,
      source: editing.source || 'admin',
    };
    try {
      if (editing.isNew || !editing.id) {
        await create.mutateAsync(payload);
      } else {
        await update.mutateAsync({ id: String(editing.id), payload });
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
      await remove.mutateAsync(String(pending.id));
      toast.success(fr ? 'Supprimé' : 'Deleted');
      setPending(null);
    } catch (e) {
      toast.error(isApiError(e) ? e.message : fr ? 'Échec de la suppression' : 'Delete failed');
    }
  };

  const setPublished = async (row: ITestimonial, value: boolean) => {
    try {
      await update.mutateAsync({
        id: String(row.id),
        payload: {
          isPublished: value,
          status: value ? 'approved' : row.status === 'pending' ? 'pending' : 'approved',
        },
      });
    } catch (e) {
      toast.error(isApiError(e) ? e.message : fr ? 'Échec' : 'Failed');
    }
  };

  const approve = async (row: ITestimonial) => {
    try {
      await approveMut.mutateAsync(String(row.id));
      toast.success(fr ? 'Approuvé et publié' : 'Approved & published');
    } catch (e) {
      toast.error(isApiError(e) ? e.message : fr ? 'Échec' : 'Failed');
    }
  };

  const reject = async (row: ITestimonial) => {
    try {
      await rejectMut.mutateAsync(String(row.id));
      toast.success(fr ? 'Rejeté' : 'Rejected');
    } catch (e) {
      toast.error(isApiError(e) ? e.message : fr ? 'Échec' : 'Failed');
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={fr ? 'Témoignages' : 'Testimonials'}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" className="cursor-pointer" onClick={copyFeedbackLink}>
              <Link2 className="size-4" />
              {fr ? 'Lien client' : 'Client link'}
            </Button>
            <Button type="button" className="cursor-pointer" onClick={() => setEditing(emptyItem())}>
              <Plus className="size-4" />
              {fr ? 'Ajouter' : 'Add'}
            </Button>
          </div>
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
                  value={editing.company}
                  onChange={(e) => setEditing({ ...editing, company: e.target.value })}
                />
              </Field>
              <Field label="Email">
                <Input
                  type="email"
                  value={editing.email}
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
                  value={editing.status}
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
              <Field label={fr ? 'Projet lié' : 'Linked project'} className="md:col-span-2">
                <Select
                  value={editing.projectId || NO_PROJECT}
                  onValueChange={(v) =>
                    setEditing({ ...editing, projectId: v === NO_PROJECT ? null : v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={fr ? 'Aucun' : 'None'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NO_PROJECT}>{fr ? 'Aucun' : 'None'}</SelectItem>
                    {projects.map((p) => (
                      <SelectItem key={String(p.id)} value={String(p.id)}>
                        {fr ? p.titleFr : p.titleEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <div className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 md:col-span-2">
                <span className="text-sm">{fr ? 'Visible sur le site' : 'Visible on site'}</span>
                <Switch
                  checked={editing.isPublished}
                  onCheckedChange={(v) => setEditing({ ...editing, isPublished: v })}
                />
              </div>
            </div>
          </AdminSectionCard>
        </div>
      ) : null}

      <div ref={tableRef}>
        <QueryState
          isPending={isPending}
          isError={isError}
          errorMessage={isApiError(error) ? error.message : undefined}
        >
          <AdminDataTable<ITestimonial>
            data={items}
            getRowId={(r) => String(r.id)}
            searchKeys={['nameFr', 'nameEn', 'roleFr', 'roleEn', 'company', 'email', 'textFr', 'textEn']}
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
                key: 'project',
                header: fr ? 'Projet' : 'Project',
                hideOnMobile: true,
                render: (r) =>
                  r.projectId
                    ? projectTitleById.get(String(r.projectId)) || String(r.projectId)
                    : '—',
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
                    onCheckedChange={(v) => void setPublished(r, v)}
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
                  <>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      className="size-11 cursor-pointer md:size-8"
                      title={fr ? 'Approuver' : 'Approve'}
                      onClick={() => void approve(r)}
                    >
                      <Check className="size-3.5 text-emerald-500" />
                    </Button>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      className="size-11 cursor-pointer md:size-8"
                      title={fr ? 'Rejeter' : 'Reject'}
                      onClick={() => void reject(r)}
                    >
                      <X className="size-3.5 text-destructive" />
                    </Button>
                  </>
                ) : null}
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  className="size-11 cursor-pointer md:size-8"
                  onClick={() =>
                    setEditing({
                      id: String(r.id),
                      nameFr: r.nameFr,
                      nameEn: r.nameEn,
                      roleFr: r.roleFr,
                      roleEn: r.roleEn,
                      textFr: r.textFr,
                      textEn: r.textEn,
                      rating: r.rating,
                      company: r.company || '',
                      email: r.email || '',
                      isPublished: !!r.isPublished,
                      status: r.status || 'approved',
                      projectId: r.projectId ?? null,
                      source: r.source,
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
            )}
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
