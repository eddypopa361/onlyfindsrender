/**
 * Test script for Supabase Storage functionality
 */

import { supabaseStorage } from './supabase-storage'

async function testSupabaseStorage() {
  try {
    console.log('🔧 Testing Supabase Storage connection...')
    
    // Step 1: Initialize bucket
    const result = await supabaseStorage.initializeBucket()
    console.log('✅ Bucket initialization result:', result)
    
    // Step 2: Test uploading a small file
    const testBuffer = Buffer.from('test image data for Supabase Storage')
    const testUrl = await supabaseStorage.uploadImage(testBuffer, 'test-connection.png')
    console.log('✅ Test upload successful, URL:', testUrl)
    
    // Step 3: Check how many local images we have
    const localImages = supabaseStorage.getLocalImages()
    console.log(`📊 Found ${localImages.length} local images to migrate`)
    
    console.log('🎉 Supabase Storage is working correctly!')
    
  } catch (error) {
    console.error('❌ Error during test:', error.message)
    if (error.details) console.error('Details:', error.details)
    if (error.hint) console.error('Hint:', error.hint)
  }
}

testSupabaseStorage()