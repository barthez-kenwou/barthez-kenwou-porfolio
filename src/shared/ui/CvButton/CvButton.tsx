import { AiOutlineDownload } from 'react-icons/ai';
import React from 'react';
import { Button } from '../Button';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const CvButton: React.FC<React.HTMLAttributes<HTMLButtonElement>> = ({ className }) => {
  const { t } = useTranslation();

  return (
    <Button asChild className={`w-full py-0 ${className}`}>
      <Link to="/cv">
        <AiOutlineDownload className="mr-.5 h-2 w-2" />
        <span className="">{t('nav.cv')}</span>
      </Link>
    </Button>
  );
};
