import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { ThemeToggle } from '@/shared/ui/ThemeToggle';
import { LanguageToggle } from '@/shared/ui/LanguageToggle';
import { socialLinks } from '@/shared/constants/socialLink.const';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip';
import { Button } from '@/shared/ui/Button';
import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/lib/utils';
import { useSidebarReveal } from '../useSidebarReveal';

const CONTACT_FROM_SIDEBAR = '/contact?from=sidebar';

/**
 * Socials, theme/lang, and persistent Contact CTA (business conversion).
 * CV download stays in the top navbar utility.
 */
export const SidebarFooterSection: React.FC = () => {
  const { isExpanded, contentReady } = useSidebarReveal();
  const { t } = useTranslation();

  const contactButton = (
    <Button
      asChild
      className={cn(
        'transition-[width,height,padding,filter,box-shadow] duration-500 ease-in-out',
        'hover:brightness-[0.86] hover:shadow-sm active:brightness-[0.78]',
        contentReady ? 'w-full' : 'h-10 w-10 gap-0 p-0',
      )}
      size={contentReady ? 'default' : 'icon'}
    >
      <Link
        to={CONTACT_FROM_SIDEBAR}
        onMouseEnter={() => {
          void import('@/app/routes/prefetch').then((m) => m.prefetchRoute('/contact'));
        }}
        onTouchStart={() => {
          void import('@/app/routes/prefetch').then((m) => m.prefetchRoute('/contact'));
        }}
        aria-label={t('nav.contactCta')}
        className={cn(!contentReady && 'justify-center gap-0')}
      >
        <Mail className="h-4 w-4 shrink-0" />
        {contentReady ? <span>{t('nav.contactCta')}</span> : null}
      </Link>
    </Button>
  );

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          'flex flex-col gap-4 border-t transition-[padding] duration-500 ease-in-out',
          contentReady ? 'p-4' : 'p-2',
        )}
      >
        <div className={cn('flex flex-col gap-2', contentReady ? 'px-3' : 'px-0')}>
          <div
            className={cn(
              'flex gap-2',
              contentReady ? 'justify-center' : 'flex-col items-center',
            )}
          >
            {socialLinks.map((link) => {
              const Icon = link.icon;
              const socialLink = (
                <Link
                  key={link.label}
                  to={link.href}
                  className="flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-colors duration-300 hover:bg-secondary hover:text-primary"
                  aria-label={link.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon className="h-5 w-5" />
                </Link>
              );

              return !isExpanded || !contentReady ? (
                <Tooltip key={link.label}>
                  <TooltipTrigger asChild>{socialLink}</TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {link.label}
                  </TooltipContent>
                </Tooltip>
              ) : (
                socialLink
              );
            })}
          </div>

          <div
            className={cn(
              'flex gap-2',
              contentReady ? 'justify-center' : 'flex-col items-center',
            )}
          >
            {!contentReady ? (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <ThemeToggle />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    Toggle theme
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <LanguageToggle flagOnly />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    Change language
                  </TooltipContent>
                </Tooltip>
              </>
            ) : (
              <>
                <ThemeToggle />
                <LanguageToggle />
              </>
            )}
          </div>
        </div>

        {!contentReady ? (
          <div className="flex justify-center">
            <Tooltip>
              <TooltipTrigger asChild>{contactButton}</TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                {t('nav.contactCta')}
              </TooltipContent>
            </Tooltip>
          </div>
        ) : (
          contactButton
        )}
      </div>
    </TooltipProvider>
  );
};
