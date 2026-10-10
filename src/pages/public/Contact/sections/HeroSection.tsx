import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Ripple } from '@/shared/ui/ripple';

export const HeroSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="relative mb-8 flex min-h-[280px] w-full animate-fade-in flex-col items-center overflow-hidden px-4 pt-[350px] text-center md:mb-12 md:min-h-[320px] md:px-10 md:pt-[350px] lg:px-14">
      <Ripple />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="relative z-10 mx-auto w-full max-w-3xl -mt-40 md:-mt-44"
      >
        <h1 className="section-title">
          <span className="font-heading text-foreground">{t('contact.title')}</span>
        </h1>
        <p className="section-subtitle mx-auto !mb-0 max-w-lg text-foreground/70">
          {t('contact.subtitle')}
        </p>
      </motion.div>
    </section>
  );
};
