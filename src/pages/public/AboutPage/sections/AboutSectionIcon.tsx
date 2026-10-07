import React from 'react';
import { cn } from '@/shared/lib/utils';

type AboutSectionIconVariant = 'bio' | 'experience' | 'education';

type AboutSectionIconProps = {
  variant: AboutSectionIconVariant;
  className?: string;
};

/**
 * Static 3D section icons - readable at a glance, no motion, light frame only.
 */
export function AboutSectionIcon({ variant, className }: AboutSectionIconProps) {
  const rawId = React.useId().replace(/:/g, '');
  const id = `${variant}-${rawId}`;

  return (
    <span
      className={cn(
        'inline-flex h-7 w-7 shrink-0 select-none items-center justify-center',
        'rounded-sm border border-border/50 bg-transparent',
        className,
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 32 32"
        className="h-5 w-5 pointer-events-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id={`${id}-p`}
            x1="6"
            y1="4"
            x2="26"
            y2="28"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="hsl(268 55% 68%)" />
            <stop offset="0.5" stopColor="hsl(268 58% 42%)" />
            <stop offset="1" stopColor="hsl(270 38% 24%)" />
          </linearGradient>
          <linearGradient
            id={`${id}-pTop`}
            x1="8"
            y1="2"
            x2="22"
            y2="16"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="hsla(0,0%,100%,0.55)" />
            <stop offset="1" stopColor="hsla(0,0%,100%,0)" />
          </linearGradient>
          <linearGradient
            id={`${id}-skin`}
            x1="10"
            y1="6"
            x2="22"
            y2="22"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="hsl(28 45% 82%)" />
            <stop offset="0.55" stopColor="hsl(24 38% 62%)" />
            <stop offset="1" stopColor="hsl(22 35% 42%)" />
          </linearGradient>
          <linearGradient
            id={`${id}-gold`}
            x1="10"
            y1="6"
            x2="26"
            y2="26"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#f3e2b0" />
            <stop offset="0.5" stopColor="#c9952e" />
            <stop offset="1" stopColor="#7a5214" />
          </linearGradient>
          <linearGradient
            id={`${id}-leather`}
            x1="4"
            y1="8"
            x2="28"
            y2="28"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="hsl(268 40% 48%)" />
            <stop offset="0.55" stopColor="hsl(270 35% 28%)" />
            <stop offset="1" stopColor="hsl(270 40% 14%)" />
          </linearGradient>
          <linearGradient
            id={`${id}-leatherSide`}
            x1="4"
            y1="12"
            x2="16"
            y2="28"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="hsl(270 30% 22%)" />
            <stop offset="1" stopColor="hsl(270 35% 10%)" />
          </linearGradient>
          <filter id={`${id}-d`} x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="1" stdDeviation="0.7" floodColor="hsla(270,40%,8%,0.4)" />
          </filter>
        </defs>

        {variant === 'bio' && <BioGlyph id={id} />}
        {variant === 'experience' && <ExperienceGlyph id={id} />}
        {variant === 'education' && <EducationGlyph id={id} />}
      </svg>
    </span>
  );
}

/** Clear person mark: round head + shoulders - instantly “profile / bio”. */
function BioGlyph({ id }: { id: string }) {
  return (
    <g filter={`url(#${id}-d)`}>
      <ellipse cx="16" cy="28.6" rx="6.5" ry="1.35" fill="hsla(270,40%,10%,0.22)" />

      {/* shoulders / bust - readable silhouette */}
      <path
        d="M7.5 27.2 C7.5 21.8 11.2 19.2 16 19.2 C20.8 19.2 24.5 21.8 24.5 27.2"
        fill={`url(#${id}-p)`}
      />
      <path
        d="M9.2 26.6 C9.6 22.4 12.2 20.4 16 20.4 C18.4 20.4 20.4 21.2 21.8 22.6"
        stroke={`url(#${id}-pTop)`}
        strokeWidth="1.1"
        strokeLinecap="round"
        fill="none"
      />
      {/* collar notch */}
      <path d="M14.2 19.4 L16 21.2 L17.8 19.4" fill="hsl(270 40% 18%)" opacity="0.35" />

      {/* neck */}
      <path d="M14.2 17.2 L17.8 17.2 L17.2 19.6 L14.8 19.6 Z" fill={`url(#${id}-skin)`} />

      {/* head */}
      <circle cx="16" cy="12.2" r="6.1" fill={`url(#${id}-skin)`} />
      <ellipse cx="14.2" cy="10.6" rx="3.2" ry="2.4" fill="hsla(0,0%,100%,0.28)" />
      {/* hair cap */}
      <path
        d="M10.2 11.2 C10.4 7.6 12.8 5.6 16 5.6 C19.2 5.6 21.6 7.6 21.8 11.2 C20.4 9.2 18.4 8.4 16 8.4 C13.6 8.4 11.6 9.2 10.2 11.2 Z"
        fill={`url(#${id}-p)`}
      />
      <path
        d="M11.4 9.4 C12.6 7.6 14.2 6.8 16 6.8 C17.2 6.8 18.2 7.1 19 7.7"
        stroke="hsla(0,0%,100%,0.35)"
        strokeWidth="0.7"
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
}

/** Classic briefcase: thick handle + rectangular body + latch - unmistakable. */
function ExperienceGlyph({ id }: { id: string }) {
  return (
    <g filter={`url(#${id}-d)`}>
      <ellipse cx="16" cy="28.5" rx="8" ry="1.3" fill="hsla(270,40%,10%,0.22)" />

      {/* handle posts */}
      <rect x="11.2" y="7.8" width="1.6" height="3.2" rx="0.4" fill={`url(#${id}-gold)`} />
      <rect x="19.2" y="7.8" width="1.6" height="3.2" rx="0.4" fill={`url(#${id}-gold)`} />
      {/* handle bar */}
      <rect x="11.2" y="6.2" width="9.6" height="2.2" rx="1.1" fill={`url(#${id}-gold)`} />
      <rect x="12" y="6.55" width="8" height="0.7" rx="0.35" fill="hsla(0,0%,100%,0.45)" />

      {/* body front */}
      <path
        d="M6.5 11.2 H25.5 C26.3 11.2 26.8 11.8 26.8 12.5 V24.8 C26.8 25.6 26.3 26.2 25.5 26.2 H6.5 C5.7 26.2 5.2 25.6 5.2 24.8 V12.5 C5.2 11.8 5.7 11.2 6.5 11.2 Z"
        fill={`url(#${id}-leather)`}
      />
      {/* left depth edge */}
      <path
        d="M5.2 12.5 L3.8 13.8 V26.2 C3.8 26.8 4.2 27.2 4.8 27.2 H6.5 V26.2 H5.2 V12.5 Z"
        fill={`url(#${id}-leatherSide)`}
      />
      {/* top thickness */}
      <path
        d="M6.5 11.2 L5.2 12.5 H26.8 L25.5 11.2 H6.5 Z"
        fill={`url(#${id}-pTop)`}
        opacity="0.85"
      />
      {/* lid seam */}
      <line
        x1="6.2"
        y1="16.4"
        x2="25.8"
        y2="16.4"
        stroke="hsla(0,0%,100%,0.22)"
        strokeWidth="0.7"
      />
      <line
        x1="6.2"
        y1="17.1"
        x2="25.8"
        y2="17.1"
        stroke="hsla(270,40%,8%,0.35)"
        strokeWidth="0.55"
      />

      {/* metal latch plate */}
      <rect x="13.2" y="18.4" width="5.6" height="4.2" rx="0.6" fill={`url(#${id}-gold)`} />
      <rect x="13.7" y="18.8" width="4.6" height="1" rx="0.3" fill="hsla(0,0%,100%,0.4)" />
      <circle cx="16" cy="21.2" r="0.85" fill="hsl(270 35% 18%)" />
      <circle cx="16" cy="21.05" r="0.35" fill="hsla(0,0%,100%,0.55)" />
    </g>
  );
}

/** Mortarboard + tassel - polished, diploma quieter so the cap reads first. */
function EducationGlyph({ id }: { id: string }) {
  return (
    <g filter={`url(#${id}-d)`}>
      <ellipse cx="16" cy="28.6" rx="7.2" ry="1.25" fill="hsla(270,40%,10%,0.2)" />

      {/* board */}
      <path d="M5.2 13.4 L16 6.8 L26.8 13.4 L16 19.8 Z" fill={`url(#${id}-p)`} />
      <path d="M5.2 13.4 L16 6.8 L16 15.2 Z" fill="hsl(270 35% 22%)" opacity="0.4" />
      <path d="M16 6.8 L26.8 13.4 L16 15.2 Z" fill={`url(#${id}-pTop)`} opacity="0.55" />
      {/* board edge thickness */}
      <path
        d="M5.2 13.4 L16 19.8 L26.8 13.4 L26.8 14.6 L16 21 L5.2 14.6 Z"
        fill="hsl(270 40% 16%)"
        opacity="0.55"
      />

      {/* center button */}
      <circle cx="16" cy="13.2" r="1.15" fill={`url(#${id}-gold)`} />
      <circle cx="15.6" cy="12.85" r="0.4" fill="hsla(0,0%,100%,0.65)" />

      {/* cap dome */}
      <path
        d="M11.2 15.2 C11.2 18.4 13.2 20.6 16 20.6 C18.8 20.6 20.8 18.4 20.8 15.2"
        fill={`url(#${id}-leather)`}
      />
      <path
        d="M12.4 15.6 C12.8 17.8 14.2 19.2 16 19.2 C17 19.2 17.8 18.8 18.4 18.1"
        stroke={`url(#${id}-pTop)`}
        strokeWidth="0.75"
        strokeLinecap="round"
        fill="none"
      />

      {/* tassel cord */}
      <path
        d="M16 14.2 C19.2 14.8 21.8 14 23.6 12"
        stroke={`url(#${id}-gold)`}
        strokeWidth="0.95"
        strokeLinecap="round"
        fill="none"
      />
      {/* tassel knot + fringe */}
      <circle cx="23.8" cy="11.6" r="1.15" fill={`url(#${id}-gold)`} />
      <circle cx="23.55" cy="11.3" r="0.35" fill="hsla(0,0%,100%,0.5)" />
      <path
        d="M22.9 12.6 L22.5 16.2 M23.8 12.8 L23.8 16.6 M24.7 12.6 L25.1 16.1"
        stroke={`url(#${id}-gold)`}
        strokeWidth="0.65"
        strokeLinecap="round"
      />

      {/* compact diploma - secondary cue only */}
      <rect x="9.5" y="22.4" width="10.5" height="3.6" rx="0.5" fill="hsl(42 35% 88%)" />
      <rect x="9.5" y="22.4" width="10.5" height="0.7" fill="hsl(42 25% 78%)" />
      <ellipse cx="20" cy="24.2" rx="1.1" ry="2.2" fill={`url(#${id}-gold)`} />
      <circle cx="13.2" cy="24.2" r="0.75" fill="hsl(268 58% 42%)" />
    </g>
  );
}
