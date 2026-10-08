import { AiOutlineDownload } from 'react-icons/ai';
import { navItems } from '@/shared/constants/navItems.const';
import { Button } from '@/shared/ui/Button';
import { LanguageToggle } from '@/shared/ui/LanguageToggle';
import { ThemeToggle } from '@/shared/ui/ThemeToggle';
import { SidebarTrigger } from '@/shared/ui/sidebar';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { useThemeStore } from '@/shared/state/useThemeStore';

export const MobileNavbar: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const IconBlog = navItems[5].icon;
  const textBlog = navItems[5].labelKey;
  const language = useLanguageStore((s) => s.language);
  const theme = useThemeStore((s) => s.theme);

  const themeLabel =
    theme === 'dark'
      ? language === 'fr'
        ? 'Passer en mode clair'
        : 'Switch to light mode'
      : language === 'fr'
        ? 'Passer en mode sombre'
        : 'Switch to dark mode';

  const languageLabel = language === 'fr' ? 'Switch to English' : 'Passer en français';

  // Bottom dock: Blog lives in the top bar; Skills stays in the sidebar.
  // Keep Contact as a one-tap destination.
  // Visibility: xl:hidden — must stay in sync with PUBLIC_SHELL_BREAKPOINT (1280)
  // so the docked AppSidebar never appears alongside this chrome.
  const bottomNavItems = navItems.filter((item) => item.id !== '/blog' && item.id !== '/skills');

  return (
    <div className="xl:hidden">
      {/* Top bar with toggles */}
      <nav className="fixed top-6 left-0 right-0 z-50 w-full flex items-center justify-between gap-2 px-3 sm:px-6 py-1 backdrop-blur-sm border-b border-border/10">
        <div className="flex items-center gap-1.5">
          <SidebarTrigger className="h-6 w-6 cursor-pointer shadow-sm bg-background/80 backdrop-blur-sm ring-1 ring-sidebar-border" />

          <div className="h-6 w-px bg-border/50 mx-.5" />

          <Button variant={'outline'} asChild className="px-2 h-8">
            <Link
              to="/blog"
              onMouseEnter={() => {
                void import('@/app/routes/prefetch').then((m) => m.prefetchRoute('/blog'));
              }}
              onTouchStart={() => {
                void import('@/app/routes/prefetch').then((m) => m.prefetchRoute('/blog'));
              }}
            >
              <IconBlog className={`h-2 w-2`} />
              <span className="text-xs">{t(textBlog)}</span>
            </Link>
          </Button>

          <Button
            asChild
            className="w-fit px-2 h-8 font-semibold text-primary-foreground contrast-more:text-white"
          >
            <Link
              to="/cv"
              onMouseEnter={() => {
                void import('@/app/routes/prefetch').then((m) => m.prefetchRoute('/cv'));
              }}
              onTouchStart={() => {
                void import('@/app/routes/prefetch').then((m) => m.prefetchRoute('/cv'));
              }}
            >
              <AiOutlineDownload className="mr-.5 h-2 w-2" />
              <span className="text-sm font-semibold !text-white">{t('nav.cv')}</span>
            </Link>
          </Button>
        </div>

        <TooltipProvider delayDuration={0}>
          <div className="flex items-center gap-0 md:gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-flex">
                  <ThemeToggle />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="font-medium">
                {themeLabel}
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-flex">
                  <LanguageToggle />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="font-medium">
                {languageLabel}
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </nav>

      {/* Bottom Navbar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-xl">
        <div className="flex items-center justify-around gap-0.5 px-2 py-3">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.id;

            return (
              <NavLink
                key={item.id}
                to={item.id}
                onMouseEnter={() => {
                  void import('@/app/routes/prefetch').then((m) => m.prefetchRoute(item.id));
                }}
                onTouchStart={() => {
                  void import('@/app/routes/prefetch').then((m) => m.prefetchRoute(item.id));
                }}
                className={`relative flex flex-col items-center gap-1 px-2.5 py-2 rounded-xl transition-all duration-300
                ${
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'scale-110' : ''}`} />
                <span className="text-xs text-nowrap font-medium">{t(item.labelKey)}</span>
                {isActive && (
                  <span className="absolute -top-0.5 h-0.5 w-8 rounded-full bg-primary" />
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
