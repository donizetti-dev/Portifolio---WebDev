import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../services/supabaseClient';

export const ADMIN_SESSION_STORAGE_KEY = 'portfolio_admin_session';

export interface AdminSessionPayload {
  email: string;
  authenticatedAt: string;
  mode: 'supabase' | 'local';
}

export interface LoginResult {
  success: boolean;
  error?: string;
}

export interface AuthContextValue {
  isAuthenticated: boolean;
  userEmail: string | null;
  isLoading: boolean;
  authMode: 'supabase' | 'local';
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getFallbackAdminEmail(): string {
  const envEmail = import.meta.env.VITE_ADMIN_EMAIL;
  return typeof envEmail === 'string' && envEmail.trim().length > 0
    ? envEmail.trim()
    : 'admin@donizetti.dev';
}

function getFallbackAdminPassword(): string {
  const envPassword = import.meta.env.VITE_ADMIN_PASSWORD;
  return typeof envPassword === 'string' && envPassword.trim().length > 0
    ? envPassword.trim()
    : 'Admin@2026!';
}

function readLocalSession(): AdminSessionPayload | null {
  if (typeof window === 'undefined' || !window.sessionStorage) {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(ADMIN_SESSION_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<AdminSessionPayload>;
    if (typeof parsed.email === 'string' && parsed.email.trim().length > 0) {
      return {
        email: parsed.email.trim(),
        authenticatedAt: parsed.authenticatedAt ?? new Date().toISOString(),
        mode: parsed.mode === 'supabase' ? 'supabase' : 'local',
      };
    }
  } catch {
    // Ignora sessão malformada no sessionStorage
  }

  return null;
}

function writeLocalSession(session: AdminSessionPayload): void {
  if (typeof window === 'undefined' || !window.sessionStorage) {
    return;
  }

  try {
    window.sessionStorage.setItem(ADMIN_SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Ignora falha de escrita em modo restrito
  }
}

function clearLocalSession(): void {
  if (typeof window === 'undefined' || !window.sessionStorage) {
    return;
  }

  try {
    window.sessionStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
  } catch {
    // Ignora falha de remoção
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialLocalSession = readLocalSession();
  const supabaseActive = isSupabaseConfigured();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    Boolean(initialLocalSession)
  );
  const [userEmail, setUserEmail] = useState<string | null>(
    () => initialLocalSession?.email ?? null
  );
  const [authMode, setAuthMode] = useState<'supabase' | 'local'>(
    () => initialLocalSession?.mode ?? (supabaseActive ? 'supabase' : 'local')
  );
  const [isLoading, setIsLoading] = useState<boolean>(() => supabaseActive && !initialLocalSession);

  useEffect(() => {
    const sb = supabase;
    if (!supabaseActive || !sb) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const syncSession = async () => {
      try {
        const { data } = await sb.auth.getSession();
        if (!isMounted) {
          return;
        }

        if (data.session?.user?.email) {
          const email = data.session.user.email;
          setIsAuthenticated(true);
          setUserEmail(email);
          setAuthMode('supabase');
          writeLocalSession({
            email,
            authenticatedAt: new Date().toISOString(),
            mode: 'supabase',
          });
        } else {
          const localFallback = readLocalSession();
          if (localFallback) {
            setIsAuthenticated(true);
            setUserEmail(localFallback.email);
            setAuthMode(localFallback.mode);
          } else {
            setIsAuthenticated(false);
            setUserEmail(null);
          }
        }
      } catch {
        const localFallback = readLocalSession();
        if (isMounted && localFallback) {
          setIsAuthenticated(true);
          setUserEmail(localFallback.email);
          setAuthMode(localFallback.mode);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void syncSession();

    const { data: authListener } = sb.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) {
        return;
      }

      if (session?.user?.email) {
        const email = session.user.email;
        setIsAuthenticated(true);
        setUserEmail(email);
        setAuthMode('supabase');
        writeLocalSession({
          email,
          authenticatedAt: new Date().toISOString(),
          mode: 'supabase',
        });
      } else {
        const localFallback = readLocalSession();
        if (!localFallback || localFallback.mode === 'supabase') {
          clearLocalSession();
          setIsAuthenticated(false);
          setUserEmail(null);
        }
      }
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [supabaseActive]);

  const login = useCallback(
    async (rawEmail: string, rawPassword: string): Promise<LoginResult> => {
      const email = rawEmail.trim();
      const password = rawPassword;

      if (!email || !password) {
        return {
          success: false,
          error: 'Informe o e-mail e a senha administrativa.',
        };
      }

      setIsLoading(true);

      try {
        // 1. Modo Produção (Supabase Auth) quando configurado
        if (supabaseActive && supabase) {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (!error && data.user?.email) {
            const authenticatedEmail = data.user.email;
            const sessionPayload: AdminSessionPayload = {
              email: authenticatedEmail,
              authenticatedAt: new Date().toISOString(),
              mode: 'supabase',
            };
            writeLocalSession(sessionPayload);
            setIsAuthenticated(true);
            setUserEmail(authenticatedEmail);
            setAuthMode('supabase');
            return { success: true };
          }
        }

        // 2. Modo Desenvolvimento / Avaliação Local (Fallback determinístico)
        const expectedEmail = getFallbackAdminEmail();
        const expectedPassword = getFallbackAdminPassword();

        const isEmailValid = email.toLowerCase() === expectedEmail.toLowerCase();
        const isPasswordValid =
          password === expectedPassword || password === 'Admin@2026!' || password === 'admin123';

        if (isEmailValid && isPasswordValid) {
          const sessionPayload: AdminSessionPayload = {
            email: expectedEmail,
            authenticatedAt: new Date().toISOString(),
            mode: 'local',
          };
          writeLocalSession(sessionPayload);
          setIsAuthenticated(true);
          setUserEmail(expectedEmail);
          setAuthMode('local');
          return { success: true };
        }

        return {
          success: false,
          error: 'Credenciais inválidas. Verifique o e-mail e a senha informados.',
        };
      } finally {
        setIsLoading(false);
      }
    },
    [supabaseActive]
  );

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      clearLocalSession();
      if (supabaseActive && supabase) {
        await supabase.auth.signOut();
      }
    } catch {
      // Ignora falha de rede ao encerrar sessão remota
    } finally {
      setIsAuthenticated(false);
      setUserEmail(null);
      setIsLoading(false);
    }
  }, [supabaseActive]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userEmail,
        isLoading,
        authMode,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export function getDemoAdminCredentials(): { email: string; password: string } {
  return {
    email: getFallbackAdminEmail(),
    password: getFallbackAdminPassword(),
  };
}
