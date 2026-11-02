import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ExternalLink, GitFork, Github, Sparkles, Star } from 'lucide-react';
import { useSpotlight } from '../../hooks/useSpotlight';
import type { EnrichedProject, ProjectCategory } from '../../types';
import { Badge } from '../ui/Badge';
import styles from './ProjectCard.module.css';

export interface ProjectCardProps {
  project: EnrichedProject;
}

const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  'automation-rpa': 'Automação RPA',
  'backend-api': 'Backend & API',
  'frontend-web': 'Front-End Web',
  'data-engineering': 'Dados & ETL',
  fullstack: 'Full-Stack',
};

function formatUpdatedDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) {
      return 'Recente';
    }
    return new Intl.DateTimeFormat('pt-BR', {
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return 'Recente';
  }
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { ref, handlers } = useSpotlight<HTMLElement>({ maxTilt: 4 });
  const detailPath = `/portifolio/${project.slug}`;

  return (
    <article
      ref={ref}
      {...handlers}
      className={styles.cardWrapper}
      aria-label={`Projeto ${project.name}`}
    >
      <div className={styles.card}>
        <div className={styles.spotlightLayer} aria-hidden="true" />
        <div className={styles.splitRevealLayer} aria-hidden="true" />
        <span className={styles.splitTag} aria-hidden="true">
          [ARCH // {project.language.toUpperCase()}]
        </span>

        <div className={styles.topArea}>
          <div className={styles.badgesRow}>
            <div className={styles.badgesLeft}>
              {project.isFeatured && (
                <Badge variant="electric">
                  <Sparkles size={11} aria-hidden="true" />
                  <span>Destaque</span>
                </Badge>
              )}
              <Badge variant="outline">{CATEGORY_LABELS[project.category]}</Badge>
            </div>

            <div className={styles.repoStats} aria-label="Métricas do repositório">
              <span className={styles.statItem} title="Estrelas no GitHub">
                <Star size={13} aria-hidden="true" />
                <span>{project.stargazersCount}</span>
              </span>
              {project.forksCount > 0 && (
                <span className={styles.statItem} title="Forks no GitHub">
                  <GitFork size={13} aria-hidden="true" />
                  <span>{project.forksCount}</span>
                </span>
              )}
            </div>
          </div>

          <Link to={detailPath} className={styles.titleLink}>
            <h3 className={styles.title}>{project.name}</h3>
          </Link>

          <p className={styles.description}>{project.shortDescription}</p>
        </div>

        <div className={styles.bottomArea}>
          <div className={styles.stackRow} aria-label="Tecnologias utilizadas">
            {project.stack.slice(0, 5).map((tech) => (
              <span key={tech} className={styles.stackTag}>
                {tech}
              </span>
            ))}
          </div>

          <div className={styles.footerRow}>
            <span className={styles.updatedDate}>
              Atualizado em {formatUpdatedDate(project.updatedAt)}
            </span>

            <div className={styles.actions}>
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.externalLink}
                aria-label={`Código-fonte de ${project.name} no GitHub`}
              >
                <Github size={14} aria-hidden="true" />
                <span>Código</span>
              </a>

              {project.homepageUrl && (
                <a
                  href={project.homepageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.externalLink}
                  aria-label={`Demonstração online de ${project.name}`}
                >
                  <ExternalLink size={14} aria-hidden="true" />
                  <span>Demo</span>
                </a>
              )}

              <Link
                to={detailPath}
                className={styles.detailsLink}
                aria-label={`Ver especificações completas do projeto ${project.name}`}
              >
                <span>Detalhes</span>
                <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
