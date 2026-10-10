import type { ISkill } from '@/entities/skills/model/Skill.types';
import type { Icertifications } from '@/entities/certifications/model/certification.types';
import type { IEducation } from '@/entities/education/model/education.types';
import type { IExperience } from '@/entities/experiences/model/experience.types';

export interface IProfessionalReference {
  id: string;
  name: string;
  roleFr: string;
  roleEn: string;
  company: string;
  email: string;
  phone: string;
  sortOrder?: number;
}

export interface IContactInfo {
  name: string;
  handle: string;
  titleFr: string;
  titleEn: string;
  subtitleFr: string;
  subtitleEn: string;
  email: string;
  phone: string;
  whatsappLink: string;
  location: string;
  website: string;
  repository: string;
  github: string;
  linkedin: string;
  facebook: string;
  youtube: string;
  /** Home/About presentation video (YouTube URL). */
  presentationVideoUrl: string;
}

export type ContactResponseStatus = 'new' | 'read' | 'archived' | 'replied';

export interface IContactResponse {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactResponseStatus;
  createdAt: string;
  notes?: string;
}

export interface IAdminSkill extends ISkill {
  id: string;
}

export interface IAdminCertification extends Icertifications {
  id: string;
}

export interface IAdminEducation extends IEducation {
  id: string;
}

export interface IAdminExperience extends IExperience {
  id: string;
}
