import React, { useEffect } from 'react';
import { HeroSection } from './sections/HeroSection';
import { SkillsSection } from './sections/SkillsSection';
import { AchievmentSection } from './sections/AchievmentSection';
import { CertificationSection } from './sections/CertificationSection';
import { SkillsCTASection } from './sections/SkillsCTASection';
import { SEO } from '@/shared/ui/SEO/SEO';
import { RouteFallback } from '@/shared/ui/RouteFallback/RouteFallback';
import { useSkillIconsStore } from '@/entities/skills/model/useSkillIconsStore';
import { useLanguageStore } from '@/shared/state/useLanguageStore';

export const SkillPage: React.FC = () => {
  const status = useSkillIconsStore((s) => s.status);
  const ensureLoaded = useSkillIconsStore((s) => s.ensureLoaded);
  const { language } = useLanguageStore();
  const isFr = language === 'fr';

  useEffect(() => {
    void ensureLoaded();
  }, [ensureLoaded]);

  const iconsReady = status === 'ready';

  return (
    <>
      <SEO
        path="/skills"
        title={isFr ? 'Compétences' : 'Skills'}
        description={
          isFr
            ? 'Stack maîtrisée: AWS Cloud, DevOps, Full Stack JS, React, Node.js, Kubernetes, Terraform et CI/CD.'
            : 'Core stack: AWS Cloud, DevOps, Full Stack JS, React, Node.js, Kubernetes, Terraform, and CI/CD.'
        }
      />

      {!iconsReady ? (
        <RouteFallback fullScreen={false} />
      ) : (
        <div className="min-h-screen overflow-x-clip py-16 md:py-16 lg:py-20">
          <HeroSection />
          <SkillsSection />
          <CertificationSection />
          <AchievmentSection />
          <SkillsCTASection />
        </div>
      )}
    </>
  );
};
