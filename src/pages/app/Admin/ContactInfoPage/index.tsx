import React from 'react';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import {
  AdminPageHeader,
  AdminSectionCard,
  BilingualField,
  Field,
  useAdminCmsStore,
  type IContactInfo,
} from '@/features/admin-cms';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

export const AdminContactInfoPage: React.FC = () => {
  const { language } = useLanguageStore();
  const fr = language === 'fr';
  const contactInfo = useAdminCmsStore((s) => s.contactInfo);
  const setContactInfo = useAdminCmsStore((s) => s.setContactInfo);
  const [draft, setDraft] = React.useState<IContactInfo>(contactInfo);

  React.useEffect(() => setDraft(contactInfo), [contactInfo]);

  const patch = <K extends keyof IContactInfo>(key: K, value: IContactInfo[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={fr ? 'Informations de contact' : 'Contact information'}
        actions={
          <Button
            onClick={() => {
              setContactInfo(draft);
              toast.success(fr ? 'Infos enregistrées' : 'Contact info saved');
            }}
          >
            <Save className="size-4" />
            {fr ? 'Enregistrer' : 'Save'}
          </Button>
        }
      />

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

      <AdminSectionCard title={fr ? 'Coordonnées' : 'Coordinates'}>
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
            <Input value={draft.repository} onChange={(e) => patch('repository', e.target.value)} />
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
    </div>
  );
};
