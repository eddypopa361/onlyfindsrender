/**
 * Supabase Storage service for handling image uploads to Supabase Cloud Storage
 */

import { supabase } from './supabase'
import * as fs from 'fs'
import * as path from 'path'

const BUCKET_NAME = 'product-images'

export class SupabaseStorageService {
  
  /**
   * Initialize the storage bucket (create if doesn't exist)
   */
  async initializeBucket() {
    if (!supabase) throw new Error('Supabase not configured')
    
    try {
      // Check if bucket exists
      const { data: buckets, error: listError } = await supabase.storage.listBuckets()
      
      if (listError) {
        throw listError
      }
      
      const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME)
      
      if (!bucketExists) {
        // Create bucket with public access
        const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
          public: true,
          allowedMimeTypes: ['image/*'],
          fileSizeLimit: 10485760 // 10MB limit
        })
        
        if (createError) {
          throw createError
        }
        
        console.log(`✅ Created Supabase Storage bucket: ${BUCKET_NAME}`)
      } else {
        console.log(`✅ Supabase Storage bucket already exists: ${BUCKET_NAME}`)
      }
      
      return true
    } catch (error) {
      console.error('Error initializing Supabase Storage bucket:', error)
      throw error
    }
  }
  
  /**
   * Upload an image file to Supabase Storage
   */
  async uploadImage(file: Buffer, filename: string): Promise<string> {
    if (!supabase) throw new Error('Supabase not configured')
    
    try {
      // Detect MIME type from filename extension
      const ext = path.extname(filename).toLowerCase()
      const mimeTypes: Record<string, string> = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg', 
        '.png': 'image/png',
        '.webp': 'image/webp',
        '.gif': 'image/gif'
      }
      const contentType = mimeTypes[ext] || 'image/jpeg'

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filename, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: contentType
        })
      
      if (error) {
        throw error
      }
      
      // Get the public URL for the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filename)
      
      return publicUrlData.publicUrl
    } catch (error) {
      console.error('Error uploading image to Supabase Storage:', error)
      throw error
    }
  }
  
  /**
   * Upload a local file to Supabase Storage
   */
  async uploadLocalFile(localPath: string, storageFilename: string): Promise<string> {
    try {
      const fileBuffer = fs.readFileSync(localPath)
      return await this.uploadImage(fileBuffer, storageFilename)
    } catch (error) {
      console.error(`Error uploading local file ${localPath}:`, error)
      throw error
    }
  }
  
  /**
   * Generate a unique filename for storage
   */
  generateFilename(originalName: string): string {
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const extension = path.extname(originalName)
    return `${timestamp}_${randomStr}${extension}`
  }
  
  /**
   * Delete an image from Supabase Storage
   */
  async deleteImage(filename: string): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured')
    
    try {
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([filename])
      
      if (error) {
        throw error
      }
    } catch (error) {
      console.error(`Error deleting image ${filename}:`, error)
      throw error
    }
  }
  
  /**
   * Get all existing local images that need to be migrated
   */
  getLocalImages(): string[] {
    const uploadsDir = path.join(process.cwd(), '..', 'uploads')
    if (!fs.existsSync(uploadsDir)) {
      return []
    }
    
    const allFiles = fs.readdirSync(uploadsDir)
    return allFiles
      .filter(file => {
        const fileName = file.toLowerCase()
        // Include all image files, including compound extensions like .jpg.webp
        return fileName.includes('.jpg') || fileName.includes('.jpeg') || 
               fileName.includes('.png') || fileName.includes('.webp') || 
               fileName.includes('.gif') || fileName.endsWith('.jpg') ||
               fileName.endsWith('.jpeg') || fileName.endsWith('.png') ||
               fileName.endsWith('.webp') || fileName.endsWith('.gif')
      })
      .map(file => path.join(uploadsDir, file))
  }
  
  /**
   * Migrate all local images to Supabase Storage
   */
  async migrateLocalImages(): Promise<{migrated: string[], failed: string[]}> {
    const localImages = this.getLocalImages()
    const migrated: string[] = []
    const failed: string[] = []
    
    console.log(`📦 Starting migration of ${localImages.length} local images to Supabase Storage...`)
    
    for (const localPath of localImages) {
      try {
        const filename = path.basename(localPath)
        const publicUrl = await this.uploadLocalFile(localPath, filename)
        migrated.push(`${localPath} -> ${publicUrl}`)
        console.log(`✅ Migrated: ${filename}`)
      } catch (error) {
        failed.push(`${localPath}: ${error}`)
        console.log(`❌ Failed: ${path.basename(localPath)} - ${error}`)
      }
    }
    
    console.log(`🎉 Migration complete! Migrated: ${migrated.length}, Failed: ${failed.length}`)
    
    return { migrated, failed }
  }
}

export const supabaseStorage = new SupabaseStorageService()