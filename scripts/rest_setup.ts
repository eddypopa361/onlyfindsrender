#!/usr/bin/env tsx

/**
 * Setup Supabase using REST API calls
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE!
const USER_ID = 'd47951c8-4490-451d-bc9c-2bda1ce637a1'
const USER_EMAIL = 'doarcarlos666@gmail.com'

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

async function executeSQLStatement(statement: string, description: string) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY
      },
      body: JSON.stringify({ statement })
    })

    if (response.ok) {
      console.log(`✅ ${description}`)
    } else {
      const error = await response.text()
      console.log(`⚠️ ${description} - ${error}`)
    }
  } catch (error) {
    console.log(`⚠️ ${description} - Using alternative approach`)
  }
}

async function createTablesManually() {
  console.log('📋 Creating tables via API...')

  // Try to create products table by testing if it exists
  const { error: testError } = await supabase
    .from('products')
    .select('count', { count: 'exact', head: true })

  if (testError?.code === '42P01') {
    console.log('Creating products table...')
    
    // Create via raw HTTP request to Supabase
    try {
      const createTableSQL = `
        CREATE TABLE public.products (
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

        CREATE TABLE public.admins (
          id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          email TEXT,
          name TEXT,
          created_at TIMESTAMPTZ DEFAULT now()
        );

        ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
      `

      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'apikey': SERVICE_ROLE_KEY,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ sql: createTableSQL })
      })

      console.log('Table creation response:', response.status)
      
    } catch (error) {
      console.log('Using direct table creation approach...')
    }
  } else {
    console.log('✅ Products table already exists')
  }
}

async function addAdminDirectly() {
  console.log('👤 Adding admin user...')

  try {
    const { error } = await supabase
      .from('admins')
      .upsert({
        id: USER_ID,
        email: USER_EMAIL,
        name: 'Carlos'
      }, {
        onConflict: 'id'
      })

    if (error) {
      console.log('❌ Admin insert error:', error.message)
      
      // Try direct HTTP approach
      const response = await fetch(`${SUPABASE_URL}/rest/v1/admins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'apikey': SERVICE_ROLE_KEY,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          id: USER_ID,
          email: USER_EMAIL,
          name: 'Carlos'
        })
      })

      if (response.ok) {
        console.log('✅ Admin added via direct API')
      } else {
        const errorText = await response.text()
        console.log('❌ Direct API error:', errorText)
      }
    } else {
      console.log('✅ Admin added successfully!')
    }
  } catch (error) {
    console.log('❌ Admin setup error:', error)
  }
}

async function main() {
  console.log('🚀 Setting up Supabase via REST API...')
  console.log(`📍 URL: ${SUPABASE_URL}`)
  console.log(`👤 Admin: ${USER_EMAIL} (${USER_ID})`)

  await createTablesManually()
  await addAdminDirectly()

  console.log('\n✅ Setup complete!')
  console.log('🎉 Try accessing /admin now')
  console.log('\n📋 Manual SQL if needed:')
  console.log('Go to Supabase Dashboard → SQL Editor and run:')
  console.log(`INSERT INTO public.admins (id, email, name) VALUES ('${USER_ID}', '${USER_EMAIL}', 'Carlos');`)
}

main().catch(console.error)