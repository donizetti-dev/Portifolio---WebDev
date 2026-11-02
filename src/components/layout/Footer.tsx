import React from 'react';
import { Github, Shield } from 'lucide-react';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.info}>
          <span className={styles.name}>Donizetti Batista © {currentYear}</span>
          <span className={styles.role}>
            Analista de Automação RPA @ MV3 Tecnologia • Engenharia de Software @ FIAP
          </span>
        </div>

        <div className={styles.links}>
          <a
            href="https://github.com/donizetti-dev"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            <Github size={16} aria-hidden="true" />
            <span>github.com/donizetti-dev</span>
          </a>
          <a href="/dashboard" className={styles.link}>
            <Shield size={16} aria-hidden="true" />
            <span>Admin</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
