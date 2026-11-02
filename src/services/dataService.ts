import { DEFAULT_FEATURED_PROJECT_SLUGS } from '../config/projectsCatalog';
import type { ContactMessage, CreateContactMessageInput } from '../types';
import { isSupabaseConfigured, supabase } from './supabaseClient';

const LOCAL_MESSAGES_STORAGE_KEY = 'donizetti_portfolio_contact_messages_v1';
const LOCAL_FEATURED_SLUGS_STORAGE_KEY = 'donizetti_portfolio_featured_slugs_v1';
const SETTINGS_ROW_ID = 'featured_slugs';

/**
 * Seed inicial para o modo de contingência local (`localStorage`),
 * garantindo que o Dashboard e os filtros (Todas / Respondidas / Não respondidas)
 * já possuam dados realistas para inspeção e testes E2E.
 */
const INITIAL_MESSAGES_SEED: ContactMessage[] = [
  {
    id: 'msg-seed-1',
    name: 'Mariana Costa — Tech Recruiter',
    email: 'mariana.costa@enterprise-tech.com.br',
    subject: 'Oportunidade Engenheiro de Automação RPA & Python',
    message:
      'Olá Donizetti! Vimos sua experiência na MV3 Tecnologia com Python, Selenium e SQL Server. Podemos agendar uma conversa técnica esta semana?',
    is_replied: false,
    is_answered: false,
    is_important: true,
    created_at: '2025-02-26T14:20:00.000Z',
  },
  {
    id: 'msg-seed-2',
    name: 'Carlos Eduardo Silva',
    email: 'carlos.silva@logistica-integra.com',
    subject: 'Consultoria em Integração de APIs e Extração de PDFs',
    message:
      'Precisamos automatizar a leitura de notas e relatórios em PDF integrando ao nosso SQL Server. Gostaria de discutir um escopo de projeto.',
    is_replied: false,
    is_answered: false,
    is_important: false,
    created_at: '2025-02-24T10:05:00.000Z',
  },
  {
    id: 'msg-seed-3',
    name: 'Lucas Mendes — FIAP',
    email: 'lucas.mendes@fiap.com.br',
    subject: 'Parabéns pelo projeto InfraWatch na Global Solution',
    message:
      'Excelente arquitetura no projeto de monitoramento ambiental com Python! Vamos manter contato para os próximos desafios acadêmicos.',
    is_replied: true,
    is_answered: true,
    is_important: true,
    created_at: '2025-02-18T17:45:00.000Z',
  },
];

interface RawContactMessageRow {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_replied?: boolean;
  is_answered?: boolean;
  is_important?: boolean;
  created_at: string;
}

function normalizeMessage(row: RawContactMessageRow): ContactMessage {
  const replied = Boolean(row.is_replied ?? row.is_answered ?? false);
  return {
    id: String(row.id),
    name: row.name,
    email: row.email,
    subject: row.subject,
    message: row.message,
    is_replied: replied,
    is_answered: replied,
    is_important: Boolean(row.is_important ?? false),
    created_at: row.created_at || new Date().toISOString(),
  };
}

function readLocalMessages(): ContactMessage[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [...INITIAL_MESSAGES_SEED];
  }

  try {
    const raw = window.localStorage.getItem(LOCAL_MESSAGES_STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(
        LOCAL_MESSAGES_STORAGE_KEY,
        JSON.stringify(INITIAL_MESSAGES_SEED)
      );
      return [...INITIAL_MESSAGES_SEED];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.map((item) => normalizeMessage(item as RawContactMessageRow));
    }
  } catch {
    // Fallback em caso de JSON inválido no localStorage
  }

  return [...INITIAL_MESSAGES_SEED];
}

function writeLocalMessages(messages: ContactMessage[]): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    window.localStorage.setItem(LOCAL_MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // Ignora erro de quota excedida
  }
}

function readLocalFeaturedSlugs(): string[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [...DEFAULT_FEATURED_PROJECT_SLUGS];
  }

  try {
    const raw = window.localStorage.getItem(LOCAL_FEATURED_SLUGS_STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(
        LOCAL_FEATURED_SLUGS_STORAGE_KEY,
        JSON.stringify(DEFAULT_FEATURED_PROJECT_SLUGS)
      );
      return [...DEFAULT_FEATURED_PROJECT_SLUGS];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed) && parsed.every((item) => typeof item === 'string')) {
      return parsed;
    }
  } catch {
    // Fallback para os destaques padrão do catálogo
  }

  return [...DEFAULT_FEATURED_PROJECT_SLUGS];
}

function writeLocalFeaturedSlugs(slugs: string[]): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    window.localStorage.setItem(LOCAL_FEATURED_SLUGS_STORAGE_KEY, JSON.stringify(slugs));
  } catch {
    // Ignora erro de quota excedida
  }
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Lista todas as mensagens de contato ordenadas da mais recente para a mais antiga.
 * Tenta consultar o Supabase quando configurado e realiza fallback automático para `localStorage`.
 */
export async function getContactMessages(): Promise<ContactMessage[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        return data.map((row) => normalizeMessage(row as RawContactMessageRow));
      }
    } catch {
      // Continua para o fallback em localStorage
    }
  }

  const messages = readLocalMessages();
  return messages.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

/**
 * Cria uma nova mensagem de contato enviada pelo formulário público.
 * Inclui leve latência no modo local para garantir feedback visual de spinner/disabled (RF04/RF05).
 */
export async function createContactMessage(
  input: CreateContactMessageInput
): Promise<ContactMessage> {
  const cleanInput: CreateContactMessageInput = {
    name: input.name.trim(),
    email: input.email.trim(),
    subject: input.subject.trim(),
    message: input.message.trim(),
  };

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([
          {
            name: cleanInput.name,
            email: cleanInput.email,
            subject: cleanInput.subject,
            message: cleanInput.message,
            is_replied: false,
            is_important: false,
          },
        ])
        .select('*')
        .single();

      if (!error && data) {
        return normalizeMessage(data as RawContactMessageRow);
      }
    } catch {
      // Fallback transparente para localStorage
    }
  }

  await delay(250);

  const newMessage: ContactMessage = {
    id: generateId(),
    name: cleanInput.name,
    email: cleanInput.email,
    subject: cleanInput.subject,
    message: cleanInput.message,
    is_replied: false,
    is_answered: false,
    is_important: false,
    created_at: new Date().toISOString(),
  };

  const currentMessages = readLocalMessages();
  const updatedMessages = [newMessage, ...currentMessages];
  writeLocalMessages(updatedMessages);

  return newMessage;
}

/**
 * Alterna o status `is_replied` / `is_answered` de uma mensagem de contato.
 */
export async function toggleMessageReplied(
  id: string,
  nextValue?: boolean
): Promise<ContactMessage> {
  const localMessages = readLocalMessages();
  const existing = localMessages.find((msg) => msg.id === id);
  const resolvedNext =
    typeof nextValue === 'boolean' ? nextValue : !(existing?.is_replied ?? false);

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .update({ is_replied: resolvedNext })
        .eq('id', id)
        .select('*')
        .single();

      if (!error && data) {
        return normalizeMessage(data as RawContactMessageRow);
      }
    } catch {
      // Continua no fallback local
    }
  }

  const updatedMessages = localMessages.map((msg) =>
    msg.id === id
      ? {
          ...msg,
          is_replied: resolvedNext,
          is_answered: resolvedNext,
        }
      : msg
  );

  writeLocalMessages(updatedMessages);

  const updated = updatedMessages.find((msg) => msg.id === id);
  if (!updated) {
    throw new Error(`Mensagem com ID "${id}" não encontrada.`);
  }
  return updated;
}

/**
 * Alterna o status `is_important` de uma mensagem de contato.
 */
export async function toggleMessageImportant(
  id: string,
  nextValue?: boolean
): Promise<ContactMessage> {
  const localMessages = readLocalMessages();
  const existing = localMessages.find((msg) => msg.id === id);
  const resolvedNext =
    typeof nextValue === 'boolean' ? nextValue : !(existing?.is_important ?? false);

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .update({ is_important: resolvedNext })
        .eq('id', id)
        .select('*')
        .single();

      if (!error && data) {
        return normalizeMessage(data as RawContactMessageRow);
      }
    } catch {
      // Continua no fallback local
    }
  }

  const updatedMessages = localMessages.map((msg) =>
    msg.id === id
      ? {
          ...msg,
          is_important: resolvedNext,
        }
      : msg
  );

  writeLocalMessages(updatedMessages);

  const updated = updatedMessages.find((msg) => msg.id === id);
  if (!updated) {
    throw new Error(`Mensagem com ID "${id}" não encontrada.`);
  }
  return updated;
}

/**
 * Obtém a lista de slugs dos projetos marcados como destaque na Home.
 * Consulta `portfolio_settings` no Supabase ou utiliza o fallback local em `localStorage`.
 */
export async function getFeaturedProjectSlugs(): Promise<string[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('portfolio_settings')
        .select('featured_project_slugs, slugs')
        .eq('id', SETTINGS_ROW_ID)
        .maybeSingle();

      if (!error && data) {
        const record = data as { featured_project_slugs?: string[]; slugs?: string[] };
        const slugs = record.featured_project_slugs ?? record.slugs;
        if (Array.isArray(slugs)) {
          writeLocalFeaturedSlugs(slugs);
          return slugs;
        }
      }
    } catch {
      // Continua no fallback local
    }
  }

  return readLocalFeaturedSlugs();
}

/**
 * Salva a lista atualizada de slugs dos projetos em destaque na Home.
 */
export async function saveFeaturedProjectSlugs(slugs: string[]): Promise<string[]> {
  const uniqueSlugs = Array.from(new Set(slugs.map((s) => s.trim()).filter(Boolean)));

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('portfolio_settings').upsert(
        {
          id: SETTINGS_ROW_ID,
          featured_project_slugs: uniqueSlugs,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );
    } catch {
      // Mantém sincronizado no fallback local mesmo sem tabela remota
    }
  }

  writeLocalFeaturedSlugs(uniqueSlugs);
  return uniqueSlugs;
}

/**
 * Alterna a presença de um `slug` na lista de projetos em destaque.
 */
export async function toggleFeaturedProjectSlug(slug: string): Promise<string[]> {
  const current = await getFeaturedProjectSlugs();
  const exists = current.includes(slug);
  const next = exists ? current.filter((item) => item !== slug) : [...current, slug];
  return saveFeaturedProjectSlugs(next);
}

export const dataService = {
  getContactMessages,
  listContactMessages: getContactMessages,
  createContactMessage,
  toggleMessageReplied,
  toggleMessageAnswered: toggleMessageReplied,
  toggleMessageImportant,
  getFeaturedProjectSlugs,
  saveFeaturedProjectSlugs,
  updateFeaturedProjectSlugs: saveFeaturedProjectSlugs,
  toggleFeaturedProjectSlug,
};

export default dataService;
