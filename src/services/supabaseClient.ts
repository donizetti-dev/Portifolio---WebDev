import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const rawSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseUrl = typeof rawSupabaseUrl === 'string' ? rawSupabaseUrl.trim() : '';
const supabaseAnonKey = typeof rawSupabaseAnonKey === 'string' ? rawSupabaseAnonKey.trim() : '';

const hasValidCredentials =
  supabaseUrl.length > 0 &&
  (supabaseUrl.startsWith('https://') || supabaseUrl.startsWith('http://')) &&
  supabaseAnonKey.length > 0;

/**
 * Instância segura do cliente Supabase.
 * Quando `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` não estão definidos no `.env`,
 * permanece `null` e o `dataService` utiliza automaticamente o fallback em `localStorage`.
 */
export const supabase: SupabaseClient | null = hasValidCredentials
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

/**
 * Indica se o ambiente possui integração ativa com o Supabase Cloud.
 */
export function isSupabaseConfigured(): boolean {
  return supabase !== null;
}

export default supabase;
