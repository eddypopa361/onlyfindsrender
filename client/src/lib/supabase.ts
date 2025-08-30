import { createClient } from '@supabase/supabase-js'

// For production, these would come from build-time environment variables
// For development, we'll handle them via runtime configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || (window as any).__SUPABASE_URL__ || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || (window as any).__SUPABASE_ANON_KEY__ || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Admin features will be disabled.')
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export type { User } from '@supabase/supabase-js'