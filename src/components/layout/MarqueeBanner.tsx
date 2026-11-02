import React from 'react';
import styles from './MarqueeBanner.module.css';

const DEFAULT_KEYWORDS = [
  'PYTHON',
  'AUTOMAÇÃO RPA',
  'SELENIUM',
  'PLAYWRIGHT',
  'SQL SERVER',
  'FASTAPI & FLASK',
  'REACT & TYPESCRIPT',
  'AUTOMATE DESKTOP',
  'POWER AUTOMATE',
  'ENGENHARIA DE SOFTWARE',
];

export interface MarqueeBannerProps {
  items?: string[];
}

export const MarqueeBanner: React.FC<MarqueeBannerProps> = ({ items = DEFAULT_KEYWORDS }) => {
  const repeatedItems = [...items, ...items];

  return (
    <section className={styles.banner} aria-label="Principais tecnologias e especialidades">
      <div className={styles.track}>
        {repeatedItems.map((keyword, index) => {
          const isOutline = index % 2 === 1;
          return (
            <span
              key={`${keyword}-${index}`}
              className={`${styles.item} ${isOutline ? styles.outlined : styles.filled}`}
            >
              <span>{keyword}</span>
              <span className={styles.separator} aria-hidden="true">
                ✦
              </span>
            </span>
          );
        })}
      </div>
    </section>
  );
};
