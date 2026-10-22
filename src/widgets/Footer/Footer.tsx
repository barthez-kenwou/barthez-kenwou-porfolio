import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-2 w-full min-h-[5.25rem] border-t bg-background px-4 pt-3 pb-[max(5.25rem,env(safe-area-inset-bottom))] md:min-h-[5.5rem] md:px-10 md:pt-3 md:pb-24 lg:px-14 xl:min-h-[3.25rem] xl:pb-3">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 text-[11px] text-foreground/50 md:flex-row md:gap-0 md:text-xs">
        <div className="hidden min-h-[1rem] text-center md:block md:text-left">
          &copy;&nbsp;copyrights {new Date().getFullYear()}. All rights reserved.
        </div>

        {/* Fixed line box reduces CLS when webfonts swap in (Lighthouse culprit: footer). */}
        <div className="flex min-h-[2.5rem] items-center px-2 text-center font-medium text-balance md:min-h-0 md:text-right">
          Barthez Kenwou <span className="mx-1 text-border">|</span>{' '}
          <span className="inline">DevOps Engineer & Fullstack Developer</span>
        </div>
      </div>
    </footer>
  );
};
