export {
  partnerApi,
  listPartners,
  getPartner,
  createPartner,
  updatePartner,
  deletePartner,
  partnersMockList,
  type PartnerListParams,
} from './api/partner.api';
export { partnersMock } from './api/mocks/partners.mocks';
export {
  usePublicPartners,
  useAdminPartners,
  useCreatePartner,
  useUpdatePartner,
  useDeletePartner,
} from './hooks/usePartners';
export type {
  IPartner,
  PartnerCreatePayload,
  PartnerUpdatePayload,
} from './model/partner.types';
export { resolvePartnerLogoUrl } from './lib/optimizedPartnerLogos';
