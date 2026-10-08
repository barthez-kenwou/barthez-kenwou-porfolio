import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { Mail, MapPin, Phone, Linkedin, Github, Globe } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  personalInfo: any;
}

const stripUrl = (url?: string) =>
  (url || '').replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '');

const formatPortfolioHost = (url?: string) => {
  const host = stripUrl(url);
  if (!host) return '';
  return host.startsWith('www.') ? host : `www.${host}`;
};

export const HeaderSection: React.FC<HeaderProps> = ({ personalInfo }) => {
  const { language } = useLanguageStore();

  const websiteHref = personalInfo.website?.startsWith('http')
    ? personalInfo.website
    : `https://${stripUrl(personalInfo.website)}`;

  return (
    <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent px-5 py-6 sm:px-8 sm:py-7 print:p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative text-center md:text-left">
        <p className="mb-1.5 font-mono text-[10px] font-bold tracking-[0.18em] text-primary/80 uppercase">
          {language === 'fr' ? 'Curriculum Vitae' : 'Curriculum Vitae'}
        </p>

        <h1 className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {personalInfo.name}
        </h1>

        <p className="mt-1.5 text-xs font-medium text-primary sm:text-sm">
          {language === 'fr' ? personalInfo.titleFr : personalInfo.titleEn}
        </p>

        <p className="mt-1 text-xs leading-relaxed text-foreground/70">
          {language === 'fr' ? personalInfo.subtitleFr : personalInfo.subtitleEn}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs text-foreground/70 md:justify-start">
          <span className="inline-flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 shrink-0 text-primary/70" />
            {personalInfo.email}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5 shrink-0 text-primary/70" />
            {personalInfo.phone}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/70" />
            {personalInfo.location}
          </span>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs md:justify-start">
          {personalInfo.website && (
            <a
              href={websiteHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-primary transition-colors hover:text-primary/80"
            >
              <Globe className="h-3.5 w-3.5" />
              {formatPortfolioHost(personalInfo.website)}
            </a>
          )}
          <Link
            to={personalInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-medium text-primary transition-colors hover:text-primary/80"
          >
            <Linkedin className="h-3.5 w-3.5" />
            LinkedIn
          </Link>
          <Link
            to={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-medium text-primary transition-colors hover:text-primary/80"
          >
            <Github className="h-3.5 w-3.5" />
            GitHub
          </Link>
        </div>
      </div>
    </section>
  );
};
