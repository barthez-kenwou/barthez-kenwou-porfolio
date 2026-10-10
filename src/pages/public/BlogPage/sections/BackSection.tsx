import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { HiOutlineArrowLeft } from 'react-icons/hi2';
import React from 'react';
import { Link } from 'react-router-dom';

export const BackSection: React.FC = () => {
  const { language } = useLanguageStore();

  return (
    <Link
      to="/blog"
      className="inline-flex items-center gap-1.5 text-[12px] font-medium text-foreground/60 transition-colors hover:text-foreground"
    >
      <HiOutlineArrowLeft className="size-3.5 shrink-0" />
      {language === 'fr' ? 'Retour' : 'Back'}
    </Link>
  );
};
