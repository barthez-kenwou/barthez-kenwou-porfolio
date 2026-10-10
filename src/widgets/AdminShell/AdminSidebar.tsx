import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { ADMIN_BASE, ADMIN_LOGIN } from '@/shared/config/admin';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/shared/ui/sidebar';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';
import { adminDashboardItem, adminNavGroups } from './adminNav';

function isNavActive(pathname: string, itemPath: string): boolean {
  if (itemPath === ADMIN_BASE) {
    return pathname === ADMIN_BASE || pathname === `${ADMIN_BASE}/`;
  }
  return pathname === itemPath || pathname.startsWith(`${itemPath}/`);
}

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const language = useLanguageStore((s) => s.language);
  const fr = language === 'fr';

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="border-b border-sidebar-border/50 px-3 py-4 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-3">
        <Link
          to={ADMIN_BASE}
          className="flex items-center gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/40 group-data-[collapsible=icon]:justify-center"
        >
          <img
            src="/icons/logo-mark.png"
            alt=""
            className="size-9 shrink-0 rounded-md object-cover ring-1 ring-border/40 group-data-[collapsible=icon]:size-8"
          />
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-[13px] font-semibold tracking-tight text-sidebar-foreground">
              Barthez Kenwou
            </p>
            <p className="truncate text-[11px] tracking-wide text-muted-foreground">
              Portfolio Admin
            </p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="gap-1 px-2 py-3 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:overflow-x-hidden group-data-[collapsible=icon]:px-0">
        <SidebarGroup className="pb-2 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:p-0">
          <SidebarGroupContent className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center">
            <SidebarMenu className="group-data-[collapsible=icon]:items-center">
              <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center">
                <SidebarMenuButton
                  asChild
                  isActive={isNavActive(location.pathname, adminDashboardItem.path)}
                  tooltip={fr ? adminDashboardItem.labelFr : adminDashboardItem.labelEn}
                  className={cn(
                    'h-10 justify-start rounded-md font-medium',
                    'group-data-[collapsible=icon]:!mx-auto group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!max-w-8 group-data-[collapsible=icon]:!justify-center group-data-[collapsible=icon]:!gap-0 group-data-[collapsible=icon]:!overflow-visible group-data-[collapsible=icon]:!p-0',
                  )}
                >
                  <Link
                    to={adminDashboardItem.path}
                    className="group-data-[collapsible=icon]:justify-center"
                  >
                    <span className="flex size-5 shrink-0 items-center justify-center text-[10px] text-primary">
                      {adminDashboardItem.mark}
                    </span>
                    <span className="group-data-[collapsible=icon]:hidden">
                      {fr ? adminDashboardItem.labelFr : adminDashboardItem.labelEn}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mx-2 mb-2 h-px w-auto bg-sidebar-border/60 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:w-6" />

        {adminNavGroups.map((group) => (
          <SidebarGroup
            key={group.id}
            className="py-1 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:p-0"
          >
            <SidebarGroupLabel className="px-2 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/80 group-data-[collapsible=icon]:!m-0 group-data-[collapsible=icon]:!h-0 group-data-[collapsible=icon]:!overflow-hidden group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:!opacity-0">
              {fr ? group.labelFr : group.labelEn}
            </SidebarGroupLabel>
            <SidebarGroupContent className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center">
              <SidebarMenu className="group-data-[collapsible=icon]:items-center">
                {group.items.map((item) => {
                  const label = fr ? item.labelFr : item.labelEn;
                  const active = isNavActive(location.pathname, item.path);
                  return (
                    <SidebarMenuItem
                      key={item.path}
                      className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center"
                    >
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={label}
                        className={cn(
                          'h-10 justify-start rounded-md',
                          'group-data-[collapsible=icon]:!mx-auto group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!max-w-8 group-data-[collapsible=icon]:!justify-center group-data-[collapsible=icon]:!gap-0 group-data-[collapsible=icon]:!overflow-visible group-data-[collapsible=icon]:!p-0',
                        )}
                      >
                        <Link to={item.path} className="group-data-[collapsible=icon]:justify-center">
                          <span
                            className={cn(
                              'flex size-5 shrink-0 items-center justify-center font-mono text-[10px] tracking-tight',
                              active ? 'text-primary' : 'text-muted-foreground/70',
                            )}
                          >
                            {item.mark}
                          </span>
                          <span className="group-data-[collapsible=icon]:hidden">{label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/50 p-3 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2">
        <Button
          variant="ghost"
          className="h-10 w-full justify-start gap-2 rounded-md px-2 text-muted-foreground hover:text-destructive group-data-[collapsible=icon]:!mx-auto group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!max-w-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:p-0"
          onClick={() => {
            void Promise.resolve(logout()).finally(() => {
              navigate(ADMIN_LOGIN, { replace: true });
            });
          }}
        >
          <LogOut className="size-4 shrink-0" />
          <span className="group-data-[collapsible=icon]:hidden">
            {fr ? 'Déconnexion' : 'Sign out'}
          </span>
        </Button>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
