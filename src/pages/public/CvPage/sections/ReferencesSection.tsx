import React from 'react';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { UsersRound, Phone, Mail, Building2 } from 'lucide-react';

interface Reference {
  name: string;
  roleFr: string;
  roleEn: string;
  company: string;
  email: string;
  phone: string;
}

interface ReferencesSectionProps {
  references: Reference[];
}

export const ReferencesSection: React.FC<ReferencesSectionProps> = ({ references }) => {
  const { language } = useLanguageStore();

  if (!references || references.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 font-heading text-base font-bold text-foreground sm:mb-4">
        <div className="rounded-md bg-primary/10 p-1.5">
          <UsersRound className="h-4 w-4 text-primary" />
        </div>
        {language === 'fr' ? 'Références Professionnelles' : 'Professional References'}
      </h2>

      <div className="grid gap-2.5 sm:gap-3 md:grid-cols-2">
        {references.map((ref, i) => (
          <div
            key={i}
            className="rounded-md border border-border bg-card/80 p-3 transition-colors hover:border-primary/40"
          >
            <h3 className="text-sm font-semibold text-foreground">{ref.name}</h3>

            <div className="mt-1.5 flex items-start gap-1.5 text-primary">
              <Building2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <p className="text-xs font-medium leading-snug">
                <span>{language === 'fr' ? ref.roleFr : ref.roleEn}</span>
                <span className="text-primary/80"> - {ref.company}</span>
              </p>
            </div>

            <div className="mt-2.5 space-y-1.5 text-xs text-foreground/70">
              <a
                href={`mailto:${ref.email}`}
                className="flex min-w-0 items-center gap-1.5 break-all hover:text-primary"
              >
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span className="min-w-0">{ref.email}</span>
              </a>
              <div className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 shrink-0" />
                <span>{ref.phone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
