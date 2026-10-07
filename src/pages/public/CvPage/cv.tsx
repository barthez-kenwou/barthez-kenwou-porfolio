import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { CTASection } from './sections/CTASection';
import { CvQuickActions } from './sections/CvQuickActions';
import { CvMobileStickyBar } from './sections/CvMobileStickyBar';
import { LanguageSection } from './sections/LanguageSection';
import { CertificationSection } from './sections/CertificationSection';
import { SkillsSection } from './sections/SkillsSection';
import { SoftSkillsSection } from './sections/SoftSkillsSection';
import { ReferencesSection } from './sections/ReferencesSection';
import { ExperienceSection } from './sections/ExperienceSection';
import { FeaturedProjectsSection } from './sections/FeaturedProjectsSection';
import { ProfileSection } from './sections/ProfileSection';
import { HeaderSection } from './sections/HeaderSection';
import { SEO } from '@/shared/ui/SEO/SEO';
import { cvData } from '@/entities/cv/api/mock/cv-data';
import { RetroGrid } from '@/shared/ui/retro-grid';
import { useLanguageStore } from '@/shared/state/useLanguageStore';

const CVPreviewModal = lazy(() =>
  import('./sections/CVPreviewModal').then((m) => ({ default: m.CVPreviewModal })),
);

export const CvPage = () => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [endCtaInView, setEndCtaInView] = useState(false);
  const heroActionsRef = useRef<HTMLDivElement | null>(null);
  const endCtaRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const heroEl = heroActionsRef.current;
    const endEl = endCtaRef.current;
    if (!heroEl || !endEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === heroEl) {
            // Sticky only after hero CTAs leave the viewport
            setPastHero(!entry.isIntersecting);
          }
          if (entry.target === endEl) {
            setEndCtaInView(entry.isIntersecting);
          }
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(heroEl);
    observer.observe(endEl);
    return () => observer.disconnect();
  }, []);

  const stickyVisible = pastHero && !endCtaInView;

  const openPreview = () => setIsPreviewOpen(true);

  return (
    <>
      <SEO
        path="/cv"
        title="CV"
        description="CV de Barthez Kenwou - Développeur Full Stack & Ingénieur DevOps AWS. Expérience, compétences et parcours professionnel."
      />

      <div className="min-h-screen overflow-x-clip pt-16 pb-28 md:py-16 md:pb-16 lg:py-20 xl:pb-20">
        <section className="relative mb-6 animate-fade-in px-4 pt-14 text-center md:mb-10 md:px-10 md:pt-16 lg:px-14">
          <h1 className="section-title relative z-10">
            {isFr ? 'Mon' : 'My'}
            <span className="bg-gradient-to-r from-foreground via-foreground/80 to-muted-foreground bg-clip-text text-transparent">
              &nbsp;CV
            </span>
          </h1>
          <p className="section-subtitle relative z-10 mx-auto mt-2 max-w-lg !mb-0 text-sm">
            {isFr
              ? 'Profil prêt à partager, téléchargez le PDF ou démarrons la conversation.'
              : 'A shareable profile, download the PDF or start the conversation.'}
          </p>

          <div
            ref={heroActionsRef}
            className="relative z-10 mx-auto mt-5 flex max-w-md justify-center sm:mt-6"
          >
            <CvQuickActions variant="hero" onDownload={openPreview} />
          </div>

          <RetroGrid />
        </section>

        <div className="px-4 md:px-10 lg:px-14">
          <section className="relative z-10 mx-auto mb-8 max-w-4xl overflow-hidden rounded-md border border-border bg-card shadow-md print:border-none print:shadow-none md:mb-10">
            <HeaderSection personalInfo={cvData.personalInfo} />

            <div className="space-y-5 p-3.5 sm:space-y-6 sm:p-6 md:space-y-8 md:p-8 print:p-6">
              <ProfileSection />
              <ExperienceSection experiences={cvData.experiences} />
              <FeaturedProjectsSection projects={cvData.featuredProjects} />
              <SkillsSection skills={cvData.skills} />
              <SoftSkillsSection softSkills={(cvData.skills as any)?.softSkills} />
              <CertificationSection education={cvData.education} />
              <LanguageSection languages={cvData.languages} />
              <ReferencesSection references={(cvData as any)?.references} />
            </div>
          </section>

          <CTASection onDownload={openPreview} sectionRef={endCtaRef} />
        </div>
      </div>

      <CvMobileStickyBar onDownload={openPreview} visible={stickyVisible} />

      {isPreviewOpen && (
        <Suspense fallback={null}>
          <CVPreviewModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} />
        </Suspense>
      )}
    </>
  );
};
