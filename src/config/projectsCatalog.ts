import type { ProjectCatalogEntry } from '../types';

/**
 * Normaliza qualquer nome de repositório ou título em um slug amigável para URL (`/portifolio/:slug`).
 */
export function toProjectSlug(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Catálogo centralizado de curadoria manual e extensão (`CUSTOM_PROJECTS_CATALOG`).
 *
 * Para adicionar um novo card no portfólio ou enriquecer um repositório vindo da API do GitHub:
 * basta incluir um novo objeto tipado neste array. A Home, a rota `/portifolio/:slug` e o
 * seletor de destaques do Dashboard reconhecerão o projeto automaticamente.
 */
export const CUSTOM_PROJECTS_CATALOG: ProjectCatalogEntry[] = [
  {
    id: 'catalog-news-scraper-api',
    slug: 'news-scraper-api',
    repoName: 'news-scraper-api',
    name: 'News Scraper API',
    shortDescription:
      'API REST em Python e Flask para coleta automatizada de notícias do portal G1 com Selenium, persistência em SQL Server e busca textual.',
    description:
      'API backend desenvolvida para coletar, higienizar, armazenar e disponibilizar notícias do portal G1 de forma estruturada. Combina automação de navegador com Selenium para extração resiliente de conteúdo dinâmico, persistência relacional em Microsoft SQL Server via pyodbc e endpoints RESTful para listagem, busca textual por título e consulta individual.',
    problemStatement:
      'Portais de notícias possuem carregamento dinâmico e estruturas de DOM mutáveis que dificultam a indexação e consulta histórica por sistemas internos de monitoramento de mídia e clipping corporativo.',
    architectureDecisions: [
      'Desacoplamento entre o coletor web (Selenium WebDriver em modo headless) e a camada de exposição HTTP (Flask REST API).',
      'Persistência relacional no Microsoft SQL Server via pyodbc com deduplicação por URL/título e indexação para buscas rápidas.',
      'Padronização de respostas JSON com tratamento de erros HTTP e filtros de pesquisa parametrizados por query string.',
    ],
    language: 'Python',
    stack: ['Python', 'Flask', 'Selenium', 'SQL Server', 'pyodbc', 'REST API'],
    topics: ['python', 'flask', 'selenium', 'sql-server', 'web-scraping', 'rest-api'],
    category: 'backend-api',
    status: 'completed',
    repoUrl: 'https://github.com/donizetti-dev/news-scraper-api',
    updatedAt: '2025-02-15T14:30:00Z',
    featuredByDefault: true,
    highlights: [
      'Coleta automatizada do portal G1 com Selenium e parsing resiliente',
      'Integração nativa com Microsoft SQL Server via pyodbc',
      'Endpoints REST para listagem geral, filtro por título e detalhe por ID',
    ],
  },
  {
    id: 'catalog-trending-movies',
    slug: 'trending-movies',
    repoName: 'Trending_Movie-React',
    name: 'Trending Movies',
    shortDescription:
      'Aplicação web em React para exploração de filmes e séries em alta consumindo a API oficial do TMDB com Spec-Driven Development.',
    description:
      'Aplicação web responsiva construída em React e JavaScript para descoberta de filmes e séries em tendência, consumindo dados em tempo real da API REST do TMDB (The Movie Database). Desenvolvida seguindo práticas de Spec-Driven Development (SDD), garantindo fidelidade de interface, estados de carregamento assíncronos e deploy contínuo na Vercel.',
    problemStatement:
      'Consumidores de catálogos de entretenimento precisam de uma interface rápida, sem ruído visual e responsiva para consultar lançamentos, avaliações técnicas e tendências globais diretamente da base do TMDB.',
    architectureDecisions: [
      'Adoção de Spec-Driven Development (SDD) para especificar contratos de componentes, estados de requisição e critérios de aceite antes da codificação.',
      'Camada de serviço dedicada para consumo da API REST do TMDB com tratamento de paginação, busca e fallback de imagens.',
      'Pipeline de entrega contínua (CI/CD) integrado à Vercel com otimização de assets estáticos.',
    ],
    language: 'JavaScript',
    stack: ['React', 'JavaScript', 'REST API', 'TMDB API', 'CSS3', 'Vercel'],
    topics: ['react', 'javascript', 'tmdb-api', 'rest-api', 'spec-driven-development', 'vercel'],
    category: 'frontend-web',
    status: 'production',
    repoUrl: 'https://github.com/donizetti-dev/Trending_Movie-React',
    homepageUrl: 'https://vercel.com',
    updatedAt: '2025-02-20T18:00:00Z',
    featuredByDefault: true,
    highlights: [
      'Arquitetura guiada por especificações (Spec-Driven Development)',
      'Consumo assíncrono da API REST do TMDB com filtros de tendência',
      'Interface responsiva publicada em produção na Vercel',
    ],
  },
  {
    id: 'catalog-infrawatch-terminal',
    slug: 'infrawatch-terminal',
    repoName: 'Infrawatch-Terminal',
    name: 'Terminal infrawatch',
    shortDescription:
      'Interface de terminal (CLI) em Python para monitoramento ambiental e análise de risco correlacionando telemetria e sensores (FIAP Global Solution).',
    description:
      'Aplicação de linha de comando (CLI/Terminal) desenvolvida em Python para o sistema InfraWatch no âmbito da Global Solution de Engenharia de Software da FIAP. Focada no monitoramento preventivo de condições ambientais e infraestrutura crítica, a ferramenta processa dados de telemetria e sensores diretamente no console, calculando limiares de risco e gerando alertas analíticos para apoio à tomada de decisão.',
    problemStatement:
      'Operadores técnicos e sistemas de monitoramento em campo necessitam de interfaces de console leves, resilientes e de rápida execução para acompanhar métricas de sensores e limiares de alerta ambiental sem dependência de navegadores ou ambientes gráficos.',
    architectureDecisions: [
      'Implementação orientada a CLI / Terminal em Python para execução leve, portátil e de baixo consumo de recursos.',
      'Módulo de processamento e normalização de dados de sensores terrestres e indicadores orbitais.',
      'Formatação estruturada no terminal com cálculo determinístico de limiares de alerta e relatórios de risco.',
    ],
    language: 'Python',
    stack: ['Python', 'CLI', 'Terminal', 'Processamento de Dados', 'Análise Ambiental'],
    topics: [
      'python',
      'cli',
      'terminal',
      'infrawatch',
      'fiap',
      'global-solution',
      'environmental-monitoring',
    ],
    category: 'data-engineering',
    status: 'academic',
    repoUrl: 'https://github.com/donizetti-dev/Infrawatch-Terminal',
    updatedAt: '2025-01-28T11:15:00Z',
    featuredByDefault: true,
    highlights: [
      'Interface de terminal (CLI) em Python para monitoramento de telemetria',
      'Projeto acadêmico oficial FIAP Global Solution — Engenharia de Software',
      'Cálculo de limiares de alerta e análise de cenários de risco',
    ],
  },
];

export const PROJECTS_CATALOG = CUSTOM_PROJECTS_CATALOG;

/**
 * Lista de slugs marcados como destaque inicial quando o administrador ainda não customizou via Dashboard.
 */
export const DEFAULT_FEATURED_PROJECT_SLUGS: string[] = CUSTOM_PROJECTS_CATALOG.filter(
  (project) => project.featuredByDefault
).map((project) => project.slug);

/**
 * Localiza uma entrada do catálogo correspondente a um repositório vindo do GitHub
 * (comparando por `repoName`, `slug` ou nome normalizado).
 */
export function findCatalogMatch(repoName: string): ProjectCatalogEntry | undefined {
  const normalizedRepoSlug = toProjectSlug(repoName);
  const lowerRepoName = repoName.trim().toLowerCase();

  return CUSTOM_PROJECTS_CATALOG.find((entry) => {
    const entryRepoLower = entry.repoName?.trim().toLowerCase();
    return (
      entryRepoLower === lowerRepoName ||
      entry.slug === normalizedRepoSlug ||
      toProjectSlug(entry.name) === normalizedRepoSlug
    );
  });
}
