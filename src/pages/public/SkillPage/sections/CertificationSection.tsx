import { usePublicCertifications } from '@/entities/certifications/hooks/useCertifications';
import { CertificationCard } from '@/entities/certifications/ui/certificationCard.ui';
import { QueryState } from '@/shared/ui/QueryState';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaAward } from 'react-icons/fa6';

export const CertificationSection: React.FC = () => {
  const { t } = useTranslation();
  const { data, isPending, isError, error } = usePublicCertifications();
  const certifications = data?.data.items ?? [];

  return (
    <section className="mb-6 px-4 md:px-10 lg:px-14">
      <div className="glass rounded-md border border-border p-3">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-sm bg-primary/10 p-2">
            <FaAward className="h-4 w-4 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">{t('skills.certifications')}</h3>
        </div>

        <QueryState
          isPending={isPending}
          isError={isError}
          errorMessage={error instanceof Error ? error.message : undefined}
          source={data?.source}
          empty={!isPending && certifications.length === 0}
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {certifications.map((cert, index) => (
              <CertificationCard key={cert.id ?? index * 5} Certification={cert} />
            ))}
          </div>
        </QueryState>
      </div>
    </section>
  );
};
