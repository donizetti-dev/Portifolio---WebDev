# Plano de Implementação por Features (Zero-Context Agent Guide)

> [!IMPORTANT]
> **Protocolo para Agentes (Zero-Context):**
> 1. Leia [progresso.md](file:///c:/VS_Doni/PORTIFOLIO/Portifolio---WebDev/docs/progresso.md) para verificar a última Feature concluída e o estado atual do projeto.
> 2. Identifique a próxima Feature pendente (`[ ]`) abaixo.
> 3. Consulte **obrigatoriamente** as seções e linhas referenciadas em [especificacao_geral.md](file:///c:/VS_Doni/PORTIFOLIO/Portifolio---WebDev/docs/specs/especificacao_geral.md), [sobre_mim.md](file:///c:/VS_Doni/PORTIFOLIO/Portifolio---WebDev/docs/referencias/sobre_mim.md) e [requisitos_principais.md](file:///c:/VS_Doni/PORTIFOLIO/Portifolio---WebDev/docs/referencias/requisitos_principais.md).
> 4. Implemente **apenas** o escopo da Feature atual, execute o comando de validação e, ao concluir, marque `[x]` neste arquivo e registre o resumo com data/hora em [progresso.md](file:///c:/VS_Doni/PORTIFOLIO/Portifolio---WebDev/docs/progresso.md).

---

## Feature 1 — Setup Base, Tooling, Tema Claro/Escuro e Design System
* **Status:** `[x] Concluída`
* **Onde encontrar a Spec em `especificacao_geral.md`:**
  * **RF09 (Tema Claro/Escuro):** Seção `2.1` (linha 42) e Matriz `Req 6` (linha 283).
  * **RNF01 & RNF02 (Paleta Monochrome High-Contrast, Fontes e HTML Semântico):** Seção `2.2` (linhas 45–48) e Matriz `Front-End 1, 2` (linha 289).
  * **RNF05 (Segurança `.env`, ESLint, Prettier, Husky):** Seção `2.2` (linhas 59–62), Seção `5` (itens 1, 5, 6 — linhas 106–113) e Matriz `Req 10, Req 11` (linhas 287–288).
  * **Estrutura de Pastas Base:** Seção `6` (linhas 117–171).
* **Escopo de Entrega:**
  * Inicializar Vite + React + TypeScript, atualizar `.gitignore`, criar `.env.example` e configurar ESLint + Prettier + Husky.
  * Criar `src/styles/variables.css`, `src/styles/global.css`, `src/context/ThemeContext.tsx` e componentes base em `src/components/ui/` (`Button`, `Card`, `Badge`, `Skeleton`, `EmptyState`, `ErrorState`, `ThemeToggle`) e `src/components/layout/` (`Header`, `Footer`, `PageLayout`, `MarqueeBanner`).
* **Validação Obrigatória:** `npm run lint && npm run build`

---

## Feature 2 — Camada de Dados, Catálogo Extensível e Integração GitHub/Supabase
* **Status:** `[x] Concluída`
* **Onde encontrar a Spec em `especificacao_geral.md`:**
  * **Objetivos e Curadoria (MV3 + FIAP, sem IA Generativa):** Seção `1.1` e `1.2` (linhas 10–15) + [sobre_mim.md](file:///c:/VS_Doni/PORTIFOLIO/Portifolio---WebDev/docs/referencias/sobre_mim.md) (linhas 1–15, 21–85).
  * **RF01 (GitHub API + Catálogo Extensível):** Seção `2.1` (linha 23), Seção `5` (item 3 — linha 108) e Seção `7.1` (linhas 177–195).
  * **Persistência Híbrida (Supabase + Fallback Local):** Seção `5` (item 4 — linhas 109–111), Seção `7.2` (linhas 197–212) e Seção `11` (Riscos — linhas 252–259).
* **Escopo de Entrega:**
  * Criar contratos em `src/types/index.ts`, dados do perfil em `src/config/profileData.ts` e catálogo extensível em `src/config/projectsCatalog.ts`.
  * Implementar `src/services/githubService.ts`, `src/services/supabaseClient.ts` e `src/services/dataService.ts` (com fallback automático em `localStorage`).
  * Implementar hooks `useGitHubProjects.ts` (TanStack Query com `staleTime: 10min`), `useContactMessages.ts` e `useFeaturedProjects.ts`.
* **Validação Obrigatória:** `npm run lint && npm run build`

---

## Feature 3 — Home Page, Detalhe 3D Leve e Seções Principais (Hero, MV3/Skills, Projetos)
* **Status:** `[x] Concluída`
* **Onde encontrar a Spec em `especificacao_geral.md`:**
  * **RF04 (Estados de Loading/Skeleton, Erro e Vazio):** Seção `2.1` (linha 28) e Matriz `Req 2` (linha 279).
  * **RNF03 & RNF04 (Elemento 3D Leve, Spotlight, Split Effect, Tilt e Performance):** Seção `2.2` (linhas 49–58), Seção `10` (linhas 241–249) e Matriz `Req 7, Req 8, Front-End 3` (linhas 284–285, 289).
  * **Fluxo da Home:** Seção `3` (linha 70) e Seção `4` (linhas 80–90).
* **Escopo de Entrega:**
  * Criar `src/hooks/useSpotlight.ts` (Spotlight radial e Tilt 3D apenas para desktop).
  * Criar `src/components/home/` (`HeroSection.tsx`, `HeroCanvas3D.tsx` carregado via `React.lazy`, `ExperienceSection.tsx` destacando MV3/FIAP, `SkillsSection.tsx`).
  * Criar `src/components/projects/` (`ProjectCard.tsx` com *Glassmorphism* e *Split Effect* em `clip-path`, `ProjectsGrid.tsx` com *skeletons*, erro amigável e *empty state*) e montar `src/pages/HomePage.tsx`.
* **Validação Obrigatória:** `npm run lint && npm run build`

---

## Feature 4 — Rotas Dinâmicas de Projetos (`/portifolio/:slug`), 404 Amigável e Formulário de Contato
* **Status:** `[x] Concluída`
* **Onde encontrar a Spec em `especificacao_geral.md`:**
  * **RF02 (Página Individual do Projeto sem README):** Seção `2.1` (linha 24) e Seção `3` (linha 71).
  * **RF03 (Página 404 Amigável e Erro de API):** Seção `2.1` (linhas 25–27) e Seção `3` (linha 74).
  * **RF05 (Formulário de Contato: validação por campo + 10 a 200 caracteres com contador + bloqueio de botão):** Seção `1.2` (linha 16), Seção `2.1` (linhas 29–35) e Seção `4` (linhas 91–94).
* **Escopo de Entrega:**
  * Criar `src/components/contact/ContactForm.tsx` (validações específicas, contador `0/200`, spinner e bloqueio no submit) e integrá-lo à `HomePage.tsx`.
  * Criar `src/pages/ProjectDetailPage.tsx` (`/portifolio/:slug` consumindo cache do TanStack Query), `src/pages/NotFoundPage.tsx` (`*`) e configurar `src/routes/AppRoutes.tsx`.
* **Validação Obrigatória:** `npm run lint && npm run build`

---

## Feature 5 — Autenticação e Dashboard Administrativo (`/login` e `/dashboard`)
* **Status:** `[x] Concluída`
* **Onde encontrar a Spec em `especificacao_geral.md`:**
  * **RF06, RF07, RF08 (Login, Proteção de Rota, Gestão de Mensagens e Seleção de Destaques):** Seção `2.1` (linhas 36–41) e Seção `3` (linhas 72–73).
  * **Fluxo e Segurança de Autenticação:** Seção `4` (linhas 96–99) e Seção `8` (linhas 216–223).
  * **Carregamento Sob Demanda (`React.lazy`):** Seção `2.2` (`RNF04` — linha 55).
* **Escopo de Entrega:**
  * Criar `src/context/AuthContext.tsx` e `src/routes/ProtectedRoute.tsx`.
  * Criar `src/pages/LoginPage.tsx` e `src/pages/DashboardPage.tsx` (carregadas com `React.lazy`), permitindo filtrar mensagens (*Todas*, *Respondidas*, *Não respondidas*), marcar como *Respondida* / *Importante* e selecionar os projetos em destaque na Home.
* **Validação Obrigatória:** `npm run lint && npm run build`

---

## Feature 6 — Testes E2E (Playwright), Auditoria de Performance e Documentação Final
* **Status:** `[x] Concluída`
* **Onde encontrar a Spec em `especificacao_geral.md`:**
  * **Estratégia de Testes Automatizados (Playwright):** Seção `2.2` (`RNF05` — linha 60), Seção `9` (linhas 226–238) e Matriz `Req 9` (linha 286).
  * **Critérios de Desempenho e Padronização (README):** Seção `10` (linhas 241–249) e Matriz `Req 8, Req 10` (linhas 285, 287).
* **Escopo de Entrega:**
  * Configurar `playwright.config.ts` e implementar `tests/contact-form.spec.ts` e `tests/dashboard-auth.spec.ts`.
  * Executar todos os testes E2E reais, validar build de produção e atualizar `README.md` com instruções de instalação, variáveis `.env`, arquitetura e convenções de código.
* **Validação Obrigatória:** `npx playwright test && npm run lint && npm run build`

