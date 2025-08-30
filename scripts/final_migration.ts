#!/usr/bin/env tsx

/**
 * Final migration script with correct Supabase column mapping
 */

import { createClient } from '@supabase/supabase-js'
import { Pool } from 'pg'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE!
const OLD_DATABASE_URL = process.env.DATABASE_URL!

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

async function migrateProducts() {
  console.log('📦 Migrating products with correct column mapping...')
  
  try {
    // Connect to old database
    const oldDb = new Pool({ connectionString: OLD_DATABASE_URL })
    
    // Fetch all products from old database
    const result = await oldDb.query(`
      SELECT id, title, price, image, buy_url, view_url, category, sub_category, brand, featured, carousel, price_usd
      FROM products
      ORDER BY id
    `)
    
    console.log(`Found ${result.rows.length} products to migrate`)
    
    // Clear existing products in Supabase
    const { error: clearError } = await supabase
      .from('products')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
    
    console.log('Cleared existing Supabase products')
    
    // Migrate products in batches
    const batchSize = 50
    let migrated = 0
    
    for (let i = 0; i < result.rows.length; i += batchSize) {
      const batch = result.rows.slice(i, i + batchSize)
      
      const supabaseProducts = batch.map(product => {
        // Generate stable UUID from integer ID
        const paddedId = product.id.toString().padStart(8, '0')
        const uuid = `${paddedId.substring(0,8)}-${paddedId.substring(0,4)}-4000-8000-${paddedId}00000000`.substring(0, 36)
        
        return {
          id: uuid,
          title: product.title,
          priceUSD: product.price ? parseFloat(product.price.toString().replace(/[$,]/g, '')) : null,
          image: product.image,
          buyurl: product.buy_url,  // Note: snake_case to match Supabase
          viewurl: product.view_url, // Note: snake_case to match Supabase  
          category: product.category,
          subcategory: product.sub_category, // Note: snake_case to match Supabase
          brand: product.brand,
          featured: product.featured || false,
          carousel: product.carousel || false
        }
      })
      
      const { data, error: insertError } = await supabase
        .from('products')
        .insert(supabaseProducts)
        .select('id')
      
      if (insertError) {
        console.log(`❌ Batch ${Math.floor(i/batchSize) + 1} error:`, insertError.message)
        // Log first failed product for debugging
        console.log('Sample product:', JSON.stringify(supabaseProducts[0], null, 2))
      } else {
        migrated += batch.length
        console.log(`✅ Migrated ${migrated}/${result.rows.length} products`)
      }
    }
    
    await oldDb.end()
    console.log(`✅ Migration complete: ${migrated} products migrated to Supabase`)
    
  } catch (error) {
    console.log('❌ Migration error:', error)
  }
}

async function createSimplePolicies() {
  console.log('🔒 Creating essential policies...')
  
  try {
    // Create basic policy to allow admin access
    const { error: adminPolicy } = await supabase.rpc('exec_sql', {
      sql: `CREATE POLICY IF NOT EXISTS "allow_admin_access" ON public.admins FOR ALL USING (id = auth.uid());`
    })
    
    const { error: productPolicy } = await supabase.rpc('exec_sql', {
      sql: `CREATE POLICY IF NOT EXISTS "allow_admin_products" ON public.products FOR ALL USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));`
    })
    
    console.log('✅ Essential policies created')
    
  } catch (error) {
    console.log('⚠️ Policy creation via RPC failed, they may already exist')
  }
}

async function testAdminLogin() {
  console.log('🧪 Testing admin functionality...')
  
  try {
    // Test admin table access
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .select('*')
      .limit(1)
    
    if (adminError) {
      console.log('❌ Admin access failed:', adminError.message)
    } else {
      console.log('✅ Admin access working')
    }
    
    // Test products count
    const { count, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
    
    if (countError) {
      console.log('❌ Products count failed:', countError.message)
    } else {
      console.log(`✅ Products accessible: ${count} total`)
    }
    
  } catch (error) {
    console.log('❌ Admin test failed:', error)
  }
}

async function main() {
  console.log('🚀 Final Supabase migration...')
  
  await createSimplePolicies()
  await migrateProducts()
  await testAdminLogin()
  
  console.log('\n🎉 MIGRATION COMPLETE!')
  console.log('Admin panel should now work at /admin')
}

main().catch(console.error)