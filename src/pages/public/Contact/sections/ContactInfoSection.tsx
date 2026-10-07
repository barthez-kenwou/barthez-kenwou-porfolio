import React from 'react';
import { HiOutlineEnvelope, HiOutlineMapPin, HiOutlineClock } from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';
import { contactsInfo } from '@/shared/mocks/constContactInfo.mocks';
import { ContactInfoCard } from '@/entities/contact/ui/ContactInfoCard.ui';
import { cn } from '@/shared/lib/utils';

export const ContactInfoSection: React.FC<{ className?: string }> = ({ className }) => {
  const { t } = useTranslation();

  return (
    <section className={cn('flex flex-col gap-3', className)}>
      <ContactInfoCard
        icon={HiOutlineEnvelope}
        label={t('contact.info.email')}
        value={contactsInfo.email}
        href={`mailto:${contactsInfo.email}`}
      />

      <ContactInfoCard
        icon={HiOutlineMapPin}
        label={t('contact.info.location')}
        value="Yaoundé, Cameroun"
      />

      <ContactInfoCard
        icon={HiOutlineClock}
        label={t('contact.info.availability')}
        value={t('contact.info.available')}
      />
    </section>
  );
};
