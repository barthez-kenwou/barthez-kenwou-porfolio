import { usePublicTestimonialsQuery } from '@/entities/testimonies/hooks/useTestimonials';
import { StackedTestimonialsCarousel } from '@/entities/testimonies/ui/StackedTestimonialsCarousel';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { QueryState } from '@/shared/ui/QueryState';
import React from 'react';

export const TestimonialsSection: React.FC = () => {
  const { language } = useLanguageStore();
  const { data, isPending, isError, error } = usePublicTestimonialsQuery();
  const testimonials = data?.data ?? [];

  if (!isPending && !isError && testimonials.length === 0) return null;

  return (
    <section className="relative z-10 mx-auto max-w-7xl overflow-hidden px-4 py-12 md:px-10 md:py-16 lg:px-14 lg:py-20">
      <div className="relative z-10 mb-8 text-center md:mb-10">
        <h2 className="section-title">
          <span className="font-heading text-foreground">
            {language === 'fr' ? 'Ce Que Disent Mes Clients' : 'What My Clients Say'}
          </span>
        </h2>
      </div>

      <div className="relative z-10 mx-auto flex w-full justify-center">
        <QueryState
          isPending={isPending}
          isError={isError}
          errorMessage={error instanceof Error ? error.message : undefined}
          source={data?.source}
        >
          <StackedTestimonialsCarousel testimonials={testimonials} />
        </QueryState>
      </div>
    </section>
  );
};
