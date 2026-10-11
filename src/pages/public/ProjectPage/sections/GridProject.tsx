import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { cn } from '@/shared/lib/utils';
import { usePublicSkills } from '@/entities/skills/hooks/useSkills';
import { ProjectCard } from '@/entities/projets';
import { ProjectFilterBar, useProjectFilters } from '@/features/projets-browse';
import { Button } from '@/shared/ui/button';
import { QueryState } from '@/shared/ui/QueryState';
import { trackProjectPagination } from '@/app/lib/analytics';
import { FaSearch } from 'react-icons/fa';

// ─── Props ──────────────────────────────────────────────────────────────────────

type FilterReturn = ReturnType<typeof useProjectFilters>;

interface GridProjectProps {
  filterState: FilterReturn;
}

// ─── Component ──────────────────────────────────────────────────────────────────

export const GridProject: React.FC<GridProjectProps> = ({ filterState }) => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const skillsQuery = usePublicSkills();

  const {
    filters,
    filteredProjects,
    availableTechs,
    availableRoles,
    availableStatuses,
    secondaryActiveCount,
    setCategory,
    toggleTech,
    setRole,
    setStatus,
    resetSecondaryFilters,
    resetAllFilters,
    isPending,
    isError,
    error,
    source,
  } = filterState;

  // ─── Pagination Logic ────────────────────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);
  const PROJECTS_PER_PAGE = 6;
  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + PROJECTS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, filteredProjects.length]);

  const handlePageChange = (page: number, action: 'prev' | 'next' | 'page' = 'page') => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    trackProjectPagination(page, totalPages, action);
    setCurrentPage(page);
    setTimeout(() => {
      const yOffset = -20;
      const element = sectionRef.current;
      if (element) {
        const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 50);
  };

  // ─── Filter Options ──────────────────────────────────────────────────────────
  const skillCategories = Array.from(
    new Set((skillsQuery.data?.data.items ?? []).map((s) => s.category)),
  );
  const categoryFilters = [
    { id: 'all', labelKey: 'all' },
    ...skillCategories.map((cat) => ({ id: cat, labelKey: cat })),
  ];

  return (
    <section className="relative mt-10 mb-10 overflow-hidden" ref={sectionRef}>
      {/* ── Category Filter (Primary) ────────────────────────────────────────── */}
      <div className="relative z-10 mb-4">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-linear-to-r from-background to-transparent md:hidden"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-linear-to-l from-background to-transparent md:hidden"
          aria-hidden
        />
        <div
          className={cn(
            'flex gap-2 pb-0.5',
            // Mobile: one-line horizontal browse
            '-mx-1 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
            // Desktop: wrap centered
            'md:mx-0 md:flex-wrap md:justify-center md:overflow-visible md:px-0',
          )}
        >
          {categoryFilters.map((filter) => {
            const isActive = filters.category === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setCategory(filter.id)}
                className={cn(
                  'relative shrink-0 cursor-pointer overflow-hidden rounded-full border px-3.5 py-1.5 text-xs font-semibold capitalize tracking-wide transition-all duration-300 md:px-4 md:py-1',
                  isActive
                    ? 'scale-105 border-brand bg-brand text-brand-foreground shadow-none'
                    : 'border-border/40 bg-secondary/40 text-muted-foreground hover:border-primary/50 hover:bg-secondary/80 hover:text-foreground',
                )}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {t(filter.labelKey)}
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_10px_white] animate-pulse" />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Secondary Filter Bar (Feature layer) ─────────────────────────────── */}
      <ProjectFilterBar
        availableTechs={availableTechs}
        availableRoles={availableRoles}
        availableStatuses={availableStatuses}
        activeTechs={filters.techs}
        activeRole={filters.role}
        activeStatus={filters.status}
        secondaryActiveCount={secondaryActiveCount}
        onTechToggle={toggleTech}
        onRoleSelect={setRole}
        onStatusSelect={setStatus}
        onReset={resetSecondaryFilters}
      />

      <QueryState
        isPending={isPending}
        isError={isError}
        errorMessage={error instanceof Error ? error.message : undefined}
        source={source}
      >
      {/* ── Project Grid ─────────────────────────────────────────────────────── */}
      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in">
          <div className="p-4 rounded-sm bg-secondary/30 mb-2 border border-border/50">
            <FaSearch className="h-5 w-5 text-muted-foreground/30 animate-pulse" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-3">
            {language === 'fr' ? 'Aucun projet trouvé' : 'No projects found'}
          </h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto text-base leading-relaxed mb-10">
            {language === 'fr'
              ? 'Essaiyez de modifier tes critères de recherche ou réinitialisez tous les filtres pour recommencer.'
              : 'Try adjusting your search criteria or reset all filters to start over.'}
          </p>
          <Button onClick={resetAllFilters} className="rounded-sm px-4 shadow-xs shadow-primary/20">
            {language === 'fr' ? 'Réinitialiser tous les filtres' : 'Reset all filters'}
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-10 grid grid-cols-1 gap-8 animate-fade-in md:grid-cols-2 lg:grid-cols-3">
            {paginatedProjects.map((project) => (
              <div key={project.id} className="min-w-0">
                <ProjectCard
                  project={project}
                  activeTechs={filters.techs}
                  onTechClick={toggleTech}
                />
              </div>
            ))}
          </div>

          {/* ── Pagination UI ───────────────────────────────────────────────────── */}
          {totalPages > 1 && (
            <div className="relative z-10 flex items-center justify-center gap-2 pb-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1, 'prev')}
                disabled={currentPage === 1}
                className="cursor-pointer rounded-md border-border/50 hover:border-primary/50"
                aria-label={language === 'fr' ? 'Page précédente' : 'Previous page'}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <div className="flex gap-2 rounded-md border border-border/50 bg-secondary/30 p-1">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNumber = i + 1;
                  const isActive = currentPage === pageNumber;
                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => handlePageChange(pageNumber, 'page')}
                      className={cn(
                        'h-8 w-8 cursor-pointer rounded-md text-sm font-bold transition-all',
                        isActive
                          ? 'scale-105 bg-brand text-brand-foreground shadow-none'
                          : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                      )}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1, 'next')}
                disabled={currentPage === totalPages}
                className="cursor-pointer rounded-md border-border/50 hover:border-primary/50"
                aria-label={language === 'fr' ? 'Page suivante' : 'Next page'}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </>
      )}
      </QueryState>
    </section>
  );
};
