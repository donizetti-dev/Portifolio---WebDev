import React from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Code2,
  Cpu,
  ExternalLink,
  GitFork,
  Github,
  Layers,
  Sparkles,
  Star,
  Target,
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ErrorState } from '../components/ui/ErrorState';
import { Skeleton } from '../components/ui/Skeleton';
import { useProjectBySlug } from '../hooks/useGitHubProjects';
import type { ProjectCategory, ProjectStatus } from '../types';
import { NotFoundPage } from './NotFoundPage';
import styles from './ProjectDetailPage.module.css';

const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  'automation-rpa': 'Automação RPA',
  'backend-api': 'Backend & API',
  'frontend-web': 'Front-End Web',
  'data-engineering': 'Dados & ETL',
  fullstack: 'Full-Stack',
};

const STATUS_LABELS: Record<ProjectStatus, string> = {
  production: 'Em Produção',
  completed: 'Concluído',
  'in-progress': 'Em Evolução',
  academic: 'Acadêmico / FIAP',
};

function formatFullDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) {
      return 'Atualizado recentemente';
    }
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return 'Atualizado recentemente';
  }
}

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { project, isLoading, isError, refetch } = useProjectBySlug(slug);

  if (isLoading && !project) {
    return (
      <section
        className={styles.section}
        aria-busy="true"
        aria-label="Carregando detalhes do projeto"
        data-testid="project-detail-loading"
      >
        <div className="container">
          <div className={styles.backRow}>
            <Skeleton width="10rem" height="2.2rem" borderRadius="6px" />
          </div>

          <Card padding="lg" className={styles.heroCard}>
            <div className={styles.skeletonStack}>
              <div className={styles.skeletonRow}>
                <Skeleton width="7rem" height="1.5rem" borderRadius="9999px" />
                <Skeleton width="6rem" height="1.5rem" borderRadius="9999px" />
              </div>
              <Skeleton width="65%" height="2.6rem" />
              <Skeleton width="90%" height="1.1rem" />
              <Skeleton width="75%" height="1.1rem" />
              <div className={styles.skeletonRow}>
                <Skeleton width="9rem" height="2.5rem" borderRadius="6px" />
                <Skeleton width="9rem" height="2.5rem" borderRadius="6px" />
              </div>
            </div>
          </Card>

          <div className={styles.detailsGrid}>
            <Card padding="lg">
              <div className={styles.skeletonStack}>
                <Skeleton width="45%" height="1.4rem" />
                <Skeleton width="100%" height="1rem" />
                <Skeleton width="95%" height="1rem" />
                <Skeleton width="80%" height="1rem" />
              </div>
            </Card>
            <Card padding="lg">
              <div className={styles.skeletonStack}>
                <Skeleton width="50%" height="1.4rem" />
                <Skeleton width="100%" height="1rem" />
                <Skeleton width="90%" height="1rem" />
                <Skeleton width="85%" height="1rem" />
              </div>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  if (isError && !project) {
    return (
      <section className={styles.section} aria-label="Erro ao carregar projeto">
        <div className="container">
          <div className={styles.backRow}>
            <Link to="/" className={styles.backLink}>
              <ArrowLeft size={16} aria-hidden="true" />
              <span>Voltar para a Home</span>
            </Link>
          </div>

          <ErrorState
            title="Falha na sincronização com o GitHub"
            message="Não foi possível sincronizar os repositórios do GitHub no momento. Tente novamente em instantes."
            onRetry={() => {
              void refetch();
            }}
            retryLabel="Tentar novamente"
          />
        </div>
      </section>
    );
  }

  if (!project) {
    return (
      <NotFoundPage
        codeLabel={`ERR_404 // SLUG "${slug ?? 'DESCONHECIDO'}" NÃO ENCONTRADO`}
        title="Projeto não encontrado — O repositório que você procura pode ter sido movido ou renomeado."
        subtitle="Não localizamos este repositório no catálogo técnico nem na sincronização com o GitHub. Retorne à página inicial para visualizar todos os projetos disponíveis."
      />
    );
  }

  return (
    <article
      className={styles.section}
      aria-labelledby="project-detail-title"
      data-testid="project-detail-page"
    >
      <div className="container">
        {/* Navegação de retorno */}
        <div className={styles.backRow}>
          <Link to="/" className={styles.backLink} data-testid="project-back-home">
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Voltar para a Home</span>
          </Link>

          <span className={styles.breadcrumbSlug}>/portifolio/{project.slug}</span>
        </div>

        {/* Cabeçalho / Visão Geral de Engenharia */}
        <Card as="section" padding="lg" className={styles.heroCard}>
          <div className={styles.heroHeader}>
            <div className={styles.badgesGroup}>
              {project.isFeatured && (
                <Badge variant="electric">
                  <Sparkles size={12} aria-hidden="true" />
                  <span>Projeto em Destaque</span>
                </Badge>
              )}
              <Badge variant="outline">{CATEGORY_LABELS[project.category]}</Badge>
              <Badge variant="success">{STATUS_LABELS[project.status]}</Badge>
            </div>

            <div className={styles.metricsBar} aria-label="Métricas do repositório no GitHub">
              <span className={styles.metricPill} title="Linguagem Principal">
                <Code2 size={14} aria-hidden="true" />
                <span>{project.language}</span>
              </span>
              <span className={styles.metricPill} title="Estrelas no GitHub">
                <Star size={14} aria-hidden="true" />
                <span>{project.stargazersCount} stars</span>
              </span>
              <span className={styles.metricPill} title="Forks no GitHub">
                <GitFork size={14} aria-hidden="true" />
                <span>{project.forksCount} forks</span>
              </span>
              <span className={styles.metricPill} title="Data da última atualização">
                <Calendar size={14} aria-hidden="true" />
                <span>{formatFullDate(project.updatedAt)}</span>
              </span>
            </div>
          </div>

          <h1 id="project-detail-title" className={styles.title}>
            {project.name}
          </h1>

          <p className={styles.description}>{project.description}</p>

          <div className={styles.ctaRow}>
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaLink}
              data-testid="project-github-link"
            >
              <Button
                variant="primary"
                size="md"
                leftIcon={<Github size={16} aria-hidden="true" />}
              >
                Repositório no GitHub
              </Button>
            </a>

            {project.homepageUrl && (
              <a
                href={project.homepageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaLink}
                data-testid="project-demo-link"
              >
                <Button
                  variant="secondary"
                  size="md"
                  rightIcon={<ExternalLink size={15} aria-hidden="true" />}
                >
                  Acessar Deploy / Demo
                </Button>
              </a>
            )}
          </div>
        </Card>

        {/* Seções de Engenharia: Problema de Negócio e Decisões Arquiteturais */}
        <div className={styles.detailsGrid}>
          <Card as="section" padding="lg" aria-labelledby="problem-heading">
            <div className={styles.blockHeader}>
              <span className={styles.blockCode}>01 // CONTEXTO</span>
              <h2 id="problem-heading" className={styles.blockTitle}>
                <Target size={18} className={styles.blockIcon} aria-hidden="true" />
                <span>Problema de Negócio & Contexto</span>
              </h2>
            </div>

            <p className={styles.blockParagraph}>{project.problemStatement}</p>

            {project.highlights.length > 0 && (
              <div className={styles.highlightsBox}>
                <h3 className={styles.subHeading}>Destaques Operacionais</h3>
                <ul className={styles.checkList}>
                  {project.highlights.map((item) => (
                    <li key={item} className={styles.checkItem}>
                      <CheckCircle2 size={15} className={styles.checkIcon} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>

          <Card as="section" padding="lg" aria-labelledby="architecture-heading">
            <div className={styles.blockHeader}>
              <span className={styles.blockCode}>02 // ENGENHARIA</span>
              <h2 id="architecture-heading" className={styles.blockTitle}>
                <Cpu size={18} className={styles.blockIcon} aria-hidden="true" />
                <span>Decisões Arquiteturais e Técnicas</span>
              </h2>
            </div>

            <ul className={styles.architectureList}>
              {project.architectureDecisions.map((decision, idx) => (
                <li key={decision} className={styles.architectureItem}>
                  <span className={styles.stepIndex}>{String(idx + 1).padStart(2, '0')}</span>
                  <p className={styles.architectureText}>{decision}</p>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Stack Completa e Tópicos */}
        <Card
          as="section"
          padding="lg"
          className={styles.stackCard}
          aria-labelledby="stack-heading"
        >
          <div className={styles.blockHeader}>
            <span className={styles.blockCode}>03 // ESPECIFICAÇÃO DE TECNOLOGIAS</span>
            <h2 id="stack-heading" className={styles.blockTitle}>
              <Layers size={18} className={styles.blockIcon} aria-hidden="true" />
              <span>Stack Completa & Ferramental</span>
            </h2>
          </div>

          <div className={styles.stackTagsGrid}>
            {project.stack.map((tech) => (
              <span key={tech} className={styles.stackBadge}>
                {tech}
              </span>
            ))}
          </div>

          {project.topics.length > 0 && (
            <div className={styles.topicsRow}>
              <span className={styles.topicsLabel}>Tópicos indexados:</span>
              <div className={styles.topicsList}>
                {project.topics.map((topic) => (
                  <span key={topic} className={styles.topicTag}>
                    #{topic}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </article>
  );
};

export default ProjectDetailPage;
