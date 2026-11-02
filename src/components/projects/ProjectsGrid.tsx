import React, { useMemo, useState } from 'react';
import { FolderGit2, RotateCcw } from 'lucide-react';
import { useGitHubProjects } from '../../hooks/useGitHubProjects';
import type { ProjectCategory } from '../../types';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { ErrorState } from '../ui/ErrorState';
import { ProjectCardSkeleton } from '../ui/Skeleton';
import { ProjectCard } from './ProjectCard';
import styles from './ProjectsGrid.module.css';

type FilterOptionId = 'all' | 'featured' | ProjectCategory;

interface FilterOption {
  id: FilterOptionId;
  label: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  { id: 'all', label: 'Todos' },
  { id: 'featured', label: 'Destaques' },
  { id: 'automation-rpa', label: 'Automação RPA' },
  { id: 'backend-api', label: 'Backend & API' },
  { id: 'frontend-web', label: 'Front-End Web' },
  { id: 'data-engineering', label: 'Dados & ETL' },
];

export const ProjectsGrid: React.FC = () => {
  const { projects, featuredProjects, isLoading, isError, refetch } = useGitHubProjects();
  const [activeFilter, setActiveFilter] = useState<FilterOptionId>('all');

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') {
      return projects;
    }
    if (activeFilter === 'featured') {
      return featuredProjects;
    }
    return projects.filter((project) => project.category === activeFilter);
  }, [projects, featuredProjects, activeFilter]);

  const getCountForFilter = (filterId: FilterOptionId): number => {
    if (filterId === 'all') return projects.length;
    if (filterId === 'featured') return featuredProjects.length;
    return projects.filter((project) => project.category === filterId).length;
  };

  return (
    <section id="projetos" className={styles.section} aria-labelledby="projects-heading">
      <div className="container">
        <header className={styles.headerRow}>
          <div className={styles.titleGroup}>
            <span className={styles.codeLabel}>03 // ENGENHARIA APLICADA & REPOSITÓRIOS</span>
            <h2 id="projects-heading" className={styles.sectionTitle}>
              PROJETOS <span className="text-outline">& ARQUITETURA</span>
            </h2>
            <p className={styles.subtitle}>
              Projetos reais sincronizados via GitHub REST API e enriquecidos pelo catálogo técnico
              de engenharia de software, automação RPA e aplicações web.
            </p>
          </div>
        </header>

        <div
          className={styles.filtersBar}
          role="tablist"
          aria-label="Filtrar projetos por categoria"
        >
          {FILTER_OPTIONS.map((option) => {
            const isActive = activeFilter === option.id;
            const count = getCountForFilter(option.id);

            return (
              <button
                key={option.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveFilter(option.id)}
                className={`${styles.filterButton} ${isActive ? styles.filterButtonActive : ''}`}
              >
                <span>{option.label}</span>
                {!isLoading && !isError && <span className={styles.filterCount}>({count})</span>}
              </button>
            );
          })}
        </div>

        {/* Estado 1 (RF04): Carregamento com Skeletons */}
        {isLoading && (
          <div className={styles.grid} aria-busy="true" aria-label="Carregando projetos">
            {Array.from({ length: 6 }).map((_, index) => (
              <ProjectCardSkeleton key={`skeleton-${index}`} />
            ))}
          </div>
        )}

        {/* Estado 2 (RF04): Erro de API com mensagem amigável e botão de retry */}
        {!isLoading && isError && (
          <div className={styles.stateWrapper}>
            <ErrorState
              title="Falha na sincronização com o GitHub"
              message="Não foi possível sincronizar os repositórios do GitHub no momento. Tente novamente em instantes."
              onRetry={() => {
                void refetch();
              }}
              retryLabel="Tentar novamente"
            />
          </div>
        )}

        {/* Estado 3 (RF04): Lista vazia para o filtro selecionado */}
        {!isLoading && !isError && filteredProjects.length === 0 && (
          <div className={styles.stateWrapper}>
            <EmptyState
              icon={<FolderGit2 size={22} />}
              title="Nenhum projeto encontrado para este filtro"
              description="Não há repositórios correspondentes à categoria selecionada no momento."
              action={
                activeFilter !== 'all' ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setActiveFilter('all')}
                    leftIcon={<RotateCcw size={14} />}
                  >
                    Exibir todos os projetos
                  </Button>
                ) : undefined
              }
            />
          </div>
        )}

        {/* Estado Sucesso: Grade de Cards */}
        {!isLoading && !isError && filteredProjects.length > 0 && (
          <div className={styles.grid}>
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsGrid;
