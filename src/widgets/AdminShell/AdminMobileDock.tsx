import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Menu, MessageSquareText, NotebookPen, Star } from 'lucide-react';
import { useSidebar } from '@/shared/ui/sidebar';
import { useAdminDashboard } from '@/features/admin-cms';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { ADMIN_BASE, adminPath } from '@/shared/config/admin';
import { cn } from '@/shared/lib/utils';

/**
 * Thumb-zone dock: dashboard → blogs → inbox → reviews → full menu.
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
      label: 'Inbox',
      icon: MessageSquareText,
      match: (path: string) => path.startsWith(adminPath('contact-responses')),
      badge: unread,
      badgeTone: 'amber' as const,
    },
    {
      id: 'reviews',
      href: adminPath('testimonials'),
      label: fr ? 'Avis' : 'Reviews',
      icon: Star,
      match: (path: string) => path.startsWith(adminPath('testimonials')),
      badge: pendingReviews,
      badgeTone: 'primary' as const,
    },
  ] as const;

  return (
    <nav
      aria-label={fr ? 'Navigation rapide' : 'Quick navigation'}
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 md:hidden',
        'border-t border-border/70 bg-background/95 backdrop-blur-xl',
        'pb-[max(0.4rem,env(safe-area-inset-bottom))]',
      )}
    >
      <div className="mx-auto grid h-[3.65rem] max-w-lg grid-cols-5 gap-0.5 px-1">
        {items.map((item) => {
          const active = item.match(location.pathname);
          const Icon = item.icon;
          const badge = 'badge' in item ? item.badge : 0;
          const tone = 'badgeTone' in item ? item.badgeTone : 'amber';
          return (
            <Link
              key={item.id}
              to={item.href}
              className={cn(
                'relative flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg',
                'text-[10px] font-medium leading-none tracking-wide transition-colors',
                active ? 'text-primary' : 'text-muted-foreground active:text-foreground',
              )}
            >
              <Icon className={cn('size-5', active && 'stroke-[2.25]')} />
              <span className="max-w-full truncate px-0.5">{item.label}</span>
              {badge > 0 ? (
                <span
                  className={cn(
                    'absolute right-[8%] top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-semibold',
                    tone === 'primary'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-amber-500 text-amber-950',
                  )}
                >
                  {badge > 9 ? '9+' : badge}
                </span>
              ) : null}
            </Link>
          );
        })}

        <button
          type="button"
          onClick={() => setOpenMobile(true)}
          className="relative flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg text-[10px] font-medium leading-none tracking-wide text-muted-foreground active:text-foreground"
        >
          <Menu className="size-5" />
          <span>{fr ? 'Menu' : 'Menu'}</span>
        </button>
      </div>
    </nav>
  );
}
