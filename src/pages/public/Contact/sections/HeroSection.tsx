import React from 'react';
import { useTranslation } from 'react-i18next';
import { Ripple } from '@/shared/ui/ripple';
import { motion } from 'framer-motion';

export const HeroSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="relative w-full pt-20 pb-10 md:py-14 mb-8 flex flex-col items-center justify-center animate-fade-in overflow-hidden">
      {/* Original MagicUI Ripple */}
      <Ripple />

      {/* Clean Text Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center px-4 w-full"
      >
        <h1 className="section-title mb-3">
          <span className="gradient-text drop-shadow-sm">{t('contact.title')}</span>
        </h1>
        <p className="section-subtitle !mb-0 italic opacity-90">{t('contact.subtitle')}</p>
      </motion.div>
    </section>
  );
};
