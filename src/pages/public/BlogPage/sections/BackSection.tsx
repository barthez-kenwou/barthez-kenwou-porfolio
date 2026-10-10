import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { HiOutlineArrowLeft } from 'react-icons/hi2';
import React from 'react';
import { Link } from 'react-router-dom';

export const BackSection: React.FC = () => {
  const { language } = useLanguageStore();

  return (
    <div className="relative z-10 flex items-center justify-between">
      <Link
        to="/blog"
        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background/90 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/80 backdrop-blur-sm transition-colors hover:border-primary/40 hover:text-primary"
      >
        <HiOutlineArrowLeft className="size-3.5 shrink-0" />
        {language === 'fr' ? 'Retour' : 'Back'}
      </Link>

      <div className="hidden items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/40 md:flex">
        <div className="h-px w-5 bg-border" />
        <span>Barthez Kenwou · Blog</span>
      </div>
    </div>
  );
};
