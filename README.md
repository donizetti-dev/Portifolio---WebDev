# Portfólio Engenharia de Software, Automação RPA & WebDev — Donizetti Batista

Aplicação web *Single Page Application (SPA)* moderna e responsiva construída com **Vite 6, React 18 e TypeScript**, projetada para apresentar a trajetória profissional de **Donizetti Batista** em **Engenharia de Software (FIAP)**, **Automação RPA Corporativa (MV3 Inovações em Tecnologia e Sistemas)** e **Desenvolvimento Web Full-Stack**.

---

## 1. Visão Geral do Projeto

O portfólio combina engenharia de front-end de alta performance com integrações dinâmicas e gerenciamento administrativo protegido:

* **Posicionamento Técnico Real:** Destaca a atuação prática como Analista de Automação RPA na **MV3 Tecnologia** (*Python, Selenium, SQL Server, AutoMate Desktop, Power Automate Desktop, PowerShell, PDFPlumber, OpenPyXL, Pandas*) e a formação acadêmica em Engenharia de Software na **FIAP** (incluindo projetos da *Global Solution*).
* **Sincronização Inteligente com GitHub REST API:** Consome automaticamente os repositórios públicos de `Doni-zete` via `GET /users/{username}/repos`, realizando *merge* em tempo de execução com um catálogo curado extensível (`src/config/projectsCatalog.ts`) e mantendo cache em memória por 10 minutos via **TanStack Query** (zero requisições repetidas ao navegar entre páginas).
* **Rotas Dinâmicas de Engenharia (`/portifolio/:slug`):** Páginas técnicas dedicadas para cada projeto apresentando *Problema de Negócio*, *Decisões Arquiteturais*, *Stack Técnica*, status, métricas do GitHub e links externos, além de rota 404 amigável para endereços inexistentes.
* **Formulário de Contato Validado:** Validação específica por campo (Nome, E-mail e Mensagem entre **10 e 200 caracteres** com contador em tempo real `X/200`), bloqueio de submissão duplicada com *spinner* e persistência híbrida.
* **Dashboard Administrativo Protegido (`/login` e `/dashboard`):** Permite filtrar mensagens recebidas (*Todas*, *Não respondidas*, *Respondidas*, *Importantes*), alternar status de atendimento/prioridade e selecionar dinamicamente quais projetos aparecem em destaque na Home.

---

## 2. Arquitetura, Stack Tecnológica e Design System

### Stack Principal
| Camada | Tecnologia | Finalidade |
| :--- | :--- | :--- |
| **Core & Build** | **React 18 + TypeScript 5.6 + Vite 6** | Tipagem estrita, *tree-shaking* e *code-splitting* via `React.lazy` + `Suspense`. |
| **Roteamento** | **React Router DOM v6** | Rotas declarativas (`/`, `/portifolio/:slug`, `/login`, `/dashboard`, `*`) e guarda de rota (`ProtectedRoute`). |
| **Estado Assíncrono & Cache** | **TanStack Query v5** | Cache em memória (`staleTime: 10 min`, `gcTime: 30 min`) para repositórios do GitHub, mensagens e destaques. |
| **Persistência & Auth** | **Supabase (`@supabase/supabase-js`) + Fallback Local** | Arquitetura híbrida (`dataService.ts` e `AuthContext.tsx`) que opera em nuvem (Supabase PostgreSQL/Auth) ou em modo local (`localStorage`/`sessionStorage`) de forma transparente. |
| **Estilização & UI** | **CSS Modules + CSS Variables + Lucide React** | Zero runtime overhead, temas Dark/Light instantâneos, *Glassmorphism*, *Spotlight*, *Split Effect* e *Tilt 3D*. |
| **Qualidade & Testes E2E** | **Playwright + ESLint 9 + Prettier + Husky** | Testes E2E automatizados em navegador real e *git hooks* (`lint-staged`) antes de cada commit. |

### Design System — *Monochrome High-Contrast + Electric Accent*
* **Temas Persistidos (`ThemeContext`):**
  * **Dark Mode (Padrão):** Fundo `#000000`, superfícies `#0A0A0A` / `#121212`, texto `#F5F5F7` e acento elétrico `#00FF87` (*Verde Matrix*) / `#38BDF8` (*Azul Ciano*).
  * **Light Mode:** Fundo `#F7F7F7`, superfícies `#FFFFFF`, texto `#0A0A0A` e acento `#0066FF`.
  * A preferência do usuário é detectada via `prefers-color-scheme`, sincronizada no atributo `data-theme="dark|light"` do `<html>` e persistida em `localStorage` (`donizetti_portfolio_theme`).
* **Tipografia Expressiva:**
  * **Títulos (`--font-display`):** `Syne` / `Space Grotesk` (pesos `700`/`800`) com suporte ao utilitário `.text-outline` (`-webkit-text-stroke`).
  * **Corpo (`--font-sans`):** `Inter` / `Plus Jakarta Sans`.
  * **Metadados & Código (`--font-mono`):** `JetBrains Mono`.
* **Interações Avançadas e Performance (Lighthouse Mobile ≥ 80):**
  * **Detalhe 3D Leve (`HeroCanvas3D.tsx`):** Icosaedro wireframe procedural em Canvas HTML5 (< 3 KB gzipped), carregado com `React.lazy`, reagindo ao scroll/ponteiro e pausado automaticamente fora da viewport via `IntersectionObserver`.
  * **Spotlight & Tilt 3D (`useSpotlight.ts`):** Ativados apenas em dispositivos desktop (`@media (hover: hover) and (pointer: fine)`) e desativados quando `prefers-reduced-motion: reduce` está ativo.
  * **Zero Layout Shift (`CLS = 0`):** Dimensões reservadas em todos os containers assíncronos e *skeletons*.

---

## 3. Estrutura de Pastas

```text
Portifolio---WebDev/
├── docs/
│   ├── referencias/                 # Documentos de referência (sobre_mim.md, requisitos_principais.md)
│   ├── specs/                       # Especificação técnica e plano de implementação
│   └── progresso.md                 # Diário de evolução e handoff entre etapas
├── public/                          # Assets estáticos
├── src/
│   ├── components/
│   │   ├── ui/                      # Button, Card, Badge, Skeleton, EmptyState, ErrorState, ThemeToggle
│   │   ├── layout/                  # Header, Footer, PageLayout, MarqueeBanner
│   │   ├── home/                    # HeroSection, HeroCanvas3D (lazy), ExperienceSection, SkillsSection
│   │   ├── projects/                # ProjectCard (Glassmorphism/Spotlight/Split), ProjectsGrid
│   │   └── contact/                 # ContactForm (validação por campo + contador 10-200 chars)
│   ├── config/
│   │   ├── profileData.ts           # Dados profissionais (MV3, FIAP, matriz de skills, links sociais)
│   │   └── projectsCatalog.ts       # Catálogo extensível de projetos e curadoria de arquitetura
│   ├── context/
│   │   ├── ThemeContext.tsx         # Alternância e persistência de tema Claro/Escuro
│   │   └── AuthContext.tsx          # Autenticação híbrida (Supabase Auth + Fallback Local)
│   ├── hooks/
│   │   ├── useGitHubProjects.ts     # Busca/cache TanStack Query + merge com catálogo local
│   │   ├── useContactMessages.ts    # Listagem filtrada, contadores, envio e atualização de mensagens
│   │   ├── useFeaturedProjects.ts   # Leitura e atualização dos projetos em destaque na Home
│   │   └── useSpotlight.ts          # Efeito de luz radial e Tilt 3D para ponteiros finos
│   ├── pages/
│   │   ├── HomePage.tsx             # Rota pública principal (/)
│   │   ├── ProjectDetailPage.tsx    # Rota dinâmica de projeto (/portifolio/:slug)
│   │   ├── LoginPage.tsx            # Rota de login administrativo (/login) [React.lazy]
│   │   ├── DashboardPage.tsx        # Painel administrativo protegido (/dashboard) [React.lazy]
│   │   └── NotFoundPage.tsx         # Página 404 amigável (*)
│   ├── routes/
│   │   ├── AppRoutes.tsx            # Configuração do React Router e code-splitting
│   │   └── ProtectedRoute.tsx       # Guardião de rota para /dashboard
│   ├── services/
│   │   ├── githubService.ts         # Cliente REST v3 do GitHub + cache de contingência
│   │   ├── supabaseClient.ts        # Inicialização condicional do cliente Supabase
│   │   └── dataService.ts           # Persistência unificada (Supabase Cloud + Fallback localStorage)
│   ├── styles/
│   │   ├── variables.css            # Design tokens (cores Dark/Light, tipografia, espaçamentos)
│   │   └── global.css               # Reset, grid técnico e utilitários globais
│   ├── types/
│   │   └── index.ts                 # Contratos e interfaces TypeScript da aplicação
│   ├── App.tsx                      # Providers globais (QueryClient, Theme, Auth, Router)
│   └── main.tsx                     # Ponto de entrada React 18
├── tests/
│   ├── contact-form.spec.ts         # Suíte E2E Playwright — Formulário de Contato
│   └── dashboard-auth.spec.ts       # Suíte E2E Playwright — Segurança do Dashboard, Login e 404
├── .env.example                     # Template documentado de variáveis de ambiente
├── eslint.config.js                 # Configuração ESLint 9 (Flat Config)
├── playwright.config.ts             # Configuração do Playwright E2E
├── package.json
└── README.md
```

---

## 4. Instalação e Configuração de Ambiente

### Pré-requisitos
* **Node.js** `>= 18.x` (recomendado `20.x` ou superior)
* **npm** `>= 9.x`

### Passo a Passo
1. **Clone o repositório e instale as dependências:**
   ```bash
   git clone https://github.com/Doni-zete/Portifolio---WebDev.git
   cd Portifolio---WebDev
   npm install
   ```

2. **Configure as variáveis de ambiente (`.env`):**
   Copie o arquivo `.env.example` para `.env` na raiz do projeto:
   ```bash
   cp .env.example .env
   ```

3. **Variáveis disponíveis no `.env`:**
   ```env
   # Usuário público do GitHub para sincronização automática de repositórios
   VITE_GITHUB_USERNAME=Doni-zete

   # Credenciais do Supabase (Opcionais em desenvolvimento/avaliação local)
   VITE_SUPABASE_URL=
   VITE_SUPABASE_ANON_KEY=

   # Credenciais administrativas para o Modo Fallback Local e testes E2E
   VITE_ADMIN_EMAIL=admin@donizetti.dev
   VITE_ADMIN_PASSWORD=Admin@2026!
   ```

### Modo Supabase Cloud vs. Modo Fallback Local Automático
* **Modo Fallback Local (Zero Config):** Se `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estiverem vazios, a aplicação opera **100% funcional** utilizando `localStorage` (com *seed* inicial realista de mensagens e destaques) e `sessionStorage` para a sessão administrativa.
  * **Credenciais padrão para avaliação local em `/login`:**
    * **E-mail:** `admin@donizetti.dev`
    * **Senha:** `Admin@2026!` (ou o valor definido em `VITE_ADMIN_PASSWORD`)
* **Modo Supabase Cloud:** Ao preencher `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`, o `AuthContext` passa a autenticar via **Supabase Auth** (`signInWithPassword`) e o `dataService` persiste mensagens e projetos em destaque nas tabelas `contact_messages` e `portfolio_settings` com *Row Level Security (RLS)*.

---

## 5. Como Adicionar Novos Projetos ao Catálogo (`projectsCatalog.ts`)

A listagem de projetos combina automaticamente dois mundos:
1. **Sincronização Automática via GitHub REST API (`src/services/githubService.ts`):** Todo repositório público não arquivado da conta configurada em `VITE_GITHUB_USERNAME` é carregado e exibido automaticamente nos cards e na rota `/portifolio/:slug`.
2. **Catálogo Curado Extensível (`src/config/projectsCatalog.ts`):** Permite enriquecer repositórios do GitHub com contexto de engenharia (*Problema de Negócio*, *Decisões Arquiteturais*, *Stack detalhada*) ou adicionar projetos corporativos/acadêmicos manualmente.

Para incluir um novo projeto ou enriquecer um repositório existente, basta adicionar um objeto ao array `CUSTOM_PROJECTS_CATALOG` em `src/config/projectsCatalog.ts`:

```typescript
{
  id: 'catalog-meu-novo-projeto',
  slug: 'meu-novo-projeto',            // Define a rota /portifolio/meu-novo-projeto
  repoName: 'nome-do-repo-no-github',  // Faz o match automático com a API do GitHub
  name: 'Título Exibido no Card',
  shortDescription: 'Resumo conciso exibido nos cards da Home e do Dashboard.',
  description: 'Descrição técnica completa exibida na página /portifolio/:slug.',
  problemStatement: 'Descrição do problema real de negócio ou engenharia resolvido.',
  architectureDecisions: [
    'Decisão arquitetural 1...',
    'Decisão arquitetural 2...',
  ],
  language: 'Python',
  stack: ['Python', 'Selenium', 'SQL Server'],
  topics: ['python', 'rpa', 'automation'],
  category: 'automation-rpa',          // 'automation-rpa' | 'backend-api' | 'frontend-web' | 'data-engineering' | 'fullstack'
  status: 'production',                // 'production' | 'completed' | 'in-progress' | 'academic'
  repoUrl: 'https://github.com/Doni-zete/nome-do-repo-no-github',
  homepageUrl: 'https://deploy-opcional.vercel.app',
  updatedAt: '2025-03-01T10:00:00Z',
  featuredByDefault: true,             // Define se inicia como destaque na Home
  highlights: [
    'Destaque técnico 1',
    'Destaque técnico 2',
  ],
}
```

---

## 6. Scripts Disponíveis, Padronização e Testes E2E

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor de desenvolvimento Vite com HMR (`http://localhost:5173`). |
| `npm run build` | Executa a checagem de tipos (`tsc -b`) e gera o bundle otimizado de produção em `dist/`. |
| `npm run preview` | Serve localmente o build de produção gerado em `dist/`. |
| `npm run lint` | Executa o **ESLint 9** em todos os arquivos `.ts` e `.tsx` com tolerância zero a warnings (`--max-warnings 0`). |
| `npm run format` | Formata automaticamente o código e estilos com **Prettier**. |
| `npm run format:check` | Verifica se todos os arquivos seguem a formatação do **Prettier**. |
| `npx playwright test` | Executa as suítes de testes E2E automatizados no navegador via **Playwright**. |

### Convenções de Código e Git Hooks
* **Nomenclatura:**
  * Componentes React e páginas em `PascalCase` (`ProjectCard.tsx`, `DashboardPage.tsx`).
  * Hooks personalizados em `camelCase` iniciando com `use` (`useGitHubProjects.ts`, `useSpotlight.ts`).
  * Serviços e utilitários em `camelCase` (`githubService.ts`, `dataService.ts`).
* **Pre-commit Automático:** O **Husky** + **lint-staged** executam `eslint --fix` e `prettier --write` automaticamente nos arquivos modificados antes de cada commit.

### Executando os Testes Automatizados E2E (Playwright)
Os testes E2E estão localizados na pasta `tests/` e validam a aplicação real rodando em `http://localhost:4173`:
1. **`tests/contact-form.spec.ts`:**
   * Submissão com campos vazios e validação das mensagens de erro específicas por campo.
   * Validação de formato de e-mail inválido.
   * Validação de mensagem curta (`< 10` caracteres) e funcionamento em tempo real do contador (`5/200`).
   * Submissão completa válida (entre 10 e 200 caracteres), limpeza automática dos campos e exibição do banner de confirmação (`contact-success-banner`).
2. **`tests/dashboard-auth.spec.ts`:**
   * Redirecionamento imediato de visitantes não autenticados ao tentar acessar `/dashboard` (`-> /login`).
   * Feedback visual de erro ao tentar login com credenciais inválidas.
   * Login com credenciais válidas, listagem e filtragem de mensagens (*Todas*, *Não respondidas*, *Respondidas*), alternância de status (*Respondida* / *Importante*) e curadoria de projetos em destaque na Home.
   * Renderização da página 404 amigável para rotas inexistentes.

Para executar toda a suíte E2E:
```bash
npx playwright test
```
