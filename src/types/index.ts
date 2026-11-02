/**
 * Contratos e Interfaces TypeScript — Camada de Dados do Portfólio
 * Seguindo a Seção 7 de `docs/specs/especificacao_geral.md`.
 */

export type ProjectCategory =
  'automation-rpa' | 'backend-api' | 'frontend-web' | 'data-engineering' | 'fullstack';

export type ProjectStatus = 'production' | 'completed' | 'in-progress' | 'academic';

/**
 * Payload bruto retornado pela API REST v3 do GitHub:
 * GET https://api.github.com/users/{username}/repos
 */
export interface GitHubRepoResponse {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  license: {
    key: string;
    name: string;
    spdx_id: string;
  } | null;
  topics?: string[];
  visibility?: string;
  default_branch: string;
}

/**
 * Entrada de curadoria manual em `src/config/projectsCatalog.ts`.
 * Permite adicionar novos cards ou enriquecer repositórios vindos do GitHub.
 */
export interface ProjectCatalogEntry {
  id: string;
  slug: string;
  repoName?: string;
  name: string;
  shortDescription: string;
  description: string;
  problemStatement: string;
  architectureDecisions: string[];
  language: string;
  stack: string[];
  topics: string[];
  category: ProjectCategory;
  status: ProjectStatus;
  repoUrl: string;
  homepageUrl?: string;
  updatedAt: string;
  featuredByDefault: boolean;
  highlights?: string[];
}

/**
 * Projeto enriquecido após mesclagem entre `projectsCatalog.ts` e a API do GitHub.
 * Compatível com `ProjectItem` definido na Seção 7.1 da especificação.
 */
export interface EnrichedProject {
  id: string;
  slug: string;
  repoName: string;
  name: string;
  shortDescription: string;
  description: string;
  problemStatement: string;
  architectureDecisions: string[];
  language: string;
  stack: string[];
  topics: string[];
  category: ProjectCategory;
  status: ProjectStatus;
  repoUrl: string;
  homepageUrl?: string;
  updatedAt: string;
  stargazersCount: number;
  forksCount: number;
  isFeatured: boolean;
  featuredByDefault: boolean;
  isFromGitHub: boolean;
  isCurated: boolean;
  highlights: string[];
}

/**
 * Alias de compatibilidade direta com a Seção 7.1 de `especificacao_geral.md`.
 */
export type ProjectItem = EnrichedProject;

/**
 * Modelo de mensagem de contato (`contact_messages` no Supabase / Fallback Local).
 * Mantém `is_replied` e `is_answered` sincronizados para máxima compatibilidade.
 */
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_replied: boolean;
  is_answered: boolean;
  is_important: boolean;
  created_at: string;
}

export interface CreateContactMessageInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type MessageFilter =
  'all' | 'replied' | 'unreplied' | 'answered' | 'unanswered' | 'important';

/**
 * Configurações persistidas do portfólio (`portfolio_settings` / `site_settings`).
 */
export interface PortfolioSettings {
  id: string;
  featured_project_slugs: string[];
  slugs: string[];
  updated_at: string;
}

export interface SkillItem {
  name: string;
  level: 'Especialista' | 'Avançado' | 'Prático';
  highlight?: boolean;
}

export interface SkillCategory {
  id: string;
  code: string;
  title: string;
  description: string;
  skills: string[];
  items: SkillItem[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  companyShortName: string;
  period: string;
  location: string;
  type: 'professional' | 'academic';
  current: boolean;
  summary: string;
  achievements: string[];
  technologies: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  period: string;
  status: string;
  description: string;
  focusAreas: string[];
}

export interface SocialLinks {
  github: string;
  githubUsername: string;
  linkedin: string;
  email: string;
  location: string;
}

export interface ProfileMetric {
  label: string;
  value: string;
  detail: string;
}

export interface ProfileData {
  name: string;
  displayName: string;
  handle: string;
  role: string;
  headline: string;
  subheadline: string;
  bio: string[];
  availabilityText: string;
  social: SocialLinks;
  experiences: ExperienceItem[];
  education: EducationItem[];
  skillCategories: SkillCategory[];
  metrics: ProfileMetric[];
}
