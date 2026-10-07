import { contactsInfo } from '@/shared/mocks/constContactInfo.mocks';
import { experiences } from '@/entities/experiences/api/mocks/experiences.mocks';
import { skillsByCategory } from '@/entities/skills/api/mocks/skillsData.mocks';
import { education } from '@/entities/education/api/mocks/education.mocks';
import { projectsData } from '@/entities/projets/api/mocks/projectData.mocks';
import { certifications } from '@/entities/certifications/api/mocks/certifications.mocks';

export const cvData = {
  personalInfo: contactsInfo,
  experiences: experiences,
  education: education,
  skills: skillsByCategory,
  projects: projectsData,
  featuredProjects: projectsData.filter((project) => project.isFeatured),
  certifications: certifications,
  languages: [
    { language: 'Français', proficiencyFr: 'Natif', proficiencyEn: 'Native' },
    {
      language: 'Anglais',
      proficiencyFr: 'Professionnel technique',
      proficiencyEn: 'Professional working',
    },
  ],
  references: [
    {
      name: 'Rashid Haruna',
      roleFr: 'CTO & DevOps Engineer',
      roleEn: 'CTO & DevOps Engineer',
      company: 'IT Engineering Factory',
      email: 'rashidharuna@gmail.com',
      phone: '+237 655 193 530',
    },
    {
      name: 'Gilles Tanko',
      roleFr: 'CEO & formateur Microsoft',
      roleEn: 'CEO & Microsoft trainer',
      company: 'GTA',
      email: 'gilles.tanko@gta-it.com',
      phone: '+237 671 091 360',
    },
    {
      name: 'Nehemie Sighe',
      roleFr: 'CTO & Cloud Architecte',
      roleEn: 'CTO & Cloud Architecte',
      company: 'ZENORA',
      email: 'nehemie.sighe@zenora360.com',
      phone: '+237 694 418 408',
    },
  ],
};

export type ICvData = typeof cvData;
