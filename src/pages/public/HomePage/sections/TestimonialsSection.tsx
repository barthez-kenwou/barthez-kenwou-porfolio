import { usePublicTestimonials } from '@/entities/testimonies/hooks/usePublicTestimonials';
import { StackedTestimonialsCarousel } from '@/entities/testimonies/ui/StackedTestimonialsCarousel';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import React from 'react';

export const TestimonialsSection: React.FC = () => {
  const { language } = useLanguageStore();
  const testimonials = usePublicTestimonials();

  if (testimonials.length === 0) return null;

  return (
    <section className="relative z-10 mx-auto max-w-7xl overflow-hidden px-4 py-12 md:px-10 md:py-16 lg:px-14 lg:py-20">
      <div className="relative z-10 mb-8 text-center md:mb-10">
        <h2 className="section-title">
          <span className="font-heading text-foreground">
            {language === 'fr' ? 'Témoignages Clients' : 'Client Testimonials'}
          </span>
        </h2>
      </div>

      <div className="relative z-10 mx-auto flex w-full justify-center">
        <StackedTestimonialsCarousel testimonials={testimonials} />
      </div>
    </section>
  );
};
