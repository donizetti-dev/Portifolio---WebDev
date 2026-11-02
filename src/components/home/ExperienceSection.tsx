import React from 'react';
import { Briefcase, GraduationCap, ShieldCheck } from 'lucide-react';
import { PROFILE_DATA } from '../../config/profileData';
import { useSpotlight } from '../../hooks/useSpotlight';
import type { ExperienceItem } from '../../types';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import styles from './ExperienceSection.module.css';

interface ExperienceCardProps {
  item: ExperienceItem;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ item }) => {
  const { ref, handlers } = useSpotlight<HTMLDivElement>({ maxTilt: 2.5 });
  const isProfessional = item.type === 'professional';

  return (
    <div ref={ref} {...handlers} className={styles.expCard}>
      <Card as="article" padding="lg" interactive className={styles.cardContent}>
        <header className={styles.cardHeader}>
          <div className={styles.metaRow}>
            <Badge variant={isProfessional ? 'electric' : 'outline'}>
              {isProfessional ? (
                <>
                  <Briefcase size={12} aria-hidden="true" />
                  <span>Engenharia Corporativa • RPA</span>
                </>
              ) : (
                <>
                  <GraduationCap size={12} aria-hidden="true" />
                  <span>Formação Acadêmica • SWE</span>
                </>
              )}
            </Badge>
            <span className={styles.period}>
              {item.period} • {item.location}
            </span>
          </div>

          <h3 className={styles.roleTitle}>{item.role}</h3>
          <p className={styles.companyName}>
            <ShieldCheck size={15} aria-hidden="true" />
            <span>{item.company}</span>
          </p>
        </header>

        <p className={styles.summary}>{item.summary}</p>

        <ul className={styles.achievementsList}>
          {item.achievements.map((achievement) => (
            <li key={achievement} className={styles.achievementItem}>
              <span className={styles.bullet} aria-hidden="true">
                ▹
              </span>
              <span>{achievement}</span>
            </li>
          ))}
        </ul>

        <footer className={styles.techStack} aria-label="Tecnologias aplicadas">
          {item.technologies.map((tech) => (
            <Badge key={tech} variant="default">
              {tech}
            </Badge>
          ))}
        </footer>
      </Card>
    </div>
  );
};

export const ExperienceSection: React.FC = () => {
  const { bio, experiences, education } = PROFILE_DATA;
  const primaryEdu = education[0];

  return (
    <section id="experiencia" className={styles.section} aria-labelledby="experience-heading">
      <div className="container">
        <header className={styles.sectionHeader}>
          <span className={styles.codeLabel}>01 // TRAJETÓRIA & ENGENHARIA</span>
          <h2 id="experience-heading" className={styles.sectionTitle}>
            EXPERIÊNCIA <span className="text-outline">& FORMAÇÃO</span>
          </h2>
        </header>

        <div className={styles.bioGrid}>
          {bio.map((paragraph, index) => (
            <p key={index} className={styles.bioParagraph}>
              {paragraph}
            </p>
          ))}
        </div>

        <div className={styles.timelineGrid}>
          {experiences.map((exp) => (
            <ExperienceCard key={exp.id} item={exp} />
          ))}
        </div>

        {primaryEdu && (
          <div className={styles.educationBanner}>
            <Card as="article" padding="md">
              <div className={styles.eduInner}>
                <div className={styles.eduHeader}>
                  <div className={styles.eduTitleGroup}>
                    <GraduationCap size={20} aria-hidden="true" />
                    <h3 className={styles.eduTitle}>
                      {primaryEdu.degree} — {primaryEdu.institution}
                    </h3>
                  </div>
                  <Badge variant="success">{primaryEdu.status}</Badge>
                </div>

                <div className={styles.focusGrid}>
                  {primaryEdu.focusAreas.map((area) => (
                    <div key={area} className={styles.focusChip}>
                      {area}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

export default ExperienceSection;
