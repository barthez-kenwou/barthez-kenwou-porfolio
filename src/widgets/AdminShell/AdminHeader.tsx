import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquareText, PanelLeft, Star } from 'lucide-react';
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
import { adminPath } from '@/shared/config/admin';
import { cn } from '@/shared/lib/utils';
import { buildAdminCrumbs } from './adminNav';
import { AdminAccountPanel } from './AdminAccountPanel';

function AdminSidebarTrigger({ className }: { className?: string }) {
  const { toggleSidebar, openMobile, open, isMobile } = useSidebar();
  const expanded = isMobile ? openMobile : open;

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      aria-label="Toggle sidebar"
      aria-expanded={expanded}
      className={cn(
        'group relative flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full md:size-9',
        'border border-border/50 bg-card/70 text-muted-foreground',
        'transition-all duration-200 hover:border-primary/35 hover:text-foreground',
        'active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
        className,
      )}
    >
      <PanelLeft className="size-4 transition-transform duration-200 group-hover:scale-105" />
    </button>
  );
}

function AttentionLink({
  to,
  count,
  label,
  tone,
  icon: Icon,
}: {
  to: string;
  count: number;
  label: string;
  tone: 'amber' | 'primary';
  icon: React.ComponentType<{ className?: string }>;
}) {
  if (count <= 0) return null;
  return (
    <Link
      to={to}
      aria-label={`${label}: ${count}`}
      title={label}
      className={cn(
        'relative flex size-10 cursor-pointer items-center justify-center rounded-full md:size-9',
        'border border-border/50 bg-card/70 text-muted-foreground',
        'transition-colors hover:border-primary/35 hover:text-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
      )}
    >
      <Icon className="size-4" />
      <span
        className={cn(
          'absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-semibold',
          tone === 'amber'
            ? 'bg-amber-500 text-amber-950'
            : 'bg-primary text-primary-foreground',
        )}
      >
        {count > 9 ? '9+' : count}
      </span>
    </Link>
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
  const unread = dashboard.data?.newContactResponses ?? 0;
  const pendingReviews = dashboard.data?.pendingTestimonials ?? 0;
  const [accountOpen, setAccountOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-30 shrink-0 border-b border-border/50 bg-background/90 pt-[env(safe-area-inset-top)] backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
      <div className="flex h-14 items-center gap-2 px-4 sm:gap-3 sm:px-5">
        <AdminSidebarTrigger />

        <div className="min-w-0 flex-1 md:hidden">
          {mobileParent ? (
            <p className="cursor-default truncate text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
              {mobileParent}
            </p>
          ) : null}
          <p className="cursor-default truncate text-[13px] font-semibold tracking-tight text-foreground sm:text-sm">
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

        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          <AttentionLink
            to={adminPath('contact-responses')}
            count={unread}
            label={fr ? 'Messages non lus' : 'Unread messages'}
            tone="amber"
            icon={MessageSquareText}
          />
          <AttentionLink
            to={adminPath('testimonials')}
            count={pendingReviews}
            label={fr ? 'Avis à valider' : 'Pending reviews'}
            tone="primary"
            icon={Star}
          />
          <LanguageToggle className="h-8 w-[3.25rem] shrink-0" />
          <ThemeToggle className="size-8 shrink-0" />

          <DropdownMenu open={accountOpen} onOpenChange={setAccountOpen}>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  'flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-full md:size-9',
                  'ring-1 ring-border/60 transition-shadow hover:ring-primary/40',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
                )}
                aria-label={fr ? 'Menu compte' : 'Account menu'}
              >
                <img src={avatar} alt="" className="size-full object-cover object-top" />
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
