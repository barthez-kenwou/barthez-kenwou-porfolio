import type { ComponentType, SVGProps } from 'react';
import {
  HiOutlineAcademicCap,
  HiOutlineBolt,
  HiOutlineCloud,
  HiOutlineCodeBracketSquare,
  HiOutlineServerStack,
  HiOutlineShieldCheck,
} from 'react-icons/hi2';
import type { IServiceDto, ServiceIconKey } from '../api/service.api';
import type { IServices } from '../model/service.types';

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const SERVICE_ICONS: Record<ServiceIconKey, IconComponent> = {
  cloud: HiOutlineCloud,
  server: HiOutlineServerStack,
  code: HiOutlineCodeBracketSquare,
  shield: HiOutlineShieldCheck,
  bolt: HiOutlineBolt,
  academic: HiOutlineAcademicCap,
};

export function resolveServiceIcon(iconKey: string): IconComponent {
  return SERVICE_ICONS[iconKey as ServiceIconKey] ?? HiOutlineCloud;
}

/** Maps API/DTO service rows to the shape expected by ServiceCard / ServiceCard2. */
export function mapServiceDtoToCard(dto: IServiceDto): IServices {
  return {
    id: dto.id,
    iconKey: dto.iconKey,
    icon: resolveServiceIcon(dto.iconKey),
    titleFr: dto.titleFr,
    titleEn: dto.titleEn,
    descFr: dto.descFr,
    descEn: dto.descEn,
    featuresFr: dto.featuresFr,
    featuresEn: dto.featuresEn,
    priceEur: dto.priceEur,
    hourly: dto.hourly,
    priceFr: dto.priceFr,
    priceEn: dto.priceEn,
  };
}
