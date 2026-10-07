import React from 'react';
import { Pointer } from '@/shared/ui/pointer';
import { HeroSection } from './sections/HeroSection';
import { ProfileCard } from '@/entities/userProfile/ui/ProfileCard.ui';
import { BioSection } from './sections/BioSection';
import { EducationSection } from './sections/EducationSection';
import { ExperienceSection } from './sections/ExperienceSection';
import { SEO } from '@/shared/ui/SEO/SEO';
import { PresentationVideo } from '@/widgets/PresentationVideo/PresentationVideo';
import { AboutCTASection } from './sections/AboutCTASection';

export const AboutPage: React.FC = () => {
  return (
    <>
      <SEO
        path="/about"
        title="À propos"
        description="Passionné par l'innovation technologique - Mon expertise couvre l'ensemble du cycle de développement, de la conception à la mise en production. Technologies AWS, DevOps, et applications web modernes."
      />

      <div className="mx-auto min-h-screen w-full overflow-x-clip">
        <div className="min-h-screen py-20">
          <div className="mx-auto py-12">
            <HeroSection />

            <div className="mb-2 grid gap-8 px-4 md:px-10 lg:grid-cols-3 lg:px-14">
              <div className="lg:col-span-1">
                <div className="glass sticky top-24 rounded-md border border-border p-4 md:p-6">
                  <div className="absolute inset-0 z-10 rounded-md">
                    <Pointer className="fill-primary" />
                  </div>
                  <div className="relative z-20 h-full w-full">
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

            {/* Know the person → hear them → act */}
            <PresentationVideo />
            <AboutCTASection />
          </div>
        </div>
      </div>
    </>
  );
};
