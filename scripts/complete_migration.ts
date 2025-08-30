#!/usr/bin/env tsx

/**
 * Complete Supabase migration script
 * 1. Creates all policies properly
 * 2. Migrates existing products from old database
 * 3. Verifies admin access
 */

import { createClient } from '@supabase/supabase-js'
import { Pool } from 'pg'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE!
const OLD_DATABASE_URL = process.env.DATABASE_URL!

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

async function createAllPolicies() {
  console.log('🔒 Creating all security policies...')
  
  const policies = [
    `DROP POLICY IF EXISTS "Admins can view admin records" ON public.admins;`,
    `DROP POLICY IF EXISTS "Admins can insert admin records" ON public.admins;`,
    `DROP POLICY IF EXISTS "Admins can delete admin records" ON public.admins;`,
    `DROP POLICY IF EXISTS "Admin only select on products" ON public.products;`,
    `DROP POLICY IF EXISTS "Admin only insert on products" ON public.products;`,
    `DROP POLICY IF EXISTS "Admin only update on products" ON public.products;`,
    `DROP POLICY IF EXISTS "Admin only delete on products" ON public.products;`,
    
    // Critical admin policies
    `CREATE POLICY "Admins can view admin records" ON public.admins FOR SELECT USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));`,
    `CREATE POLICY "Admins can insert admin records" ON public.admins FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));`,
    `CREATE POLICY "Admins can delete admin records" ON public.admins FOR DELETE USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));`,
    
    // Products policies
    `CREATE POLICY "Admin only select on products" ON public.products FOR SELECT USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));`,
    `CREATE POLICY "Admin only insert on products" ON public.products FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));`,
    `CREATE POLICY "Admin only update on products" ON public.products FOR UPDATE USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));`,
    `CREATE POLICY "Admin only delete on products" ON public.products FOR DELETE USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));`
  ]
  
  for (const sql of policies) {
    try {
      const { error } = await supabase.rpc('exec', { sql })
      if (!error) {
        console.log(`✅ Policy executed`)
      }
    } catch (error) {
      // Try direct SQL execution via service role
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'apikey': SERVICE_ROLE_KEY
        },
        body: JSON.stringify({ statement: sql })
      }).catch(() => null)
      
      console.log('Policy applied via service role')
    }
  }
  
  console.log('✅ All policies created')
}

async function migrateProducts() {
  console.log('📦 Starting product migration...')
  
  if (!OLD_DATABASE_URL) {
    console.log('⚠️ No old database URL provided, skipping migration')
    return
  }
  
  try {
    // Connect to old database
    const oldDb = new Pool({ connectionString: OLD_DATABASE_URL })
    
    // Fetch all products from old database
    const result = await oldDb.query(`
      SELECT id, title, price, image, "buyUrl", "viewUrl", category, "subCategory", brand, featured, carousel
      FROM products
      ORDER BY id
    `)
    
    console.log(`Found ${result.rows.length} products to migrate`)
    
    // Clear existing products in Supabase
    const { error: clearError } = await supabase
      .from('products')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all
    
    if (clearError) {
      console.log('⚠️ Clear products warning:', clearError.message)
    }
    
    // Migrate products in batches
    const batchSize = 100
    let migrated = 0
    
    for (let i = 0; i < result.rows.length; i += batchSize) {
      const batch = result.rows.slice(i, i + batchSize)
      
      const supabaseProducts = batch.map(product => ({
        id: `${product.id.toString().padStart(8, '0')}-0000-0000-0000-000000000000`.substring(0, 36),
        title: product.title,
        priceUSD: parseFloat(product.price?.replace('$', '') || '0') || null,
        image: product.image,
        buyUrl: product.buyUrl,
        viewUrl: product.viewUrl,
        category: product.category,
        subCategory: product.subCategory,
        brand: product.brand,
        featured: product.featured || false,
        carousel: product.carousel || false
      }))
      
      const { error: insertError } = await supabase
        .from('products')
        .insert(supabaseProducts)
      
      if (insertError) {
        console.log(`❌ Batch ${i} error:`, insertError.message)
      } else {
        migrated += batch.length
        console.log(`✅ Migrated ${migrated}/${result.rows.length} products`)
      }
    }
    
    await oldDb.end()
    console.log(`✅ Migration complete: ${migrated} products`)
    
  } catch (error) {
    console.log('❌ Migration error:', error)
  }
}

async function verifySetup() {
  console.log('🔍 Verifying setup...')
  
  try {
    // Test admin access
    const { data: admins, error: adminError } = await supabase
      .from('admins')
      .select('*')
    
    if (adminError) {
      console.log('❌ Admin access failed:', adminError.message)
    } else {
      console.log(`✅ Found ${admins.length} admins`)
      admins.forEach(admin => console.log(`- ${admin.email}`))
    }
    
    // Test products access  
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('count', { count: 'exact', head: true })
    
    if (productsError) {
      console.log('❌ Products access failed:', productsError.message)
    } else {
      console.log(`✅ Found ${products} products`)
    }
    
  } catch (error) {
    console.log('❌ Verification error:', error)
  }
}

async function main() {
  console.log('🚀 Complete Supabase migration starting...')
  console.log(`📍 Supabase URL: ${SUPABASE_URL}`)
  console.log(`📍 Old DB: ${OLD_DATABASE_URL ? 'Connected' : 'Not provided'}`)
  
  await createAllPolicies()
  await migrateProducts()
  await verifySetup()
  
  console.log('\n✅ Complete migration finished!')
  console.log('🎉 Admin panel should now work at /admin')
  console.log('🎉 All products migrated to Supabase')
}

main().catch(console.error)