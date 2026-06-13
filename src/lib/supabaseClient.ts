import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verificación para evitar el crash crítico en producción
const finalUrl = supabaseUrl && supabaseUrl.length > 0 ? supabaseUrl : 'https://placeholder-project.supabase.co';
const finalKey = supabaseAnonKey && supabaseAnonKey.length > 0 ? supabaseAnonKey : 'placeholder-key';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ERROR: Supabase credentials missing. Check Vercel Environment Variables.');
}

export const supabase = createClient(finalUrl, finalKey);
