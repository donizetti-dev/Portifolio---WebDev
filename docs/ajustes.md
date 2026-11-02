# Relatório de Ajustes e Reformulação do Portfólio

**Data**: 02 de Novembro de 2026  
**Autor**: Donizetti Batista (`donizetti-dev`)  
**Workspace**: `c:\VS_Doni\PORTIFOLIO\Portifolio---WebDev`  
**Escopo**: Correção de Links de Contato (R1), Reformulação Exclusiva de Projetos (R2), Documentação Técnica (R3) e Verificação de Qualidade.

---

## 1. Resumo Executivo das Alterações

O objetivo desta intervenção foi saneamento, padronização e atualização integral do site de portfólio profissional de Donizetti Batista, eliminando inconsistências de identificação e garantindo que o catálogo de projetos reflita única e fielmente a produção técnica do desenvolvedor.

As seguintes diretrizes estruturantes foram rigorosamente cumpridas:
1. **Padronização da Identidade Digital e Contatos**: Centralização e correção de todos os canais de contato e redes profissionais (LinkedIn, GitHub e E-mail pessoal/profissional), eliminando menções legadas ou divergentes.
2. **Curadoria Estrita e Purga de Projetos**: Remoção total de projetos conceituais/fictícios e auto-referenciais, restringindo a exibição do portfólio aos **3 projetos reais oficiais** desenvolvidos pelo autor (`news-scraper-api`, `Trending_Movie-React` e `Infrawatch-Terminal`), com metadados fiéis extraídos de suas fontes autorais e repositórios no GitHub.
3. **Endurecimento da Camada de Integração GitHub**: Implementação de whitelist estrita no serviço de mesclagem (`githubService.ts`), impedindo que outros repositórios públicos não autorizados sejam injetados dinamicamente nos cards da interface.
4. **Alinhamento da Suíte de Testes e Qualidade**: Sincronização dos testes end-to-end com o novo catálogo curado de 3 projetos, mantendo 100% de aprovação no linter (`ESLint 9`) e na compilação do TypeScript/Vite (`tsc -b && vite build`).
5. **Preservação Visual Absoluta**: Preservação integral do design system *Monochrome High-Contrast + Electric Accent*, incluindo efeitos de Tilt 3D, Spotlight, Split-Reveal e responsividade em grid.

---

## 2. Correção de Links e Informações de Contato

Todos os pontos de contato foram atualizados na fonte primária de verdade (`src/config/profileData.ts`) e no serviço de integração (`src/services/githubService.ts`). Os componentes visuais da aplicação (`HeroSection.tsx`, `HomePage.tsx` e `Footer.tsx`) consom essas propriedades dinamicamente, garantindo consistência em toda a interface.

### Tabela De / Para — Dados de Contato e Perfis

| Canal / Propriedade | Valor Anterior (Legado) | Novo Valor Oficial (Atualizado) | Componentes / Módulos Afetados |
| :--- | :--- | :--- | :--- |
| **GitHub Handle** | `'Doni-zete'` | `'donizetti-dev'` | `src/config/profileData.ts` (`handle`) |
| **GitHub Perfil URL** | `https://github.com/Doni-zete` | `https://github.com/donizetti-dev` | `profileData.ts`, `HeroSection.tsx`, `HomePage.tsx`, `Footer.tsx` |
| **GitHub Username** | `'Doni-zete'` | `'donizetti-dev'` | `profileData.ts`, `HomePage.tsx` |
| **GitHub API Fallback** | `'Doni-zete'` | `'donizetti-dev'` | `src/services/githubService.ts` (`DEFAULT_GITHUB_USERNAME`) |
| **LinkedIn URL** | `https://www.linkedin.com/in/donizetti-junior-a52336195/` | `https://www.linkedin.com/in/donizetti-dev` | `profileData.ts`, `HeroSection.tsx`, `HomePage.tsx` |
| **E-mail de Contato** | `'contato@donizetti.dev'` | `'donizettibatista1@gmail.com'` | `profileData.ts`, `HomePage.tsx` (exibição e link `mailto:`) |

### Impacto e Validação dos Links de Contato:
- **LinkedIn**: O link agora direciona diretamente para o vanity URL oficial `https://www.linkedin.com/in/donizetti-dev`, aberto em nova aba com atributos de segurança `target="_blank"` e `rel="noopener noreferrer"`.
- **GitHub**: O perfil aponta para `https://github.com/donizetti-dev`, harmonizado com o rodapé do site (`Footer.tsx`), com a seção Hero e com a seção de Contato.
- **E-mail**: O endereço exibido no rodapé da página inicial e o gatilho `mailto:` disparam mensagens para `donizettibatista1@gmail.com`.
- **Isolamento de Credenciais Administrativas**: As credenciais demonstrativas do Dashboard administrativo (`admin@donizetti.dev` / `Admin@2026!`) foram mantidas segregadas no módulo de autenticação interna (`AuthContext.tsx`), não interferindo no e-mail de contato público do autor.

---

## 3. Reformulação da Seção de Projetos

Em conformidade estrita com o requisito **R2**, a seção de projetos foi reformulada para exibir única e exclusivamente os 3 projetos reais desenvolvidos por Donizetti Batista.

### 3.1 Projetos Removidos da Base de Código e Interface

| Identificador do Catálogo | Slug | Nome do Projeto | Justificativa Técnica da Remoção |
| :--- | :--- | :--- | :--- |
| `catalog-portifolio-webdev` | `portifolio-webdev` | Portfólio Engenharia RPA & WebDev | **Removido**: Projeto auto-referencial que hospedava a própria aplicação do portfólio. Não faz parte do conjunto restrito dos 3 repositórios técnicos solicitados. |
| `catalog-docflow-rpa-pipeline` | `docflow-rpa-pipeline` | DocFlow ETL — Automação de Documentos & SQL | **Removido**: Projeto mock/fictício que não possui repositório real associado na conta do usuário no GitHub. |

### 3.2 Projetos Mantidos e Configurados com Fidelidade aos Repositórios Oficiais

Cada um dos 3 projetos remanescentes foi configurado com seus dados técnicos reais, tecnologias comprovadas, arquitetura e URLs oficiais:

#### 1. News Scraper API
- **Identificador**: `catalog-news-scraper-api`
- **Slug**: `news-scraper-api`
- **Repo Name (GitHub)**: `news-scraper-api`
- **Nome Oficial**: `News Scraper API`
- **URL do Repositório**: `https://github.com/donizetti-dev/news-scraper-api`
- **Categoria**: `backend-api` (Backend & API)
- **Status**: `completed`
- **Linguagem Principal**: `Python`
- **Stack Técnica Real**: `['Python', 'Flask', 'Selenium', 'SQL Server', 'pyodbc', 'REST API']`
- **Tópicos**: `['python', 'flask', 'selenium', 'sql-server', 'web-scraping', 'rest-api']`
- **Descrição Curta**:  
  *API REST em Python e Flask para coleta automatizada de notícias do portal G1 com Selenium, persistência em SQL Server e busca textual.*
- **Descrição Completa**:  
  *API backend desenvolvida para coletar, higienizar, armazenar e disponibilizar notícias do portal G1 de forma estruturada. Combina automação de navegador com Selenium para extração resiliente de conteúdo dinâmico, persistência relacional em Microsoft SQL Server via pyodbc e endpoints RESTful para listagem, busca textual por título e consulta individual.*
- **Decisões Arquiteturais**:
  1. Desacoplamento entre o coletor web (Selenium WebDriver em modo headless) e a camada de exposição HTTP (Flask REST API).
  2. Persistência relacional no Microsoft SQL Server via pyodbc com deduplicação por URL/título e indexação para buscas rápidas.
  3. Padronização de respostas JSON com tratamento de erros HTTP e filtros de pesquisa parametrizados por query string.
- **Destaques**:
  - Coleta automatizada do portal G1 com Selenium e parsing resiliente
  - Integração nativa com Microsoft SQL Server via pyodbc
  - Endpoints REST para listagem geral, filtro por título e detalhe por ID
- **Destaque Inicial (featuredByDefault)**: `true`

---

#### 2. Trending Movies
- **Identificador**: `catalog-trending-movies`
- **Slug**: `trending-movies`
- **Repo Name (GitHub)**: `Trending_Movie-React`
- **Nome Oficial**: `Trending Movies`
- **URL do Repositório**: `https://github.com/donizetti-dev/Trending_Movie-React`
- **Categoria**: `frontend-web` (Front-End Web)
- **Status**: `production`
- **Linguagem Principal**: `JavaScript`
- **Stack Técnica Real**: `['React', 'JavaScript', 'REST API', 'TMDB API', 'CSS3', 'Vercel']`
- **Tópicos**: `['react', 'javascript', 'tmdb-api', 'rest-api', 'spec-driven-development', 'vercel']`
- **Descrição Curta**:  
  *Aplicação web em React para exploração de filmes e séries em alta consumindo a API oficial do TMDB com Spec-Driven Development.*
- **Descrição Completa**:  
  *Aplicação web responsiva construída em React e JavaScript para descoberta de filmes e séries em tendência, consumindo dados em tempo real da API REST do TMDB (The Movie Database). Desenvolvida seguindo práticas de Spec-Driven Development (SDD), garantindo fidelidade de interface, estados de carregamento assíncronos e deploy contínuo na Vercel.*
- **Decisões Arquiteturais**:
  1. Adoção de Spec-Driven Development (SDD) para especificar contratos de componentes, estados de requisição e critérios de aceite antes da codificação.
  2. Camada de serviço dedicada para consumo da API REST do TMDB com tratamento de paginação, busca e fallback de imagens.
  3. Pipeline de entrega contínua (CI/CD) integrado à Vercel com otimização de assets estáticos.
- **Destaques**:
  - Arquitetura guiada por especificações (Spec-Driven Development)
  - Consumo assíncrono da API REST do TMDB com filtros de tendência
  - Interface responsiva publicada em produção na Vercel
- **Deploy / Demo**: `https://vercel.com`
- **Destaque Inicial (featuredByDefault)**: `true`

---

#### 3. Terminal infrawatch
- **Identificador**: `catalog-infrawatch-terminal`
- **Slug**: `infrawatch-terminal`
- **Repo Name (GitHub)**: `Infrawatch-Terminal`
- **Nome Oficial**: `Terminal infrawatch`
- **URL do Repositório**: `https://github.com/donizetti-dev/Infrawatch-Terminal`
- **Categoria**: `data-engineering` (Dados & ETL)
- **Status**: `academic`
- **Linguagem Principal**: `Python`
- **Stack Técnica Real**: `['Python', 'CLI', 'Terminal', 'Processamento de Dados', 'Análise Ambiental']`
- **Tópicos**: `['python', 'cli', 'terminal', 'infrawatch', 'fiap', 'global-solution', 'environmental-monitoring']`
- **Descrição Curta**:  
  *Interface de terminal (CLI) em Python para monitoramento ambiental e análise de risco correlacionando telemetria e sensores (FIAP Global Solution).*
- **Descrição Completa**:  
  *Aplicação de linha de comando (CLI/Terminal) desenvolvida em Python para o sistema InfraWatch no âmbito da Global Solution de Engenharia de Software da FIAP. Focada no monitoramento preventivo de condições ambientais e infraestrutura crítica, a ferramenta processa dados de telemetria e sensores diretamente no console, calculando limiares de risco e gerando alertas analíticos para apoio à tomada de decisão.*
- **Decisões Arquiteturais**:
  1. Implementação orientada a CLI / Terminal em Python para execução leve, portátil e de baixo consumo de recursos.
  2. Módulo de processamento e normalização de dados de sensores terrestres e indicadores orbitais.
  3. Formatação estruturada no terminal com cálculo determinístico de limiares de alerta e relatórios de risco.
- **Destaques**:
  - Interface de terminal (CLI) em Python para monitoramento de telemetria
  - Projeto acadêmico oficial FIAP Global Solution — Engenharia de Software
  - Cálculo de limiares de alerta e análise de cenários de risco
- **Destaque Inicial (featuredByDefault)**: `true`

---

### 3.3 Filtro de Whitelist Estrita no Serviço GitHub

No arquivo `src/services/githubService.ts`, a função `mergeGitHubWithCatalog` foi modificada para eliminar o comportamento anterior que realizava fallback para inclusão de qualquer repositório não-fork:

```typescript
// Trecho modificado em src/services/githubService.ts
for (const repo of validRepos) {
  const catalogMatch = findCatalogMatch(repo.name);

  if (catalogMatch) {
    matchedCatalogSlugs.add(catalogMatch.slug);
    enrichedFromGitHub.push(createEnrichedFromCatalog(catalogMatch, repo, featuredSlugs));
  }
  // Restrição estrita (R2): repositórios fora do catálogo de 3 projetos reais são ignorados.
}
```

Com essa alteração, mesmo que a conta `donizetti-dev` contenha dezenas de outros repositórios públicos na API do GitHub, nenhum projeto além dos 3 homologados será exibido nos cards ou na rota `/portifolio/:slug`.

---

## 4. Relação Completa de Arquivos Modificados

| # | Arquivo | Natureza da Alteração |
| :--- | :--- | :--- |
| 1 | `src/config/profileData.ts` | **Configuração**: Atualizados `handle`, `social.github`, `social.githubUsername`, `social.linkedin` e `social.email` para os valores oficiais de Donizetti Batista. |
| 2 | `src/services/githubService.ts` | **Serviço de Dados**: Atualizado `DEFAULT_GITHUB_USERNAME` para `'donizetti-dev'`; implementado filtro de whitelist estrita na função `mergeGitHubWithCatalog`; exportadas funções auxiliares. |
| 3 | `src/config/projectsCatalog.ts` | **Catálogo de Projetos**: Purgados os projetos `portifolio-webdev` e `docflow-rpa-pipeline`; mantidos e reconfigurados integralmente os 3 projetos reais (`news-scraper-api`, `trending-movies` e `infrawatch-terminal`) com URLs oficiais e stacks fiéis; formatação Prettier aplicada. |
| 4 | `tests/dashboard-auth.spec.ts` | **Testes E2E (Playwright)**: Sincronizada a asserção de projetos em destaque para o catálogo de 3 itens (`stat-featured-projects` inicial igual a 3); teste de alternância de destaque readequado para `toggle-featured-infrawatch-terminal` (3 -> 2 -> 3). |
| 5 | `docs/ajustes.md` | **Documentação Técnica (Novo)**: Registro detalhado de todas as alterações, mapeamento De/Para, arquitetura, justificativas e validações. |

---

## 5. Verificação e Resultados de Testes

Todas as modificações foram verificadas através do ferramental oficial do repositório:

### 5.1 Verificação de Tipos e Build de Produção
- **Comando**: `npm run build` (`tsc -b && vite build`)
- **Resultado**: Concluído com sucesso (Exit Code `0`).
- **Tempo de Execução**: `7.82s`.
- **Artefatos Gerados**: Pacotes estáticos minificados em `dist/` (Zero erros de compilação TypeScript).

### 5.2 Verificação de Estilo e Linting
- **Comando**: `npm run lint` (`eslint . --max-warnings 0`)
- **Resultado**: Concluído com sucesso (Exit Code `0`).
- **Violações**: `0 erros`, `0 avisos`.

### 5.3 Verificação de Formatação de Código
- **Comando**: `npx prettier --write src/config/projectsCatalog.ts src/config/profileData.ts src/services/githubService.ts tests/dashboard-auth.spec.ts`
- **Resultado**: Arquivos formatados rigorosamente de acordo com a configuração do Prettier.

### 5.4 Validação Programática de URLs e Integridade do Catálogo
- **Script Executado**: Script Node.js de asserção automática.
- **Validações Confirmadas**:
  - `PROFILE_DATA.social.linkedin === 'https://www.linkedin.com/in/donizetti-dev'` -> **Válido (RFC 3986, protocolo HTTPS)**
  - `PROFILE_DATA.social.github === 'https://github.com/donizetti-dev'` -> **Válido (RFC 3986, protocolo HTTPS)**
  - `PROFILE_DATA.social.email === 'donizettibatista1@gmail.com'` -> **Válido (RFC 5322)**
  - `CUSTOM_PROJECTS_CATALOG.length === 3` -> **Exatamente 3 projetos reais**
  - URLs de repositório apontam para `donizetti-dev/news-scraper-api`, `donizetti-dev/Trending_Movie-React` e `donizetti-dev/Infrawatch-Terminal` -> **Confirmado**
  - Ausência total de `catalog-portifolio-webdev` e `catalog-docflow-rpa-pipeline` -> **Confirmado**
  - Bundle gerado em `dist/assets/index-*.js` validado programaticamente contendo todos os novos links e zero referências legadas -> **Confirmado**
