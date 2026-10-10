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

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, filteredProjects.length]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setTimeout(() => {
      // Offset scrolling slightly higher if there is a fixed header
      const yOffset = -20;
      const element = sectionRef.current;
      if (element) {
        const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 50);
  };

  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + PROJECTS_PER_PAGE);

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
      <div className="flex flex-wrap justify-center gap-2 mb-4 relative z-10">
        {categoryFilters.map((filter) => {
          const isActive = filters.category === filter.id;
          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => setCategory(filter.id)}
              className={`relative px-4 py-1 cursor-pointer rounded-full text-xs capitalize tracking-wide font-semibold transition-all duration-300 overflow-hidden group border ${
                isActive
                  ? 'bg-brand border-brand text-brand-foreground shadow-none scale-105'
                  : 'bg-secondary/40 border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-secondary/80'
              }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {t(filter.labelKey)}
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white] animate-pulse" />
                )}
              </span>
            </button>
          );
        })}
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
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-md border-border/50 hover:border-primary/50 cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <div className="flex gap-2 p-1 rounded-md bg-secondary/30 border border-border/50">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNumber = i + 1;
                  const isActive = currentPage === pageNumber;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={cn(
                        'w-8 h-8 rounded-md text-sm font-bold transition-all cursor-pointer',
                        isActive
                          ? 'bg-brand text-brand-foreground shadow-none scale-105'
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
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-md border-border/50 hover:border-primary/50 cursor-pointer"
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
