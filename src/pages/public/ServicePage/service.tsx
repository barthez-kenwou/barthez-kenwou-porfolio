import { TestimonialsSection } from './sections/TestimonialsSection';
import { ProcessSection } from './sections/ProcessSection';
import { ServicesSection } from './sections/ServicesSection';
import { HeroSection } from './sections/HeroSection';
import { ServicesCTASection } from './sections/ServicesCTASection';
import { SEO } from '@/shared/ui/SEO/SEO';
import { useLanguageStore } from '@/shared/state/useLanguageStore';

export const ServicePage: React.FC = () => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';

  return (
    <>
      <SEO
        path="/services"
        title="Services"
        description={
          isFr
            ? 'Architecture Cloud AWS, DevOps & CI/CD, développement Full Stack, audit sécurité, performance et consulting.'
            : 'AWS Cloud architecture, DevOps & CI/CD, Full Stack development, security audits, performance, and consulting.'
        }
      />

      <div className="min-h-screen overflow-x-clip py-16 md:py-16 lg:py-20">
        <HeroSection />
        <ServicesSection />
        <ProcessSection />
        <TestimonialsSection />
        <ServicesCTASection />
      </div>
    </>
  );
};
