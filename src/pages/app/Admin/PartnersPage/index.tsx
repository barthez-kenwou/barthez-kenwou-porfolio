import React from 'react';
import {
  ChevronDown,
  ChevronUp,
  Pencil,
  Plus,
  Trash2,
  Save,
  X,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  AdminPageHeader,
  AdminDataTable,
  AdminSectionCard,
  AdminStickyActions,
  ConfirmDeleteDialog,
  BilingualField,
  Field,
  MediaCoverField,
  getReorderTargets,
  sortBySortOrder,
  useScrollToEditor,
} from '@/features/admin-cms';
import {
  useAdminPartners,
  useCreatePartner,
  useUpdatePartner,
  useDeletePartner,
  type IPartner,
} from '@/entities/partners';
import { isApiError } from '@/shared/api';
import { LOGO_COMPRESS } from '@/shared/lib/compressImage';
import { QueryState } from '@/shared/ui/QueryState';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Switch } from '@/shared/ui/switch';

type Draft = {
  id?: string;
  name: string;
  logoUrl: string;
  websiteUrl: string;
  descriptionFr: string;
  descriptionEn: string;
  relationFr: string;
  relationEn: string;
  isPublished: boolean;
  isNew?: boolean;
};

const emptyItem = (): Draft => ({
  name: '',
  logoUrl: '',
  websiteUrl: '',
  descriptionFr: '',
  descriptionEn: '',
  relationFr: '',
  relationEn: '',
  isPublished: true,
  isNew: true,
});

export const AdminPartnersPage: React.FC = () => {
  const { language } = useLanguageStore();
  const fr = language === 'fr';
  const { data, isPending, isError, error } = useAdminPartners();
  const create = useCreatePartner();
  const update = useUpdatePartner();
  const remove = useDeletePartner();
  const [editing, setEditing] = React.useState<Draft | null>(null);
  const [pending, setPending] = React.useState<IPartner | null>(null);
  const [reorderingId, setReorderingId] = React.useState<string | null>(null);
  const { editorRef, tableRef } = useScrollToEditor(editing);
  const saving = create.isPending || update.isPending;
  const items = React.useMemo(() => sortBySortOrder(data?.items ?? []), [data?.items]);

  const save = async () => {
    if (!editing) return;
    const payload = {
      name: editing.name.trim(),
      logoUrl: editing.logoUrl.trim(),
      websiteUrl: editing.websiteUrl.trim() || undefined,
      descriptionFr: editing.descriptionFr.trim() || undefined,
      descriptionEn: editing.descriptionEn.trim() || undefined,
      relationFr: editing.relationFr.trim() || undefined,
      relationEn: editing.relationEn.trim() || undefined,
      isPublished: editing.isPublished,
    };
    if (!payload.name) {
      toast.error(fr ? 'Le nom de la structure est requis' : 'Organization name is required');
      return;
    }
    if (!payload.logoUrl) {
      toast.error(fr ? 'Le logo est requis' : 'Logo is required');
      return;
    }
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

  const reorder = async (id: string, direction: 'up' | 'down') => {
    const patches = getReorderTargets(items, id, direction);
    if (!patches.length) return;
    setReorderingId(id);
    try {
      await Promise.all(
        patches.map((p) =>
          update.mutateAsync({ id: p.id, payload: { sortOrder: p.sortOrder } }),
        ),
      );
    } catch (e) {
      toast.error(isApiError(e) ? e.message : fr ? 'Échec du réordonnancement' : 'Reorder failed');
    } finally {
      setReorderingId(null);
    }
  };

  const togglePublished = async (row: IPartner, value: boolean) => {
    try {
      await update.mutateAsync({ id: String(row.id), payload: { isPublished: value } });
    } catch (e) {
      toast.error(isApiError(e) ? e.message : fr ? 'Échec de la mise à jour' : 'Update failed');
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

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={fr ? 'Partenaires & logos' : 'Partners & logos'}
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
            title={editing.isNew ? (fr ? 'Nouveau partenaire' : 'New partner') : fr ? 'Édition' : 'Editor'}
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
                  {saving ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Save className="size-3.5" />
                  )}
                  {fr ? 'Enregistrer' : 'Save'}
                </Button>
              </AdminStickyActions>
            }
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field label={fr ? 'Nom de la structure' : 'Organization name'} required>
                <Input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  placeholder="ZENORA, GTA, …"
                />
              </Field>
              <Field label={fr ? 'Site web (optionnel)' : 'Website (optional)'}>
                <Input
                  value={editing.websiteUrl}
                  onChange={(e) => setEditing({ ...editing, websiteUrl: e.target.value })}
                  placeholder="https://"
                />
              </Field>

              <div className="md:col-span-2">
                <MediaCoverField
                  label={fr ? 'Logo' : 'Logo'}
                  value={editing.logoUrl}
                  onChange={(url) => setEditing({ ...editing, logoUrl: url })}
                  layout="aside"
                  previewFit="contain"
                  // Same shell as TrustedBySection PartnerLogoCell
                  previewClassName="h-[4.5rem] w-full max-w-[14rem] bg-background/30 px-4 py-3"
                  previewImgClassName="max-h-10 max-w-[8.5rem] opacity-90"
                  compressOptions={LOGO_COMPRESS}
                />
              </div>

              <BilingualField
                label={fr ? 'Relation' : 'Relation'}
                valueFr={editing.relationFr}
                valueEn={editing.relationEn}
                onChangeFr={(v) => setEditing({ ...editing, relationFr: v })}
                onChangeEn={(v) => setEditing({ ...editing, relationEn: v })}
                placeholderFr="Client · Employeur · Partenaire"
                placeholderEn="Client · Employer · Partner"
              />

              <BilingualField
                label={fr ? 'Contexte (optionnel)' : 'Context (optional)'}
                valueFr={editing.descriptionFr}
                valueEn={editing.descriptionEn}
                onChangeFr={(v) => setEditing({ ...editing, descriptionFr: v })}
                onChangeEn={(v) => setEditing({ ...editing, descriptionEn: v })}
                multiline
                placeholderFr="Mission, produit, durée…"
                placeholderEn="Mission, product, duration…"
              />

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
          <AdminDataTable
            data={items}
            getRowId={(r) => String(r.id)}
            searchKeys={['name', 'relationFr', 'relationEn', 'websiteUrl']}
            emptyTitle={fr ? 'Aucun partenaire' : 'No partners'}
            emptyDescription={
              fr
                ? 'Ajoutez les logos des structures qui ont fait confiance à votre expertise.'
                : 'Add logos of organizations that trusted your expertise.'
            }
            filters={
              items.length
                ? [
                    {
                      key: 'isPublished',
                      label: fr ? 'Visibilité' : 'Visibility',
                      options: [
                        { value: 'true', label: fr ? 'Publié' : 'Published' },
                        { value: 'false', label: fr ? 'Masqué' : 'Hidden' },
                      ],
                      match: (row, selected) => String(row.isPublished !== false) === selected,
                    },
                  ]
                : []
            }
            columns={[
              {
                key: 'logo',
                header: 'Logo',
                render: (r) =>
                  r.logoUrl ? (
                    <img
                      src={r.logoUrl}
                      alt=""
                      className="h-8 w-14 object-contain object-left"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  ),
              },
              {
                key: 'name',
                header: fr ? 'Structure' : 'Organization',
                render: (r) => <span className="font-medium">{r.name}</span>,
              },
              {
                key: 'relation',
                header: fr ? 'Relation' : 'Relation',
                render: (r) => (
                  <span className="text-muted-foreground">
                    {(fr ? r.relationFr : r.relationEn) || '—'}
                  </span>
                ),
              },
              {
                key: 'isPublished',
                header: fr ? 'Visible' : 'Visible',
                render: (r) => (
                  <Switch
                    checked={r.isPublished !== false}
                    onCheckedChange={(v) => void togglePublished(r, v)}
                  />
                ),
              },
            ]}
            actions={(r) => {
              const idx = items.findIndex((x) => x.id === r.id);
              const busy = reorderingId === String(r.id);
              return (
                <>
                  {r.websiteUrl ? (
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      className="size-11 cursor-pointer md:size-8"
                      asChild
                    >
                      <a href={r.websiteUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="size-3.5" />
                      </a>
                    </Button>
                  ) : null}
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    className="size-11 cursor-pointer md:size-8"
                    disabled={idx <= 0 || reorderingId !== null}
                    title={fr ? 'Monter' : 'Move up'}
                    onClick={() => void reorder(String(r.id), 'up')}
                  >
                    {busy ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <ChevronUp className="size-3.5" />
                    )}
                  </Button>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    className="size-11 cursor-pointer md:size-8"
                    disabled={idx >= items.length - 1 || reorderingId !== null}
                    title={fr ? 'Descendre' : 'Move down'}
                    onClick={() => void reorder(String(r.id), 'down')}
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
                        id: String(r.id),
                        name: r.name,
                        logoUrl: r.logoUrl || '',
                        websiteUrl: r.websiteUrl || '',
                        descriptionFr: r.descriptionFr || '',
                        descriptionEn: r.descriptionEn || '',
                        relationFr: r.relationFr || '',
                        relationEn: r.relationEn || '',
                        isPublished: r.isPublished !== false,
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
