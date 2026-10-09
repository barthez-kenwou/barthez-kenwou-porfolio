import { mapServiceDtoToCard, ServiceCard, usePublicServices } from '@/entities/services';
import { QueryState } from '@/shared/ui/QueryState';
import React, { useMemo } from 'react';
import { CurrencyToggle } from './CurrencyToggle';

export const ServicesSection: React.FC = () => {
  const { data, isPending, isError, error } = usePublicServices();

  const services = useMemo(
    () => (data?.data.items ?? []).map(mapServiceDtoToCard),
    [data],
  );

  return (
    <section className="relative z-10 -mt-4 py-4 md:-mt-6">
      <CurrencyToggle />

      <QueryState
        isPending={isPending}
        isError={isError}
        errorMessage={error instanceof Error ? error.message : undefined}
        source={data?.source}
        empty={!isPending && services.length === 0}
        className="mb-16 px-4 md:mb-20 md:px-10 lg:px-14"
      >
        <div className="mb-16 grid gap-5 px-4 md:mb-20 md:grid-cols-2 md:gap-6 md:px-10 lg:grid-cols-3 lg:px-14">
          {services.map((service, index) => (
            <ServiceCard key={service.id ?? index} Service={service} />
          ))}
        </div>
      </QueryState>
    </section>
  );
};
