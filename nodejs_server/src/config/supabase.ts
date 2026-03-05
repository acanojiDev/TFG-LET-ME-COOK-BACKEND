// src/config/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be defined in .env');
}

// Cliente público — para autenticar usuarios (signUp, signInWithPassword, getUser)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente admin — para operaciones privilegiadas (escribir app_metadata, etc.)
// Requiere SUPABASE_SERVICE_ROLE_KEY en .env (nunca exponerla al frontend)
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
  : null;
