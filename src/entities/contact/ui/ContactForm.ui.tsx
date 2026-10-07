import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { HiOutlinePaperAirplane, HiOutlineCheckCircle } from 'react-icons/hi2';
import { motion } from 'framer-motion';

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/ui/form';
import { contactSchema, type ContactFormValues } from '../model/contact.schema';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib';
import { FloatingFillField } from './FloatingFillField.ui';

const WHATSAPP_NUMBER = '237655646688';

function buildContactPrefill(searchParams: URLSearchParams, language: string) {
  const service = searchParams.get('service');
  if (service) {
    if (language === 'fr') {
      return {
        subject: `Demande de devis: ${service}`,
        message: `Bonjour,\n\nJe souhaite discuter du service « ${service} ».\n\n`,
      };
    }
    return {
      subject: `Quote request: ${service}`,
      message: `Hello,\n\nI'd like to discuss the « ${service} » service.\n\n`,
    };
  }

  const from = searchParams.get('from');

  if (from === 'projects') {
    if (language === 'fr') {
      return {
        subject: 'Échange suite à vos projets',
        message:
          "Bonjour,\n\nJ'ai consulté vos réalisations et je souhaiterais échanger sur un besoin / une collaboration dans la même veine.\n\nCordialement,\n",
      };
    }
    return {
      subject: 'Follow-up after reviewing your projects',
      message:
        "Hello,\n\nI've reviewed your case studies and would like to discuss a need / collaboration along similar lines.\n\nBest regards,\n",
    };
  }

  if (from === 'about') {
    if (language === 'fr') {
      return {
        subject: 'Prise de contact suite à votre page À propos',
        message:
          "Bonjour,\n\nJ'ai pris connaissance de votre parcours et de votre approche. Je souhaiterais échanger sur une collaboration ou un besoin technique.\n\nCordialement,\n",
      };
    }
    return {
      subject: 'Reaching out after your About page',
      message:
        "Hello,\n\nI've reviewed your background and approach. I would like to discuss a collaboration or a technical need.\n\nBest regards,\n",
    };
  }

  if (from === 'skills') {
    if (language === 'fr') {
      return {
        subject: 'Échange suite à votre stack / compétences',
        message:
          "Bonjour,\n\nJ'ai consulté votre stack et vos compétences. Je souhaiterais échanger sur un besoin technique où cette expertise serait pertinente.\n\nCordialement,\n",
      };
    }
    return {
      subject: 'Follow-up after reviewing your skills stack',
      message:
        "Hello,\n\nI've reviewed your stack and skills. I would like to discuss a technical need where this expertise would be a fit.\n\nBest regards,\n",
    };
  }

  if (from === 'cv') {
    if (language === 'fr') {
      return {
        subject: 'Suite à la consultation de votre CV',
        message:
          "Bonjour,\n\nJ'ai consulté votre CV et je souhaiterais échanger sur une opportunité ou une collaboration.\n\nCordialement,\n",
      };
    }
    return {
      subject: 'Follow-up after reviewing your CV',
      message:
        "Hello,\n\nI've reviewed your CV and would like to discuss an opportunity or collaboration.\n\nBest regards,\n",
    };
  }

  if (from === 'blog') {
    const article = searchParams.get('article');
    if (language === 'fr') {
      return {
        subject: article
          ? `Suite à l'article « ${article} »`
          : 'Échange suite à vos articles',
        message: article
          ? `Bonjour,\n\nJ'ai lu votre article « ${article} » et je souhaiterais échanger sur un besoin dans ce domaine.\n\nCordialement,\n`
          : "Bonjour,\n\nJ'ai parcouru vos articles et je souhaiterais échanger sur un besoin technique.\n\nCordialement,\n",
      };
    }
    return {
      subject: article
        ? `Follow-up after « ${article} »`
        : 'Follow-up after reading your articles',
      message: article
        ? `Hello,\n\nI read your article « ${article} » and would like to discuss a need in this area.\n\nBest regards,\n`
        : "Hello,\n\nI've been reading your articles and would like to discuss a technical need.\n\nBest regards,\n",
    };
  }

  return {
    subject: searchParams.get('subject') ?? '',
    message: searchParams.get('message') ?? '',
  };
}

export const ContactForm: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const [searchParams] = useSearchParams();
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const prefillKey = [
    searchParams.get('service'),
    searchParams.get('from'),
    searchParams.get('article'),
    searchParams.get('subject'),
  ]
    .filter(Boolean)
    .join('|');
  const prefill = React.useMemo(
    () => buildContactPrefill(searchParams, language),
    [searchParams, language],
  );

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: prefill.subject,
      message: prefill.message,
    },
  });

  React.useEffect(() => {
    if (!prefillKey && !prefill.subject && !prefill.message) return;
    form.setValue('subject', prefill.subject, { shouldDirty: false });
    form.setValue('message', prefill.message, { shouldDirty: false });
  }, [prefillKey, prefill.subject, prefill.message, form]);

  const onSubmit = (values: ContactFormValues) => {
    setIsSubmitted(true);

    // Persist for the owner admin inbox (local CMS → future API)
    void import('@/features/admin-cms').then(({ useAdminCmsStore }) => {
      useAdminCmsStore.getState().addContactResponse({
        name: values.name,
        email: values.email,
        subject: values.subject,
        message: values.message,
        status: 'new',
      });
    });

    const formattedMessage = `*Nouveau message de contact (Portfolio)*\n\n*Nom:* ${values.name}\n*Email:* ${values.email}\n*Sujet:* ${values.subject}\n\n*Message:*\n${values.message}`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(formattedMessage)}`;

    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      setIsSubmitted(false);
      form.reset();
    }, 1500);
  };

  return (
    <div className="relative flex h-full flex-col">
      {isSubmitted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-sm border border-primary/20 bg-primary px-6 py-4 text-primary-foreground shadow-sm"
        >
          <HiOutlineCheckCircle className="h-4 w-4 animate-pulse" />
          <p className="text-sm font-bold">
            {language === 'fr' ? 'Redirection vers WhatsApp...' : 'Redirecting to WhatsApp...'}
          </p>
        </motion.div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full flex-col gap-4">
          <div className="grid gap-3 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <FloatingFillField
                      label={t('contact.form.name')}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      invalid={Boolean(fieldState.error)}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <FloatingFillField
                      label={t('contact.form.email')}
                      type="email"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      invalid={Boolean(fieldState.error)}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="subject"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <FloatingFillField
                    label={t('contact.form.subject')}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    invalid={Boolean(fieldState.error)}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field, fieldState }) => (
              <FormItem className="flex min-h-0 flex-1 flex-col">
                <FormControl>
                  <FloatingFillField
                    label={t('contact.form.message')}
                    multiline
                    rows={5}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    invalid={Boolean(fieldState.error)}
                    ref={field.ref}
                    className="flex-1"
                  />
                </FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitted}
            className="mt-auto flex h-9 w-full cursor-pointer items-center justify-center rounded-sm border border-primary/20 bg-primary text-sm font-bold tracking-wide text-primary-foreground transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:border-primary/10 disabled:bg-primary/50"
          >
            {t('contact.form.send')}
            <HiOutlinePaperAirplane
              className={cn(
                'mr-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1',
                isSubmitted && 'animate-ping',
              )}
            />
          </Button>
        </form>
      </Form>
    </div>
  );
};
