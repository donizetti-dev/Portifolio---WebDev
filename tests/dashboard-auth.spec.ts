import { expect, test } from '@playwright/test';

test.describe('Suíte 2 — Segurança do Dashboard, Autenticação e Rotas (RF06, RF07, RF08 / Seção 9.2)', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api.github.com/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });
  });

  test('1. Deve bloquear acesso direto a /dashboard sem sessão ativa e redirecionar para /login', async ({
    page,
  }) => {
    await page.goto('/dashboard');

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByTestId('login-form')).toBeVisible();
    await expect(page.getByTestId('dashboard-page')).toHaveCount(0);
  });

  test('2. Deve exibir alerta de erro ao tentar login com credenciais incorretas e permanecer em /login', async ({
    page,
  }) => {
    await page.goto('/login');

    const emailInput = page.getByTestId('login-email-input');
    const passwordInput = page.getByTestId('login-password-input');
    const submitButton = page.getByTestId('login-submit-button');

    await emailInput.fill('admin@donizetti.dev');
    await passwordInput.fill('SenhaIncorreta999!');
    await submitButton.click();

    const errorAlert = page.getByTestId('login-error-alert');
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toContainText(
      'Credenciais inválidas. Verifique o e-mail e a senha informados.'
    );
    await expect(page).toHaveURL(/\/login$/);
  });

  test('3. Deve autenticar com credenciais válidas e permitir filtrar mensagens, alternar status e destacar projetos', async ({
    page,
  }) => {
    await page.goto('/login');

    await page.getByTestId('login-email-input').fill('admin@donizetti.dev');
    await page.getByTestId('login-password-input').fill('Admin@2026!');
    await page.getByTestId('login-submit-button').click();

    // Valida acesso ao /dashboard
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
    await expect(page.getByTestId('dashboard-user-email')).toContainText('admin@donizetti.dev');

    // Valida listagem inicial de mensagens recebidas (seed padrão possui 3 mensagens: 2 não respondidas, 1 respondida)
    const messagesList = page.getByTestId('messages-list');
    await expect(messagesList).toBeVisible();
    await expect(page.getByTestId('stat-total-messages')).toHaveText('3');
    await expect(page.getByTestId('stat-unreplied-messages')).toHaveText('2');
    await expect(page.getByTestId('stat-replied-messages')).toHaveText('1');

    // Valida filtros: Não respondidas (2) e Respondidas (1) e retorno para Todas (3)
    await page.getByTestId('filter-unreplied').click();
    await expect(page.getByTestId('message-card-msg-seed-1')).toBeVisible();
    await expect(page.getByTestId('message-card-msg-seed-2')).toBeVisible();
    await expect(page.getByTestId('message-card-msg-seed-3')).toHaveCount(0);

    await page.getByTestId('filter-replied').click();
    await expect(page.getByTestId('message-card-msg-seed-3')).toBeVisible();
    await expect(page.getByTestId('message-card-msg-seed-1')).toHaveCount(0);

    await page.getByTestId('filter-all').click();
    await expect(page.getByTestId('message-card-msg-seed-1')).toBeVisible();
    await expect(page.getByTestId('message-card-msg-seed-3')).toBeVisible();

    // Valida alternância de status: Marcar msg-seed-1 como Respondida
    const toggleRepliedBtn = page.getByTestId('toggle-replied-msg-seed-1');
    await expect(toggleRepliedBtn).toHaveAttribute('aria-pressed', 'false');
    await toggleRepliedBtn.click();
    await expect(toggleRepliedBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByTestId('stat-replied-messages')).toHaveText('2');
    await expect(page.getByTestId('stat-unreplied-messages')).toHaveText('1');

    // Valida alternância de status: Marcar msg-seed-2 como Importante
    const toggleImportantBtn = page.getByTestId('toggle-important-msg-seed-2');
    await expect(toggleImportantBtn).toHaveAttribute('aria-pressed', 'false');
    await toggleImportantBtn.click();
    await expect(toggleImportantBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByTestId('stat-important-messages')).toHaveText('3');

    // Valida alternância de projeto em destaque na Home
    const featuredList = page.getByTestId('featured-projects-list');
    await expect(featuredList).toBeVisible();
    await expect(page.getByTestId('stat-featured-projects')).toHaveText('4');

    const toggleDocflowFeatured = page.getByTestId('toggle-featured-docflow-rpa-pipeline');
    await expect(toggleDocflowFeatured).toHaveAttribute('aria-pressed', 'false');
    await toggleDocflowFeatured.click();
    await expect(toggleDocflowFeatured).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByTestId('stat-featured-projects')).toHaveText('5');
  });

  test('4. Deve exibir página 404 amigável ao navegar para uma rota inexistente', async ({
    page,
  }) => {
    await page.goto('/rota-inexistente-404');

    const notFoundPage = page.getByTestId('not-found-page');
    await expect(notFoundPage).toBeVisible();
    await expect(notFoundPage).toContainText('Projeto não encontrado');
    await expect(page.getByTestId('not-found-home-link')).toBeVisible();
  });
});
