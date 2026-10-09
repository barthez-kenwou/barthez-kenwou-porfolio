import React from 'react';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import {
  AdminPageHeader,
  AdminSectionCard,
  BilingualField,
  Field,
  type IContactInfo,
} from '@/features/admin-cms';
import { useAdminContactInfo, useUpdateContactInfo } from '@/entities/contact/hooks/useContact';
import { isApiError } from '@/shared/api';
import { QueryState } from '@/shared/ui/QueryState';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

const emptyContact = (): IContactInfo => ({
  name: '',
  handle: '',
  titleFr: '',
  titleEn: '',
  subtitleFr: '',
  subtitleEn: '',
  email: '',
  phone: '',
  whatsappLink: '',
  location: '',
  website: '',
  repository: '',
  github: '',
  linkedin: '',
  facebook: '',
});

export const AdminContactInfoPage: React.FC = () => {
  const { language } = useLanguageStore();
  const fr = language === 'fr';
  const { data, isPending, isError, error } = useAdminContactInfo();
  const update = useUpdateContactInfo();
  const [draft, setDraft] = React.useState<IContactInfo>(emptyContact());
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    if (data) {
      setDraft(data);
      setHydrated(true);
    }
  }, [data]);

  const patch = <K extends keyof IContactInfo>(key: K, value: IContactInfo[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const save = async () => {
    try {
      await update.mutateAsync(draft);
      toast.success(fr ? 'Infos enregistrées' : 'Contact info saved');
    } catch (e) {
      toast.error(isApiError(e) ? e.message : fr ? 'Échec de la sauvegarde' : 'Save failed');
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={fr ? 'Informations de contact' : 'Contact information'}
        actions={
          <Button onClick={() => void save()} disabled={update.isPending || !hydrated}>
            {update.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            {fr ? 'Enregistrer' : 'Save'}
          </Button>
        }
      />

      <QueryState
        isPending={isPending}
        isError={isError}
        errorMessage={isApiError(error) ? error.message : undefined}
      >
        <AdminSectionCard title={fr ? 'Identité' : 'Identity'}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label={fr ? 'Nom' : 'Name'}>
              <Input value={draft.name} onChange={(e) => patch('name', e.target.value)} />
            </Field>
            <Field label="Handle">
              <Input value={draft.handle} onChange={(e) => patch('handle', e.target.value)} />
            </Field>
            <BilingualField
              label={fr ? 'Titre' : 'Title'}
              valueFr={draft.titleFr}
              valueEn={draft.titleEn}
              onChangeFr={(v) => patch('titleFr', v)}
              onChangeEn={(v) => patch('titleEn', v)}
            />
            <BilingualField
              label={fr ? 'Sous-titre' : 'Subtitle'}
              valueFr={draft.subtitleFr}
              valueEn={draft.subtitleEn}
              onChangeFr={(v) => patch('subtitleFr', v)}
              onChangeEn={(v) => patch('subtitleEn', v)}
            />
          </div>
        </AdminSectionCard>

        <AdminSectionCard title={fr ? 'Coordonnées' : 'Coordinates'} className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Email">
              <Input value={draft.email} onChange={(e) => patch('email', e.target.value)} />
            </Field>
            <Field label={fr ? 'Téléphone' : 'Phone'}>
              <Input value={draft.phone} onChange={(e) => patch('phone', e.target.value)} />
            </Field>
            <Field label="WhatsApp link">
              <Input
                value={draft.whatsappLink}
                onChange={(e) => patch('whatsappLink', e.target.value)}
              />
            </Field>
            <Field label={fr ? 'Localisation' : 'Location'}>
              <Input value={draft.location} onChange={(e) => patch('location', e.target.value)} />
            </Field>
            <Field label="Website">
              <Input value={draft.website} onChange={(e) => patch('website', e.target.value)} />
            </Field>
            <Field label="Repository">
              <Input
                value={draft.repository}
                onChange={(e) => patch('repository', e.target.value)}
              />
            </Field>
            <Field label="GitHub">
              <Input value={draft.github} onChange={(e) => patch('github', e.target.value)} />
            </Field>
            <Field label="LinkedIn">
              <Input value={draft.linkedin} onChange={(e) => patch('linkedin', e.target.value)} />
            </Field>
            <Field label="Facebook">
              <Input value={draft.facebook} onChange={(e) => patch('facebook', e.target.value)} />
            </Field>
          </div>
        </AdminSectionCard>
      </QueryState>
    </div>
  );
};
