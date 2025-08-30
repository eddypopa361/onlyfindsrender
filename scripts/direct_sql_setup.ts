#!/usr/bin/env tsx

/**
 * Direct SQL setup for Supabase
 * Uses individual SQL statements to create tables and add admin
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE!
const USER_ID = 'd47951c8-4490-451d-bc9c-2bda1ce637a1' // Found from previous run
const USER_EMAIL = 'doarcarlos666@gmail.com'

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

async function createTables() {
  console.log('📋 Creating products table...')
  
  const { error: productsError } = await supabase.sql`
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
    )
  `
  
  if (productsError) {
    console.error('❌ Products table error:', productsError)
  } else {
    console.log('✅ Products table created')
  }

  console.log('👤 Creating admins table...')
  
  const { error: adminsError } = await supabase.sql`
    CREATE TABLE IF NOT EXISTS public.admins (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      email TEXT,
      name TEXT,
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `
  
  if (adminsError) {
    console.error('❌ Admins table error:', adminsError)
  } else {
    console.log('✅ Admins table created')
  }
}

async function enableRLS() {
  console.log('🔒 Enabling Row Level Security...')
  
  const { error: rlsError } = await supabase.sql`
    ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
  `
  
  if (rlsError) {
    console.error('❌ RLS error:', rlsError)
  } else {
    console.log('✅ Row Level Security enabled')
  }
}

async function createPolicies() {
  console.log('📝 Creating security policies...')
  
  // Drop existing policies
  await supabase.sql`
    DROP POLICY IF EXISTS "Admin only select on products" ON public.products;
    DROP POLICY IF EXISTS "Admin only insert on products" ON public.products;
    DROP POLICY IF EXISTS "Admin only update on products" ON public.products;
    DROP POLICY IF EXISTS "Admin only delete on products" ON public.products;
    DROP POLICY IF EXISTS "Admins can view admin records" ON public.admins;
    DROP POLICY IF EXISTS "Admins can insert admin records" ON public.admins;
    DROP POLICY IF EXISTS "Admins can delete admin records" ON public.admins;
  `
  
  // Create products policies
  const { error: policiesError } = await supabase.sql`
    CREATE POLICY "Admin only select on products" ON public.products
        FOR SELECT USING (
            EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
        );

    CREATE POLICY "Admin only insert on products" ON public.products
        FOR INSERT WITH CHECK (
            EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
        );

    CREATE POLICY "Admin only update on products" ON public.products
        FOR UPDATE USING (
            EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
        ) WITH CHECK (
            EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
        );

    CREATE POLICY "Admin only delete on products" ON public.products
        FOR DELETE USING (
            EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
        );

    CREATE POLICY "Admins can view admin records" ON public.admins
        FOR SELECT USING (
            EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
        );

    CREATE POLICY "Admins can insert admin records" ON public.admins
        FOR INSERT WITH CHECK (
            EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
        );

    CREATE POLICY "Admins can delete admin records" ON public.admins
        FOR DELETE USING (
            EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
        );
  `
  
  if (policiesError) {
    console.error('❌ Policies error:', policiesError)
  } else {
    console.log('✅ Security policies created')
  }
}

async function addAdmin() {
  console.log('👤 Adding admin user...')
  
  const { error: adminError } = await supabase
    .from('admins')
    .upsert({
      id: USER_ID,
      email: USER_EMAIL,
      name: 'Carlos'
    })

  if (adminError) {
    console.error('❌ Could not add admin:', adminError)
  } else {
    console.log('✅ Admin access granted!')
    console.log(`👤 ${USER_EMAIL} is now an admin`)
  }
}

async function main() {
  console.log('🚀 Setting up Supabase with direct SQL...')
  console.log(`📍 URL: ${SUPABASE_URL}`)
  console.log(`👤 Admin: ${USER_EMAIL} (ID: ${USER_ID})`)
  
  await createTables()
  await enableRLS()
  await createPolicies()
  await addAdmin()
  
  console.log('\n✅ Setup complete!')
  console.log('🎉 You can now access the admin panel at /admin')
}

main().catch(console.error)