import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/shared/ui/sidebar.tsx';
import { sidebarNavItems } from '@/shared/constants/navItems.const';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip';
import { cn } from '@/shared/lib/utils';
import { useSidebarReveal } from '../useSidebarReveal';

/**
 * Sidebar navigation - list items must sit inside a real <ul> (SidebarMenu)
 * for a well-formed accessibility tree.
 */
export const SidebarContentSection: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { isExpanded, contentReady } = useSidebarReveal();

  return (
    <TooltipProvider delayDuration={0}>
      <nav
        aria-label={t('nav.main', { defaultValue: 'Navigation principale' })}
        className={cn(
          'w-full transition-[padding] duration-500 ease-in-out',
          contentReady ? 'p-4' : 'p-2',
        )}
      >
        <SidebarMenu className="gap-2">
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
                className={cn(
                  'group relative flex items-center rounded-sm transition-[background-color,color,padding,gap] duration-500 ease-in-out',
                  isActive
                    ? 'bg-brand text-brand-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                  contentReady ? 'gap-3 px-3 py-4' : 'justify-center px-3 py-3',
                )}
                aria-label={t(item.labelKey)}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                <span
                  className={cn(
                    'overflow-hidden whitespace-nowrap text-sm font-medium transition-[opacity,max-width] duration-500 ease-in-out',
                    contentReady ? 'max-w-[10rem] opacity-100' : 'max-w-0 opacity-0',
                  )}
                  aria-hidden={!contentReady}
                >
                  {t(item.labelKey)}
                </span>
              </NavLink>
            );

            return (
              <SidebarMenuItem key={item.id} className="w-full">
                <SidebarMenuButton asChild isActive={isActive}>
                  {!isExpanded || !contentReady ? (
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
