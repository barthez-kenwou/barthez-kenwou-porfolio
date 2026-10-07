import React from 'react';
import { Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { services as servicesMock } from '@/entities/services/api/mock/services.mocks';
import {
  AdminPageHeader,
  AdminDataTable,
  AdminSectionCard,
  ConfirmDeleteDialog,
  BilingualField,
  BilingualStringListEditor,
  Field,
  createId,
} from '@/features/admin-cms';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Switch } from '@/shared/ui/switch';

/** Serializable service draft (icons stay as keys until public UI remaps). */
export type IAdminService = {
  id: string;
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
};

const ICON_KEYS = ['cloud', 'server', 'code', 'shield', 'bolt', 'academic'] as const;

function seedServices(): IAdminService[] {
  return servicesMock.map((s, i) => ({
    id: createId('svc'),
    iconKey: ICON_KEYS[i % ICON_KEYS.length],
    titleFr: s.titleFr,
    titleEn: s.titleEn,
    descFr: s.descFr,
    descEn: s.descEn,
    featuresFr: [...s.featuresFr],
    featuresEn: [...s.featuresEn],
    priceEur: s.priceEur,
    hourly: s.hourly,
    priceFr: s.priceFr,
    priceEn: s.priceEn,
  }));
}

type ServicesState = {
  items: IAdminService[];
  upsert: (item: IAdminService) => void;
  remove: (id: string) => void;
};

const useAdminServicesStore = create<ServicesState>()(
  persist(
    (set) => ({
      items: seedServices(),
      upsert: (item) =>
        set((s) => {
          const idx = s.items.findIndex((x) => x.id === item.id);
          if (idx === -1) return { items: [item, ...s.items] };
          const items = [...s.items];
          items[idx] = item;
          return { items };
        }),
      remove: (id) => set((s) => ({ items: s.items.filter((x) => x.id !== id) })),
    }),
    { name: 'bk-admin-services-v1' },
  ),
);

const emptyItem = (): IAdminService => ({
  id: createId('svc'),
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
});

export const AdminServicesPage: React.FC = () => {
  const { language } = useLanguageStore();
  const fr = language === 'fr';
  const items = useAdminServicesStore((s) => s.items);
  const upsert = useAdminServicesStore((s) => s.upsert);
  const remove = useAdminServicesStore((s) => s.remove);
  const [editing, setEditing] = React.useState<IAdminService | null>(null);
  const [pending, setPending] = React.useState<IAdminService | null>(null);

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
              <Button variant="outline" size="sm" onClick={() => setEditing(null)}>
                <X className="size-3.5" />
                {fr ? 'Fermer' : 'Close'}
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  upsert(editing);
                  toast.success(fr ? 'Service enregistré' : 'Service saved');
                  setEditing(null);
                }}
              >
                <Save className="size-3.5" />
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
              <Input
                value={editing.iconKey}
                onChange={(e) => setEditing({ ...editing, iconKey: e.target.value })}
                placeholder="cloud | server | code…"
              />
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

      <AdminDataTable
        data={items}
        getRowId={(r) => r.id}
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
