import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PanelLeft } from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { LanguageToggle } from '@/shared/ui/LanguageToggle';
import { ThemeToggle } from '@/shared/ui/ThemeToggle';
import { useSidebar } from '@/shared/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { useAdminDashboard } from '@/features/admin-cms';
import { profilePhotos } from '@/shared/assets/images/profilePhotos';
import { cn } from '@/shared/lib/utils';
import { buildAdminCrumbs } from './adminNav';
import { AdminAccountPanel } from './AdminAccountPanel';

function AdminSidebarTrigger({
  className,
  attention,
}: {
  className?: string;
  attention: number;
}) {
  const { toggleSidebar, openMobile, open, isMobile } = useSidebar();
  const expanded = isMobile ? openMobile : open;

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      aria-label="Toggle sidebar"
      aria-expanded={expanded}
      className={cn(
        'group relative flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full md:size-9',
        'border border-border/50 bg-card/70 text-muted-foreground',
        'transition-all duration-200 hover:border-primary/35 hover:text-foreground',
        'active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
        className,
      )}
    >
      <PanelLeft className="size-4 transition-transform duration-200 group-hover:scale-105" />
      {attention > 0 ? (
        <span
          aria-label={`${attention} pending`}
          className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[9px] font-semibold text-amber-950"
        >
          {attention > 9 ? '9+' : attention}
        </span>
      ) : null}
    </button>
  );
}

export function AdminHeader() {
  const { user } = useAuth();
  const location = useLocation();
  const language = useLanguageStore((s) => s.language);
  const fr = language === 'fr';
  const crumbs = buildAdminCrumbs(location.pathname, language);
  const avatar = user?.avatarUrl || profilePhotos[0];
  const mobileTitle = crumbs[crumbs.length - 1]?.label ?? 'Admin';
  const mobileParent = crumbs.length > 1 ? crumbs[crumbs.length - 2]?.label : null;
  const dashboard = useAdminDashboard();
  const attention =
    (dashboard.data?.newContactResponses ?? 0) + (dashboard.data?.pendingTestimonials ?? 0);
  const [accountOpen, setAccountOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-30 shrink-0 border-b border-border/50 bg-background/90 pt-[env(safe-area-inset-top)] backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
      <div className="flex h-14 items-center gap-2.5 px-3 sm:gap-3 sm:px-5">
        <AdminSidebarTrigger className="-ml-0.5" attention={attention} />

        <div className="min-w-0 flex-1 md:hidden">
          {mobileParent ? (
            <p className="cursor-default truncate text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
              {mobileParent}
            </p>
          ) : null}
          <p className="cursor-default truncate text-sm font-semibold tracking-tight text-foreground">
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
                    className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="cursor-default truncate font-medium text-foreground">
                    {crumb.label}
                  </span>
                )}
              </span>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <LanguageToggle />
          <ThemeToggle />

          <DropdownMenu open={accountOpen} onOpenChange={setAccountOpen}>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  'ml-0.5 flex size-11 cursor-pointer items-center justify-center overflow-hidden rounded-full md:size-9',
                  'ring-1 ring-border/60 transition-shadow hover:ring-primary/40',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
                )}
                aria-label={fr ? 'Menu compte' : 'Account menu'}
              >
                <img
                  src={avatar}
                  alt=""
                  className="size-full object-cover object-top"
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="rounded-md p-1 shadow-md"
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <AdminAccountPanel onClose={() => setAccountOpen(false)} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
