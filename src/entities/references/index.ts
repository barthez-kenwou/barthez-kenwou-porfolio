export {
  referenceApi,
  listReferences,
  createReference,
  updateReference,
  deleteReference,
  referencesMock,
  type ReferenceListParams,
} from './api/reference.api';
export {
  usePublicReferences,
  useAdminReferences,
  useCreateReference,
  useUpdateReference,
  useDeleteReference,
} from './hooks/useReferences';
export type { IProfessionalReference } from './model/reference.types';
