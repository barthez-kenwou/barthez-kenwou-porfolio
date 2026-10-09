import React from 'react';
import { Pencil, Plus, Save, Trash2, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  AdminPageHeader,
  AdminDataTable,
  AdminSectionCard,
  ConfirmDeleteDialog,
  BilingualField,
  BilingualStringListEditor,
  Field,
} from '@/features/admin-cms';
import {
  useAdminServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
} from '@/entities/services/hooks/useServices';
import {
  SERVICE_ICON_KEYS,
  type IServiceDto,
} from '@/entities/services/api/service.api';
import { isApiError } from '@/shared/api';
import { QueryState } from '@/shared/ui/QueryState';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Switch } from '@/shared/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

type Draft = {
  id?: string;
  iconKey: string;
  titleFr: string;
  titleEn: string;
  descFr: string;
  descEn: string;
  featuresFr: string[];
  featuresEn: string[];
  priceEur: number;
  hourly: boolean;
  priceFr: string;
  priceEn: string;
  isNew?: boolean;
};

const emptyItem = (): Draft => ({
  iconKey: 'cloud',
  titleFr: '',
  titleEn: '',
  descFr: '',
  descEn: '',
  featuresFr: [],
  featuresEn: [],
  priceEur: 0,
  hourly: false,
  priceFr: '',
  priceEn: '',
  isNew: true,
});

export const AdminServicesPage: React.FC = () => {
  const { language } = useLanguageStore();
  const fr = language === 'fr';
  const { data, isPending, isError, error } = useAdminServices();
  const create = useCreateService();
  const update = useUpdateService();
  const remove = useDeleteService();
  const [editing, setEditing] = React.useState<Draft | null>(null);
  const [pending, setPending] = React.useState<IServiceDto | null>(null);
  const saving = create.isPending || update.isPending;
  const items = data?.items ?? [];

  const save = async () => {
    if (!editing) return;
    const payload = {
      iconKey: editing.iconKey,
      titleFr: editing.titleFr.trim(),
      titleEn: editing.titleEn.trim(),
      descFr: editing.descFr.trim(),
      descEn: editing.descEn.trim(),
      featuresFr: editing.featuresFr,
      featuresEn: editing.featuresEn,
      priceEur: editing.priceEur,
      hourly: editing.hourly,
      priceFr: editing.priceFr.trim(),
      priceEn: editing.priceEn.trim(),
    };
    if (!payload.titleFr || !payload.titleEn) {
      toast.error(fr ? 'Titres FR/EN requis' : 'FR/EN titles required');
      return;
    }
    try {
      if (editing.isNew || !editing.id) {
        await create.mutateAsync(payload);
      } else {
        await update.mutateAsync({ id: editing.id, payload });
      }
      toast.success(fr ? 'Service enregistré' : 'Service saved');
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
        title="Services"
        actions={
          <Button onClick={() => setEditing(emptyItem())}>
            <Plus className="size-4" />
            {fr ? 'Ajouter' : 'Add'}
          </Button>
        }
      />

      {editing ? (
        <AdminSectionCard
          title={fr ? 'Édition service' : 'Edit service'}
          actions={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditing(null)} disabled={saving}>
                <X className="size-3.5" />
                {fr ? 'Fermer' : 'Close'}
              </Button>
              <Button size="sm" onClick={() => void save()} disabled={saving}>
                {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                {fr ? 'Enregistrer' : 'Save'}
              </Button>
            </div>
          }
        >
          <div className="grid gap-4 md:grid-cols-2">
            <BilingualField
              label={fr ? 'Titre' : 'Title'}
              valueFr={editing.titleFr}
              valueEn={editing.titleEn}
              onChangeFr={(v) => setEditing({ ...editing, titleFr: v })}
              onChangeEn={(v) => setEditing({ ...editing, titleEn: v })}
            />
            <BilingualField
              label={fr ? 'Description' : 'Description'}
              multiline
              valueFr={editing.descFr}
              valueEn={editing.descEn}
              onChangeFr={(v) => setEditing({ ...editing, descFr: v })}
              onChangeEn={(v) => setEditing({ ...editing, descEn: v })}
            />
            <Field label="Icon key">
              <Select
                value={editing.iconKey}
                onValueChange={(v) => setEditing({ ...editing, iconKey: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_ICON_KEYS.map((key) => (
                    <SelectItem key={key} value={key}>
                      {key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label={fr ? 'Prix EUR' : 'Price EUR'}>
              <Input
                type="number"
                value={editing.priceEur}
                onChange={(e) => setEditing({ ...editing, priceEur: Number(e.target.value) })}
              />
            </Field>
            <BilingualField
              label={fr ? 'Label prix' : 'Price label'}
              valueFr={editing.priceFr}
              valueEn={editing.priceEn}
              onChangeFr={(v) => setEditing({ ...editing, priceFr: v })}
              onChangeEn={(v) => setEditing({ ...editing, priceEn: v })}
            />
            <div className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2">
              <span className="text-sm">{fr ? 'Tarif horaire' : 'Hourly rate'}</span>
              <Switch
                checked={editing.hourly}
                onCheckedChange={(v) => setEditing({ ...editing, hourly: v })}
              />
            </div>
            <div className="md:col-span-2">
              <BilingualStringListEditor
                label={fr ? 'Features' : 'Features'}
                valuesFr={editing.featuresFr}
                valuesEn={editing.featuresEn}
                onChangeFr={(v) => setEditing({ ...editing, featuresFr: v })}
                onChangeEn={(v) => setEditing({ ...editing, featuresEn: v })}
              />
            </div>
          </div>
        </AdminSectionCard>
      ) : null}

      <QueryState
        isPending={isPending}
        isError={isError}
        errorMessage={isApiError(error) ? error.message : undefined}
        empty={!isPending && !isError && items.length === 0}
        emptyTitle={fr ? 'Aucun service' : 'No services'}
      >
        <AdminDataTable
          data={items}
          getRowId={(r) => r.id}
          searchKeys={['titleFr', 'titleEn', 'iconKey']}
          emptyTitle={fr ? 'Aucun service' : 'No services'}
          columns={[
            {
              key: 'title',
              header: fr ? 'Titre' : 'Title',
              render: (r) => (
                <div>
                  <p className="font-medium">{fr ? r.titleFr : r.titleEn}</p>
                  <p className="text-xs text-muted-foreground">{r.iconKey}</p>
                </div>
              ),
            },
            {
              key: 'price',
              header: fr ? 'Prix' : 'Price',
              render: (r) => `${r.priceEur}€${r.hourly ? '/h' : ''}`,
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
                    iconKey: r.iconKey,
                    titleFr: r.titleFr,
                    titleEn: r.titleEn,
                    descFr: r.descFr,
                    descEn: r.descEn,
                    featuresFr: r.featuresFr || [],
                    featuresEn: r.featuresEn || [],
                    priceEur: r.priceEur,
                    hourly: r.hourly,
                    priceFr: r.priceFr,
                    priceEn: r.priceEn,
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
