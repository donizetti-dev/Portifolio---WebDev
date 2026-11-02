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
      'API REST em Python e Flask para coleta automatizada via Selenium, persistência em SQL Server e disponibilização de notícias do portal G1.',
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
    repoUrl: 'https://github.com/Doni-zete',
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
    repoName: 'trending-movies',
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
    repoUrl: 'https://github.com/Doni-zete',
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
    id: 'catalog-infrawatch-fiap',
    slug: 'infrawatch-fiap-global-solution',
    repoName: 'infrawatch',
    name: 'InfraWatch — FIAP Global Solution',
    shortDescription:
      'Sistema de monitoramento ambiental e análise de dados combinando telemetria de sensores e dados orbitais para prevenção de cenários de risco.',
    description:
      'Projeto acadêmico desenvolvido na Global Solution de Engenharia de Software da FIAP, focado no monitoramento preventivo de condições ambientais e infraestrutura crítica. A solução processa e correlaciona séries de dados provenientes de sensores terrestres e leituras orbitais em Python, gerando indicadores analíticos para apoio à tomada de decisão em cenários de risco climático.',
    problemStatement:
      'A ausência de correlação unificada entre leituras locais de sensores e indicadores ambientais macro dificulta a detecção precoce de anomalias e riscos em infraestruturas urbanas e ambientais.',
    architectureDecisions: [
      'Pipeline modular em Python para ingestão, limpeza (data cleansing) e normalização de múltiplas fontes de dados.',
      'Cálculo automatizado de limiares de alerta e consolidação de métricas estatísticas para identificação rápida de anomalias.',
      'Estruturação de relatórios analíticos reprodutíveis e exportáveis para integração com painéis de monitoramento.',
    ],
    language: 'Python',
    stack: ['Python', 'Pandas', 'Processamento de Dados', 'SQL', 'Análise Ambiental'],
    topics: ['python', 'data-analysis', 'fiap', 'global-solution', 'environmental-monitoring'],
    category: 'data-engineering',
    status: 'academic',
    repoUrl: 'https://github.com/Doni-zete',
    updatedAt: '2025-01-28T11:15:00Z',
    featuredByDefault: true,
    highlights: [
      'Projeto oficial FIAP Global Solution — Engenharia de Software',
      'Fusão de dados de sensores e indicadores orbitais em Python',
      'Modelagem analítica voltada à mitigação de cenários de risco',
    ],
  },
  {
    id: 'catalog-portifolio-webdev',
    slug: 'portifolio-webdev',
    repoName: 'Portifolio---WebDev',
    name: 'Portfólio Engenharia RPA & WebDev',
    shortDescription:
      'Aplicação SPA Monochrome High-Contrast em React 18, TypeScript, TanStack Query e Supabase com integração GitHub REST API e Dashboard Admin.',
    description:
      'Plataforma de portfólio profissional projetada com estética Monochrome High-Contrast + Electric Accent, combinando geometria 3D procedural leve em Canvas HTML5, consumo inteligente da API do GitHub com cache em memória via TanStack Query e camada de persistência híbrida (Supabase + Fallback automático em localStorage) para gestão de mensagens e curadoria de destaques.',
    problemStatement:
      'Portfólios estáticos exigem retrabalho constante de código para atualizar repositórios e não oferecem canal direto de gerenciamento de mensagens ou seleção dinâmica de projetos em destaque.',
    architectureDecisions: [
      'Gerenciamento de estado assíncrono com TanStack Query (staleTime de 10 minutos) + cache de contingência para eliminar chamadas repetidas à API do GitHub.',
      'Padrão Data Service Híbrido: opera conectando ao Supabase PostgreSQL quando configurado ou alterna de forma transparente para localStorage sem quebrar funcionalidades.',
      'Code-splitting via React.lazy para a rota administrativa (/dashboard) e para o componente Canvas 3D, assegurando alta performance mobile.',
    ],
    language: 'TypeScript',
    stack: ['React 18', 'TypeScript', 'Vite', 'TanStack Query', 'Supabase', 'Playwright'],
    topics: ['react', 'typescript', 'tanstack-query', 'supabase', 'playwright', 'portfolio'],
    category: 'fullstack',
    status: 'production',
    repoUrl: 'https://github.com/Doni-zete/Portifolio---WebDev',
    updatedAt: '2025-03-01T10:00:00Z',
    featuredByDefault: true,
    highlights: [
      'Design System Monochrome High-Contrast com Dark e Light Mode persistidos',
      'Integração híbrida GitHub API + Catálogo Extensível + Supabase',
      'Cobertura de testes E2E automatizados com Playwright',
    ],
  },
  {
    id: 'catalog-docflow-rpa-pipeline',
    slug: 'docflow-rpa-pipeline',
    repoName: 'docflow-rpa-pipeline',
    name: 'DocFlow ETL — Automação de Documentos & SQL',
    shortDescription:
      'Toolkit de engenharia em Python para extração automatizada de tabelas em PDFs e planilhas Excel com validação Pydantic e carga SQL.',
    description:
      'Solução de automação e processamento de documentos corporativos construída em Python, unindo PDFPlumber, OpenPyXL e Pandas para extrair tabelas complexas de arquivos PDF e planilhas operacionais. Aplica higienização determinística, validação de contratos de dados com Pydantic e persistência transacional em bancos relacionais.',
    problemStatement:
      'Processos financeiros e operacionais frequentemente dependem da digitação manual de dados contidos em centenas de documentos PDF e planilhas heterogêneas, gerando gargalos e erros humanos.',
    architectureDecisions: [
      'Extração especializada em duas camadas: PDFPlumber para documentos estruturados em PDF e OpenPyXL para manipulação avançada de workbooks Excel.',
      'Transformação e normalização tabular com Pandas aliada à validação estrita de tipos via Pydantic antes da persistência.',
      'Arquitetura extensível pronta para execução agendada via PowerShell ou orquestradores RPA.',
    ],
    language: 'Python',
    stack: ['Python', 'PDFPlumber', 'OpenPyXL', 'Pandas', 'Pydantic', 'SQL Server'],
    topics: ['python', 'rpa', 'etl', 'pdfplumber', 'openpyxl', 'pandas', 'sql-server'],
    category: 'automation-rpa',
    status: 'completed',
    repoUrl: 'https://github.com/Doni-zete',
    updatedAt: '2025-02-05T09:45:00Z',
    featuredByDefault: false,
    highlights: [
      'Parsing automatizado de relatórios PDF e planilhas Excel complexas',
      'Validação de integridade de dados com Pydantic e transformação com Pandas',
      'Pronto para integração com fluxos de RPA e bancos SQL',
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
