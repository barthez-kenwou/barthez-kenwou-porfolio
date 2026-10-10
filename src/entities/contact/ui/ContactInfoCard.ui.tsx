import React from 'react';
import { cn } from '@/lib/utils';
import { IconType } from 'react-icons';

interface ContactInfoProps {
  icon: IconType;
  label: string;
  value: string;
  href?: string;
  className?: string;
  onClick?: () => void;
}

export const ContactInfoCard: React.FC<ContactInfoProps> = ({
  icon: Icon,
  label,
  value,
  href,
  className,
  onClick,
}) => {
  const content = (
    <div
      className={cn(
        'group flex items-center gap-2.5 rounded-sm border border-border/50 bg-card/40 px-2.5 py-2',
        'transition-[border-color,background-color,color] duration-300 ease-out',
        'hover:border-primary/30 hover:bg-primary/[0.06]',
        className,
      )}
    >
      <div
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-primary/15 bg-primary/8 text-foreground',
          'transition-[background-color,border-color,color] duration-300 ease-out',
          'group-hover:border-primary/35 group-hover:bg-primary/15 group-hover:text-primary',
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="mb-0.5 text-[9px] font-bold tracking-widest text-muted-foreground uppercase">
          {label}
        </p>
        <p className="break-words text-[11px] leading-snug font-semibold text-foreground transition-colors duration-300 group-hover:text-primary">
          {value}
        </p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        onClick={onClick}
        className="block cursor-pointer"
      >
        {content}
      </a>
    );
  }

  return content;
};
