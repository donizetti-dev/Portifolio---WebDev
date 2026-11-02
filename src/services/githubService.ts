import {
  CUSTOM_PROJECTS_CATALOG,
  DEFAULT_FEATURED_PROJECT_SLUGS,
  findCatalogMatch,
  toProjectSlug,
} from '../config/projectsCatalog';
import type {
  EnrichedProject,
  GitHubRepoResponse,
  ProjectCatalogEntry,
  ProjectCategory,
} from '../types';

const DEFAULT_GITHUB_USERNAME = 'donizetti-dev';
const SESSION_CACHE_KEY = 'donizetti_portfolio_github_repos_cache_v1';

export class GitHubApiError extends Error {
  public readonly status?: number;
  public readonly isRateLimit: boolean;

  constructor(message: string, status?: number, isRateLimit = false) {
    super(message);
    this.name = 'GitHubApiError';
    this.status = status;
    this.isRateLimit = isRateLimit;
  }
}

/**
 * Obtém o username configurado via variável de ambiente `VITE_GITHUB_USERNAME`
 * com fallback seguro para `donizetti-dev`.
 */
export function getGitHubUsername(): string {
  const envUser = import.meta.env.VITE_GITHUB_USERNAME;
  if (typeof envUser === 'string' && envUser.trim().length > 0) {
    return envUser.trim();
  }
  return DEFAULT_GITHUB_USERNAME;
}

/**
 * Infere a categoria técnica de um repositório do GitHub com base na linguagem e tópicos.
 */
export function inferCategoryFromRepo(
  language: string | null,
  topics: string[] = []
): ProjectCategory {
  const normalizedLang = (language || '').toLowerCase();
  const normalizedTopics = topics.map((t) => t.toLowerCase());

  if (
    normalizedTopics.some((t) =>
      ['rpa', 'selenium', 'playwright', 'automation', 'scraping', 'web-scraping'].includes(t)
    )
  ) {
    return 'automation-rpa';
  }

  if (
    normalizedTopics.some((t) => ['pandas', 'etl', 'data-science', 'data-analysis'].includes(t))
  ) {
    return 'data-engineering';
  }

  if (
    ['typescript', 'javascript', 'html', 'css'].includes(normalizedLang) ||
    normalizedTopics.some((t) => ['react', 'frontend', 'vite', 'web'].includes(t))
  ) {
    return 'frontend-web';
  }

  if (['python', 'sql', 'c#', 'java', 'go'].includes(normalizedLang)) {
    return 'backend-api';
  }

  return 'fullstack';
}

/**
 * Converte uma entrada do catálogo local em `EnrichedProject`, opcionalmente mesclando
 * com dados dinâmicos vindos da API do GitHub.
 */
function createEnrichedFromCatalog(
  entry: ProjectCatalogEntry,
  repo?: GitHubRepoResponse,
  featuredSlugs: string[] = DEFAULT_FEATURED_PROJECT_SLUGS
): EnrichedProject {
  const mergedTopics = Array.from(new Set([...entry.topics, ...(repo?.topics ?? [])]));
  const mergedLanguage = repo?.language || entry.language;
  const mergedStack = Array.from(
    new Set([...entry.stack, ...(mergedLanguage ? [mergedLanguage] : [])])
  );

  const homepage =
    repo?.homepage && repo.homepage.trim().length > 0 ? repo.homepage.trim() : entry.homepageUrl;

  return {
    id: repo ? `gh-${repo.id}` : entry.id,
    slug: entry.slug,
    repoName: repo?.name || entry.repoName || entry.slug,
    name: entry.name,
    shortDescription: entry.shortDescription || repo?.description || entry.description,
    description: entry.description || repo?.description || entry.shortDescription,
    problemStatement: entry.problemStatement,
    architectureDecisions: entry.architectureDecisions,
    language: mergedLanguage,
    stack: mergedStack,
    topics: mergedTopics,
    category: entry.category,
    status: entry.status,
    repoUrl: repo?.html_url || entry.repoUrl,
    homepageUrl: homepage,
    updatedAt: repo?.updated_at || entry.updatedAt,
    stargazersCount: repo?.stargazers_count ?? 0,
    forksCount: repo?.forks_count ?? 0,
    isFeatured: featuredSlugs.includes(entry.slug),
    featuredByDefault: entry.featuredByDefault,
    isFromGitHub: Boolean(repo),
    isCurated: true,
    highlights: entry.highlights ?? [],
  };
}

/**
 * Converte um repositório público do GitHub que não está no catálogo manual
 * em um `EnrichedProject` completo para exibição automática nos cards e na página de detalhe.
 */
export function createEnrichedFromGitHubRepo(
  repo: GitHubRepoResponse,
  featuredSlugs: string[] = DEFAULT_FEATURED_PROJECT_SLUGS
): EnrichedProject {
  const slug = toProjectSlug(repo.name);
  const language = repo.language || ' Código';
  const topics = repo.topics && repo.topics.length > 0 ? repo.topics : [language.toLowerCase()];
  const category = inferCategoryFromRepo(repo.language, repo.topics);
  const defaultDesc =
    repo.description && repo.description.trim().length > 0
      ? repo.description.trim()
      : `Repositório público desenvolvido em ${language} mantido no GitHub por Donizetti Batista.`;

  const stack = Array.from(
    new Set([
      ...(repo.language ? [repo.language] : []),
      ...(repo.topics ?? []).slice(0, 5).map((topic) => topic.toUpperCase()),
    ])
  );

  return {
    id: `gh-${repo.id}`,
    slug,
    repoName: repo.name,
    name: repo.name.replace(/[-_]+/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    shortDescription: defaultDesc,
    description: defaultDesc,
    problemStatement:
      'Projeto técnico desenvolvido para resolver desafios práticos de engenharia de software, automação e integração de sistemas.',
    architectureDecisions: [
      `Implementação principal em ${language} seguindo boas práticas de organização modular e versionamento Git.`,
      'Código-fonte aberto e documentado diretamente no repositório oficial do GitHub.',
    ],
    language: language.trim(),
    stack: stack.length > 0 ? stack : ['Git', 'GitHub'],
    topics,
    category,
    status: 'completed',
    repoUrl: repo.html_url,
    homepageUrl:
      repo.homepage && repo.homepage.trim().length > 0 ? repo.homepage.trim() : undefined,
    updatedAt: repo.updated_at || repo.pushed_at || repo.created_at,
    stargazersCount: repo.stargazers_count ?? 0,
    forksCount: repo.forks_count ?? 0,
    isFeatured: featuredSlugs.includes(slug),
    featuredByDefault: false,
    isFromGitHub: true,
    isCurated: false,
    highlights: [
      `Linguagem principal: ${language.trim()}`,
      `Repositório sincronizado automaticamente via GitHub REST API`,
    ],
  };
}

/**
 * Retorna os projetos do catálogo local já formatados como `EnrichedProject[]`.
 * Útil como fallback imediato ou catálogo base.
 */
export function getCatalogAsEnrichedProjects(
  featuredSlugs: string[] = DEFAULT_FEATURED_PROJECT_SLUGS
): EnrichedProject[] {
  return CUSTOM_PROJECTS_CATALOG.map((entry) =>
    createEnrichedFromCatalog(entry, undefined, featuredSlugs)
  );
}

/**
 * Mescla os repositórios dinâmicos vindos do GitHub com o catálogo extensível (`projectsCatalog.ts`).
 */
export function mergeGitHubWithCatalog(
  repos: GitHubRepoResponse[],
  featuredSlugs: string[] = DEFAULT_FEATURED_PROJECT_SLUGS
): EnrichedProject[] {
  const matchedCatalogSlugs = new Set<string>();
  const enrichedFromGitHub: EnrichedProject[] = [];

  const validRepos = repos.filter((repo) => !repo.disabled && !repo.archived);

  for (const repo of validRepos) {
    const catalogMatch = findCatalogMatch(repo.name);

    if (catalogMatch) {
      matchedCatalogSlugs.add(catalogMatch.slug);
      enrichedFromGitHub.push(createEnrichedFromCatalog(catalogMatch, repo, featuredSlugs));
    }
    // Restrição estrita (R2): apenas os 3 projetos reais aprovados no catálogo são exibidos
  }

  const remainingCatalogProjects = CUSTOM_PROJECTS_CATALOG.filter(
    (entry) => !matchedCatalogSlugs.has(entry.slug)
  ).map((entry) => createEnrichedFromCatalog(entry, undefined, featuredSlugs));

  const combined = [...enrichedFromGitHub, ...remainingCatalogProjects];

  return combined.sort((a, b) => {
    if (a.isFeatured !== b.isFeatured) {
      return a.isFeatured ? -1 : 1;
    }
    if (a.isCurated !== b.isCurated) {
      return a.isCurated ? -1 : 1;
    }
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

function saveReposToSessionCache(repos: GitHubRepoResponse[]): void {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(repos));
    }
  } catch {
    // Ignora falhas de quota de sessionStorage silenciosamente
  }
}

function loadReposFromSessionCache(): GitHubRepoResponse[] | null {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const raw = window.sessionStorage.getItem(SESSION_CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed)) {
          return parsed as GitHubRepoResponse[];
        }
      }
    }
  } catch {
    // Ignora cache corrompido
  }
  return null;
}

/**
 * Busca os repositórios públicos na API REST v3 do GitHub (`users/{username}/repos`)
 * e realiza o merge com `projectsCatalog.ts`.
 *
 * Em caso de erro HTTP ou falha de rede, lança `GitHubApiError` com mensagem amigável (RF03/RF04)
 * para que o TanStack Query gerencie os estados `isError`, `error` e `refetch`.
 */
export async function fetchGitHubProjects(
  featuredSlugs: string[] = DEFAULT_FEATURED_PROJECT_SLUGS,
  username: string = getGitHubUsername()
): Promise<EnrichedProject[]> {
  const endpoint = `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=100`;

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github+json',
      },
    });
  } catch {
    throw new GitHubApiError(
      'Ops, tivemos um problema para carregar alguns dados, nossos devs já estão trabalhando nisso!'
    );
  }

  if (!response.ok) {
    const isRateLimit =
      response.status === 403 ||
      response.status === 429 ||
      response.headers.get('x-ratelimit-remaining') === '0';

    if (isRateLimit) {
      const cachedRepos = loadReposFromSessionCache();
      if (cachedRepos && cachedRepos.length > 0) {
        return mergeGitHubWithCatalog(cachedRepos, featuredSlugs);
      }
    }

    throw new GitHubApiError(
      'Ops, tivemos um problema para carregar alguns dados, nossos devs já estão trabalhando nisso!',
      response.status,
      isRateLimit
    );
  }

  const data = (await response.json()) as unknown;
  if (!Array.isArray(data)) {
    throw new GitHubApiError(
      'Ops, tivemos um problema para carregar alguns dados, nossos devs já estão trabalhando nisso!'
    );
  }

  const repos = data as GitHubRepoResponse[];
  saveReposToSessionCache(repos);

  return mergeGitHubWithCatalog(repos, featuredSlugs);
}

/**
 * Busca um único projeto enriquecido pelo `slug` a partir de uma lista já carregada
 * ou diretamente do catálogo local.
 */
export function findProjectBySlug(
  slug: string,
  projects?: EnrichedProject[]
): EnrichedProject | undefined {
  const normalized = toProjectSlug(slug);
  const source = projects && projects.length > 0 ? projects : getCatalogAsEnrichedProjects();
  return source.find((project) => project.slug === normalized);
}
