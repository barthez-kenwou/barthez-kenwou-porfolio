import React, { useId } from 'react';
import { cn } from '@/shared/lib/utils';

type DomainIcon3DProps = {
  id: string;
  active?: boolean;
  className?: string;
};

const KNOWN = new Set([
  'all',
  'cloud',
  'devops',
  'devsecops',
  'backend',
  'frontend',
  'database',
  'tools',
  'architecture',
  'softSkills',
]);

/**
 * Soft isometric domain marks - thematic, quiet chroma, no motion.
 * Crafted to support the label, not compete with it.
 */
export function DomainIcon3D({ id, active = false, className }: DomainIcon3DProps) {
  const raw = useId().replace(/:/g, '');
  const uid = `d3-${raw}`;
  const domain = KNOWN.has(id) ? id : 'all';

  return (
    <svg
      viewBox="0 0 32 32"
      className={cn('h-[18px] w-[18px] shrink-0 pointer-events-none', className)}
      aria-hidden
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity: active ? 1 : 0.68 }}
    >
      <defs>
        <linearGradient
          id={`${uid}-p`}
          x1="6"
          y1="4"
          x2="26"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={active ? 'hsl(268 52% 68%)' : 'hsl(270 14% 68%)'} />
          <stop offset="0.5" stopColor={active ? 'hsl(268 50% 42%)' : 'hsl(270 12% 42%)'} />
          <stop offset="1" stopColor={active ? 'hsl(270 38% 22%)' : 'hsl(270 12% 22%)'} />
        </linearGradient>
        <linearGradient
          id={`${uid}-top`}
          x1="8"
          y1="2"
          x2="22"
          y2="14"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={active ? 'hsl(268 48% 78%)' : 'hsl(270 12% 76%)'} />
          <stop offset="1" stopColor={active ? 'hsl(268 45% 48%)' : 'hsl(270 10% 48%)'} />
        </linearGradient>
        <linearGradient
          id={`${uid}-side`}
          x1="4"
          y1="10"
          x2="18"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={active ? 'hsl(270 35% 34%)' : 'hsl(270 10% 34%)'} />
          <stop offset="1" stopColor={active ? 'hsl(270 40% 14%)' : 'hsl(270 12% 14%)'} />
        </linearGradient>
        <linearGradient
          id={`${uid}-sheen`}
          x1="6"
          y1="3"
          x2="18"
          y2="16"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="hsla(0,0%,100%,0.5)" />
          <stop offset="1" stopColor="hsla(0,0%,100%,0)" />
        </linearGradient>
        <linearGradient
          id={`${uid}-gold`}
          x1="8"
          y1="4"
          x2="24"
          y2="24"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={active ? '#f0dfb0' : 'hsl(42 14% 70%)'} />
          <stop offset="0.5" stopColor={active ? '#c9952e' : 'hsl(40 12% 48%)'} />
          <stop offset="1" stopColor={active ? '#7a5214' : 'hsl(38 12% 28%)'} />
        </linearGradient>
        <filter id={`${uid}-d`} x="-18%" y="-18%" width="136%" height="136%">
          <feDropShadow dx="0" dy="0.9" stdDeviation="0.65" floodColor="hsla(270,40%,8%,0.38)" />
        </filter>
      </defs>

      {domain === 'all' && <IconAll uid={uid} />}
      {domain === 'cloud' && <IconCloud uid={uid} />}
      {domain === 'devops' && <IconDevops uid={uid} />}
      {domain === 'devsecops' && <IconDevsecops uid={uid} />}
      {domain === 'backend' && <IconBackend uid={uid} />}
      {domain === 'frontend' && <IconFrontend uid={uid} />}
      {domain === 'database' && <IconDatabase uid={uid} />}
      {domain === 'tools' && <IconTools uid={uid} />}
      {domain === 'architecture' && <IconArchitecture uid={uid} />}
      {domain === 'softSkills' && <IconSoftSkills uid={uid} />}
    </svg>
  );
}

function IconAll({ uid }: { uid: string }) {
  return (
    <g filter={`url(#${uid}-d)`}>
      <ellipse cx="16" cy="28.4" rx="7" ry="1.2" fill="hsla(270,40%,10%,0.22)" />
      <path
        d="M16 4.2 L26.2 9.8 L26.2 20.6 L16 26.2 L5.8 20.6 L5.8 9.8 Z"
        fill={`url(#${uid}-p)`}
      />
      <path d="M16 4.2 L26.2 9.8 L16 15.4 L5.8 9.8 Z" fill={`url(#${uid}-top)`} />
      <path d="M16 4.2 L5.8 9.8 L5.8 20.6 L16 15.4 Z" fill={`url(#${uid}-side)`} opacity="0.9" />
      <path d="M16 15.4 L26.2 9.8 L26.2 20.6 L16 26.2 Z" fill={`url(#${uid}-p)`} opacity="0.88" />
      <path d="M16 8.2 L20.4 10.6 L16 13 L11.6 10.6 Z" fill={`url(#${uid}-sheen)`} />
    </g>
  );
}

function IconCloud({ uid }: { uid: string }) {
  return (
    <g filter={`url(#${uid}-d)`}>
      <ellipse cx="16" cy="27.8" rx="8" ry="1.15" fill="hsla(270,40%,10%,0.2)" />
      <path
        d="M9.2 20.8 C6.6 20.8 4.6 18.9 4.6 16.5 C4.6 14.3 6.2 12.5 8.4 12.2 C9 9.4 11.4 7.4 14.4 7.4 C16.8 7.4 18.8 8.6 19.8 10.4 C20.4 10 21.2 9.8 22.1 9.8 C24.4 9.8 26.2 11.5 26.2 13.7 C26.2 14.2 26.1 14.6 25.9 15 C27.4 15.4 28.4 16.7 28.4 18.3 C28.4 20.2 26.8 21.7 24.8 21.7 H9.2 Z"
        fill={`url(#${uid}-p)`}
      />
      <path
        d="M9.2 20.8 C7 20.8 5.4 19.3 5.2 17.4 C6.6 19 8.8 20 11.4 20 H22.8 C23.6 20 24.4 19.7 25 19.2 C24.2 20.8 22.4 21.7 20.4 21.7 H9.2 Z"
        fill={`url(#${uid}-side)`}
        opacity="0.55"
      />
      <path
        d="M10.8 12.4 C12 10.6 13.8 9.4 16 9.4 C17.6 9.4 19 10.1 19.8 11.2 C19.2 10.6 18.4 10.2 17.4 10.2 C15.2 10.2 13.4 11.6 12.6 13.6 Z"
        fill={`url(#${uid}-sheen)`}
        opacity="0.7"
      />
    </g>
  );
}

function IconDevops({ uid }: { uid: string }) {
  return (
    <g filter={`url(#${uid}-d)`}>
      <ellipse cx="16" cy="27.6" rx="8.2" ry="1.1" fill="hsla(270,40%,10%,0.2)" />
      {/* left cube */}
      <path
        d="M5.4 12.2 L10.2 9.6 L15 12.2 L15 17.4 L10.2 20 L5.4 17.4 Z"
        fill={`url(#${uid}-p)`}
      />
      <path
        d="M5.4 12.2 L10.2 9.6 L10.2 14.8 L5.4 17.4 Z"
        fill={`url(#${uid}-side)`}
        opacity="0.85"
      />
      <path d="M10.2 9.6 L15 12.2 L15 17.4 L10.2 14.8 Z" fill={`url(#${uid}-top)`} opacity="0.9" />
      {/* right cube */}
      <path
        d="M17 12.2 L21.8 9.6 L26.6 12.2 L26.6 17.4 L21.8 20 L17 17.4 Z"
        fill={`url(#${uid}-p)`}
      />
      <path
        d="M17 12.2 L21.8 9.6 L21.8 14.8 L17 17.4 Z"
        fill={`url(#${uid}-side)`}
        opacity="0.85"
      />
      <path
        d="M21.8 9.6 L26.6 12.2 L26.6 17.4 L21.8 14.8 Z"
        fill={`url(#${uid}-top)`}
        opacity="0.9"
      />
      {/* link */}
      <path
        d="M14.4 14.6 H17.6"
        stroke={`url(#${uid}-gold)`}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="10.2" cy="14.8" r="1" fill={`url(#${uid}-gold)`} />
      <circle cx="21.8" cy="14.8" r="1" fill={`url(#${uid}-gold)`} />
    </g>
  );
}

function IconDevsecops({ uid }: { uid: string }) {
  return (
    <g filter={`url(#${uid}-d)`}>
      <ellipse cx="16" cy="28.2" rx="7.2" ry="1.1" fill="hsla(270,40%,10%,0.2)" />
      <path
        d="M16 4.4 L25.2 8 V15.2 C25.2 20.6 21.2 24.8 16 26.4 C10.8 24.8 6.8 20.6 6.8 15.2 V8 Z"
        fill={`url(#${uid}-p)`}
      />
      <path
        d="M16 4.4 L6.8 8 V15.2 C6.8 19.2 9.4 22.6 13.2 24.4 L16 15.6 Z"
        fill={`url(#${uid}-side)`}
        opacity="0.5"
      />
      <path d="M16 4.4 L25.2 8 V12 L16 9.2 Z" fill={`url(#${uid}-top)`} opacity="0.7" />
      <path
        d="M12.2 15.2 L14.8 17.8 L20 12.4"
        stroke={`url(#${uid}-gold)`}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

function IconBackend({ uid }: { uid: string }) {
  return (
    <g filter={`url(#${uid}-d)`}>
      <ellipse cx="16" cy="28.4" rx="8" ry="1.15" fill="hsla(270,40%,10%,0.2)" />
      {/* bottom rack */}
      <path
        d="M6.2 18.2 H25.8 V22.2 C25.8 23.4 21.6 24.4 16 24.4 C10.4 24.4 6.2 23.4 6.2 22.2 Z"
        fill={`url(#${uid}-side)`}
      />
      <path d="M6.2 18.2 H25.8 V19.8 H6.2 Z" fill={`url(#${uid}-top)`} opacity="0.55" />
      {/* mid */}
      <path d="M6.2 12.6 H25.8 V17.4 H6.2 Z" fill={`url(#${uid}-p)`} />
      <path d="M6.2 12.6 H25.8 V14 H6.2 Z" fill={`url(#${uid}-top)`} opacity="0.6" />
      {/* top */}
      <path d="M6.2 7 H25.8 V11.8 H6.2 Z" fill={`url(#${uid}-p)`} />
      <path d="M6.2 7 H25.8 V8.4 H6.2 Z" fill={`url(#${uid}-top)`} opacity="0.65" />
      <circle cx="9" cy="9.4" r="0.75" fill={`url(#${uid}-gold)`} />
      <circle cx="9" cy="15" r="0.75" fill={`url(#${uid}-gold)`} />
      <circle cx="9" cy="20.6" r="0.75" fill={`url(#${uid}-gold)`} />
    </g>
  );
}

function IconFrontend({ uid }: { uid: string }) {
  return (
    <g filter={`url(#${uid}-d)`}>
      <ellipse cx="16" cy="28.2" rx="7.5" ry="1.1" fill="hsla(270,40%,10%,0.2)" />
      <path d="M5.6 11 L16 5.2 L26.4 11 L26.4 20.6 L16 26.4 L5.6 20.6 Z" fill={`url(#${uid}-p)`} />
      <path d="M5.6 11 L16 5.2 L16 10.4 L5.6 16.2 Z" fill={`url(#${uid}-side)`} opacity="0.55" />
      <path d="M16 5.2 L26.4 11 L26.4 16.2 L16 10.4 Z" fill={`url(#${uid}-top)`} opacity="0.75" />
      {/* screen inset */}
      <path
        d="M9.2 13.4 L16 9.8 L22.8 13.4 L22.8 19.2 L16 22.8 L9.2 19.2 Z"
        fill={`url(#${uid}-side)`}
        opacity="0.4"
      />
      <path
        d="M10.8 14.4 L16 11.6 L21.2 14.4 L16 17.2 Z"
        fill={`url(#${uid}-sheen)`}
        opacity="0.55"
      />
      <circle cx="10.2" cy="12.4" r="0.6" fill={`url(#${uid}-gold)`} />
      <circle cx="11.8" cy="12.4" r="0.6" fill={`url(#${uid}-gold)`} opacity="0.65" />
    </g>
  );
}

function IconDatabase({ uid }: { uid: string }) {
  return (
    <g filter={`url(#${uid}-d)`}>
      <ellipse cx="16" cy="28.4" rx="7.4" ry="1.15" fill="hsla(270,40%,10%,0.2)" />
      <path
        d="M7.4 9.8 C7.4 7.8 11.2 6.2 16 6.2 C20.8 6.2 24.6 7.8 24.6 9.8 V22 C24.6 24 20.8 25.6 16 25.6 C11.2 25.6 7.4 24 7.4 22 Z"
        fill={`url(#${uid}-p)`}
      />
      <ellipse cx="16" cy="9.8" rx="8.6" ry="3.2" fill={`url(#${uid}-top)`} />
      <ellipse
        cx="16"
        cy="15.2"
        rx="8.6"
        ry="2.6"
        fill="none"
        stroke={`url(#${uid}-side)`}
        strokeWidth="0.9"
        opacity="0.45"
      />
      <ellipse
        cx="16"
        cy="19.4"
        rx="8.6"
        ry="2.6"
        fill="none"
        stroke={`url(#${uid}-side)`}
        strokeWidth="0.9"
        opacity="0.35"
      />
      <ellipse cx="13.2" cy="8.4" rx="3.2" ry="1.1" fill={`url(#${uid}-sheen)`} opacity="0.5" />
    </g>
  );
}

function IconTools({ uid }: { uid: string }) {
  return (
    <g filter={`url(#${uid}-d)`}>
      <ellipse cx="16" cy="28.2" rx="7" ry="1.1" fill="hsla(270,40%,10%,0.2)" />
      {/* head */}
      <path
        d="M10.4 6.2 L14.6 4 L17.8 6.6 L15.8 8.8 L13.8 7 L11.6 9 L13.8 11.4 L11.6 13.6 L8.8 10.6 L6.4 12.8 L4.4 10.6 Z"
        fill={`url(#${uid}-p)`}
      />
      <path d="M10.4 6.2 L14.6 4 L15.8 5.4 L11.6 7.6 Z" fill={`url(#${uid}-top)`} opacity="0.75" />
      {/* shaft */}
      <path d="M13.2 14.2 L21.4 19.6 L19.4 22 L11.2 16.6 Z" fill={`url(#${uid}-p)`} />
      <path
        d="M13.2 14.2 L19.6 18.4 L21.4 19.6 L15.2 15.4 Z"
        fill={`url(#${uid}-top)`}
        opacity="0.5"
      />
      <path d="M19.4 22 L21.4 19.6 L23.6 21.6 L21.6 24 Z" fill={`url(#${uid}-side)`} />
      <circle cx="12.2" cy="7.4" r="1" fill={`url(#${uid}-gold)`} />
    </g>
  );
}

function IconArchitecture({ uid }: { uid: string }) {
  return (
    <g filter={`url(#${uid}-d)`}>
      <ellipse cx="16" cy="28.4" rx="7.6" ry="1.15" fill="hsla(270,40%,10%,0.2)" />
      {/* base block */}
      <path
        d="M8.2 17.4 L16 13.2 L23.8 17.4 L23.8 22.4 L16 26.6 L8.2 22.4 Z"
        fill={`url(#${uid}-p)`}
      />
      <path d="M8.2 17.4 L16 13.2 L16 18.4 L8.2 22.4 Z" fill={`url(#${uid}-side)`} opacity="0.7" />
      <path d="M16 13.2 L23.8 17.4 L23.8 22.4 L16 18.4 Z" fill={`url(#${uid}-top)`} opacity="0.8" />
      {/* mid block */}
      <path d="M11 11 L16 8.4 L21 11 L21 14.8 L16 17.4 L11 14.8 Z" fill={`url(#${uid}-p)`} />
      <path d="M11 11 L16 8.4 L16 12.2 L11 14.8 Z" fill={`url(#${uid}-side)`} opacity="0.65" />
      <path d="M16 8.4 L21 11 L21 14.8 L16 12.2 Z" fill={`url(#${uid}-top)`} opacity="0.85" />
      {/* apex */}
      <path d="M13.2 6 L16 4.4 L18.8 6 L18.8 8.4 L16 10 L13.2 8.4 Z" fill={`url(#${uid}-gold)`} />
      <path d="M13.2 6 L16 4.4 L16 7 L13.2 8.4 Z" fill={`url(#${uid}-sheen)`} opacity="0.4" />
    </g>
  );
}

function IconSoftSkills({ uid }: { uid: string }) {
  return (
    <g filter={`url(#${uid}-d)`}>
      <ellipse cx="16" cy="28.4" rx="6.8" ry="1.05" fill="hsla(270,40%,10%,0.2)" />
      <path
        d="M16 25.2 C16 25.2 7.2 19.2 7.2 13.2 C7.2 10.4 9.2 8.4 11.8 8.4 C13.4 8.4 14.8 9.3 15.4 10.6 C16 9.3 17.4 8.4 19 8.4 C21.6 8.4 23.6 10.4 23.6 13.2 C23.6 19.2 16 25.2 16 25.2 Z"
        fill={`url(#${uid}-p)`}
      />
      <path
        d="M16 25.2 C16 25.2 7.2 19.2 7.2 13.2 C7.2 10.8 8.6 9 10.8 8.6 C9.6 10.6 9.4 12.8 11 15.8 C12.6 18.8 14.8 21.6 16 23.4 Z"
        fill={`url(#${uid}-side)`}
        opacity="0.45"
      />
      <path
        d="M11.6 11.2 C12.4 9.8 13.8 9.1 15 9.5 C13.8 10.6 13 12.2 13.2 14.2 Z"
        fill={`url(#${uid}-sheen)`}
        opacity="0.65"
      />
    </g>
  );
}
