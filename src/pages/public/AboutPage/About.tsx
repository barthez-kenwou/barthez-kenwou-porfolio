import React, { useRef } from 'react';
import { HeroSection } from './sections/HeroSection';
import { ProfileCard } from '@/entities/userProfile/ui/ProfileCard.ui';
import { BioSection } from './sections/BioSection';
import { EducationSection } from './sections/EducationSection';
import { ExperienceSection } from './sections/ExperienceSection';
import { SEO } from '@/shared/ui/SEO/SEO';
import { PresentationVideo } from '@/widgets/PresentationVideo/PresentationVideo';
import { AboutCTASection } from './sections/AboutCTASection';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { MobileStickyCtaBar } from '@/shared/ui/MobileStickyCtaBar';
import { useStickyCtaVisibility } from '@/shared/hooks/useStickyCtaVisibility';

const CONTACT_FROM_ABOUT = '/contact?from=about';

export const AboutPage: React.FC = () => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';
  const heroRef = useRef<HTMLDivElement | null>(null);
  const endCtaRef = useRef<HTMLDivElement | null>(null);
  const stickyVisible = useStickyCtaVisibility({
    hideWhileInViewRef: heroRef,
    endCtaRef,
  });

  return (
    <>
      <SEO
        path="/about"
        title={isFr ? 'À propos' : 'About'}
        description={
          isFr
            ? 'Parcours, expérience et approche de Barthez Kenwou: Full Stack, DevOps et AWS, de la conception à la production.'
            : 'Background, experience, and approach of Barthez Kenwou: Full Stack, DevOps, and AWS, from design to production.'
        }
      />

      {/* No overflow-x-clip here: it breaks position:sticky on the profile card */}
      <div className="mx-auto min-h-screen w-full">
        <div className="min-h-screen">
          <div className="mx-auto space-y-10! pb-3 md:pb-4">
            <div ref={heroRef}>
              <HeroSection />
            </div>

            <div className="mb-2 grid gap-8 px-4 md:px-10 lg:grid-cols-3 lg:px-14">
              <div className="lg:col-span-1">
                {/* sticky needs a tall grid cell (default stretch) + no overflow clip on ancestors */}
                <div className="glass relative sticky top-24 self-start rounded-md border border-border p-4 md:p-6">
                  <div className="relative z-20 w-full">
                    <ProfileCard />
                  </div>
                </div>
              </div>

              <div className="space-y-6 lg:col-span-2">
                <BioSection />
                <ExperienceSection />
                <EducationSection />
              </div>
            </div>

            <PresentationVideo />
            <div ref={endCtaRef}>
              <AboutCTASection />
            </div>
          </div>
        </div>
      </div>

      <MobileStickyCtaBar
        visible={stickyVisible}
        to={CONTACT_FROM_ABOUT}
        location="about_sticky"
        label={isFr ? 'Engager la conversation' : 'Start the conversation'}
      />
    </>
  );
};
