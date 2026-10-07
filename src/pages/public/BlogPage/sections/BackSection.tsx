import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { HiOutlineArrowLeft } from 'react-icons/hi2';
import React from 'react';
import { Link } from 'react-router-dom';

export const BackSection: React.FC = () => {
  const { language } = useLanguageStore();

  return (
    <div className="mb-4 flex items-center justify-between">
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/40 border border-border/40 text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/5 hover:border-primary/20 transition-all group"
      >
        <HiOutlineArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
        {language === 'fr' ? 'Retour' : 'Back'}
      </Link>

      <div className="hidden md:flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">
        <div className="h-px w-6 bg-border" />
        <span>Barthez Kenwou • Blog</span>
      </div>
    </div>
  );
};
