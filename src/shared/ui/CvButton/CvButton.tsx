import { AiOutlineDownload } from 'react-icons/ai';
import React from 'react';
import { Button } from '../Button';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/lib/utils';

export const CvButton: React.FC<React.HTMLAttributes<HTMLButtonElement>> = ({ className }) => {
  const { t } = useTranslation();

  return (
    <Button
      asChild
      className={cn(
        'group w-auto shrink-0 py-0 transition-[filter,box-shadow] duration-200',
        'hover:brightness-[0.86] hover:shadow-sm',
        'active:brightness-[0.78]',
        className,
      )}
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
        <AiOutlineDownload className="mr-0.5 h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-y-px" />
        <span>{t('nav.cv')}</span>
      </Link>
    </Button>
  );
};
