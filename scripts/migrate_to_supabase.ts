#!/usr/bin/env tsx

/**
 * Migration script: Old DB → Supabase
 * 
 * Usage:
 * 1. Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE are set
 * 2. Set DATABASE_URL for the old database
 * 3. Run: npm run migrate:supabase
 */

import { createClient } from '@supabase/supabase-js'
import { Client } from 'pg'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

interface OldProduct {
  id: number
  title: string
  price: string
  priceUSD?: number
  image: string
  buyUrl: string
  viewUrl?: string
  category: string
  subCategory?: string
  brand?: string
  featured?: boolean
  carousel?: boolean
}

interface NewProduct {
  id: string
  title: string
  priceUSD: number | null
  image: string | null
  buyUrl: string | null
  viewUrl: string | null
  category: string | null
  subCategory: string | null
  brand: string | null
  featured: boolean
  carousel: boolean
}

async function migrateToSupabase() {
  console.log('🚀 Starting migration to Supabase...')

  // Validate environment variables
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_KEY
  const oldDbUrl = process.env.DATABASE_URL

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables:')
    console.error('   SUPABASE_URL:', supabaseUrl ? '✓' : '❌ Missing')
    console.error('   SUPABASE_SERVICE_ROLE:', supabaseServiceKey ? '✓' : '❌ Missing')
    process.exit(1)
  }

  if (!oldDbUrl) {
    console.error('❌ Missing DATABASE_URL for old database')
    process.exit(1)
  }

  // Initialize clients
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const oldDbClient = new Client({ connectionString: oldDbUrl })

  try {
    // Connect to old database
    console.log('📡 Connecting to old database...')
    await oldDbClient.connect()

    // Fetch all products from old database
    console.log('📥 Fetching products from old database...')
    const oldProductsResult = await oldDbClient.query('SELECT * FROM products ORDER BY id')
    const oldProducts: OldProduct[] = oldProductsResult.rows

    console.log(`📊 Found ${oldProducts.length} products to migrate`)

    if (oldProducts.length === 0) {
      console.log('ℹ️ No products found in old database')
      return
    }

    // Transform products for Supabase
    const newProducts: NewProduct[] = oldProducts.map(product => {
      // Generate stable UUID from old ID
      const uuid = generateStableUUID(product.id)
      
      return {
        id: uuid,
        title: product.title,
        priceUSD: parseFloat(product.priceUSD?.toString() || product.price || '0') || null,
        image: product.image || null,
        buyUrl: product.buyUrl || null,
        viewUrl: product.viewUrl || product.buyUrl || null,
        category: product.category || null,
        subCategory: product.subCategory || null,
        brand: product.brand || null,
        featured: product.featured || false,
        carousel: product.carousel || false
      }
    })

    // Check if products already exist in Supabase
    console.log('🔍 Checking existing products in Supabase...')
    const { data: existingProducts, error: selectError } = await supabase
      .from('products')
      .select('id')
    
    if (selectError) {
      console.error('❌ Error checking existing products:', selectError)
      throw selectError
    }

    const existingIds = new Set(existingProducts?.map(p => p.id) || [])
    const productsToInsert = newProducts.filter(p => !existingIds.has(p.id))

    console.log(`📦 Products already in Supabase: ${existingIds.size}`)
    console.log(`📥 Products to insert: ${productsToInsert.length}`)

    if (productsToInsert.length === 0) {
      console.log('✅ All products already migrated!')
      return
    }

    // Batch insert products to Supabase (in chunks of 100)
    const BATCH_SIZE = 100
    let inserted = 0
    
    for (let i = 0; i < productsToInsert.length; i += BATCH_SIZE) {
      const batch = productsToInsert.slice(i, i + BATCH_SIZE)
      
      console.log(`📤 Inserting batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(productsToInsert.length / BATCH_SIZE)} (${batch.length} products)`)
      
      const { data, error } = await supabase
        .from('products')
        .insert(batch)
        .select('id')

      if (error) {
        console.error('❌ Error inserting batch:', error)
        throw error
      }

      inserted += data?.length || 0
      console.log(`✅ Inserted ${data?.length || 0} products`)
    }

    console.log(`🎉 Migration completed successfully!`)
    console.log(`📊 Total products migrated: ${inserted}`)
    
    // Verify the migration
    const { count, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })

    if (!countError) {
      console.log(`✅ Verification: Supabase now contains ${count} products`)
    }

  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    await oldDbClient.end()
  }
}

// Generate a stable UUID from an integer ID
function generateStableUUID(id: number): string {
  // Create a stable UUID v4-like format from the integer ID
  const hex = id.toString(16).padStart(8, '0')
  return [
    hex.slice(0, 8),
    '0000', // version 4 UUID format
    '4' + hex.slice(1, 4), // version 4 indicator
    '8' + hex.slice(4, 7), // variant bits
    hex.padEnd(12, '0').slice(0, 12)
  ].join('-')
}

// Run migration if called directly
if (require.main === module) {
  migrateToSupabase()
    .then(() => {
      console.log('🏁 Migration script completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Migration script failed:', error)
      process.exit(1)
    })
}

export { migrateToSupabase }