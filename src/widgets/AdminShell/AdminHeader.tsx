import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, PanelLeft } from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { LanguageToggle } from '@/shared/ui/LanguageToggle';
import { ThemeToggle } from '@/shared/ui/ThemeToggle';
import { useSidebar } from '@/shared/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { ADMIN_BASE, ADMIN_LOGIN } from '@/shared/config/admin';
import { profilePhotos } from '@/shared/assets/images/profilePhotos';
import { cn } from '@/shared/lib/utils';
import { buildAdminCrumbs } from './adminNav';

function AdminSidebarTrigger({ className }: { className?: string }) {
  const { toggleSidebar } = useSidebar();
  return (
    <button
      type="button"
      onClick={toggleSidebar}
      aria-label="Toggle sidebar"
      className={cn(
        'group relative flex size-11 shrink-0 items-center justify-center rounded-full md:size-9',
        'border border-border/60 bg-card/80 text-muted-foreground shadow-xs',
        'transition-all duration-300 hover:border-primary/35 hover:text-foreground',
        'active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
        className,
      )}
    >
      <PanelLeft className="size-4 transition-transform duration-300 group-hover:scale-105" />
      <span
        aria-hidden
        className="absolute -right-0.5 -top-0.5 size-1.5 rounded-full bg-primary opacity-80"
      />
    </button>
  );
}

export function AdminHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const language = useLanguageStore((s) => s.language);
  const fr = language === 'fr';
  const crumbs = buildAdminCrumbs(location.pathname, language);
  const avatar = profilePhotos[0];
  const mobileTitle = crumbs[crumbs.length - 1]?.label ?? 'Admin';
  const mobileParent = crumbs.length > 1 ? crumbs[crumbs.length - 2]?.label : null;

  const handleLogout = () => {
    void Promise.resolve(logout()).finally(() => {
      navigate(ADMIN_LOGIN, { replace: true });
    });
  };

  return (
    <header className="sticky top-0 z-30 shrink-0 border-b border-border/60 bg-background/90 pt-[env(safe-area-inset-top)] backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
      <div className="flex h-14 items-center gap-2.5 px-3 sm:gap-3 sm:px-5">
        <AdminSidebarTrigger className="-ml-0.5" />

        {/* Mobile: where am I? (breadcrumbs are desktop-only) */}
        <div className="min-w-0 flex-1 md:hidden">
          {mobileParent ? (
            <p className="truncate text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
              {mobileParent}
            </p>
          ) : null}
          <p className="truncate text-sm font-semibold tracking-tight text-foreground">
            {mobileTitle}
          </p>
        </div>

        <nav
          aria-label="Breadcrumb"
          className="hidden min-w-0 flex-1 items-center gap-1.5 text-[13px] md:flex"
        >
          {crumbs.map((crumb, i) => {
            const last = i === crumbs.length - 1;
            return (
              <span key={`${crumb.label}-${i}`} className="flex min-w-0 items-center gap-1.5">
                {i > 0 && <span className="text-muted-foreground/40">/</span>}
                {crumb.href && !last ? (
                  <Link
                    to={crumb.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="truncate font-medium text-foreground">{crumb.label}</span>
                )}
              </span>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <LanguageToggle />
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  'ml-0.5 flex size-11 items-center justify-center overflow-hidden rounded-full md:size-9',
                  'ring-1 ring-border/70 transition-shadow hover:ring-primary/40',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
                )}
                aria-label={fr ? 'Menu compte' : 'Account menu'}
              >
                <img src={avatar} alt="" className="size-full object-cover" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 rounded-xl p-1.5">
              <DropdownMenuLabel className="font-normal">
                <div className="flex items-center gap-3 px-0.5 py-1">
                  <img
                    src={avatar}
                    alt=""
                    className="size-10 rounded-full object-cover ring-1 ring-border/60"
                  />
                  <div className="min-w-0 space-y-0.5">
                    <p className="truncate text-sm font-semibold">
                      {user?.name ?? 'Barthez Kenwou'}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                    <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-primary">
                      {fr ? 'Propriétaire' : 'Owner'} · Admin
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={ADMIN_BASE}>{fr ? 'Tableau de bord' : 'Dashboard'}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onSelect={handleLogout}
              >
                <LogOut className="size-4" />
                {fr ? 'Déconnexion' : 'Sign out'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
