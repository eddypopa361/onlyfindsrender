import { createClient } from '@supabase/supabase-js'

// Get environment variables with clear error handling
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Feature flag to enforce Supabase-only mode
const USE_SUPABASE_ONLY = import.meta.env.VITE_USE_SUPABASE_ONLY !== 'false'

// Configuration validation
export const supabaseConfig = {
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
  isConfigured: !!(supabaseUrl && supabaseAnonKey),
  useSupabaseOnly: USE_SUPABASE_ONLY
}

// Create Supabase client or null if not configured
export const supabase = supabaseConfig.isConfigured 
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null

// Error handling for missing configuration
export function validateSupabaseConfig() {
  if (USE_SUPABASE_ONLY && !supabaseConfig.isConfigured) {
    const missingVars = []
    if (!supabaseUrl) missingVars.push('VITE_SUPABASE_URL')
    if (!supabaseAnonKey) missingVars.push('VITE_SUPABASE_ANON_KEY')
    
    throw new Error(
      `Supabase configuration missing. Please add these environment variables to Replit Secrets:\n\n` +
      missingVars.map(v => `❌ ${v}`).join('\n') + 
      `\n\nGet these values from your Supabase project dashboard → Settings → API`
    )
  }
}

// Log configuration status in development
if (import.meta.env.DEV) {
  if (supabaseConfig.isConfigured) {
    console.log('✅ Supabase configured')
  } else {
    console.warn('⚠️ Supabase not configured. Admin features disabled.')
    console.warn('Missing:', 
      !supabaseUrl ? 'VITE_SUPABASE_URL' : '', 
      !supabaseAnonKey ? 'VITE_SUPABASE_ANON_KEY' : ''
    )
  }
}

export type { User } from '@supabase/supabase-js'