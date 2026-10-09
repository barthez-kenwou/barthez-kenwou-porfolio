export {
  educationApi,
  listEducation,
  createEducation,
  updateEducation,
  deleteEducation,
  type IEducationDto,
  type EducationListParams,
} from './api/education.api';
export {
  usePublicEducation,
  useAdminEducation,
  useCreateEducation,
  useUpdateEducation,
  useDeleteEducation,
} from './hooks/useEducation';
export { education } from './api/mocks/education.mocks';
export { EducationSchema, type EducationInput } from './model/education.schema';
export type { IEducation } from './model/education.types';

// UI Components
export { EducationCard } from './ui/educationCard.ui';
export { CVEducationCard } from './ui/CVeducationCard.ui';
