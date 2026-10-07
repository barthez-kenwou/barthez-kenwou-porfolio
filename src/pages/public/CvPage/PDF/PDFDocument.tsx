import React from 'react';
import { Page, Document } from '@react-pdf/renderer';
import { ICvData } from '@/entities/cv/api/mock/cv-data';
import { pdfStyles as styles } from './styles/PDFStyles';

// Import modular sections
import { HeaderSection } from './sections/HeaderSection';
import { ProfileSection } from './sections/ProfileSection';
import { ExperienceSection } from './sections/ExperienceSection';
import { ProjectSection } from './sections/ProjectSection';
import { CertificationSection } from './sections/CertificationSection';
import { EducationSection } from './sections/EducationSection';
import { SkillSection } from './sections/SkillSection';
import { LanguageSection } from './sections/LanguageSection';
import { ReferenceSection } from './sections/ReferenceSection';

interface PDFDocumentProps {
  data: ICvData;
  language: 'fr' | 'en';
}

export const CvPDFDocument: React.FC<PDFDocumentProps> = ({ data, language }) => {
  const {
    personalInfo,
    experiences,
    education,
    skills,
    languages,
    featuredProjects,
    certifications,
  } = data;

  return (
    <Document title={`${personalInfo.name} - CV ${language.toUpperCase()}`}>
      <Page size="A4" style={styles.page}>
        <HeaderSection personalInfo={personalInfo} language={language} />

        <ProfileSection language={language} />

        <ExperienceSection experiences={experiences} language={language} />

        <ProjectSection projects={featuredProjects || []} language={language} />

        <CertificationSection certifications={certifications || []} />

        <EducationSection education={education} language={language} />

        <SkillSection skills={skills} language={language} />

        <LanguageSection languages={languages} language={language} />

        <ReferenceSection references={data.references || []} language={language} />
      </Page>
    </Document>
  );
};
