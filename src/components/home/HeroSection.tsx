import React, { Suspense, lazy } from 'react';
import { ArrowDownRight, ExternalLink, Github, Linkedin, Terminal } from 'lucide-react';
import { PROFILE_DATA } from '../../config/profileData';
import { Badge } from '../ui/Badge';
import styles from './HeroSection.module.css';

const HeroCanvas3D = lazy(() => import('./HeroCanvas3D'));

export const HeroSection: React.FC = () => {
  const { headline, subheadline, availabilityText, social, metrics } = PROFILE_DATA;

  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.content}>
            <div className={styles.eyebrowRow}>
              <Badge variant="electric">
                <Terminal size={12} aria-hidden="true" />
                <span>{availabilityText}</span>
              </Badge>
              <span className={styles.locationTag}>{social.location}</span>
            </div>

            <h1 id="hero-heading" className={styles.title}>
              DONIZETTI <span className={`text-outline ${styles.titleAccent}`}>BATISTA</span>
            </h1>

            <p className={styles.headline}>{headline}</p>

            <p className={styles.subtitle}>{subheadline}</p>

            <div className={styles.ctaGroup}>
              <a href="#projetos" className={`${styles.ctaLink} ${styles.ctaPrimary}`}>
                <span>Explorar Projetos</span>
                <ArrowDownRight size={17} aria-hidden="true" />
              </a>

              <a href="#contato" className={`${styles.ctaLink} ${styles.ctaSecondary}`}>
                <span>Entrar em Contato</span>
              </a>

              <div className={styles.socialLinks}>
                <a
                  href={social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.iconLink}
                  aria-label="Perfil de Donizetti Batista no GitHub"
                >
                  <Github size={16} aria-hidden="true" />
                  <span>GitHub</span>
                  <ExternalLink size={12} aria-hidden="true" />
                </a>

                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.iconLink}
                  aria-label="Perfil de Donizetti Batista no LinkedIn"
                >
                  <Linkedin size={16} aria-hidden="true" />
                  <span>LinkedIn</span>
                  <ExternalLink size={12} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          <div className={styles.canvasColumn}>
            <Suspense
              fallback={
                <div
                  className={styles.canvasFallback}
                  role="status"
                  aria-label="Carregando malha 3D"
                >
                  <span>[INICIALIZANDO MALHA 3D...]</span>
                </div>
              }
            >
              <HeroCanvas3D />
            </Suspense>
          </div>
        </div>

        <div className={styles.metricsGrid} aria-label="Destaques profissionais">
          {metrics.map((metric) => (
            <article key={metric.label} className={styles.metricCard}>
              <span className={styles.metricLabel}>{metric.label}</span>
              <strong className={styles.metricValue}>{metric.value}</strong>
              <p className={styles.metricDetail}>{metric.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
