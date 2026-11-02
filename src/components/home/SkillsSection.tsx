import React from 'react';
import { PROFILE_DATA } from '../../config/profileData';
import { useSpotlight } from '../../hooks/useSpotlight';
import type { SkillCategory } from '../../types';
import { Card } from '../ui/Card';
import styles from './SkillsSection.module.css';

interface SkillCategoryCardProps {
  category: SkillCategory;
}

const SkillCategoryCard: React.FC<SkillCategoryCardProps> = ({ category }) => {
  const { ref, handlers } = useSpotlight<HTMLDivElement>({ maxTilt: 3.5 });

  return (
    <div ref={ref} {...handlers} className={styles.skillCardWrapper}>
      <Card as="article" padding="md" interactive className={styles.cardBody}>
        <div className={styles.cardTop}>
          <span className={styles.categoryCode}>{category.code}</span>
          <span className={styles.countBadge}>{category.items.length} SKILLS</span>
        </div>

        <div>
          <h3 className={styles.categoryTitle}>{category.title}</h3>
          <p className={styles.categoryDesc}>{category.description}</p>
        </div>

        <ul className={styles.itemsList} aria-label={`Competências em ${category.title}`}>
          {category.items.map((item) => (
            <li
              key={item.name}
              className={`${styles.skillRow} ${item.highlight ? styles.skillRowHighlight : ''}`}
            >
              <span className={styles.skillName}>
                {item.highlight && <span className={styles.highlightDot} aria-hidden="true" />}
                <span>{item.name}</span>
              </span>
              <span className={styles.skillLevel}>{item.level}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export const SkillsSection: React.FC = () => {
  const { skillCategories } = PROFILE_DATA;

  return (
    <section id="skills" className={styles.section} aria-labelledby="skills-heading">
      <div className="container">
        <header className={styles.sectionHeader}>
          <span className={styles.codeLabel}>02 // ARSENAL TÉCNICO</span>
          <h2 id="skills-heading" className={styles.sectionTitle}>
            MATRIZ DE <span className="text-outline">COMPETÊNCIAS</span>
          </h2>
          <p className={styles.subtitle}>
            Ecossistema de linguagens, ferramentas de Automação RPA, engenharia de dados, bancos
            relacionais e frameworks web utilizados em projetos de produção e acadêmicos.
          </p>
        </header>

        <div className={styles.categoriesGrid}>
          {skillCategories.map((category) => (
            <SkillCategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
