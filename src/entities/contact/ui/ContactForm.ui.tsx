import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { HiOutlinePaperAirplane } from 'react-icons/hi2';

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/ui/form';
import { contactSchema, type ContactFormValues } from '../model/contact.schema';
import { useSubmitContactResponse } from '../hooks/useContact';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib';
import { FloatingFillField } from './FloatingFillField.ui';
import { toast } from 'sonner';
import { isApiError } from '@/shared/api';

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
    const project = searchParams.get('article');
    if (language === 'fr') {
      return {
        subject: project
          ? `Échange suite au projet « ${project} »`
          : 'Échange suite à vos projets',
        message: project
          ? `Bonjour,\n\nJ'ai consulté le projet « ${project} » et je souhaiterais échanger sur un besoin dans la même veine.\n\nCordialement,\n`
          : "Bonjour,\n\nJ'ai consulté vos réalisations et je souhaiterais échanger sur un besoin / une collaboration dans la même veine.\n\nCordialement,\n",
      };
    }
    return {
      subject: project
        ? `Follow-up after « ${project} »`
        : 'Follow-up after reviewing your projects',
      message: project
        ? `Hello,\n\nI reviewed the « ${project} » project and would like to discuss a need along similar lines.\n\nBest regards,\n`
        : "Hello,\n\nI've reviewed your case studies and would like to discuss a need / collaboration along similar lines.\n\nBest regards,\n",
    };
  }

  if (from === 'home') {
    if (language === 'fr') {
      return {
        subject: "Prise de contact depuis la page d'accueil",
        message:
          "Bonjour,\n\nJe viens de parcourir votre site et je souhaiterais échanger sur un besoin / une collaboration.\n\nCordialement,\n",
      };
    }
    return {
      subject: 'Reaching out from your homepage',
      message:
        "Hello,\n\nI've just browsed your site and would like to discuss a need / collaboration.\n\nBest regards,\n",
    };
  }

  if (from === 'services') {
    if (language === 'fr') {
      return {
        subject: 'Demande suite à vos services',
        message:
          "Bonjour,\n\nJ'ai consulté vos services et je souhaiterais échanger sur un besoin / un devis.\n\nCordialement,\n",
      };
    }
    return {
      subject: 'Inquiry after reviewing your services',
      message:
        "Hello,\n\nI've reviewed your services and would like to discuss a need / quote.\n\nBest regards,\n",
    };
  }

  if (from === 'sidebar') {
    if (language === 'fr') {
      return {
        subject: 'Prise de contact',
        message:
          "Bonjour,\n\nJe souhaiterais échanger sur un besoin / une collaboration.\n\nCordialement,\n",
      };
    }
    return {
      subject: 'Getting in touch',
      message:
        "Hello,\n\nI would like to discuss a need / collaboration.\n\nBest regards,\n",
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
  const submitContact = useSubmitContactResponse();

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

  const onFormFieldFocus = () => {
    void import('@/app/lib/analytics').then((m) => m.trackContactStart('contact_form'));
  };

  const onSubmit = async (values: ContactFormValues) => {
    setIsSubmitted(true);
    try {
      await submitContact.mutateAsync(values);
      const { trackContactClick } = await import('@/app/lib/analytics');
      trackContactClick('form_submit');
      toast.success(
        language === 'fr'
          ? 'Message envoyé. Je vous répondrai rapidement.'
          : 'Message sent. I will get back to you soon.',
      );
      form.reset({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (e) {
      toast.error(
        isApiError(e)
          ? e.message
          : language === 'fr'
            ? 'Envoi impossible pour le moment'
            : 'Could not send message right now',
      );
    } finally {
      setIsSubmitted(false);
    }
  };

  return (
    <div className="relative flex h-full flex-col">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full flex-col gap-5 md:gap-6">
          <div className="grid gap-4 md:grid-cols-2">
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
                      onFocus={onFormFieldFocus}
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
                      onFocus={onFormFieldFocus}
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
                    onFocus={onFormFieldFocus}
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
                    rows={6}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    onFocus={onFormFieldFocus}
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
            disabled={isSubmitted || submitContact.isPending}
            className="mt-2 flex h-11 w-full cursor-pointer items-center justify-center rounded-sm border border-brand/20 bg-brand text-sm font-bold tracking-wide text-brand-foreground transition-all hover:bg-brand-hover disabled:cursor-not-allowed disabled:border-brand/10 disabled:bg-brand/50"
          >
            {submitContact.isPending
              ? language === 'fr'
                ? 'Envoi…'
                : 'Sending…'
              : t('contact.form.send')}
            <HiOutlinePaperAirplane
              className={cn(
                'mr-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1',
                (isSubmitted || submitContact.isPending) && 'animate-pulse',
              )}
            />
          </Button>
        </form>
      </Form>
    </div>
  );
};
