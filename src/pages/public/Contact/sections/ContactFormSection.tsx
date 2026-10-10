import React from 'react';
import { ContactForm } from '@/entities/contact/ui/ContactForm.ui';
import { cn } from '@/shared/lib/utils';

export const ContactFormSection: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        'glass flex h-full flex-col rounded-sm border border-border/50 p-5 md:p-8',
        className,
      )}
    >
      <ContactForm />
    </div>
  );
};
