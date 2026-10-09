import React from 'react';
import { HiOutlineEnvelope, HiOutlineMapPin, HiOutlineClock } from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';
import { usePublicContactInfo } from '@/entities/contact/hooks/useContact';
import { ContactInfoCard } from '@/entities/contact/ui/ContactInfoCard.ui';
import { cn } from '@/shared/lib/utils';
import { QueryState } from '@/shared/ui/QueryState';

export const ContactInfoSection: React.FC<{ className?: string }> = ({ className }) => {
  const { t } = useTranslation();
  const { data, isPending, isError, error } = usePublicContactInfo();
  const contactsInfo = data?.data;

  return (
    <section className={cn('flex flex-col gap-3', className)}>
      <QueryState
        isPending={isPending}
        isError={isError}
        errorMessage={error instanceof Error ? error.message : undefined}
        source={data?.source}
        empty={!isPending && !contactsInfo}
      >
        {contactsInfo ? (
          <>
            <ContactInfoCard
              icon={HiOutlineEnvelope}
              label={t('contact.info.email')}
              value={contactsInfo.email}
              href={`mailto:${contactsInfo.email}`}
            />

            <ContactInfoCard
              icon={HiOutlineMapPin}
              label={t('contact.info.location')}
              value={contactsInfo.location || 'Yaoundé, Cameroun'}
            />

            <ContactInfoCard
              icon={HiOutlineClock}
              label={t('contact.info.availability')}
              value={t('contact.info.available')}
            />
          </>
        ) : null}
      </QueryState>
    </section>
  );
};
