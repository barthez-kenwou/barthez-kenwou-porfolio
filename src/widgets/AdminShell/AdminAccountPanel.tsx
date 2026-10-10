import { Link } from 'react-router-dom';
import { KeyRound, LogOut, ShieldCheck, UserRound } from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import { ADMIN_LOGIN, adminPath } from '@/shared/config/admin';
import { profilePhotos } from '@/shared/assets/images/profilePhotos';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { cn } from '@/shared/lib/utils';

type Props = {
  onClose?: () => void;
};

const MENU = [
  {
    key: 'account',
    href: adminPath('account'),
    icon: UserRound,
    fr: 'Compte',
    en: 'Account',
  },
  {
    key: 'audit',
    href: adminPath('account', 'audit'),
    icon: ShieldCheck,
    fr: 'Audit',
    en: 'Audit',
  },
  {
    key: 'permissions',
    href: adminPath('account', 'permissions'),
    icon: KeyRound,
    fr: 'Permissions',
    en: 'Permissions',
  },
] as const;

export function AdminAccountPanel({ onClose }: Props) {
  const { user, logout } = useAuth();
  const language = useLanguageStore((s) => s.language);
  const fr = language === 'fr';
  const avatar = user?.avatarUrl || profilePhotos[0];
  const roleLabel = (user?.roles?.[0] || 'admin').replace(/_/g, ' ');

  const handleLogout = () => {
    void Promise.resolve(logout()).finally(() => {
      onClose?.();
      window.location.assign(ADMIN_LOGIN);
    });
  };

  return (
    <div className="w-[min(15.5rem,calc(100vw-2rem))]">
      <div className="flex flex-col items-center border-b border-border/50 px-2.5 pb-2.5 pt-0.5 text-center">
        <img
          src={avatar}
          alt=""
          className="size-12 rounded-full object-cover object-top ring-1 ring-border/50"
        />
        <p className="mt-1.5 w-full truncate text-sm font-semibold leading-tight">
          {user?.name ?? 'Admin'}
        </p>
        <p className="w-full truncate text-[11px] leading-tight text-muted-foreground">
          {user?.email}
        </p>
        <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-primary">
          {roleLabel}
        </p>
      </div>

      <nav className="flex flex-col gap-0.5 p-1" aria-label={fr ? 'Compte' : 'Account'}>
        {MENU.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              to={item.href}
              onClick={onClose}
              className={cn(
                'flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm',
                'text-foreground transition-colors hover:bg-muted/60',
              )}
            >
              <Icon className="size-3.5 shrink-0 text-muted-foreground" />
              {fr ? item.fr : item.en}
            </Link>
          );
        })}

        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            'flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm',
            'text-destructive transition-colors hover:bg-destructive/10',
          )}
        >
          <LogOut className="size-3.5 shrink-0" />
          {fr ? 'Déconnexion' : 'Sign out'}
        </button>
      </nav>
    </div>
  );
}
