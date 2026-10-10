import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { AtSign, Loader2, MapPin, Save, Share2, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import {
  AdminPageHeader,
  AdminSectionCard,
  AdminStickyActions,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { cn } from '@/shared/lib/utils';

type ContactInfoTab = 'identity' | 'coordinates' | 'social';

const CONTACT_INFO_TABS: ContactInfoTab[] = ['identity', 'coordinates', 'social'];

function isContactInfoTab(value: string | null): value is ContactInfoTab {
  return !!value && (CONTACT_INFO_TABS as string[]).includes(value);
}

const TAB_META: Record<
  ContactInfoTab,
  { icon: React.ComponentType<{ className?: string }>; fr: string; en: string }
> = {
  identity: { icon: UserRound, fr: 'Identité', en: 'Identity' },
  coordinates: { icon: MapPin, fr: 'Coordonnées', en: 'Coordinates' },
  social: { icon: Share2, fr: 'Réseaux', en: 'Social' },
};

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
  youtube: '',
  presentationVideoUrl: '',
});

export const AdminContactInfoPage: React.FC = () => {
  const { language } = useLanguageStore();
  const fr = language === 'fr';
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, isPending, isError, error } = useAdminContactInfo();
  const update = useUpdateContactInfo();
  const [draft, setDraft] = React.useState<IContactInfo>(emptyContact());
  const [hydrated, setHydrated] = React.useState(false);

  const tabParam = searchParams.get('tab');
  const tab: ContactInfoTab = isContactInfoTab(tabParam) ? tabParam : 'identity';

  const setTab = React.useCallback(
    (next: ContactInfoTab) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          if (next === 'identity') params.delete('tab');
          else params.set('tab', next);
          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  React.useEffect(() => {
    if (data) {
      setDraft({
        ...emptyContact(),
        ...data,
        youtube: data.youtube ?? '',
        presentationVideoUrl: data.presentationVideoUrl ?? '',
      });
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

  const saveButton = (
    <Button
      type="button"
      className="cursor-pointer flex-1 md:flex-none"
      onClick={() => void save()}
      disabled={update.isPending || !hydrated}
    >
      {update.isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Save className="size-4" />
      )}
      {fr ? 'Enregistrer' : 'Save'}
    </Button>
  );

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <AdminPageHeader
        title={fr ? 'Informations de contact' : 'Contact information'}
        actions={<AdminStickyActions>{saveButton}</AdminStickyActions>}
      />

      <QueryState
        isPending={isPending}
        isError={isError}
        errorMessage={isApiError(error) ? error.message : undefined}
      >
        <Tabs
          value={tab}
          onValueChange={(value) => {
            if (isContactInfoTab(value)) setTab(value);
          }}
          className="gap-5"
        >
          <TabsList className="h-auto w-full flex-wrap justify-start gap-1 p-1 sm:w-fit">
            {(Object.keys(TAB_META) as ContactInfoTab[]).map((key) => {
              const meta = TAB_META[key];
              const Icon = meta.icon;
              return (
                <TabsTrigger key={key} value={key} className={cn('cursor-pointer gap-1.5 px-3 py-2')}>
                  <Icon className="size-3.5 opacity-80" />
                  {fr ? meta.fr : meta.en}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="identity" className="mt-0">
            <AdminSectionCard
              title={fr ? 'Identité' : 'Identity'}
              description={
                fr
                  ? 'Nom public, handle et titres bilingues.'
                  : 'Public name, handle, and bilingual titles.'
              }
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field label={fr ? 'Nom' : 'Name'}>
                  <Input
                    value={draft.name}
                    onChange={(e) => patch('name', e.target.value)}
                    className="cursor-text"
                  />
                </Field>
                <Field label="Handle">
                  <div className="relative">
                    <AtSign className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={draft.handle}
                      onChange={(e) => patch('handle', e.target.value)}
                      className="cursor-text pl-9"
                    />
                  </div>
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
          </TabsContent>

          <TabsContent value="coordinates" className="mt-0">
            <AdminSectionCard
              title={fr ? 'Coordonnées' : 'Coordinates'}
              description={
                fr
                  ? 'Canaux directs pour te joindre.'
                  : 'Direct channels to reach you.'
              }
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Email">
                  <Input
                    type="email"
                    value={draft.email}
                    onChange={(e) => patch('email', e.target.value)}
                    className="cursor-text"
                  />
                </Field>
                <Field label={fr ? 'Téléphone' : 'Phone'}>
                  <Input
                    value={draft.phone}
                    onChange={(e) => patch('phone', e.target.value)}
                    className="cursor-text"
                  />
                </Field>
                <Field label="WhatsApp">
                  <Input
                    value={draft.whatsappLink}
                    onChange={(e) => patch('whatsappLink', e.target.value)}
                    className="cursor-text"
                    placeholder="https://wa.me/…"
                  />
                </Field>
                <Field label={fr ? 'Localisation' : 'Location'}>
                  <Input
                    value={draft.location}
                    onChange={(e) => patch('location', e.target.value)}
                    className="cursor-text"
                  />
                </Field>
              </div>
            </AdminSectionCard>
          </TabsContent>

          <TabsContent value="social" className="mt-0 space-y-5">
            <AdminSectionCard
              title={fr ? 'Réseaux & liens' : 'Social & links'}
              description={
                fr
                  ? 'Profils et URLs visibles sur le site. YouTube apparaît sur Contact dès qu’une URL est renseignée.'
                  : 'Profiles and URLs shown on the site. YouTube appears on Contact once a URL is set.'
              }
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Website">
                  <Input
                    value={draft.website}
                    onChange={(e) => patch('website', e.target.value)}
                    className="cursor-text"
                  />
                </Field>
                <Field label="Repository">
                  <Input
                    value={draft.repository}
                    onChange={(e) => patch('repository', e.target.value)}
                    className="cursor-text"
                  />
                </Field>
                <Field label="GitHub">
                  <Input
                    value={draft.github}
                    onChange={(e) => patch('github', e.target.value)}
                    className="cursor-text"
                  />
                </Field>
                <Field label="LinkedIn">
                  <Input
                    value={draft.linkedin}
                    onChange={(e) => patch('linkedin', e.target.value)}
                    className="cursor-text"
                  />
                </Field>
                <Field label="Facebook">
                  <Input
                    value={draft.facebook}
                    onChange={(e) => patch('facebook', e.target.value)}
                    className="cursor-text"
                  />
                </Field>
                <Field label="YouTube">
                  <Input
                    value={draft.youtube}
                    onChange={(e) => patch('youtube', e.target.value)}
                    className="cursor-text"
                    placeholder="https://youtube.com/@…"
                  />
                </Field>
              </div>
            </AdminSectionCard>

            <AdminSectionCard title={fr ? 'Vidéo de présentation' : 'Presentation video'}>
              <Input
                value={draft.presentationVideoUrl}
                onChange={(e) => patch('presentationVideoUrl', e.target.value)}
                className="cursor-text"
                placeholder="https://www.youtube.com/watch?v=…"
                aria-label={fr ? 'URL YouTube de présentation' : 'Presentation YouTube URL'}
              />
            </AdminSectionCard>
          </TabsContent>
        </Tabs>
      </QueryState>
    </div>
  );
};
