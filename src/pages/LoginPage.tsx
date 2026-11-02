import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, KeyRound, Lock, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isSupabaseConfigured } from '../services/supabaseClient';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import styles from './LoginPage.module.css';

export const LoginPage: React.FC = () => {
  const { isAuthenticated, isLoading, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabaseActive = isSupabaseConfigured();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage('Informe o e-mail administrativo para continuar.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMessage('Informe um endereço de e-mail válido.');
      return;
    }

    if (!password || password.trim().length < 4) {
      setErrorMessage('Informe uma senha válida para autenticação.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(trimmedEmail, password);
      if (result.success) {
        navigate('/dashboard', { replace: true });
      } else {
        setErrorMessage(
          result.error ?? 'Credenciais inválidas. Verifique o e-mail e a senha informados.'
        );
      }
    } catch {
      setErrorMessage('Ocorreu um erro inesperado ao tentar autenticar. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.page} aria-labelledby="login-heading">
      <div className={`container ${styles.wrapper}`}>
        <Link to="/" className={styles.backLink}>
          <ArrowLeft size={15} aria-hidden="true" />
          <span>Voltar ao Portfólio Público</span>
        </Link>

        <div className={styles.card}>
          <header className={styles.header}>
            <div className={styles.eyebrowRow}>
              <span className={styles.eyebrow}>
                <ShieldCheck size={15} aria-hidden="true" />
                <span>Acesso Restrito // Admin</span>
              </span>
              <Badge variant={supabaseActive ? 'electric' : 'outline'}>
                {supabaseActive ? 'Supabase Auth' : 'Modo Local / Fallback'}
              </Badge>
            </div>

            <h1 id="login-heading" className={styles.title}>
              Autenticação do{' '}
              <span className="text-outline" data-text="Dashboard">
                Dashboard
              </span>
            </h1>

            <p className={styles.subtitle}>
              Acesse o painel administrativo para gerenciar mensagens de contato e selecionar os
              projetos em destaque exibidos na página inicial.
            </p>
          </header>

          {errorMessage && (
            <div
              className={styles.errorAlert}
              role="alert"
              aria-live="assertive"
              data-testid="login-error-alert"
            >
              <AlertCircle size={18} className={styles.errorIcon} aria-hidden="true" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form className={styles.form} onSubmit={handleSubmit} noValidate data-testid="login-form">
            <div className={styles.field}>
              <label htmlFor="admin-email" className={styles.label}>
                E-mail Administrativo
              </label>
              <div className={styles.inputWrapper}>
                <Mail size={16} className={styles.inputIcon} aria-hidden="true" />
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  placeholder="seu.email@dominio.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className={styles.input}
                  required
                  disabled={isSubmitting}
                  data-testid="login-email-input"
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="admin-password" className={styles.label}>
                Senha de Acesso
              </label>
              <div className={styles.inputWrapper}>
                <Lock size={16} className={styles.inputIcon} aria-hidden="true" />
                <input
                  id="admin-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className={styles.input}
                  required
                  disabled={isSubmitting}
                  data-testid="login-password-input"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting || isLoading}
              leftIcon={<KeyRound size={17} aria-hidden="true" />}
              data-testid="login-submit-button"
            >
              Entrar no Dashboard
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
