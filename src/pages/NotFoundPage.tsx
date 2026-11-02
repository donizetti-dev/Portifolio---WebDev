import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass, Terminal } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import styles from './NotFoundPage.module.css';

export interface NotFoundPageProps {
  title?: string;
  subtitle?: string;
  codeLabel?: string;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  title = 'Projeto não encontrado — O repositório que você procura pode ter sido movido ou renomeado.',
  subtitle = 'Ops, essa página ainda não existe! Verifique o endereço digitado ou retorne para a página inicial para explorar os projetos de engenharia e automação.',
  codeLabel = 'ERR_404 // ROTA OU REPOSITÓRIO INEXISTENTE',
}) => {
  return (
    <section
      className={styles.section}
      aria-labelledby="not-found-heading"
      data-testid="not-found-page"
    >
      <div className="container">
        <Card as="article" padding="lg" className={styles.card}>
          <div className={styles.content}>
            <div className={styles.badgeRow}>
              <span className={styles.codeBadge}>
                <Terminal size={14} aria-hidden="true" />
                <span>{codeLabel}</span>
              </span>
            </div>

            <div className={styles.displayCode} aria-hidden="true">
              404 <span className="text-outline">NOT FOUND</span>
            </div>

            <h1 id="not-found-heading" className={styles.title}>
              {title}
            </h1>

            <p className={styles.description}>{subtitle}</p>

            <div className={styles.actions}>
              <Link to="/" className={styles.actionLink} data-testid="not-found-home-link">
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<ArrowLeft size={16} aria-hidden="true" />}
                >
                  Voltar para a Home
                </Button>
              </Link>

              <a href="/#projetos" className={styles.actionLink}>
                <Button
                  variant="secondary"
                  size="md"
                  leftIcon={<Compass size={16} aria-hidden="true" />}
                >
                  Explorar Projetos
                </Button>
              </a>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default NotFoundPage;
