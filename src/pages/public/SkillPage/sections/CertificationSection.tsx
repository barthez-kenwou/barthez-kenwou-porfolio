import { certifications } from '@/entities/certifications/api/mocks/certifications.mocks';
import { CertificationCard } from '@/entities/certifications/ui/certificationCard.ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaAward } from 'react-icons/fa6';

export const CertificationSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="mb-6 px-4 md:px-10 lg:px-14">
      <div className="glass rounded-md border border-border p-3">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-sm bg-primary/10 p-2">
            <FaAward className="h-4 w-4 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">{t('skills.certifications')}</h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {certifications.map((cert, index) => (
            <CertificationCard key={index * 5} Certification={cert} />
          ))}
        </div>
      </div>
    </section>
  );
};
