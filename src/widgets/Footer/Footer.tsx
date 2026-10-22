import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-2 w-full min-h-[4.75rem] border-t bg-background px-4 pt-3 pb-21 md:min-h-[5.5rem] md:px-10 md:pt-3 md:pb-24 lg:px-14 xl:min-h-[3rem] xl:pb-3">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 text-[11px] text-foreground/50 md:flex-row md:gap-0 md:text-xs">
        <div className="hidden text-center md:block md:text-left">
          &copy;&nbsp;copyrights {new Date().getFullYear()}. All rights reserved.
        </div>

        <div className="px-2 text-center font-medium text-balance md:text-right">
          Barthez Kenwou <span className="mx-1 text-border">|</span>{' '}
          <span className="inline">DevOps Engineer & Fullstack Developer</span>
        </div>
      </div>
    </footer>
  );
};
