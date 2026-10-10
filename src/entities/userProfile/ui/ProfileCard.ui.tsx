import React from 'react';
import { MapPin, Calendar, Award } from 'lucide-react';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { Image } from '@/shared/ui/Image';
import { Tags } from '@/shared/constants/tags.const';
import { Link } from 'react-router-dom';

export const ProfileCard: React.FC = () => {
  const { language } = useLanguageStore();

  return (
    <div className="relative glass rounded-md p-0 border border-border">
      <div className="relative  text-center mb-2 h-64 sm:h-68 md:h-72 lg:h-78 w-full overflow-hidden rounded-sm bg-muted/40">
        <Image
          src="https://jebiwuygwtpmdnhhzsbw.supabase.co/storage/v1/object/public/Portfolio-Barthez/Profile/profile.jpeg"
          alt="Barthez Kenwou"
          className="w-full text-center object-cover object-top rounded-sm"
          showSkeleton
        />
        <div className="absolute bottom-0 right-0 opacity-50 z-20 cursor-default select-none">
          <div className="relative flex h-5 w-28 items-center justify-center overflow-hidden rounded-md border border-white/20 bg-gradient-to-br from-primary to-primary/70 px-2 shadow-xs">
            {/* Hidden branding / SEO cue */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-[9px] font-bold tracking-[0.18em] text-white/[0.05]"
            >
              BARTHEZ K.
            </span>

            {/* Five static stars */}
            <svg
              viewBox="0 0 90 16"
              className="relative z-10 h-3.5 w-[5.25rem]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <defs>
                <linearGradient
                  id="profile-badge-star"
                  x1="0"
                  y1="0"
                  x2="12"
                  y2="14"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#fff8e7" />
                  <stop offset="0.42" stopColor="#edd078" />
                  <stop offset="1" stopColor="#b8922a" />
                </linearGradient>
              </defs>
              {[0, 1, 2, 3, 4].map((i) => {
                const x = 7 + i * 18;
                return (
                  <g key={i} transform={`translate(${x} 8)`}>
                    <path
                      d="M0 -6.2 L1.85 -1.55 L6.9 -1.3 L2.95 1.85 L4.35 6.7 L0 4 L-4.35 6.7 L-2.95 1.85 L-6.9 -1.3 L-1.85 -1.55 Z"
                      fill="url(#profile-badge-star)"
                      stroke="rgba(255,255,255,0.28)"
                      strokeWidth="0.45"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M0 -5.1 L1.15 -1.9 L0 -2.2 L-1.15 -1.9 Z"
                      fill="rgba(255,255,255,0.4)"
                    />
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      <div className="px-4 py-3">
        {/* Presentation */}
        <h2 className="cursor-default text-lg font-bold text-foreground mb-0">Barthez Kenwou</h2>
        <p className="cursor-default text-xs text-primary font-medium mb-2">
          Full Stack Developer & DevOps
        </p>

        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-3 text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="cursor-default">Cameroun</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="cursor-default">
              3+ {language === 'fr' ? "ans d'expérience" : 'years of experience'}
            </span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Award className="h-4 w-4 text-primary" />
            <span className="cursor-default">5+ certifications</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-6">
          {Tags.slice(0, -1).map((tag) => (
            <span
              key={tag}
              className="cursor-default px-2 py-1 rounded-full bg-secondary text-xs font-medium text-foreground"
            >
              {tag}
            </span>
          ))}
          <Link to={'/skills'}>
            <span
              key={Tags[Tags.length - 1]}
              className="px-2 py-1 rounded-full bg-secondary text-xs font-medium text-foreground"
            >
              {Tags[Tags.length - 1]}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};
