import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ImagePlus, Loader2, Save, Shield, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/app/providers/AuthProvider';
import { env } from '@/app/config/env';
import {
  changePassword,
  confirmTotp,
  deleteOwnAvatar,
  disableTotp,
  enrollTotp,
  updateOwnProfile,
  type TotpEnrollResult,
} from '@/features/admin-auth';
import {
  AdminDataTable,
  AdminPageHeader,
  AdminSectionCard,
  AdminStickyActions,
  Field,
  formatAdminDate,
  getAuditEntry,
  useAdminAudit,
  type AdminDataTableColumn,
  type AdminDataTableFilter,
  type AuditEntry,
} from '@/features/admin-cms';
import { isApiError } from '@/shared/api';
import { adminPath } from '@/shared/config/admin';
import { profilePhotos } from '@/shared/assets/images/profilePhotos';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { useIsMobile } from '@/shared/hooks/use-mobile';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/shared/ui/sheet';
import { cn } from '@/shared/lib/utils';

type AccountSection = 'account' | 'audit' | 'permissions';

const SECTIONS: AccountSection[] = ['account', 'audit', 'permissions'];

function isAccountSection(value: string | undefined): value is AccountSection {
  return !!value && (SECTIONS as string[]).includes(value);
}

const TAB_META: Record<AccountSection, { fr: string; en: string; href: string }> = {
  account: { fr: 'Compte', en: 'Account', href: adminPath('account') },
  audit: { fr: 'Audit', en: 'Audit', href: adminPath('account', 'audit') },
  permissions: {
    fr: 'Permissions',
    en: 'Permissions',
    href: adminPath('account', 'permissions'),
  },
};

type ProfileDraft = {
  firstName: string;
  lastName: string;
  phone: string;
};

function totpQrSrc(enroll: TotpEnrollResult | null): string | null {
  if (!enroll) return null;
  if (enroll.qrCodeDataUrl) return enroll.qrCodeDataUrl;
  if (enroll.qrCode?.startsWith('data:')) return enroll.qrCode;
  if (enroll.qrCode) return `data:image/png;base64,${enroll.qrCode}`;
  return null;
}

function AccountDetails({ fr }: { fr: boolean }) {
  const { user, refreshUser } = useAuth();
  const apiEnabled = env.ADMIN_USE_API;
  const [draft, setDraft] = React.useState<ProfileDraft>({
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
  const [savingProfile, setSavingProfile] = React.useState(false);
  const [clearingAvatar, setClearingAvatar] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [changingPassword, setChangingPassword] = React.useState(false);

  const [totpEnroll, setTotpEnroll] = React.useState<TotpEnrollResult | null>(null);
  const [totpCode, setTotpCode] = React.useState('');
  const [totpBusy, setTotpBusy] = React.useState(false);
  const [disablePassword, setDisablePassword] = React.useState('');
  const [disableTotpCode, setDisableTotpCode] = React.useState('');

  React.useEffect(() => {
    if (!user) return;
    setDraft({
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      phone: user.phone ?? '',
    });
    setAvatarFile(null);
    setAvatarPreview(null);
  }, [user?.id, user?.firstName, user?.lastName, user?.phone]);

  React.useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview(null);
      return;
    }
    const url = URL.createObjectURL(avatarFile);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  const displayAvatar = avatarPreview || user?.avatarUrl || profilePhotos[0];
  const roles = user?.roles ?? [];

  const saveProfile = async () => {
    if (!apiEnabled) {
      toast.error(fr ? 'Mode hors ligne — profil non modifiable.' : 'Offline mode — profile is read-only.');
      return;
    }
    setSavingProfile(true);
    try {
      await updateOwnProfile({
        firstName: draft.firstName.trim(),
        lastName: draft.lastName.trim(),
        phone: draft.phone.trim(),
        ...(avatarFile ? { avatarFile } : {}),
      });
      setAvatarFile(null);
      await refreshUser();
      toast.success(fr ? 'Profil enregistré' : 'Profile saved');
    } catch (e) {
      toast.error(isApiError(e) ? e.message : fr ? 'Échec de l’enregistrement' : 'Save failed');
    } finally {
      setSavingProfile(false);
    }
  };

  const onClearAvatar = async () => {
    if (!apiEnabled) return;
    setClearingAvatar(true);
    try {
      await deleteOwnAvatar();
      setAvatarFile(null);
      await refreshUser();
      toast.success(fr ? 'Photo supprimée' : 'Avatar removed');
    } catch (e) {
      toast.error(isApiError(e) ? e.message : fr ? 'Échec' : 'Failed');
    } finally {
      setClearingAvatar(false);
    }
  };

  const onChangePassword = async () => {
    if (!apiEnabled) return;
    if (newPassword.length < 8) {
      toast.error(fr ? 'Mot de passe trop court (8 car. min.)' : 'Password too short (min. 8 chars)');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(fr ? 'Les mots de passe ne correspondent pas' : 'Passwords do not match');
      return;
    }
    setChangingPassword(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success(fr ? 'Mot de passe mis à jour' : 'Password updated');
    } catch (e) {
      toast.error(isApiError(e) ? e.message : fr ? 'Échec' : 'Failed');
    } finally {
      setChangingPassword(false);
    }
  };

  const onEnrollTotp = async () => {
    if (!apiEnabled) return;
    setTotpBusy(true);
    try {
      const result = await enrollTotp();
      setTotpEnroll(result);
      setTotpCode('');
      toast.success(fr ? 'Scannez le QR code avec votre app 2FA' : 'Scan the QR code with your 2FA app');
    } catch (e) {
      toast.error(isApiError(e) ? e.message : fr ? 'Échec' : 'Failed');
    } finally {
      setTotpBusy(false);
    }
  };

  const onConfirmTotp = async () => {
    if (!apiEnabled || !totpCode.trim()) return;
    setTotpBusy(true);
    try {
      await confirmTotp(totpCode.trim());
      setTotpEnroll(null);
      setTotpCode('');
      await refreshUser();
      toast.success(fr ? '2FA activée' : '2FA enabled');
    } catch (e) {
      toast.error(isApiError(e) ? e.message : fr ? 'Code invalide' : 'Invalid code');
    } finally {
      setTotpBusy(false);
    }
  };

  const onDisableTotp = async () => {
    if (!apiEnabled) return;
    setTotpBusy(true);
    try {
      await disableTotp({ password: disablePassword, totpCode: disableTotpCode.trim() });
      setDisablePassword('');
      setDisableTotpCode('');
      await refreshUser();
      toast.success(fr ? '2FA désactivée' : '2FA disabled');
    } catch (e) {
      toast.error(isApiError(e) ? e.message : fr ? 'Échec' : 'Failed');
    } finally {
      setTotpBusy(false);
    }
  };

  const saveButton = (
    <Button
      type="button"
      className="cursor-pointer flex-1 md:flex-none"
      onClick={() => void saveProfile()}
      disabled={savingProfile || !apiEnabled}
    >
      {savingProfile ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
      {fr ? 'Enregistrer' : 'Save'}
    </Button>
  );

  const qrSrc = totpQrSrc(totpEnroll);

  return (
    <div className="space-y-4 pb-20 md:pb-0">
      {!apiEnabled ? (
        <p className="rounded-md border border-dashed border-border/60 px-4 py-3 text-sm text-muted-foreground">
          {fr
            ? 'Mode admin hors ligne — édition du profil et sécurité désactivées.'
            : 'Offline admin mode — profile and security editing disabled.'}
        </p>
      ) : null}

      <AdminSectionCard
        title={fr ? 'Profil' : 'Profile'}
        description={fr ? 'Identité et coordonnées modifiables.' : 'Editable identity and contact fields.'}
        actions={<AdminStickyActions>{saveButton}</AdminStickyActions>}
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="flex flex-col items-center gap-3">
            <img
              src={displayAvatar}
              alt=""
              className="size-20 rounded-full object-cover object-top ring-1 ring-border/50"
            />
            <div className="flex flex-wrap justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="cursor-pointer gap-1.5"
                disabled={!apiEnabled || savingProfile}
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus className="size-3.5" />
                {fr ? 'Photo' : 'Photo'}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="cursor-pointer gap-1.5"
                disabled={!apiEnabled || clearingAvatar || (!user?.avatarUrl && !avatarFile)}
                onClick={() => void onClearAvatar()}
              >
                {clearingAvatar ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Trash2 className="size-3.5" />
                )}
                {fr ? 'Retirer' : 'Remove'}
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setAvatarFile(file);
                e.target.value = '';
              }}
            />
          </div>

          <div className="grid min-w-0 flex-1 gap-4 sm:grid-cols-2">
            <Field label={fr ? 'Prénom' : 'First name'} htmlFor="profile-firstName">
              <Input
                id="profile-firstName"
                value={draft.firstName}
                disabled={!apiEnabled}
                onChange={(e) => setDraft((d) => ({ ...d, firstName: e.target.value }))}
              />
            </Field>
            <Field label={fr ? 'Nom' : 'Last name'} htmlFor="profile-lastName">
              <Input
                id="profile-lastName"
                value={draft.lastName}
                disabled={!apiEnabled}
                onChange={(e) => setDraft((d) => ({ ...d, lastName: e.target.value }))}
              />
            </Field>
            <Field label={fr ? 'Téléphone' : 'Phone'} htmlFor="profile-phone" className="sm:col-span-2">
              <Input
                id="profile-phone"
                value={draft.phone}
                disabled={!apiEnabled}
                onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
              />
            </Field>
          </div>
        </div>

        <dl className="grid gap-2 border-t border-border/50 pt-4 sm:grid-cols-2">
          {(
            [
              ['Email', user?.email || '—'],
              [
                fr ? 'Rôles' : 'Roles',
                roles.length ? roles.join(', ') : '—',
              ],
              [
                fr ? 'Vérifié' : 'Verified',
                user?.isVerified == null
                  ? '—'
                  : user.isVerified
                    ? fr
                      ? 'Oui'
                      : 'Yes'
                    : fr
                      ? 'Non'
                      : 'No',
              ],
              ['ID', user?.id || '—'],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="rounded-md border border-border/50 px-3 py-2.5">
              <dt className="cursor-default text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                {label}
              </dt>
              <dd className="mt-1 break-all text-sm font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      </AdminSectionCard>

      <AdminSectionCard
        title={fr ? 'Sécurité' : 'Security'}
        description={
          fr ? 'Mot de passe et authentification à deux facteurs.' : 'Password and two-factor authentication.'
        }
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <p className="flex items-center gap-2 text-sm font-medium">
              <Shield className="size-4 text-muted-foreground" />
              {fr ? 'Changer le mot de passe' : 'Change password'}
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label={fr ? 'Mot de passe actuel' : 'Current password'}>
                <Input
                  type="password"
                  autoComplete="current-password"
                  disabled={!apiEnabled}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </Field>
              <Field label={fr ? 'Nouveau mot de passe' : 'New password'}>
                <Input
                  type="password"
                  autoComplete="new-password"
                  disabled={!apiEnabled}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Field>
              <Field label={fr ? 'Confirmer' : 'Confirm'}>
                <Input
                  type="password"
                  autoComplete="new-password"
                  disabled={!apiEnabled}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Field>
            </div>
            <Button
              type="button"
              variant="secondary"
              className="cursor-pointer"
              disabled={!apiEnabled || changingPassword || !currentPassword || !newPassword}
              onClick={() => void onChangePassword()}
            >
              {changingPassword ? <Loader2 className="size-4 animate-spin" /> : null}
              {fr ? 'Mettre à jour le mot de passe' : 'Update password'}
            </Button>
          </div>

          <div className="space-y-4 border-t border-border/50 pt-6">
            <p className="text-sm font-medium">
              2FA —{' '}
              {user?.totpEnabled
                ? fr
                  ? 'Activée'
                  : 'Enabled'
                : fr
                  ? 'Désactivée'
                  : 'Disabled'}
            </p>

            {user?.totpEnabled ? (
              <div className="grid max-w-xl gap-4">
                <Field label={fr ? 'Mot de passe' : 'Password'}>
                  <Input
                    type="password"
                    autoComplete="current-password"
                    disabled={!apiEnabled}
                    value={disablePassword}
                    onChange={(e) => setDisablePassword(e.target.value)}
                  />
                </Field>
                <Field label={fr ? 'Code 2FA' : '2FA code'}>
                  <Input
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    disabled={!apiEnabled}
                    value={disableTotpCode}
                    onChange={(e) => setDisableTotpCode(e.target.value)}
                  />
                </Field>
                <Button
                  type="button"
                  variant="destructive"
                  className="cursor-pointer w-fit"
                  disabled={!apiEnabled || totpBusy || !disablePassword || !disableTotpCode.trim()}
                  onClick={() => void onDisableTotp()}
                >
                  {totpBusy ? <Loader2 className="size-4 animate-spin" /> : null}
                  {fr ? 'Désactiver la 2FA' : 'Disable 2FA'}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {!totpEnroll ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="cursor-pointer"
                    disabled={!apiEnabled || totpBusy}
                    onClick={() => void onEnrollTotp()}
                  >
                    {totpBusy ? <Loader2 className="size-4 animate-spin" /> : null}
                    {fr ? 'Activer la 2FA' : 'Enable 2FA'}
                  </Button>
                ) : (
                  <div className="grid gap-4 md:grid-cols-[auto_1fr] md:items-start">
                    {qrSrc ? (
                      <img
                        src={qrSrc}
                        alt=""
                        className="size-40 rounded-md border border-border/60 bg-white p-2"
                      />
                    ) : totpEnroll.secret ? (
                      <code className="rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-xs break-all">
                        {totpEnroll.secret}
                      </code>
                    ) : null}
                    <div className="space-y-3">
                      {(totpEnroll.otpauthUrl || totpEnroll.provisioningUri) && (
                        <p className="text-xs text-muted-foreground break-all">
                          {totpEnroll.otpauthUrl || totpEnroll.provisioningUri}
                        </p>
                      )}
                      <Field label={fr ? 'Code de vérification' : 'Verification code'}>
                        <Input
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          value={totpCode}
                          onChange={(e) => setTotpCode(e.target.value)}
                        />
                      </Field>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          className="cursor-pointer"
                          disabled={totpBusy || !totpCode.trim()}
                          onClick={() => void onConfirmTotp()}
                        >
                          {totpBusy ? <Loader2 className="size-4 animate-spin" /> : null}
                          {fr ? 'Confirmer' : 'Confirm'}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className="cursor-pointer"
                          onClick={() => {
                            setTotpEnroll(null);
                            setTotpCode('');
                          }}
                        >
                          {fr ? 'Annuler' : 'Cancel'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </AdminSectionCard>
    </div>
  );
}

function AuditEntryDetail({
  entry,
  fr,
  loading,
}: {
  entry: AuditEntry;
  fr: boolean;
  loading?: boolean;
}) {
  const metaJson = React.useMemo(() => {
    if (entry.metadata == null) return '—';
    try {
      return JSON.stringify(entry.metadata, null, 2);
    } catch {
      return String(entry.metadata);
    }
  }, [entry.metadata]);

  const rows: Array<[string, string]> = [
    ['Action', entry.action],
    [fr ? 'Ressource' : 'Resource', entry.resource || '—'],
    [fr ? 'ID ressource' : 'Resource ID', entry.resourceId || '—'],
    [fr ? 'Acteur' : 'Actor', entry.actorId || '—'],
    ['Request ID', entry.requestId || '—'],
    ['User-Agent', entry.userAgent || '—'],
    [
      fr ? 'Date' : 'Date',
      formatAdminDate(entry.createdAt, fr ? 'fr' : 'en', { withTime: true }),
    ],
  ];

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          {fr ? 'Chargement du détail…' : 'Loading detail…'}
        </div>
      ) : null}
      <dl className="grid gap-2">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-md border border-border/50 px-3 py-2.5">
            <dt className="cursor-default text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              {label}
            </dt>
            <dd className="mt-1 break-all text-sm font-medium">{value}</dd>
          </div>
        ))}
      </dl>
      <div>
        <p className="mb-2 cursor-default text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          Metadata
        </p>
        <pre className="max-h-64 overflow-auto rounded-md border border-border/50 bg-muted/20 p-3 text-xs leading-relaxed">
          {metaJson}
        </pre>
      </div>
    </div>
  );
}

function AuditDetails({ fr }: { fr: boolean }) {
  const isMobile = useIsMobile();
  const auditQuery = useAdminAudit({ limit: 100 });
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [detail, setDetail] = React.useState<AuditEntry | null>(null);
  const [detailLoading, setDetailLoading] = React.useState(false);

  const columns = React.useMemo<AdminDataTableColumn<AuditEntry>[]>(
    () => [
      {
        key: 'action',
        header: fr ? 'Action' : 'Action',
        render: (row) => <span className="font-medium">{row.action}</span>,
      },
      {
        key: 'resource',
        header: fr ? 'Ressource' : 'Resource',
        render: (row) => (
          <span className="text-muted-foreground">
            {[row.resource, row.resourceId].filter(Boolean).join(' · ') || '—'}
          </span>
        ),
      },
      {
        key: 'createdAt',
        header: fr ? 'Date' : 'Date',
        className: 'w-[12rem]',
        render: (row) => (
          <span className="whitespace-nowrap text-muted-foreground">
            {formatAdminDate(row.createdAt, fr ? 'fr' : 'en', { withTime: true })}
          </span>
        ),
      },
    ],
    [fr],
  );

  const items = auditQuery.data?.items ?? [];

  const filters = React.useMemo<AdminDataTableFilter<AuditEntry>[]>(() => {
    const actions = [...new Set(items.map((i) => i.action).filter(Boolean))].sort();
    const resources = [...new Set(items.map((i) => i.resource).filter(Boolean))].sort() as string[];
    return [
      {
        key: 'action',
        label: fr ? 'Action' : 'Action',
        options: actions.map((value) => ({ value, label: value })),
      },
      {
        key: 'resource',
        label: fr ? 'Ressource' : 'Resource',
        options: resources.map((value) => ({ value, label: value })),
      },
    ];
  }, [items, fr]);

  const openEntry = React.useCallback(async (row: AuditEntry) => {
    setSelectedId(row.id);
    setDetail(row);
    setDetailLoading(true);
    try {
      const full = await getAuditEntry(row.id);
      setDetail(full);
    } catch {
      setDetail(row);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  if (auditQuery.isPending) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (auditQuery.isError) {
    return (
      <p className="rounded-md border border-dashed border-border/60 px-4 py-8 text-center text-sm text-muted-foreground">
        {isApiError(auditQuery.error)
          ? auditQuery.error.message
          : fr
            ? 'Impossible de charger l’audit (permission audit:read requise).'
            : 'Unable to load audit (audit:read required).'}
      </p>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] lg:items-start">
      <AdminDataTable
        columns={columns}
        data={items}
        getRowId={(row) => row.id}
        searchKeys={['action', 'resource', 'resourceId']}
        searchPlaceholder={fr ? 'Rechercher une action…' : 'Search actions…'}
        emptyTitle={fr ? 'Aucune entrée d’audit.' : 'No audit entries.'}
        defaultPageSize={10}
        filters={filters}
        onRowClick={(row) => void openEntry(row)}
      />

      <AdminSectionCard
        title={fr ? 'Détail' : 'Detail'}
        className="hidden lg:sticky lg:top-4 lg:block lg:self-start"
      >
        {!detail ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            {fr ? 'Sélectionnez une entrée pour voir le détail.' : 'Select an entry to view details.'}
          </p>
        ) : (
          <AuditEntryDetail entry={detail} fr={fr} loading={detailLoading} />
        )}
      </AdminSectionCard>

      <Sheet
        open={isMobile && !!detail && !!selectedId}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedId(null);
            setDetail(null);
          }
        }}
      >
        <SheetContent
          side="bottom"
          className="flex max-h-[88dvh] flex-col rounded-t-2xl pb-[max(1rem,env(safe-area-inset-bottom))]"
        >
          <SheetHeader className="text-left">
            <SheetTitle className="pr-8 text-base leading-snug">
              {detail?.action ?? (fr ? 'Audit' : 'Audit')}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 min-h-0 flex-1 overflow-y-auto">
            {detail ? <AuditEntryDetail entry={detail} fr={fr} loading={detailLoading} /> : null}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function PermissionsDetails({ fr }: { fr: boolean }) {
  const { user } = useAuth();
  const permissions = user?.permissions ?? [];
  const roles = user?.roles ?? [];

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 cursor-default text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          {fr ? 'Rôles' : 'Roles'}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {roles.length ? (
            roles.map((role) => (
              <Badge key={role} variant="default" className="rounded-sm font-normal">
                {role}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">—</span>
          )}
        </div>
      </div>

      <div>
        <p className="mb-2 cursor-default text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          Permissions ({permissions.length})
        </p>
        {permissions.length === 0 ? (
          <p className="rounded-md border border-dashed border-border/60 px-4 py-8 text-center text-sm text-muted-foreground">
            {fr ? 'Aucune permission listée.' : 'No permissions listed.'}
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {permissions.map((permission) => (
              <Badge key={permission} variant="secondary" className="rounded-sm font-normal">
                {permission}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function AdminAccountPage() {
  const { language } = useLanguageStore();
  const fr = language === 'fr';
  const { section } = useParams<{ section?: string }>();

  const active: AccountSection = !section
    ? 'account'
    : isAccountSection(section)
      ? section
      : 'account';

  if (section && !isAccountSection(section)) {
    return <Navigate to={adminPath('account')} replace />;
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title={fr ? 'Espace compte' : 'Account space'} />

      <div
        className="bg-muted text-muted-foreground inline-flex h-auto w-full justify-stretch gap-1 rounded-xl p-1 sm:w-fit sm:justify-start"
        role="tablist"
        aria-label={fr ? 'Sections compte' : 'Account sections'}
      >
        {(Object.keys(TAB_META) as AccountSection[]).map((key) => {
          const meta = TAB_META[key];
          const selected = active === key;
          return (
            <Link
              key={key}
              to={meta.href}
              role="tab"
              aria-selected={selected}
              className={cn(
                'inline-flex min-h-10 flex-1 cursor-pointer items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-all sm:flex-none',
                selected
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {fr ? meta.fr : meta.en}
            </Link>
          );
        })}
      </div>

      {active === 'account' ? (
        <AccountDetails fr={fr} />
      ) : (
        <AdminSectionCard
          title={fr ? TAB_META[active].fr : TAB_META[active].en}
          description={
            active === 'audit'
              ? fr
                ? 'Journal d’opérations.'
                : 'Operator audit trail.'
              : fr
                ? 'Rôles et permissions.'
                : 'Roles and permissions.'
          }
          className={cn(active === 'permissions' && 'pb-2')}
        >
          {active === 'audit' ? <AuditDetails fr={fr} /> : null}
          {active === 'permissions' ? <PermissionsDetails fr={fr} /> : null}
        </AdminSectionCard>
      )}
    </div>
  );
}
