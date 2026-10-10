import { HeroSection } from './sections/HeroSection';
import { ContactInfoSection } from './sections/ContactInfoSection';
import { ContactFormSection } from './sections/ContactFormSection';
import { SEO } from '@/shared/ui/SEO/SEO';
import { EndContact } from './sections/EndContact';
import { WaContact } from './sections/WaContact';
import { SocialGeometry } from '@/entities/contact/ui/SocialGeometry.ui';
import { useLanguageStore } from '@/shared/state/useLanguageStore';

export const ContactPage = () => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';

  return (
    <>
      <SEO
        path="/contact"
        title="Contact"
        description={
          isFr
            ? 'Contactez Barthez Kenwou pour un projet web, cloud ou DevOps. Échange rapide, proposition claire.'
            : 'Contact Barthez Kenwou for a web, cloud, or DevOps project. Fast response, clear proposal.'
        }
      />

      <div className="min-h-screen overflow-x-clip pb-12 md:pb-16">
        <HeroSection />

        {/* Mobile: info → form → social. Desktop: social stays under info in the left column. */}
        <div className="grid items-stretch gap-8 px-4 md:gap-10 md:px-10 lg:grid-cols-3 lg:gap-12 lg:px-14">
          <div className="flex h-full flex-col gap-5 md:gap-6">
            <ContactInfoSection />
            <div className="mt-auto hidden lg:block">
              <SocialGeometry />
            </div>
          </div>

          <div className="min-h-0 lg:col-span-2">
            <ContactFormSection />
          </div>

          <div className="lg:hidden">
            <SocialGeometry />
          </div>
        </div>

        {/* Alternate channel first, then signature block */}
        <div className="mt-10 px-4 md:mt-14 md:px-10 lg:px-14">
          <WaContact />
        </div>

        <div className="mt-10 px-4 md:mt-14 md:px-10 lg:px-14">
          <EndContact />
        </div>
      </div>
    </>
  );
};
