import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { useThemeStore } from '@/shared/state/useThemeStore';
import { cn } from '@/shared/lib/utils';

/** Local assets — light SVG recolored to brand amethyst; dark keeps contribution neon. */
const SNAKE_LIGHT = '/images/github-snake-brand-light.svg';
const SNAKE_DARK = '/images/github-snake-dark.svg';

export const EndContact = () => {
  const { language } = useLanguageStore();
  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === 'dark';

  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-sm border p-5 md:p-8',
        'border-primary/20 bg-primary/[0.06]',
        'dark:border-border dark:bg-card',
      )}
    >
      <div className="flex flex-col items-stretch gap-8 lg:flex-row">
        <div className="group relative min-w-0 flex-1">
          {/* Window chrome — light: soft amethyst bar; dark: classic terminal */}
          <div
            className={cn(
              'flex items-center gap-1.5 rounded-t-sm border border-b-0 px-4 py-2.5',
              isDark
                ? 'border-zinc-700/80 bg-[#0d1117]'
                : 'border-primary/20 bg-[#f3eff9]',
            )}
          >
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
            <span
              className={cn(
                'ml-2 font-mono text-[10px]',
                isDark ? 'text-zinc-400' : 'text-primary/70',
              )}
            >
              barthez-github-contribution.sh
            </span>
          </div>

          <div
            className={cn(
              'relative flex items-center justify-center overflow-hidden rounded-b-sm border p-2 transition-colors duration-300',
              isDark
                ? 'border-zinc-700/80 bg-[#0d1117] group-hover:border-primary/50'
                : 'border-primary/20 bg-[#faf8fd] group-hover:border-primary/40',
            )}
          >
            <div
              className={cn(
                'pointer-events-none absolute inset-0',
                isDark
                  ? 'bg-gradient-to-tr from-primary/15 to-transparent'
                  : 'bg-gradient-to-tr from-primary/10 to-transparent',
              )}
            />

            <img
              key={isDark ? 'dark' : 'light'}
              src={isDark ? SNAKE_DARK : SNAKE_LIGHT}
              alt="Github snake game"
              className="relative z-10 h-auto w-full max-w-4xl select-none pointer-events-none"
            />
          </div>
        </div>

        <div
          className={cn(
            'group relative flex w-full flex-col justify-center overflow-hidden rounded-sm border p-5 md:p-6 lg:w-[320px]',
            'border-primary/25 bg-card',
            'dark:border-border dark:bg-background',
          )}
        >
          <div className="relative mx-auto w-full">
            <div className="pointer-events-none absolute -top-8 -left-2 select-none font-serif text-6xl leading-none text-primary/40 dark:text-primary/30">
              "
            </div>

            <p className="relative z-10 text-center text-[14px] leading-relaxed font-medium tracking-wide text-foreground italic">
              {language === 'fr'
                ? 'Notre Dieu est un grand programmeur, je suis un fils de Dieu.'
                : "Our God is a great programmer, I'm a child of God."}
            </p>

            <div className="mt-6 flex flex-col items-center gap-2">
              <div className="flex w-full items-center justify-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/50 dark:to-primary/35" />
                <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase whitespace-nowrap">
                  Barthez Kenwou
                </span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/50 dark:to-primary/35" />
              </div>
              <span className="font-mono text-[8px] tracking-widest text-muted-foreground uppercase">
                DevOps Engineer
              </span>
            </div>

            <div className="pointer-events-none absolute -right-4 -bottom-10 rotate-180 select-none font-serif text-6xl leading-none text-primary/40 dark:text-primary/30">
              "
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
