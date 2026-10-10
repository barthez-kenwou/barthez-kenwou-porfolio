import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Menu, MessageSquareText, NotebookPen } from 'lucide-react';
import { useSidebar } from '@/shared/ui/sidebar';
import { useAdminDashboard } from '@/features/admin-cms';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { ADMIN_BASE, adminPath } from '@/shared/config/admin';
import { cn } from '@/shared/lib/utils';

/**
 * Thumb-zone dock for owner workflows on the go:
 * glance dashboard → publish content → triage inbox → full menu.
 */
export function AdminMobileDock() {
  const location = useLocation();
  const { setOpenMobile } = useSidebar();
  const language = useLanguageStore((s) => s.language);
  const fr = language === 'fr';
  const dashboard = useAdminDashboard();
  const unread = dashboard.data?.newContactResponses ?? 0;
  const pendingReviews = dashboard.data?.pendingTestimonials ?? 0;

  const items = [
    {
      id: 'home',
      href: ADMIN_BASE,
      label: fr ? 'Accueil' : 'Home',
      icon: LayoutDashboard,
      match: (path: string) => path === ADMIN_BASE || path === `${ADMIN_BASE}/`,
    },
    {
      id: 'blogs',
      href: adminPath('blogs'),
      label: 'Blogs',
      icon: NotebookPen,
      match: (path: string) => path.startsWith(adminPath('blogs')),
    },
    {
      id: 'inbox',
      href: adminPath('contact-responses'),
      label: fr ? 'Inbox' : 'Inbox',
      icon: MessageSquareText,
      match: (path: string) => path.startsWith(adminPath('contact-responses')),
      badge: unread,
    },
  ] as const;

  return (
    <nav
      aria-label={fr ? 'Navigation rapide' : 'Quick navigation'}
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 md:hidden',
        'border-t border-border/70 bg-background/92 backdrop-blur-xl',
        'pb-[max(0.5rem,env(safe-area-inset-bottom))]',
      )}
    >
      <div className="mx-auto grid h-14 max-w-lg grid-cols-4 px-1">
        {items.map((item) => {
          const active = item.match(location.pathname);
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              to={item.href}
              className={cn(
                'relative flex flex-col items-center justify-center gap-0.5 rounded-lg',
                'text-[10px] font-medium tracking-wide transition-colors',
                active ? 'text-primary' : 'text-muted-foreground active:text-foreground',
              )}
            >
              <Icon className={cn('size-[1.15rem]', active && 'stroke-[2.25]')} />
              <span>{item.label}</span>
              {'badge' in item && item.badge > 0 ? (
                <span className="absolute right-[18%] top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[9px] font-semibold text-amber-950">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}

        <button
          type="button"
          onClick={() => setOpenMobile(true)}
          className="relative flex cursor-pointer flex-col items-center justify-center gap-0.5 rounded-lg text-[10px] font-medium tracking-wide text-muted-foreground active:text-foreground"
        >
          <Menu className="size-[1.15rem]" />
          <span>{fr ? 'Menu' : 'Menu'}</span>
          {pendingReviews > 0 ? (
            <span className="absolute right-[18%] top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-semibold text-primary-foreground">
              {pendingReviews > 9 ? '9+' : pendingReviews}
            </span>
          ) : null}
        </button>
      </div>
    </nav>
  );
}
