import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_KEY

// Feature flag to enforce Supabase-only mode
const USE_SUPABASE_ONLY = process.env.USE_SUPABASE_ONLY !== 'false'

// Configuration validation
export const supabaseConfig = {
  url: supabaseUrl,
  serviceKey: supabaseServiceRole,
  isConfigured: !!(supabaseUrl && supabaseServiceRole),
  useSupabaseOnly: USE_SUPABASE_ONLY
}

// Create Supabase client with service role key for server operations
export const supabase = supabaseConfig.isConfigured 
  ? createClient(supabaseUrl!, supabaseServiceRole!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

// Error handling for missing configuration
export function validateSupabaseConfig() {
  if (USE_SUPABASE_ONLY && !supabaseConfig.isConfigured) {
    const missingVars = []
    if (!supabaseUrl) missingVars.push('SUPABASE_URL')
    if (!supabaseServiceRole) missingVars.push('SUPABASE_SERVICE_ROLE')
    
    throw new Error(
      `Supabase configuration missing. Please add these environment variables to Replit Secrets:\n\n` +
      missingVars.map(v => `❌ ${v}`).join('\n') + 
      `\n\nGet these values from your Supabase project dashboard → Settings → API`
    )
  }
}

// Log configuration status
if (supabaseConfig.isConfigured) {
  console.log('✅ Server Supabase configured with service role')
} else {
  console.warn('⚠️ Server Supabase not configured')
  console.warn('Missing:', 
    !supabaseUrl ? 'SUPABASE_URL' : '', 
    !supabaseServiceRole ? 'SUPABASE_SERVICE_ROLE' : ''
  )
}

export type { User } from '@supabase/supabase-js'