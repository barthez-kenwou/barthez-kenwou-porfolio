import { useState } from 'react';
import { useLanguageStore } from '../../state/useLanguageStore';
import { cn } from '@/shared/lib/utils';

type LanguageToggleProps = {
  /** Sidebar collapsed: flag only, no FR/EN label */
  flagOnly?: boolean;
  className?: string;
};

/**
 * Language switcher with 3D flip (FR ↔ EN).
 * Use `flagOnly` in the collapsed sidebar; header keeps the full control.
 */
export const LanguageToggle = ({ flagOnly = false, className }: LanguageToggleProps) => {
  const { language, toggleLanguage } = useLanguageStore();
  const [isFlipping, setIsFlipping] = useState(false);

  const handleToggle = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    toggleLanguage();
    setTimeout(() => setIsFlipping(false), 600);
  };

  const isFrench = language === 'fr';

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isFlipping}
      className={cn(
        // Named group so sidebar's ancestor `group` does not fake a hover state
        'group/lang relative inline-flex shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-md',
        'transition-[box-shadow,background-color] duration-200 ease-out',
        'hover:bg-secondary/80 hover:shadow-sm',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
        'disabled:cursor-not-allowed disabled:opacity-70',
        flagOnly ? 'size-9' : 'h-9 w-14',
        className,
      )}
      aria-label={isFrench ? 'Switch to English' : 'Passer en français'}
      style={{ perspective: '1000px' }}
    >
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-br transition-opacity duration-200',
          'opacity-60 group-hover/lang:opacity-100',
          isFrench
            ? 'from-primary/15 via-foreground/5 to-muted/15'
            : 'from-primary/10 via-foreground/5 to-muted/10',
        )}
      />

      <div
        className="relative w-full h-full flex items-center justify-center"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFrench ? 'rotateY(0deg)' : 'rotateY(180deg)',
          transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center',
            flagOnly ? '' : 'flex-row gap-1',
          )}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)',
          }}
        >
          <span className={cn('leading-none', flagOnly ? 'text-xl' : 'text-lg')}>🇫🇷</span>
          {!flagOnly && (
            <span className="text-[10px] font-bold text-foreground/80 tracking-wider">FR</span>
          )}
        </div>

        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center',
            flagOnly ? '' : 'flex-row gap-0.5',
          )}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <span className={cn('leading-none', flagOnly ? 'text-xl' : 'text-lg')}>🇬🇧</span>
          {!flagOnly && (
            <span className="text-[10px] font-bold text-foreground/80 tracking-wider">EN</span>
          )}
        </div>
      </div>

      <div className="absolute inset-0 rounded-md border border-border/50 pointer-events-none" />
    </button>
  );
};
