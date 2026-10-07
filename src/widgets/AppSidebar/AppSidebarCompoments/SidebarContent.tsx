import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/shared/ui/sidebar.tsx';
import { sidebarNavItems } from '@/shared/constants/navItems.const';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip';

/**
 * Sidebar navigation - list items must sit inside a real <ul> (SidebarMenu)
 * for a well-formed accessibility tree.
 */
export const SidebarContentSection: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { state } = useSidebar();
  const isExpanded = state === 'expanded';

  return (
    <TooltipProvider delayDuration={0}>
      <nav
        aria-label={t('nav.main', { defaultValue: 'Navigation principale' })}
        className={`w-full transition-all duration-300 ${isExpanded ? 'p-4' : 'p-2'}`}
      >
        <SidebarMenu className={`gap-2 ${isExpanded ? '' : ''}`}>
          {sidebarNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.id;

            const linkContent = (
              <NavLink
                to={item.id}
                onMouseEnter={() => {
                  void import('@/app/routes/prefetch').then((m) => m.prefetchRoute(item.id));
                }}
                onTouchStart={() => {
                  void import('@/app/routes/prefetch').then((m) => m.prefetchRoute(item.id));
                }}
                className={`group relative flex items-center rounded-sm transition-all duration-300 ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                } ${isExpanded ? 'gap-3 px-3 py-4' : 'justify-center px-3 py-3'}`}
                aria-label={t(item.labelKey)}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                {isExpanded && <span className="text-sm font-medium">{t(item.labelKey)}</span>}
              </NavLink>
            );

            return (
              <SidebarMenuItem key={item.id} className="w-full">
                <SidebarMenuButton asChild isActive={isActive}>
                  {!isExpanded ? (
                    <Tooltip>
                      <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                      <TooltipContent side="right" className="font-medium">
                        {t(item.labelKey)}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    linkContent
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </nav>
    </TooltipProvider>
  );
};
