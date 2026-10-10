import type { ISkill } from '@/entities/skills/model/Skill.types';
import type { Icertifications } from '@/entities/certifications/model/certification.types';
import type { IEducation } from '@/entities/education/model/education.types';
import type { IExperience } from '@/entities/experiences/model/experience.types';

export type {
  IContactInfo,
  IContactResponse,
  ContactResponseStatus,
} from '@/entities/contact/model/contact.types';
export type { IProfessionalReference } from '@/entities/references/model/reference.types';

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
