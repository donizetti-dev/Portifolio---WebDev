import React from 'react';
import { Terminal } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <a href="/" className={styles.brand} aria-label="Donizetti Batista — Início">
          <Terminal size={20} aria-hidden="true" />
          <span>DONIZETTI.DEV</span>
          <span className={styles.brandAccent}>RPA & SWE</span>
        </a>

        <nav className={styles.nav} aria-label="Navegação principal">
          <ul className={styles.navList}>
            <li>
              <a href="/#experiencia" className={styles.navLink}>
                01.Experiência
              </a>
            </li>
            <li>
              <a href="/#skills" className={styles.navLink}>
                02.Skills
              </a>
            </li>
            <li>
              <a href="/#projetos" className={styles.navLink}>
                03.Projetos
              </a>
            </li>
            <li>
              <a href="/#contato" className={styles.navLink}>
                04.Contato
              </a>
            </li>
            <li>
              <a href="/dashboard" className={styles.navLink}>
                Dashboard
              </a>
            </li>
          </ul>

          <div className={styles.actions}>
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
};
