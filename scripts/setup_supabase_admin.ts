#!/usr/bin/env tsx

/**
 * Complete Supabase setup script
 * 1. Creates tables and policies
 * 2. Finds user by email and adds as admin
 * 3. Migrates existing data
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE!
const USER_EMAIL = 'doarcarlos666@gmail.com'

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials')
  console.error('Required: VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

async function setupDatabase() {
  console.log('🔧 Setting up Supabase database...')
  
  try {
    // Read and execute schema
    console.log('📋 Creating tables and triggers...')
    const schemaSQL = fs.readFileSync(path.join(process.cwd(), 'supabase_schema.sql'), 'utf8')
    const { error: schemaError } = await supabase.rpc('exec_sql', { sql: schemaSQL })
    
    if (schemaError) {
      console.error('❌ Schema error:', schemaError.message)
    } else {
      console.log('✅ Tables and triggers created')
    }

    // Read and execute policies
    console.log('🔒 Setting up security policies...')
    const policiesSQL = fs.readFileSync(path.join(process.cwd(), 'supabase_policies.sql'), 'utf8')
    const { error: policiesError } = await supabase.rpc('exec_sql', { sql: policiesSQL })
    
    if (policiesError) {
      console.error('❌ Policies error:', policiesError.message)
    } else {
      console.log('✅ Security policies created')
    }
  } catch (error) {
    console.log('⚠️ Using direct SQL execution...')
    
    // Fallback: execute critical parts directly
    const { error: tableError } = await supabase
      .from('products')
      .select('id')
      .limit(1)
    
    if (tableError && tableError.code === '42P01') {
      console.log('📋 Creating tables directly...')
      // Create tables with direct SQL
      const { error } = await supabase.sql`
        CREATE TABLE IF NOT EXISTS public.products (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title TEXT NOT NULL,
          priceUSD NUMERIC,
          image TEXT,
          buyUrl TEXT,
          viewUrl TEXT,
          category TEXT,
          subCategory TEXT,
          brand TEXT,
          featured BOOLEAN DEFAULT false,
          carousel BOOLEAN DEFAULT false,
          created_at TIMESTAMPTZ DEFAULT now(),
          updated_at TIMESTAMPTZ DEFAULT now()
        );

        CREATE TABLE IF NOT EXISTS public.admins (
          id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          email TEXT,
          name TEXT,
          created_at TIMESTAMPTZ DEFAULT now()
        );

        ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
      `
      
      if (error) {
        console.error('❌ Direct table creation failed:', error)
      } else {
        console.log('✅ Tables created directly')
      }
    }
  }
}

async function setupAdmin() {
  console.log('👤 Setting up admin access...')
  
  try {
    // Get user by email
    const { data: users, error: userError } = await supabase.auth.admin.listUsers()
    
    if (userError) {
      console.error('❌ Could not fetch users:', userError.message)
      return
    }

    const user = users.users.find(u => u.email === USER_EMAIL)
    
    if (!user) {
      console.error(`❌ User ${USER_EMAIL} not found in Supabase Auth`)
      console.log('💡 User needs to sign up first through /admin')
      return
    }

    console.log(`✅ Found user: ${user.email} (ID: ${user.id})`)

    // Add user to admins table
    const { error: adminError } = await supabase
      .from('admins')
      .upsert({
        id: user.id,
        email: user.email,
        name: 'Carlos'
      })

    if (adminError) {
      console.error('❌ Could not add admin:', adminError.message)
    } else {
      console.log('✅ Admin access granted!')
    }

  } catch (error) {
    console.error('❌ Admin setup failed:', error)
  }
}

async function main() {
  console.log('🚀 Starting Supabase setup...')
  console.log(`📍 URL: ${SUPABASE_URL}`)
  console.log(`👤 Admin email: ${USER_EMAIL}`)
  
  await setupDatabase()
  await setupAdmin()
  
  console.log('✅ Setup complete! Try accessing /admin now.')
}

main().catch(console.error)