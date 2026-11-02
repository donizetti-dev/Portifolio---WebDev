# Diário de Progresso e Handoff entre Agentes

> [!NOTE]
> Este arquivo registra o histórico de evolução do projeto etapa por etapa.
> **Regra obrigatória para cada Agente:** Ao finalizar uma Feature de [plano_implementacao.md](file:///c:/VS_Doni/PORTIFOLIO/Portifolio---WebDev/docs/specs/plano_implementacao.md), adicione uma nova seção no final deste arquivo contendo **Data, Horário, Feature concluída, Resumo técnico do que foi feito, Comandos validados e Notas de Handoff** para o próximo agente.

---

## [2026-10-25 16:57] Etapa 0 — Discovery, Arquitetura e Especificação Geral
* **Status:** Concluída
* **Resumo do que foi feito:**
  * Leitura e análise de `docs/referencias/sobre_mim.md` e `docs/referencias/requisitos_principais.md`.
  * Entrevista de Discovery em 2 rodadas com alinhamento de escopo, stack e regras de negócio.
  * Criação da especificação técnica consolidada em `docs/specs/especificacao_geral.md`.
  * Criação do plano de implementação modular orientado a features em `docs/specs/plano_implementacao.md`.
* **Próxima Etapa Pendente:** `Feature 1 — Setup Base, Tooling, Tema Claro/Escuro e Design System`.
* **Notas para o próximo Agente:**
  * O repositório ainda não possui `package.json` nem código-fonte inicializado. Inicie a `Feature 1` criando a estrutura Vite + React + TypeScript na raiz do projeto sem apagar a pasta `docs/`.

---

## [2026-10-25 17:26] Feature 1 — Setup Base, Tooling, Tema Claro/Escuro e Design System
* **Status:** Concluída
* **Resumo do que foi feito:**
  * Inicialização do projeto **Vite 6 + React 18 + TypeScript** na raiz preservando integralmente `docs/` e `.git/`.
  * Instalação de toda a árvore de dependências base e da arquitetura (`react`, `react-dom`, `react-router-dom`, `@tanstack/react-query`, `@supabase/supabase-js`, `lucide-react`) e de qualidade (`eslint`, `typescript-eslint`, `prettier`, `husky`, `lint-staged`, `@playwright/test`).
  * Atualização de `.gitignore` (ignorando `.env`, `node_modules`, `dist`, relatórios do Playwright, etc.) e criação de `.env.example` documentado com `VITE_GITHUB_USERNAME`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_ADMIN_EMAIL` e `VITE_ADMIN_PASSWORD`.
  * Configuração funcional de **ESLint 9** (`eslint.config.js`), **Prettier** (`.prettierrc`, `.prettierignore`) e **Husky + lint-staged** (`.husky/pre-commit`).
  * Criação do Design System **Monochrome High-Contrast + Electric Accent** em `src/styles/variables.css` e `src/styles/global.css`, com suporte completo a `[data-theme="dark"]` (`#000000`) e `[data-theme="light"]` (`#F7F7F7`), grid técnico translúcido, utilitário `.text-outline` (`-webkit-text-stroke`), carregamento das fontes `Syne`, `Space Grotesk`, `Inter`, `Plus Jakarta Sans` e `JetBrains Mono` via Google Fonts no `index.html`, além de respeito a `@media (prefers-reduced-motion: reduce)`.
  * Implementação de `src/context/ThemeContext.tsx` com detecção de `prefers-color-scheme`, alternância entre claro e escuro e persistência em `localStorage` (`donizetti_portfolio_theme`).
  * Criação dos componentes base reutilizáveis em `src/components/ui/`: `Button.tsx` (com variantes, tamanhos e spinner em estado `isLoading`), `Card.tsx` (Glassmorphism), `Badge.tsx`, `Skeleton.tsx` (incluindo `ProjectCardSkeleton`), `EmptyState.tsx`, `ErrorState.tsx` (com frase amigável padrão e botão de retry) e `ThemeToggle.tsx`.
  * Criação dos componentes estruturais e semânticos em `src/components/layout/`: `Header.tsx`, `Footer.tsx`, `PageLayout.tsx` e `MarqueeBanner.tsx` (tipografia cinética contínua alternando preenchimento e contorno).
  * Montagem de `src/App.tsx` e `src/main.tsx` integrando `ThemeProvider` e `PageLayout`.
* **Comandos Validados:**
  * `npm run lint` (0 erros, 0 warnings)
  * `npm run format:check` (100% aderente ao Prettier)
  * `npm run build` (`tsc -b && vite build` concluído com sucesso)
* **Próxima Etapa Pendente:** `Feature 2 — Camada de Dados, Catálogo Extensível e Integração GitHub/Supabase`.
* **Notas para o próximo Agente:**
  * As bibliotecas `@tanstack/react-query` e `@supabase/supabase-js` já estão instaladas no `package.json`.
  * Crie `src/types/index.ts`, `src/config/profileData.ts`, `src/config/projectsCatalog.ts`, os serviços em `src/services/` (`githubService.ts`, `supabaseClient.ts`, `dataService.ts` com fallback automático em `localStorage`) e os hooks em `src/hooks/` (`useGitHubProjects.ts`, `useContactMessages.ts`, `useFeaturedProjects.ts`) conforme especificado na Feature 2 de `docs/specs/plano_implementacao.md`.

---

## [2026-10-25 17:34] Feature 2 — Camada de Dados, Catálogo Extensível e Integração GitHub/Supabase
* **Status:** Concluída
* **Resumo do que foi feito:**
  * Criação de `src/types/index.ts` com todos os contratos TypeScript da aplicação (`GitHubRepoResponse`, `ProjectCatalogEntry`, `EnrichedProject`, `ProjectItem`, `ContactMessage`, `CreateContactMessageInput`, `MessageFilter`, `PortfolioSettings`, `ProfileData`, `SkillCategory`, `ExperienceItem`, `EducationItem`, `SocialLinks`), mantendo compatibilidade total com `docs/specs/especificacao_geral.md`.
  * Criação de `src/config/profileData.ts` (`PROFILE_DATA`) contendo o posicionamento profissional de Donizetti Batista na **MV3 Inovações em Tecnologia e Sistemas** (Automação RPA, Python, Selenium, SQL Server, AutoMate, Power Automate Desktop, PowerShell) e **FIAP** (Engenharia de Software), 7 categorias de skills técnicas e links oficiais (`https://github.com/Doni-zete` e LinkedIn `https://www.linkedin.com/in/donizetti-junior-a52336195/`), sem menções a IA Generativa.
  * Criação de `src/config/projectsCatalog.ts` (`CUSTOM_PROJECTS_CATALOG`, `DEFAULT_FEATURED_PROJECT_SLUGS`, `toProjectSlug`, `findCatalogMatch`) com curadoria detalhada dos projetos reais (`News Scraper API`, `Trending Movies`, `InfraWatch — FIAP Global Solution`, `Portfólio Engenharia RPA & WebDev` e `DocFlow ETL`), incluindo problema de negócio, decisões arquiteturais, stack e flag de destaque inicial.
  * Implementação de `src/services/githubService.ts` consumindo a API REST v3 do GitHub (`VITE_GITHUB_USERNAME` com default `Doni-zete`), realizando merge inteligente com `projectsCatalog.ts`, cache de contingência em `sessionStorage` para mitigação de rate limit (403/429) e lançamento de `GitHubApiError` com a mensagem amigável exigida por RF03/RF04.
  * Implementação de `src/services/supabaseClient.ts` inicializando o cliente Supabase somente quando `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` possuem valores válidos.
  * Implementação de `src/services/dataService.ts` com persistência híbrida (Supabase + fallback transparente em `localStorage`) para mensagens de contato (`contact_messages` com seed realista de 3 mensagens para facilitar filtros de respondidas/não respondidas/importantes) e projetos em destaque (`portfolio_settings` / `featured_project_slugs`).
  * Criação dos hooks em `src/hooks/`:
    * `useFeaturedProjects.ts`: leitura e atualização de projetos em destaque via TanStack Query (`useQuery` + `useMutation` com invalidação de cache).
    * `useGitHubProjects.ts` (e `useProjectBySlug`): busca e cache de projetos com `staleTime: 1000 * 60 * 10` (10 minutos), `gcTime: 1000 * 60 * 30` e `retry: 1`, sincronizado dinamicamente com os destaques ativos.
    * `useContactMessages.ts`: listagem filtrada (`all`, `replied`/`answered`, `unreplied`/`unanswered`, `important`), contadores estatísticos, envio de nova mensagem e mutações de status (`toggleReplied`/`toggleAnswered`, `toggleImportant`).
  * Configuração do `QueryClientProvider` no `src/App.tsx`.
* **Comandos Validados:**
  * `npm run lint` (0 erros, 0 warnings)
  * `npm run format:check` (100% aderente ao Prettier)
  * `npm run build` (`tsc -b && vite build` concluído com sucesso)
* **Próxima Etapa Pendente:** `Feature 3 — Home Page, Detalhe 3D Leve e Seções Principais (Hero, MV3/Skills, Projetos)`.
* **Notas para o próximo Agente:**
  * Os dados do perfil estão prontos em `src/config/profileData.ts` (`PROFILE_DATA`).
  * Para listar os projetos na Home com estados de loading, erro e vazio, utilize `useGitHubProjects()` de `src/hooks/useGitHubProjects.ts` juntamente com os componentes base `ProjectCardSkeleton`, `ErrorState` e `EmptyState` já disponíveis em `src/components/ui/`.
  * Crie `src/hooks/useSpotlight.ts`, os componentes em `src/components/home/` (`HeroSection.tsx`, `HeroCanvas3D.tsx` via `React.lazy`, `ExperienceSection.tsx`, `SkillsSection.tsx`), os componentes em `src/components/projects/` (`ProjectCard.tsx`, `ProjectsGrid.tsx`) e monte `src/pages/HomePage.tsx`.




---

## [2026-10-25 17:43] Feature 3 — Home Page, Detalhe 3D Leve e Seções Principais (Hero, MV3/Skills, Projetos)
* **Status:** Concluída
* **Resumo do que foi feito:**
  * Criação do hook `src/hooks/useSpotlight.ts` gerenciando o efeito **Spotlight radial** (acompanhando o cursor do mouse via `requestAnimationFrame` e variáveis CSS `--spotlight-x`, `--spotlight-y`) e **Tilt 3D sutil** (`--tilt-x`, `--tilt-y`), desativando automaticamente em dispositivos touch (`pointer: coarse`) ou quando `prefers-reduced-motion: reduce` está ativo (RNF03 / RNF04).
  * Criação dos componentes em `src/components/home/`:
    * `HeroCanvas3D.tsx` + `HeroCanvas3D.module.css`: Elemento 3D procedural leve (icosaedro wireframe + núcleo octaédrico em Canvas HTML5 2D com ~2.0 KB gzipped), adaptável aos temas Dark/Light (`#00FF87` / `#38BDF8`), reagindo suavemente ao scroll e movimento do ponteiro, pausando automaticamente via `IntersectionObserver` quando fora da viewport ou em `prefers-reduced-motion: reduce`, e com dimensões reservadas (`aspect-ratio: 1 / 1`, `min-height`) para garantir `CLS = 0`.
    * `HeroSection.tsx` + `HeroSection.module.css`: Seção principal de impacto com tipografia expressiva (`DONIZETTI` preenchido + `BATISTA` em `.text-outline`), posicionamento profissional em Automação RPA (MV3) e Engenharia de Software (FIAP), CTAs para `#projetos` e `#contato`, links externos (GitHub/LinkedIn), cards de métricas rápidas e carregamento assíncrono de `HeroCanvas3D` via `React.lazy()` + `<Suspense>`.
    * `ExperienceSection.tsx` + `ExperienceSection.module.css`: Seção dedicada destacando a trajetória como Analista de Automação RPA na **MV3 Inovações em Tecnologia e Sistemas** (Python, Selenium, SQL Server, AutoMate Desktop, Power Automate Desktop, PowerShell, PDFPlumber, OpenPyXL, Pandas) e a formação em Engenharia de Software na **FIAP**, consumindo `PROFILE_DATA` com cards interativos com Spotlight/Tilt.
    * `SkillsSection.tsx` + `SkillsSection.module.css`: Matriz técnica categorizada exibindo as 7 categorias de competências de `PROFILE_DATA` (`01 // LANG` a `07 // OPS`) com indicadores de nível e destaque.
  * Criação dos componentes em `src/components/projects/`:
    * `ProjectCard.tsx` + `ProjectCard.module.css`: Card de projeto com *Glassmorphism* (`backdrop-filter: blur`), *Spotlight + Tilt 3D* (`useSpotlight`), e *Split Effect / Clip-Path Reveal* nas bordas no hover (`clip-path: polygon(...)`), exibindo badges de destaque e categoria, estrelas/forks do GitHub, descrição, stack técnica, links externos (Código/Demo) e link `<Link to="/portifolio/:slug">` preparando para a Feature 4.
    * `ProjectsGrid.tsx` + `ProjectsGrid.module.css`: Grade de projetos consumindo `useGitHubProjects()`, com abas de filtro (*Todos*, *Destaques*, *Automação RPA*, *Backend & API*, *Front-End Web*, *Dados & ETL*) e tratamento completo dos **3 estados de UI exigidos por RF04**:
      1. **Loading:** 6 instâncias de `ProjectCardSkeleton`.
      2. **Erro de API:** `ErrorState` com a mensagem amigável *"Não foi possível sincronizar os repositórios do GitHub no momento. Tente novamente em instantes."* e botão de retry acionando `refetch()`.
      3. **Vazio:** `EmptyState` com botão para restaurar o filtro para todos os projetos.
  * Criação de `src/pages/HomePage.tsx` (+ `HomePage.module.css`) integrando `HeroSection`, `MarqueeBanner`, `ExperienceSection`, `SkillsSection`, `ProjectsGrid` e a seção âncora `#contato` pronta para receber o `ContactForm` na Feature 4.
  * Atualização de `src/App.tsx` envolvendo `PageLayout` e `HomePage` com `BrowserRouter` (`react-router-dom`).
* **Comandos Validados:**
  * `npm run lint` (0 erros, 0 warnings)
  * `npm run format:check` (100% aderente ao Prettier)
  * `npm run build` (`tsc -b && vite build` concluído com sucesso e chunk isolado `HeroCanvas3D` gerado)
* **Próxima Etapa Pendente:** `Feature 4 — Rotas Dinâmicas de Projetos (/portifolio/:slug), 404 Amigável e Formulário de Contato`.
* **Notas para o próximo Agente:**
  * Os cards em `ProjectCard.tsx` já apontam para `/portifolio/${project.slug}` via `<Link>` do `react-router-dom`, e `useProjectBySlug(slug)` já está disponível em `src/hooks/useGitHubProjects.ts`.
  * Na `HomePage.tsx`, a seção `<section id="contato">` já está posicionada no final da página pronta para integrar o componente `src/components/contact/ContactForm.tsx`.
  * Configure as rotas em `src/App.tsx` (`/` -> `HomePage`, `/portifolio/:slug` -> `ProjectDetailPage`, `*` -> `NotFoundPage`) mantendo o `BrowserRouter` e `PageLayout`.

---

## [2026-10-25 17:48] Feature 4 — Rotas Dinâmicas de Projetos (/portifolio/:slug), 404 Amigável e Formulário de Contato
* **Status:** Concluída
* **Resumo do que foi feito:**
  * Criação do formulário de contato `src/components/contact/ContactForm.tsx` (+ `ContactForm.module.css`) atendendo rigorosamente ao **RF05**:
    * Campos **Nome**, **E-mail** e **Mensagem** com `<label>` associados, atributos de acessibilidade (`aria-required`, `aria-invalid`, `aria-describedby`) e `data-testid` padronizados (`contact-form`, `contact-name-input`, `contact-name-error`, `contact-email-input`, `contact-email-error`, `contact-message-input`, `contact-message-error`, `contact-message-counter`, `contact-submit-button`, `contact-success-banner`).
    * Validação específica por campo: Nome obrigatório (mínimo de 3 caracteres), E-mail obrigatório com validação de formato e Mensagem obrigatória entre **10 e 200 caracteres** (`10 <= msg.trim().length <= 200`) acompanhada de **contador dinâmico em tempo real (`X/200`)**.
    * Bloqueio do botão de envio (`disabled`) com spinner de carregamento durante `isSubmitting` via `useContactMessages().sendMessage`, evitando envios duplicados, limpando os campos e exibindo banner de confirmação após sucesso.
  * Integração do `ContactForm` na seção `#contato` dentro de `src/pages/HomePage.tsx` (+ ajuste de layout em `src/pages/HomePage.module.css`).
  * Criação da página de detalhes `src/pages/ProjectDetailPage.tsx` (+ `ProjectDetailPage.module.css`) para a rota dinâmica `/portifolio/:slug`:
    * Consumo do cache compartilhado do TanStack Query via `useProjectBySlug(slug)` sem disparar chamadas redundantes à API do GitHub.
    * Layout técnico de engenharia (**sem renderização de `README.md`**, conforme RF02 e Seção 1.2) apresentando título, categoria, status, métricas do GitHub (linguagem principal, stars, forks, data de atualização), **Problema de Negócio & Contexto**, **Decisões Arquiteturais e Técnicas**, **Stack Completa & Ferramental**, links diretos para Repositório GitHub e Deploy/Demo, e botão de retorno para a Home.
    * Tratamento completo dos estados de carregamento (`Skeleton`), erro de API (`ErrorState` com a mensagem *"Não foi possível sincronizar os repositórios do GitHub no momento. Tente novamente em instantes."* e retry) e exibição da interface 404 amigável quando o `:slug` não existe no catálogo nem nos repositórios retornados pela API.
  * Criação da página `src/pages/NotFoundPage.tsx` (+ `NotFoundPage.module.css`) atendendo ao **RF03** com a mensagem amigável *"Projeto não encontrado — O repositório que você procura pode ter sido movido ou renomeado."* e CTA direto de retorno para a Home (`/`).
  * Criação de `src/routes/AppRoutes.tsx` configurando as rotas (`/` -> `HomePage`, `/portifolio/:slug` -> `ProjectDetailPage`, `*` -> `NotFoundPage`) com gerenciamento automático de scroll (`ScrollToTopOnNavigate`), integrado em `src/App.tsx`.
* **Comandos Validados:**
  * `npm run lint` (0 erros, 0 warnings)
  * `npm run format:check` (100% aderente ao Prettier)
  * `npm run build` (`tsc -b && vite build` concluído com sucesso)
* **Próxima Etapa Pendente:** `Feature 5 — Autenticação e Dashboard Administrativo (/login e /dashboard)`.
* **Notas para o próximo Agente:**
  * As rotas públicas (`/`, `/portifolio/:slug`, `*`) já estão configuradas em `src/routes/AppRoutes.tsx`.
  * Na `Feature 5`, crie `src/context/AuthContext.tsx`, `src/routes/ProtectedRoute.tsx`, `src/pages/LoginPage.tsx` e `src/pages/DashboardPage.tsx` (carregadas com `React.lazy` + `Suspense` conforme RNF04), e adicione as rotas `/login` e `/dashboard` em `src/routes/AppRoutes.tsx` envolvendo a aplicação com o `AuthProvider`.
  * Utilize os hooks `useContactMessages` (`src/hooks/useContactMessages.ts`) e `useFeaturedProjects` / `useGitHubProjects` (`src/hooks/useFeaturedProjects.ts`, `src/hooks/useGitHubProjects.ts`) que já estão prontos e integrados ao `dataService.ts`.

---

## [2026-10-25 17:56] Feature 5 — Autenticação e Dashboard Administrativo (/login e /dashboard)
* **Status:** Concluída
* **Resumo do que foi feito:**
  * Criação do provedor de autenticação híbrida `src/context/AuthContext.tsx` (`AuthProvider`, `useAuth`, `getDemoAdminCredentials`) atendendo à Seção 8 de `docs/specs/especificacao_geral.md`:
    * **Modo Produção (Supabase Auth):** autentica via `supabase.auth.signInWithPassword({ email, password })` e sincroniza mudanças de sessão com `supabase.auth.onAuthStateChange` quando `isSupabaseConfigured()` é `true`.
    * **Modo Desenvolvimento / Avaliação Local (Fallback determinístico):** valida contra `import.meta.env.VITE_ADMIN_EMAIL || 'admin@donizetti.dev'` e `import.meta.env.VITE_ADMIN_PASSWORD || 'Admin@2026!'` (aceitando também `admin123` de `.env.example`), persistindo a sessão administrativa em `sessionStorage` sob a chave `portfolio_admin_session`.
    * Expõe `isAuthenticated`, `userEmail`, `isLoading`, `authMode`, `login(email, password)` e `logout()`.
  * Criação do componente guardião `src/routes/ProtectedRoute.tsx` atendendo ao **RF06**, redirecionando imediatamente visitantes não autenticados (`!isAuthenticated`) para `/login` via `<Navigate to="/login" replace />`.
  * Criação da página `src/pages/LoginPage.tsx` (+ `LoginPage.module.css`) para `/login`:
    * Formulário de autenticação administrativa com validação de e-mail e senha, alerta visual de erro (`role="alert"`), exibição das credenciais de avaliação local com botão de preenchimento rápido (mantendo os inputs editáveis) e redirecionamento automático para `/dashboard` após login bem-sucedido ou quando já autenticado.
    * `data-testid` configurados para testes E2E: `login-form`, `login-email-input`, `login-password-input`, `login-submit-button`, `login-error-alert`, `login-demo-fill-button`.
  * Criação da página `src/pages/DashboardPage.tsx` (+ `DashboardPage.module.css`) para `/dashboard` atendendo a **RF07** e **RF08**:
    * **Cabeçalho Administrativo:** exibe e-mail autenticado (`data-testid="dashboard-user-email"`), badge do modo de persistência ativo (`Supabase Cloud` vs `Local Fallback`), 5 contadores resumidos (`stat-total-messages`, `stat-unreplied-messages`, `stat-replied-messages`, `stat-important-messages`, `stat-featured-projects`) e botão de Logout (`data-testid="dashboard-logout-button"`).
    * **Gestão de Mensagens Recebidas (RF07):** filtros funcionais por status (*Todas* `filter-all`, *Não respondidas* `filter-unreplied`, *Respondidas* `filter-replied`, *Importantes* `filter-important`), listagem de mensagens (`messages-list`, `message-card-${id}`) com estados de Loading (`Skeleton`), Erro (`ErrorState`) e Vazio (`EmptyState`), e botões de ação direta para alternar **Respondida/Pendente** (`toggle-replied-${id}`) e **Importante** (`toggle-important-${id}`) via `useContactMessages`.
    * **Curadoria de Projetos em Destaque na Home (RF08):** lista todos os projetos carregados via `useGitHubProjects()` (`featured-projects-list`, `featured-project-item-${slug}`) permitindo marcar/desmarcar projetos como destaque na Home (`toggle-featured-${slug}`) via `useFeaturedProjects().toggleFeaturedProject`, atualizando o cache do TanStack Query e persistindo no Supabase / `localStorage`.
  * Atualização de `src/routes/AppRoutes.tsx` e `src/App.tsx`:
    * Envolvimento da árvore da aplicação com `<AuthProvider>`.
    * Code-splitting sob demanda de `LoginPage` e `DashboardPage` com `React.lazy()` + `<Suspense>` conforme **RNF04**, gerando chunks dedicados no build (`LoginPage` e `DashboardPage`).
    * Proteção da rota `/dashboard` com `<ProtectedRoute>`.
* **Comandos Validados:**
  * `npm run lint` (0 erros, 0 warnings)
  * `npm run format` (100% aderente ao Prettier)
  * `npm run build` (`tsc -b && vite build` concluído com sucesso e chunks isolados para `LoginPage` e `DashboardPage`)
* **Próxima Etapa Pendente:** `Feature 6 — Testes E2E (Playwright), Auditoria de Performance e Documentação Final`.
* **Notas para o próximo Agente:**
  * Para os testes E2E em `tests/contact-form.spec.ts` e `tests/dashboard-auth.spec.ts`:
    * No formulário de contato (`/`), os `data-testid` são: `contact-form`, `contact-name-input`, `contact-name-error`, `contact-email-input`, `contact-email-error`, `contact-subject-input`, `contact-subject-error`, `contact-message-input`, `contact-message-error`, `contact-message-counter`, `contact-submit-button`, `contact-success-banner`.
    * Na autenticação (`/login`), as credenciais fallback padrão são `admin@donizetti.dev` e `Admin@2026!` (ou `admin123`), e os `data-testid` são: `login-form`, `login-email-input`, `login-password-input`, `login-submit-button`, `login-error-alert`, `login-demo-fill-button`.
    * No painel administrativo (`/dashboard`), os `data-testid` são: `dashboard-page`, `dashboard-logout-button`, `filter-all`, `filter-unreplied`, `filter-replied`, `filter-important`, `messages-list`, `message-card-${id}`, `toggle-replied-${id}`, `toggle-important-${id}`, `featured-projects-list`, `featured-project-item-${slug}`, `toggle-featured-${slug}`.

---

## [2026-10-25 21:45] Feature 6 — Testes E2E (Playwright), Auditoria de Performance e Documentação Final
* **Status:** Concluída
* **Resumo do que foi feito:**
  * Configuração de `playwright.config.ts` na raiz do projeto apuntando para `testDir: './tests'`, `webServer` em `http://127.0.0.1:4173` (`npm run dev -- --host 127.0.0.1 --port 4173`), `reporter: 'list'`, `contextOptions: { reducedMotion: 'reduce' }` e projeto Chromium configurado com `channel: 'msedge'`.
  * Criação da suíte `tests/contact-form.spec.ts` (4 testes E2E — 100% aprovados) validando a Seção `9.1` de `docs/specs/especificacao_geral.md`:
    1. Submissão com campos vazios exibindo erros específicos abaixo de Nome (`contact-name-error`), E-mail (`contact-email-error`) e Mensagem (`contact-message-error`).
    2. Validação de formato de e-mail inválido (`email-invalido`) exibindo mensagem específica de formato.
    3. Validação de mensagem curta (`"Curto"`, `< 10` caracteres) e exibição em tempo real do contador (`5/200`).
    4. Preenchimento válido completo (entre 10 e 200 caracteres), atualização dinâmica do contador, envio da mensagem, limpeza automática dos inputs e exibição do banner de confirmação (`contact-success-banner`).
  * Criação da suíte `tests/dashboard-auth.spec.ts` (4 testes E2E — 100% aprovados) validando a Seção `9.2` de `docs/specs/especificacao_geral.md`:
    1. Bloqueio de acesso direto a `/dashboard` sem sessão ativa com redirecionamento imediato para `/login`.
    2. Exibição de feedback visual de erro (`login-error-alert`) ao submeter credenciais incorretas e permanência em `/login`.
    3. Autenticação com credenciais válidas (`admin@donizetti.dev` / `Admin@2026!`), acesso ao `/dashboard`, listagem de mensagens recebidas, funcionamento dos filtros (*Todas*, *Não respondidas*, *Respondidas*), alternância de status (*Respondida* / *Importante*) e alternância de projeto em destaque na Home (`toggle-featured-docflow-rpa-pipeline`).
    4. Renderização da página 404 amigável (`not-found-page`) ao acessar rota inexistente (`/rota-inexistente-404`).
  * Atualização completa do `README.md` na raiz do projeto documentando visão geral do portfólio (MV3 Tecnologia, FIAP, RPA & WebDev), stack e arquitetura, Design System *Monochrome High-Contrast + Electric Accent*, estrutura de pastas detalhada, instruções de instalação e variáveis `.env` (Modo Supabase Cloud vs. Fallback Local Automático), guia para adicionar novos projetos em `src/config/projectsCatalog.ts` e comandos de build/lint/Playwright.
* **Comandos Validados:**
  * `npx playwright test` (8 passed, 0 failed — 100% das suítes `contact-form.spec.ts` e `dashboard-auth.spec.ts` aprovadas)
  * `npm run lint` (0 erros, 0 warnings)
  * `npm run build` (`tsc -b && vite build` concluído com sucesso e code-splitting validado para `HeroCanvas3D`, `LoginPage` e `DashboardPage`)
* **Status Geral do Projeto:** **100% Concluído (Features 1 a 6 finalizadas).**


