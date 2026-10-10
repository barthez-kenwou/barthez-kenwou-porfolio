import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ThemeToggle } from '@/shared/ui/ThemeToggle';
import { LanguageToggle } from '@/shared/ui/LanguageToggle';
import { navItems } from '@/shared/constants/navItems.const';
import { socialLinks } from '@/shared/constants/socialLink.const';
import { CvButton } from '@/shared/ui/CvButton/CvButton';
import { useNavbarPosition } from './hooks';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip';
import { trackSocialClick } from '@/app/lib/analytics';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { useThemeStore } from '@/shared/state/useThemeStore';

/**
 * Navbar Component - Barre de navigation principale de l'application
 *
 * Caractéristiques:
 * - Position sticky en haut de l'écran lors du scroll
 * - Centrage dynamique en fonction de l'état du sidebar (expanded/collapsed)
 * - Responsive avec masquage sur mobile (< xl breakpoint)
 * - Effets glass morphism pour un design moderne
 *
 * @component
 */
export const Navbar: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const navbarStyle = useNavbarPosition();
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

  return (
    <header
      className="fixed m-0 top-4 z-40 hidden xl:block transition-all duration-300 ease-in-out"
      style={navbarStyle}
    >
      <nav className="glass rounded-full px-4 py-1 flex items-center gap-3 shadow-sm">
        {/* Navigation Links */}
        <div className="flex items-center md:gap-2 lg:gap-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.id;

            return (
              <NavLink
                key={item.id}
                to={item.id}
                onMouseEnter={() => {
                  void import('@/app/routes/prefetch').then((m) => m.prefetchRoute(item.id));
                }}
                onFocus={() => {
                  void import('@/app/routes/prefetch').then((m) => m.prefetchRoute(item.id));
                }}
                onTouchStart={() => {
                  void import('@/app/routes/prefetch').then((m) => m.prefetchRoute(item.id));
                }}
                className={`nav-link relative overflow-visible text-nowrap ${
                  isActive ? 'active' : ''
                }`}
              >
                {t(item.labelKey)}

                {isActive && (
                  <motion.div
                    layoutId="lamp"
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-full bg-primary/5 rounded-full -z-10"
                    initial={false}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    <div className="absolute -top-2 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-brand" />
                  </motion.div>
                )}
              </NavLink>
            );
          })}
        </div>

        <div className="h-6 w-px bg-border" />

        <TooltipProvider delayDuration={0}>
          <div className="flex items-center gap-1">
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

          <div className="h-6 w-px bg-border" />

          <div className="flex items-center gap-1">
            {socialLinks.map((link) => {
              const Icon = link.icon;

              return (
                <Tooltip key={link.label}>
                  <TooltipTrigger asChild>
                    <Link
                      to={link.href}
                      className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-all duration-300 hover:bg-secondary hover:text-primary"
                      aria-label={link.label}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackSocialClick(link.label, 'navbar')}
                    >
                      <Icon className="h-4 w-4" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="font-medium">
                    {link.label}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>

        <div className="transition-all hover:glow-primary hover:scale-105">
          <CvButton className="rounded-full" />
        </div>
      </nav>
    </header>
  );
};
