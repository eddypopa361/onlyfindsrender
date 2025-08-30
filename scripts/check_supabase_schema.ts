#!/usr/bin/env tsx

/**
 * Check Supabase table schema and fix the migration
 */

import { createClient } from '@supabase/supabase-js'
import { Pool } from 'pg'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE!
const OLD_DATABASE_URL = process.env.DATABASE_URL!

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

async function checkSupabaseSchema() {
  console.log('🔍 Checking Supabase table schema...')
  
  try {
    // Try to insert a test record to see what columns exist
    const testProduct = {
      title: 'Test Product',
      priceUSD: 10.99,
      image: 'test.jpg',
      buyUrl: 'https://test.com',
      viewUrl: 'https://test.com/view',
      category: 'Test',
      subCategory: 'Test',
      brand: 'Test Brand',
      featured: false,
      carousel: false
    }
    
    const { data, error } = await supabase
      .from('products')
      .insert(testProduct)
      .select('*')
    
    if (error) {
      console.log('❌ Column error:', error.message)
      
      // Try with snake_case
      const snakeCaseProduct = {
        title: 'Test Product 2',
        priceusd: 10.99,
        image: 'test.jpg',
        buyurl: 'https://test.com',
        viewurl: 'https://test.com/view',
        category: 'Test',
        subcategory: 'Test',
        brand: 'Test Brand',
        featured: false,
        carousel: false
      }
      
      const { data: data2, error: error2 } = await supabase
        .from('products')
        .insert(snakeCaseProduct)
        .select('*')
      
      if (error2) {
        console.log('❌ Snake case error:', error2.message)
      } else {
        console.log('✅ Snake case works! Schema:')
        console.log(Object.keys(data2[0]))
      }
      
    } else {
      console.log('✅ CamelCase works! Schema:')
      console.log(Object.keys(data[0]))
    }
    
  } catch (error) {
    console.log('❌ Schema check failed:', error)
  }
}

async function migrateWithCorrectSchema() {
  console.log('📦 Migrating with correct schema...')
  
  try {
    const oldDb = new Pool({ connectionString: OLD_DATABASE_URL })
    
    // Get a few sample products to test
    const result = await oldDb.query(`
      SELECT id, title, price, image, buy_url, view_url, category, sub_category, brand, featured, carousel
      FROM products
      ORDER BY id
      LIMIT 5
    `)
    
    console.log(`Testing with ${result.rows.length} products`)
    
    for (const product of result.rows) {
      const paddedId = product.id.toString().padStart(8, '0')
      const uuid = `${paddedId.substring(0,8)}-${paddedId.substring(0,4)}-4000-8000-${paddedId}00000000`.substring(0, 36)
      
      // Try different column name combinations
      const combinations = [
        // Try 1: Exact match to Supabase schema
        {
          id: uuid,
          title: product.title,
          priceusd: product.price ? parseFloat(product.price.toString().replace(/[$,]/g, '')) : null,
          image: product.image,
          buyurl: product.buy_url,
          viewurl: product.view_url,
          category: product.category,
          subcategory: product.sub_category,
          brand: product.brand,
          featured: product.featured || false,
          carousel: product.carousel || false
        },
        // Try 2: CamelCase
        {
          id: uuid,
          title: product.title,
          priceUSD: product.price ? parseFloat(product.price.toString().replace(/[$,]/g, '')) : null,
          image: product.image,
          buyUrl: product.buy_url,
          viewUrl: product.view_url,
          category: product.category,
          subCategory: product.sub_category,
          brand: product.brand,
          featured: product.featured || false,
          carousel: product.carousel || false
        }
      ]
      
      for (let i = 0; i < combinations.length; i++) {
        const { data, error } = await supabase
          .from('products')
          .insert(combinations[i])
          .select('id')
        
        if (error) {
          console.log(`❌ Combination ${i + 1} failed:`, error.message)
        } else {
          console.log(`✅ Combination ${i + 1} works! Using this schema.`)
          
          // Now migrate all products with this working schema
          await migrateAllProducts(i)
          return
        }
      }
    }
    
    await oldDb.end()
    
  } catch (error) {
    console.log('❌ Migration test failed:', error)
  }
}

async function migrateAllProducts(schemaIndex: number) {
  console.log(`📦 Migrating all products with schema ${schemaIndex + 1}...`)
  
  try {
    const oldDb = new Pool({ connectionString: OLD_DATABASE_URL })
    
    const result = await oldDb.query(`
      SELECT id, title, price, image, buy_url, view_url, category, sub_category, brand, featured, carousel
      FROM products
      ORDER BY id
    `)
    
    console.log(`Migrating ${result.rows.length} products`)
    
    // Clear existing test products
    await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    
    const batchSize = 100
    let migrated = 0
    
    for (let i = 0; i < result.rows.length; i += batchSize) {
      const batch = result.rows.slice(i, i + batchSize)
      
      const supabaseProducts = batch.map(product => {
        const paddedId = product.id.toString().padStart(8, '0')
        const uuid = `${paddedId.substring(0,8)}-${paddedId.substring(0,4)}-4000-8000-${paddedId}00000000`.substring(0, 36)
        
        if (schemaIndex === 0) {
          // Snake case schema
          return {
            id: uuid,
            title: product.title,
            priceusd: product.price ? parseFloat(product.price.toString().replace(/[$,]/g, '')) : null,
            image: product.image,
            buyurl: product.buy_url,
            viewurl: product.view_url,
            category: product.category,
            subcategory: product.sub_category,
            brand: product.brand,
            featured: product.featured || false,
            carousel: product.carousel || false
          }
        } else {
          // CamelCase schema
          return {
            id: uuid,
            title: product.title,
            priceUSD: product.price ? parseFloat(product.price.toString().replace(/[$,]/g, '')) : null,
            image: product.image,
            buyUrl: product.buy_url,
            viewUrl: product.view_url,
            category: product.category,
            subCategory: product.sub_category,
            brand: product.brand,
            featured: product.featured || false,
            carousel: product.carousel || false
          }
        }
      })
      
      const { error: insertError } = await supabase
        .from('products')
        .insert(supabaseProducts)
      
      if (insertError) {
        console.log(`❌ Batch ${Math.floor(i/batchSize) + 1} error:`, insertError.message)
      } else {
        migrated += batch.length
        console.log(`✅ Migrated ${migrated}/${result.rows.length} products`)
      }
    }
    
    await oldDb.end()
    console.log(`✅ Final migration complete: ${migrated} products`)
    
  } catch (error) {
    console.log('❌ Final migration error:', error)
  }
}

async function main() {
  console.log('🚀 Schema check and migration...')
  
  await checkSupabaseSchema()
  await migrateWithCorrectSchema()
  
  console.log('\n✅ Done!')
}

main().catch(console.error)