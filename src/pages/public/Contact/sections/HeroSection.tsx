import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export const HeroSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="relative mb-8 flex w-full animate-fade-in flex-col items-center justify-center overflow-hidden pt-20 pb-10 md:py-14">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full px-4 text-center"
      >
        <h1 className="section-title mb-3">
          <span className="font-display text-foreground">{t('contact.title')}</span>
        </h1>
        <p className="section-subtitle !mb-0 italic opacity-90">{t('contact.subtitle')}</p>
      </motion.div>
    </section>
  );
};
