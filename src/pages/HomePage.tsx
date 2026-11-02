import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';
import { ContactForm } from '../components/contact/ContactForm';
import { ExperienceSection } from '../components/home/ExperienceSection';
import { HeroSection } from '../components/home/HeroSection';
import { SkillsSection } from '../components/home/SkillsSection';
import { MarqueeBanner } from '../components/layout/MarqueeBanner';
import { ProjectsGrid } from '../components/projects/ProjectsGrid';
import { Card } from '../components/ui/Card';
import { PROFILE_DATA } from '../config/profileData';
import styles from './HomePage.module.css';

export const HomePage: React.FC = () => {
  const { social } = PROFILE_DATA;

  return (
    <>
      <HeroSection />
      <MarqueeBanner />
      <ExperienceSection />
      <SkillsSection />
      <ProjectsGrid />

      <section
        id="contato"
        className={styles.contactAnchorSection}
        aria-labelledby="contact-heading"
      >
        <div className="container">
          <Card as="article" padding="lg">
            <div className={styles.contactCard}>
              <div className={styles.contactIntro}>
                <span className={styles.codeLabel}>04 // CANAL DIRETO</span>
                <h2 id="contact-heading" className={styles.contactTitle}>
                  VAMOS CONVERSAR <span className="text-outline">SOBRE ENGENHARIA</span>
                </h2>
                <p className={styles.contactText}>
                  Disponível para conexões profissionais e discussões técnicas sobre Automação RPA,
                  APIs em Python, integração com bancos SQL e desenvolvimento web em
                  React/TypeScript.
                </p>
                <div className={styles.channelsRow}>
                  <a href={`mailto:${social.email}`} className={styles.channelLink}>
                    <Mail size={15} aria-hidden="true" />
                    <span>{social.email}</span>
                  </a>
                  <a
                    href={social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.channelLink}
                  >
                    <Linkedin size={15} aria-hidden="true" />
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href={social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.channelLink}
                  >
                    <Github size={15} aria-hidden="true" />
                    <span>GitHub ({social.githubUsername})</span>
                  </a>
                </div>
              </div>

              <div className={styles.contactDivider} aria-hidden="true" />

              <ContactForm />
            </div>
          </Card>
        </div>
      </section>
    </>
  );
};

export default HomePage;
