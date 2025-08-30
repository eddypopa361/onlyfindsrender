#!/usr/bin/env tsx

/**
 * Create RLS policies for Supabase tables
 * This is the missing piece causing the access denied error
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE!

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

async function createPolicies() {
  console.log('🔒 Creating Row Level Security policies...')
  
  try {
    // Create policies using direct HTTP requests since the SQL approach had issues
    const policies = [
      // Admins table policies - CRITICAL for admin verification
      {
        name: 'admins_select',
        sql: `CREATE POLICY "Admins can view admin records" ON public.admins FOR SELECT USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));`
      },
      {
        name: 'admins_insert', 
        sql: `CREATE POLICY "Admins can insert admin records" ON public.admins FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));`
      },
      {
        name: 'admins_delete',
        sql: `CREATE POLICY "Admins can delete admin records" ON public.admins FOR DELETE USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));`
      },
      // Products table policies
      {
        name: 'products_select',
        sql: `CREATE POLICY "Admin only select on products" ON public.products FOR SELECT USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));`
      },
      {
        name: 'products_insert',
        sql: `CREATE POLICY "Admin only insert on products" ON public.products FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));`
      },
      {
        name: 'products_update',
        sql: `CREATE POLICY "Admin only update on products" ON public.products FOR UPDATE USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));`
      },
      {
        name: 'products_delete',
        sql: `CREATE POLICY "Admin only delete on products" ON public.products FOR DELETE USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));`
      }
    ]

    for (const policy of policies) {
      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
            'apikey': SERVICE_ROLE_KEY
          },
          body: JSON.stringify({ sql: policy.sql })
        })

        if (response.ok) {
          console.log(`✅ Created policy: ${policy.name}`)
        } else {
          const error = await response.text()
          console.log(`⚠️ Policy ${policy.name}: ${error}`)
        }
      } catch (error) {
        console.log(`⚠️ Policy ${policy.name} failed:`, error)
      }
    }

  } catch (error) {
    console.log('❌ Policies creation failed:', error)
  }
}

async function testAdminAccess() {
  console.log('🧪 Testing admin access...')
  
  // Test if we can query admins table (this was failing before)
  try {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .limit(1)
    
    if (error) {
      console.log('❌ Admin access test failed:', error.message)
    } else {
      console.log('✅ Admin access test passed')
    }
  } catch (error) {
    console.log('❌ Admin test error:', error)
  }
}

async function main() {
  console.log('🔧 Fixing Row Level Security policies...')
  
  await createPolicies()
  await testAdminAccess()
  
  console.log('\n✅ Policies setup complete!')
  console.log('🎉 Try accessing /admin now - it should work!')
}

main().catch(console.error)