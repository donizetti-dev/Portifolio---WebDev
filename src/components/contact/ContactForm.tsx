import React, { useState } from 'react';
import { CheckCircle2, Mail, MessageSquare, Send, User } from 'lucide-react';
import { useContactMessages } from '../../hooks/useContactMessages';
import { Button } from '../ui/Button';
import styles from './ContactForm.module.css';

interface FormValues {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const MIN_NAME_LENGTH = 3;
const MIN_MESSAGE_LENGTH = 10;
const MAX_MESSAGE_LENGTH = 200;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(field: keyof FormValues, value: string): string | undefined {
  const trimmed = value.trim();

  if (field === 'name') {
    if (!trimmed) {
      return 'O nome é obrigatório. Informe seu nome com pelo menos 3 caracteres.';
    }
    if (trimmed.length < MIN_NAME_LENGTH) {
      return 'Informe seu nome com pelo menos 3 caracteres.';
    }
    return undefined;
  }

  if (field === 'email') {
    if (!trimmed) {
      return 'O e-mail é obrigatório. Informe um e-mail válido.';
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      return 'E-mail inválido. Verifique o formato (ex: nome@empresa.com).';
    }
    return undefined;
  }

  if (field === 'message') {
    if (!trimmed) {
      return 'A mensagem é obrigatória. A mensagem deve ter entre 10 e 200 caracteres.';
    }
    if (trimmed.length < MIN_MESSAGE_LENGTH || trimmed.length > MAX_MESSAGE_LENGTH) {
      return 'A mensagem deve ter entre 10 e 200 caracteres.';
    }
    return undefined;
  }

  return undefined;
}

function validateAllFields(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  const nameError = validateField('name', values.name);
  const emailError = validateField('email', values.email);
  const messageError = validateField('message', values.message);

  if (nameError) errors.name = nameError;
  if (emailError) errors.email = emailError;
  if (messageError) errors.message = messageError;

  return errors;
}

export const ContactForm: React.FC = () => {
  const { sendMessage, isSubmitting } = useContactMessages();

  const [values, setValues] = useState<FormValues>({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<keyof FormValues, boolean>>({
    name: false,
    email: false,
    message: false,
  });
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const trimmedMessageLength = values.message.trim().length;
  const rawMessageLength = values.message.length;
  const displayedCount =
    values.message.length > 0 && trimmedMessageLength === 0 ? 0 : rawMessageLength;

  const isCounterValid =
    trimmedMessageLength >= MIN_MESSAGE_LENGTH &&
    trimmedMessageLength <= MAX_MESSAGE_LENGTH &&
    rawMessageLength <= MAX_MESSAGE_LENGTH;
  const isCounterOverLimit =
    rawMessageLength > MAX_MESSAGE_LENGTH || trimmedMessageLength > MAX_MESSAGE_LENGTH;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = event.target;
    const fieldName = name as keyof FormValues;

    setValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    if (submitSuccess) {
      setSubmitSuccess(false);
    }
    if (submitError) {
      setSubmitError(null);
    }

    if (touched[fieldName] || errors[fieldName]) {
      const fieldError = validateField(fieldName, value);
      setErrors((prev) => ({
        ...prev,
        [fieldName]: fieldError,
      }));
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const fieldName = event.target.name as keyof FormValues;
    setTouched((prev) => ({
      ...prev,
      [fieldName]: true,
    }));

    const fieldError = validateField(fieldName, values[fieldName]);
    setErrors((prev) => ({
      ...prev,
      [fieldName]: fieldError,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    setSubmitSuccess(false);
    setSubmitError(null);

    setTouched({
      name: true,
      email: true,
      message: true,
    });

    const validationErrors = validateAllFields(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      const cleanName = values.name.trim();
      const cleanEmail = values.email.trim();
      const cleanMessage = values.message.trim();

      await sendMessage({
        name: cleanName,
        email: cleanEmail,
        subject: `Contato pelo Portfólio — ${cleanName}`,
        message: cleanMessage,
      });

      setValues({
        name: '',
        email: '',
        message: '',
      });
      setErrors({});
      setTouched({
        name: false,
        email: false,
        message: false,
      });
      setSubmitSuccess(true);
    } catch {
      setSubmitError(
        'Não foi possível enviar sua mensagem no momento. Por favor, tente novamente.'
      );
    }
  };

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        void handleSubmit(e);
      }}
      noValidate
      data-testid="contact-form"
      aria-label="Formulário de contato direto"
    >
      {submitSuccess && (
        <div
          className={styles.successBanner}
          role="status"
          aria-live="polite"
          data-testid="contact-success-banner"
        >
          <CheckCircle2 size={18} className={styles.bannerIcon} aria-hidden="true" />
          <div className={styles.bannerTextGroup}>
            <strong className={styles.bannerTitle}>Mensagem enviada com sucesso!</strong>
            <p className={styles.bannerDescription}>
              Obrigado pelo contato. Sua mensagem foi registrada e retornarei em breve.
            </p>
          </div>
        </div>
      )}

      {submitError && (
        <div className={styles.errorBanner} role="alert" data-testid="contact-error-banner">
          <span>{submitError}</span>
        </div>
      )}

      <div className={styles.fieldsRow}>
        {/* Campo Nome */}
        <div className={styles.fieldGroup}>
          <label htmlFor="contact-name" className={styles.label}>
            <User size={14} aria-hidden="true" />
            <span>Nome</span>
            <span className={styles.requiredMark} aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            placeholder="Seu nome completo"
            autoComplete="name"
            aria-required="true"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
            data-testid="contact-name-input"
            className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
          />
          {errors.name && (
            <span
              id="contact-name-error"
              role="alert"
              data-testid="contact-name-error"
              className={styles.fieldError}
            >
              {errors.name}
            </span>
          )}
        </div>

        {/* Campo E-mail */}
        <div className={styles.fieldGroup}>
          <label htmlFor="contact-email" className={styles.label}>
            <Mail size={14} aria-hidden="true" />
            <span>E-mail</span>
            <span className={styles.requiredMark} aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            placeholder="seu.email@empresa.com"
            autoComplete="email"
            aria-required="true"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
            data-testid="contact-email-input"
            className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
          />
          {errors.email && (
            <span
              id="contact-email-error"
              role="alert"
              data-testid="contact-email-error"
              className={styles.fieldError}
            >
              {errors.email}
            </span>
          )}
        </div>
      </div>

      {/* Campo Mensagem com Contador Dinâmico X/200 */}
      <div className={styles.fieldGroup}>
        <div className={styles.labelRow}>
          <label htmlFor="contact-message" className={styles.label}>
            <MessageSquare size={14} aria-hidden="true" />
            <span>Mensagem</span>
            <span className={styles.requiredMark} aria-hidden="true">
              *
            </span>
          </label>

          <span
            id="contact-message-counter"
            data-testid="contact-message-counter"
            aria-live="polite"
            className={`${styles.charCounter} ${
              isCounterOverLimit ? styles.counterInvalid : isCounterValid ? styles.counterValid : ''
            }`}
          >
            {displayedCount}/{MAX_MESSAGE_LENGTH}
          </span>
        </div>

        <textarea
          id="contact-message"
          name="message"
          rows={4}
          value={values.message}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isSubmitting}
          placeholder="Descreva brevemente o projeto, oportunidade ou desafio técnico (entre 10 e 200 caracteres)..."
          aria-required="true"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={
            errors.message
              ? 'contact-message-error contact-message-counter'
              : 'contact-message-counter contact-message-hint'
          }
          data-testid="contact-message-input"
          className={`${styles.textarea} ${errors.message ? styles.inputError : ''}`}
        />

        <div className={styles.messageFooterRow}>
          {errors.message ? (
            <span
              id="contact-message-error"
              role="alert"
              data-testid="contact-message-error"
              className={styles.fieldError}
            >
              {errors.message}
            </span>
          ) : (
            <span id="contact-message-hint" className={styles.fieldHint}>
              Mínimo de {MIN_MESSAGE_LENGTH} e máximo de {MAX_MESSAGE_LENGTH} caracteres.
            </span>
          )}
        </div>
      </div>

      <div className={styles.submitRow}>
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isSubmitting}
          disabled={isSubmitting}
          leftIcon={<Send size={15} aria-hidden="true" />}
          data-testid="contact-submit-button"
        >
          {isSubmitting ? 'Enviando mensagem...' : 'Enviar Mensagem'}
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;
