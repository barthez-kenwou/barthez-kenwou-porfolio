import React from 'react';

export interface IServices {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  titleFr: string;
  titleEn: string;
  descFr: string;
  descEn: string;
  featuresFr: string[];
  featuresEn: string[];
  /** Source-of-truth amount in EUR */
  priceEur: number;
  /** When true, price is billed per hour */
  hourly: boolean;
  priceFr: string;
  priceEn: string;
  id?: string;
  iconKey?: string;
}

export interface ServiceCardProps {
  service: IServices;
  language: string;
}
