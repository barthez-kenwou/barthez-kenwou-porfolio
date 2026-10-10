import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import {
  AdminDataTable,
  AdminPageHeader,
  AdminSectionCard,
  formatAdminDate,
  useAdminAudit,
  type AdminDataTableColumn,
  type AuditEntry,
} from '@/features/admin-cms';
import { isApiError } from '@/shared/api';
import { adminPath } from '@/shared/config/admin';
import { profilePhotos } from '@/shared/assets/images/profilePhotos';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { Badge } from '@/shared/ui/badge';
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

function AccountDetails({ fr }: { fr: boolean }) {
  const { user } = useAuth();
  const avatar = user?.avatarUrl || profilePhotos[0];
  const roleLabel = (user?.roles?.[0] || 'admin').replace(/_/g, ' ');

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-2 rounded-md border border-border/60 bg-card/30 px-3 py-4 text-center">
        <img
          src={avatar}
          alt=""
          className="size-14 rounded-full object-cover object-top ring-1 ring-border/50"
        />
        <div className="min-w-0 w-full">
          <p className="truncate text-sm font-semibold">{user?.name ?? 'Admin'}</p>
          <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-primary">
            {roleLabel}
          </p>
        </div>
      </div>

      <dl className="grid gap-2 sm:grid-cols-2">
        {(
          [
            [fr ? 'Prénom' : 'First name', user?.firstName || '—'],
            [fr ? 'Nom' : 'Last name', user?.lastName || '—'],
            ['Email', user?.email || '—'],
            [fr ? 'Téléphone' : 'Phone', user?.phone || '—'],
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
            [
              '2FA',
              user?.totpEnabled == null
                ? '—'
                : user.totpEnabled
                  ? fr
                    ? 'Activé'
                    : 'On'
                  : fr
                    ? 'Désactivé'
                    : 'Off',
            ],
            [fr ? 'Statut' : 'Status', user?.isActive === false ? (fr ? 'Inactif' : 'Inactive') : fr ? 'Actif' : 'Active'],
            ['ID', user?.id || '—'],
          ] as const
        ).map(([label, value]) => (
          <div
            key={label}
            className="rounded-md border border-border/50 px-3 py-2.5"
          >
            <dt className="cursor-default text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              {label}
            </dt>
            <dd className="mt-1 break-all text-sm font-medium">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function AuditDetails({ fr }: { fr: boolean }) {
  const auditQuery = useAdminAudit({ limit: 100 });

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

  const items = auditQuery.data?.items ?? [];

  return (
    <AdminDataTable
      columns={columns}
      data={items}
      getRowId={(row) => row.id}
      searchKeys={['action', 'resource', 'resourceId']}
      searchPlaceholder={fr ? 'Rechercher une action…' : 'Search actions…'}
      emptyTitle={fr ? 'Aucune entrée d’audit.' : 'No audit entries.'}
      defaultPageSize={10}
    />
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
        className="bg-muted text-muted-foreground inline-flex h-auto w-full flex-wrap justify-start gap-1 rounded-md p-1 sm:w-fit"
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
                'inline-flex cursor-pointer items-center justify-center rounded-sm px-3 py-2 text-sm font-medium transition-all',
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

      <AdminSectionCard
        title={fr ? TAB_META[active].fr : TAB_META[active].en}
        description={
          active === 'account'
            ? fr
              ? 'Profil administrateur.'
              : 'Admin profile.'
            : active === 'audit'
              ? fr
                ? 'Journal d’opérations.'
                : 'Operator audit trail.'
              : fr
                ? 'Rôles et permissions.'
                : 'roles and permissions.'
        }
        className={cn(active === 'permissions' && 'pb-2')}
      >
        {active === 'account' ? <AccountDetails fr={fr} /> : null}
        {active === 'audit' ? <AuditDetails fr={fr} /> : null}
        {active === 'permissions' ? <PermissionsDetails fr={fr} /> : null}
      </AdminSectionCard>
    </div>
  );
}
