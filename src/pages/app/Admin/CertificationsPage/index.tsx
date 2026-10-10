import React from 'react';
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2, Save, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  AdminPageHeader,
  AdminDataTable,
  AdminSectionCard,
  AdminStickyActions,
  ConfirmDeleteDialog,
  Field,
  getReorderTargets,
  sortBySortOrder,
  useScrollToEditor,
} from '@/features/admin-cms';
import {
  useAdminCertifications,
  useCreateCertification,
  useUpdateCertification,
  useDeleteCertification,
} from '@/entities/certifications/hooks/useCertifications';
import type { ICertificationDto } from '@/entities/certifications/api/certification.api';
import { isApiError } from '@/shared/api';
import { QueryState } from '@/shared/ui/QueryState';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

type Draft = {
  id?: string;
  name: string;
  issuer: string;
  year: string;
  link: string;
  isNew?: boolean;
};

const emptyItem = (): Draft => ({
  name: '',
  issuer: '',
  year: '',
  link: '',
  isNew: true,
});

export const AdminCertificationsPage: React.FC = () => {
  const { language } = useLanguageStore();
  const fr = language === 'fr';
  const { data, isPending, isError, error } = useAdminCertifications();
  const create = useCreateCertification();
  const update = useUpdateCertification();
  const remove = useDeleteCertification();
  const [editing, setEditing] = React.useState<Draft | null>(null);
  const [pending, setPending] = React.useState<ICertificationDto | null>(null);
  const [reorderingId, setReorderingId] = React.useState<string | null>(null);
  const { editorRef, tableRef } = useScrollToEditor(editing);
  const saving = create.isPending || update.isPending;
  const items = React.useMemo(() => sortBySortOrder(data?.items ?? []), [data?.items]);

  const save = async () => {
    if (!editing) return;
    const payload = {
      name: editing.name.trim(),
      issuer: editing.issuer.trim(),
      year: editing.year.trim(),
      link: editing.link.trim() || undefined,
    };
    if (!payload.name || !payload.issuer) {
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
        title={fr ? 'Certifications' : 'Certifications'}
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
              <Field label={fr ? 'Nom' : 'Name'} required>
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
                  value={editing.link}
                  onChange={(e) => setEditing({ ...editing, link: e.target.value })}
                />
              </Field>
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
          emptyTitle={fr ? 'Aucune certification' : 'No certifications'}
        >
          <AdminDataTable
            data={items}
            getRowId={(r) => String(r.id)}
            searchKeys={['name', 'issuer', 'year']}
            emptyTitle={fr ? 'Aucun élément' : 'No items'}
            columns={[
              {
                key: 'name',
                header: fr ? 'Nom' : 'Name',
                render: (r) => <span className="font-medium">{r.name}</span>,
              },
              { key: 'issuer', header: fr ? 'Organisme' : 'Issuer' },
              { key: 'year', header: fr ? 'Année' : 'Year' },
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
                        name: r.name,
                        issuer: r.issuer,
                        year: r.year,
                        link: r.link || '',
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
