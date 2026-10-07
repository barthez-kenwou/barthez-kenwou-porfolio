import React from 'react';

interface TechBadgeProps {
  tag: string;
  active?: boolean;
  onClick?: (tag: string) => void;
  className?: string;
}

/**
 * Clickable (or static) technology badge used on project cards.
 * When `onClick` is provided the badge becomes interactive and highlights
 * itself when `active` is true.
 */
export const TechBadge: React.FC<TechBadgeProps> = ({
  tag,
  active = false,
  onClick,
  className = '',
}) => {
  const interactive = typeof onClick === 'function';

  const baseClass = 'px-2 py-0.5 rounded-md text-xs transition-all duration-200';

  const activeClass = 'bg-primary/20 text-primary border border-primary/40 shadow-primary/20';

  const inactiveClass = interactive
    ? 'bg-secondary/50 text-muted-foreground border border-transparent hover:border-primary/30 hover:text-foreground hover:bg-secondary/80 cursor-pointer'
    : 'bg-secondary/50 text-muted-foreground border border-transparent';

  if (interactive) {
    return (
      <button
        type="button"
        title={`Filtrer par ${tag}`}
        onClick={() => onClick(tag)}
        className={`${baseClass} ${active ? activeClass : inactiveClass} ${className}`}
      >
        {tag}
      </button>
    );
  }

  return <span className={`${baseClass} ${inactiveClass} ${className}`}>{tag}</span>;
};
