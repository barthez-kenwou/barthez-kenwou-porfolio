import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

// ─── Props ──────────────────────────────────────────────────────────────────────

interface FilterDropdownProps {
  /** Button label */
  label: string;
  /** Number of active selections inside - drives the highlight style */
  activeCount: number;
  children: React.ReactNode;
}

// ─── Component ──────────────────────────────────────────────────────────────────

export const FilterDropdown: React.FC<FilterDropdownProps> = ({ label, activeCount, children }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const isActive = activeCount > 0;

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-semibold border transition-all duration-200 cursor-pointer ${
          isActive
            ? 'border-primary/60 bg-primary/10 text-primary shadow-primary/15'
            : 'border-border/40 bg-secondary/30 text-muted-foreground hover:border-border/70 hover:text-foreground hover:bg-secondary/60'
        }`}
      >
        <span>{label}</span>

        {isActive && (
          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-brand text-[10px] font-bold text-brand-foreground">
            {activeCount}
          </span>
        )}

        <ChevronDown
          className={`h-3 w-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute top-full mt-1.5 left-0 z-50 min-w-[180px] rounded-md border border-border/60 bg-card/95 backdrop-blur-xl shadow-lg shadow-black/30 p-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
          {children}
        </div>
      )}
    </div>
  );
};
