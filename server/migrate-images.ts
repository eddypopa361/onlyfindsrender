/**
 * Script to migrate all local images to Supabase Storage and update database records
 */

import { supabaseStorage } from './supabase-storage'
import { fixedSupabaseStorage } from './storage-supabase-fixed'
import * as path from 'path'

interface ImageMigrationResult {
  totalImages: number
  migratedCount: number
  failedCount: number
  updatedProducts: number
  errors: string[]
}

/**
 * Map local image paths to their corresponding Supabase Storage URLs
 */
async function migrateImagesAndUpdateDatabase(): Promise<ImageMigrationResult> {
  const result: ImageMigrationResult = {
    totalImages: 0,
    migratedCount: 0,
    failedCount: 0,
    updatedProducts: 0,
    errors: []
  }

  try {
    console.log('🚀 Starting image migration to Supabase Storage...')
    
    // Step 1: Migrate local images to Supabase Storage
    const migrationResult = await supabaseStorage.migrateLocalImages()
    result.totalImages = migrationResult.migrated.length + migrationResult.failed.length
    result.migratedCount = migrationResult.migrated.length
    result.failedCount = migrationResult.failed.length
    result.errors.push(...migrationResult.failed)
    
    if (result.failedCount > 0) {
      console.log(`⚠️  ${result.failedCount} images failed to migrate`)
      migrationResult.failed.forEach(error => console.log(`   ${error}`))
    }
    
    // Step 2: Create mapping of local paths to Supabase URLs
    const urlMapping: Record<string, string> = {}
    
    for (const migration of migrationResult.migrated) {
      const [localPath, supabaseUrl] = migration.split(' -> ')
      const filename = path.basename(localPath)
      urlMapping[`/uploads/${filename}`] = supabaseUrl
    }
    
    console.log(`📝 Created mapping for ${Object.keys(urlMapping).length} images`)
    
    // Step 3: Update all products with new Supabase Storage URLs
    if (fixedSupabaseStorage && Object.keys(urlMapping).length > 0) {
      console.log('🔄 Updating product records with new image URLs...')
      
      // Get all products that have local image paths
      const allProductsResult = await fixedSupabaseStorage.getProducts(1, 10000) // Get all products
      const productsToUpdate = allProductsResult.products.filter(product => 
        product.image && product.image.startsWith('/uploads/')
      )
      
      console.log(`📊 Found ${productsToUpdate.length} products with local image paths`)
      
      for (const product of productsToUpdate) {
        try {
          if (product.image && urlMapping[product.image]) {
            await fixedSupabaseStorage.updateProduct(product.id, {
              image: urlMapping[product.image]
            })
            result.updatedProducts++
            console.log(`✅ Updated product "${product.title}" image URL`)
          }
        } catch (error) {
          result.errors.push(`Failed to update product ${product.id}: ${error}`)
          console.log(`❌ Failed to update product "${product.title}": ${error}`)
        }
      }
      
      console.log(`🎉 Updated ${result.updatedProducts} product records`)
    }
    
    // Step 4: Summary
    console.log('\n📊 MIGRATION SUMMARY:')
    console.log(`   Total images processed: ${result.totalImages}`)
    console.log(`   Successfully migrated: ${result.migratedCount}`)
    console.log(`   Migration failures: ${result.failedCount}`)
    console.log(`   Product records updated: ${result.updatedProducts}`)
    console.log(`   Errors encountered: ${result.errors.length}`)
    
    if (result.errors.length > 0) {
      console.log('\n❌ ERRORS:')
      result.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`)
      })
    }
    
    return result
    
  } catch (error) {
    console.error('💥 Critical error during migration:', error)
    result.errors.push(`Critical error: ${error}`)
    throw error
  }
}

// Run migration if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateImagesAndUpdateDatabase()
    .then((result) => {
      console.log('✅ Migration completed successfully!')
      process.exit(result.errors.length > 0 ? 1 : 0)
    })
    .catch((error) => {
      console.error('❌ Migration failed:', error)
      process.exit(1)
    })
}

export { migrateImagesAndUpdateDatabase }