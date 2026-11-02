import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  Database,
  ExternalLink,
  FolderGit2,
  Inbox,
  LogOut,
  MailCheck,
  Sparkles,
  Star,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useContactMessages } from '../hooks/useContactMessages';
import { useFeaturedProjects } from '../hooks/useFeaturedProjects';
import { useGitHubProjects } from '../hooks/useGitHubProjects';
import { isSupabaseConfigured } from '../services/supabaseClient';
import type { MessageFilter } from '../types';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { Skeleton } from '../components/ui/Skeleton';
import styles from './DashboardPage.module.css';

function formatMessageDate(isoDate: string): string {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(isoDate));
  } catch {
    return isoDate;
  }
}

export const DashboardPage: React.FC = () => {
  const { userEmail, logout } = useAuth();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<MessageFilter>('all');

  const {
    messages,
    stats,
    isLoading: isLoadingMessages,
    isError: isMessagesError,
    refetch: refetchMessages,
    toggleReplied,
    toggleImportant,
    isUpdating: isUpdatingMessage,
  } = useContactMessages(activeFilter);

  const { projects, catalogFallbackProjects, isLoading: isLoadingProjects } = useGitHubProjects();

  const {
    featuredSlugs,
    isProjectFeatured,
    toggleFeaturedProject,
    isSaving: isSavingFeatured,
  } = useFeaturedProjects();

  const supabaseActive = isSupabaseConfigured();
  const availableProjects = projects.length > 0 ? projects : catalogFallbackProjects;

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const handleToggleReplied = async (id: string, currentReplied: boolean) => {
    await toggleReplied({ id, nextValue: !currentReplied });
  };

  const handleToggleImportant = async (id: string, currentImportant: boolean) => {
    await toggleImportant({ id, nextValue: !currentImportant });
  };

  const handleToggleFeatured = async (slug: string) => {
    await toggleFeaturedProject(slug);
  };

  return (
    <section
      className={styles.page}
      aria-labelledby="dashboard-heading"
      data-testid="dashboard-page"
    >
      <div className={`container ${styles.container}`}>
        {/* 1. Cabeçalho Administrativo */}
        <header className={styles.headerCard}>
          <div className={styles.headerTop}>
            <div className={styles.titleGroup}>
              <div className={styles.eyebrowRow}>
                <span className={styles.eyebrow}>Painel Administrativo // Donizetti.dev</span>
                <Badge variant={supabaseActive ? 'electric' : 'outline'}>
                  <Database size={12} aria-hidden="true" style={{ marginRight: '0.3rem' }} />
                  {supabaseActive ? 'Persistência: Supabase Cloud' : 'Persistência: Local Fallback'}
                </Badge>
              </div>

              <h1 id="dashboard-heading" className={styles.title}>
                Gestão de Mensagens &{' '}
                <span className="text-outline" data-text="Destaques">
                  Destaques
                </span>
              </h1>

              <div className={styles.userMeta} data-testid="dashboard-user-email">
                <UserCheck size={15} aria-hidden="true" />
                <span>
                  Sessão autenticada como <strong>{userEmail ?? 'admin@donizetti.dev'}</strong>
                </span>
              </div>
            </div>

            <div className={styles.headerActions}>
              <Link to="/" className={styles.homeLink}>
                <ExternalLink size={14} aria-hidden="true" />
                <span>Ver Portfólio</span>
              </Link>

              <Button
                variant="secondary"
                size="sm"
                onClick={handleLogout}
                leftIcon={<LogOut size={15} aria-hidden="true" />}
                data-testid="dashboard-logout-button"
              >
                Sair
              </Button>
            </div>
          </div>

          <div className={styles.metricsGrid} aria-label="Resumo de indicadores">
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Total de Mensagens</span>
              <span className={styles.metricValue} data-testid="stat-total-messages">
                {stats.total}
              </span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Não Respondidas</span>
              <span className={styles.metricValue} data-testid="stat-unreplied-messages">
                {stats.unreplied}
              </span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Respondidas</span>
              <span className={styles.metricValue} data-testid="stat-replied-messages">
                {stats.replied}
              </span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Importantes</span>
              <span className={styles.metricValue} data-testid="stat-important-messages">
                {stats.important}
              </span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Projetos em Destaque</span>
              <span className={styles.metricValue} data-testid="stat-featured-projects">
                {featuredSlugs.length}
              </span>
            </div>
          </div>
        </header>

        <div className={styles.mainGrid}>
          {/* 2. Gestão de Mensagens Recebidas (RF07) */}
          <section className={styles.panel} aria-labelledby="messages-panel-title">
            <div className={styles.panelHeader}>
              <div className={styles.panelTitleRow}>
                <h2 id="messages-panel-title" className={styles.panelTitle}>
                  <Inbox size={20} aria-hidden="true" />
                  <span>Mensagens Recebidas</span>
                </h2>
                <Badge variant="outline">{messages.length} exibida(s)</Badge>
              </div>
              <p className={styles.panelSubtitle}>
                Filtre contatos por status de atendimento e destaque solicitações prioritárias.
              </p>
            </div>

            <div
              className={styles.filterBar}
              role="group"
              aria-label="Filtrar mensagens por status"
            >
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`${styles.filterButton} ${
                  activeFilter === 'all' ? styles.filterButtonActive : ''
                }`}
                aria-pressed={activeFilter === 'all'}
                data-testid="filter-all"
              >
                <span>Todas</span>
                <span className={styles.filterCount}>{stats.total}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter('unreplied')}
                className={`${styles.filterButton} ${
                  activeFilter === 'unreplied' ? styles.filterButtonActive : ''
                }`}
                aria-pressed={activeFilter === 'unreplied'}
                data-testid="filter-unreplied"
              >
                <span>Não respondidas</span>
                <span className={styles.filterCount}>{stats.unreplied}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter('replied')}
                className={`${styles.filterButton} ${
                  activeFilter === 'replied' ? styles.filterButtonActive : ''
                }`}
                aria-pressed={activeFilter === 'replied'}
                data-testid="filter-replied"
              >
                <span>Respondidas</span>
                <span className={styles.filterCount}>{stats.replied}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter('important')}
                className={`${styles.filterButton} ${
                  activeFilter === 'important' ? styles.filterButtonActive : ''
                }`}
                aria-pressed={activeFilter === 'important'}
                data-testid="filter-important"
              >
                <span>Importantes</span>
                <span className={styles.filterCount}>{stats.important}</span>
              </button>
            </div>

            {isLoadingMessages ? (
              <div className={styles.skeletonStack} role="status" aria-label="Carregando mensagens">
                <Skeleton height="130px" borderRadius="12px" />
                <Skeleton height="130px" borderRadius="12px" />
                <Skeleton height="130px" borderRadius="12px" />
              </div>
            ) : isMessagesError ? (
              <ErrorState
                title="Erro ao carregar mensagens"
                message="Não foi possível carregar as mensagens de contato no momento."
                onRetry={() => void refetchMessages()}
              />
            ) : messages.length === 0 ? (
              <EmptyState
                title="Nenhuma mensagem neste filtro"
                description="Não há mensagens correspondentes ao critério selecionado no momento."
                action={
                  activeFilter !== 'all' ? (
                    <Button variant="secondary" size="sm" onClick={() => setActiveFilter('all')}>
                      Exibir todas as mensagens
                    </Button>
                  ) : undefined
                }
              />
            ) : (
              <div className={styles.messageList} data-testid="messages-list">
                {messages.map((msg) => {
                  const isReplied = msg.is_replied || msg.is_answered;
                  return (
                    <article
                      key={msg.id}
                      className={`${styles.messageCard} ${
                        msg.is_important ? styles.messageCardImportant : ''
                      }`}
                      data-testid={`message-card-${msg.id}`}
                    >
                      <div className={styles.messageHeader}>
                        <div className={styles.senderInfo}>
                          <span className={styles.senderName}>{msg.name}</span>
                          <span className={styles.senderEmail}>{msg.email}</span>
                        </div>

                        <div className={styles.badgesRow}>
                          <Badge variant={isReplied ? 'success' : 'outline'}>
                            {isReplied ? 'Respondida' : 'Pendente'}
                          </Badge>
                          {msg.is_important && <Badge variant="warning">Importante</Badge>}
                        </div>
                      </div>

                      {msg.subject && <div className={styles.subjectLine}>{msg.subject}</div>}

                      <p className={styles.messageBody}>{msg.message}</p>

                      <div className={styles.messageFooter}>
                        <span className={styles.timestamp}>
                          <Clock size={13} aria-hidden="true" />
                          <span>{formatMessageDate(msg.created_at)}</span>
                        </span>

                        <div className={styles.messageActions}>
                          <button
                            type="button"
                            onClick={() => void handleToggleReplied(msg.id, isReplied)}
                            disabled={isUpdatingMessage}
                            className={`${styles.actionBtn} ${
                              isReplied ? styles.actionBtnActiveSuccess : ''
                            }`}
                            aria-pressed={isReplied}
                            data-testid={`toggle-replied-${msg.id}`}
                          >
                            {isReplied ? (
                              <>
                                <CheckCircle2 size={14} aria-hidden="true" />
                                <span>Respondida</span>
                              </>
                            ) : (
                              <>
                                <MailCheck size={14} aria-hidden="true" />
                                <span>Marcar Respondida</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => void handleToggleImportant(msg.id, msg.is_important)}
                            disabled={isUpdatingMessage}
                            className={`${styles.actionBtn} ${
                              msg.is_important ? styles.actionBtnActiveWarning : ''
                            }`}
                            aria-pressed={msg.is_important}
                            data-testid={`toggle-important-${msg.id}`}
                          >
                            <Star size={14} aria-hidden="true" />
                            <span>{msg.is_important ? 'Importante' : 'Destacar'}</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          {/* 3. Curadoria de Projetos em Destaque na Home (RF08) */}
          <section className={styles.panel} aria-labelledby="featured-panel-title">
            <div className={styles.panelHeader}>
              <div className={styles.panelTitleRow}>
                <h2 id="featured-panel-title" className={styles.panelTitle}>
                  <FolderGit2 size={20} aria-hidden="true" />
                  <span>Destaques da Home</span>
                </h2>
                <Badge variant="electric">{featuredSlugs.length} ativo(s)</Badge>
              </div>
              <p className={styles.panelSubtitle}>
                Selecione quais projetos aparecem com selo de destaque e prioridade na página
                inicial do portfólio.
              </p>
            </div>

            {isLoadingProjects && availableProjects.length === 0 ? (
              <div className={styles.skeletonStack} role="status" aria-label="Carregando projetos">
                <Skeleton height="78px" borderRadius="12px" />
                <Skeleton height="78px" borderRadius="12px" />
                <Skeleton height="78px" borderRadius="12px" />
              </div>
            ) : (
              <div className={styles.projectsList} data-testid="featured-projects-list">
                {availableProjects.map((project) => {
                  const isFeatured = isProjectFeatured(project.slug);
                  return (
                    <div
                      key={project.slug}
                      className={`${styles.projectItem} ${
                        isFeatured ? styles.projectItemFeatured : ''
                      }`}
                      data-testid={`featured-project-item-${project.slug}`}
                    >
                      <div className={styles.projectMeta}>
                        <div className={styles.projectTitleRow}>
                          <span className={styles.projectName}>{project.name}</span>
                          <Badge variant="outline">{project.language}</Badge>
                        </div>
                        <p className={styles.projectDesc}>{project.shortDescription}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => void handleToggleFeatured(project.slug)}
                        disabled={isSavingFeatured}
                        className={`${styles.projectToggleBtn} ${
                          isFeatured ? styles.projectToggleBtnActive : ''
                        }`}
                        aria-pressed={isFeatured}
                        data-testid={`toggle-featured-${project.slug}`}
                      >
                        <Sparkles size={14} aria-hidden="true" />
                        <span>{isFeatured ? 'Em Destaque' : 'Destacar na Home'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
