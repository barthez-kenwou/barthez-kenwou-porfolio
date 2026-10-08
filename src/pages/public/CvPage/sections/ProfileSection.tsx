import React from 'react';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { Code2 } from 'lucide-react';

export const ProfileSection: React.FC = () => {
  const { language } = useLanguageStore();

  const profile =
    language === 'fr'
      ? "Développeur Full Stack passionné et ingénieur DevOps junior avec plus de 3 ans d'expérience dans la conception, le développement et le déploiement d'applications web modernes et d'infrastructures cloud. Expert en architecture microservices, CI/CD, et solutions serverless. Orienté résultats avec une forte capacité à transformer des idées complexes en produits fonctionnels et performants."
      : 'Passionate Full Stack Developer and junior DevOps Engineer with over 3 years of experience in designing, developing, and deploying modern web applications and cloud infrastructures. Expert in microservices architecture, CI/CD, and serverless solutions. Results-oriented with a strong ability to transform complex ideas into functional and high-performance products.';

  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 font-heading text-base font-bold text-foreground">
        <div className="rounded-md bg-primary/10 p-1.5">
          <Code2 className="h-4 w-4 text-primary" />
        </div>
        {language === 'fr' ? 'Profil' : 'Profile'}
      </h2>

      <blockquote className="text-xs leading-relaxed text-foreground/75 sm:text-sm">
        {profile}
      </blockquote>
    </section>
  );
};
