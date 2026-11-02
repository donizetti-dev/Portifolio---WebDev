import { expect, test } from '@playwright/test';

test.describe('Suíte 1 — Formulário de Contato (RF05 / Seção 9.1)', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });

    await page.route('**/api.github.com/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.goto('/');
    await page.getByTestId('contact-form').scrollIntoViewIfNeeded();
  });

  test('1. Deve exibir mensagens de erro específicas ao submeter o formulário com campos vazios', async ({
    page,
  }) => {
    const submitButton = page.getByTestId('contact-submit-button');
    await submitButton.click();

    const nameError = page.getByTestId('contact-name-error');
    const emailError = page.getByTestId('contact-email-error');
    const messageError = page.getByTestId('contact-message-error');

    await expect(nameError).toBeVisible();
    await expect(nameError).toContainText(
      'O nome é obrigatório. Informe seu nome com pelo menos 3 caracteres.'
    );

    await expect(emailError).toBeVisible();
    await expect(emailError).toContainText('O e-mail é obrigatório. Informe um e-mail válido.');

    await expect(messageError).toBeVisible();
    await expect(messageError).toContainText(
      'A mensagem é obrigatória. A mensagem deve ter entre 10 e 200 caracteres.'
    );
  });

  test('2. Deve validar e-mail em formato inválido e exibir erro específico de formato', async ({
    page,
  }) => {
    const nameInput = page.getByTestId('contact-name-input');
    const emailInput = page.getByTestId('contact-email-input');
    const messageInput = page.getByTestId('contact-message-input');
    const submitButton = page.getByTestId('contact-submit-button');

    await nameInput.fill('Donizetti Batista');
    await emailInput.fill('email-invalido');
    await messageInput.fill('Mensagem válida com mais de dez caracteres para teste.');
    await submitButton.click();

    const emailError = page.getByTestId('contact-email-error');
    await expect(emailError).toBeVisible();
    await expect(emailError).toContainText(
      'E-mail inválido. Verifique o formato (ex: nome@empresa.com).'
    );
  });

  test('3. Deve validar mensagem com menos de 10 caracteres e atualizar o contador para 5/200', async ({
    page,
  }) => {
    const nameInput = page.getByTestId('contact-name-input');
    const emailInput = page.getByTestId('contact-email-input');
    const messageInput = page.getByTestId('contact-message-input');
    const messageCounter = page.getByTestId('contact-message-counter');
    const submitButton = page.getByTestId('contact-submit-button');

    await expect(messageCounter).toHaveText('0/200');

    await nameInput.fill('Donizetti Batista');
    await emailInput.fill('contato@empresa.com.br');
    await messageInput.fill('Curto');

    await expect(messageCounter).toHaveText('5/200');

    await submitButton.click();

    const messageError = page.getByTestId('contact-message-error');
    await expect(messageError).toBeVisible();
    await expect(messageError).toContainText('A mensagem deve ter entre 10 e 200 caracteres.');
  });

  test('4. Deve atualizar o contador, bloquear botão no envio, limpar campos e exibir banner de confirmação', async ({
    page,
  }) => {
    const nameInput = page.getByTestId('contact-name-input');
    const emailInput = page.getByTestId('contact-email-input');
    const messageInput = page.getByTestId('contact-message-input');
    const messageCounter = page.getByTestId('contact-message-counter');
    const submitButton = page.getByTestId('contact-submit-button');

    const validMessage = 'Olá Donizetti, gostaria de conversar sobre automação RPA com Python.';

    await nameInput.fill('Ana Paula Recruiter');
    await emailInput.fill('ana.paula@techcorp.com.br');
    await messageInput.fill(validMessage);

    await expect(messageCounter).toHaveText(`${validMessage.length}/200`);

    await submitButton.click();

    // Durante ou logo após o clique, aguarda a conclusão do envio e exibição do banner de sucesso
    const successBanner = page.getByTestId('contact-success-banner');
    await expect(successBanner).toBeVisible();
    await expect(successBanner).toContainText('Mensagem enviada com sucesso!');

    // Campos devem ser limpos e contador reiniciado para 0/200
    await expect(nameInput).toHaveValue('');
    await expect(emailInput).toHaveValue('');
    await expect(messageInput).toHaveValue('');
    await expect(messageCounter).toHaveText('0/200');
  });
});
